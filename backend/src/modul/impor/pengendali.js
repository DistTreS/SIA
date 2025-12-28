import { imporTendik, imporSiswa } from "./layanan.js";

function pastikanFile(req, res) {
  if (!req.file) {
    res.status(400).json({ message: "File Excel wajib diunggah" });
    return false;
  }
  return true;
}

export async function imporTendikHandler(req, res, next) {
  try {
    if (!pastikanFile(req, res)) return;
    const hasil = await imporTendik(req.file.buffer);
    res.json({ data: hasil });
  } catch (error) {
    next(error);
  }
}

export async function imporSiswaHandler(req, res, next) {
  try {
    if (!pastikanFile(req, res)) return;
    const hasil = await imporSiswa(req.file.buffer);
    res.json({ data: hasil });
  } catch (error) {
    next(error);
  }
}
