# Briefing
- Choose by eval: the cheapest model that meets the quality bar.
- Caching works on prefixes: stable content first, volatile last.
- Prefix order: `tools` → `system` → `messages`.
- Effort adjusts depth and spend; `max_tokens` is a hard ceiling.
- Measure cost per completed task, not per request.

# Questions

## model-01
Millions of short messages a day need simple, fast classification. Where should testing start?
- Haiku, validating quality with an eval
- Opus at maximum effort, to be safe
- Opus coordinating Sonnet subagents per message
- The model with the largest context window
> High volume and a simple task favor the smaller model. The eval says whether it is enough.

## model-02
The cache never hits. The system prompt starts with `It is now 14:03:22`. What should you do?
- Move the time after the cached content
- Increase the cache TTL to one hour
- Add more breakpoints after the time
- Change the time format to UTC
> Caching is an exact prefix match. Any change at the start invalidates everything after it.

## model-03
Order the content to maximize prompt caching.
1. Stable tool definitions
2. Fixed system prompt
3. Shared reference document
4. Conversation history
5. The user's new question
> From most stable to most volatile, in the order `tools`, `system`, `messages`.

## model-04
How do you confirm that prompt caching is working?
- Check `usage.cache_read_input_tokens` in the responses
- Check whether `input_tokens` stays the same in the responses
- Check whether the HTTP status changed to 304
- Check whether `output_tokens` dropped to zero
> Cache reads appear in `usage`. Zero on repeated calls indicates a silent invalidator or a prefix that is too short.

## model-05
Why can the same input produce different answers?
- Generation samples the next token from a distribution
- The model is adjusted with feedback from earlier calls
- The API stores and changes the previous prompt
- The tokenizer picks languages at random
> Generation is probabilistic. Design validation and evals to tolerate variation.

## model-06
What is the relationship between `max_tokens` and effort?
- `max_tokens` is a hard ceiling; effort guides how deeply the model works
- They are two names for the same output token limit
- Effort is a hard reasoning ceiling; `max_tokens` guides the style of the answer
- `max_tokens` limits input and effort limits output
> Reaching `max_tokens` truncates. Effort influences spend but is not a cutoff.

## model-07
In recent models, what does *adaptive thinking* mean?
- The model decides when and how much to reason based on the task
- The developer sets an exact budget of reasoning tokens in advance
- The model learns permanently from each conversation
- The API switches models on every hard question
> It replaces the fixed budget on recent models; use effort to adjust.

## model-08
When migrating from an old model, requests with assistant prefill start returning 400. What is the lesson?
- Read the migration guide and test before switching models
- Repeat the request until the new model accepts it
- Migrate in production first and fix errors as they come up
- Hide the error and return an empty response
> Versions can remove parameters. Structured outputs usually replaces prefill used for formatting.

## model-09
A model costs half as much per token but needs three attempts per task. How should you compare?
- By total cost per completed task
- By the price per million tokens
- By the token count of the first attempt
- By the size of the context window
> Retries and extra turns can cancel out the lower price.

## model-10
How do you estimate a prompt's tokens for Claude before sending it?
- With the API's token counting endpoint
- With another vendor's tokenizer
- By always dividing the characters by two
- By adding up only the user's words
> Tokenizers differ across vendors and even across Claude generations.

## model-11
A task with an unusual format fails with instructions alone. Which technique should you try next?
- Multi-shot, with varied examples of the format
- A model with a larger context window, no examples
- Zero-shot repeated several times
- Streaming the complete response
> Diverse examples show the pattern that instructions could not describe.

## model-12
Which measures reduce cost **without** switching models? (Choose 3)
- Caching the large, repeated prefix
- Using Batches for what is not urgent
- Limiting the size of tool results at the source
- Enabling fast mode on every call
- Raising effort on trivial tasks
> Fast mode costs more per token; high effort spends more tokens. Reduce results at the source: clearing history already sent frees context, but invalidates the cache from that point and may cost more.

## model-13
What is an advantage of the official SDK over manual HTTP calls?
- Built-in types, retries and streaming helpers
- Exclusive models that REST does not offer
- Automatic, free caching of all responses
- Conversation history saved on the server
> The SDK wraps the same REST API and saves repetitive code.

## model-14
Which mechanism is used to receive streaming text from Claude through the Messages API?
- Server-sent events over HTTP
- WebSocket on a persistent connection
- FTP transfer
- A webhook for each token
> With `stream: true`, events arrive via SSE in the HTTP response.

## model-15
An audit demands **byte-identical** answers for the same input. What is correct to say?
- Using streaming is enough to stabilize output
- Fixing `max_tokens` guarantees the same answer
- Prompt caching repeats the previous answer
- There is no guarantee; validate and tolerate it
> No parameter guarantees identical output. If you must repeat it, store the answer in your app. Recent models and API versions do not even accept `temperature`.

## model-16
On a **recent** model, the input fits the window, but input + `max_tokens` exceeds it. What happens?
- The API trims the start of the input to fit
- The API accepts and may stop at the window limit
- The API switches to a model with a larger window
- The API charges double for the tokens in excess
> Input and output share the window. From the 4.5 models on, the request is accepted and may end with `model_context_window_exceeded`; on earlier ones it is a validation error. If the input alone does not fit, it is a 400 on all.

