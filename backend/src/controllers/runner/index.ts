import { AgentActionRequestHandler, AgentRunner } from "./listener";

const run = async () => {
  const runner = new AgentRunner();

  // Define event handler (can be sync or async)
  const handler: AgentActionRequestHandler = (event) => {
    // Your custom logic here - runs synchronously
    console.log("Processing AgentActionRequest:", {
      hash: event.hash,
      agentAddress: event.agentAddress,
      actionId: event.actionId.toString(),
    });

    // process agent request and return answer
  };

  // Start listening
  runner.start(handler).catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
};

run();
