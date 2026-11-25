# Questions

## sec-501

An assistant reads web pages, accesses the user's mailbox and can fetch any URL. A page had hidden text that made it put e-mail excerpts in an external URL. The product must keep web reading. Which change reduces risk the most?

- Split web reading and e-mail between two subagents that exchange complete texts with each other
- Restrict network destinations and split web reading and e-mail access into isolated contexts
- Add to the system prompt the order to never follow instructions that are found on web pages
- Detect hidden text on pages with a classifier and block the ones that seem to be suspicious

> Breaking the combination of private data, untrusted content and outbound channel is structural. Prompt and classifier are probabilistic layers; subagents that exchange complete texts recreate the combination.

## sec-502

A tool `run_report(filter)` builds SQL from the model's text. A test showed access to another branch's data. The user is authenticated and their branch is known to the backend. Which fix is most robust?

- Instructing the model to always include the user's branch in the filter that it sends
- A parameterized query, with the branch supplied by the model as a required parameter
- A parameterized query, with the branch taken from the backend session, not the model
- Validating the model's text against a list of forbidden SQL words inside the tool

> Authorization is enforced in the backend with session identity. A word list can be bypassed; a parameter filled in by the model prevents injection but not access to another branch; instructions are probabilistic.

## sec-503

A finance agent executes payments. Today everything needs approval, and analysts approve 400 a day within seconds. A fraudulent payment got through. Most are recurring and low value. Which design is better?

- Double approval on all the payments, so that one analyst catches what the other one let through
- Automatic approval of all by a second model, freeing the analysts to work on their other tasks
- Keep approval on everything and require the analyst to wait a minute before clicking approve
- Limits in code for recurring ones and detailed approval only for high amounts or new or changed payee data

> Focus human attention where risk lies and enforce limits in code. Double approval and waiting increase fatigue; a model approving all removes human control from what is critical.

## sec-504

A store's public chat goes live in a week. The current defense is one sentence in the system prompt asking for safe answers. The team can only add two controls in time. The chat can look up orders. Which two reduce risk the most? (Choose 2)

- A system prompt five times as long, covering all the abuses the team can imagine
- Rate limiting per IP address, to slow down whoever tries to explore the chat
- Replacing the model with a larger one, which tends to better refuse abusive requests
- Backend authorization, limiting lookups to the orders of the authenticated customer
- Output checking and monitored logs, with a way to turn the chat off rapidly

> Access control prevents the main harm, and checking with monitoring and shutdown limits the rest. A longer prompt and larger model remain probabilistic; a limit per IP reduces volume, not access.

## sec-505

An API key ended up in a public log for two hours. The team deleted the log and changed the logging level. There is no sign of misuse so far. What is the most important next action?

- Rotate the key at the next scheduled window and restrict it meanwhile to the production IP addresses
- Revoke and replace the key, review usage in the period and keep secrets from reaching the logs
- Monitor consumption for one week and revoke the key only if some abnormal usage were to appear
- Lower the key's spend limit and keep it, given that the log was deleted before any harm was done

> An exposed secret is a compromised secret, even with no sign of use. Waiting or limiting leaves the key valid; renaming the variable does not change the secret. The scheduled window also leaves the key valid meanwhile.

## sec-506

A team uses a hook to block commands with `rm -rf`. An agent deleted a directory using a Python script. The team wants to protect `/data` from loss, whatever the path. Which measure is most effective?

- Add a `PreToolUse` hook that asks a model whether each command may affect the directory
- Move the hook to `PostToolUse`, which notices any change made in the directory and records it
- Run the agent in a sandbox or under a system user that is not able to write to `/data`
- Extend the hook with a longer list of commands and functions that erase files in several languages

> System permission holds for any path. Pattern lists always have gaps; a judging model may also be wrong; `PostToolUse` comes after the loss.
