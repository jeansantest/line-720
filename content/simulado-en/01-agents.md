# Questions

## agents-501

An insurer processes 8,000 claims a day. All go through extraction, policy check and calculation, always in that order. In 6% of them, the check requires investigating varied documents, with unpredictable steps. Audit wants every decision traceable. Which architecture fits best?

- A code workflow that fixes the order of the three steps, with an agent in the check of all claims
- A code workflow for all claims, invoking a bounded agent only in the cases that require investigation
- A single agent for all claims, with detailed instructions about the right order of the three steps
- A code workflow for all claims, with a larger prompt in the check to foresee the most difficult cases

> The fixed path stays predictable and auditable, and autonomy enters only where steps are unpredictable. A larger prompt does not create new steps; an agent for all, in everything or only in the check, pays cost and variance where 94% need none.

## agents-502

A team evaluates a research system with five parallel subagents. Compared to a single agent, it is right 4% more often and spends nine times the tokens. Research is daily, and the report is read by analysts who fix flaws in minutes. What should you recommend?

- Adopt the five subagents with a smaller model in all of them, with no need to repeat the evaluation
- Keep the single agent and double the turn limit, which tends to be equivalent to five subagents
- Keep the single agent and study what the 4% is missing, since the gain does not pay the cost here
- Adopt the five subagents and cut the cost with prompt caching, which the team has not enabled yet

> Multi-agent is justified when the task's value covers the cost; here errors are cheap to fix. Changing the model without re-evaluating, or doubling turns, assumes an effect nobody measured. Parallelism shortens time but does not cut tokens. Caching may lower the bill, but the gain stays small for the use.

## agents-503

A proposal generator uses a second model as critic, for up to three rounds. Scores rise in the first round and stay flat afterwards, but the text gets longer and more cautious. Customers prefer the first-round version. Which adjustment is most adequate?

- Increase to six rounds, giving the critic more chances to notice that the text has become too long
- Remove the critic and let a larger generator write alone, which avoids the growth across rounds
- Keep the three rounds and ask the generator to ignore critiques once the text exceeds one page
- Stop once the criterion is met and revise the critic rubric with examples that customers preferred

> The loop only helps with a stop criterion and rubric aligned with the user. More rounds amplify the drift; removing it discards the real first-round gain; ignoring critiques hides the wrong rubric. A larger generator was not measured.

## agents-504

A migration agent works for hours on 300 files. At each compaction it forgets which ones are done and redoes some. The repository tests are reliable. The team wants to resume from any point, even after a process crash. Which design solves it?

- Keep an on-disk record of the state of each file, updated only after the tests for it have passed
- Raise the threshold that triggers compaction, so that the full history lasts longer in the session
- Ask in the system prompt for the agent to list, in each response, all the files already migrated
- Split the files among subagents and have the main agent keep in context the list of what was done

> External, verified state survives compaction and crashes. Delaying compaction and listing in context do not survive a crash; subagents reduce context but do not record progress. A list kept in context is lost with it.

## agents-505

In a custom loop, the model returns two `tool_use` blocks: `get_rate` and `book_hotel`. The first works and the second raises a timeout, leaving unknown whether the booking happened. What should the harness return to the model?

- Two `tool_result` in the same turn, the second as an error asking the model to call the tool again
- Two `tool_result` in the same turn, the second as an error stating the uncertainty and how to check it
- Only the `tool_result` that worked, repeating the booking internally until it gets a definitive answer
- Two `tool_result` in the same turn, the second as success, since the booking was probably completed

> Each `tool_use` needs its result, and the model must know the state is uncertain so it checks before repeating. Repeating without checking, in the harness or at its request, may duplicate the booking; assuming success invents a fact; ending the loop discards the rate.

## agents-506

A service agent uses persistent memory. A customer said "I am diabetic" and, months later, "that was my father". The agent keeps avoiding sweets for the customer. Which memory change addresses the cause?

- Store facts with source and date, always appending the new ones without changing the old ones
- Increase the number of facts loaded per session, so that the model notices the contradiction itself
- Store facts with source and date, and update or invalidate the record when a correction comes up
- Store the full transcript of conversations and load all of it at the beginning of each new session

