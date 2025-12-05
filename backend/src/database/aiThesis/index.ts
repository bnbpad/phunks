import mongoose, { Document, Model, Schema } from "mongoose";

export type AiThesisCore = {
  goals: string;
  memory: string;
  persona: string;
  experience: string;
};

export interface IAiThesis extends AiThesisCore {
  tokenAddress: string;
  chainId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type IAiThesisPayload = AiThesisCore;

export interface IAiThesisDocument extends IAiThesis, Document {}

const AiThesisSchema: Schema = new Schema(
  {
    tokenAddress: { type: String, required: true, lowercase: true, trim: true },
    chainId: { type: Number, required: true },
    goals: { type: String, required: true },
    memory: { type: String, required: true },
    persona: { type: String, required: true },
    experience: { type: String, required: true },
  },
  { timestamps: true }
);

AiThesisSchema.index({ tokenAddress: 1 }, { unique: true });

export const AiThesisModel: Model<IAiThesisDocument> =
  mongoose.model<IAiThesisDocument>("AiThesis", AiThesisSchema);
