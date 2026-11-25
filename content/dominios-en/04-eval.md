# Briefing
- Define measurable success before touching the prompt.
- Prefer code graders; use LLM-as-judge for the subjective and calibrate it against humans.
- Read traces to separate integration failures from model failures.
- Every production bug becomes a regression case.

# Questions

## eval-01
What is a *golden set* in evals?
- Representative cases with reliable expected results
- The longest answers the model has ever generated
- The prompts that consume the fewest input tokens
- A large production sample without any reference answers
> It is the reference for comparing versions. It should include typical and edge cases.

## eval-02
To measure whether a classification returned one of five correct labels, which grader should you choose?
- Exact comparison in code
- LLM-as-judge with a score from 1 to 10
- Human review of every case
- Token count of the response
> If code can decide, use code: fast, cheap and deterministic.

## eval-03
How do you know whether an LLM-as-judge is reliable before using it at scale?
- Measure its agreement with human ratings
- Ask the judge to rate its own confidence
- Check whether the average scores are high
- Use the same prompt as the evaluated model
> Calibrate with a human-labeled sample; adjust the rubric where they diverge.

## eval-04
A prompt change fixed a reported case. What should you do before deploying?
- Run the full regression suite
- Test only the fixed case again
- Deploy and wait for complaints
- Raise effort just in case
> Targeted fixes can break other cases.

## eval-05
The trace shows `tool_use` with correct arguments, but the `tool_result` brings the wrong customer's data. Where is the problem?
- In the tool implementation or the integration
- In the choice of arguments made by the model
- In the response token limit
- In the generation temperature
> The model asked correctly; the integration layer returned the wrong thing. The trace locates the source.

## eval-06
The trace shows that the model calls `search_docs` when it should call `search_orders`. What should you review first?
- The names and descriptions of both tools
- The timeout of the orders database
- The HTTP client's retry policy
- The permissions of the API key used
> Wrong tool selection usually comes from vague or overlapping descriptions.

## eval-07
Put a healthy process for handling a production failure in order.
1. Collect the trace and reproduce the failure
2. Isolate the cause between integration and model
3. Add the case to the eval suite
4. Apply a specific change
5. Run the regression and only then release
> Recording the case before fixing it proves that the test fails and then passes.

## eval-08
An eval passed once, but the app occasionally fails with the same input. What was missing?
- Running several trials per case and measuring the rate
- Using a different prompt for each one of the tested cases
- Removing the cases that vary a lot
- Reducing the suite to a single case
> Outputs are not deterministic. A single trial hides the real failure rate.

## eval-09
Which practices keep you from fooling yourself with an eval? (Choose 2)
- Keeping a test set separate from the one used for tuning
- Including edge cases and adversarial inputs
- Tuning the prompt by looking at the final test answers
- Keeping only examples the model already gets right
> Tuning on the test set causes overfitting; easy cases alone hide regressions.

## eval-10
Which record is most useful for debugging an agent in production?
- A trace with messages, tools, results, `stop_reason` and usage
- The final answer sent to the user, with delivery date and time
- Only the monthly total of tokens consumed
- Only the HTTP status of each request
> Agent failures arise mid-trajectory. Record it, with personal data protected.

## eval-11
The API returns 529 during a peak. Which recovery strategy is most appropriate?
- Backoff with jitter, a retry limit and a planned fallback
- Fixing the JSON Schema and immediately resending the request
- A new API key for each attempt made
- Shrinking the system prompt until the error goes away
> 529 indicates temporary overload: it is not a defect in the request.

## eval-12
A RAG Q&A gets the return deadline wrong. The trace shows the right passage was **not** among those retrieved. Where should you act?
- On the model, moving to a more capable one
- On the prompt, asking for more precise answers
- On retrieval: chunking, index or query
- On the interface, with a possible-error notice
> The model cannot use what it did not receive. Had the right passage been there, you would look at the prompt or model.

## eval-13
A RAG has retrieval and generation. How do you measure to know **which of the two** got worse?
- Evaluate each stage with its own metrics
- Use only the final score given by the users
- Count the average tokens of each response
- Run the same case until the answer is right
> Per-stage metrics (did the right passage come? is the answer faithful to it?) locate the regression.

## eval-14
What is the first step when building evals for a new app?
- Generate a thousand synthetic cases
- Compare the prices of three models
- Define success in measurable terms
- Choose the tool that will run the tests
> Without a success criterion, no eval number helps you decide.

