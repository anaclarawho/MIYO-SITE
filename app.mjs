const BOOTSTRAP = window.MIYO_CONFIG || {};
const STORAGE_KEY = "miyo-local-v2";
const CLOUD_KEY = "miyo-cloud-v1";
const CLOUD_SNAPSHOT_KEY = "miyo-cloud-snapshot-v1";
const CURRENCY = BOOTSTRAP.DEFAULT_CURRENCY || "BRL";
const TOAST_COOLDOWN_MS = 2200;
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
const BREED_OPTIONS = [
  "Affenpinscher",
  "Airedale Terrier",
  "Akita",
  "Akita Americano",
  "American Bully",
  "American Staffordshire Terrier",
  "Australian Cattle Dog",
  "Australian Shepherd",
  "Basenji",
  "Basset Hound",
  "Beagle",
  "Bearded Collie",
  "Bedlington Terrier",
  "Bernese Mountain Dog",
  "Bichon Frisé",
  "Bloodhound",
  "Boerboel",
  "Border Collie",
  "Border Terrier",
  "Borzoi",
  "Boston Terrier",
  "Boxer",
  "Buldogue Campeiro",
  "Buldogue Francês",
  "Buldogue Inglês",
  "Bull Terrier",
  "Cairn Terrier",
  "Cane Corso",
  "Cavalier King Charles Spaniel",
  "Chesapeake Bay Retriever",
  "Chihuahua",
  "Chow Chow",
  "Cocker Spaniel Americano",
  "Cocker Spaniel Inglês",
  "Collie",
  "Dachshund",
  "Dálmata",
  "Dandie Dinmont Terrier",
  "Doberman",
  "Dogo Argentino",
  "Dogue Alemão",
  "Fila Brasileiro",
  "Fox Paulistinha",
  "Fox Terrier",
  "Galgo Afegão",
  "Golden Retriever",
  "Gordon Setter",
  "Greyhound",
  "Griffon de Bruxelas",
  "Husky Siberiano",
  "Jack Russell Terrier",
  "Kangal",
  "Keeshond",
  "Komondor",
  "Kuvasz",
  "Labrador Retriever",
  "Lagotto Romagnolo",
  "Lhasa Apso",
  "Lulu da Pomerânia",
  "Malamute do Alasca",
  "Maltês",
  "Mastiff",
  "Mastim Napolitano",
  "Mudi",
  "Norfolk Terrier",
  "Norwich Terrier",
  "Old English Sheepdog",
  "Papillon",
  "Pastor Alemão",
  "Pastor Australiano",
  "Pastor Belga Groenendael",
  "Pastor Belga Malinois",
  "Pastor Belga Tervueren",
  "Pastor Branco Suíço",
  "Pastor de Brie",
  "Pastor de Shetland",
  "Pastor Maremano-Abruzês",
  "Pequinês",
  "Pinscher",
  "Pit Bull Terrier",
  "Pointer Inglês",
  "Poodle",
  "Pug",
  "Rottweiler",
  "Samoieda",
  "São Bernardo",
  "Schipperke",
  "Schnauzer Gigante",
  "Schnauzer Miniatura",
  "Schnauzer Standard",
  "Scottish Terrier",
  "Sem raça definida (SRD)",
  "Setter Inglês",
  "Shar Pei",
  "Shiba Inu",
  "Shih Tzu",
  "Spitz Alemão",
  "Springer Spaniel Inglês",
  "Staffordshire Bull Terrier",
  "Terra-Nova",
  "Weimaraner",
  "Welsh Corgi Cardigan",
  "Welsh Corgi Pembroke",
  "West Highland White Terrier",
  "Whippet",
  "Xoloitzcuintli",
  "Yorkshire Terrier",
].sort((left, right) => left.localeCompare(right, "pt-BR"));
const CLUBINHO_PLANS = {
  mensal: {
    key: "mensal",
    label: "Mensal",
    cycleLabel: "mês",
    bathSlots: 4,
    intervalDays: null,
    progressRules: [
      { key: "banho", label: "Banhos do ciclo", target: 4, service: "Banho" },
      { key: "hidratacao", label: "Hidratação", target: 1, service: "Hidratação" },
      { key: "escovacao", label: "Escovação dental", target: 1, service: "Escovação dental" },
      { key: "tosa_higienica", label: "Tosa higiênica", target: 1, service: "Tosa higiênica" },
    ],
  },
  quinzenal: {
    key: "quinzenal",
    label: "Quinzenal",
    cycleLabel: "quinzena",
    bathSlots: 2,
    intervalDays: 15,
    progressRules: [{ key: "banho", label: "Banhos do ciclo", target: 2, service: "Banho" }],
  },
};
const STATUS_LABELS = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  realizado: "Realizado",
  cancelado: "Cancelado",
};
const SECTION_LABELS = {
  dashboard: "INÍCIO",
  agenda: "AGENDA",
  pets: "PETS",
  clubinho: "CLUBINHO MIYO",
  cloud: "NUVEM",
};

