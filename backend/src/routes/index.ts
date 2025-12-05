import { Router } from "express";

import token from "./token";
import aiDecisions from "./aiDecisions";
import agent from "./agent";
export const router = Router();
router.get("/", (_req, res) => {
  res.json({
    uptime: process.uptime(),
    online: true,
    message: "let's gooooo!!",
  });
});

router.use("/token", token);

router.use("/aiDecisions", aiDecisions);
router.use("/agents", agent);
export default router;
