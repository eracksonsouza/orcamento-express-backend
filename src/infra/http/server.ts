import "dotenv/config";
import { buildApp } from "./app";

const start = async () => {
  const server = await buildApp();

  try {
    await server.listen({ port: 3333, host: "0.0.0.0" });
    console.log("🚀 Server running on http://localhost:3333");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