const DOM = {
  navItems: [...document.querySelectorAll(".nav-item")],
  panels: [...document.querySelectorAll(".panel")],
  headerSectionLabel: document.querySelector("#headerSectionLabel"),
  statsGrid: document.querySelector("#statsGrid"),
  todayList: document.querySelector("#upcomingAppointments"),
  upcomingList: document.querySelector("#packageAlerts"),
  petsTableBody: document.querySelector("#petsTableBody"),
  petDetailsPanel: document.querySelector("#petDetailsPanel"),
  petDetailsCard: document.querySelector("#petDetailsCard"),
  petDetailsCloseButton: document.querySelector("#petDetailsCloseButton"),
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
  appointmentToggleButton: document.querySelector("#appointmentToggleButton"),
  appointmentCard: document.querySelector("#appointmentCard"),
  appointmentForm: document.querySelector("#appointmentForm"),
  appointmentPetSearch: document.querySelector("#appointmentPetSearch"),
  appointmentPetResults: document.querySelector("#appointmentPetResults"),
  appointmentPetId: document.querySelector("#appointmentPetId"),
  appointmentPetPreview: document.querySelector("#appointmentPetPreview"),
  appointmentDate: document.querySelector("#appointmentDate"),
  appointmentTime: document.querySelector("#appointmentTime"),
  appointmentAmountField: document.querySelector("#appointmentAmountField"),
  appointmentAmountInput: document.querySelector("#appointmentAmountInput"),
  appointmentClubinhoToggleWrap: document.querySelector("#appointmentClubinhoToggleWrap"),
  appointmentClubinhoInput: document.querySelector("#appointmentClubinhoInput"),
  appointmentClubinhoFields: document.querySelector("#appointmentClubinhoFields"),
  appointmentClubinhoSlotInput: document.querySelector("#appointmentClubinhoSlotInput"),
  appointmentClubinhoAmountHint: document.querySelector("#appointmentClubinhoAmountHint"),
  agendaDateFilter: document.querySelector("#agendaDateFilter"),
  agendaSearchInput: document.querySelector("#agendaSearchInput"),
  agendaRangeLabel: document.querySelector("#agendaRangeLabel"),
  agendaSummaryGrid: document.querySelector("#agendaSummaryGrid"),
  agendaScopeButtons: [...document.querySelectorAll("[data-agenda-scope]")],
  agendaPrevButton: document.querySelector("#agendaPrevButton"),
  agendaNextButton: document.querySelector("#agendaNextButton"),
  agendaCalendarLabel: document.querySelector("#agendaCalendarLabel"),
  agendaCalendarGrid: document.querySelector("#agendaCalendarGrid"),
  agendaWeekdays: document.querySelector("#agendaWeekdays"),
  servicePicker: document.querySelector("#servicePicker"),
  serviceSelectInput: document.querySelector("#serviceSelectInput"),
  serviceAddButton: document.querySelector("#serviceAddButton"),
  selectedServices: document.querySelector("#selectedServices"),
  petBreedSelect: document.querySelector("#petBreedSelect"),
  petFormToggleButton: document.querySelector("#petFormToggleButton"),
  petFormCard: document.querySelector("#petFormCard"),
  petForm: document.querySelector("#petForm"),
  petFormTitle: document.querySelector("#petFormTitle"),
  petFormSubmitButton: document.querySelector("#petFormSubmitButton"),
  petFormCancelButton: document.querySelector("#petFormCancelButton"),
  petRegistrationDate: document.querySelector("#petRegistrationDate"),
  petContactList: document.querySelector("#petContactList"),
  petAddContactButton: document.querySelector("#petAddContactButton"),
  petSiblingToggle: document.querySelector("#petSiblingToggle"),
  petSiblingCard: document.querySelector("#petSiblingCard"),
  petSiblingName: document.querySelector("#petSiblingName"),
  petSiblingBreedSelect: document.querySelector("#petSiblingBreedSelect"),
  petClubinhoInput: document.querySelector("#petClubinhoInput"),
  petClubinhoFields: document.querySelector("#petClubinhoFields"),
  petClubinhoPlan: document.querySelector("#petClubinhoPlan"),
  petClubinhoPrice: document.querySelector("#petClubinhoPrice"),
  petClubinhoAdhesionDate: document.querySelector("#petClubinhoAdhesionDate"),
  petSiblingClubinhoInput: document.querySelector("#petSiblingClubinhoInput"),
  petSiblingClubinhoFields: document.querySelector("#petSiblingClubinhoFields"),
  petSiblingClubinhoPlan: document.querySelector("#petSiblingClubinhoPlan"),
  petSiblingClubinhoPrice: document.querySelector("#petSiblingClubinhoPrice"),
  petSiblingClubinhoAdhesionDate: document.querySelector("#petSiblingClubinhoAdhesionDate"),
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
  cloudError: "",
  lastToast: { key: "", time: 0 },
  authSubscription: null,
  deferredInstallPrompt: null,
  selectedPetId: null,
  editingPetId: null,
  agendaScope: "day",
  selectedServiceItems: [],
  appointmentFormOpen: false,
  petFormOpen: false,
  petDetailsOpen: false,
  selectedClubinhoCardId: null,
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

function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function formatPhoneBrazil(value) {
  const digits = digitsOnly(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function parseTutorContacts(value) {
  if (Array.isArray(value)) {
    return value.map((item) => formatPhoneBrazil(item)).filter(Boolean);
  }

  const text = String(value ?? "").trim();
  if (!text) return [];

  return text
    .split(/\s*\|\s*|\s*\/\s*|\n+/)
    .map((item) => formatPhoneBrazil(item))
    .filter(Boolean);
}

function serializeTutorContacts(values) {
  const contacts = values
    .map((item) => formatPhoneBrazil(item))
    .filter(Boolean);

  return contacts.length ? contacts.join(" | ") : null;
}

function tutorContactsText(value) {
  const contacts = parseTutorContacts(value);
  return contacts.length ? contacts.join(" • ") : "—";
}

function sortedPetsByName(items) {
  return [...items].sort((left, right) => {
    const leftName = String(left?.name || "");
    const rightName = String(right?.name || "");
    return leftName.localeCompare(rightName, "pt-BR");
  });
}

function familyPets(petOrId) {
  const pet = typeof petOrId === "string" ? getPet(petOrId) : petOrId;
  if (!pet?.family_id) return [];
  return sortedPetsByName(
    state.data.pets.filter((item) => item.family_id === pet.family_id && item.id !== pet.id),
  );
}

function parseMoneyInput(value) {
  const raw = String(value ?? "").replace(/[^\d,.-]/g, "").trim();
  if (!raw) return null;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");
  let normalized = raw;

  if (lastComma > -1 && lastDot > -1) {
    normalized = lastComma > lastDot ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(/,/g, "");
  } else if (lastComma > -1) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else {
    normalized = raw.replace(/,/g, "");
  }

  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? Number(amount.toFixed(2)) : null;
}

function formatMoneyInputValue(value) {
  const amount = typeof value === "number" ? value : parseMoneyInput(value);
  if (amount === null) return "";
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function humanizeErrorMessage(error, fallback = "Não foi possível concluir essa ação.") {
  const message = String(error?.message || "").trim();
  if (!message) return fallback;

  const normalized = message.toLowerCase();
  if (normalized.includes("invalid input syntax for type numeric")) {
    return "Confira o valor preenchido. Use números como 220 ou 220,00.";
  }
  if (normalized.includes("row-level security")) {
    return "Sua conta não tem permissão para salvar isso agora. Entre novamente e tente de novo.";
  }
  if (normalized.includes("schema cache")) {
    return "O banco do Supabase ainda não está com todos os campos novos do MIYO. Precisamos atualizar o banco.";
  }
  if (normalized.includes("family_id")) {
    return "O banco do Supabase ainda não recebeu o campo novo da ficha compartilhada. Atualize o schema e tente de novo.";
  }
  if (normalized.includes("failed to fetch") || normalized.includes("networkerror")) {
    return "Não consegui falar com a nuvem agora. Confira sua internet e tente de novo.";
  }
  if (normalized.includes("duplicate key value")) {
    return "Esse registro já existe na nuvem.";
  }

  return fallback;
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

function asDateOnly(value) {
  const fallback = new Date(`${todayKey()}T12:00:00`);
  if (!value) return fallback;
  const candidate = new Date(String(value).includes("T") ? value : `${value}T12:00:00`);
  return Number.isNaN(candidate.getTime()) ? fallback : candidate;
}

function clubinhoPlanConfig(planKey) {
  return CLUBINHO_PLANS[planKey] || CLUBINHO_PLANS.mensal;
}

function addPlanInterval(value, planKey, amount = 1) {
  const plan = clubinhoPlanConfig(planKey);
  return plan.intervalDays ? addDays(value, plan.intervalDays * amount) : addMonths(value, amount);
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

function agendaAnchorDate() {
  return asDateOnly(DOM.agendaDateFilter?.value || todayKey());
}

function formatShortCalendarDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function agendaCalendarModel(anchorValue = DOM.agendaDateFilter?.value || todayKey(), scope = state.agendaScope) {
  const anchor = asDateOnly(anchorValue);
  const weekdayLabels = Array.from({ length: 7 }, (_item, index) =>
    new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(addDays(startOfWeek(anchor), index)),
  );

  if (scope === "month") {
    const monthStart = startOfMonth(anchor);
    const gridStart = startOfWeek(monthStart);
    const monthEnd = addMonths(monthStart, 1);
    const days = [];

    for (let cursor = new Date(gridStart); cursor < monthEnd || cursor.getDay() !== 1; cursor = addDays(cursor, 1)) {
      const key = localDateKeyFromValue(cursor.toISOString());
      const count = state.data.appointments.filter((item) =>
        item.status !== "cancelado" && localDateKeyFromValue(item.appointment_at) === key
      ).length;
      days.push({
        key,
        label: String(cursor.getDate()),
        date: new Date(cursor),
        outside: cursor.getMonth() !== anchor.getMonth(),
        count,
      });
      if (days.length >= 42 && cursor >= monthEnd) break;
    }

    return {
      label: formatMonthYear(anchor),
      weekdays: weekdayLabels,
      days,
      mode: "month",
    };
  }

  const start = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_item, index) => {
    const date = addDays(start, index);
    const key = localDateKeyFromValue(date.toISOString());
    const count = state.data.appointments.filter((item) =>
      item.status !== "cancelado" && localDateKeyFromValue(item.appointment_at) === key
    ).length;
    return {
      key,
      label: String(date.getDate()),
      shortLabel: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date),
      date,
      outside: false,
      count,
    };
  });

  return {
    label:
      scope === "week"
        ? `${formatShortCalendarDate(start)} - ${formatShortCalendarDate(addDays(start, 6))}`
        : "Escolha o dia",
    weekdays: weekdayLabels,
    days,
    mode: scope,
  };
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
  const key = `${tone}:${message}`;
  const now = Date.now();
  if (state.lastToast.key === key && now - state.lastToast.time < TOAST_COOLDOWN_MS) {
    return;
  }
  state.lastToast = { key, time: now };
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
        clubinho_plan: "mensal",
        clubinho_price: 220,
        clubinho_adhesion_date: todayKey(),
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
        clubinho_plan: null,
        clubinho_price: null,
        clubinho_adhesion_date: null,
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
        amount: 220,
        is_clubinho: true,
        clubinho_slot: "2º banho do ciclo",
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
        is_clubinho: false,
        notes: "Pedir cuidado com nós atrás da orelha.",
        created_at: now.toISOString(),
      },
      {
        id: uid(),
        pet_id: petA,
        appointment_at: tomorrow.toISOString(),
        status: "agendado",
        service_items: ["Banho"],
        amount: 220,
        is_clubinho: true,
        clubinho_slot: "3º banho do ciclo",
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
      family_id: pet.family_id || null,
      tutor_name: pet.tutor_name || tutor.name || "",
      tutor_contact: serializeTutorContacts(parseTutorContacts(pet.tutor_contact || tutor.phone || tutor.email || "")),
      registration_date: pet.registration_date || localDateKeyFromValue(pet.created_at || new Date().toISOString()),
      clubinho_enabled: Boolean(pet.clubinho_enabled ?? clubinhoPetIds.has(pet.id)),
      clubinho_plan: pet.clubinho_enabled ? pet.clubinho_plan || "mensal" : pet.clubinho_plan || null,
      clubinho_price: pet.clubinho_price ?? null,
      clubinho_adhesion_date:
        pet.clubinho_adhesion_date
        || pet.registration_date
        || localDateKeyFromValue(pet.created_at || new Date().toISOString()),
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
      is_clubinho: Boolean(appointment.is_clubinho ?? appointment.clubinho_slot),
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

function readCloudSnapshot() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CLOUD_SNAPSHOT_KEY) || "null");
    if (!parsed?.pets && !parsed?.appointments) {
      return null;
    }
    return normalizeDb(parsed);
  } catch {
    return null;
  }
}

