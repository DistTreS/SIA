const defaultApiBase = "http://localhost:3000";

const navItems = document.querySelectorAll(".nav-item");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const sectionTitle = document.getElementById("section-title");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const logoutBtn = document.getElementById("logout-btn");

const statGuru = document.getElementById("stat-guru");
const statSiswa = document.getElementById("stat-siswa");
const statRombel = document.getElementById("stat-rombel");

const masterModal = document.getElementById("master-modal");
const masterModalTitle = document.getElementById("master-modal-title");
const masterModalSubtitle = document.getElementById("master-modal-subtitle");
const masterForm = document.getElementById("master-form");
const masterFormFields = document.getElementById("master-form-fields");
const masterFormError = document.getElementById("master-form-error");
const masterClose = document.getElementById("master-close");
const masterCancel = document.getElementById("master-cancel");

const masterPanels = new Map();
document.querySelectorAll("[data-master-entity]").forEach((panel) => {
  const entity = panel.dataset.masterEntity;
  masterPanels.set(entity, {
    panel,
    table: panel.querySelector("[data-master-table]"),
    message: panel.querySelector("[data-master-message]"),
    add: panel.querySelector("[data-master-add]"),
    refresh: panel.querySelector("[data-master-refresh]"),
    import: panel.querySelector("[data-import-trigger]"),
    importInput: panel.querySelector("[data-import-input]"),
  });
});

const absensiDateInput = document.getElementById("absensi-date");
const absensiRefresh = document.getElementById("absensi-refresh");
const absensiList = document.getElementById("absensi-list");
const absensiInfo = document.getElementById("absensi-info");

const jadwalRefresh = document.getElementById("jadwal-refresh");
const jadwalSummary = document.getElementById("jadwal-summary");
const jadwalInfo = document.getElementById("jadwal-info");

const laporanRefresh = document.getElementById("laporan-refresh");
const laporanSesi = document.getElementById("laporan-sesi");
const laporanRekam = document.getElementById("laporan-rekam");
const laporanBeban = document.getElementById("laporan-beban");
const laporanInfo = document.getElementById("laporan-info");

const pengaturanInfo = document.getElementById("pengaturan-info");
const periodeFilter = document.getElementById("periode-filter");
const periodeRefresh = document.getElementById("periode-refresh");

const storage = {
  getToken: () => localStorage.getItem("sia_token"),
  setToken: (value) => localStorage.setItem("sia_token", value),
  clearToken: () => localStorage.removeItem("sia_token"),
  getUser: () => {
    const data = localStorage.getItem("sia_user");
    return data ? JSON.parse(data) : null;
  },
  setUser: (value) => localStorage.setItem("sia_user", JSON.stringify(value)),
  clearUser: () => localStorage.removeItem("sia_user"),
};

const izinPeran = {
  Admin: ["*"],
  "Kepala Sekolah": [
    "otentikasi.kelola",
    "data-master.baca",
    "data-master.tulis",
    "jadwal.buat",
    "jadwal.baca",
    "jadwal.publikasi",
    "absensi.baca",
    "laporan.baca",
  ],
  "Wakil Kepala": [
    "otentikasi.kelola",
    "data-master.baca",
    "data-master.tulis",
    "jadwal.buat",
    "jadwal.baca",
    "jadwal.publikasi",
    "absensi.baca",
    "laporan.baca",
  ],
  "Staff TU": [
    "otentikasi.kelola",
    "data-master.baca",
    "data-master.tulis",
    "jadwal.buat",
    "jadwal.baca",
    "jadwal.publikasi",
    "absensi.baca",
    "laporan.baca",
  ],
  "Guru Mata Pelajaran": ["absensi.input", "absensi.baca", "jadwal.baca"],
  "Wali Kelas": ["absensi.input", "absensi.baca", "jadwal.baca"],
  "Guru BK": ["absensi.input", "absensi.baca", "jadwal.baca"],
  Wali: ["absensi.input", "absensi.baca", "jadwal.baca"],
};

const izinSection = {
  ringkasan: null,
  tendik: "data-master.baca",
  "periode-akademik": "data-master.baca",
  siswa: "data-master.baca",
  "rombongan-belajar": "data-master.baca",
  "mata-pelajaran": "data-master.baca",
  "pengampu-mapel": "data-master.baca",
  ruang: "data-master.baca",
  "jam-pelajaran": "data-master.baca",
  absensi: "absensi.baca",
  jadwal: "jadwal.baca",
  laporan: "laporan.baca",
  pengaturan: null,
};

const peranTendik = [
  "Kepala Sekolah",
  "Wakil Kepala",
  "Staff TU",
  "Guru Mata Pelajaran",
  "Wali Kelas",
  "Guru BK",
  "Wali",
];

