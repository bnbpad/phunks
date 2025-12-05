import { AgentActionRequestHandler, AgentRunner } from "./listener";

const run = async () => {
  const runner = new AgentRunner();

  // Define event handler
  const handler: AgentActionRequestHandler = async (event) => {
    // Your custom logic here
    console.log("Processing AgentActionRequest:", {
      hash: event.hash,
      agentAddress: event.agentAddress,
      actionId: event.actionId.toString(),
    });
  };

  // Start listening
  runner.start(handler).catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
};

run();