function writeCloudSnapshot(db) {
  localStorage.setItem(CLOUD_SNAPSHOT_KEY, JSON.stringify(normalizeDb(db)));
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
  } else if (table === "pets") {
    query = query.order("name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function refreshData({ silent = false } = {}) {
  const loadingFromCloud = Boolean(state.supabase && state.session?.user);
  try {
    if (loadingFromCloud) {
      const remote = {};
      const results = await Promise.all(SYNC_TABLES.map((table) => fetchRemoteTable(table)));
      SYNC_TABLES.forEach((table, index) => {
        remote[table] = results[index];
      });
      state.data = sortDb(normalizeDb(remote));
      writeCloudSnapshot(state.data);
      state.cloudError = "";
    } else {
      state.data = readLocalDb();
      state.cloudError = "";
    }

    if (!state.selectedPetId || !getPet(state.selectedPetId)) {
      state.selectedPetId = state.data.pets[0]?.id || null;
    }

    if (!silent) {
      notify(state.session?.user ? "Dados sincronizados com a nuvem." : "Dados carregados no modo local.", "success");
    }
  } catch (error) {
    console.error(error);
    if (loadingFromCloud) {
      const cachedSnapshot = readCloudSnapshot();
      if (cachedSnapshot) {
        state.data = sortDb(cachedSnapshot);
      }
      state.cloudError = humanizeErrorMessage(
        error,
        "Não consegui carregar seus dados da nuvem agora. Isso não significa que eles foram apagados.",
      );
      notify(
        cachedSnapshot
          ? "Não consegui falar com a nuvem agora. Estou mostrando a última cópia sincronizada."
          : state.cloudError,
        cachedSnapshot ? "warning" : "error",
      );
      return;
    }

    state.data = readLocalDb();
    state.cloudError = "";
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
    notify(humanizeErrorMessage(error, "Não foi possível salvar esse registro."), "error");
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
    notify(humanizeErrorMessage(error, "Não foi possível atualizar esse registro."), "error");
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
    notify(humanizeErrorMessage(error, "Não foi possível excluir esse registro."), "error");
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
      item.clubinho_slot,
      item.notes,
      formatDate(item.appointment_at),
      weekdayLabel(item.appointment_at),
    ].join(" ");
    return includesSearch(terms, searchTerm);
  });
}

function clubinhoCycleForPet(pet, referenceDate = new Date()) {
  if (!pet?.clubinho_enabled) return null;

  const baseDate = pet.clubinho_adhesion_date
    || pet.registration_date
    || localDateKeyFromValue(pet.created_at || new Date().toISOString());
  let start = asDateOnly(baseDate);
  let end = addPlanInterval(start, pet.clubinho_plan, 1);
  const referenceCandidate = referenceDate instanceof Date ? new Date(referenceDate) : new Date(referenceDate);
  const reference = Number.isNaN(referenceCandidate.getTime()) ? new Date() : referenceCandidate;

  while (reference >= end) {
    start = end;
    end = addPlanInterval(start, pet.clubinho_plan, 1);
  }

  while (reference < start) {
    end = start;
    start = addPlanInterval(start, pet.clubinho_plan, -1);
  }

  return {
    start,
    end,
    label: `${formatDate(localDateKeyFromValue(start))} até ${formatDate(localDateKeyFromValue(addDays(end, -1)))}`,
  };
}

function clubinhoAppointmentsInCycle(pet, referenceDate = new Date()) {
  const cycle = clubinhoCycleForPet(pet, referenceDate);
  if (!cycle) return [];

  return state.data.appointments.filter((item) => {
    if (item.pet_id !== pet.id || !item.is_clubinho) return false;
    const date = new Date(item.appointment_at);
    return date >= cycle.start && date < cycle.end;
  });
}

function clubinhoProgress(petOrId, referenceDate = new Date()) {
  const pet = typeof petOrId === "string" ? getPet(petOrId) : petOrId;
  if (!pet) {
    return {
      pet: null,
      plan: clubinhoPlanConfig("mensal"),
      cycle: null,
      items: [],
      progress: [],
      bathDone: 0,
    };
  }

  const plan = clubinhoPlanConfig(pet.clubinho_plan);
  const cycle = clubinhoCycleForPet(pet, referenceDate);
  const items = clubinhoAppointmentsInCycle(pet, referenceDate);
  const progress = plan.progressRules.map((rule) => {
    const done = items.filter((item) => item.service_items?.includes(rule.service)).length;
    return {
      ...rule,
      done: Math.min(rule.target, done),
      complete: done >= rule.target,
    };
  });

  return {
    pet,
    plan,
    cycle,
    items,
    progress,
    bathDone: progress.find((item) => item.key === "banho")?.done || 0,
  };
}

function clubinhoHeadline(petOrId) {
  const summary = clubinhoProgress(petOrId);
  return `${summary.bathDone}/${summary.plan.bathSlots} banhos neste ciclo`;
}

