# Briefing
- Be clear and direct; explain the why behind constraints.
- Separate instructions from data, for example with XML tags.
- Long document first, question at the end.
- Context is a finite resource: prune, compact and isolate.
- Validate every output; valid JSON can still be wrong.

# Questions

## prompt-01
"Summarize this text well" produces inconsistent results. Which revision helps most?
- Define audience, length, required points and format
- Add "be an experienced writer and do an excellent job"
- Repeat the same instruction three times in a row
- Replace "summarize" with a rarer word
> Explicit criteria remove ambiguity.

## prompt-02
How do you delimit the user's document so it is not confused with instructions?
- Wrap it in descriptive XML tags
- Write it in capital letters
- Put it inside the system prompt
- Remove all of its punctuation
> Tags such as `<document>` separate data from instructions. They help, but alone do not prevent injection.

## prompt-03
With an 80-thousand-token document, where should you put the question to improve quality?
- At the end, after the document
- In the middle of the document
- In the name of the uploaded file
- Only before the document
> Long data at the top and the question at the end usually give better answers.

## prompt-04
The few-shot examples were all complaints, and the model started seeing complaints everywhere. How do you fix it?
- Diversify the examples and cover edge cases
- Add more examples of the same existing kind
- Remove the labels from each example
- Increase the response's `max_tokens`
> The model generalizes accidental patterns. Examples should be relevant and diverse.

## prompt-05
A long-running agent accumulates huge, old tool results. Which technique is most specific to this?
- Clearing old results with context editing
- Raising effort at each new step
- Repeating the system prompt at the start of each turn
- Asking for answers in another language
> Context editing removes old tool results. Compaction summarizes the history. They are different tools.

## prompt-06
Which statement describes *compaction*?
- It replaces old history with a summary in order to continue
- It removes only the old tool results from the history
- It removes only the tool definitions
- It saves the full conversation to a database
> It frees space while preserving the essentials, but details can be lost: keep critical facts outside.

## prompt-07
Which are signs of *context bloat*? (Choose 2)
- The agent repeats searches it has already done
- Cost rises and initial rules are ignored
- Cache hits grow every turn
- The response ends with `end_turn`
> Excess irrelevant content dilutes attention and makes each turn more expensive.

## prompt-08
The JSON follows the schema, but `total` does not match the sum of the items. What does this show?
- Business rules must be validated beyond the schema
- Structured outputs was configured incorrectly
- The schema should use only text fields
- The model ignored the `max_tokens` limit
> A schema guarantees form, not truth. Calculate or validate in code.

## prompt-09
Claude confidently cites a library function you do not know. What should you do?
- Check the documentation or run a test
- Ask the model to confirm its own answer
- Ask the model whether it is sure
- Accept it if the explanation is long
> Fluency and confidence are not evidence. Verify with an external source.

## prompt-10
Which instruction reduces made-up answers in a document Q&A?
- Use only the supplied material and say when there is no answer
- Always answer as completely as possible, without leaving any gaps
- Write with plenty of confidence and technical detail
- Prioritize general knowledge over the document
> Allowing "I don't know" and requiring grounding reduces hallucinations.

## prompt-11
You changed tone, examples and format at the same time, and the eval score dropped. What is wrong with the method?
- You cannot attribute the drop to one change
- The eval should have been turned off
- The prompt became too small for the model
- An eval score should never drop at all
> Iterate with small, measured changes.

## prompt-12
Which instruction tends to work best for avoiding lists?
- "Write in flowing paragraphs, since the text will be read aloud"
- "NEVER use lists under any circumstances"
- "Do not use bad formatting"
- "It is EXTREMELY important not to use lists or bullets in the answer"
> Say what to do and why: the model generalizes from the intent.

## prompt-13
The agent needs to consult 300 documents, but each question uses 3. Which approach is best?
- Retrieve only the relevant passages on demand
- Send all 300 documents with prompt caching enabled
- Summarize the 300 documents in one sentence
- Create 300 different system prompts
> Just-in-time retrieval keeps the context lean.

## prompt-14
A task does extraction, analysis and writing in a single prompt, and the analysis comes out weak. What should you try?
- Split it into chained steps with verifiable outputs
- Combine more tasks to provide more context
- Remove the analysis step from the prompt
- Ask it to think harder about all three tasks at once
> Prompt chaining gives each step focus and lets you validate in between.

## prompt-15
The instruction "every answer must cite the internal policy" applies to all of the app's conversations. Where should it go?
- In the system prompt
- In each user's first message
- In the description of some tool
- In the result of a tool
> The operator's stable rules go in system. This also helps caching.