> Memory needs provenance and updating. A full transcript is expensive and keeps the contradiction; just appending leaves both facts in force; loading more facts just hopes the model guesses.

## agents-507

A supervisor delegates to a worker the task "research the competitor". The worker returns 12 pages about company history, but the user wanted to compare prices. The supervisor only has the final result. Which briefing changes address the failure? (Choose 2)

- Define the return format, with the expected fields and the limits of the scope
- Send the worker the full transcript of the conversation between user and supervisor
- Split the research among three workers, each covering one period of the competitor's activity
- Authorize the worker to answer the user directly, without going through the supervisor
- State the user's final goal and which decision the result is supposed to enable

> Goal and return contract were missing. The full transcript brings noise and cost; more freedom and direct answers worsen the drift. Splitting by period multiplies the same misguided research.

## agents-508

An eight-person fintech wants an agent that runs for hours, resumes sessions and executes isolated code. There is no infrastructure team, and the data may be processed and retained in the provider's cloud, and a beta service is acceptable. The deadline is three weeks. Which option is the best start?

- Managed Agents, with persisted sessions and an execution environment provided by the platform
- Claude Agent SDK on its own servers, so as to keep full control of the environment from the start
- Messages API with a loop written by the team, since it is the option with the fewest dependencies
- Claude Code in headless mode, scheduled on a server, with its state saved in a set of log files

> A short deadline, no infrastructure and no data restriction point to the managed option. The others work but leave hosting, isolation and persistence to the team.

## agents-509

An agent on the Claude Agent SDK runs in production with no user at the terminal. Reads are free, writes to `/reports` are free, and any other write depends on a business rule that changes per customer. How do you implement the last part?

- A `PreToolUse` hook that asks a second model whether the write is compatible with the customer rule
- An application permission callback that looks up the customer rule and returns allow or deny
- A fixed list of allowed tools, approving all of the writes and reviewing the logs at day's end
- A system prompt section with the rules of each customer, asking the agent to follow them strictly

> The decision is dynamic and must be enforced by code. A fixed list does not tell customers apart; a prompt is guidance; a second model only estimates a rule that the application knows; bypassing removes the control.

## agents-510

A nightly agent has `max_turns` of 40. In 3% of runs it hits the limit, and the system saves the empty report as "completed". The team proposes raising the limit to 100. What should come first?

- Remove the turn limit and keep only a dollar budget, which ends each execution earlier than before
- Ask the agent to write a partial report whenever it notices that it is getting close to turn 40
- Treat the limit result as a visible failure and analyze the traces of that 3% before changing the value
- Raise the limit to 100 and monitor whether the share of empty reports falls over the following weeks

> The immediate defect is treating a limit as success, and the cause of the 3% is unknown. Raising or removing limits may just make the same loop costlier; the agent does not reliably track its own cap.

## agents-511

A coding agent has three needs: every changed file must go through the linter, commits must never contain secrets, and comment style should follow the team guide, where occasional deviations are acceptable. The team wants the smallest mechanism suited to each. Which combination should it use?

- Instructions in `CLAUDE.md` for all three, with the first two of them marked as mandatory
- Hooks for all three, using a model as judge that blocks any comment that departs from the guide
- Hooks for the secrets, and instructions in `CLAUDE.md` for the linter and the comment style
- Hooks for the linter and the secrets, and instructions in `CLAUDE.md` for the comment style

> What is mandatory and checkable goes in a hook; style is judgment and fits an instruction. Blocking via a judge is heavy for style; an optional reviewer guarantees nothing. `CLAUDE.md` alone does not enforce the mandatory ones.

## agents-512

An agent that opens tickets was approved in tests where tools were always available. In production, the ticket system is slow on Mondays, and the agent opens duplicates and claims it is done. Which actions address the problem end to end? (Choose 2)

- Include evals with slow and partially failing tools, measuring the actual outcome
- Raise the model effort on Mondays, so that it thinks more before repeating a call
- Instruct in the system prompt that the agent never opens two tickets on one topic
- Increase the number of automatic harness retries until the ticket system responds
- Make ticket creation idempotent, using a key generated for each of the requests

> Idempotency prevents the duplicate effect and evals start covering the real condition. Effort and prompts do not guarantee; more retries without idempotency make it worse.
