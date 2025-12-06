import { AIDecisions } from "src/database/AIDecison";
import { AgentActionRequestHandler, AgentRunner } from "./listener";
import { AgentResponder } from "./responder";
import { AIThesisModel } from "src/database/aiThesis";
import { OpenAIDecisionEngine } from "../ai-models/OpenAIDecisionEngine";

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

        await thesis.set("tasks", newdecision);
        await thesis.save();

        await AIDecisions.insertOne({
          agentId: event.agentAddress.toLowerCase(),
          tasks: newdecision,
          decision: thesis.goals,
          prompt: "",
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
