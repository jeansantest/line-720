# Briefing
- A tool description is a prompt: say what it does, when to use it and when not to.
- Client tool: you execute it. Server tool: Anthropic executes it.
- MCP standardizes reusable integrations; a Skill teaches a procedure.
- MCP exposes tools, resources and prompts; transports: stdio and Streamable HTTP.
- Many tools: less overlap and on-demand loading.

# Questions

## tools-01
Which tool description is best?
- "Looks up orders by ID. Use for delivery status; do not use for stock."
- "System orders function, final version, reviewed and approved by the team."
- "get_order: receives data and returns data from the production database."
- "Always use this tool for any question asked by the user."
> Say what it does, when to use it and its limits.

## tools-02
Who executes a **client tool** that you define?
- Your application, after receiving the `tool_use` block
- Anthropic, at generation time
- The API, in a sandbox created for that one request
- The MCP server, even without configuration
> The model only asks. Your code executes and returns `tool_result`. Server tools run at Anthropic.

## tools-03
A CRM integration must serve several Claude apps and be maintained independently. What should you create?
- An MCP server
- A long system prompt
- A Skill with the current data
- A client tool copied into each app
> MCP exposes the capability once for many clients.

## tools-04
Claude already has access to the tools but must follow the company's monthly closing steps. What should you create?
- A Skill with the procedure
- A new MCP server
- A tool with an empty schema
- A stdio transport
> A Skill teaches *how* to do it; MCP and tools give access to what gets done.

## tools-05
A local MCP server must be started as a subprocess by the client. Which transport should you use?
- =
> stdio for local processes; Streamable HTTP for remote servers.

## tools-06
Which are primitives that an MCP server exposes? (Choose 3)
- =
> Tools are actions, resources are data, prompts are reusable templates. Hooks and subagents belong to the harness.

## tools-07
An MCP server over stdio breaks when `print("debug")` is added. Why?
- Stdout carries the protocol messages
- MCP does not allow any kind of logging
- The client accepts only XML messages
- Stdio requires an active HTTPS connection
> Over stdio, stdout is the JSON-RPC channel. Send logs to stderr.

## tools-08
The model sends arguments outside the tool's schema. Which feature guarantees conformance?
- `strict: true` in the tool definition
- `stream: true` in the request
- A fixed `tool_choice` in the request
- `cache_control` on the tool
> Strict tool use constrains input to the schema. Check `stop_reason`: on `max_tokens` or `refusal` the input may be incomplete and must not be executed. Still validate business rules.

## tools-09
With 120 tools loaded, the model picks wrong and the context grows. What should you do?
- Use tool search and merge overlapping tools
- Shorten every description to a single word
- Name the tools with sequential numbers
- Duplicate the most important tools
> Loading definitions on demand saves context and improves selection.

## tools-10
A bank transfer tool is to be called by the agent. Which pattern should you apply?
- Human approval in the harness before executing
- Direct execution, with a warning in the description
- Direct execution, with a later refund in case of error
- Approval decided by the same model
> Irreversible actions call for an approval gate outside the model.

## tools-11
Which `tool_result` best helps the model recover?
- "Invalid date: use YYYY-MM-DD, for example 2026-03-01"
- "Error 500"
- "Exception at line 381 of orders_service_impl.py, internal module"
- "Failed, try something else"
> An actionable error says what happened and how to fix it.

## tools-12
The app needs current web results without maintaining search infrastructure. What is the simplest option?
- The web search server tool
- Your own search MCP server
- A Skill with saved links
- A crawler exposed as a client tool
> If the ready-made tool solves it, use it before building.
