import { randomUUID } from "crypto";

const sesiAbsensi = [];

export function buatSesiAbsensi(payload) {
  const session = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };
  sesiAbsensi.push(session);
  return session;
}

export function daftarSesiAbsensi() {
  return [...sesiAbsensi];
}

export function daftarByKelas(classId) {
  return sesiAbsensi.filter((session) => session.classId === classId);
}

export function daftarBySiswa(studentId) {
  return sesiAbsensi.filter((session) =>
    session.records.some((record) => record.studentId === studentId)
  );
}
