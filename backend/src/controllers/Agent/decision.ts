import { AIDecisions, IAIDecision } from "../../database/AIDecison";
import { BadRequestError } from "../../errors";

export interface EvolutionChange {
  before: string[];
  after: string[];
}

/**
 * Get AI decisions by agent ID
 * @param agentId - The agent ID to filter decisions by
 * @returns EvolutionChange with the latest 2 task lists
 */
export const getTasksByAgent = async (
  agentId: string
): Promise<EvolutionChange> => {
  if (!agentId || agentId.trim() === "") {
    throw new BadRequestError("Agent ID is required");
  }

  const decisions = await AIDecisions.find({ agentId })
    .select("tasks")
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();

  const latestTasks = decisions.map((decision) => decision.tasks || []);

  const after = latestTasks[0] || [];
  const before = latestTasks[1] || [];

  return {
    before,
    after,
  };
};
