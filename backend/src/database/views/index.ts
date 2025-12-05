import { Document, model, Schema } from 'mongoose';

export interface IView {
  id?: string;
  tokenAddress: string;
  views: number;
}

export const ViewSchema = new Schema({
  tokenAddress: { type: String, index: true },
  views: { type: Number, default: 0 },
});

export type IViewModel = IView & Document;
export const Views = model<IViewModel>('View', ViewSchema);