const masterConfig = {
  tendik: {
    label: "Tendik",
    endpoint: "/tendik",
    writePermission: "data-master.tulis",
    importEndpoint: "/impor/tendik",
    columns: [
      "nip",
      "nuptk",
      "nama_lengkap",
      "email",
      "no_hp",
      "aktif",
      "akun_username",
      "akun_peran",
      "akun_aktif",
    ],
    fields: [
      {
        type: "heading",
        label: "Data Tendik",
        description: "Isi data guru/staf terlebih dahulu.",
      },
      { name: "nip", label: "NIP", type: "text", scope: "tendik" },
      { name: "nuptk", label: "NUPTK", type: "text", scope: "tendik" },
      {
        name: "nama_lengkap",
        label: "Nama Lengkap",
        type: "text",
        required: true,
        scope: "tendik",
      },
      { name: "email", label: "Email", type: "email", scope: "tendik" },
      { name: "no_hp", label: "No HP", type: "text", scope: "tendik" },
      { name: "aktif", label: "Aktif", type: "checkbox", default: true, scope: "tendik" },
      {
        type: "heading",
        label: "Akun Pengguna (Opsional)",
        description: "Isi jika tendik membutuhkan akses login.",
      },
      {
        name: "akun_username",
        label: "Username",
        type: "text",
        scope: "akun",
        source: "username",
      },
      { name: "akun_email", label: "Email Akun", type: "email", scope: "akun", source: "email" },
      {
        name: "akun_peran",
        label: "Peran",
        type: "checkbox-group",
        options: peranTendik,
        scope: "akun",
        source: "peran",
      },
      {
        name: "akun_password",
        label: "Password",
        type: "password",
        scope: "akun",
        source: "password",
      },
      {
        name: "akun_aktif",
        label: "Aktif Akun",
        type: "checkbox",
        default: true,
        scope: "akun",
        source: "aktif",
      },
    ],
  },
  siswa: {
    label: "Siswa",
    importEndpoint: "/impor/siswa",
    columns: [
      { key: "nis", label: "NIS" },
      { key: "nisn", label: "NISN" },
      { key: "nama_lengkap", label: "Nama Lengkap" },
      { key: "email", label: "Email" },
      { key: "no_hp", label: "No HP" },
      { key: "rombongan_belajar_nama", label: "Rombongan Belajar" },
      { key: "aktif", label: "Aktif" },
    ],
    fields: [
      { name: "nis", label: "NIS", type: "text" },
      { name: "nisn", label: "NISN", type: "text" },
      { name: "nama_lengkap", label: "Nama Lengkap", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "no_hp", label: "No HP", type: "text" },
      {
        name: "rombongan_belajar_id",
        label: "Rombongan Belajar",
        type: "select",
        optionsSource: "rombongan-belajar",
        optionsLabel: "nama",
        optionsValue: "id",
        optionsPeriode: true,
        valueType: "number",
      },
      { name: "aktif", label: "Aktif", type: "checkbox", default: true },
    ],
  },
  "periode-akademik": {
    label: "Periode Akademik",
    columns: ["tahun_ajaran", "semester", "tanggal_mulai", "tanggal_selesai", "aktif"],
    fields: [
      { name: "tahun_ajaran", label: "Tahun Ajaran", type: "text", required: true },
      {
        name: "semester",
        label: "Semester",
        type: "select",
        options: ["GANJIL", "GENAP"],
        required: true,
      },
      { name: "tanggal_mulai", label: "Tanggal Mulai", type: "date", required: true },
      { name: "tanggal_selesai", label: "Tanggal Selesai", type: "date", required: true },
      { name: "aktif", label: "Aktif", type: "checkbox", default: false },
    ],
  },
  "rombongan-belajar": {
    label: "Rombongan Belajar",
    requiresPeriode: true,
    columns: [
      { key: "kode", label: "Kode" },
      { key: "nama", label: "Nama" },
      { key: "tingkat", label: "Tingkat" },
      { key: "jurusan", label: "Jurusan" },
      { key: "wali_kelas_nama", label: "Wali Kelas" },
      { key: "aktif", label: "Aktif" },
    ],
    fields: [
      {
        name: "periode_akademik_id",
        label: "Periode Akademik ID",
        type: "hidden",
        required: true,
        autoValue: "periode",
        valueType: "number",
      },
      { name: "kode", label: "Kode", type: "text", required: true },
      { name: "nama", label: "Nama", type: "text", required: true },
      { name: "tingkat", label: "Tingkat", type: "number" },
      { name: "jurusan", label: "Jurusan", type: "text" },
      {
        name: "wali_kelas_guru_id",
        label: "Wali Kelas",
        type: "select",
        optionsSource: "tendik",
        optionsLabel: "nama_lengkap",
        optionsValue: "id",
        valueType: "number",
      },
      { name: "aktif", label: "Aktif", type: "checkbox", default: true },
    ],
  },
  "mata-pelajaran": {
    label: "Mata Pelajaran",
    fields: [
      { name: "kode", label: "Kode", type: "text", required: true },
      { name: "nama", label: "Nama", type: "text", required: true },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "aktif", label: "Aktif", type: "checkbox", default: true },
    ],
  },
  "pengampu-mapel": {
    label: "Pengampu Mapel",
    requiresPeriode: true,
    columns: [
      { key: "guru_nama", label: "Guru" },
      { key: "mata_pelajaran_nama", label: "Mata Pelajaran" },
      { key: "rombongan_belajar_nama", label: "Rombongan Belajar" },
    ],
    fields: [
      {
        name: "periode_akademik_id",
        label: "Periode Akademik ID",
        type: "hidden",
        required: true,
        autoValue: "periode",
        valueType: "number",
      },
      {
        name: "guru_id",
        label: "Guru",
        type: "select",
        optionsSource: "tendik",
        optionsLabel: "nama_lengkap",
        optionsValue: "id",
        required: true,
        valueType: "number",
      },
      {
        name: "mata_pelajaran_id",
        label: "Mata Pelajaran",
        type: "select",
        optionsSource: "mata-pelajaran",
        optionsLabel: "nama",
        optionsValue: "id",
        required: true,
        valueType: "number",
      },
      {
        name: "rombongan_belajar_id",
        label: "Rombongan Belajar",
        type: "select",
        optionsSource: "rombongan-belajar",
        optionsLabel: "nama",
        optionsValue: "id",
        optionsPeriode: true,
        required: true,
        valueType: "number",
      },
    ],
  },
  ruang: {
    label: "Ruang",
    fields: [
      { name: "kode", label: "Kode", type: "text", required: true },
      { name: "nama", label: "Nama", type: "text", required: true },
      { name: "kapasitas", label: "Kapasitas", type: "number" },
      { name: "lokasi", label: "Lokasi", type: "text" },
      { name: "aktif", label: "Aktif", type: "checkbox", default: true },
    ],
  },
  "jam-pelajaran": {
    label: "Jam Pelajaran",
    fields: [
      { name: "kode", label: "Kode", type: "text", required: true },
      { name: "urutan", label: "Urutan", type: "number", required: true },
      { name: "jam_mulai", label: "Jam Mulai", type: "time", required: true },
      { name: "jam_selesai", label: "Jam Selesai", type: "time", required: true },
      { name: "aktif", label: "Aktif", type: "checkbox", default: true },
    ],
  },
};

