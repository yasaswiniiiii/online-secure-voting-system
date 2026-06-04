import { Router } from "express";
import type { IRouter } from "express";
import { db, electionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import {
  CreateElectionBody,
  UpdateElectionBody,
  GetElectionParams,
  UpdateElectionParams,
  DeleteElectionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/elections", async (_req, res): Promise<void> => {
  const elections = await db.select().from(electionsTable).orderBy(electionsTable.createdAt);
  res.json(elections.map((e) => ({ ...e, status: e.status ?? "upcoming" })));
});

router.get("/elections/active", async (_req, res): Promise<void> => {
  const now = new Date().toISOString().split("T")[0];
  const all = await db.select().from(electionsTable);
  const active = all.find((e) => e.status === "active" || (e.startDate <= now && e.endDate >= now));
  if (!active) {
    res.status(404).json({ error: "No active election found" });
    return;
  }
  res.json(active);
});

router.get("/elections/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetElectionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [election] = await db
    .select()
    .from(electionsTable)
    .where(eq(electionsTable.id, params.data.id));
  if (!election) {
    res.status(404).json({ error: "Election not found" });
    return;
  }
  res.json(election);
});

router.post("/elections", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateElectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [election] = await db.insert(electionsTable).values(parsed.data).returning();
  res.status(201).json(election);
});

router.patch("/elections/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateElectionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateElectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [election] = await db
    .update(electionsTable)
    .set(parsed.data)
    .where(eq(electionsTable.id, params.data.id))
    .returning();
  if (!election) {
    res.status(404).json({ error: "Election not found" });
    return;
  }
  res.json(election);
});

router.delete("/elections/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteElectionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(electionsTable).where(eq(electionsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
