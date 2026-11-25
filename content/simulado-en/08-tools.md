# Questions

## tools-501

An agent has `search_customers` and `find_client`, built by different teams over the same base. It alternates between them, and results have distinct fields. Both have users in other systems. What should be done in the agent?

- Expose only the older one and, whenever it fails, direct the user to look for the other team
- Expose a single tool, with a clear name and description, that unifies both behind the interface
- Expose both of them with longer descriptions, letting the model choose according to the question
- Expose both of them and add a third tool, whose role is to decide which one ought to be called

> Overlapping tools create choice without criteria; unifying in the agent's interface does not affect other systems. Descriptions do not remove redundancy, and a router tool only adds a step. Keeping only the older one loses the other's data.

## tools-502

A flight tool returns 400 options with 60 fields. The agent chooses well, but the context fills up in a few searches, and the user usually asks for details only of the chosen option. Which design fits best?

- Return a prose summary of the 400 options, written by another model on each search performed
- Return all the options, but only with the ten fields that weigh most in the decision
- Return a few options with the decision fields and an ID, and offer another tool for the details
- Return everything and clear the result from the context right after the agent answers the user

> A lean result with an ID allows drilling down on demand. Clearing later still pays for the volume; prose loses exact data; 400 options still fill the context.

## tools-503

An extractor uses a tool with a schema just to get JSON, forcing it with `tool_choice`. On migrating to a newer model, the call returns 400. Structured output is all the app needs. Which change is most direct?

- Go back to the previous model and pin it, until the new one accepts forced choice again
- Keep the tool on `auto` and describe, in capital letters, that it must always be called
- Remove the schema and ask for the JSON in the prompt, with a tolerant parser in the app
- Use structured outputs in `output_config.format`, since there is no action to be executed

> Some recent models reject forcing tools; to just get JSON, the dedicated feature is structured outputs. Pinning the old one postpones the problem; `auto` with emphasis and a tolerant parser do not guarantee.

## tools-504

A team publishes a remote MCP server with customer data, used by three apps. Today it accepts any token signed by the company's identity provider, including those issued for other services. Which fix is the priority?

- Validate that the token was issued for this server, besides checking its signature and scopes
- Change the transport to stdio, which needs no tokens and eliminates the risk of their misuse
- Log all of the tokens received, in order to investigate later which services were using them
- Check the scopes in each tool, keeping the valid signature as the proof of the token's origin

> Without checking the audience, another service's token opens the data. stdio does not serve remote apps; logging tokens exposes secrets; scope and signature do not say which service the token was issued for.

## tools-505

A ticket MCP server offers the tool `close_ticket`. If the ticket is already closed, the server throws a protocol error, and the agent ends the task without explanation. It should carry on with the other tickets. Which adjustment should be made?

- Return success with no message, as the ticket's final state is the same that was requested
- Return a result with `isError: true` and the ticket's status, so that the model can adapt
- Return a result with `isError: true` and a generic text saying that the operation failed
- Keep the protocol error and increase the number of client retries allowed for that tool

> A business failure goes in the result, visible to the model. A generic text does not tell the model what to do; retrying does not change state; silent success hides that nothing was done now.

## tools-506

A law office wants Claude to follow its petition standard, with templates and checklist, and also look up cases in an internal system. Four apps use Claude. Which pieces should it use? (Choose 2)

- A Skill that carries the internal system's password and the lookup instructions
- A system prompt with the complete standard and a daily copy of all the cases
- A Skill with the standard, the templates and the checklist, loaded when relevant
- An MCP server that exposes the case lookup to all four of the applications
- An MCP server whose tools return the text of the standard for each petition

> Procedure calls for a Skill; system access calls for MCP. Serving procedure via a tool is a detour; a password in a Skill exposes a secret; a daily copy gets stale and fills the context.

## tools-507

An app needs current news citing the source. The team plans its own MCP server with a paid search engine, in two months. There is no requirement for exclusive sources, and delivery is in two weeks. What should you recommend?

- Start the MCP server with a reduced scope, delivering one source in two weeks and the rest later
- Use a Skill with a list of trusted websites, updated by the team at the beginning of every week
- Skip search and use the most recent model, whose knowledge covers the news of the whole period
- Start with the web search server tool and build something custom only if a requirement is not met

> The ready-made tool covers the requirement in time. A custom MCP is cost with no demonstrated need; a Skill searches nothing; training knowledge does not cover current news. A smaller scope still builds what is not needed.
