import { Router } from "express";
import { getTasksByAgent } from "../controllers/Agent/decision";
import { BadRequestError } from "../errors";
import {
  cacheJsonMiddleware,
  IResponseCached,
} from "../middlewares/cacheJsonMiddleware";

const router = Router();

router.get("/", cacheJsonMiddleware(5), async (req, res: IResponseCached) => {
  const { agentId } = req.query as {
    agentId: string;
  };

  if (!agentId) {
    throw new BadRequestError("Agent ID is required");
  }

  const data = await getTasksByAgent(agentId);
  res.jsonCached({ success: true, data });
});

export default router;
