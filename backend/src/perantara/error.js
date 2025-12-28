export function tanganiTidakDitemukan(_req, res) {
  res.status(404).json({ message: "Rute tidak ditemukan" });
}

export function tanganiError(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Terjadi kesalahan" });
}
