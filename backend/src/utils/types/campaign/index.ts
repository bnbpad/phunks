export type QuestType = 'twitter_follow' | 'telegram_follow' | 'token_hold';

export interface CampaignBase {
  name: string;
  description: string;
  tokenAddress: string;
  startTimestamp: string;
  endTimestamp: string;
  imageUrl: string;
}

export interface IQuestLink {
  _target: '_self' | '_blank';
  url: string;
}

export interface IRewardTokenDetails {
  address: string;
  symbol: string;
  name: string;
  image: string;
}

export interface QuestBase {
  campaignId: string;
  name: string;
  description: string;
  questType: QuestType;
  rewardAmount: number;
  maxRewards: number;
  startTimestamp: string;
  endTimestamp: string;
  link?: IQuestLink;
  holdAmount?: number;
  rewardTokenDetails?: IRewardTokenDetails;
}

export interface UserQuestCompletionBase {
  userAddress: string;
  questId: string;
  campaignId: string;
  completedAt: string;
  rewardClaimed: boolean;
  rewardClaimedAt?: string;
}
