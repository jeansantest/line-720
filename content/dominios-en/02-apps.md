# Briefing
- By default, the Messages API is stateless: you resend the history.
- Check `stop_reason` before using the content.
- 429 = rate limit, 529 = overloaded: back off with jitter and respect `retry-after`. Retrying does not fix a 400.
- Batch: asynchronous, up to 24 h, half the price, results in any order.
- Pin model versions and version prompts like code.

# Questions

## apps-01
A chat "forgets" what the user said in the previous turn. The code sends only the latest message. What is the fix?
- Resend the message history with every request
- Set the same `user_id` on every request of the chat
- Enable streaming to keep the connection open
- Increase `max_tokens` to store more turns
> By default, the Messages API is stateless: the context is what you send. Message threads (beta) keeps the conversation briefly, but the application still needs its own copy.

## apps-02
The API returns 429 with a `retry-after` header. What is the correct reaction?
- Wait the indicated time and retry with backoff
- Retry immediately, in parallel, until one succeeds
- Switch the API key and retry the request
- Discard the request as invalid
> 429 is a rate limit. Respect `retry-after` and use backoff with jitter. The SDKs already retry a few times.

## apps-03
Which errors are normally **not** solved by repeating the same request? (Choose 2)
- =
> 400 and 401 require fixing the request or the credential. 429 and 529 are transient.

## apps-04
The JSON in the response is cut off midway and `stop_reason` is `max_tokens`. What happened?
- The output reached the limit set in the request
- The model finished its answer and omitted the closing
- The rate limit interrupted the generation
- The API key expired during the call
> With `max_tokens` the response is truncated. Raise the limit or reduce the request; do not process it as complete.

## apps-05
50 thousand reviews must be classified by tomorrow at the lowest cost. What should you use?
- Message Batches API
- Parallel streaming
- Fast mode on synchronous requests
- One chat session with all the reviews
> No urgency and high volume: Batches, with a 50% discount and a window of up to 24 h.

## apps-06
When reading batch results, the team matches each one by position and the data gets mixed up. How do you fix it?
- Match each result by its `custom_id`
- Sort the results by completion time
- Send one batch per request
- Read the results with streaming
> Order is not guaranteed. That is what `custom_id` is for.

## apps-07
A chat interface looks frozen for 20 seconds before showing a long answer. What improves the perception first?
- Streaming via server-sent events
- Message Batches API
- A higher `max_tokens` in the request
- More aggressive retries
> Streaming reduces the time to the first visible text, even if the total is similar.

## apps-08
Put the events of a stream with a single text block in order.
- =
> `message_delta` carries the `stop_reason` and final usage, right before `message_stop`.

## apps-09
The connection drops mid-stream, with no `message_stop`. What should the application do?
- Treat the response as incomplete and apply recovery
- Save the partial text as the final answer, since HTTP 200 was returned
- Assume `end_turn`, since there was text
- Execute tools with the partial JSON received
> HTTP 200 only means the stream started. Without the final event the response is partial; never execute incomplete input.

## apps-10
The same PDF is used in dozens of requests. How do you avoid resending the bytes?
- Upload it with the Files API and reference the `file_id`
- Convert it to base64 and compress it on every request
- Paste the file name into the prompt
- Store the PDF in the metadata field
> With the Files API you upload once and reference the ID. The content's tokens still count toward context.

## apps-11
The app needs JSON that follows a schema exactly. What is the most robust option?
- Structured outputs with the JSON Schema in `output_config.format`
- Asking for "respond only with JSON" and using a regex
- A `{` prefill in the last assistant message plus a lenient parser
- Temperature zero with one example in the prompt
> Structured outputs constrains generation to the schema, except on `refusal` or `max_tokens`, which must be handled. Last-turn prefill is rejected on recent models.

## apps-12
Answers must point to the exact document passage that supports them. What should you use?
- `document` blocks with citations enabled
- A low temperature and a request for honesty
- A repeated question until the answers agree
- A larger model without sending the document
> Citations returns passages with their location. Also tell the model to say when the answer is not in the source.

