@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PYTHON_EXE=C:\Users\Pichau\AppData\Local\Programs\Python\Python313\python.exe"

if exist "%PYTHON_EXE%" (
  "%PYTHON_EXE%" "%SCRIPT_DIR%backup_miyo_supabase.py"
) else (
  python "%SCRIPT_DIR%backup_miyo_supabase.py"
)
