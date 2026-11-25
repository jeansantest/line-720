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

## tools-13
An MCP server runs on a central host and serves hundreds of remote clients. Which transport should you use?
- stdio, started on each client machine
- Streamable HTTP, on the central server
- Files in a commonly shared network folder
- None, since MCP is only a local protocol
> stdio serves a local process. For a shared remote service, use Streamable HTTP.

## tools-14
When inventory is down, the tool returns `""` and the agent makes up quantities. Which return fixes this?
- An empty JSON object, which is easier to read
- The last known stock, without telling the agent
- None: simply end the agent run on each failure
- An error with the cause and what to try next
> Empty looks like "no data", not "failed". Stale data without notice is worse than an honest error.

## tools-15
You will expose an internal API with 60 endpoints to an agent. Which choices help? (Choose 2)
- Few tools, each of them with a clear role
- One tool per endpoint, for full flexibility
- Returns with only the fields the agent uses
- Neutral names, such as `op_1`, to avoid bias
> A toolset is a curated interface: no overlap, clear names and lean returns.

## tools-16
An extractor must **always** return data through the `save_invoice` tool, but sometimes the model answers in text. On models that accept it, which setting forces the call?
- `tool_choice` of type `tool` with that name
- `tool_choice` of type `auto` with that name
- A tool description written in capital letters
- A lower `max_tokens` to avoid any free text
> `tool` forces a specific tool; `any` forces some tool. Several recent models reject forcing with a 400: there use `auto` with `strict`, or structured outputs if you only want the JSON.

## tools-17
The app must answer **without** calling tools in one turn, keeping their definitions in the request. Which option should you use?
- `tool_choice: any`
- `stop_reason: none`
- `strict: false`
- `tool_choice: none`
> `none` prevents new calls without removing the definitions.

## tools-18
The API returns 400 after a `tool_use`. The next user turn held only the text "ok, go on". What was missing?
- A `thinking` block written by the application
- A second assistant message that is empty
- The `tool_result` with the matching `tool_use_id`
- A new definition of the tool in the system prompt
> Every `tool_use` needs its `tool_result` in the next user turn.

## tools-19
A tool has a parameter with an unusual nested structure, and the model gets the format wrong. Besides the description, what helps?
- A higher limit of output tokens
- Valid input examples in the definition
- A shorter and more generic tool name
- A `tool_result` holding more fields
> `input_examples` shows correct usage; each example must satisfy the schema.

## tools-20
In a loop with thinking enabled, what should you do with `thinking` blocks when returning a `tool_result`?
- Send them back without any change
- Remove them in order to save tokens
- Summarize them into a text block
- Move them into the system prompt
> The blocks of the turn must go back exactly as received, signature included; changing them can cause a 400 error.

## tools-21
A search tool returns 8 MB of JSON. Which design is better?
- Cutting the JSON at some arbitrary point
- Returning everything and relying on compact
- Splitting the JSON into eight `tool_result`
- Pagination and filters, with lean defaults
> Lean, on-demand results preserve context and remain valid.

## tools-22
The model calls `create_ticket` twice because of a retry. How do you avoid duplicates?
- A tool name in the singular form
- A final answer that is shorter
- An idempotency key in the tool
- A description asking for one call
> Side effects must be safe to repeat; that is guaranteed in code.

## tools-23
Which are good parameter **descriptions**? (Choose 2)
- "Use it correctly"
- "ISO 4217 currency, for example BRL"
- "Period in days, from 1 to 90"
- "Value of the field"
> Format, unit, limits and an example remove guesswork.

## tools-24
An MCP server wants to expose documents that the **host** chooses to attach to context, with no action. Which primitive fits?
- Resource
- Tool
- Prompt
- Elicitation
> Resources are application-controlled data; tools are model-chosen actions; prompts are user-chosen message templates.

## tools-25
An MCP tool receives an invalid postal code. How should the server signal so that the model can fix it?
- A JSON-RPC protocol error with no message
- Closing the connection with the client
- An empty result, as if it had succeeded
- A result with `isError: true` and details
> Execution failures go in the result. Protocol errors are for things like an unknown tool.

## tools-26
A third-party MCP server annotates its tool as "read-only". How should the client treat that?
- As permission to run without any log entry
- As a sign that the tool has no network access
- As an untrusted hint, keeping the controls
- As a guarantee, skipping the user's approval
> Annotations from untrusted servers are not a guarantee of behavior.

## tools-27
An HTTP MCP server receives a valid token, but issued for **another** service. What should it do?
- Accept it only for the reading tools
- Reject it, since the audience is not its own
- Accept it, since the signature is valid
- Accept it and pass the token along
> The server must validate the audience; passing tokens through creates the confused deputy.

## tools-28
During a tool call, the MCP server needs data only the **user** has. Which protocol feature fits?
- Elicitation
- Resource
- Prompt
- stdio transport
> Elicitation requests information from the user through the client, which controls the interaction.

## tools-29
You want the Messages API to use an MCP server directly through the **MCP connector**. Which requirement must the server meet?
- Run over stdio on your own laptop
- Expose only prompts and resources
- Live in the same process as the app
- Be reachable through an https URL
> The connector talks to remote servers and uses only tools. A local stdio server needs your own MCP client.

## tools-30
A Skill with great content is almost never triggered. What should you review first?
- The order of the headings in the file
- The name of the folder of the project
- The description: what it does and when
- The size of the scripts that it contains
> Only name and description are visible beforehand; they drive the decision to load.