let masterItems = [];
let masterMode = "create";
let masterActiveId = null;
let masterActiveEntity = null;
let masterActiveItem = null;
let currentRole = null;
let selectedPeriodeId = null;

function getApiBase() {
  return defaultApiBase;
}

function getUserPermissions(role) {
  const roles = Array.isArray(role) ? role : role ? [role] : [];
  const izin = new Set();
  roles.forEach((item) => {
    const daftarIzin = izinPeran[item] || [];
    daftarIzin.forEach((kode) => izin.add(kode));
  });
  return izin;
}

function hasPermission(role, permission) {
  if (!permission) return true;
  const izin = getUserPermissions(role);
  return izin.has("*") || izin.has(permission);
}

function applyRoleMenu(role) {
  currentRole = role;
  navItems.forEach((item) => {
    const section = item.dataset.section;
    const izin = izinSection[section] || null;
    const allowed = hasPermission(role, izin);
    item.classList.toggle("hidden", !allowed);
  });
  masterPanels.forEach((panel, entity) => {
    const permission = masterConfig[entity]?.writePermission || "data-master.tulis";
    panel.add?.classList.toggle("hidden", !hasPermission(role, permission));
    panel.import?.classList.toggle("hidden", !hasPermission(role, permission));
  });
}

function setUserInfo(user) {
  userName.textContent = user?.username || "Pengguna";
  const daftarPeran = Array.isArray(user?.peran)
    ? user.peran
    : user?.peran
    ? [user.peran]
    : [];
  userRole.textContent = daftarPeran.length ? daftarPeran.join(", ") : "Peran";
}

async function apiFetch(path, options = {}) {
  const token = storage.getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });
  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
}

async function fetchStat(entitas) {
  const { ok, data } = await apiFetch(`/data-master/${entitas}`);
  if (!ok) return null;
  return Array.isArray(data?.data) ? data.data.length : null;
}

async function loadStats() {
  const [guru, siswa, rombel] = await Promise.all([
    fetchStat("tendik"),
    fetchStat("siswa"),
    fetchStat("rombongan-belajar"),
  ]);
  statGuru.textContent = guru ?? "--";
  statSiswa.textContent = siswa ?? "--";
  statRombel.textContent = rombel ?? "--";
}

function formatPeriodeLabel(item) {
  if (!item) return "-";
  const semester = item.semester ? `(${item.semester})` : "";
  return `${item.tahun_ajaran || ""} ${semester}`.trim();
}

async function fetchReferenceList(entitas, options = {}) {
  const query =
    options.periode && selectedPeriodeId ? `?periode_akademik_id=${selectedPeriodeId}` : "";
  const { ok, data } = await apiFetch(`/data-master/${entitas}${query}`);
  return ok && Array.isArray(data?.data) ? data.data : [];
}

function buildReferenceMap(items, valueKey) {
  const map = new Map();
  items.forEach((item) => {
    if (item?.id === undefined || item?.id === null) return;
    map.set(String(item.id), item?.[valueKey] ?? "-");
  });
  return map;
}

