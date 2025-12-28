import {
  buatJobJadwal,
  ambilJobJadwal,
  ambilJadwal,
  publikasikanJadwal,
  catatPerformaJadwal,
  perbaruiJobJadwal,
  daftarJobJadwal,
} from "./repository.js";
import { catatAudit } from "../audit/layanan.js";
import { runScheduler } from "./mesin-penjadwalan.js";

export function buatJadwal({ payload, user }) {
  const job = buatJobJadwal({
    input: payload || {},
    requestedBy: user?.id || "system",
  });
  const requestedBy = user?.id || "system";
  setImmediate(() => {
    try {
      const startedAt = new Date().toISOString();
      const result = runScheduler(payload || {});
      const completedAt = new Date().toISOString();
      const performance = {
        runtime: result.runtime,
        penalty: result.penalty,
        startedAt,
        completedAt,
      };
      perbaruiJobJadwal(job.id, {
        status: "SUCCESS",
        progress: 100,
        completedAt,
        result,
        performance,
      });
      catatPerformaJadwal({
        jobId: job.id,
        requestedBy,
        ...performance,
      });
    } catch (error) {
      perbaruiJobJadwal(job.id, {
        status: "FAILED",
        progress: 100,
        completedAt: new Date().toISOString(),
        error: error?.message || "Penjadwalan gagal",
      });
    }
  });
  return job;
}

export function ambilStatusJob(jobId) {
  return ambilJobJadwal(jobId);
}

export function daftarJob() {
  return daftarJobJadwal();
}

export function ambilInfoJadwal() {
  return ambilJadwal();
}

export function publikasikanJadwalJob(user) {
  const schedule = publikasikanJadwal();
  catatAudit({
    action: "jadwal.publikasi",
    actorId: user.id,
    metadata: { scheduleId: schedule.id },
  });
  return schedule;
}
