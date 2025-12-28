import {
  createScheduleJob,
  getScheduleJob,
  getSchedule,
  publishSchedule,
  listScheduleJobs,
} from "../repositories/scheduleRepository.js";
import { recordAudit } from "./auditService.js";
import { runScheduler } from "./schedulerEngine.js";

export function generateSchedule({ payload, user }) {
  const result = runScheduler(payload || {});
  const job = createScheduleJob({
    input: payload || {},
    result,
    requestedBy: user?.id || "system",
  });
  return job;
}

export function getJobStatus(jobId) {
  return getScheduleJob(jobId);
}

export function listJobs() {
  return listScheduleJobs();
}

export function getScheduleInfo() {
  return getSchedule();
}

export function publishScheduleJob(user) {
  const schedule = publishSchedule();
  recordAudit({
    action: "schedule.publish",
    actorId: user.id,
    metadata: { scheduleId: schedule.id },
  });
  return schedule;
}
