# Questions

## apps-501

A legal editor streams clauses to the screen and, at the end, writes the text into the contract. Users reported contracts with clauses cut in the middle. Logs show HTTP 200 for all. Which check was missing before saving?

- Confirm that the output token count stayed close to the average of all the other clauses
- Confirm that the stream finished and that `stop_reason` indicates a normal end of the response
- Confirm that the HTTP status was 200 and that the total time stayed below the client's limit
- Confirm that the stream connection closed without a network error and that some text was received

> The 200 arrives before the content. Only stream end and `stop_reason` tell a complete response from a `max_tokens` cut or a drop; the others are hints, not proof. A clean close does not rule out a cut by the token limit.

## apps-502

A retailer reclassifies 900 thousand products every weekend: the data is ready on Saturday at noon and the result is due on Monday at 8 a.m. The job uses synchronous calls, competes for limits with the customer chat and sometimes takes it down. Which change solves it best?

- Increase the job's concurrency, so that it finishes before the chat traffic starts to grow
- Put a hundred products in each synchronous call, reducing the count of requests per minute
- Send it as several Message Batches API jobs, matching the results by `custom_id`
- Keep synchronous calls, but with streaming, to free the capacity used by the chat earlier

> Loose deadline, high volume and nobody waiting is the Batches profile. Streaming frees no capacity; more concurrency worsens contention; merging products affects quality and still competes for tokens.

## apps-503

A service uses the official SDK with default settings and, around it, a decorator that retries any exception five times. In a 429 spike, the volume of attempts exploded and the queue stalled. What is the best fix?

- Turn off the SDK retries and keep the decorator as it is, with five attempts per exception
- Increase the SDK timeout, so that each attempt has more time before receiving the response
- Replace the decorator with a loop that always waits one second before each of the attempts
- Keep retries in a single layer, with backoff, an attempt cap and only for transient errors

> Layers multiply attempts. Keeping the decorator would retry 400 and 401; timeouts do not reduce calls; a fixed wait synchronizes clients and ignores `retry-after`.

## apps-504

A portal receives contracts as PDFs, some scanned and with tables. Twenty questions are asked about the same file within an hour, and the team resends the base64 each time. It wants less traffic and lower input cost. What should it combine? (Choose 2)

- Extract the text with its own OCR, since the API cannot interpret scanned pages
- Place the question before the document, so that the model reads only the useful part
- Ask for shorter answers, which reduces the tokens charged for reading the PDF file
- Upload the PDF via the Files API and reference its `file_id` in a `document` block
- Use prompt caching on the prefix that contains the document, before the question

> The Files API avoids resending bytes but does not reduce input tokens: that is the cache's job. A varying question before the document would break the prefix. PDF support already reads scanned pages; answer length does not change input tokens.

## apps-505

A medical form uses structured outputs. In production, 0.4% of responses break the parser. Investigation shows two groups: truncated responses and refusals. Which handling is most correct?

- Raise `max_tokens` and repeat the call in both cases, up to a limit of three attempts
- Check `stop_reason` before parsing and give each of the two cases its own handling path
- Switch to a prompt that asks for JSON, since structured outputs did not keep its promise
- Wrap the parse in an exception block and save an empty form whenever the parsing fails

> Truncation and refusal are known exceptions with different answers: raise the limit or route elsewhere. An empty form silently loses data; raising the limit does not fix a refusal; JSON by prompt loses the schema and may still be cut or refused.

## apps-506

An HR assistant answers about internal policies. The claude.ai prototype pleased everyone, but the API version ignores the formal tone and sometimes talks about other companies. The team considers changing models. Which step comes first?

- Fine-tune on the prototype conversations, so as to recover the behavior that pleased everyone
- Add examples of the formal tone to the user message, keeping the current model and setup
- Write role, tone and limits in `system`, which in the prototype came from the product and the chat
- Move to the largest available model, because the API usually serves simpler versions by default

> The API starts without the product's instructions: recreate them in `system`. There is no lesser default version; fine-tuning is premature. The examples help with tone, but leave role and limits undefined.

## apps-507

A travel app builds an itinerary with five sequential calls and takes 25 seconds. Weather and exchange rates depend on nothing; hotels depend on weather; the final text depends on everything. Product wants it to feel fast without losing quality. What should you do?

- Replace all of the calls with a smaller and faster model, reviewing quality after the launch is done
- Merge the five steps into a single prompt, so that the model resolves the dependencies on its own
- Run weather and exchange in parallel and display the itinerary once the whole text is complete
- Run the independent parts in parallel and stream the final text to the user as it is being generated