function renderClubinhoProgress(petOrId) {
  const summary = clubinhoProgress(petOrId);

  return `
    <div class="clubinho-progress">
      <div class="clubinho-progress-head">
        <span class="mini-label">Clubinho ${escapeHtml(summary.plan.label)}</span>
        <span class="muted">${escapeHtml(summary.cycle?.label || "Ciclo atual")}</span>
      </div>
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
  const tomorrow = addDays(startOfDay(new Date()), 1);
  return state.data.appointments
    .filter((item) => new Date(item.appointment_at) >= tomorrow && item.status !== "cancelado")
    .slice(0, limit);
}

function renderServicePicker(selectedItems = []) {
  state.selectedServiceItems = [...new Set(selectedItems.filter(Boolean))];
  DOM.serviceSelectInput.innerHTML = `
    <option value="">Selecione um serviço</option>
    ${SERVICE_OPTIONS.map((service) => `<option value="${escapeHtml(service)}">${escapeHtml(service)}</option>`).join("")}
  `;
  DOM.selectedServices.innerHTML = state.selectedServiceItems.length
    ? state.selectedServiceItems
        .map((service) => `
          <button class="tag selected-service-tag" data-remove-service="${escapeHtml(service)}" type="button">
            <span>${escapeHtml(service)}</span>
            <span aria-hidden="true">×</span>
          </button>
        `)
        .join("")
    : `<span class="field-hint">Nenhum serviço adicionado ainda.</span>`;
  DOM.serviceSelectInput.value = "";
}

function populateBreedSelect(selectElement, selectedValue = "") {
  if (!selectElement) return;
  const customBreed = selectedValue && !BREED_OPTIONS.includes(selectedValue) ? [selectedValue] : [];
  const options = [...customBreed, ...BREED_OPTIONS];
  selectElement.innerHTML = `
    <option value="">Selecione a raça</option>
    ${options.map((breed) => `<option value="${escapeHtml(breed)}">${escapeHtml(breed)}</option>`).join("")}
  `;
  selectElement.value = selectedValue || "";
}

function populateBreedOptions(selectedValue = "", siblingSelectedValue = "") {
  populateBreedSelect(DOM.petBreedSelect, selectedValue);
  populateBreedSelect(DOM.petSiblingBreedSelect, siblingSelectedValue);
}

function selectedServiceItems() {
  return [...state.selectedServiceItems];
}

function addServiceItem(service) {
  if (!service || state.selectedServiceItems.includes(service)) return;
  renderServicePicker([...state.selectedServiceItems, service]);
}

function removeServiceItem(service) {
  renderServicePicker(state.selectedServiceItems.filter((item) => item !== service));
}

function appointmentPetLabel(pet) {
  return `${pet.name}${pet.tutor_name ? ` • ${pet.tutor_name}` : ""}`;
}

function resolveAppointmentPetFromQuery(value) {
  const query = normalizeSearch(value);
  if (!query) return null;

  const exactLabelMatch = state.data.pets.find((pet) => normalizeSearch(appointmentPetLabel(pet)) === query);
  if (exactLabelMatch) return exactLabelMatch;

  const nameMatches = state.data.pets.filter((pet) => normalizeSearch(pet.name) === query);
  if (nameMatches.length === 1) return nameMatches[0];

  return null;
}

function matchingAppointmentPets(value) {
  const query = normalizeSearch(value);
  if (!query) return [];

  return sortedPetsByName(state.data.pets)
    .filter((pet) => includesSearch([pet.name, pet.tutor_name, pet.breed].join(" "), query))
    .slice(0, 8);
}

function hideAppointmentPetResults() {
  DOM.appointmentPetResults.hidden = true;
  DOM.appointmentPetResults.innerHTML = "";
}

function renderAppointmentPetResults(query = DOM.appointmentPetSearch.value) {
  const pets = matchingAppointmentPets(query);
  if (!pets.length) {
    hideAppointmentPetResults();
    return;
  }

  DOM.appointmentPetResults.innerHTML = pets
    .map((pet) => `
      <button class="search-combobox-item" data-appointment-pet="${pet.id}" type="button">
        <strong>${escapeHtml(pet.name)}</strong>
        <span>${escapeHtml(pet.tutor_name || "Tutor não informado")}</span>
      </button>
    `)
    .join("");
  DOM.appointmentPetResults.hidden = false;
}

function selectAppointmentPet(pet) {
  if (!pet) return;
  DOM.appointmentPetId.value = pet.id;
  DOM.appointmentPetSearch.value = appointmentPetLabel(pet);
  hideAppointmentPetResults();
  syncAppointmentClubinhoUI();
}

function renderAppointmentPetPreview() {
  const pet = getPet(DOM.appointmentPetId.value);
  DOM.appointmentPetPreview.innerHTML = pet
    ? `<strong>${escapeHtml(pet.name)}</strong><span>${escapeHtml(pet.tutor_name || "Tutor não informado")}</span>`
    : "Selecione um pet para ver o tutor.";
}

function syncAppointmentPetSelection({ commit = false } = {}) {
  const pet = resolveAppointmentPetFromQuery(DOM.appointmentPetSearch.value.trim());
  if (pet && commit) {
    selectAppointmentPet(pet);
    return pet;
  }

  DOM.appointmentPetId.value = "";
  renderAppointmentPetResults();
  syncAppointmentClubinhoUI();
  return pet;
}

function populateClubinhoSlotOptions(pet) {
  const plan = clubinhoPlanConfig(pet?.clubinho_plan);
  const slotCount = Number(plan.bathSlots) || 0;
  let suggestedSlot = 1;

  try {
    const summary = clubinhoProgress(pet);
    suggestedSlot = Math.min(summary.bathDone + 1, slotCount || 1);
  } catch (error) {
    console.warn("Nao consegui calcular o proximo banho do ciclo.", error);
  }

  if (!slotCount) {
    DOM.appointmentClubinhoSlotInput.innerHTML = `<option value="">Nenhum banho configurado</option>`;
    DOM.appointmentClubinhoSlotInput.value = "";
    DOM.appointmentClubinhoSlotInput.disabled = true;
    return;
  }

  DOM.appointmentClubinhoSlotInput.innerHTML = Array.from({ length: slotCount }, (_item, index) => {
    const order = index + 1;
    const value = `${order}\u00BA banho do ciclo`;
    const selected = order === suggestedSlot ? " selected" : "";
    return `<option value="${value}"${selected}>${value}</option>`;
  }).join("");

  DOM.appointmentClubinhoSlotInput.disabled = false;
  DOM.appointmentClubinhoSlotInput.value = `${suggestedSlot}\u00BA banho do ciclo`;
}

function syncClubinhoFields({
  enabledInput,
  fieldsWrap,
  planInput,
  priceInput,
  adhesionInput,
  registrationValue,
}) {
  const enabled = enabledInput.checked;
  fieldsWrap.hidden = !enabled;
  if (!enabled) {
    planInput.value = "mensal";
    priceInput.value = "";
    adhesionInput.value = "";
    return;
  }

  if (!planInput.value) {
    planInput.value = "mensal";
  }
  if (!adhesionInput.value) {
    adhesionInput.value = registrationValue || todayKey();
  }
}

function syncPetClubinhoFields() {
  syncClubinhoFields({
    enabledInput: DOM.petClubinhoInput,
    fieldsWrap: DOM.petClubinhoFields,
    planInput: DOM.petClubinhoPlan,
    priceInput: DOM.petClubinhoPrice,
    adhesionInput: DOM.petClubinhoAdhesionDate,
    registrationValue: DOM.petRegistrationDate.value,
  });
}

function syncSiblingClubinhoFields() {
  syncClubinhoFields({
    enabledInput: DOM.petSiblingClubinhoInput,
    fieldsWrap: DOM.petSiblingClubinhoFields,
    planInput: DOM.petSiblingClubinhoPlan,
    priceInput: DOM.petSiblingClubinhoPrice,
    adhesionInput: DOM.petSiblingClubinhoAdhesionDate,
    registrationValue: DOM.petRegistrationDate.value,
  });
}

function syncSiblingPetFields() {
  const enabled = Boolean(DOM.petSiblingToggle.checked && !state.editingPetId);
  DOM.petSiblingCard.hidden = !enabled;
  DOM.petSiblingName.required = enabled;
  if (!enabled) {
    DOM.petSiblingName.value = "";
    populateBreedSelect(DOM.petSiblingBreedSelect, "");
    DOM.petSiblingClubinhoInput.checked = false;
    syncSiblingClubinhoFields();
    DOM.petForm.elements.sibling_notes.value = "";
    return;
  }
  if (!DOM.petSiblingClubinhoAdhesionDate.value) {
    DOM.petSiblingClubinhoAdhesionDate.value = DOM.petRegistrationDate.value || todayKey();
  }
  syncSiblingClubinhoFields();
}

function syncAppointmentClubinhoUI() {
  const pet = getPet(DOM.appointmentPetId.value);
  renderAppointmentPetPreview();

  const supportsClubinho = Boolean(pet?.clubinho_enabled);
  DOM.appointmentClubinhoToggleWrap.hidden = !supportsClubinho;

  if (!supportsClubinho) {
    DOM.appointmentClubinhoInput.checked = false;
    DOM.appointmentClubinhoFields.hidden = true;
    DOM.appointmentAmountField.hidden = false;
    DOM.appointmentClubinhoSlotInput.innerHTML = "";
    DOM.appointmentClubinhoSlotInput.value = "";
    DOM.appointmentClubinhoSlotInput.disabled = true;
    return;
  }

  const plan = clubinhoPlanConfig(pet.clubinho_plan);
  DOM.appointmentClubinhoInput.checked = true;
  DOM.appointmentClubinhoFields.hidden = false;
  DOM.appointmentAmountField.hidden = true;
  DOM.appointmentClubinhoAmountHint.textContent = pet.clubinho_price !== null && pet.clubinho_price !== undefined
    ? `${plan.label}: ${formatMoney(pet.clubinho_price)} cobrado automaticamente.`
    : `${plan.label}: sem valor cadastrado no pacote.`;
  populateClubinhoSlotOptions(pet);
}

function refreshPetSelect() {
  const sortedPets = sortedPetsByName(state.data.pets);
  const preferredId = DOM.appointmentPetId.value || "";
  DOM.appointmentPetSearch.disabled = !sortedPets.length;
  const activePet = sortedPets.find((pet) => pet.id === preferredId) || null;
  if (activePet) {
    DOM.appointmentPetId.value = activePet.id;
    DOM.appointmentPetSearch.value = appointmentPetLabel(activePet);
  } else {
    DOM.appointmentPetId.value = "";
    DOM.appointmentPetSearch.value = "";
  }
  hideAppointmentPetResults();
  syncAppointmentClubinhoUI();
}

function filteredPets() {
  const searchTerm = normalizeSearch(DOM.petsSearchInput?.value || "");
  return sortedPetsByName(state.data.pets).filter((pet) => {
    const terms = [pet.name, pet.tutor_name, pet.breed, pet.tutor_contact, pet.notes].join(" ");
    return includesSearch(terms, searchTerm);
  });
}

function filteredClubinhoPets() {
  const searchTerm = normalizeSearch(DOM.clubinhoSearchInput?.value || "");
  return sortedPetsByName(state.data.pets).filter((pet) => {
    if (!pet.clubinho_enabled) return false;
    const terms = [pet.name, pet.tutor_name, pet.breed, pet.tutor_contact, pet.notes].join(" ");
    return includesSearch(terms, searchTerm);
  });
}

function setAgendaAnchor(value) {
  DOM.agendaDateFilter.value = value;
  renderAppointmentsTable();
}

function shiftAgendaAnchor(direction) {
  const current = agendaAnchorDate();
  let next = current;

  if (state.agendaScope === "month") {
    next = addMonths(current, direction);
  } else if (state.agendaScope === "week") {
    next = addDays(current, direction * 7);
  } else {
    next = addDays(current, direction);
  }

  setAgendaAnchor(localDateKeyFromValue(next.toISOString()));
}

function syncDisclosureButtons() {
  if (DOM.appointmentCard && DOM.appointmentToggleButton) {
    DOM.appointmentCard.hidden = !state.appointmentFormOpen;
    DOM.appointmentToggleButton.textContent = state.appointmentFormOpen ? "Fechar agendamento" : "Novo agendamento";
  }

  if (DOM.petFormCard && DOM.petFormToggleButton) {
    DOM.petFormCard.hidden = !state.petFormOpen;
    DOM.petFormToggleButton.textContent = state.petFormOpen ? "Fechar cadastro" : "Cadastrar pet";
  }

  if (DOM.petDetailsCard) {
    DOM.petDetailsCard.hidden = !state.petDetailsOpen;
  }
}

function renderAgendaCalendar() {
  const model = agendaCalendarModel();
  const selectedKey = DOM.agendaDateFilter?.value || todayKey();
  const today = todayKey();

  if (DOM.agendaCalendarLabel) {
    DOM.agendaCalendarLabel.textContent = model.label;
  }

  if (DOM.agendaWeekdays) {
    DOM.agendaWeekdays.innerHTML = model.weekdays
      .map((item) => `<span>${escapeHtml(item.replace(".", ""))}</span>`)
      .join("");
  }

  if (!DOM.agendaCalendarGrid) return;

  DOM.agendaCalendarGrid.dataset.mode = model.mode;
  DOM.agendaCalendarGrid.innerHTML = model.days
    .map((day) => {
      const classes = [
        "calendar-day",
        day.key === selectedKey ? "is-selected" : "",
        day.key === today ? "is-today" : "",
        day.outside ? "is-outside" : "",
        day.count ? "has-items" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button class="${classes}" data-agenda-date="${escapeHtml(day.key)}" type="button">
          <span class="calendar-day-top">
            <span class="calendar-day-number">${escapeHtml(day.label)}</span>
            ${day.count ? `<span class="calendar-day-count">${day.count}</span>` : ""}
          </span>
          <span class="calendar-day-label">${escapeHtml(
            (day.shortLabel || new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(day.date)).replace(".", ""),
          )}</span>
        </button>
      `;
    })
    .join("");
}

