# Briefing
- Start with the simplest option: one call, then a workflow, and only then an agent.
- Workflow = path defined by code. Agent = the model decides the next steps.
- The loop: while `stop_reason` is `tool_use`, execute and return `tool_result`.
- Subagents isolate context; return only the conclusion to the parent.
- A rule that must always hold belongs in a hook or code, not in a prompt.

# Questions

## agents-01
A system receives invoices always in the same format, extracts 6 fields, validates and stores them. The steps never change. Which architecture should you choose?
- A code-driven workflow that calls Claude for the extraction steps
- An autonomous agent with database access and freedom to plan steps
- A manager with a dedicated subagent for each invoice field
- An agent with persistent memory to remember previous invoices
> Predictable steps call for a workflow: cheaper, testable and predictable. Agents pay off when the path cannot be specified in advance.

## agents-02
Which conditions favor an **agent** over a workflow? (Choose 2)
- The number and order of steps depend on what is discovered
- Errors can be detected and corrected, for example with tests
- Latency must be minimal and constant on every request
- The task is a simple classification into five categories
> Agents trade cost and latency for flexibility. They need complexity, value, viability and recoverable errors.

## agents-03
Put one iteration of a manual tool use loop in order.
1. Send messages and tool definitions to the API
2. Receive a response with `stop_reason: "tool_use"`
3. Append the full assistant response to the history
4. Execute the requested tools in your environment
5. Send the `tool_result` blocks in a user message
> The full assistant content must be in the history before the results so that the `tool_use_id` values match.

## agents-04
A search across 40 files fills the main agent's context, and it loses track of the goal. Which change addresses the cause?
- Delegate the reading to subagents that return only conclusions
- Repeat the goal in capital letters in the system prompt
- Raise `max_tokens` to give the responses more room
- Ask the main agent to read the files in alphabetical order
> Subagents have their own context. The raw content stays there and the parent receives only the summary.

## agents-05
The team wants an agent that reads and edits files and runs commands **on its own infrastructure**, with a ready-made loop, permissions and subagents. What should they use?
- Claude Agent SDK
- Message Batches API
- Managed Agents on Anthropic's cloud
- Token counting API
> The Agent SDK packages the Claude Code harness and you host it. Managed Agents runs the loop on Anthropic's side.

## agents-06
What is the difference between the API SDK's **Tool Runner** and the **Claude Agent SDK**?
- Tool Runner automates the loop for tools you define; the Agent SDK ships with tools and a harness
- Tool Runner runs in a sandbox on Anthropic's cloud; the Agent SDK only works with asynchronous Message Batches
- Tool Runner is only for MCP; the Agent SDK does not accept MCP
- They are the same package with different names in Python and TypeScript
> You host both. What differs is scope: a thin loop over your functions or a full harness.

## agents-07
Every file the agent edits must go through the formatter, without exception. Where should the rule live?
- In a hook that runs after the edit
- At the end of the system prompt, marked as important
- In a few-shot example with formatted code
- In the description of the file editing tool
> Command hooks run whenever the event fires. Prompt instructions are followed most of the time, not guaranteed.

## agents-08
A pipeline receives tickets and sends each one to a specialized prompt: billing, technical or sales. Which pattern is this?
- Routing
- Prompt chaining
- Evaluator-optimizer
- Parallel voting
> Routing classifies the input and sends it to the appropriate handling.

## agents-09
One model generates translations, another critiques them against clear criteria, and the cycle repeats until approval. Which pattern is this?
- Evaluator-optimizer
- Routing
- Orchestrator-workers
- Parallel sectioning
> It works when criteria are clear and iteration measurably improves the result.

## agents-10
Claude returns three `tool_use` blocks in the same response. How should you reply?
- With three `tool_result` blocks together in a single user message
- With three separate user messages, one for each of the results
- With only the first result, waiting for new requests
- With the three results merged into one text without identifiers
> Each result references its `tool_use_id`, all in the same message. Splitting them discourages parallel calls.

## agents-11
A team wants a long-running agent without hosting the loop or the sandbox, with sessions persisted by the provider. Which option fits?
- Managed Agents
- A manual loop on the Messages API
- Tool Runner on their own server
- Agent SDK in their own container
> In Managed Agents, Anthropic runs the loop and persists sessions; the sandbox can be on its cloud (the case here) or self-hosted. You host the others.

## agents-12
Your agent sometimes enters an infinite loop. Which controls should the **harness** have? (Choose 2)
- An iteration limit or budget per run
- Detection of repeated calls without progress
- Removal of all errors returned by the tools
- An empty context on every new loop iteration
> Limits belong in code. Hiding errors prevents recovery, and clearing the context destroys progress.

## agents-13
An agent must resume its work tomorrow in a new session. What works best?
- Recording state and next steps in persistent storage
- Reopening with the same model, which will still remember the conversation
- Raising effort before ending the session
- Keeping the progress in the prompt cache
> The API is stateless and the cache expires. Durable state needs a file, a database or the memory tool.

## agents-14
In a supervisor/workers structure, which briefing tends to work best for a worker?
- Goal, boundaries, necessary context and expected return format
- The supervisor's full history with no new instructions
- One short sentence, letting the worker infer all the context
- The complete list of other workers and all their partial results
> The worker cannot see the parent's context. It needs a self-contained briefing, without a data dump.

## agents-15
A tool fails with a timeout. What should the loop return to the model?
- A `tool_result` with `is_error: true` and a helpful message
- Nothing for this call, moving on to the next pending call instead
- An empty `tool_result` as if it had succeeded
- A new conversation without the failed call
> Every `tool_use` needs a result. An informative error lets the model retry or change plans.
