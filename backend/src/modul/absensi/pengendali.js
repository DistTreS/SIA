import {
  inputSesiAbsensi,
  rekapByKelas,
  rekapBySiswa,
  ambilJadwalHariIni,
} from "./layanan.js";

export function inputSesi(req, res, next) {
  try {
    const { classId, kelasId, slotId, date, records } = req.body;
    const resolvedClassId = classId || kelasId;
    if (!resolvedClassId || !slotId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "Payload tidak valid" });
    }
    const session = inputSesiAbsensi({
      classId: resolvedClassId,
      slotId,
      date,
      records,
      user: req.user,
    });
    return res.status(201).json({ data: session });
  } catch (error) {
    return next(error);
  }
}

export function rekapKelas(req, res) {
  const { kelasId } = req.params;
  const data = rekapByKelas(kelasId);
  res.json({ data });
}

export function rekapSiswa(req, res) {
  const { siswaId } = req.params;
  const data = rekapBySiswa(siswaId);
  res.json({ data });
}

export function jadwalHariIniHandler(req, res, next) {
  try {
    const data = ambilJadwalHariIni(req.query.date);
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
}