function contactFieldMarkup(value = "", index = 0) {
  return `
    <div class="contact-row">
      <input
        type="tel"
        name="tutor_contact_item"
        inputmode="numeric"
        autocomplete="tel-national"
        maxlength="15"
        placeholder="(11) 99999-9999"
        value="${escapeHtml(formatPhoneBrazil(value))}"
      >
      ${index > 0 ? `<button class="ghost-button slim-button" data-remove-contact="${index}" type="button">Remover</button>` : ""}
    </div>
  `;
}

function currentPetContactValues() {
  return [...DOM.petContactList.querySelectorAll('input[name="tutor_contact_item"]')].map((input) => input.value);
}

function renderPetContactInputs(values = [""]) {
  const contacts = values.length ? values : [""];
  DOM.petContactList.innerHTML = contacts.map((value, index) => contactFieldMarkup(value, index)).join("");
}

function resetPetForm() {
  state.editingPetId = null;
  DOM.petForm.reset();
  DOM.petRegistrationDate.value = todayKey();
  populateBreedOptions("", "");
  renderPetContactInputs([""]);
  DOM.petSiblingToggle.checked = false;
  DOM.petSiblingToggle.disabled = false;
  DOM.petClubinhoPlan.value = "mensal";
  DOM.petClubinhoPrice.value = "";
  DOM.petClubinhoAdhesionDate.value = todayKey();
  DOM.petSiblingClubinhoPlan.value = "mensal";
  DOM.petSiblingClubinhoPrice.value = "";
  DOM.petSiblingClubinhoAdhesionDate.value = todayKey();
  DOM.petFormTitle.textContent = "Novo pet";
  DOM.petFormSubmitButton.textContent = "Salvar pet";
  DOM.petFormCancelButton.hidden = true;
  state.petFormOpen = false;
  syncPetClubinhoFields();
  syncSiblingPetFields();
  syncDisclosureButtons();
}

