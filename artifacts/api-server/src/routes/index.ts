import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import electionsRouter from "./elections";
import candidatesRouter from "./candidates";
import votesRouter from "./votes";
import resultsRouter from "./results";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(electionsRouter);
router.use(candidatesRouter);
router.use(votesRouter);
router.use(resultsRouter);
router.use(adminRouter);

export default router;
