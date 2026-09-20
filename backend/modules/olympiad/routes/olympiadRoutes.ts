import { Router } from "express";
import { OlympiadController } from "../controllers/olympiadController";
import { authMiddleware } from "../../../middleware/auth";

const router = Router();

// Every Olympiad route is authenticated via existing JWT middleware
router.use(authMiddleware);

router.post("/start", OlympiadController.startAttempt);
router.get("/session", OlympiadController.getCurrentSession);
router.post("/save-answer", OlympiadController.saveAnswer);
router.get("/remaining-time", OlympiadController.getRemainingTime);
router.post("/submit", OlympiadController.submitAttempt);
router.get("/cooldown", OlympiadController.checkCooldown);

export default router;
