import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAction {
  tokenAddress: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActionDocument extends IAction, Document {}

const ActionSchema: Schema = new Schema(
  {
    tokenAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    amount: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Actions: Model<IActionDocument> = mongoose.model<IActionDocument>(
  "Action",
  ActionSchema
);
