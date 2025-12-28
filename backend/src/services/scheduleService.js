import {
  createScheduleJob,
  getScheduleJob,
  getSchedule,
  publishSchedule,
  recordSchedulePerformance,
  updateScheduleJob,
} from "../repositories/scheduleRepository.js";
import { recordAudit } from "./auditService.js";
import { runScheduler } from "./schedulerEngine.js";

export function generateSchedule({ payload, user }) {
  const job = createScheduleJob({
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
      updateScheduleJob(job.id, {
        status: "SUCCESS",
        progress: 100,
        completedAt,
        result,
        performance,
      });
      recordSchedulePerformance({
        jobId: job.id,
        requestedBy,
        ...performance,
      });
    } catch (error) {
      updateScheduleJob(job.id, {
        status: "FAILED",
        progress: 100,
        completedAt: new Date().toISOString(),
        error: error?.message || "Scheduler failed",
      });
    }
  });
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
