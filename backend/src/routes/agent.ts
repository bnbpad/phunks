import { Router } from "express";
import { getAgentsDetail, getAllAgents } from "../controllers/Agent/details";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params as {
    id: string;
  };
  const data = await getAgentsDetail(id);
  res.json({ success: true, data });
});

router.get("/", async (req, res) => {
  const { chainId } = req.query as {
    chainId: string;
  };
  const data = await getAllAgents();
  res.json({ success: true, data });
});

export default router;