async function resolveSelectOptions(field) {
  if (Array.isArray(field.options)) {
    return field.options;
  }
  if (!field.optionsSource) {
    return [];
  }
  const items = await fetchReferenceList(field.optionsSource, {
    periode: field.optionsPeriode,
  });
  const valueKey = field.optionsValue || "id";
  const labelKey = field.optionsLabel || "nama";
  return items.map((item) => ({
    value: item?.[valueKey],
    label: item?.[labelKey] ?? "-",
  }));
}

async function enrichMasterItems(entity, items) {
  if (!Array.isArray(items) || items.length === 0) return items || [];
  if (entity === "siswa") {
    const rombelList = await fetchReferenceList("rombongan-belajar");
    const rombelMap = buildReferenceMap(rombelList, "nama");
    return items.map((item) => ({
      ...item,
      rombongan_belajar_nama:
        rombelMap.get(String(item.rombongan_belajar_id)) || "-",
    }));
  }
  if (entity === "rombongan-belajar") {
    const tendikList = await fetchReferenceList("tendik");
    const tendikMap = buildReferenceMap(tendikList, "nama_lengkap");
    return items.map((item) => ({
      ...item,
      wali_kelas_nama: tendikMap.get(String(item.wali_kelas_guru_id)) || "-",
    }));
  }
  if (entity === "pengampu-mapel") {
    const [tendikList, mapelList, rombelList] = await Promise.all([
      fetchReferenceList("tendik"),
      fetchReferenceList("mata-pelajaran"),
      fetchReferenceList("rombongan-belajar", { periode: true }),
    ]);
    const tendikMap = buildReferenceMap(tendikList, "nama_lengkap");
    const mapelMap = buildReferenceMap(mapelList, "nama");
    const rombelMap = buildReferenceMap(rombelList, "nama");
    return items.map((item) => ({
      ...item,
      guru_nama: tendikMap.get(String(item.guru_id)) || "-",
      mata_pelajaran_nama: mapelMap.get(String(item.mata_pelajaran_id)) || "-",
      rombongan_belajar_nama:
        rombelMap.get(String(item.rombongan_belajar_id)) || "-",
    }));
  }
  return items;
}

async function loadPeriodeOptions() {
  if (!periodeFilter) return;
  const { ok, data } = await apiFetch("/data-master/periode-akademik");
  if (!ok) {
    periodeFilter.innerHTML = "<option value=\"\">Gagal memuat periode</option>";
    return;
  }
  const items = Array.isArray(data?.data) ? data.data : [];
  const active = items.find((item) => item.aktif);
  const existingSelection = selectedPeriodeId || active?.id || "";
  periodeFilter.innerHTML = "<option value=\"\">Pilih Periode</option>";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPeriodeLabel(item);
    if (String(item.id) === String(existingSelection)) {
      option.selected = true;
    }
    periodeFilter.appendChild(option);
  });
  selectedPeriodeId = periodeFilter.value || null;
}

function renderTableData(entity, items) {
  const panel = masterPanels.get(entity);
  if (!panel?.table) return;
  const config = masterConfig[entity] || {};
  const thead = panel.table.querySelector("thead");
  const tbody = panel.table.querySelector("tbody");
  thead.innerHTML = "";
  tbody.innerHTML = "";
  masterItems = items || [];

  if (!items || items.length === 0) {
    if (panel.message) panel.message.textContent = "Belum ada data.";
    return;
  }

  const columns =
    Array.isArray(config.columns) && config.columns.length
      ? config.columns
      : Object.keys(items[0]);
  const resolvedColumns = columns
    .map((column) => {
      if (typeof column === "string") {
        return { key: column, label: column.replace(/_/g, " ") };
      }
      if (column && typeof column === "object" && column.key) {
        return {
          key: column.key,
          label: column.label || column.key.replace(/_/g, " "),
        };
      }
      return null;
    })
    .filter(Boolean);
  const headerRow = document.createElement("tr");
  resolvedColumns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column.label;
    th.className =
      "border-b border-[#f0e5d7] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted";
    headerRow.appendChild(th);
  });
  const canWrite = hasPermission(
    currentRole,
    config.writePermission || "data-master.tulis"
  );
  if (canWrite) {
    const actionHeader = document.createElement("th");
    actionHeader.textContent = "Aksi";
    actionHeader.className =
      "border-b border-[#f0e5d7] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted";
    headerRow.appendChild(actionHeader);
  }
  thead.appendChild(headerRow);

  items.forEach((item) => {
    const row = document.createElement("tr");
    resolvedColumns.forEach((column) => {
      const key = column.key;
      const td = document.createElement("td");
      const value = item[key];
      td.className = "border-b border-[#f0e5d7] px-3 py-2 text-sm";
      if (Array.isArray(value)) {
        td.textContent = value.join(", ");
      } else if (typeof value === "object" && value !== null) {
        td.textContent = JSON.stringify(value);
      } else {
        td.textContent = value ?? "-";
      }
      row.appendChild(td);
    });
    if (canWrite) {
      const actionCell = document.createElement("td");
      actionCell.className = "border-b border-[#f0e5d7] px-3 py-2";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className =
        "mr-2 rounded-full border border-[#e4d8c9] px-3 py-1 text-xs font-semibold text-ink hover:border-accent hover:text-accent";
      editBtn.textContent = "Ubah";
      editBtn.addEventListener("click", () => openMasterForm("edit", item, entity));
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className =
        "rounded-full border border-[#f0cfc7] px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400";
      deleteBtn.textContent = "Hapus";
      deleteBtn.addEventListener("click", () => deleteMasterItem(item, entity));
      actionCell.appendChild(editBtn);
      actionCell.appendChild(deleteBtn);
      row.appendChild(actionCell);
    }
    tbody.appendChild(row);
  });
}

