# Questions

## eval-501

A hospital urgency classifier is 96% accurate. Nearly all errors are severe cases marked as mild. Management wants to launch, since the target was 95%. Which recommendation is most solid?

- Postpone and require 98% of overall accuracy, which leaves less room for errors of any kind
- Postpone and set a separate target for severe cases, as overall accuracy hides the error that matters
- Launch with monitoring, as the agreed target has been met and changing it now would be unfair
- Postpone and expand the dataset with mild cases, so that the overall accuracy becomes more stable

> Error costs are asymmetric: measure recall of the severe class. Meeting a poorly defined target does not reduce risk; more mild cases inflate the number; 98% overall may still hide the same errors.

## eval-502

An LLM-as-judge rates support answers with a single 1-to-5 score. In 60 human-checked cases, agreement is low and scores cluster at 4. The team wants to keep automation. Which step is better?

- Average five executions of the very same judge, which eliminates the disagreement observed
- Widen the scale to 1 to 10 with a description per level, and keep the single score for each answer
- Replace the single score with objective yes-or-no criteria and measure agreement once again
- Use a larger model as judge and accept the scores, which already follow a well-known scale

> Specific criteria reduce subjectivity and agreement tells whether the judge is fit. A larger unmeasured model is a bet; averaging reduces variance, not bias; changing human labels inverts the reference. A wider scale keeps several criteria mixed in one score.

## eval-503

A team tuned the prompt for weeks against the same 80 cases and reached 98%. In production, the observed rate is 81%. The cases were chosen at the project's start. Which actions address the most likely causes? (Choose 2)

- Increase the number of examples in the prompt, using the 80 cases as source
- Keep a separate set, one that is not used while the prompt is being adjusted
- Renew the cases with recent samples that are representative of production
- Repeat each of the 80 cases ten times, so as to make the 98% more reliable
- Replace the grader with a stricter one, until the score falls close to 81%

> There is overfitting and a stale sample. Repeating the same cases confirms the mistake; calibrating the score down does not fix it; using the cases in the prompt contaminates further.

## eval-504

A prompt change fixes 12 customer-reported cases and breaks 5 that worked. The eval average goes from 88% to 90%. Among the five, two concern cancellation, a flow with legal requirements. What should you decide?

- Do not ship it as is: first fix the critical regressions, which the average does not show
- Ship it, since the balance is positive and regressions can be handled in the next version
- Ship it to half of the customers, since that way only half will see the five regressions
- Ship it with monitoring on the cancellation flow and roll back if complaints show up in the first week

> Cases with legal requirements are blocking, whatever the average. The balance ignores severity; shipping to half or waiting for complaints still violates; discarding everything loses 12 usable fixes.

## eval-505

A stock agent gives wrong answers in 7% of cases. Traces show: right tool, right arguments, `tool_result` with the right quantity, and a final answer with another number, always when the result has 300 rows. Where should you act first?

- On the database, checking whether the stored quantity matches what is in the warehouse
- On the result format, returning only the rows and the fields needed for the question
- On the tool description, making clearer in which situations it should or should not be called
- On argument validation, to prevent the model from querying the wrong product in the stock

> The failure is in reading a huge result; reduce noise. Selection, arguments and source data were already ruled out by the trace.

## eval-506

After a deploy, the assistant's latency doubled. The prompt did not change, the model is the same, and `cache_read_input_tokens` fell close to zero. The deploy began sorting the tool list by usage frequency, recalculated on every request. What is the most likely cause?

- The recalculation on each request consumes the rate limit that was previously used by the assistant
- The tools cache expires in one hour, and sorting only exposed a limit that was already present
- The varying tool order changes the start of the prefix and invalidates the cache for most calls
- The new order makes the model pick wrong tools, causing more turns before it reaches an answer

> Tools come first in the prefix: changing order invalidates what follows. Wrong choices would not zero the reads; recalculating does not call the API; nothing points to expiry.

## eval-507

A pipeline has four calls: extract, normalize, classify, write. The final output gets the deadline wrong in 10% of cases. Only the input and final output are logged. The team wants to change the model of the last step. What should come first?

- Change the model of the last step, since that is where the wrong deadline shows up for the user
- Log the final output of a hundred more failing cases and look for a pattern in the deadlines
- Merge the four steps into one, removing the points at which the deadline could have been altered
- Log the output of each step in the failing cases and find the first one where the deadline changes

> Without observing steps, any change is a guess. Where the error appears is not where it starts; more final outputs do not show the step; merging reduces visibility.
