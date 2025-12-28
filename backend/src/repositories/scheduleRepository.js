import { randomUUID } from "crypto";

const schedule = {
  id: randomUUID(),
  published: false,
  generatedAt: null,
  data: [],
  result: null,
};

const jobs = [];

export function createScheduleJob(payload) {
  const job = {
    id: randomUUID(),
    status: "completed",
    createdAt: new Date().toISOString(),
    ...payload,
  };
  jobs.push(job);
  schedule.generatedAt = job.createdAt;
  schedule.data = payload?.result?.schedule?.assignments || [];
  schedule.result = payload?.result || null;
  schedule.published = false;
  return job;
}

export function getScheduleJob(jobId) {
  return jobs.find((job) => job.id === jobId) || null;
}

export function getSchedule() {
  return schedule;
}

export function publishSchedule() {
  schedule.published = true;
  schedule.publishedAt = new Date().toISOString();
  return schedule;
}