async function loadMasterData(entity) {
  const panel = masterPanels.get(entity);
  if (!panel) return;
  const config = masterConfig[entity] || {};
  if (panel.message) panel.message.textContent = "Memuat data...";
  if (config.requiresPeriode && !selectedPeriodeId) {
    if (panel.message) {
      panel.message.textContent = "Pilih periode akademik terlebih dahulu.";
    }
    renderTableData(entity, []);
    return;
  }
  const query = config.requiresPeriode ? `?periode_akademik_id=${selectedPeriodeId}` : "";
  const path = `${config.endpoint || `/data-master/${entity}`}${query}`;
  const { ok, status, data } = await apiFetch(path);
  if (!ok) {
    if (panel.message) {
      panel.message.textContent =
        status === 403
          ? "Tidak punya akses ke data ini."
          : data?.message || "Gagal memuat data master.";
    }
    renderTableData(entity, []);
    return;
  }
  if (panel.message) panel.message.textContent = "";
  const rawItems = Array.isArray(data?.data) ? data.data : [];
  const items = await enrichMasterItems(entity, rawItems);
  renderTableData(entity, items);
}

function shouldShowField(field, mode) {
  if (field.showOn === "create") return mode === "create";
  if (field.showOn === "edit") return mode === "edit";
  return true;
}

function isFieldRequired(field, mode) {
  if (mode === "create" && field.requiredOnCreate) return true;
  if (mode === "edit" && field.requiredOnEdit) return true;
  return !!field.required;
}

function buildField(field, value = null) {
  if (field.type === "heading") {
    const heading = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = field.label;
    title.className = "text-sm font-semibold text-ink";
    heading.appendChild(title);
    if (field.description) {
      const desc = document.createElement("p");
      desc.textContent = field.description;
      desc.className = "mt-1 text-xs text-muted";
      heading.appendChild(desc);
    }
    return heading;
  }
  if (field.type === "hidden") {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.name;
    input.dataset.fieldType = field.type || "text";
    if (value !== null && value !== undefined) {
      input.value = value;
    }
    return input;
  }
  const wrapper = document.createElement("label");
  wrapper.className = "block text-sm font-medium text-ink";
  const title = document.createElement("span");
  title.textContent = field.label;
  wrapper.appendChild(title);

  let input = null;
  if (field.type === "textarea") {
    input = document.createElement("textarea");
    input.rows = 3;
    input.className =
      "mt-2 w-full rounded-2xl border border-[#e4d8c9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40";
  } else if (field.type === "select") {
    input = document.createElement("select");
    input.className =
      "mt-2 w-full rounded-2xl border border-[#e4d8c9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = field.placeholder || `Pilih ${field.label}`;
    placeholder.disabled = isFieldRequired(field, masterMode);
    placeholder.selected = value === null || value === undefined || value === "";
    input.appendChild(placeholder);
    (field.options || []).forEach((option) => {
      const opt = document.createElement("option");
      if (typeof option === "string") {
        opt.value = option;
        opt.textContent = option;
      } else if (option && typeof option === "object") {
        const optionValue = option.value ?? option.id ?? "";
        const optionLabel =
          option.label ?? option.nama ?? option.value ?? optionValue ?? "-";
        if (optionValue === "") return;
        opt.value = optionValue;
        opt.textContent = optionLabel;
      }
      input.appendChild(opt);
    });
  } else if (field.type === "checkbox") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.className = "mt-2 h-4 w-4 accent-accent";
  } else if (field.type === "checkbox-group") {
    input = document.createElement("div");
    input.className = "mt-2 grid gap-2";
    (field.options || []).forEach((option) => {
      const item = document.createElement("label");
      item.className = "flex items-center gap-2 text-sm text-ink";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = field.name;
      checkbox.value = typeof option === "string" ? option : option.value;
      checkbox.className = "h-4 w-4 accent-accent";
      const label = document.createElement("span");
      label.textContent = typeof option === "string" ? option : option.label;
      item.appendChild(checkbox);
      item.appendChild(label);
      input.appendChild(item);
    });
  } else {
    input = document.createElement("input");
    input.type = field.type || "text";
    input.className =
      "mt-2 w-full rounded-2xl border border-[#e4d8c9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40";
  }

  if (field.type !== "checkbox-group") {
    input.name = field.name;
    if (isFieldRequired(field, masterMode)) {
      input.required = true;
    }
    input.dataset.fieldType = field.type || "text";

    if (field.type === "checkbox") {
      input.checked = value ?? field.default ?? false;
    } else if (value !== null && value !== undefined) {
      input.value = value;
    }
  } else if (Array.isArray(value)) {
    const selected = new Set(value.map((item) => String(item)));
    input.querySelectorAll(`input[name="${field.name}"]`).forEach((checkbox) => {
      checkbox.checked = selected.has(String(checkbox.value));
    });
  }

  wrapper.appendChild(input);
  return wrapper;
}

