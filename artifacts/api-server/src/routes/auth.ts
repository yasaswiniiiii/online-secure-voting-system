import { Router } from "express";
import type { IRouter } from "express";
import bcrypt from "bcrypt";
import { db, usersTable, activityLogsTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { signToken, requireAuth } from "../lib/auth";
import type { JwtPayload } from "../lib/auth";
import type { Request } from "express";
import {
  RegisterVoterBody,
  LoginVoterBody,
  VerifyOtpBody,
  ResendOtpBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterVoterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { fullName, voterId, email, mobile, password } = parsed.data;

  const existing = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.voterId, voterId), eq(usersTable.email, email)));

  if (existing.length > 0) {
    res.status(409).json({ error: "Voter ID or email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ fullName, voterId, email, mobile, passwordHash })
    .returning();

  await db.insert(activityLogsTable).values({
    action: "REGISTER",
    description: `New voter registered: ${fullName} (${voterId})`,
    userId: user.id,
    userType: "voter",
  });

  const token = signToken({ userId: user.id, voterId: user.voterId, role: user.role });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      voterId: user.voterId,
      email: user.email,
      mobile: user.mobile,
      hasVoted: user.hasVoted,
      role: user.role,
    },
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginVoterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { identifier, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.voterId, identifier), eq(usersTable.email, identifier)));

  if (!user || user.role === "admin") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db
    .update(usersTable)
    .set({ otpCode: otp, otpExpiresAt })
    .where(eq(usersTable.id, user.id));

  req.log.info({ voterId: user.voterId, otp }, "OTP generated for voter");

  res.json({ message: `OTP sent (demo: ${otp})`, voterId: user.voterId });
});

router.post("/auth/verify-otp", async (req, res): Promise<void> => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { voterId, otp } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.voterId, voterId));

  if (!user || !user.otpCode || !user.otpExpiresAt) {
    res.status(400).json({ error: "No pending OTP for this voter" });
    return;
  }

  if (new Date() > user.otpExpiresAt) {
    res.status(400).json({ error: "OTP has expired" });
    return;
  }

  if (user.otpCode !== otp) {
    res.status(400).json({ error: "Invalid OTP" });
    return;
  }

  await db
    .update(usersTable)
    .set({ otpCode: null, otpExpiresAt: null })
    .where(eq(usersTable.id, user.id));

  await db.insert(activityLogsTable).values({
    action: "LOGIN",
    description: `Voter logged in: ${user.fullName} (${user.voterId})`,
    userId: user.id,
    userType: "voter",
  });

  const token = signToken({ userId: user.id, voterId: user.voterId, role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      voterId: user.voterId,
      email: user.email,
      mobile: user.mobile,
      hasVoted: user.hasVoted,
      role: user.role,
    },
  });
});

router.post("/auth/resend-otp", async (req, res): Promise<void> => {
  const parsed = ResendOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { voterId } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.voterId, voterId));

  if (!user) {
    res.status(400).json({ error: "Voter not found" });
    return;
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db
    .update(usersTable)
    .set({ otpCode: otp, otpExpiresAt })
    .where(eq(usersTable.id, user.id));

  req.log.info({ voterId: user.voterId, otp }, "OTP resent for voter");

  res.json({ message: `OTP resent (demo: ${otp})` });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const authReq = req as Request & { user?: JwtPayload };
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, authReq.user!.userId));

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    fullName: user.fullName,
    voterId: user.voterId,
    email: user.email,
    mobile: user.mobile,
    hasVoted: user.hasVoted,
    role: user.role,
  });
});

export default router;
