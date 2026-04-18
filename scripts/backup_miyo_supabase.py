from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib import error, request


PROJECT_URL = "https://dxkfwhlmfhxlbapfuycl.supabase.co"
PROJECT_REF = "dxkfwhlmfhxlbapfuycl"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4a2Z3aGxtZmh4bGJhcGZ1eWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDczNzAsImV4cCI6MjA5MDcyMzM3MH0."
    "UU6A1gRZMvzHClK57wWjVdPSqPNiSwq-cHnrO42oZxM"
)
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKUP_DIR = ROOT_DIR / "backups"
SESSION_CACHE_PATH = BACKUP_DIR / ".backup-session.json"
BROWSER_ROOTS = [
    Path(r"C:\Users\Pichau\AppData\Local\Google\Chrome\User Data"),
    Path(r"C:\Users\Pichau\AppData\Local\Microsoft\Edge\User Data"),
]
TOKEN_KEY_MARKER = f"sb-{PROJECT_REF}-auth-token".encode()


def parse_iso(value: str | None) -> datetime:
    if not value:
        return datetime.min
    return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)


def extract_balanced_json(blob: bytes, start: int) -> dict[str, Any] | None:
    if start == -1:
        return None

    if start >= len(blob) or blob[start] != 0x7B:
        return None

    depth = 0
    in_string = False
    escape_next = False

    for offset in range(start, len(blob)):
        current = blob[offset]
        if in_string:
            if escape_next:
                escape_next = False
            elif current == 0x5C:
                escape_next = True
            elif current == 0x22:
                in_string = False
            continue

        if current == 0x22:
            in_string = True
        elif current == 0x7B:
            depth += 1
        elif current == 0x7D:
            depth -= 1
            if depth == 0:
                raw = blob[start : offset + 1]
                return json.loads(raw.decode("utf-8", "ignore"))

    return None


def extract_session_from_blob(blob: bytes) -> dict[str, Any] | None:
    marker_index = blob.find(TOKEN_KEY_MARKER)
    if marker_index == -1:
        return None

    json_marker = b'{"access_token"'
    start = blob.find(json_marker, marker_index)
    try:
        return extract_balanced_json(blob, start)
    except json.JSONDecodeError:
        return None


def load_cached_session() -> dict[str, Any] | None:
    if not SESSION_CACHE_PATH.exists():
        return None

    try:
        cached = json.loads(SESSION_CACHE_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None

    if not cached.get("refresh_token"):
        return None

    return cached


def save_cached_session(session: dict[str, Any]) -> None:
    SESSION_CACHE_PATH.write_text(
        json.dumps(session, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def find_best_session() -> dict[str, Any]:
    cached = load_cached_session()
    if cached:
        return cached

    sessions: list[dict[str, Any]] = []

    for root in BROWSER_ROOTS:
        if not root.exists():
            continue
        for profile in root.iterdir():
            if not profile.is_dir():
                continue
            if profile.name != "Default" and not profile.name.startswith("Profile") and not profile.name.startswith("Guest"):
                continue
            leveldb = profile / "Local Storage" / "leveldb"
            if not leveldb.exists():
                continue

            for file in leveldb.iterdir():
                if not file.is_file():
                    continue
                try:
                    data = file.read_bytes()
                except OSError:
                    continue
                if TOKEN_KEY_MARKER not in data or b'{"access_token"' not in data:
                    continue

                session = extract_session_from_blob(data)
                if not session or not session.get("refresh_token"):
                    continue

                session["_source_file"] = str(file)
                session["_profile_name"] = profile.name
                sessions.append(session)

    if not sessions:
        raise RuntimeError("Nao encontrei uma sessao do MIYO salva no navegador.")

    sessions.sort(
        key=lambda item: (
            parse_iso(item.get("user", {}).get("last_sign_in_at")),
            item.get("expires_at", 0),
        ),
        reverse=True,
    )
    return sessions[0]


def refresh_access_token(refresh_token: str) -> dict[str, Any]:
    payload = json.dumps({"refresh_token": refresh_token}).encode("utf-8")
    req = request.Request(
        f"{PROJECT_URL}/auth/v1/token?grant_type=refresh_token",
        data=payload,
        headers={
            "apikey": ANON_KEY,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with request.urlopen(req, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_table(access_token: str, table: str) -> list[dict[str, Any]]:
    req = request.Request(
        f"{PROJECT_URL}/rest/v1/{table}?select=*",
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        },
    )
    with request.urlopen(req, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> int:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    session = find_best_session()
    refreshed = refresh_access_token(session["refresh_token"])
    access_token = refreshed["access_token"]
    save_cached_session(
        {
            "refresh_token": refreshed.get("refresh_token") or session["refresh_token"],
            "user": refreshed.get("user") or session.get("user"),
            "saved_at": datetime.now().astimezone().isoformat(),
        }
    )

    payload = {
        "generated_at": datetime.now().astimezone().isoformat(),
        "project_url": PROJECT_URL,
        "email": refreshed.get("user", {}).get("email") or session.get("user", {}).get("email"),
        "source_profile": session.get("_profile_name"),
        "source_file": session.get("_source_file"),
        "pets": fetch_table(access_token, "pets"),
        "appointments": fetch_table(access_token, "appointments"),
    }

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    dated_path = BACKUP_DIR / f"miyo-backup-{timestamp}.json"
    latest_path = BACKUP_DIR / "latest.json"

    content = json.dumps(payload, ensure_ascii=False, indent=2)
    dated_path.write_text(content, encoding="utf-8")
    latest_path.write_text(content, encoding="utf-8")

    print(f"Backup salvo em: {dated_path}")
    print(f"Pets: {len(payload['pets'])}")
    print(f"Agendamentos: {len(payload['appointments'])}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", "ignore")
        print(f"Falha HTTP {exc.code}: {details}")
        raise SystemExit(1)
    except Exception as exc:  # pragma: no cover - recovery path
        print(f"Falha no backup: {exc}")
        raise SystemExit(1)
