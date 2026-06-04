import { Router } from "express";
import type { IRouter } from "express";
import bcrypt from "bcrypt";
import { db, usersTable, electionsTable, candidatesTable, votesTable, activityLogsTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";
import { signToken, requireAdmin } from "../lib/auth";
import { LoginAdminBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = LoginAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;

  const [admin] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.role, "admin"));

  if (!admin || admin.voterId !== username) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }

  const token = signToken({ userId: admin.id, voterId: admin.voterId, role: "admin" });

  res.json({
    token,
    user: {
      id: admin.id,
      fullName: admin.fullName,
      voterId: admin.voterId,
      email: admin.email,
      mobile: admin.mobile,
      hasVoted: admin.hasVoted,
      role: "admin",
    },
  });
});

router.get("/admin/voters", requireAdmin, async (_req, res): Promise<void> => {
  const voters = await db
    .select()
    .from(usersTable)
    .orderBy(usersTable.createdAt);

  res.json(
    voters.map((v) => ({
      id: v.id,
      fullName: v.fullName,
      voterId: v.voterId,
      email: v.email,
      mobile: v.mobile,
      hasVoted: v.hasVoted,
      createdAt: v.createdAt.toISOString(),
    }))
  );
});

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [totalVotersResult] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "voter"));
  const [totalVotedResult] = await db.select({ count: count() }).from(votesTable);
  const [totalCandidatesResult] = await db.select({ count: count() }).from(candidatesTable);
  const [totalElectionsResult] = await db.select({ count: count() }).from(electionsTable);

  const totalVoters = Number(totalVotersResult?.count ?? 0);
  const totalVoted = Number(totalVotedResult?.count ?? 0);
  const totalCandidates = Number(totalCandidatesResult?.count ?? 0);
  const totalElections = Number(totalElectionsResult?.count ?? 0);

  const now = new Date().toISOString().split("T")[0];
  const allElections = await db.select().from(electionsTable);
  const activeElection = allElections.find(
    (e) => e.status === "active" || (e.startDate <= now && e.endDate >= now)
  );

  res.json({
    totalVoters,
    totalVoted,
    totalCandidates,
    totalElections,
    votingPercentage: totalVoters > 0 ? Math.round((totalVoted / totalVoters) * 1000) / 10 : 0,
    activeElection: activeElection?.title ?? null,
  });
});

router.get("/admin/activity", requireAdmin, async (_req, res): Promise<void> => {
  const logs = await db
    .select()
    .from(activityLogsTable)
    .orderBy(desc(activityLogsTable.timestamp))
    .limit(50);

  res.json(
    logs.map((l) => ({
      id: l.id,
      action: l.action,
      description: l.description,
      timestamp: l.timestamp.toISOString(),
      userId: l.userId,
      userType: l.userType,
    }))
  );
});

export default router;
