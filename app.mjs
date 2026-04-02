const BOOTSTRAP = window.MIYO_CONFIG || {};
const STORAGE_KEY = "miyo-local-v2";
const CLOUD_KEY = "miyo-cloud-v1";
const CURRENCY = BOOTSTRAP.DEFAULT_CURRENCY || "BRL";
const SYNC_TABLES = ["pets", "appointments"];
const SERVICE_OPTIONS = [
  "Banho",
  "Tosa",
  "Tosa higiênica",
  "Hidratação",
  "Escovação dental",
  "Pintura",
  "Desembolo",
];
const CLUBINHO_RULES = [
  { key: "banho", label: "Banhos do mês", target: 4, service: "Banho" },
  { key: "hidratacao", label: "Hidratação", target: 1, service: "Hidratação" },
  { key: "escovacao", label: "Escovação dental", target: 1, service: "Escovação dental" },
  { key: "tosa_higienica", label: "Tosa higiênica", target: 1, service: "Tosa higiênica" },
];
const STATUS_LABELS = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  realizado: "Realizado",
  cancelado: "Cancelado",
};

const DOM = {
  navItems: [...document.querySelectorAll(".nav-item")],
  panels: [...document.querySelectorAll(".panel")],
  statsGrid: document.querySelector("#statsGrid"),
  todayList: document.querySelector("#upcomingAppointments"),
  upcomingList: document.querySelector("#packageAlerts"),
  petsTableBody: document.querySelector("#petsTableBody"),
  petDetailsPanel: document.querySelector("#petDetailsPanel"),
  clubinhoGrid: document.querySelector("#clubinhoGrid"),
  appointmentsTableBody: document.querySelector("#appointmentsTableBody"),
  sidebarSummary: document.querySelector("#sidebarSummary"),
  storageModeBadge: document.querySelector("#storageModeBadge"),
  authModeBadge: document.querySelector("#authModeBadge"),
  cloudStorageState: document.querySelector("#cloudStorageState"),
  cloudUserState: document.querySelector("#cloudUserState"),
  cloudSummary: document.querySelector("#cloudSummary"),
  cloudStateLabel: document.querySelector("#cloudStateLabel"),
  todayLabel: document.querySelector("#todayLabel"),
  cloudLaunchButton: document.querySelector("#cloudLaunchButton"),
  appointmentForm: document.querySelector("#appointmentForm"),
  appointmentPetId: document.querySelector("#appointmentPetId"),
  appointmentDate: document.querySelector("#appointmentDate"),
  appointmentTime: document.querySelector("#appointmentTime"),
  agendaDateFilter: document.querySelector("#agendaDateFilter"),
  agendaSearchInput: document.querySelector("#agendaSearchInput"),
  agendaRangeLabel: document.querySelector("#agendaRangeLabel"),
  agendaSummaryGrid: document.querySelector("#agendaSummaryGrid"),
  agendaScopeButtons: [...document.querySelectorAll("[data-agenda-scope]")],
  servicePicker: document.querySelector("#servicePicker"),
  petForm: document.querySelector("#petForm"),
  petFormTitle: document.querySelector("#petFormTitle"),
  petFormSubmitButton: document.querySelector("#petFormSubmitButton"),
  petFormCancelButton: document.querySelector("#petFormCancelButton"),
  petRegistrationDate: document.querySelector("#petRegistrationDate"),
  petsSearchInput: document.querySelector("#petsSearchInput"),
  clubinhoSearchInput: document.querySelector("#clubinhoSearchInput"),
  cloudConfigForm: document.querySelector("#cloudConfigForm"),
  supabaseUrlInput: document.querySelector("#supabaseUrlInput"),
  supabaseAnonKeyInput: document.querySelector("#supabaseAnonKeyInput"),
  authForm: document.querySelector("#authForm"),
  authEmailInput: document.querySelector("#authEmailInput"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  signUpButton: document.querySelector("#signUpButton"),
  signOutButton: document.querySelector("#signOutButton"),
  exportDataButton: document.querySelector("#exportDataButton"),
  importDataButton: document.querySelector("#importDataButton"),
  importFileInput: document.querySelector("#importFileInput"),
  resetDemoButton: document.querySelector("#resetDemoButton"),
  syncButton: document.querySelector("#syncButton"),
  installButton: document.querySelector("#installButton"),
  toastStack: document.querySelector("#toastStack"),
};

const state = {
  section: "dashboard",
  data: emptyDb(),
  cloud: loadCloudConfig(),
  supabase: null,
  session: null,
  authSubscription: null,
  deferredInstallPrompt: null,
  selectedPetId: null,
  editingPetId: null,
  agendaScope: "day",
};

function emptyDb() {
  return {
    pets: [],
    appointments: [],
  };
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function monthKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function localDateKeyFromValue(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function weekdayLabel(value) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date(value));
}

function formatDate(value) {
  if (!value) return "—";
  const normalized = value.includes("T") ? value : `${value}T12:00:00`;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(normalized));
}

function formatTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: CURRENCY }).format(Number(value));
}

