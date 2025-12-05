import { Document, model, Schema } from 'mongoose';

export interface ITokenLikes {
  tokenAddress: string;
  likes: string[];
  updatedAt: Date;
}

const ITokenLikesSchema: Schema = new Schema({
  tokenAddress: { type: String, required: true },
  likes: [{ type: String, index: true }],
  updatedAt: { type: Date, default: Date.now },
});

export type ITokenLikesModel = ITokenLikes & Document;
export const TokenLikes = model<ITokenLikesModel>('TokenLikes', ITokenLikesSchema);