function startPetEdit(petId) {
  const pet = getPet(petId);
  if (!pet) return;
  state.editingPetId = pet.id;
  state.petFormOpen = true;
  DOM.petForm.elements.name.value = pet.name || "";
  DOM.petForm.elements.tutor_name.value = pet.tutor_name || "";
  populateBreedOptions(pet.breed || "", "");
  renderPetContactInputs(parseTutorContacts(pet.tutor_contact));
  DOM.petForm.elements.registration_date.value = pet.registration_date || todayKey();
  DOM.petForm.elements.clubinho_enabled.checked = Boolean(pet.clubinho_enabled);
  DOM.petForm.elements.clubinho_plan.value = pet.clubinho_plan || "mensal";
  DOM.petForm.elements.clubinho_price.value = formatMoneyInputValue(pet.clubinho_price);
  DOM.petForm.elements.clubinho_adhesion_date.value = pet.clubinho_adhesion_date || pet.registration_date || todayKey();
  DOM.petForm.elements.notes.value = pet.notes || "";
  DOM.petSiblingToggle.checked = false;
  DOM.petSiblingToggle.disabled = true;
  DOM.petFormTitle.textContent = `Editando ${pet.name}`;
  DOM.petFormSubmitButton.textContent = "Salvar alterações";
  DOM.petFormCancelButton.hidden = false;
  syncPetClubinhoFields();
  syncSiblingPetFields();
  syncDisclosureButtons();
  openSection("pets");
  DOM.petFormCard?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDashboard() {
  const todayItems = todayAppointments();
  const nextItems = futureAppointments();
  const clubinhoCount = state.data.pets.filter((pet) => pet.clubinho_enabled).length;

  DOM.statsGrid.innerHTML = `
    <article class="stat-card stat-card-compact">
      <p>Atendimentos hoje</p>
      <strong>${todayItems.length}</strong>
    </article>
    <article class="stat-card stat-card-compact">
      <p>Pets cadastrados</p>
      <strong>${state.data.pets.length}</strong>
    </article>
    <article class="stat-card stat-card-compact">
      <p>Clubinho MIYO</p>
      <strong>${clubinhoCount}</strong>
    </article>
  `;

  DOM.todayList.innerHTML = todayItems.length
    ? todayItems
        .map((item) => {
          const pet = getPet(item.pet_id);
          return `
            <article class="stack-item">
              <strong>${escapeHtml(pet?.name || "Pet removido")}</strong>
              <span class="muted">${escapeHtml(pet?.tutor_name || "Tutor não informado")}</span>
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
              <span class="muted">${escapeHtml(pet?.tutor_name || "Tutor não informado")}</span>
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
  DOM.agendaRangeLabel.textContent = rows.length
    ? `${range.label} ${rows.length === 1 ? "• 1 atendimento" : `• ${rows.length} atendimentos`}`
    : range.label;
  DOM.agendaSummaryGrid.innerHTML = "";
  renderAgendaCalendar();

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
              <td data-label="Pet">
                <div class="table-pet">
                  <strong>${escapeHtml(pet?.name || "Pet removido")}</strong>
                  <span class="muted">${escapeHtml(pet?.tutor_name || "Tutor não informado")}</span>
                  ${item.is_clubinho ? `<span class="tag success">${escapeHtml(item.clubinho_slot || "Clubinho MIYO")}</span>` : ""}
                </div>
              </td>
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
          const plan = clubinhoPlanConfig(item.clubinho_plan);
          return `
            <tr>
              <td data-label="Pet"><div class="pet-identity">${petAvatarMarkup(item)}<span>${escapeHtml(item.name)}</span></div></td>
              <td data-label="Tutor">${escapeHtml(item.tutor_name || "—")}</td>
              <td data-label="Clubinho">${item.clubinho_enabled ? `<span class="tag success">&#9733; ${escapeHtml(plan.label)}</span>` : '<span class="muted">Não</span>'}</td>
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
  if (!pet || !state.petDetailsOpen) {
    state.petDetailsOpen = false;
    syncDisclosureButtons();
    DOM.petDetailsPanel.innerHTML = emptyState("Abra um pet para ver a ficha completa e o histórico de atendimentos.");
    return;
  }

  const history = appointmentsForPet(pet.id);
  const clubinhoText = pet.clubinho_enabled ? clubinhoHeadline(pet.id) : "Não participa do clubinho";
  const plan = clubinhoPlanConfig(pet.clubinho_plan);
  const siblings = familyPets(pet);

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
        ${pet.clubinho_enabled ? `<button class="action-chip" data-renew-clubinho="${pet.id}">Renovar clubinho</button>` : ""}
      </div>
      ${siblings.length ? `
        <div class="linked-pets-panel">
          <span class="mini-label">Pets nesta ficha</span>
          <div class="linked-pets-row">
            <span class="tag success">${escapeHtml(pet.name)} • atual</span>
            ${siblings.map((item) => `<button class="action-chip" data-open-pet="${item.id}">${escapeHtml(item.name)} • ${escapeHtml(item.breed || "Sem raça")}</button>`).join("")}
          </div>
        </div>
      ` : ""}
      <div class="pet-profile-grid">
        <div>
          <span class="mini-label">Tutor</span>
          <strong>${escapeHtml(pet.tutor_name || "—")}</strong>
        </div>
        <div>
          <span class="mini-label">Contato</span>
          <strong>${escapeHtml(tutorContactsText(pet.tutor_contact))}</strong>
        </div>
        <div>
          <span class="mini-label">Cadastro</span>
          <strong>${escapeHtml(formatDate(pet.registration_date))}</strong>
        </div>
        <div>
          <span class="mini-label">Plano</span>
          <strong>${escapeHtml(pet.clubinho_enabled ? plan.label : "Avulso")}</strong>
        </div>
        <div>
          <span class="mini-label">Pacote</span>
          <strong>${escapeHtml(pet.clubinho_enabled ? formatMoney(pet.clubinho_price) : "—")}</strong>
        </div>
        <div>
          <span class="mini-label">Adesão</span>
          <strong>${escapeHtml(pet.clubinho_enabled ? formatDate(pet.clubinho_adhesion_date) : "—")}</strong>
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
      <h3>Atendimentos de ${escapeHtml(pet.name)}</h3>
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
                  ${item.is_clubinho ? `<span class="tag success">${escapeHtml(item.clubinho_slot || "Clubinho MIYO")}</span>` : ""}
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
          const plan = clubinhoPlanConfig(pet.clubinho_plan);
          const isOpen = state.selectedClubinhoCardId === pet.id;
          return `
            <article class="clubinho-card ${isOpen ? "is-open" : ""}">
              <div class="clubinho-card-head">
                <div class="pet-identity">
                  ${petAvatarMarkup(pet)}
                  <div class="clubinho-card-meta">
                    <h3>${escapeHtml(pet.name)}</h3>
                    <p>${escapeHtml(pet.tutor_name || "Tutor não informado")}</p>
                  </div>
                </div>
                <div class="action-row">
                  <button class="action-chip" data-toggle-clubinho="${pet.id}">${isOpen ? "Esconder andamento" : "Ver andamento"}</button>
                  <button class="action-chip" data-open-pet="${pet.id}">Abrir ficha</button>
                  <button class="action-chip" data-renew-clubinho="${pet.id}">Renovar</button>
                </div>
              </div>
              <div class="clubinho-mini-grid">
                <div class="clubinho-mini-stat">
                  <span class="mini-label">Banhos</span>
                  <strong>${summary.bathDone}/${plan.bathSlots}</strong>
                </div>
                <div class="clubinho-mini-stat">
                  <span class="mini-label">Plano</span>
                  <strong>${escapeHtml(plan.label)}</strong>
                </div>
                <div class="clubinho-mini-stat">
                  <span class="mini-label">Pacote</span>
                  <strong>${escapeHtml(formatMoney(pet.clubinho_price))}</strong>
                </div>
                <div class="clubinho-mini-stat">
                  <span class="mini-label">Adesão</span>
                  <strong>${escapeHtml(formatDate(pet.clubinho_adhesion_date))}</strong>
                </div>
              </div>
              ${isOpen ? `<div class="clubinho-card-body">${renderClubinhoProgress(pet.id)}</div>` : ""}
            </article>
          `;
        })
        .join("")
    : emptyState("Nenhum pet do Clubinho MIYO encontrado com essa busca.");
}

function renderCloudState() {
  const cloudReady = cloudConfigured();
  const logged = Boolean(state.session?.user);
  const syncFailed = Boolean(logged && state.cloudError);
  const storageLabel = syncFailed
    ? "Falha ao carregar nuvem"
    : logged
      ? "Nuvem sincronizada"
      : cloudReady
        ? "Supabase pronto"
        : "Local no navegador";
  const authLabel = logged ? state.session.user.email || "Conta conectada" : "Sem login";

  if (DOM.storageModeBadge) DOM.storageModeBadge.textContent = storageLabel;
  if (DOM.authModeBadge) DOM.authModeBadge.textContent = authLabel;
  DOM.cloudStorageState.textContent = storageLabel;
  DOM.cloudUserState.textContent = authLabel;
  if (DOM.cloudStateLabel) {
    DOM.cloudStateLabel.textContent = syncFailed ? "Sincronização com problema" : logged ? "Sincronização ativa" : storageLabel;
  }
  DOM.cloudSummary.textContent = syncFailed
    ? state.cloudError
    : logged
      ? "Seus dados já estão sendo sincronizados entre os dispositivos em que você entrar com esta conta."
      : cloudReady
        ? "A conexão com o Supabase está pronta."
        : "Você já pode usar o MIYO no modo local.";
  DOM.sidebarSummary.textContent = `${state.data.pets.length} pets • ${state.data.pets.filter((pet) => pet.clubinho_enabled).length} clubinho • ${state.data.appointments.length} atendimentos`;
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
  syncDisclosureButtons();
}

function openSection(section) {
  state.section = section;
  DOM.navItems.forEach((button) => button.classList.toggle("is-active", button.dataset.section === section));
  DOM.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === section));
  if (DOM.headerSectionLabel) {
    DOM.headerSectionLabel.textContent = SECTION_LABELS[section] || "MIYO";
  }
}

