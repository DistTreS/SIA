import {
  buatJadwal,
  ambilStatusJob,
  ambilInfoJadwal,
  publikasikanJadwalJob,
  daftarJob,
} from "./layanan.js";

export function buatJadwalHandler(req, res) {
  const job = buatJadwal({ payload: req.body || {}, user: req.user });
  res.status(202).json({ data: job });
}

export function statusJobHandler(req, res) {
  const { jobId } = req.params;
  const job = ambilStatusJob(jobId);
  if (!job) {
    return res.status(404).json({ message: "Pekerjaan tidak ditemukan" });
  }
  return res.json({ data: job });
}

export function daftarJobHandler(_req, res) {
  const jobs = daftarJob();
  return res.json({ data: jobs });
}

export function infoJadwalHandler(_req, res) {
  const schedule = ambilInfoJadwal();
  res.json({ data: schedule });
}

export function publikasiHandler(req, res) {
  const schedule = publikasikanJadwalJob(req.user);
  res.json({ data: schedule });
}