async function openMasterForm(mode, item = null, entity = null) {
  masterMode = mode;
  masterActiveEntity = entity || masterActiveEntity;
  masterActiveId = item?.id || null;
  masterActiveItem = item || null;
  masterFormError.textContent = "";
  const config = masterConfig[masterActiveEntity];
  masterModalTitle.textContent =
    mode === "edit"
      ? `Ubah ${config?.label || "Data"}`
      : `Tambah ${config?.label || "Data"}`;
  masterModalSubtitle.textContent =
    mode === "edit" ? "Perbarui data yang diperlukan." : "Lengkapi data sesuai kebutuhan.";
  masterFormFields.innerHTML = "";

  if (!config) {
    masterFormError.textContent = "Konfigurasi form belum tersedia.";
    masterModal.classList.remove("hidden");
    masterModal.classList.add("flex");
    return;
  }

  const resolvedFields = await Promise.all(
    config.fields.map(async (field) => {
      if (field.type !== "select") {
        return field;
      }
      const options = await resolveSelectOptions(field);
      return { ...field, options };
    })
  );

  resolvedFields.forEach((field) => {
    if (!shouldShowField(field, mode)) return;
    let value = field.type === "password" ? null : item ? item[field.name] : null;
    if ((value === null || value === undefined) && mode === "create") {
      if (field.autoValue === "periode") {
        value = selectedPeriodeId || null;
      }
    }
    const fieldNode = buildField(field, value);
    masterFormFields.appendChild(fieldNode);
  });

  masterModal.classList.remove("hidden");
  masterModal.classList.add("flex");
}

function closeMasterForm() {
  masterModal.classList.add("hidden");
  masterModal.classList.remove("flex");
  masterActiveId = null;
  masterActiveEntity = null;
  masterActiveItem = null;
  masterFormError.textContent = "";
}

masterModal?.addEventListener("click", (event) => {
  if (event.target === masterModal) {
    closeMasterForm();
  }
});

function collectMasterPayload() {
  const config = masterConfig[masterActiveEntity];
  if (!config) return {};
  const payload = {};
  const grouped = {};
  config.fields.forEach((field) => {
    if (field.type === "heading") return;
    if (field.type === "checkbox-group") {
      const selected = Array.from(
        masterFormFields.querySelectorAll(`[name="${field.name}"]:checked`)
      ).map((input) => input.value);
      if (!selected.length && !isFieldRequired(field, masterMode)) {
        return;
      }
      const target = field.scope
        ? (grouped[field.scope] = grouped[field.scope] || {})
        : payload;
      target[field.source || field.name] = selected;
      return;
    }
    const input = masterFormFields.querySelector(`[name="${field.name}"]`);
    if (!input) return;
    if (field.type === "checkbox") {
      const target = field.scope
        ? (grouped[field.scope] = grouped[field.scope] || {})
        : payload;
      target[field.source || field.name] = input.checked;
      return;
    }
    const type = input.dataset.fieldType || field.type;
    const valueType = field.valueType || type;
    if (input.value === "" && !isFieldRequired(field, masterMode)) {
      return;
    }
    if (valueType === "number") {
      const target = field.scope
        ? (grouped[field.scope] = grouped[field.scope] || {})
        : payload;
      target[field.source || field.name] =
        input.value === "" ? null : Number(input.value);
      return;
    }
    const target = field.scope
      ? (grouped[field.scope] = grouped[field.scope] || {})
      : payload;
    target[field.source || field.name] = input.value;
  });
  if (Object.keys(grouped).length) {
    return { ...payload, ...grouped };
  }
  return payload;
}