function resetAppointmentForm() {
  DOM.appointmentForm.reset();
  DOM.appointmentDate.value = todayKey();
  DOM.appointmentTime.value = "09:00";
  DOM.appointmentPetId.value = "";
  DOM.appointmentPetSearch.value = "";
  hideAppointmentPetResults();
  if (DOM.appointmentAmountInput) {
    DOM.appointmentAmountInput.value = "";
  }
  state.appointmentFormOpen = false;
  renderServicePicker();
  syncAppointmentClubinhoUI();
  syncDisclosureButtons();
}

async function handlePetSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const hasSibling = Boolean(formData.get("has_sibling") === "on" && !state.editingPetId);
  const currentPet = state.editingPetId ? getPet(state.editingPetId) : null;
  const sharedFields = {
    tutor_name: formData.get("tutor_name").toString().trim(),
    tutor_contact: serializeTutorContacts(currentPetContactValues()),
    registration_date: formData.get("registration_date").toString(),
    family_id: currentPet?.family_id || (hasSibling ? uid() : null),
  };

  const buildPetPayload = ({
    name,
    breed,
    clubinhoEnabled,
    clubinhoPlan,
    clubinhoPrice,
    clubinhoAdhesionDate,
    notes,
  }) => ({
    ...sharedFields,
    name: String(name ?? "").trim(),
    breed: blankToNull(breed),
    clubinho_enabled: clubinhoEnabled,
    clubinho_plan: clubinhoEnabled ? String(clubinhoPlan ?? "mensal") : null,
    clubinho_price: clubinhoEnabled ? parseMoneyInput(clubinhoPrice) : null,
    clubinho_adhesion_date: clubinhoEnabled ? String(clubinhoAdhesionDate ?? "") : null,
    notes: blankToNull(notes),
  });

  const payload = buildPetPayload({
    name: formData.get("name"),
    breed: formData.get("breed"),
    clubinhoEnabled: formData.get("clubinho_enabled") === "on",
    clubinhoPlan: formData.get("clubinho_plan"),
    clubinhoPrice: formData.get("clubinho_price"),
    clubinhoAdhesionDate: formData.get("clubinho_adhesion_date"),
    notes: formData.get("notes"),
  });

  if (payload.clubinho_enabled && !payload.clubinho_price) {
    notify("Preencha o valor do pacote para o pet do Clubinho MIYO.", "warning");
    return;
  }
  if (payload.clubinho_enabled && !payload.clubinho_adhesion_date) {
    payload.clubinho_adhesion_date = payload.registration_date || todayKey();
  }

  let siblingPayload = null;
  if (hasSibling) {
    siblingPayload = buildPetPayload({
      name: formData.get("sibling_name"),
      breed: formData.get("sibling_breed"),
      clubinhoEnabled: formData.get("sibling_clubinho_enabled") === "on",
      clubinhoPlan: formData.get("sibling_clubinho_plan"),
      clubinhoPrice: formData.get("sibling_clubinho_price"),
      clubinhoAdhesionDate: formData.get("sibling_clubinho_adhesion_date"),
      notes: formData.get("sibling_notes"),
    });

    if (!siblingPayload.name) {
      notify("Preencha o nome do segundo pet para salvar a ficha conjunta.", "warning");
      return;
    }
    if (siblingPayload.clubinho_enabled && !siblingPayload.clubinho_price) {
      notify("Preencha o valor do pacote do segundo pet do Clubinho MIYO.", "warning");
      return;
    }
    if (siblingPayload.clubinho_enabled && !siblingPayload.clubinho_adhesion_date) {
      siblingPayload.clubinho_adhesion_date = siblingPayload.registration_date || todayKey();
    }
  }

  if (state.editingPetId) {
    const updated = await updateEntity("pets", state.editingPetId, payload);
    if (!updated) return;
    state.selectedPetId = state.editingPetId;
    state.petDetailsOpen = true;
    resetPetForm();
    renderAll();
    notify("Ficha do pet atualizada com sucesso.", "success");
    return;
  }

  const saved = await upsertEntity("pets", payload);
  if (!saved) return;
  let savedSibling = null;
  if (siblingPayload) {
    savedSibling = await upsertEntity("pets", siblingPayload);
    if (!savedSibling) {
      state.selectedPetId = saved.id;
      state.petDetailsOpen = true;
      resetPetForm();
      renderAll();
      notify("O primeiro pet foi salvo, mas não consegui salvar o segundo.", "warning");
      return;
    }
  }
  state.selectedPetId = saved.id;
  state.petDetailsOpen = true;
  resetPetForm();
  renderAll();
  notify(savedSibling ? "Ficha salva com os dois pets." : "Pet salvo com sucesso.", "success");
}

async function handleAppointmentSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  if (!formData.get("pet_id")) {
    syncAppointmentPetSelection({ commit: true });
  }
  const pet = getPet(DOM.appointmentPetId.value || formData.get("pet_id").toString());
  const services = selectedServiceItems();
  const isClubinho = Boolean(pet?.clubinho_enabled && formData.get("is_clubinho") === "on");

  if (!pet) {
    notify("Selecione um pet válido.", "warning");
    return;
  }
  if (!services.length) {
    notify("Selecione pelo menos um serviço realizado.", "warning");
    return;
  }
  if (isClubinho && !pet.clubinho_price) {
    notify("Esse pet do clubinho ainda não tem valor de pacote cadastrado.", "warning");
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
    amount: isClubinho ? pet.clubinho_price : parseMoneyInput(formData.get("amount")),
    is_clubinho: isClubinho,
    clubinho_slot: isClubinho ? formData.get("clubinho_slot").toString() : null,
    notes: blankToNull(formData.get("notes")),
  });
  if (!saved) return;
  resetAppointmentForm();
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
    notify("Supabase conectado com sucesso.", "success");
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
    notify(humanizeErrorMessage(error, "Não foi possível entrar na conta."), "error");
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
    notify(humanizeErrorMessage(error, "Não foi possível criar a conta."), "error");
    return;
  }
  notify("Conta criada. Se o projeto exigir confirmação por e-mail, verifique sua caixa de entrada.", "success");
}