## eval-15
Where do the **most valuable** eval cases come from for an app already in production?
- From public benchmarks of general use
- From real failures and requests, anonymized
- From the examples inside the system prompt
- From questions the model always gets right
> Real cases reflect the usage distribution. Prompt examples contaminate the measure.

## eval-16
An LLM-as-judge gives higher scores to **longer** answers. What is the fix?
- A per-criterion rubric calibrated with humans
- Using the same judge with more output tokens
- Shortening all the answers before judging
- Adding the judge score to the text length
> Verbosity bias is common. Specific criteria and calibration expose and reduce it.

## eval-17
When comparing two answers, the judge almost always prefers the **first**. How do you reduce the bias?
- Show only the first of the answers
- Ask it politely to be impartial
- Increase the number of criteria
- Judge in both orders and compare
> Swapping the order reveals position bias; inconsistencies become ties or reviews.

## eval-18
An agent eval compares the exact tool sequence with a key and fails valid solutions. What should change?
- Accept any run that finishes without errors
- Remove tools until only one path remains
- Grade the final outcome and violated limits
- Teach the agent the exact sequence in the key
> There are several valid paths. Grade the end state and the rules that must not be broken.

## eval-19
The eval has 12 cases; version B got 10 right and A got 9. What can you conclude?
- Both are identical in their real quality
- Little: the difference may be just noise
- B is better and can go to production now
- A is better, since it failed hard cases
> A small sample and a single trial cannot separate improvement from noise.

## eval-20
A fraud detector: 99% of cases are legitimate and the model scores 99% by always saying "legitimate". Which metric exposes this?
- Recall of the fraud class
- Accuracy over all cases
- Average latency per case
- Tokens in each response
> With imbalanced classes accuracy misleads. Look at precision and recall of the rare class.

## eval-21
Which graders are **deterministic**? (Choose 2)
- Running unit tests on generated code
- An LLM rating the answer tone
- A human reviewer giving a score
- Validating JSON against the schema
> Prefer code when the criterion allows; use an LLM or a human for subjective aspects.

## eval-22
The eval score went up, but so did complaints. Which hypothesis should you investigate first?
- The model changed because of the time of day
- The eval needs a higher target for its score
- The eval cases do not represent real usage
- The users are using the app the wrong way
> An eval is only useful if its distribution and grader reflect what matters to users.

## eval-23
An A/B test in production complements offline evals because:
- It guarantees there will be no regressions
- It measures effect on real users and goals
- It removes the need for success criteria
- It is cheaper than any offline evaluation
> Offline is fast and safe; A/B confirms real impact.

## eval-24
During a stream that already started with HTTP 200, the server fails. How does the error arrive?
- As an error event inside the stream
- As a new HTTP 500 status in the header
- As an empty response with `end_turn`
- As a `tool_result` flagged with error
> The status was already sent. The client must handle error events and interruptions.

## eval-25
When opening a support ticket about a problematic API response, which piece of data helps most?
- The API key used in the call
- The price of the model in use
- The time the app was opened
- The `request-id` of the response
> The ID identifies the request. Never send the API key.

## eval-26
A response ends with `stop_reason: "pause_turn"` in a request with server tools. What should you do?
- Send an empty `tool_result` on the tool's behalf
- Change the model and start over from scratch
- Resend with the response appended to continue
- Treat it as fatal and discard the conversation
> The server loop paused. Append the assistant content unchanged and repeat with the same tools.

## eval-27
413 responses appear only for customers with large attachments. What does this indicate?
- The requested model is not in the account
- The request exceeded the size limit
- The requests-per-minute limit was hit
- The API key has no attachment permission
> 413 is `request_too_large`. Reduce, split or use the Files API.

## eval-28
The model calls the right tool with day and month swapped. The trace shows the description "order date". What should you fix?
- Specify the format and give an example
- Swap the day and month in the tool code
- Remove the date parameter from the tool
- Ask for more care in the system prompt
> An ambiguous argument is a tool contract problem: describe the format and validate.

## eval-29
A bug appears in 1 of every 20 runs. How do you assess whether the fix worked?
- Run once and see that the error is gone
- Ask the model to confirm that it is fixed
- Wait for one week without any complaints
- Run many times before and after and compare
> Intermittent failure calls for a rate, not an anecdote.

## eval-30
To isolate an error in a 5-call pipeline, what is the most efficient method?
- Change the model in all of the five steps
- Merge the five steps into a single call
- Inspect the input and output of each step
- Rewrite all the five prompts at the same time
> Find the first step whose output is wrong given correct input; fix it there.
