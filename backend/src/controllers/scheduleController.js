import {
  generateSchedule,
  getJobStatus,
  getScheduleInfo,
  publishScheduleJob,
  listJobs,
} from "../services/scheduleService.js";

export function generateHandler(req, res) {
  const job = generateSchedule({ payload: req.body || {}, user: req.user });
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

export function jobsListHandler(_req, res) {
  const jobs = listJobs();
  return res.json({ data: jobs });
}

export function scheduleInfoHandler(_req, res) {
  const schedule = getScheduleInfo();
  res.json({ data: schedule });
}

export function publishHandler(req, res) {
  const schedule = publishScheduleJob(req.user);
  res.json({ data: schedule });
}
