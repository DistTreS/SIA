import { randomUUID } from "crypto";

const schedule = {
  id: randomUUID(),
  published: false,
  generatedAt: null,
  data: [],
  result: null,
  lastJobId: null,
  lastJobStatus: null,
  lastJobUpdatedAt: null,
  lastPerformance: null,
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
  schedule.lastJobId = job.id;
  schedule.lastJobStatus = job.status;
  schedule.lastJobUpdatedAt = job.createdAt;
  return job;
}

export function getScheduleJob(jobId) {
  return jobs.find((job) => job.id === jobId) || null;
}

export function updateScheduleJob(jobId, updates) {
  const job = getScheduleJob(jobId);
  if (!job) return null;
  const updatedAt = updates?.updatedAt || new Date().toISOString();
  Object.assign(job, updates, { updatedAt });
  schedule.lastJobId = job.id;
  schedule.lastJobStatus = job.status;
  schedule.lastJobUpdatedAt = updatedAt;

  if (updates?.result && job.status === "SUCCESS") {
    schedule.generatedAt = job.completedAt || updatedAt;
    schedule.data = updates.result?.schedule?.assignments || [];
    schedule.result = updates.result || null;
    schedule.published = false;
  }

  if (updates?.performance) {
    schedule.lastPerformance = updates.performance;
  }

  return job;
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