## apps-13
Where should an assistant's role and permanent rules go in an API-based app?
- In the `system` parameter
- In the API key name
- In the request's `custom_id`
- In the last assistant response
> The system prompt sets the operator's role and rules; user content goes in user turns.

## apps-14
A prompt that works on claude.ai behaves differently through the API. What is the most likely cause?
- The API does not include claude.ai's system prompt and tools
- The API applies a hidden system prompt stricter than the website's
- The API always uses models with less context
- The API ignores Markdown formatting
> Each surface has its own instructions and tools. With the API, you must provide yours.

## apps-15
One session mixed three unrelated tasks and quality dropped. Which *session hygiene* practice helps most?
- Starting a clean session for each task
- Keeping everything together to build up context
- Resending all the files on every turn
- Switching models on every message sent
> Irrelevant context distracts and costs money. Separate tasks and carry over only what is needed.

## apps-16
A production prompt was edited directly in the dashboard and quality dropped. What would have made rollback easier?
- Prompts versioned in the repository, with review and evals
- A daily backup of the database used by the application
- A higher number of retries in the application
- A separate API key for each developer
> A prompt is code: version, review, eval and rollback.

## apps-17
Why pin the model version in production instead of automatically following the newest one?
- To change only after running evals and checking breaking changes
- To guarantee identical answers on every run of the same prompt
- So that the pinned version is never deprecated
- To eliminate the cost of input tokens
> New models can change behavior and parameters. Pin, test, migrate; and follow the deprecation schedule.

## apps-18
The client asks for "an AI chatbot". What should you define **before** choosing the model?
- Use cases, success criteria, and cost and latency limits
- The assistant's name, its personality and the welcome texts
- The number of subagents in the architecture
- The highest possible value for `max_tokens`
> Model and architecture follow from measurable requirements.

## apps-19
After launching an app with Claude, what should be monitored? (Choose 3)
- Sampled quality of the answers
- Token usage and cost
- Latency and error rate
- Internal model weights
- The chosen theme color
> Operations covers quality, cost and reliability, feeding real failures back into the evals.

## apps-20
An async job fires 2,000 simultaneous calls and gets many 429s. Which adjustment is most appropriate?
- Limit concurrency with a semaphore or queue
- Split the job into processes with no shared limit
- Increase the timeout to one hour
- Disable the SDK's retries
> Control concurrency according to your limits. Retries alone just repeat the burst.

## apps-21
Retrying an operation that charges the customer may duplicate the charge. Which pattern protects you?
- An idempotency key per operation
- A prompt asking not to duplicate
- Streaming the billing response
- A detailed log of each attempt
> Idempotency ensures that repeating has the same effect as executing once.

## apps-22
Claude will do a large refactoring of legacy code. What is the safest first step?
- Create tests that capture the current behavior
- Ask for the complete rewrite in a single commit
- Disable CI until the refactoring is finished
- Remove the code that seems to be unused
> Characterization tests give a verifiable signal; then move in small, reviewable steps.

## apps-23
The response arrives with HTTP 200 and `stop_reason: "refusal"`. What should the code do?
- Handle the refusal in its own path before reading the content
- Repeat the same request with backoff until it gets accepted
- Consider it a success, since the status is 200
- Report an authentication failure to the user
> Not every undesired outcome becomes an HTTP exception. Branch on `stop_reason`.

## apps-24
Your company requires Claude access to go through Amazon Bedrock, with IAM. What should you consider?
- Using the provider's client and checking feature availability
- Using the Anthropic key inside the IAM header
- Assuming full parity of features and model IDs
- Using the default Anthropic client and changing only the base URL
> Bedrock, Vertex and Foundry differ in authentication, IDs and available features. Claude Platform on AWS is another option: it uses IAM but is operated by Anthropic.
