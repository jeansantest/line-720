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
