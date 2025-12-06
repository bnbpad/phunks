import { AIDecisions } from "src/database/AIDecison";
import { OllamaDecisionEngine } from "../ai-models/OllamaDecisionEngine";
import { AgentActionRequestHandler, AgentRunner } from "./listener";
import { AgentResponder } from "./responder";

const run = async () => {
  const runner = new AgentRunner(1000);
  const responder = new AgentResponder();
  // const openapi = new OpenAIDecisionEngine();

  // Define event handler (can be sync or async)
  const handler: AgentActionRequestHandler = async (event) => {
    // Your custom logic here - runs synchronously
    console.log("Processing AgentActionRequest:", {
      hash: event.hash,
      agentAddress: event.agentAddress,
      actionId: event.actionId.toString(),
    });

    try {
      if (event.actionId.toString() == "1") {
        // perform upgrade
        console.log("Upgrade action");
        const engine = new OllamaDecisionEngine();

        const decision = await AIDecisions.findOne({
          agentId: event.agentAddress.toLowerCase(),
        })
          .sort({ createdAt: -1 })
          .exec();

        console.log("decision", decision?.toJSON());
        if (!decision) return;

        console.log("currentTasks", decision?.toJSON());

        const newdecision = await engine.getPortfolioDecision(
          [],
          [],
          [],
          "MEDIUM",
          "test",
          decision.tasks
        );

        console.log("newdecision", newdecision);

        await AIDecisions.create({
          ...newdecision.decision,
          decision: newdecision,
        });

        // const tx = await responder.respondWithUpgrade({
        //   hash: event.hash,
        //   memory:
        //     "Agent has learned to trade more effectively based on market conditions.",
        // });
        // console.log("Upgrade transaction:", tx.hash);
      } else if (event.actionId.toString() == "0") {
        // perform action
        // const tx = await responder.respondWithAction({
        //   hash: event.hash,
        //   to: "0xA1a629d832972DB3b84A4f5Fa42d50eFF7c8F8dE",
        //   data: "0x",
        //   value: "0",
        // });
        // console.log("Action transaction:", tx.hash);
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