function combineDateAndTime(date, time) {
  return new Date(`${date}T${time}:00`).toISOString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function blankToNull(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function includesSearch(haystack, term) {
  if (!term) return true;
  return normalizeSearch(haystack).includes(term);
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfWeek(value) {
  const date = startOfDay(value);
  const diff = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - diff);
  return date;
}

function startOfMonth(value) {
  const date = startOfDay(value);
  date.setDate(1);
  return date;
}

function startOfYear(value) {
  const date = startOfDay(value);
  date.setMonth(0, 1);
  return date;
}

function addDays(value, amount) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function addMonths(value, amount) {
  const date = new Date(value);
  date.setMonth(date.getMonth() + amount);
  return date;
}

function addYears(value, amount) {
  const date = new Date(value);
  date.setFullYear(date.getFullYear() + amount);
  return date;
}

function formatMonthYear(value) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(value));
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function agendaRange(anchorValue = DOM.agendaDateFilter?.value || todayKey(), scope = state.agendaScope) {
  const anchor = anchorValue ? new Date(`${anchorValue}T12:00:00`) : new Date();
  let start;
  let end;
  let label;

  if (scope === "week") {
    start = startOfWeek(anchor);
    end = addDays(start, 7);
    label = `Semana de ${formatDate(start.toISOString())} até ${formatDate(addDays(end, -1).toISOString())}.`;
  } else if (scope === "month") {
    start = startOfMonth(anchor);
    end = addMonths(start, 1);
    label = `Mês de ${formatMonthYear(start)}.`;
  } else if (scope === "year") {
    start = startOfYear(anchor);
    end = addYears(start, 1);
    label = `Ano de ${new Date(start).getFullYear()}.`;
  } else {
    start = startOfDay(anchor);
    end = addDays(start, 1);
    label = `Dia ${formatLongDate(start)}.`;
  }

  return { start, end, label };
}

function initials(value) {
  return String(value || "MIYO")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function petAvatarMarkup(pet) {
  return `<span class="pet-avatar placeholder">${escapeHtml(initials(pet?.name))}</span>`;
}

function notify(message, tone = "default") {
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`.trim();
  toast.textContent = message;
  DOM.toastStack.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function emptyState(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function seedDemoData() {
  const now = new Date();
  const petA = uid();
  const petB = uid();
  const todayMorning = new Date();
  todayMorning.setHours(9, 0, 0, 0);
  const todayAfternoon = new Date();
  todayAfternoon.setHours(14, 30, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 30, 0, 0);

  return normalizeDb({
    pets: [
      {
        id: petA,
        name: "Mel",
        tutor_name: "Fernanda Souza",
        tutor_contact: "(11) 99999-8899",
        breed: "Shih-tzu",
        registration_date: todayKey(),
        clubinho_enabled: true,
        notes: "Pele sensível no abdômen.",
        created_at: now.toISOString(),
      },
      {
        id: petB,
        name: "Nino",
        tutor_name: "Ricardo Lima",
        tutor_contact: "(11) 98888-4477",
        breed: "Spitz",
        registration_date: todayKey(),
        clubinho_enabled: false,
        notes: "Ansioso no secador.",
        created_at: now.toISOString(),
      },
    ],
    appointments: [
      {
        id: uid(),
        pet_id: petA,
        appointment_at: todayMorning.toISOString(),
        status: "confirmado",
        service_items: ["Banho", "Hidratação"],
        amount: 95,
        clubinho_slot: "2º banho do mês com hidratação",
        notes: "Atendimento do clubinho.",
        created_at: now.toISOString(),
      },
      {
        id: uid(),
        pet_id: petB,
        appointment_at: todayAfternoon.toISOString(),
        status: "agendado",
        service_items: ["Banho", "Desembolo"],
        amount: 120,
        notes: "Pedir cuidado com nós atrás da orelha.",
        created_at: now.toISOString(),
      },
      {
        id: uid(),
        pet_id: petA,
        appointment_at: tomorrow.toISOString(),
        status: "agendado",
        service_items: ["Banho"],
        amount: 80,
        notes: "",
        created_at: now.toISOString(),
      },
    ],
  });
}

function normalizeDb(raw) {
  const safe = {
    pets: Array.isArray(raw?.pets) ? raw.pets : [],
    appointments: Array.isArray(raw?.appointments) ? raw.appointments : [],
  };
  const legacyTutors = Array.isArray(raw?.tutors) ? raw.tutors : [];
  const legacyServices = Array.isArray(raw?.services) ? raw.services : [];
  const legacyPackages = Array.isArray(raw?.packages) ? raw.packages : [];

  const tutorMap = Object.fromEntries(legacyTutors.map((item) => [item.id, item]));
  const serviceMap = Object.fromEntries(legacyServices.map((item) => [item.id, item]));
  const clubinhoPetIds = new Set(legacyPackages.map((item) => item.pet_id));

  safe.pets = safe.pets.map((pet) => {
    const tutor = tutorMap[pet.tutor_id] || {};
    return {
      ...pet,
      tutor_name: pet.tutor_name || tutor.name || "",
      tutor_contact: pet.tutor_contact || tutor.phone || tutor.email || "",
      registration_date: pet.registration_date || localDateKeyFromValue(pet.created_at || new Date().toISOString()),
      clubinho_enabled: Boolean(pet.clubinho_enabled ?? clubinhoPetIds.has(pet.id)),
      notes: pet.notes || "",
    };
  });

  safe.appointments = safe.appointments.map((appointment) => {
    const migratedServices = Array.isArray(appointment.service_items)
      ? appointment.service_items
      : appointment.service_id && serviceMap[appointment.service_id]?.name
        ? [serviceMap[appointment.service_id].name]
        : [];

    return {
      ...appointment,
      status: appointment.status || "agendado",
      service_items: migratedServices,
      amount: appointment.amount ?? null,
      clubinho_slot: appointment.clubinho_slot || null,
      notes: appointment.notes || "",
    };
  });

  return sortDb(safe);
}

function sortDb(db) {
  const clone = JSON.parse(JSON.stringify(db));
  clone.pets.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  clone.appointments.sort((a, b) => new Date(a.appointment_at) - new Date(b.appointment_at));
  return clone;
}

function readLocalDb() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed) {
      return writeLocalDb(seedDemoData());
    }
    return writeLocalDb(normalizeDb(parsed));
  } catch {
    return writeLocalDb(seedDemoData());
  }
}

function writeLocalDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return sortDb(db);
}

function restoreLocalDemo() {
  state.data = writeLocalDb(seedDemoData());
  state.selectedPetId = state.data.pets[0]?.id || null;
}

function loadCloudConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(CLOUD_KEY) || "{}");
    return {
      supabaseUrl: stored.supabaseUrl || BOOTSTRAP.SUPABASE_URL || "",
      supabaseAnonKey: stored.supabaseAnonKey || BOOTSTRAP.SUPABASE_ANON_KEY || "",
    };
  } catch {
    return {
      supabaseUrl: BOOTSTRAP.SUPABASE_URL || "",
      supabaseAnonKey: BOOTSTRAP.SUPABASE_ANON_KEY || "",
    };
  }
}

function saveCloudConfig(config) {
  state.cloud = config;
  localStorage.setItem(CLOUD_KEY, JSON.stringify(config));
}

function cloudConfigured() {
  return Boolean(state.cloud.supabaseUrl && state.cloud.supabaseAnonKey);
}

function resetCloudRuntime() {
  if (state.authSubscription) {
    state.authSubscription.unsubscribe();
    state.authSubscription = null;
  }
  state.supabase = null;
  state.session = null;
}

async function ensureSupabaseClient() {
  if (!cloudConfigured()) {
    return null;
  }
  resetCloudRuntime();

  const module = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  state.supabase = module.createClient(state.cloud.supabaseUrl, state.cloud.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  const { data } = await state.supabase.auth.getSession();
  state.session = data.session;

  const subscriptionResult = state.supabase.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    await refreshData({ silent: true });
    renderAll();
  });

  state.authSubscription = subscriptionResult.data.subscription;
  return state.supabase;
}

async function fetchRemoteTable(table) {
  let query = state.supabase.from(table).select("*");
  if (table === "appointments") {
    query = query.order("appointment_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function refreshData({ silent = false } = {}) {
  try {
    if (state.supabase && state.session?.user) {
      const remote = {};
      const results = await Promise.all(SYNC_TABLES.map((table) => fetchRemoteTable(table)));
      SYNC_TABLES.forEach((table, index) => {
        remote[table] = results[index];
      });
      state.data = normalizeDb(remote);
    } else {
      state.data = readLocalDb();
    }

    if (!state.selectedPetId || !getPet(state.selectedPetId)) {
      state.selectedPetId = state.data.pets[0]?.id || null;
    }

    if (!silent) {
      notify(state.session?.user ? "Dados sincronizados com a nuvem." : "Dados carregados no modo local.", "success");
    }
  } catch (error) {
    console.error(error);
    state.data = readLocalDb();
    notify("Usei o modo local porque a sincronização não respondeu.", "warning");
  }
}

async function upsertEntity(table, payload) {
  try {
    if (state.supabase && state.session?.user) {
      const { data, error } = await state.supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      await refreshData({ silent: true });
      return data;
    }

    const db = readLocalDb();
    const record = { id: uid(), created_at: new Date().toISOString(), ...payload };
    db[table].push(record);
    state.data = writeLocalDb(db);
    return record;
  } catch (error) {
    console.error(error);
    notify(error.message || "Não foi possível salvar esse registro.", "error");
    return null;
  }
}

async function updateEntity(table, id, patch) {
  try {
    if (state.supabase && state.session?.user) {
      const { error } = await state.supabase.from(table).update(patch).eq("id", id);
      if (error) throw error;
      await refreshData({ silent: true });
      return true;
    }

    const db = readLocalDb();
    db[table] = db[table].map((item) => (item.id === id ? { ...item, ...patch } : item));
    state.data = writeLocalDb(db);
    return true;
  } catch (error) {
    console.error(error);
    notify(error.message || "Não foi possível atualizar esse registro.", "error");
    return false;
  }
}

async function deleteEntity(table, id) {
  try {
    if (state.supabase && state.session?.user) {
      const { error } = await state.supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      await refreshData({ silent: true });
      if (table === "pets" && state.editingPetId === id) {
        resetPetForm();
      }
      return true;
    }

    const db = readLocalDb();
    db[table] = db[table].filter((item) => item.id !== id);
    if (table === "pets") {
      db.appointments = db.appointments.filter((item) => item.pet_id !== id);
    }
    state.data = writeLocalDb(db);
    if (state.selectedPetId === id) {
      state.selectedPetId = state.data.pets[0]?.id || null;
    }
    if (table === "pets" && state.editingPetId === id) {
      resetPetForm();
    }
    return true;
  } catch (error) {
    console.error(error);
    notify(error.message || "Não foi possível excluir esse registro.", "error");
    return false;
  }
}

function getPet(id) {
  return state.data.pets.find((item) => item.id === id) || null;
}

function appointmentsForPet(petId) {
  return state.data.appointments
    .filter((item) => item.pet_id === petId)
    .sort((a, b) => new Date(b.appointment_at) - new Date(a.appointment_at));
}

function isClubinhoPet(pet) {
  return Boolean(pet?.clubinho_enabled);
}

function appointmentsForPeriod(scope = state.agendaScope, anchorValue = DOM.agendaDateFilter?.value || todayKey()) {
  const { start, end } = agendaRange(anchorValue, scope);
  return state.data.appointments.filter((item) => {
    const date = new Date(item.appointment_at);
    return date >= start && date < end;
  });
}

function filteredAppointments() {
  const searchTerm = normalizeSearch(DOM.agendaSearchInput?.value || "");
  return appointmentsForPeriod().filter((item) => {
    const pet = getPet(item.pet_id);
    const terms = [
      pet?.name,
      pet?.tutor_name,
      item.service_items?.join(" "),
      item.notes,
      formatDate(item.appointment_at),
      weekdayLabel(item.appointment_at),
    ].join(" ");
    return includesSearch(terms, searchTerm);
  });
}

function clubinhoAppointmentsInMonth(petId, referenceDate = new Date()) {
  return state.data.appointments.filter((item) => {
    if (item.pet_id !== petId) return false;
    return monthKey(item.appointment_at) === monthKey(referenceDate);
  });
}

function clubinhoProgress(petId, referenceDate = new Date()) {
  const items = clubinhoAppointmentsInMonth(petId, referenceDate);
  const progress = CLUBINHO_RULES.map((rule) => {
    const done = items.filter((item) => item.service_items?.includes(rule.service)).length;
    return {
      ...rule,
      done: Math.min(rule.target, done),
      complete: done >= rule.target,
    };
  });

  return {
    items,
    progress,
    bathDone: progress.find((item) => item.key === "banho")?.done || 0,
  };
}

function clubinhoHeadline(petId) {
  const summary = clubinhoProgress(petId);
  return `${summary.bathDone}/4 banhos realizados neste mês`;
}

function renderClubinhoProgress(petId) {
  const summary = clubinhoProgress(petId);

  return `
    <div class="clubinho-progress">
      <span class="mini-label">Clubinho MIYO do m\u00eas</span>
      <div class="clubinho-progress-grid">
        ${summary.progress.map((item) => {
          const className = ["clubinho-slot", item.complete ? "is-done" : ""]
            .filter(Boolean)
            .join(" ");
          const status = item.target > 1 ? `${item.done}/${item.target} concluídos` : item.complete ? "Concluído" : "Pendente";
          return `
            <article class="${className}">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(status)}</span>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function statusTone(status) {
  if (status === "cancelado") return "danger";
  if (status === "realizado") return "success";
  if (status === "confirmado") return "warning";
  return "";
}

function todayAppointments() {
  return state.data.appointments.filter((item) => localDateKeyFromValue(item.appointment_at) === todayKey());
}

function futureAppointments(limit = 6) {
  const now = new Date();
  return state.data.appointments
    .filter((item) => new Date(item.appointment_at) >= now && item.status !== "cancelado")
    .slice(0, limit);
}

function renderServicePicker(selectedItems = []) {
  DOM.servicePicker.innerHTML = SERVICE_OPTIONS.map((service) => {
    const checked = selectedItems.includes(service) ? "checked" : "";
    return `
      <label class="service-option">
        <input type="checkbox" name="service_items" value="${escapeHtml(service)}" ${checked}>
        <span>${escapeHtml(service)}</span>
      </label>
    `;
  }).join("");
}

function selectedServiceItems() {
  return [...DOM.servicePicker.querySelectorAll('input[name="service_items"]:checked')].map((input) => input.value);
}

function refreshPetSelect() {
  const preferredId = DOM.appointmentPetId.value || state.selectedPetId || state.data.pets[0]?.id || "";
  const options = state.data.pets.map(
    (pet) => `<option value="${escapeHtml(pet.id)}">${escapeHtml(pet.name)}</option>`,
  );
  DOM.appointmentPetId.innerHTML = options.length ? options.join("") : `<option value="">Cadastre um pet primeiro</option>`;
  DOM.appointmentPetId.disabled = !options.length;
  if (options.length) {
    DOM.appointmentPetId.value = state.data.pets.some((pet) => pet.id === preferredId)
      ? preferredId
      : state.data.pets[0].id;
  }
}

function filteredPets() {
  const searchTerm = normalizeSearch(DOM.petsSearchInput?.value || "");
  return state.data.pets.filter((pet) => {
    const terms = [pet.name, pet.tutor_name, pet.breed, pet.tutor_contact, pet.notes].join(" ");
    return includesSearch(terms, searchTerm);
  });
}

function filteredClubinhoPets() {
  const searchTerm = normalizeSearch(DOM.clubinhoSearchInput?.value || "");
  return state.data.pets.filter((pet) => {
    if (!pet.clubinho_enabled) return false;
    const terms = [pet.name, pet.tutor_name, pet.breed, pet.tutor_contact, pet.notes].join(" ");
    return includesSearch(terms, searchTerm);
  });
}

function resetPetForm() {
  state.editingPetId = null;
  DOM.petForm.reset();
  DOM.petRegistrationDate.value = todayKey();
  DOM.petFormTitle.textContent = "Novo pet";
  DOM.petFormSubmitButton.textContent = "Salvar pet";
  DOM.petFormCancelButton.hidden = true;
}

function startPetEdit(petId) {
  const pet = getPet(petId);
  if (!pet) return;
  state.editingPetId = pet.id;
  DOM.petForm.elements.name.value = pet.name || "";
  DOM.petForm.elements.tutor_name.value = pet.tutor_name || "";
  DOM.petForm.elements.breed.value = pet.breed || "";
  DOM.petForm.elements.tutor_contact.value = pet.tutor_contact || "";
  DOM.petForm.elements.registration_date.value = pet.registration_date || todayKey();
  DOM.petForm.elements.clubinho_enabled.checked = Boolean(pet.clubinho_enabled);
  DOM.petForm.elements.notes.value = pet.notes || "";
  DOM.petFormTitle.textContent = `Editando ${pet.name}`;
  DOM.petFormSubmitButton.textContent = "Salvar alterações";
  DOM.petFormCancelButton.hidden = false;
  openSection("pets");
  DOM.petForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDashboard() {
  const todayItems = todayAppointments();
  const nextItems = futureAppointments();
  const clubinhoCount = state.data.pets.filter((pet) => pet.clubinho_enabled).length;

  DOM.statsGrid.innerHTML = `
    <article class="stat-card">
      <p>Atendimentos de hoje</p>
      <strong>${todayItems.length}</strong>
      <span>Agenda do dia</span>
    </article>
    <article class="stat-card">
      <p>Pets cadastrados</p>
      <strong>${state.data.pets.length}</strong>
      <span>Fichas ativas no MIYO</span>
    </article>
    <article class="stat-card">
      <p>Clubinho MIYO</p>
      <strong>${clubinhoCount}</strong>
      <span>Pets sinalizados com estrela</span>
    </article>
  `;

  DOM.todayList.innerHTML = todayItems.length
    ? todayItems
        .map((item) => {
          const pet = getPet(item.pet_id);
          return `
            <article class="stack-item">
              <strong>${escapeHtml(pet?.name || "Pet removido")}</strong>
              <span class="muted">${escapeHtml(formatDate(item.appointment_at))} • ${escapeHtml(weekdayLabel(item.appointment_at))}</span>
              <span>${escapeHtml(formatTime(item.appointment_at))}</span>
            </article>
          `;
        })
        .join("")
    : emptyState("Nenhum atendimento marcado para hoje.");

  DOM.upcomingList.innerHTML = nextItems.length
    ? nextItems
        .map((item) => {
          const pet = getPet(item.pet_id);
          return `
            <article class="stack-item">
              <strong>${escapeHtml(pet?.name || "Pet removido")}</strong>
              <span class="muted">${escapeHtml(formatDate(item.appointment_at))} • ${escapeHtml(weekdayLabel(item.appointment_at))}</span>
              <span>${escapeHtml(formatTime(item.appointment_at))}</span>
            </article>
          `;
        })
        .join("")
    : emptyState("Nenhum horário futuro cadastrado.");
}

function renderAppointmentsTable() {
  const rows = filteredAppointments();
  const range = agendaRange();
  const confirmed = rows.filter((item) => item.status === "confirmado").length;
  const done = rows.filter((item) => item.status === "realizado").length;
  const clubinhoCount = rows.filter((item) => getPet(item.pet_id)?.clubinho_enabled).length;

  DOM.agendaRangeLabel.textContent = range.label;
  DOM.agendaSummaryGrid.innerHTML = `
    <article class="stat-card">
      <p>Total no período</p>
      <strong>${rows.length}</strong>
      <span>${state.agendaScope === "day" ? "Agenda do dia" : "Agenda filtrada"}</span>
    </article>
    <article class="stat-card">
      <p>Confirmados e concluídos</p>
      <strong>${confirmed + done}</strong>
      <span>${confirmed} confirmados • ${done} concluídos</span>
    </article>
    <article class="stat-card">
      <p>Clubinho MIYO</p>
      <strong>${clubinhoCount}</strong>
      <span>Atendimentos de pets do clubinho</span>
    </article>
  `;

  DOM.appointmentsTableBody.innerHTML = rows.length
    ? rows
        .map((item) => {
          const pet = getPet(item.pet_id);
          const actions = [];
          actions.push(`<button class="action-chip" data-open-pet="${item.pet_id}">Abrir pet</button>`);
          if (item.status === "agendado") {
            actions.push(`<button class="action-chip" data-status-id="${item.id}" data-status-value="confirmado">Confirmar</button>`);
          }
          if (item.status !== "realizado" && item.status !== "cancelado") {
            actions.push(`<button class="action-chip" data-status-id="${item.id}" data-status-value="realizado">Concluir</button>`);
          }
          actions.push(`<button class="action-chip" data-delete-table="appointments" data-delete-id="${item.id}">Excluir</button>`);

          return `
            <tr>
              <td data-label="Data">${escapeHtml(formatDate(item.appointment_at))}</td>
              <td data-label="Dia">${escapeHtml(weekdayLabel(item.appointment_at))}</td>
              <td data-label="Horário">${escapeHtml(formatTime(item.appointment_at))}</td>
              <td data-label="Pet">${escapeHtml(pet?.name || "Pet removido")}</td>
              <td data-label="Status"><span class="tag ${statusTone(item.status)}">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span></td>
              <td data-label="Ações"><div class="action-row">${actions.join("")}</div></td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="6">${emptyState("Nenhum agendamento encontrado para o período e busca atual.")}</td></tr>`;
}

function renderPetsTable() {
  const rows = filteredPets();
  DOM.petsTableBody.innerHTML = rows.length
    ? rows
        .map((item) => {
          return `
            <tr>
              <td data-label="Pet"><div class="pet-identity">${petAvatarMarkup(item)}<span>${escapeHtml(item.name)}</span></div></td>
              <td data-label="Tutor">${escapeHtml(item.tutor_name || "—")}</td>
              <td data-label="Clubinho">${item.clubinho_enabled ? '<span class="tag success">&#9733; Clubinho MIYO</span>' : '<span class="muted">Não</span>'}</td>
              <td data-label="Cadastro">${escapeHtml(formatDate(item.registration_date))}</td>
              <td data-label="Ações">
                <div class="action-row">
                  <button class="action-chip" data-open-pet="${item.id}">Abrir ficha</button>
                  <button class="action-chip" data-edit-pet="${item.id}">Editar</button>
                  <button class="action-chip" data-delete-table="pets" data-delete-id="${item.id}">Excluir</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="5">${emptyState("Nenhum pet encontrado com essa busca.")}</td></tr>`;
}

function renderPetDetails() {
  const pet = getPet(state.selectedPetId);
  if (!pet) {
    DOM.petDetailsPanel.innerHTML = emptyState("Abra um pet para ver a ficha completa e o histórico de atendimentos.");
    return;
  }

  const history = appointmentsForPet(pet.id);
  const clubinhoText = pet.clubinho_enabled ? clubinhoHeadline(pet.id) : "Não participa do clubinho";

  DOM.petDetailsPanel.innerHTML = `
    <div class="pet-profile-card">
      <div class="pet-profile-head">
        ${petAvatarMarkup(pet)}
        <div>
          <h4>${escapeHtml(pet.name)}</h4>
          <p>${escapeHtml(pet.breed || "Raça não informada")}</p>
          ${pet.clubinho_enabled ? '<span class="tag success">&#9733; Clubinho MIYO</span>' : '<span class="tag">Pet avulso</span>'}
        </div>
      </div>
      <div class="action-row">
        <button class="action-chip" data-edit-pet="${pet.id}">Editar ficha</button>
      </div>
      <div class="pet-profile-grid">
        <div>
          <span class="mini-label">Tutor</span>
          <strong>${escapeHtml(pet.tutor_name || "—")}</strong>
        </div>
        <div>
          <span class="mini-label">Contato</span>
          <strong>${escapeHtml(pet.tutor_contact || "—")}</strong>
        </div>
        <div>
          <span class="mini-label">Cadastro</span>
          <strong>${escapeHtml(formatDate(pet.registration_date))}</strong>
        </div>
        <div>
          <span class="mini-label">Situação do Clubinho</span>
          <strong>${escapeHtml(clubinhoText)}</strong>
        </div>
      </div>
      ${pet.clubinho_enabled ? renderClubinhoProgress(pet.id) : ""}
      ${pet.notes ? `<p class="helper-text">${escapeHtml(pet.notes)}</p>` : ""}
    </div>
    <div class="pet-history-block">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Histórico</p>
          <h3>Atendimentos de ${escapeHtml(pet.name)}</h3>
        </div>
      </div>
      ${
        history.length
          ? history.map((item) => `
              <article class="history-item">
                <div class="history-main">
                  <strong>${escapeHtml(formatDateTime(item.appointment_at))}</strong>
                  <span>${escapeHtml(item.service_items.join(", ") || "Sem serviço marcado")}</span>
                </div>
                <div class="history-side">
                  <span>${escapeHtml(formatMoney(item.amount))}</span>
                  ${pet.clubinho_enabled ? '<span class="tag success">Clubinho MIYO</span>' : ""}
                </div>
                ${item.notes ? `<p class="muted">${escapeHtml(item.notes)}</p>` : ""}
              </article>
            `).join("")
          : emptyState("Ainda não há atendimentos cadastrados para este pet.")
      }
    </div>
  `;
}

function renderClubinhoBoard() {
  const pets = filteredClubinhoPets();

  DOM.clubinhoGrid.innerHTML = pets.length
    ? pets
        .map((pet) => {
          const summary = clubinhoProgress(pet.id);
          return `
            <article class="clubinho-card">
              <div class="clubinho-card-head">
                <div class="pet-identity">
                  ${petAvatarMarkup(pet)}
                  <div class="clubinho-card-meta">
                    <h3>${escapeHtml(pet.name)}</h3>
                    <p>${escapeHtml(pet.tutor_name || "Tutor não informado")}</p>
                  </div>
                </div>
                <button class="action-chip" data-open-pet="${pet.id}">Abrir ficha</button>
              </div>
              <div class="clubinho-mini-grid">
                <div class="clubinho-mini-stat">
                  <span class="mini-label">Banhos</span>
                  <strong>${summary.bathDone}/4</strong>
                </div>
                <div class="clubinho-mini-stat">
                  <span class="mini-label">Cadastro</span>
                  <strong>${escapeHtml(formatDate(pet.registration_date))}</strong>
                </div>
              </div>
              ${renderClubinhoProgress(pet.id)}
            </article>
          `;
        })
        .join("")
    : emptyState("Nenhum pet do Clubinho MIYO encontrado com essa busca.");
}

function renderCloudState() {
  const cloudReady = cloudConfigured();
  const logged = Boolean(state.session?.user);
  const storageLabel = logged ? "Nuvem sincronizada" : cloudReady ? "Supabase pronto" : "Local no navegador";
  const authLabel = logged ? state.session.user.email || "Conta conectada" : "Sem login";

  DOM.storageModeBadge.textContent = storageLabel;
  DOM.authModeBadge.textContent = authLabel;
  DOM.cloudStorageState.textContent = storageLabel;
  DOM.cloudUserState.textContent = authLabel;
  DOM.cloudStateLabel.textContent = logged ? "Sincronização ativa" : cloudReady ? "Faça login para sincronizar" : "Sem sincronização";
  DOM.cloudSummary.textContent = logged
    ? "Seus dados já estão sendo sincronizados entre os dispositivos em que você entrar com esta conta."
    : cloudReady
      ? "A conexão com o Supabase está pronta. Faça login para começar a sincronização."
      : "Você já pode usar o MIYO no modo local. Para sincronizar, configure o Supabase e faça login.";
  DOM.sidebarSummary.textContent = `${state.data.pets.length} pets cadastrados, ${state.data.pets.filter((pet) => pet.clubinho_enabled).length} no Clubinho MIYO e ${state.data.appointments.length} atendimentos no histórico.`;
  DOM.signOutButton.hidden = !logged;
  DOM.todayLabel.textContent = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date());
  DOM.supabaseUrlInput.value = state.cloud.supabaseUrl || "";
  DOM.supabaseAnonKeyInput.value = state.cloud.supabaseAnonKey || "";
}

function renderAll() {
  refreshPetSelect();
  renderDashboard();
  renderAppointmentsTable();
  renderPetsTable();
  renderPetDetails();
  renderClubinhoBoard();
  renderCloudState();
}

function openSection(section) {
  state.section = section;
  DOM.navItems.forEach((button) => button.classList.toggle("is-active", button.dataset.section === section));
  DOM.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === section));
}

async function handlePetSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = {
    name: formData.get("name").toString().trim(),
    tutor_name: formData.get("tutor_name").toString().trim(),
    tutor_contact: blankToNull(formData.get("tutor_contact")),
    breed: blankToNull(formData.get("breed")),
    registration_date: formData.get("registration_date").toString(),
    clubinho_enabled: formData.get("clubinho_enabled") === "on",
    notes: blankToNull(formData.get("notes")),
  };

  if (state.editingPetId) {
    const updated = await updateEntity("pets", state.editingPetId, payload);
    if (!updated) return;
    state.selectedPetId = state.editingPetId;
    resetPetForm();
    renderAll();
    notify("Ficha do pet atualizada com sucesso.", "success");
    return;
  }

  const saved = await upsertEntity("pets", payload);
  if (!saved) return;
  resetPetForm();
  state.selectedPetId = saved.id;
  renderAll();
  notify("Pet salvo com sucesso.", "success");
}

async function handleAppointmentSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const pet = getPet(formData.get("pet_id").toString());
  const services = selectedServiceItems();

  if (!pet) {
    notify("Selecione um pet válido.", "warning");
    return;
  }
  if (!services.length) {
    notify("Selecione pelo menos um serviço realizado.", "warning");
    return;
  }

  const saved = await upsertEntity("appointments", {
    pet_id: pet.id,
    appointment_at: combineDateAndTime(
      formData.get("appointment_date").toString(),
      formData.get("appointment_time").toString(),
    ),
    status: "agendado",
    service_items: services,
    amount: blankToNull(formData.get("amount")),
    clubinho_slot: null,
    notes: blankToNull(formData.get("notes")),
  });
  if (!saved) return;
  event.currentTarget.reset();
  DOM.appointmentDate.value = todayKey();
  DOM.appointmentTime.value = "09:00";
  renderServicePicker();
  state.selectedPetId = pet.id;
  renderAll();
  notify("Agendamento salvo com sucesso.", "success");
}

async function handleSaveCloudConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  saveCloudConfig({
    supabaseUrl: formData.get("supabase_url").toString().trim(),
    supabaseAnonKey: formData.get("supabase_anon_key").toString().trim(),
  });

  if (!cloudConfigured()) {
    resetCloudRuntime();
    await refreshData({ silent: true });
    renderAll();
    notify("Configuração limpa. O app voltou ao modo local.", "warning");
    return;
  }

  try {
    await ensureSupabaseClient();
    await refreshData({ silent: true });
    renderAll();
    notify("Supabase conectado. Agora faça login para sincronizar.", "success");
  } catch (error) {
    console.error(error);
    resetCloudRuntime();
    await refreshData({ silent: true });
    renderAll();
    notify("Não consegui conectar ao Supabase. Revise URL, chave e schema.", "error");
  }
}

async function handleSignIn(event) {
  event.preventDefault();
  if (!state.supabase) {
    notify("Configure o Supabase antes de fazer login.", "warning");
    return;
  }
  const formData = new FormData(event.currentTarget);
  const { error } = await state.supabase.auth.signInWithPassword({
    email: formData.get("email").toString().trim(),
    password: formData.get("password").toString(),
  });
  if (error) {
    console.error(error);
    notify(error.message || "Não foi possível entrar na conta.", "error");
    return;
  }
  notify("Login realizado com sucesso.", "success");
}

async function handleSignUp() {
  if (!state.supabase) {
    notify("Configure o Supabase antes de criar a conta.", "warning");
    return;
  }
  const email = DOM.authEmailInput.value.trim();
  const password = DOM.authPasswordInput.value;
  if (!email || !password) {
    notify("Preencha e-mail e senha para criar a conta.", "warning");
    return;
  }
  const { error } = await state.supabase.auth.signUp({ email, password });
  if (error) {
    console.error(error);
    notify(error.message || "Não foi possível criar a conta.", "error");
    return;
  }
  notify("Conta criada. Se o projeto exigir confirmação por e-mail, verifique sua caixa de entrada.", "success");
}

async function handleSignOut() {
  if (!state.supabase) return;
  const { error } = await state.supabase.auth.signOut();
  if (error) {
    console.error(error);
    notify(error.message || "Não foi possível sair da conta.", "error");
    return;
  }
  await refreshData({ silent: true });
  renderAll();
  notify("Sessão encerrada. Você voltou ao modo local.", "success");
}

function exportCurrentData() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `miyo-backup-${todayKey()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (state.session?.user) {
    notify("Saia da conta da nuvem para importar um backup local.", "warning");
    event.target.value = "";
    return;
  }
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed?.pets) || !Array.isArray(parsed?.appointments)) {
      throw new Error("Backup inválido");
    }
    state.data = writeLocalDb(normalizeDb(parsed));
    state.selectedPetId = state.data.pets[0]?.id || null;
    renderAll();
    notify("Backup local importado com sucesso.", "success");
  } catch (error) {
    console.error(error);
    notify("Não consegui importar esse arquivo JSON.", "error");
  } finally {
    event.target.value = "";
  }
}

function handleInstallClick() {
  if (!state.deferredInstallPrompt) return;
  state.deferredInstallPrompt.prompt();
  state.deferredInstallPrompt.userChoice.finally(() => {
    state.deferredInstallPrompt = null;
    DOM.installButton.hidden = true;
  });
}

function bindEvents() {
  DOM.navItems.forEach((button) =>
    button.addEventListener("click", () => {
      openSection(button.dataset.section);
    }),
  );
  DOM.petForm.addEventListener("submit", handlePetSubmit);
  DOM.appointmentForm.addEventListener("submit", handleAppointmentSubmit);
  DOM.cloudConfigForm.addEventListener("submit", handleSaveCloudConfig);
  DOM.authForm.addEventListener("submit", handleSignIn);
  DOM.signUpButton.addEventListener("click", handleSignUp);
  DOM.signOutButton.addEventListener("click", handleSignOut);
  DOM.cloudLaunchButton.addEventListener("click", () => openSection("cloud"));
  DOM.petFormCancelButton.addEventListener("click", resetPetForm);
  DOM.syncButton.addEventListener("click", () => refreshData());
  DOM.exportDataButton.addEventListener("click", exportCurrentData);
  DOM.importDataButton.addEventListener("click", () => DOM.importFileInput.click());
  DOM.importFileInput.addEventListener("change", handleImportFile);
  DOM.resetDemoButton.addEventListener("click", () => {
    if (state.session?.user) {
      notify("Saia da conta da nuvem para restaurar a demo local.", "warning");
      return;
    }
    restoreLocalDemo();
    renderAll();
    notify("Demo local restaurada.", "success");
  });
  DOM.agendaSearchInput.addEventListener("input", renderAppointmentsTable);
  DOM.agendaDateFilter.addEventListener("change", renderAppointmentsTable);
  DOM.petsSearchInput.addEventListener("input", renderPetsTable);
  DOM.clubinhoSearchInput.addEventListener("input", renderClubinhoBoard);
  DOM.agendaScopeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      state.agendaScope = button.dataset.agendaScope;
      DOM.agendaScopeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderAppointmentsTable();
    }),
  );
  DOM.installButton.addEventListener("click", handleInstallClick);

  document.addEventListener("click", async (event) => {
    const editPetButton = event.target.closest("[data-edit-pet]");
    if (editPetButton) {
      startPetEdit(editPetButton.dataset.editPet);
      return;
    }

    const openPetButton = event.target.closest("[data-open-pet]");
    if (openPetButton) {
      state.selectedPetId = openPetButton.dataset.openPet;
      openSection("pets");
      renderPetDetails();
      return;
    }

    const statusButton = event.target.closest("[data-status-id]");
    if (statusButton) {
      const updated = await updateEntity("appointments", statusButton.dataset.statusId, {
        status: statusButton.dataset.statusValue,
      });
      if (!updated) return;
      renderAll();
      notify("Status do atendimento atualizado.", "success");
      return;
    }

    const deleteButton = event.target.closest("[data-delete-table]");
    if (deleteButton) {
      const table = deleteButton.dataset.deleteTable;
      const id = deleteButton.dataset.deleteId;
      if (!window.confirm("Deseja realmente excluir esse registro?")) {
        return;
      }
      const deleted = await deleteEntity(table, id);
      if (!deleted) return;
      renderAll();
      notify("Registro excluído.", "success");
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    DOM.installButton.hidden = false;
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });

    const registration = await navigator.serviceWorker.register("./sw.js?v=20260402-7", {
      updateViaCache: "none",
    });
    await registration.update();
  } catch (error) {
    console.error(error);
  }
}

async function initialize() {
  bindEvents();
  renderServicePicker();
  DOM.appointmentDate.value = todayKey();
  DOM.appointmentTime.value = "09:00";
  DOM.agendaDateFilter.value = todayKey();
  resetPetForm();

  if (cloudConfigured()) {
    try {
      await ensureSupabaseClient();
    } catch (error) {
      console.error(error);
      notify("A conexão inicial com o Supabase falhou. O app seguirá em modo local.", "warning");
      resetCloudRuntime();
    }
  }

  await refreshData({ silent: true });
  renderAll();
  openSection("dashboard");
  await registerServiceWorker();
}

initialize();
