import mongoose, { Document, Model, Schema } from "mongoose";

export type IAIThesis = {
  tokenAddress: string;
  chainId: number;
  goals: string;
  memory: string;
  persona: string;
  experience: string;
};

const AIThesisSchema: Schema = new Schema(
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

AIThesisSchema.index({ tokenAddress: 1 }, { unique: true });

export type IAIThesisDocument = IAIThesis & Document;
export const AIThesisModel: Model<IAIThesisDocument> =
  mongoose.model<IAIThesisDocument>("AIThesis", AIThesisSchema);
