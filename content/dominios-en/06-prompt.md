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

## prompt-16
Which instruction best equips the model for unforeseen cases?
- "Avoid jargon, since readers are lay patients"
- "Never use jargon under any case, FORBIDDEN"
- "Always write in the best way that you can"
- "Follow whichever style is most suitable"
> Explaining why lets it generalize. Emphasis without reason does not.

## prompt-17
An old prompt has 14 rules in capitals with "CRITICAL". On the new model it over-applies them. What should you do?
- Add one more warning in capital letters
- Repeat the 14 rules at the prompt's end
- Go back to the old model for good
- Rewrite in a normal tone and measure
> Recent models follow instructions more closely; old emphasis can overshoot.

## prompt-18
Two prompt rules contradict each other: "be brief" and "explain everything in detail". What is the fix?
- Put the more important one in bold
- Repeat both of the rules at the end
- State when each of them applies
- Always let the model choose between them
> Resolve conflicts with an explicit condition or priority.

## prompt-19
How do you ask an analysis to separate document **facts** from **inferences**?
- Send the document twice in the prompt
- Define distinct sections and what goes in each
- Ask the model to please be very careful
- Ask for an answer of at most 100 words
> Explicit structure makes the separation verifiable.

## prompt-20
A role prompt ("you are a tax auditor") mainly helps to:
- Adjust focus, vocabulary and perspective
- Give the model data it does not know
- Guarantee the calculations are correct
- Prevent every prompt injection attempt
> A role guides the approach; it adds neither facts nor guarantees.

## prompt-21
In the few-shot examples all answers have 3 items, and the model always gives 3, even when there are 7. Why?
- It has an internal limit of three items
- It fully ignored the examples it got
- It needs a much higher `max_tokens`
- It imitated an accidental pattern
> Vary whatever should not be copied.

## prompt-22
To extract data from e-mails, which examples are worth most in the prompt? (Choose 2)
- The same e-mail repeated three times
- An e-mail identical to the easiest case
- An e-mail without the sought data
- An e-mail with two conflicting values
> Edge cases teach the decision; repetition adds nothing.

## prompt-23
The model makes up a tax ID when the invoice lacks one. Which adjustment is better?
- A free-text field, without any rule at all
- A nullable field and a rule for using it
- A required field and a warning not to invent
- A removed field, inferring it from the name
> A mandatory value pressures the model to invent. Offer a legitimate way out.

## prompt-24
A single request "read, critique and rewrite" comes out shallow. Which chain is most useful?
- Critique first; rewrite using that critique
- Rewrite first; critique the original text
- Three equal rewrites, choosing the longest
- One single call with the instruction repeated
> An explicit critique step feeds the revision and can be inspected.

## prompt-25
Why test a prompt with **adversarial** and empty inputs?
- To reduce the tokens of each request
- To teach the model to avoid such cases
- To meet the minimum cases for caching
- To know its behavior outside the ideal
> Production brings bad inputs; the prompt must say what to do with them.

## prompt-26
Which principle guides what goes into context?
- The whole history, so no data is ever lost
- Only the last message sent by the user
- The fewest high-signal tokens for the task
- As much information as fits in the window
> Context is a finite resource; noise competes with what matters.

## prompt-27
Instead of loading 200 files, the agent gets a list of paths and reads the ones it needs. What is this approach called?
- Prefilling the assistant response
- On-demand (just-in-time) retrieval
- Compaction of the conversation history
- Few-shot with dynamic examples
> Lightweight references and reading tools keep context lean.

## prompt-28
After compaction, an agent lost the reason for a decision and redid it. How do you reduce that risk?
- Write decisions to notes outside context
- Disable compaction once and for all
- Compact more frequently than before
- Ask the agent to have a good memory
> Summaries lose detail; what is critical should be persisted.

## prompt-29
A RAG returns the right passages, but cut in the middle of tables. What should you adjust?
- The tone of the app system prompt
- The maximum number of output tokens
- The name given to the search index
- The chunking, respecting structure
> Splitting by structure and adding context to the chunk preserves meaning.

## prompt-30
Semantic search fails on exact codes such as `ERR-4471`. What should you add?
- An answer model with higher effort
- A larger passage in each result
- Keyword search, in a hybrid setup
- More documents about other topics
> Embeddings capture meaning; exact terms call for lexical search. Combine and rerank.

## prompt-31
A retrieved document is from 2019 and contradicts another from 2025. How do you help the model?
- Merge both texts into a single paragraph
- Include date, source and a priority rule
- Shuffle both of them to avoid preference
- Send only the document that is longer
> Metadata and an explicit rule allow resolving and reporting the conflict.

## prompt-32
The model classifies tickets into 4 labels, but some do not fit and get a **wrong** label. What should change in the output?
- An "other" label, with a rule for using it
- A fifth label drawn from the existing ones
- The list of labels in alphabetical order
- A free-text answer without any label
> If no legitimate option fits, the model picks the least bad one. Give a defined way out and track how often it is used.

## prompt-33
JSON validation failed on a business rule. Which repair flow is reasonable?
- Repeat the same request until the rule is met
- Accept the JSON and fix the data overnight
- Discard the request without recording it
- Return the error to the model, with a retry cap
> A specific message helps fix it; the cap prevents loops, then comes the fallback.

## prompt-34
An app takes the command suggested by the model and runs it. What is missing between output and action?
- A log entry for the command, after execution
- A prompt rule asking for safe commands
- Validation against a list of allowed actions
- A second opinion from the same model
> Model output is untrusted input to the next system.

## prompt-35
How do you reduce the chance of the answer being **cut off** in long reports? (Choose 2)
- Turn on response streaming
- Set a suitable `max_tokens`
- Generate by sections
- Cut the examples in the prompt
> And always check `stop_reason` to detect the cut.
