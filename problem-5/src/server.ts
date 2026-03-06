import app from "./app";
import { env } from "./config/env";
import { AppDataSource } from "./config/database";

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
};

start();
