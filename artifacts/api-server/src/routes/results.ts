import { Router } from "express";
import type { IRouter } from "express";
import { db, candidatesTable, votesTable, electionsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/results", async (_req, res): Promise<void> => {
  const now = new Date().toISOString().split("T")[0];
  const allElections = await db.select().from(electionsTable);
  const active = allElections.find(
    (e) => e.status === "active" || (e.startDate <= now && e.endDate >= now)
  ) ?? allElections[allElections.length - 1];

  if (!active) {
    res.status(404).json({ error: "No election found" });
    return;
  }

  const candidates = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.electionId, active.id));

  const voteCounts = await db
    .select({ candidateId: votesTable.candidateId, count: count() })
    .from(votesTable)
    .where(eq(votesTable.electionId, active.id))
    .groupBy(votesTable.candidateId);

  const voteMap = new Map(voteCounts.map((v) => [v.candidateId, Number(v.count)]));
  const totalVotes = voteCounts.reduce((sum, v) => sum + Number(v.count), 0);

  const candidateResults = candidates.map((c) => {
    const voteCount = voteMap.get(c.id) ?? 0;
    return {
      id: c.id,
      name: c.name,
      party: c.party,
      symbol: c.symbol,
      imageUrl: c.imageUrl,
      voteCount,
      percentage: totalVotes > 0 ? Math.round((voteCount / totalVotes) * 1000) / 10 : 0,
    };
  });

  candidateResults.sort((a, b) => b.voteCount - a.voteCount);
  const winner = candidateResults[0] ?? {
    id: 0,
    name: "No votes yet",
    party: "",
    symbol: "",
    imageUrl: "",
    voteCount: 0,
    percentage: 0,
  };

  res.json({
    election: active,
    candidates: candidateResults,
    totalVotes,
    winner,
  });
});

export default router;
