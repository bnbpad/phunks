import { AiThesisModel } from '../../database/aiThesis';
import { BadRequestError, NotFoundError } from '../../errors';

export const downloadAiThesis = async (tokenAddress: string, chainId: string) => {
  if (!tokenAddress || !chainId) {
    throw new BadRequestError('tokenAddress and chainId are required');
  }

  const normalizedAddress = tokenAddress.toLowerCase();
  const numericChainId = Number(chainId);

  if (Number.isNaN(numericChainId)) {
    throw new BadRequestError('chainId must be a number');
  }

  const aiThesisDocument = await AiThesisModel.findOne({
    tokenAddress: normalizedAddress,
    chainId: numericChainId,
  })
    .lean()
    .exec();

  if (!aiThesisDocument) {
    throw new NotFoundError('AI thesis not found for the provided token');
  }
  const { _id, __v, ...cleanedDoc } = aiThesisDocument;

  return cleanedDoc;
};
