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

## apps-25
Goal: answer proposals within one hour. Which item is an **infrastructure** requirement derived from it?
- The system must generate a draft for each proposal
- Support 200 concurrent calls at peak, in 2 zones
- The company wants to close 15% more contracts next year
- The text of the answers must follow the brand tone
> Infrastructure is about capacity and availability. The others are a function, a business goal and style.

## apps-26
Which are **non-functional** requirements of a clinic assistant? (Choose 2)
- Be available 99.9% of the month
- Book appointments through chat
- Isolate the data of each patient
- Send a reminder the day before
> Non-functional means a system quality (availability, security). Booking and reminding are functions.

## apps-27
A maintenance app sends Claude the string `"C:/photos/panel.jpg"` and the model says it sees no image. What is the fix?
- Ask in the prompt for the model to open the file on disk
- Convert the photo with OCR, since the API only reads text
- Use streaming, which makes it possible to send binary files
- Send an `image` block as base64, a URL or a `file_id`
> The API does not read your disk. Images go as content blocks, next to the text.

## apps-28
A job translates 400 records in a serial `for` loop and takes 2 hours. The user expects results in **minutes**. What should you do?
- Merge the 400 records into a single large request
- Move everything to the Message Batches API
- Send them in parallel with bounded concurrency
- Turn on streaming to speed up each response
> Independent items parallelize well. Batches may take up to 24 hours; streaming only changes delivery.

## apps-29
An app has been live for months. The team tracks cost, fixes prompts and plans a model change. Which phase is this?
- Requirements analysis of the solution
- Operations and maintenance
- Architecture design
- Initial implementation of the system
> Monitoring, fixing and evolving a live system is operations and maintenance.

## apps-30
A team wants to write its own 429 retry loop around the **official SDK**. What should it check first?
- The SDK already retries; tuning `max_retries` may do
- The SDK does not retry; a custom loop is mandatory here
- A 429 invalidates the conversation, so a retry cannot work
- Retries only exist in the Batches API; migration is needed
> The SDK retries transient errors by itself (2 times by default). An outer loop multiplies attempts.

## apps-31
A request sets `stop_sequences: ["END"]` and ends on it. Which `stop_reason` does the response carry?
- `pause_turn`
- `stop_sequence`
- `end_turn`
- `max_tokens`
> The matched sequence comes in the `stop_sequence` field of the response.

## apps-32
The code reads `response.content[0].text` and breaks when thinking or tools are on. Why?
- `content` is a list of blocks of various types
- `content` becomes a string when tools are on
- The text is now returned in the HTTP header
- The first block of text comes encrypted
> Iterate over the blocks and filter by `type`.

## apps-33
A batch result comes with type `expired`. What does it mean?
- The result was available but charged twice
- The model refused the request due to policy
- The `custom_id` repeated that of another request
- The request was not processed within 24 hours
> Expired requests are not billed; resubmit the missing ones.

## apps-34
In a batch, 3 of 10 thousand requests return `errored` due to invalid input. What is the right action?
- Discard the results of all the requests
- Repeat the three until they succeed
- Fix and resubmit only those three
- Resubmit the entire batch unchanged
> Each request is independent. Invalid input is not solved by repeating it as is.

## apps-35
Which features do **not** work with the Message Batches API? (Choose 2)
- System prompt
- Response streaming
- Fast mode
- Tool use
> Batch is asynchronous: there is no stream and no fast mode.

## apps-36
A batch finished two months ago and the team wants to download the results. What should it expect?
- They may no longer be available to download
- They are kept forever in the company account
- They are re-sent by e-mail on opening the panel
- They must be paid for again before downloading
> Retention is limited (29 days in the docs consulted). Save results in your own system.

## apps-37
The API responds 404 `not_found_error` right after a configuration change. What should you check first?
- The available tokens-per-minute budget
- The size in bytes of the body sent
- The value of the `retry-after` header
- The ID of the model or resource used
> 404 means the resource does not exist, often a mistyped or retired ID.

## apps-38
The difference between 401 and 403 in the API:
- 401 is a usage limit; 403, server overload
- 401 is a large request; 403, invalid JSON
- 401 is a bad credential; 403, no permission
- 401 is no permission; 403, a bad credential
> Neither is solved by retrying.

## apps-39
A customer wants PDFs with **charts** analyzed. What is correct?
- Paste the base64 PDF inside the text
- Send the PDF as a `document` block
- Extract only text, as images are ignored
- Convert the PDF into audio before sending
> The `document` block allows using text and visual content of the pages, within limits.

