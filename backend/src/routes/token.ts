import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getToken,
  listTokensController,
  searchData,
  uploadImage,
  createToken,
  getDailyTokenInfo,
  SortOption,
  validateTokenCreation,
  ICreateToken,
  getTokensBySymbol,
  getTokenDetails,
  uploadFormemeImage,
  createFourMemeToken,
  saveFourMemeToken,
} from "../controllers/token";
import { localUpload } from "../utils/multer";
import { totalRequestsIP, rateLimitWindow } from "../utils/constant";
import { BadRequestError } from "../errors";
import {
  cacheJsonMiddleware,
  IResponseCached,
} from "../middlewares/cacheJsonMiddleware";
import { downloadAiThesis } from "../controllers/token/aiThesis";
import { OpenAIDecisionEngine } from "../controllers/ai-models/OpenAIDecisionEngine";

const router = Router();
const decisionEngine = new OpenAIDecisionEngine();

router.get(
  "/dailyInfo",
  cacheJsonMiddleware(5),
  async (req, res: IResponseCached) => {
    const chainId = req.query.chainId as string;
    const data = await getDailyTokenInfo(chainId);
    res.jsonCached({ success: true, data });
  }
);

router.get(
  "/getAllTokens",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { chainId, limit, page, sortBy, order } = req.query as {
      chainId: string;
      limit: string;
      page: string;
      sortBy: SortOption;
      order: "asc" | "desc";
    };
    const data = await listTokensController(
      chainId,
      parseInt(limit),
      parseInt(page),
      sortBy,
      order
    );
    res.jsonCached({ success: true, data });
  }
);

router.get(
  "/getToken",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { tokenAddress, chainId } = req.query as {
      tokenAddress: string;
      chainId: string;
    };
    const data = await getToken(tokenAddress, chainId);
    res.jsonCached({ success: true, data });
  }
);

router.get(
  "/getTokensBySymbol",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { symbol, chainId } = req.query as {
      symbol: string;
      chainId: string;
    };
    const data = await getTokensBySymbol(symbol, chainId);
    res.jsonCached({ success: true, data });
  }
);

router.get(
  "/search",
  cacheJsonMiddleware(1),
  async (req, res: IResponseCached) => {
    const { chainId } = req.query as { chainId: string };
    const data = await searchData(chainId);
    res.jsonCached({ success: true, data });
  }
);

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

router.get(
  "/getTokenDetails",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { chainId, symbol } = req.query as {
      chainId: string;
      symbol: string;
    };
    const data = await getTokenDetails(chainId, symbol);
    res.jsonCached({ success: true, data });
  }
);

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
