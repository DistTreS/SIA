const defaultApiBase = "http://localhost:3000";
const viewLogin = document.querySelector('[data-view="login"]');
const viewApp = document.querySelector('[data-view="app"]');
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const apiBaseInput = document.getElementById("api-base");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logout-btn");
const navItems = document.querySelectorAll(".nav-item");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const sectionTitle = document.getElementById("section-title");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const statGuru = document.getElementById("stat-guru");
const statSiswa = document.getElementById("stat-siswa");
const statRombel = document.getElementById("stat-rombel");
const masterEntitySelect = document.getElementById("master-entity");
const masterTable = document.getElementById("master-table");
const masterMessage = document.getElementById("master-message");
const masterRefresh = document.getElementById("master-refresh");
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

const storage = {
  getToken: () => localStorage.getItem("sia_token"),
  setToken: (value) => localStorage.setItem("sia_token", value),
  clearToken: () => localStorage.removeItem("sia_token"),
  getApiBase: () => localStorage.getItem("sia_api_base"),
  setApiBase: (value) => localStorage.setItem("sia_api_base", value),
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
    "data-master.baca",
    "data-master.tulis",
    "jadwal.buat",
    "jadwal.baca",
    "jadwal.publikasi",
    "absensi.baca",
    "laporan.baca",
  ],
  "Wakil Kepala": [
    "data-master.baca",
    "data-master.tulis",
    "jadwal.buat",
    "jadwal.baca",
    "jadwal.publikasi",
    "absensi.baca",
    "laporan.baca",
  ],
  "Staff TU": [
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
  "data-master": "data-master.baca",
  absensi: "absensi.baca",
  jadwal: "jadwal.baca",
  laporan: "laporan.baca",
  pengaturan: null,
};

function setView(isLoggedIn) {
  if (isLoggedIn) {
    viewLogin.classList.add("hidden");
    viewApp.classList.remove("hidden");
  } else {
    viewApp.classList.add("hidden");
    viewLogin.classList.remove("hidden");
  }
}

function getApiBase() {
  return storage.getApiBase() || defaultApiBase;
}

function setUserInfo(user) {
  userName.textContent = user?.username || "Pengguna";
  userRole.textContent = user?.peran || "Peran";
  const initials = (user?.username || "U").slice(0, 1).toUpperCase();
  const avatar = document.querySelector(".avatar");
  if (avatar) avatar.textContent = initials;
}

function getUserPermissions(role) {
  return new Set(izinPeran[role] || []);
}

function hasPermission(role, permission) {
  if (!permission) return true;
  const izin = getUserPermissions(role);
  return izin.has("*") || izin.has(permission);
}

function applyRoleMenu(role) {
  navItems.forEach((item) => {
    const section = item.dataset.section;
    const izin = izinSection[section] || null;
    const allowed = hasPermission(role, izin);
    item.classList.toggle("hidden", !allowed);
  });
}

function updateSection(section) {
  const titles = {
    ringkasan: "Ringkasan",
    "data-master": "Data Master",
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

async function apiFetch(path, options = {}) {
  const token = storage.getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
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
    fetchStat("guru"),
    fetchStat("siswa"),
    fetchStat("rombongan-belajar"),
  ]);
  statGuru.textContent = guru ?? "--";
  statSiswa.textContent = siswa ?? "--";
  statRombel.textContent = rombel ?? "--";
}

