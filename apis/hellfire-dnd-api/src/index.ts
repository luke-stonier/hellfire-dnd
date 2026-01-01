import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true, service: "hellfire-dnd-api" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("hellfire-dnd-api listening on", port));