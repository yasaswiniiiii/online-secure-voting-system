import { Router } from "express";
import type { IRouter, Request } from "express";
import { db, usersTable, votesTable, candidatesTable, activityLogsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import type { JwtPayload } from "../lib/auth";
import { CastVoteBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/votes", requireAuth, async (req, res): Promise<void> => {
  const authReq = req as Request & { user?: JwtPayload };
  const userId = authReq.user!.userId;

  const parsed = CastVoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { candidateId, electionId } = parsed.data;

  const [voter] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!voter) {
    res.status(401).json({ error: "Voter not found" });
    return;
  }
  if (voter.hasVoted) {
    res.status(400).json({ error: "You have already cast your vote" });
    return;
  }

  const existingVote = await db
    .select()
    .from(votesTable)
    .where(and(eq(votesTable.voterId, userId), eq(votesTable.electionId, electionId)));

  if (existingVote.length > 0) {
    res.status(400).json({ error: "You have already voted in this election" });
    return;
  }

  const [vote] = await db
    .insert(votesTable)
    .values({ voterId: userId, candidateId, electionId })
    .returning();

  await db.update(usersTable).set({ hasVoted: true }).where(eq(usersTable.id, userId));

  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, candidateId));

  await db.insert(activityLogsTable).values({
    action: "VOTE",
    description: `Voter ${voter.voterId} cast vote for ${candidate?.name ?? "candidate"}`,
    userId: userId,
    userType: "voter",
  });

  res.status(201).json({
    id: vote.id,
    voterId: vote.voterId,
    candidateId: vote.candidateId,
    electionId: vote.electionId,
    timestamp: vote.timestamp.toISOString(),
  });
});

router.get("/votes/status", requireAuth, async (req, res): Promise<void> => {
  const authReq = req as Request & { user?: JwtPayload };
  const userId = authReq.user!.userId;

  const [voter] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!voter) {
    res.status(401).json({ error: "Voter not found" });
    return;
  }

  if (!voter.hasVoted) {
    res.json({ hasVoted: false, candidateId: null, candidateName: null, timestamp: null });
    return;
  }

  const [voteRecord] = await db
    .select()
    .from(votesTable)
    .where(eq(votesTable.voterId, userId));

  if (!voteRecord) {
    res.json({ hasVoted: false, candidateId: null, candidateName: null, timestamp: null });
    return;
  }

  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, voteRecord.candidateId));

  res.json({
    hasVoted: true,
    candidateId: voteRecord.candidateId,
    candidateName: candidate?.name ?? null,
    timestamp: voteRecord.timestamp.toISOString(),
  });
});

export default router;
