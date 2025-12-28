import {
  createScheduleJob,
  getScheduleJob,
  getSchedule,
  publishSchedule,
} from "../repositories/scheduleRepository.js";
import { recordAudit } from "./auditService.js";

export function generateSchedule({ data, user }) {
  const job = createScheduleJob({ data, requestedBy: user.id });
  return job;
}

export function getJobStatus(jobId) {
  return getScheduleJob(jobId);
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
