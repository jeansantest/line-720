# Questions

## model-501

A support app has 85% simple questions and 15% long diagnoses. Today everything goes to the largest model. A test with the smallest kept quality on the simple ones and dropped on the rest. Cost must fall by half. Which next step is best?

- Keep the largest model and cut `max_tokens` in half, which lowers the cost by the same proportion
- Test a router, also measuring its own errors and the cost per resolved question on each route
- Move everything to the smallest model, as it serves the majority and cuts more than required
- Route by message length, which costs nothing, and launch while monitoring the cost per call

> The mixed profile favors routing, provided the router is evaluated. The smallest hurts 15%; length does not indicate difficulty and cost per call does not show quality; cutting `max_tokens` truncates and leaves input untouched.

## model-502

A trading copilot uses Opus and needs faster on-screen answers. Current quality is required, cost is secondary and time to first token is already good: what takes long is the rest of the text. What should you test first?

- A smaller model at maximum effort, which tends to match quality with a much faster output
- The same model with a lower effort, asking in the prompt for equally careful answers
- Fast mode on the model, if it is supported, comparing its output speed and its cost
- Prompt caching of the history, which reduces input processing and shortens text generation

> The bottleneck is output speed, which fast mode targets. Caching acts on input; the smaller model's equivalence was not measured; a lower effort may reduce the required quality.

## model-503

Two models pass a task's eval. A: costs 1 per call and resolves 70% the first time; the rest goes to a human, at 20 per case. B: costs 4 per call and resolves 92%, with the same destination for the rest. Which is cheaper per case?

- A, since its call costs a quarter of B's and most cases never even reach the human
- Both are equivalent, since the price gap makes up for the gap in the resolution rate
- It cannot be known, since human cost must not enter a comparison between two models
- B, since it costs about 5.6 per case, against about 7 for A, adding the human part

> A: 1 + 0.30 × 20 = 7. B: 4 + 0.08 × 20 = 5.6. Compare cost per completed task, not per call. Human cost is part of solving the case.

## model-504

A tutor sends, on each turn: date and time, student name, 25 thousand tokens of course material and the conversation. Caching is on at the end of the material, but there are almost no reads. Students exchange messages every minute. Which change brings the most gain?

- Put the material first and leave date, time and name after the cache point
- Use the one-hour TTL, since the default expires between student messages
- Create a cache point at each paragraph of the material, to increase the hits
- Put the material in the first user message, keeping date, time and name in the system prompt

> Variable content at the start changes the prefix. Messages come every minute, so the default TTL is enough; breakpoints are limited; `system` comes before the messages, so the prefix would keep changing.

## model-505

A 60-turn agent costs more than planned. The report shows: 92% of tokens are input, with no cache reads; 40% of input is old search results; output is short. Which measures attack the largest cost? (Choose 2)

- Enable prompt caching, so that the repeated history is read at a lower cost
- Make tools return only what is needed, reducing what piles up in the history
- Reduce `max_tokens` per turn, since output is multiplied by all of the 60 turns
- Ask for briefer answers in the system prompt, to shorten the text of each turn
- Replace streaming with complete responses, which consume fewer tokens of input

> The cost is in repeated input. Short output is not the target, and streaming does not change tokens. Beware of pruning already sent history: it invalidates the cache from there on.

## model-506

An audit reporting system requires the same document to yield the same text on any date. The team thought of fixing generation parameters. The document rarely changes, and reports are consulted for years. Which design meets the requirement?

- Use prompt caching with a long TTL, so that the previous answer is returned without changes
- Store the prompt, the model version and the parameters, and regenerate the text on each query
- Generate once, store the text with the document version and always serve what was stored
- Fix the model and the generation parameters, which makes output identical on each new run

> Generation does not guarantee identical output; persisting the artifact does. The cache stores input processing, not the answer; storing the inputs does not guarantee the same output.

## model-507

When migrating to a current model, a team keeps adaptive thinking and gets empty answers for some hard requests, with `stop_reason: "max_tokens"` and the limit at 1,000. Easy questions work. What is the most likely explanation and adjustment?

- The model refused to answer; handle the case as a refusal and rephrase the original question
- The input context overflowed; reduce the history until the hard requests are able to fit in
- Adaptive thinking fails on hard cases; turn it off for every single request in the application
- Reasoning also consumes the output cap; raise `max_tokens` and calibrate the effort setting

> `max_tokens` limits everything generated, reasoning included. Refusal and context overflow would have another `stop_reason`; turning thinking off loses it exactly where it helps.

## model-508

An async Python service makes 500 calls with `gather` at once. It works in tests, but in production many 429s show up and memory rises. The deadline allows a few minutes. Which adjustment keeps throughput without that problem?

- Bound the concurrency with a semaphore tuned to the account limits and keep the backoff
- Replace `gather` with an `await` loop, which makes one call at a time and respects limits
- Keep the `gather` and raise the SDK's retries from 2 to 10 for the 429 errors
- Open one Python process per call, so that each one gets a request quota entirely of its own

> Bounded concurrency uses capacity without exceeding it. Serial loses throughput; more retries reduce neither the spike nor the memory; the quota belongs to the account, not the process.
