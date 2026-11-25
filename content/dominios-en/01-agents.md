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

## agents-16
A travel agent uses three workers: flights, hotels and visas. Each returns its part. What is the **supervisor** responsible for?
- Redoing each search to confirm the work of the workers
- Training the workers on the mistakes of each conversation
- Splitting the request, delegating and merging the parts
- Passing the three answers to the user without any change
> The supervisor decomposes, routes and consolidates, including resolving conflicts between parts.

## agents-17
A nightly agent on the **Claude Agent SDK** must not exceed 30 turns or US$ 2. How do you enforce it and know the limit was hit?
- Set `max_turns` and `max_budget_usd` and read the result `subtype`
- Ask in the prompt to stop at 30 turns and search the text for "END"
- Rely on the default turn limit the SDK applies to every single agent
- Lower `max_tokens` until the loop ends because output has run out
> By default the SDK limits neither turns nor cost. When a limit is hit, the result carries `error_max_turns` or `error_max_budget_usd`. Cost is estimated and may slightly exceed the cap. With a single-shot `query()`, an exception follows that result: handle it.

## agents-18
When you choose **Managed Agents** over hosting your own loop, which advantage do you give up?
- The possibility of using custom tools
- Some control over runtime and environment
- Running tasks that take more than one turn
- The use of MCP servers by the agent itself
> You trade control for less operations work: the harness is ready-made and, in the cloud setup, the provider also runs the sandbox. Self-hosted options exist.

## agents-19
A tutor remembers each student's level across sessions. Today it resends **all** past conversations and cost has exploded. Which design is better?
- Resend only the conversations where the student scored well
- Increase `max_tokens` so that more history can fit
- Let the model infer the level again at each new session
- Store facts in external memory and load the relevant ones
> Durable memory lives outside the model; only what the session needs enters the context.

## agents-20
Three independent analyses of the same contract (tax, labor, privacy) run in sequence. Which statements about **parallelizing** are correct? (Choose 2)
- Total latency gets close to that of the slowest analysis
- The cost in tokens drops to one third of the original
- The analyses start to see the conclusions of each other
- A step that consolidates the three results is needed
> Parallelizing cuts time, not tokens, and requires an aggregation step. It only works when the parts are independent.

## agents-21
A report always goes through: outline, automatic check, writing. If the check fails, the flow stops. Which pattern is this?
- Autonomous agent with memory
- Voting among several models
- Routing by request category
- Prompt chaining with a gate
> Fixed chained steps, with verification in code between them.

## agents-22
Three identical calls analyze the same code, and an alert is accepted if two report it. Which pattern?
- Orchestrator-workers
- Prompt chaining
- Voting (parallelization)
- Evaluator-optimizer
> Running the same task several times and aggregating raises confidence, at a higher cost.

## agents-23
When is **orchestrator-workers** better than fixed parallelization?
- The answer needs the lowest possible latency
- The subtasks are only known at run time
- The subtasks are always the same and independent
- The task fits easily in one simple call
> The orchestrator decides the split based on input. If the split is fixed, code is enough.

## agents-24
A team wants an agent to convert CSV into JSON. What is the best recommendation?
- Plain code, with no LLM
- An agent with a file tool
- A workflow with three prompts
- Two agents reviewing each other
> A deterministic transformation needs no model: code is cheaper and exact.

## agents-25
Before giving an agent autonomy, which questions are decisive? (Choose 2)
- Can the result be verified?
- Is the model the latest one?
- Are there at least five tools?
- What is the cost of an error?
> Autonomy pays off when errors are cheap or reversible and results can be checked.

## agents-26
Two subagents edit the **same** file in parallel and one erases the other's work. How do you prevent it?
- Increase the context available to both
- Change the model of the second one
- Split by files or isolate in worktrees
- Ask both of them to work with care
> Parallelize only what shares no state, or isolate and integrate later.

## agents-27
A multi-agent system spends far more tokens than a single agent. When is that justified?
- A task where everyone needs the same context
- A valuable, broad task divisible into parts
- A short task whose steps depend on each other
- A simple task repeated millions of times a day
> Multi-agent shines in high-value parallel exploration; strong dependencies hurt it.

## agents-28
What distinguishes a **handoff** from **delegation** between agents?
- In a handoff, the other agent takes over
- In a handoff, the other agent returns a summary
- In delegation, the history is always erased
- In delegation, the user switches to another app
> In delegation the main agent keeps control and receives the result.

