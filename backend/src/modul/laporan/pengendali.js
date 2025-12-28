import {
  ambilStatistikAbsensi,
  ambilBebanMengajar,
  eksporAbsensiCsv,
} from "./layanan.js";

export function statistikAbsensiHandler(req, res) {
  if (req.query.format === "csv") {
    const csv = eksporAbsensiCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=absensi.csv");
    return res.send(csv);
  }
  const data = ambilStatistikAbsensi();
  return res.json({ data });
}

export function bebanMengajarHandler(_req, res) {
  const data = ambilBebanMengajar();
  return res.json({ data });
}