function renderTableData(items) {
  const thead = masterTable.querySelector("thead");
  const tbody = masterTable.querySelector("tbody");
  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!items || items.length === 0) {
    masterMessage.textContent = "Belum ada data.";
    return;
  }

  const columns = Object.keys(items[0]);
  const headerRow = document.createElement("tr");
  columns.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key.replace(/_/g, " ");
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  items.forEach((item) => {
    const row = document.createElement("tr");
    columns.forEach((key) => {
      const td = document.createElement("td");
      const value = item[key];
      if (typeof value === "object" && value !== null) {
        td.textContent = JSON.stringify(value);
      } else {
        td.textContent = value ?? "-";
      }
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
}

async function loadMasterData() {
  if (!masterEntitySelect) return;
  masterMessage.textContent = "Memuat data...";
  const entitas = masterEntitySelect.value;
  const { ok, status, data } = await apiFetch(`/data-master/${entitas}`);
  if (!ok) {
    masterMessage.textContent =
      status === 403
        ? "Tidak punya akses ke data ini."
        : data?.message || "Gagal memuat data master.";
    renderTableData([]);
    return;
  }
  masterMessage.textContent = "";
  renderTableData(data?.data || []);
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
    absensiList.innerHTML = "<p class=\"helper\">Belum ada sesi untuk hari ini.</p>";
    return;
  }
  sessions.forEach((item) => {
    const panel = document.createElement("div");
    panel.className = "panel-item";
    const detail = document.createElement("div");
    const title = document.createElement("p");
    const eventLabel =
      item.event?.id || item.eventId || item.event?.classId || "Sesi";
    title.textContent = eventLabel;
    const sub = document.createElement("span");
    sub.textContent = `${item.slot?.day || ""} ${item.slot?.start || ""} - ${item.slot?.end || ""}`;
    detail.appendChild(title);
    detail.appendChild(sub);
    panel.appendChild(detail);
    const badge = document.createElement("span");
    badge.className = "badge info";
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
    row.className = "panel-item";
    const detail = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = item.label;
    const sub = document.createElement("span");
    sub.textContent = item.value;
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
    laporanBeban.innerHTML = "<p class=\"helper\">Tidak ada data beban mengajar.</p>";
    return;
  }

  daftar.forEach((item) => {
    const row = document.createElement("div");
    row.className = "panel-item";
    const detail = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = item.teacherId || "Guru";
    const sub = document.createElement("span");
    sub.textContent = `${item.totalSessions} sesi`;
    detail.appendChild(title);
    detail.appendChild(sub);
    row.appendChild(detail);
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Aktif";
    row.appendChild(badge);
    laporanBeban.appendChild(row);
  });
}

function loadPengaturan() {
  const user = storage.getUser();
  const apiBase = getApiBase();
  const token = storage.getToken();
  pengaturanInfo.innerHTML = `
    <div class="panel-item">
      <div>
        <p>Nama Pengguna</p>
        <span>${user?.username || "-"}</span>
      </div>
      <span class="badge info">${user?.peran || "-"}</span>
    </div>
    <div class="panel-item">
      <div>
        <p>API Base</p>
        <span>${apiBase}</span>
      </div>
    </div>
    <div class="panel-item">
      <div>
        <p>Token</p>
        <span>${token ? `${token.slice(0, 12)}...` : "-"}</span>
      </div>
    </div>
  `;
}

function loadSectionData(section) {
  if (section === "ringkasan") {
    loadStats();
  }
  if (section === "data-master") {
    loadMasterData();
  }
  if (section === "absensi") {
    loadAbsensi();
  }
  if (section === "jadwal") {
    loadJadwal();
  }
  if (section === "laporan") {
    loadLaporan();
  }
  if (section === "pengaturan") {
    loadPengaturan();
  }
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const apiBase = apiBaseInput.value.trim() || defaultApiBase;
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  storage.setApiBase(apiBase);

  try {
    const response = await fetch(`${apiBase}/otentikasi/masuk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      loginError.textContent = result?.message || "Login gagal.";
      return;
    }

    storage.setToken(result.token);
    storage.setUser(result.pengguna);
    setUserInfo(result.pengguna);
    applyRoleMenu(result.pengguna?.peran);
    setView(true);
    updateSection("ringkasan");
  } catch (error) {
    loginError.textContent = "Tidak bisa terhubung ke server.";
  }
});

logoutBtn?.addEventListener("click", () => {
  storage.clearToken();
  storage.clearUser();
  setView(false);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("hidden")) return;
    updateSection(item.dataset.section);
  });
});

masterRefresh?.addEventListener("click", loadMasterData);
masterEntitySelect?.addEventListener("change", loadMasterData);
absensiRefresh?.addEventListener("click", loadAbsensi);
jadwalRefresh?.addEventListener("click", loadJadwal);
laporanRefresh?.addEventListener("click", loadLaporan);

document.addEventListener("DOMContentLoaded", () => {
  apiBaseInput.value = getApiBase();
  if (absensiDateInput) {
    absensiDateInput.value = new Date().toISOString().slice(0, 10);
  }
  const token = storage.getToken();
  if (token) {
    const user = storage.getUser();
    setUserInfo(user);
    applyRoleMenu(user?.peran);
    setView(true);
    updateSection("ringkasan");
  } else {
    setView(false);
  }
});