async function submitMasterForm(event) {
  event.preventDefault();
  masterFormError.textContent = "";
  const entitas = masterActiveEntity;
  if (!entitas) {
    masterFormError.textContent = "Entitas belum dipilih.";
    return;
  }
  const config = masterConfig[entitas] || {};
  const payload = collectMasterPayload();
  const basePath = config.endpoint || `/data-master/${entitas}`;

  if (entitas === "tendik" && payload.akun) {
    const akun = payload.akun;
    const isFilled = (value) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "";
    const hasIdentity = ["username", "email", "peran", "password", "kataSandi"].some(
      (key) => isFilled(akun[key])
    );
    const hasAnyField = ["username", "email", "peran", "password", "kataSandi", "aktif"]
      .some((key) => isFilled(akun[key]));
    const hasExisting = Boolean(masterActiveItem?.akun_id);
    if (!hasAnyField || (!hasIdentity && !hasExisting)) {
      delete payload.akun;
    }
  }
  const request =
    masterMode === "edit" && masterActiveId
      ? apiFetch(`${basePath}/${masterActiveId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : apiFetch(`${basePath}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
  const { ok, data } = await request;
  if (!ok) {
    masterFormError.textContent = data?.message || "Gagal menyimpan data.";
    return;
  }
  closeMasterForm();
  loadMasterData(entitas);
}

async function deleteMasterItem(item, entity) {
  if (!item?.id) return;
  const entitas = entity || masterActiveEntity;
  if (!entitas) return;
  const basePath = masterConfig[entitas]?.endpoint || `/data-master/${entitas}`;
  const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
  if (!confirmDelete) return;
  const { ok, data } = await apiFetch(`${basePath}/${item.id}`, {
    method: "DELETE",
  });
  if (!ok) {
    const panel = masterPanels.get(entitas);
    if (panel?.message) {
      panel.message.textContent = data?.message || "Gagal menghapus data.";
    }
    return;
  }
  loadMasterData(entitas);
}

async function uploadImportFile(entity, file) {
  const panel = masterPanels.get(entity);
  if (!panel) return;
  if (!file) return;
  const config = masterConfig[entity] || {};
  if (!config.importEndpoint) {
    panel.message.textContent = "Impor belum tersedia untuk menu ini.";
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  panel.message.textContent = "Mengunggah file...";
  const token = storage.getToken();
  const response = await fetch(`${getApiBase()}${config.importEndpoint}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    panel.message.textContent = result?.message || "Gagal impor data.";
    return;
  }
  const data = result?.data;
  panel.message.textContent = `Impor selesai: berhasil ${data?.berhasil || 0}, duplikat ${
    data?.duplikat || 0
  }, gagal ${data?.gagal || 0}.`;
  await loadMasterData(entity);
}

async function loadAbsensi() {
  absensiList.innerHTML = "";
  absensiInfo.textContent = "Memuat...";
  const date = absensiDateInput.value;
  const query = date ? `?date=${date}` : "";
  const { ok, data } = await apiFetch(`/absensi/hari-ini${query}`);
  if (!ok) {
    absensiInfo.textContent = data?.message || "Gagal memuat jadwal.";
    return;
  }
  const result = data?.data;
  absensiInfo.textContent = `${result?.day || "-"}, ${result?.date || "-"}`;
  const sessions = result?.sessions || [];
  if (sessions.length === 0) {
    absensiList.innerHTML = "<p class=\"text-sm text-muted\">Belum ada sesi untuk hari ini.</p>";
    return;
  }
  sessions.forEach((item) => {
    const panel = document.createElement("div");
    panel.className =
      "flex items-center justify-between rounded-xl bg-[#fdf7ef] px-4 py-3";
    const detail = document.createElement("div");
    const title = document.createElement("p");
    const eventLabel =
      item.event?.id || item.eventId || item.event?.classId || "Sesi";
    title.textContent = eventLabel;
    title.className = "text-sm font-semibold";
    const sub = document.createElement("span");
    sub.textContent = `${item.slot?.day || ""} ${item.slot?.start || ""} - ${item.slot?.end || ""}`;
    sub.className = "text-xs text-muted";
    detail.appendChild(title);
    detail.appendChild(sub);
    panel.appendChild(detail);
    const badge = document.createElement("span");
    badge.className =
      "rounded-full bg-[#dbe8f4] px-3 py-1 text-xs font-semibold text-[#235a87]";
    badge.textContent = "Siap";
    panel.appendChild(badge);
    absensiList.appendChild(panel);
  });
}

async function loadJadwal() {
  jadwalSummary.innerHTML = "";
  jadwalInfo.textContent = "Memuat...";
  const { ok, data } = await apiFetch("/jadwal");
  if (!ok) {
    jadwalInfo.textContent = data?.message || "Gagal memuat jadwal.";
    return;
  }
  const jadwal = data?.data || {};
  jadwalInfo.textContent = jadwal.published ? "Sudah dipublikasikan" : "Draft";
  const items = [
    { label: "Jumlah Event", value: (jadwal.events || []).length },
    { label: "Jumlah Slot", value: (jadwal.slots || []).length },
    { label: "Jumlah Penugasan", value: (jadwal.data || []).length },
    { label: "Generated At", value: jadwal.generatedAt || "-" },
  ];
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className =
      "flex items-center justify-between rounded-xl bg-[#fdf7ef] px-4 py-3";
    const detail = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = item.label;
    title.className = "text-sm font-semibold";
    const sub = document.createElement("span");
    sub.textContent = item.value;
    sub.className = "text-xs text-muted";
    detail.appendChild(title);
    detail.appendChild(sub);
    row.appendChild(detail);
    jadwalSummary.appendChild(row);
  });
}

async function loadLaporan() {
  laporanInfo.textContent = "Memuat...";
  laporanBeban.innerHTML = "";
  const [absensi, beban] = await Promise.all([
    apiFetch("/laporan/absensi"),
    apiFetch("/laporan/beban-mengajar"),
  ]);

  if (absensi.ok) {
    laporanSesi.textContent = absensi.data?.data?.totalSessions ?? "--";
    laporanRekam.textContent = absensi.data?.data?.totalRecords ?? "--";
  } else {
    laporanSesi.textContent = "--";
    laporanRekam.textContent = "--";
  }

  if (!beban.ok) {
    laporanInfo.textContent = beban.data?.message || "Gagal memuat laporan.";
    return;
  }

  const daftar = beban.data?.data || [];
  laporanInfo.textContent = daftar.length ? "Terbaru" : "Belum ada data.";
  if (!daftar.length) {
    laporanBeban.innerHTML =
      "<p class=\"text-sm text-muted\">Tidak ada data beban mengajar.</p>";
    return;
  }

  daftar.forEach((item) => {
    const row = document.createElement("div");
    row.className =
      "flex items-center justify-between rounded-xl bg-[#fdf7ef] px-4 py-3";
    const detail = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = item.teacherId || "Guru";
    title.className = "text-sm font-semibold";
    const sub = document.createElement("span");
    sub.textContent = `${item.totalSessions} sesi`;
    sub.className = "text-xs text-muted";
    detail.appendChild(title);
    detail.appendChild(sub);
    row.appendChild(detail);
    const badge = document.createElement("span");
    badge.className =
      "rounded-full bg-[#d7ead4] px-3 py-1 text-xs font-semibold text-[#2c5f2d]";
    badge.textContent = "Aktif";
    row.appendChild(badge);
    laporanBeban.appendChild(row);
  });
}

function loadPengaturan() {
  const user = storage.getUser();
  const token = storage.getToken();
  pengaturanInfo.innerHTML = `
    <div class="flex items-center justify-between rounded-xl bg-[#fdf7ef] px-4 py-3">
      <div>
        <p class="text-sm font-semibold">Nama Pengguna</p>
        <span class="text-xs text-muted">${user?.username || "-"}</span>
      </div>
      <span class="rounded-full bg-[#dbe8f4] px-3 py-1 text-xs font-semibold text-[#235a87]">
        ${user?.peran || "-"}
      </span>
    </div>
    <div class="flex items-center justify-between rounded-xl bg-[#fdf7ef] px-4 py-3">
      <div>
        <p class="text-sm font-semibold">Token</p>
        <span class="text-xs text-muted">${token ? `${token.slice(0, 12)}...` : "-"}</span>
      </div>
    </div>
  `;
}

function loadSectionData(section) {
  if (section === "ringkasan") loadStats();
  if (masterPanels.has(section)) loadMasterData(section);
  if (section === "absensi") loadAbsensi();
  if (section === "jadwal") loadJadwal();
  if (section === "laporan") loadLaporan();
  if (section === "pengaturan") loadPengaturan();
}

function updateSection(section) {
  const titles = {
    ringkasan: "Ringkasan",
    tendik: "Tendik",
    "periode-akademik": "Periode Akademik",
    siswa: "Siswa",
    "rombongan-belajar": "Rombongan Belajar",
    "mata-pelajaran": "Mata Pelajaran",
    "pengampu-mapel": "Pengampu Mapel",
    ruang: "Ruang",
    "jam-pelajaran": "Jam Pelajaran",
    absensi: "Absensi",
    jadwal: "Jadwal",
    laporan: "Laporan",
    pengaturan: "Pengaturan",
  };
  sectionTitle.textContent = titles[section] || "Ringkasan";

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.section === section);
  });

  sectionPanels.forEach((panel) => {
    panel.classList.toggle(
      "hidden",
      panel.dataset.sectionPanel !== section
    );
  });

  loadSectionData(section);
}

function getFirstAllowedSection(role) {
  return (
    Object.keys(izinSection).find((section) =>
      hasPermission(role, izinSection[section])
    ) || "ringkasan"
  );
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("hidden")) return;
    updateSection(item.dataset.section);
  });
});

masterPanels.forEach((panel, entity) => {
  panel.refresh?.addEventListener("click", () => loadMasterData(entity));
  panel.add?.addEventListener("click", () => openMasterForm("create", null, entity));
  panel.import?.addEventListener("click", () => {
    panel.importInput?.click();
  });
  panel.importInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadImportFile(entity, file).finally(() => {
      event.target.value = "";
    });
  });
});
masterClose?.addEventListener("click", closeMasterForm);
masterCancel?.addEventListener("click", closeMasterForm);
masterForm?.addEventListener("submit", submitMasterForm);
absensiRefresh?.addEventListener("click", loadAbsensi);
jadwalRefresh?.addEventListener("click", loadJadwal);
laporanRefresh?.addEventListener("click", loadLaporan);
periodeRefresh?.addEventListener("click", loadPeriodeOptions);
periodeFilter?.addEventListener("change", () => {
  selectedPeriodeId = periodeFilter.value || null;
  const activeSection = Array.from(navItems).find((item) =>
    item.classList.contains("active")
  );
  if (activeSection) {
    updateSection(activeSection.dataset.section);
  }
});

logoutBtn?.addEventListener("click", () => {
  storage.clearToken();
  storage.clearUser();
  window.location.href = "/login";
});

document.addEventListener("DOMContentLoaded", () => {
  const token = storage.getToken();
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const user = storage.getUser();
  setUserInfo(user);
  applyRoleMenu(user?.peran);
  if (absensiDateInput) {
    absensiDateInput.value = new Date().toISOString().slice(0, 10);
  }
  const firstSection = getFirstAllowedSection(user?.peran);
  loadPeriodeOptions().finally(() => updateSection(firstSection));
});
