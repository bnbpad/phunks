import { Schema, model, Document, Types } from 'mongoose';
import { UserQuestCompletionBase } from '../../utils/types/campaign';

export interface IUserQuestCompletion
  extends Document,
    Omit<UserQuestCompletionBase, 'questId' | 'campaignId'> {
  questId: Types.ObjectId;
  campaignId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userQuestCompletionSchema = new Schema<IUserQuestCompletion>(
  {
    userAddress: { type: String, lowercase: true, required: true },
    questId: { type: Schema.Types.ObjectId, ref: 'Quest', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    completedAt: { type: String, required: true },
    rewardClaimed: { type: Boolean, default: false },
    rewardClaimedAt: { type: String },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only complete a quest once
userQuestCompletionSchema.index({ userAddress: 1, questId: 1 }, { unique: true });

export const UserQuestCompletion = model<IUserQuestCompletion>(
  'UserQuestCompletion',
  userQuestCompletionSchema
);
