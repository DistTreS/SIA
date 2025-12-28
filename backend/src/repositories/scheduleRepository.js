import { randomUUID } from "crypto";

const schedule = {
  id: randomUUID(),
  published: false,
  generatedAt: null,
  data: [],
  result: null,
  input: null,
  events: [],
  slots: [],
};

const jobs = [];
const performanceLogs = [];

export function createScheduleJob(payload) {
  const job = {
    id: randomUUID(),
    status: "RUNNING",
    progress: 0,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  jobs.push(job);
  schedule.generatedAt = job.createdAt;
  schedule.data = payload?.result?.schedule?.assignments || [];
  schedule.result = payload?.result || null;
  schedule.input = payload?.input || null;
  schedule.events = payload?.input?.events || [];
  schedule.slots = payload?.input?.slots || [];
  schedule.published = false;
  return job;
}

export function getScheduleJob(jobId) {
  return jobs.find((job) => job.id === jobId) || null;
}

export function listScheduleJobs() {
  return [...jobs];
}

export function getSchedule() {
  return schedule;
}

export function publishSchedule() {
  schedule.published = true;
  schedule.publishedAt = new Date().toISOString();
  return schedule;
}

export function recordSchedulePerformance(entry) {
  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  performanceLogs.push(record);
  return record;
}

export function listSchedulePerformance() {
  return [...performanceLogs];
}
