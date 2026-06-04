import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { candidatesTable } from "./candidates";
import { electionsTable } from "./elections";

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  voterId: integer("voter_id")
    .notNull()
    .references(() => usersTable.id),
  candidateId: integer("candidate_id")
    .notNull()
    .references(() => candidatesTable.id),
  electionId: integer("election_id")
    .notNull()
    .references(() => electionsTable.id),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votesTable).omit({
  id: true,
  timestamp: true,
});
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votesTable.$inferSelect;