async function handleSignOut() {
  if (!state.supabase) return;
  const { error } = await state.supabase.auth.signOut();
  if (error) {
    console.error(error);
    notify(humanizeErrorMessage(error, "Não foi possível sair da conta."), "error");
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
  DOM.appointmentToggleButton.addEventListener("click", () => {
    state.appointmentFormOpen = !state.appointmentFormOpen;
    syncDisclosureButtons();
    if (state.appointmentFormOpen) {
      DOM.appointmentCard?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  DOM.petFormToggleButton.addEventListener("click", () => {
    state.petFormOpen = !state.petFormOpen;
    if (!state.petFormOpen) {
      resetPetForm();
      return;
    }
    syncDisclosureButtons();
    DOM.petFormCard?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  DOM.petForm.addEventListener("submit", handlePetSubmit);
  DOM.appointmentForm.addEventListener("submit", handleAppointmentSubmit);
  DOM.cloudConfigForm.addEventListener("submit", handleSaveCloudConfig);
  DOM.authForm.addEventListener("submit", handleSignIn);
  DOM.signUpButton.addEventListener("click", handleSignUp);
  DOM.signOutButton.addEventListener("click", handleSignOut);
  DOM.cloudLaunchButton.addEventListener("click", () => openSection("cloud"));
  DOM.petFormCancelButton.addEventListener("click", resetPetForm);
  DOM.petDetailsCloseButton.addEventListener("click", () => {
    state.petDetailsOpen = false;
    syncDisclosureButtons();
  });
  DOM.petContactList.addEventListener("input", (event) => {
    if (event.target.matches('input[name="tutor_contact_item"]')) {
      event.target.value = formatPhoneBrazil(event.target.value);
    }
  });
  DOM.petAddContactButton.addEventListener("click", () => {
    renderPetContactInputs([...currentPetContactValues(), ""]);
    const inputs = DOM.petContactList.querySelectorAll('input[name="tutor_contact_item"]');
    inputs[inputs.length - 1]?.focus();
  });
  [DOM.petClubinhoPrice, DOM.petSiblingClubinhoPrice, DOM.appointmentAmountInput].filter(Boolean).forEach((input) => {
    input.addEventListener("blur", () => {
      input.value = formatMoneyInputValue(input.value);
    });
  });
  DOM.petSiblingToggle.addEventListener("change", syncSiblingPetFields);
  DOM.petClubinhoInput.addEventListener("change", syncPetClubinhoFields);
  DOM.petSiblingClubinhoInput.addEventListener("change", syncSiblingClubinhoFields);
  DOM.petRegistrationDate.addEventListener("change", () => {
    if (!DOM.petClubinhoAdhesionDate.value || DOM.petClubinhoAdhesionDate.value === todayKey()) {
      DOM.petClubinhoAdhesionDate.value = DOM.petRegistrationDate.value || todayKey();
    }
    if (!DOM.petSiblingClubinhoAdhesionDate.value || DOM.petSiblingClubinhoAdhesionDate.value === todayKey()) {
      DOM.petSiblingClubinhoAdhesionDate.value = DOM.petRegistrationDate.value || todayKey();
    }
  });
  DOM.appointmentPetSearch.addEventListener("input", () => syncAppointmentPetSelection());
  DOM.appointmentPetSearch.addEventListener("change", () => syncAppointmentPetSelection({ commit: true }));
  DOM.appointmentPetSearch.addEventListener("focus", () => {
    if (DOM.appointmentPetSearch.value.trim()) {
      renderAppointmentPetResults();
    }
  });
  DOM.appointmentPetSearch.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (!DOM.appointmentPetResults.matches(":hover")) {
        hideAppointmentPetResults();
      }
    }, 120);
  });
  DOM.appointmentClubinhoInput.addEventListener("change", () => {
    const pet = getPet(DOM.appointmentPetId.value);
    const enabled = Boolean(pet?.clubinho_enabled && DOM.appointmentClubinhoInput.checked);
    DOM.appointmentClubinhoFields.hidden = !enabled;
    DOM.appointmentAmountField.hidden = enabled;
    if (enabled && pet) {
      populateClubinhoSlotOptions(pet);
      return;
    }
    DOM.appointmentClubinhoSlotInput.innerHTML = "";
    DOM.appointmentClubinhoSlotInput.value = "";
    DOM.appointmentClubinhoSlotInput.disabled = true;
  });
  DOM.serviceSelectInput.addEventListener("change", () => addServiceItem(DOM.serviceSelectInput.value));
  DOM.serviceAddButton.addEventListener("click", () => addServiceItem(DOM.serviceSelectInput.value));
  DOM.syncButton.addEventListener("click", async () => {
    await refreshData();
    renderAll();
  });
  DOM.exportDataButton.addEventListener("click", exportCurrentData);
  DOM.importDataButton.addEventListener("click", () => DOM.importFileInput.click());
  DOM.importFileInput.addEventListener("change", handleImportFile);
  DOM.agendaPrevButton.addEventListener("click", () => shiftAgendaAnchor(-1));
  DOM.agendaNextButton.addEventListener("click", () => shiftAgendaAnchor(1));
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
    const appointmentPetButton = event.target.closest("[data-appointment-pet]");
    if (appointmentPetButton) {
      const pet = getPet(appointmentPetButton.dataset.appointmentPet);
      selectAppointmentPet(pet);
      return;
    }

    if (!event.target.closest(".search-combobox")) {
      hideAppointmentPetResults();
    }

    const editPetButton = event.target.closest("[data-edit-pet]");
    if (editPetButton) {
      startPetEdit(editPetButton.dataset.editPet);
      return;
    }

    const removeServiceButton = event.target.closest("[data-remove-service]");
    if (removeServiceButton) {
      removeServiceItem(removeServiceButton.dataset.removeService);
      return;
    }

    const removeContactButton = event.target.closest("[data-remove-contact]");
    if (removeContactButton) {
      const index = Number(removeContactButton.dataset.removeContact);
      const nextContacts = currentPetContactValues().filter((_value, itemIndex) => itemIndex !== index);
      renderPetContactInputs(nextContacts);
      return;
    }

    const openPetButton = event.target.closest("[data-open-pet]");
    if (openPetButton) {
      state.selectedPetId = openPetButton.dataset.openPet;
      state.petDetailsOpen = true;
      openSection("pets");
      renderPetDetails();
      return;
    }

    const agendaDayButton = event.target.closest("[data-agenda-date]");
    if (agendaDayButton) {
      setAgendaAnchor(agendaDayButton.dataset.agendaDate);
      return;
    }

    const toggleClubinhoButton = event.target.closest("[data-toggle-clubinho]");
    if (toggleClubinhoButton) {
      const petId = toggleClubinhoButton.dataset.toggleClubinho;
      state.selectedClubinhoCardId = state.selectedClubinhoCardId === petId ? null : petId;
      renderClubinhoBoard();
      return;
    }

    const renewClubinhoButton = event.target.closest("[data-renew-clubinho]");
    if (renewClubinhoButton) {
      const pet = getPet(renewClubinhoButton.dataset.renewClubinho);
      if (!pet) return;
      const renewed = await updateEntity("pets", pet.id, {
        clubinho_enabled: true,
        clubinho_adhesion_date: todayKey(),
      });
      if (!renewed) return;
      renderAll();
      notify(`Clubinho de ${pet.name} renovado a partir de hoje.`, "success");
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

    const registration = await navigator.serviceWorker.register("./sw.js?v=20260418-6", {
      updateViaCache: "none",
    });
    await registration.update();
  } catch (error) {
    console.error(error);
  }
}

async function initialize() {
  bindEvents();
  populateBreedOptions();
  renderServicePicker();
  resetAppointmentForm();
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
