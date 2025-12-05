import { Router } from "express";
import {
  getToken,
  searchData,
  uploadImage,
  createToken,
  validateTokenCreation,
  ICreateToken,
  getTokensBySymbol,
  getTokenDetails,
  uploadFormemeImage,
  createFourMemeToken,
  saveFourMemeToken,
} from "../controllers/token";
import { localUpload } from "../utils/multer";
import { BadRequestError } from "../errors";

import { downloadAiThesis } from "../controllers/token/aiThesis";
import { OpenAIDecisionEngine } from "../controllers/ai-models/OpenAIDecisionEngine";

const router = Router();
const decisionEngine = new OpenAIDecisionEngine();

router.get("/getToken", async (req, res) => {
  const { tokenAddress, chainId } = req.query as {
    tokenAddress: string;
    chainId: string;
  };
  const data = await getToken(tokenAddress, chainId);
  res.json({ success: true, data });
});

router.get("/getTokensBySymbol", async (req, res) => {
  const { symbol, chainId } = req.query as {
    symbol: string;
    chainId: string;
  };
  const data = await getTokensBySymbol(symbol, chainId);
  res.json({ success: true, data });
});

router.get("/search", async (req, res) => {
  const { chainId } = req.query as { chainId: string };
  const data = await searchData(chainId);
  res.json({ success: true, data });
});

router.post("/create", async (req, res) => {
  const tokenData = req.body;
  const data = await createToken(tokenData);
  res.json({ success: true, data });
});

router.post("/validate-create", async (req, res) => {
  const tokenData = req.body as ICreateToken;
  const data = await validateTokenCreation(tokenData);
  res.json({ success: true, data });
});

router.post("/uploadImage", localUpload.single("images"), async (req, res) => {
  if (!req.file) throw new BadRequestError("No image file provided");
  const data = await uploadImage(req.file);
  res.json({ success: true, data });
});

router.get("/getTokenDetails", async (req, res) => {
  const { chainId, symbol } = req.query as {
    chainId: string;
    symbol: string;
  };
  const data = await getTokenDetails(chainId, symbol);
  res.json({ success: true, data });
});

router.get("/getAiThesis", async (req, res) => {
  const { tokenAddress, chainId } = req.query as {
    tokenAddress: string;
    chainId: string;
  };

  const data = await downloadAiThesis(tokenAddress, chainId);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=aiThesis_${tokenAddress}_${chainId}.json`
  );
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 2));
});

router.post(
  "/uploadTokenImageFourMeme",
  localUpload.single("images"),
  async (req, res) => {
    if (!req.file) throw new BadRequestError("No image file provided");

    const data = await uploadFormemeImage(
      req.file,
      req.headers["meme-web-access"] as string
    );
    res.json({ data });
  }
);

router.post("/createFourMemeToken", async (req, res) => {
  const body = req.body;
  const data = await createFourMemeToken(
    body,
    req.headers["meme-web-access"] as string
  );
  res.json({ data });
});

router.post("/saveFourMemeToken", async (req, res) => {
  const body = req.body;
  const data = await saveFourMemeToken(body);
  res.json({ success: true, data });
});

export default router;