> Parallelizing only what is independent cuts the critical path and streaming reduces perceived wait. A smaller unmeasured model and a single prompt risk quality; waiting for the complete text keeps the perceived wait.

## apps-508

A help desk keeps one conversation per customer for months. Each new ticket inherits old ones, and the model mixes products. Sometimes, however, history is needed to understand recurrence. Which design balances both?

- One session per ticket, with a customer summary and on-demand search of the previous tickets
- A single conversation with a larger window, as the complete history sometimes proves necessary
- One session per ticket, loading the full text of all the previous tickets at the beginning
- A single conversation told to ignore whatever is not about the product named in the ticket

> A clean session avoids contamination and search brings recurrence when it matters. A larger window adds noise; loading all of it repeats the mix; telling it to ignore does not remove content.

## apps-509

A bank asks for an assistant that "explains fees clearly". The workshop raises: respond within 4 seconds; link each answer to the official fee table; filter fees by account type; cut calls by 30%; never expose another holder's data. Which are non-functional requirements? (Choose 2)

- Link each answer to the official fee table
- Respond within 4 seconds
- Never expose another holder's data
- Cut phone calls by 30%
- Filter fees by account type

> Response time and isolation are system qualities. Cutting calls is a business goal; linking and filtering are functions of the system.

## apps-510

A director wants to launch within a month an assistant that approves refunds by itself. The team does not know what a wrongful approval costs and has no labeled historical cases. Which next step is most useful?

- Choose the model with the best public performance in finance and use the benchmarks as the criterion
- Set a 95% accuracy target with the director and collect test cases after the interface is ready
- Establish the cost of errors and label real cases to set acceptance criteria and the degree of autonomy
- Build the complete prototype on schedule, in order to discover in production which errors really appear

> Without error cost and cases there is no criterion for autonomy. A target set before knowing the cost is arbitrary; discovering in production shifts risk to customers; a public benchmark does not represent the case; declining ignores designs with human approval.

## apps-511

Production, staging and development use hand-copied prompts and the same model alias that changes on its own. After a quality drop, nobody knows whether the cause was prompt or model. Which practice would have isolated the cause?

- Restrict prompt editing to one person, who records the changes in a shared team spreadsheet
- Use the same alias in all environments, so that the model change shows up in all at once
- Save daily copies of the production responses, to compare the text before and after the drop
- Version the prompt with a pinned model ID and promote the same tested pair between environments

> An explicit, promoted combination allows comparing and reverting. A spreadsheet does not bind what ran; a common alias changes everything at once; copies show the effect, not the cause. A single owner does not version the model.

## apps-512

A medical record summarizer has been stable for a year. The provider announces the model's retirement in 90 days. The replacement is cheaper and does better on benchmarks. The team has 200 labeled cases. Which plan is most adequate?

- Run the 200 cases on the replacement, adjust the prompt if needed and migrate gradually with rollback
- Swap the ID in production now, since the replacement is superior on benchmarks and also costs less
- Run public benchmarks for the medical area and migrate all the traffic 30 days before the deadline
- Migrate all the traffic at once and run the 200 cases later, with the real answers already produced

> Your own eval is the gate and gradual migration limits damage. Benchmarks do not measure your task; waiting removes slack; evaluating later turns patients into the test.

## apps-513

A worker reads requests from a queue, calls Claude and sends an e-mail to the customer through a service that accepts idempotency keys. After a crash between sending the e-mail and acknowledging the queue message, some customers received two e-mails. Which change addresses the cause?

- Record the sending in a table after each e-mail and check that table before sending again
- Send with the request ID as an idempotency key, so that a repeated sending has no effect
- Acknowledge the message before calling Claude, so that it can never be processed again
- Increase the queue visibility timeout, giving the worker more time to finish each request

> At-least-once delivery calls for an idempotent effect. Acknowledging first loses requests in a crash; a longer timeout does not cover the crash; a table written after sending still fails if the crash comes between the two.

## apps-514

Claude will rewrite a billing module with few tests and many historical exceptions. The team has two weeks and a year of anonymized real data. Which sequence reduces risk the most?

- Create tests from the billing specification, rewrite it at once and compare with real data at the end
- Rewrite on a long-lived branch and, at the end, manually test the most common billing scenarios
- Create tests from the real data, change in small steps and compare the outputs at every step
- Ask for the full rewrite, generate tests over the new code and publish once all of them pass

> Pinning current behavior and moving in verifiable steps reveals regressions. Tests built over new code validate its own error; the specification and manual tests do not cover the exceptions, and comparing only at the end makes the cause hard to find.