## apps-40
A multi-turn conversation via the API gets more expensive with each message. What is the structural cause?
- The whole history is sent again on every turn
- The API charges a fixed fee per connected user
- The model reprocesses turns of other customers
- The system prompt doubles after every response
> The API is stateless. Caching, compaction and windowing reduce cost.

## apps-41
When using **citations** and `output_config.format` in the same request, what happens?
- Citations become fields of the JSON
- The schema is silently ignored
- The response comes in two parts
- The API rejects it with a 400 error
> The features are incompatible. Choose one, split into two calls, or see the documented pattern for structured data with citations.

## apps-42
With structured outputs on, in which cases may the output still **not** follow the schema? (Choose 2)
- Use of streaming
- A prompt in Portuguese
- A cut by `max_tokens`
- A model refusal
> Check `stop_reason` before trusting the JSON.

## apps-43
A chat streams the answer and the user clicks "stop". What should the backend do?
- Send the same question again without streaming
- Cancel the request and store it as partial
- Let the stream go on and hide the rest of it
- Erase the conversation and start a new session
> Canceling saves resources; marking it as partial avoids treating it as complete.

## apps-44
The app serves 5 languages. How do you decide the response language predictably?
- A system prompt rule with the account language
- Letting the model choose on each message
- Translating each answer into all the languages
- Using a different model for each language
> An explicit rule plus trusted application data give predictability.

## apps-45
A legal assistant must show where each claim came from. Which design is most verifiable?
- A list of links the model writes from memory
- A confidence score from zero to a hundred
- A notice that the answer may contain errors
- Citations tied to the passage shown to the user
> Structured citations point to the supplied document; links from memory may be made up.

## apps-46
A screen makes 4 sequential model calls and takes 20 s. Two do not depend on the others. What should you do?
- Increase the `max_tokens` of all the calls
- Repeat the slowest calls two times each
- Parallelize independents and show partials
- Replace the four calls with a nightly batch
> Attack the critical path and the perceived latency.

## apps-47
Prompt, model and schema change together in a release. How do you allow a **safe** rollback?
- Keep each one in a manually edited panel
- Version them as a set and deploy together
- Keep only the prompt, as the rest matters little
- Note the changes in a shared team document
> The tested combination is the unit to roll back.

## apps-48
Which values should vary by **environment**, outside the code? (Choose 2)
- Access credentials
- Concurrency limits
- The JSON validation logic
- The names of internal functions
> Per-environment configuration lives outside code; secrets in a secret manager.

## apps-49
An experiment with a new prompt should reach 5% of users and be switchable off at once. What should you use?
- A branch that the team publishes at night
- A notice asking the users to reload
- A second system under another domain
- A feature flag with per-variant metrics
> Flags separate deploy from release and allow comparison and instant shutdown.

## apps-50
Before retiring a model in use, the provider announces the date. Which plan is adequate?
- Swap the ID directly in production and observe
- Copy the old responses into a permanent cache
- Run evals on the replacement and migrate early
- Wait for the last day in order to avoid rework
> Deprecation is a foreseen lifecycle event: inventory, eval, migration and rollback.

## apps-51
At which phase should the acceptance criteria of an LLM app appear?
- During the first change of model
- In requirements, before building
- After the first serious incident
- In the project's final documents
> Early criteria guide design and evals; late ones become rationalization.

## apps-52
A worker receives SIGTERM in the middle of a 40 s call. Which behavior is correct?
- Stop taking tasks and finish or requeue
- Exit at once, ignoring the tasks in progress
- Restart the call from zero until it finishes
- Block the signal so as never to be stopped
> Graceful shutdown avoids losing and duplicating work.

## apps-53
An app's unit tests call the real API on each commit: slow and flaky. What should you do?
- Remove the tests that depend on responses
- Run the tests only once in each quarter
- Repeat each test until it finally passes
- Mock the API there and keep evals separate
> Test logic with doubles; measure model quality in separate evals.

## apps-54
Claude generated a 2,000-line PR that passes tests. What is the proper practice?
- Approve it, asking Claude to self-review
- Always reject it for being AI-generated
- Split it and review like anyone's code
- Approve it, since the tests passed cleanly
> Authorship does not waive review; smaller changes are reviewable.

## apps-55
The customer asks for "100% correct answers". How do you turn it into a useful requirement?
- Include the exact phrase in the system prompt
- Set a measured target and an error path
- Promise it, as long as the top model is used
- Drop the topic to avoid raising expectations
> Combine an acceptable limit per error type with verification, abstention and escalation.
