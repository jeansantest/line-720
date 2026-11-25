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
