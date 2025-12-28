import {
  generateSchedule,
  getJobStatus,
  getScheduleInfo,
  publishScheduleJob,
} from "../services/scheduleService.js";

export function generateHandler(req, res) {
  const job = generateSchedule({ data: req.body?.data || [], user: req.user });
  res.status(202).json({ data: job });
}

export function jobStatusHandler(req, res) {
  const { jobId } = req.params;
  const job = getJobStatus(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  return res.json({ data: job });
}

export function scheduleInfoHandler(_req, res) {
  const schedule = getScheduleInfo();
  res.json({ data: schedule });
}

export function publishHandler(req, res) {
  const schedule = publishScheduleJob(req.user);
  res.json({ data: schedule });
}
