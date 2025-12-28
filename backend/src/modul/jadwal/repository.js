import { randomUUID } from "crypto";

const jadwal = {
  id: randomUUID(),
  published: false,
  generatedAt: null,
  data: [],
  result: null,
  input: null,
  events: [],
  slots: [],
};

const pekerjaan = [];
const catatanPerforma = [];

export function buatJobJadwal(payload) {
  const job = {
    id: randomUUID(),
    status: "RUNNING",
    progress: 0,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  pekerjaan.push(job);
  jadwal.generatedAt = job.createdAt;
  jadwal.result = null;
  jadwal.data = [];
  if (payload?.input) {
    jadwal.input = payload.input;
    jadwal.events = payload.input?.events || [];
    jadwal.slots = payload.input?.slots || [];
  }
  jadwal.published = false;
  return job;
}

export function perbaruiJobJadwal(jobId, payload) {
  const job = pekerjaan.find((item) => item.id === jobId) || null;
  if (!job) return null;
  Object.assign(job, payload);

  if (payload?.input) {
    jadwal.input = payload.input;
    jadwal.events = payload.input?.events || [];
    jadwal.slots = payload.input?.slots || [];
  }

  if (payload?.result) {
    jadwal.result = payload.result;
    jadwal.data = payload.result?.schedule?.assignments || [];
  }

  return job;
}

export function ambilJobJadwal(jobId) {
  return pekerjaan.find((job) => job.id === jobId) || null;
}

export function daftarJobJadwal() {
  return [...pekerjaan];
}

export function ambilJadwal() {
  return jadwal;
}

export function publikasikanJadwal() {
  jadwal.published = true;
  jadwal.publishedAt = new Date().toISOString();
  return jadwal;
}

export function catatPerformaJadwal(entry) {
  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  catatanPerforma.push(record);
  return record;
}

export function daftarPerformaJadwal() {
  return [...catatanPerforma];
}