## agents-29
Which condition normally ends a hand-written agent loop on the Messages API?
- The answer text containing the word "done"
- The response having under a hundred output tokens
- The model returning two text blocks in a row
- A `stop_reason` of `end_turn`, with no tool pending
> `tool_use` and `pause_turn` require another iteration. `max_tokens` and `refusal` also stop the loop, but are not a normal finish: handle each one.

## agents-30
An agent repeats the same failed search ten times. Besides limiting it, what helps the model change course?
- A prompt that forbids any new search at all
- A higher number of output tokens per turn
- A result explaining the failure and options
- An empty result so that it notices by itself
> The tool result is its main evidence about the environment.

## agents-31
In a 6-hour task, the agent marks items as done without testing. Which change addresses it?
- Shorten the list so it looks more achievable
- Require executable verification before closing
- Increase the number of items in the task list
- Ask the agent to write with more confidence
> Tests or checks run by the harness are worth more than self-assessment.

## agents-32
What should a progress file contain so that **another session** can continue the work?
- Decisions, current state and next steps
- The full transcript of all the messages
- Only the list of the available tools
- The complete content of the files read
> Good progress notes are short and actionable; the rest can be re-read on demand.

## agents-33
A subagent returns 30k tokens of logs to the main agent. What is the problem?
- It prevents streaming in the main agent
- It makes the subagent lose its own tools
- It forces the main agent to change models
- It defeats the context isolation intended
> Ask for conclusions with references; details stay in the disposable context.

## agents-34
Which information does a fresh-context subagent **not** have unless you pass it? (Choose 2)
- The tools that were granted to it
- Its own system prompt
- Decisions made in the main conversation
- The format you want the result in
> Isolated context cuts both ways: the briefing must be complete.

## agents-35
An agent makes 40 sequential calls to add values from 40 files. What is more efficient?
- Raise the turn limit to eighty turns
- Give it code execution to aggregate
- Ask it to add them mentally at the end
- Split the sum among forty subagents
> Code processes data outside the context and returns only the total, exactly.

## agents-36
A prototype needs **two** custom tools and a simple loop, in Python. What avoids writing the loop by hand?
- The SDK Tool Runner
- The Message Batches API
- A remote MCP server
- A Claude Code plugin
> The Tool Runner executes your functions and repeats until the turn ends.

## agents-37
In Managed Agents, what is the difference between an **agent** and a **session**?
- Agent is one run; session is just its history
- Agent is the model; session is the access key
- Agent is the sandbox; session is the output file
- Agent is the configuration; session is one run
> The configuration is reusable and versioned; each session runs from it.

## agents-38
Regulated files and command execution must stay in your network; only approved excerpts may go to the model. Which design should you consider?
- Send the data only through streaming
- Use a smaller model in a public cloud
- Run the tools on your infrastructure
- Raise effort in the hosted sandbox
> With tools on your infrastructure, files and execution stay in the network. But any result returned to the model leaves it: filter it.

## agents-39
In the Claude Agent SDK, an app with no human at the terminal must decide on actions that are **not** pre-approved. What should it use?
- A lower `max_tokens` in each turn
- A permission callback in the application
- A prompt asking the agent for good sense
- A longer list of few-shot examples
> Application code decides, with context and audit, instead of accepting everything.

## agents-40
A support agent must **escalate** to a human. How do you implement it reliably?
- An escalation tool with clear criteria
- An agreed phrase that staff search for
- A word limit for each agent answer
- A confidence score made up by the model
> A tool makes escalation a structured event the system handles; enforce mandatory cases in code.

## agents-41
Which items belong to the **harness**, not the model? (Choose 2)
- Enforcing cost limits
- Choosing the next word
- Interpreting the request
- Executing the tools
> The model proposes; the harness executes, limits, logs and controls permissions.

## agents-42
A long-running agent must survive a process crash. What does the design need?
- A larger context window for the agent
- A single long turn holding the whole task
- State saved externally and resumable steps
- A prompt asking it not to stop executing
> Persistence and idempotency allow resuming without repeating effects.

## agents-43
An agent needs a production credential for an API. Where must it **not** appear?
- In the proxy adding the header
- In the model context
- In the secret manager
- In the service running the tool
> The tool or a proxy uses the credential; the model does not need to see it.

## agents-44
When testing an agent, why simulate failing and slow tools?
- To see whether it recovers or misbehaves
- To lower the price per token of the model
- To train the model on the errors it sees
- To increase the hit rate of the cache
> The happy path does not reveal how the agent handles errors, which are common in production.

## agents-45
An agent receives 15 documents and must cite the origin of each claim. What should the harness preserve?
- A single summary of the fifteen documents
- Only the text, with no metadata using tokens
- The date each document was read
- The source identifier next to each passage
> Without provenance in context, there is no way to cite or audit.
