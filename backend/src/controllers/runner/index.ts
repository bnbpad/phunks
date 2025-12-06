import { AIDecisions } from "../../database/AIDecison";
import { AgentActionRequestHandler, AgentRunner } from "./listener";
import { AgentResponder } from "./responder";
import { AIThesisModel } from "../../database/aiThesis";
import { OpenAIDecisionEngine } from "../ai-models/OpenAIDecisionEngine";
import { Actions } from "../../database/action";
import { _getProvider } from "src/utils/contract";

const run = async () => {
  const runner = new AgentRunner(1000);
  const responder = new AgentResponder();
  const openapi = new OpenAIDecisionEngine();

  // Define event handler (can be sync or async)
  const handler: AgentActionRequestHandler = async (event) => {
    // Your custom logic here - runs synchronously
    console.log("Processing AgentActionRequest:", {
      hash: event.hash,
      tokenAddress: event.agentAddress,
      actionId: event.actionId.toString(),
    });

    try {
      if (event.actionId.toString() == "1") {
        // perform upgrade
        console.log("Upgrade action");
        // const engine = new OllamaDecisionEngine();

        const thesis = await AIThesisModel.findOne({
          tokenAddress: event.agentAddress.toLowerCase(),
        })
          .sort({ createdAt: -1 })
          .exec();

        if (!thesis) return;

        const newdecision = await openapi.getPortfolioDecision(
          [],
          [],
          [],
          "MEDIUM",
          thesis.goals,
          thesis.memory
        );

        console.log("newdecision", newdecision);

        await thesis.set("memory", newdecision.join("\n"));
        await thesis.save();

        await AIDecisions.insertOne({
          agentId: event.agentAddress.toLowerCase(),
          tasks: newdecision,
          decision: thesis.goals,
          prompt: "",
        });

        const tx = await responder.respondWithUpgrade({
          hash: event.hash,
          memory: newdecision.join(", "),
        });
        console.log("Upgrade transaction:", tx.hash);
      } else if (event.actionId.toString() == "0") {
        // perform action

        const agentAddress = event.agentAddress;

        const thesis = await AIThesisModel.findOne({
          tokenAddress: event.agentAddress.toLowerCase(),
        })
          .sort({ createdAt: -1 })
          .exec();
        console.log("thesis", thesis, event.agentAddress);
        if (!thesis) return;

        const provider = _getProvider(56);
        const bnbBalance = await provider.getBalance(agentAddress);
        const intelligentDecision = await openapi.getIntelligentDecision(
          bnbBalance.toString(),
          thesis.goals,
          thesis.memory
        );

        await Actions.insertOne({
          tokenAddress: event.agentAddress.toLowerCase(),
          amount: intelligentDecision.amount,
          description: intelligentDecision.reasoning,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("❌ Error processing AgentActionRequest:", error);
    }
  };

  // Start listening
  runner.start(handler).catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
};

run();
