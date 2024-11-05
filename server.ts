import app from "./src/app";
import { PORT } from "./src/config";

const server: ReturnType<typeof app.listen> = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express!");
    process.exit(0);
  });
});
