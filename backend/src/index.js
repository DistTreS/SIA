import "dotenv/config";
import app from "./aplikasi.js";
import { inisialisasiDatabase } from "./model/index.js";

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  await inisialisasiDatabase();
  app.listen(port, () => {
    console.log(`SIA backend listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Gagal menjalankan server:", error);
  process.exit(1);
});
