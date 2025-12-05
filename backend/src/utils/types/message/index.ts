export interface IMessageResponse {
  messageId: string;
  user: { address: string };
  daoAddress: string;
  daoChainId?: number;
  parentId: string | null;
  content: string;
  upVotes: string[];
  downVotes: string[];
  createdAt: string;
}

export interface IReplies {
  replies: IMessageResponse[];
}

export interface IMessageResponseWithReplies extends IMessageResponse, IReplies {}
