import mongoose, { Document, model, Model, Schema } from "mongoose";
import { AIDecisionResult } from "../../controllers/ai-models/OllamaDecisionEngine";

export type IAIDecision = {
  id?: string;
  agentId: string;
  decision: AIDecisionResult;
  prompt: string;
  tasks: string[];
};

const AIDecisionSchema: Schema = new Schema(
  {
    id: { type: String },
    agentId: { type: String },
    decision: { type: Schema.Types.Mixed, required: true },
    prompt: { type: String },
    tasks: { type: [String] },
  },
  { timestamps: true }
);

export type IUserModel = IAIDecision & Document;
export const AIDecisions = model<IAIDecision>("AIDecision", AIDecisionSchema);
