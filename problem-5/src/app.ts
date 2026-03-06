import "reflect-metadata";
import express from "express";
import cors from "cors";
import v1Routes from './routes/v1';
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use('/api/v1', v1Routes);

app.use(errorHandler);

export default app;