## model-17
Which statements about the cost of **prompt caching** are correct? (Choose 2)
- Writing to the cache costs more than regular input
- The cache also gives a discount on output tokens
- Reading from cache costs far less than regular input
- Whatever was written remains available forever
> You pay a premium to write and save on reads, within the TTL (5 minutes by default, refreshed on each use).

## model-18
A 30k-token prefix is used **once a day**. Is it worth caching with the default TTL?
- Yes, since every future read gets a discount
- Yes, since the write itself is always free
- No, since the cache accepts only small texts
- No, since it expires before it is read again
> With no re-read inside the TTL, you pay the write premium and never collect the discount.

## model-19
A live copilot needs Opus quality, but output is slow. Cost is secondary. Which option should you test?
- Message Batches API to gain throughput
- More effort so the model thinks better
- Fast mode, on a model that supports it
- Prompt caching of the output tokens
> Fast mode speeds up output of the same model at a higher price. It does not work with Batches.

## model-20
An old app sets a fixed `budget_tokens` for reasoning. When migrating to a current model, what is the recommended equivalent?
- Raise `budget_tokens` until quality goes up
- Adaptive thinking, with effort to tune it
- Fast mode, which shortens reasoning time
- Ask in the prompt for an exact token count
> On current models the fixed budget is rejected or deprecated: the model decides when to think and effort guides how much.

## model-21
`usage` shows `input_tokens: 40` and `cache_read_input_tokens: 9000`. What was the total input?
- 40, since the cache does not count as input
- 9,000, since the 40 are already within them
- 8,960, since the 40 are deducted from cache
- 9,040, plus whatever was written to cache
> Total = `input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`.

## model-22
Caching is on for a short prompt, with no error, but writes and reads stay at **zero**. Why?
- The cache needs at least three messages
- The prompt contains few-shot examples
- The prefix is below the model's minimum
- The cache only works with streaming on
> Below the minimum, the request runs uncached with no error. The minimum varies by model.

## model-23
An app adds a tool at the **start** of the list and the cache is lost. Why?
- The new tool changes the model in use
- Tools come before system and messages
- Tools stay out of the cache in all cases
- The cache stores only the last tool listed
> The order is tools, system, messages: changing a level invalidates it and those after.

## model-24
An agent waits 20 to 40 minutes for human approval between turns. Which cache setting should you evaluate?
- The 1-hour TTL, if re-reads make up for it
- The default TTL, since it lasts all day
- No cache, since a human is in the process
- Four breakpoints in the same text block
> The default TTL would expire. The 1-hour one costs more to write; do the math.

## model-25
Which tends to be the biggest waste in a 50-turn agent **without** caching?
- Generating the final text of the last answer
- Defining the tool names the first time
- Opening the HTTP connection to the server
- Reprocessing the same history on each turn
> Accumulated input grows with each turn; the repeated prefix is the cache target.

## model-26
A system has 90% easy requests and 10% hard ones. Which design usually balances cost and quality?
- Always use the smallest model for everything
- Pick the model at random on each request
- Route by difficulty, with evals per route
- Always use the largest model for everything
> Routing only pays if the classifier and each route are measured.

## model-27
Before moving up to a more expensive model, what should you test first?
- Removing the evals so as to save tokens
- Improving prompt, context and effort now
- Changing the language of all app prompts
- Doubling the `max_tokens` of the requests
> Many failures come from context or instruction. Measure before paying more.

## model-28
A public benchmark lists model X as the best. What is the correct use of that information?
- As a hint, confirmed with your own eval
- As proof, since the ranking is independent
- As a reason to switch models right away
- As a substitute for regression tests
> Your task distribution may differ from the one measured.

## model-29
Which criteria should go into model choice? (Choose 2)
- Latency required by the user
- Position in a public ranking
- Release date of the model
- Quality measured on your task
> Add cost per completed task and needed features (vision, context, tools).

## model-30
Why can asking the model to count letters or characters fail?
- `max_tokens` cuts the count midway
- The default effort is too low to count
- It processes tokens, not isolated letters
- It was not exposed to texts with letters
> For exact counts, use code or a tool.

## model-31
The model confidently answers about an event from **yesterday**, with no tools. How should you treat it?
- As a disguised refusal by the model
- As unreliable: a current source is missing
- As correct, since its tone is confident
- As correct, if it repeats the same answer
> Knowledge has a cutoff date; supply the information through search or context.

## model-32
A **simple** formatting task is slow and costly at high effort. What should you test?
- Lowering effort and checking the eval
- Raising `max_tokens` to speed it up
- Enabling more tools in the request
- Repeating the instruction three times
> Effort is the lever of depth versus cost and time.

## model-33
What distinguishes zero-shot, one-shot and few-shot?
- The number of calls made to the API
- The number of tokens the model outputs
- The number of models used in parallel
- The number of examples in the prompt
> Start simple; add examples when the eval shows a gain.

## model-34
Two Python coroutines make calls but run one after the other: `await a(); await b()`. How do you make them concurrent?
- `time.sleep(0)` between the two calls
- Replacing `async def` with `def`
- `await asyncio.gather(a(), b())`
- `await a() and await b()`
> Awaiting in series is not concurrency; `gather` schedules them together.

## model-35
A custom HTTP client receives an SSE stream and runs `JSON.parse` on **each network chunk**. Why does it sometimes fail?
- The network always delivers two events
- An event may arrive split across chunks
- SSE sends its events in a binary format
- The SSE JSON uses single quotes in keys
> Buffer and split by event before parsing; the SDK already does this.
