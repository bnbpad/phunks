import { AIDecisions, IAIDecision } from "../../database/AIDecison";
import { BadRequestError } from "../../errors";

/**
 * Get AI decisions by agent ID
 * @param agentId - The agent ID to filter decisions by
 * @param limit - Optional limit for pagination (default: 50, max: 100)
 * @param page - Optional page number for pagination (default: 1)
 * @returns Array of AI decisions for the specified agent
 */
export const getTasksByAgent = async (agentId: string) => {
  if (!agentId || agentId.trim() === "") {
    throw new BadRequestError("Agent ID is required");
  }

  const decisions = await AIDecisions.find({ agentId })
    .select("tasks")
    .sort({ createdAt: -1 })
    .lean();

  return {
    success: true,
    data: decisions,
  };
};
