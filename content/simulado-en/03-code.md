# Questions

## code-501

A monorepo has backend, mobile app and infrastructure. The root `CLAUDE.md` adds up to 700 lines, half about Terraform, and Claude began ignoring backend conventions. Everyone uses the same repository. Which reorganization is most adequate?

- Move everything to Skills, including the common rules, so that nothing loads before it is needed
- Keep what is common at the root and move the rest to rules with `paths` or per-area Skills
- Split the file into three and import all three of them with `@` in the root `CLAUDE.md` file
- Copy the content to each person's own `CLAUDE.md`, filtered according to their area of work

> Loading on demand cuts noise. Imports organize but still enter context; personal copies diverge; common rules must always be present.

## code-502

A CI job uses `claude -p` to comment on PRs of a public repository. It runs with a token that can write to the repository and with internet access. An outside PR changes `.claude/settings.json`. Which configuration reduces risk the most?

- The same environment, with the PR's configuration loaded and a list of allowed commands in the prompt
- A larger model, which is better at recognizing injection attempts hidden inside third-party source code
- An isolated environment, not loading the PR's configuration, with a minimal token and explicit permissions
- The same environment, but with a prompt instruction to ignore any changes made to files under `.claude`

> PR configuration and content are untrusted: isolate, use least privilege and skip project configuration. Prompts and larger models do not enforce; with `-p` nobody approves on screen. The PR's configuration may run hooks.

## code-503

The team wants to prevent reads of `secrets/`. A dev set `allow: Read` and `deny: Read(secrets/**)`, but noticed that a custom script run through Bash still reads the files. Which conclusion is correct?

- The broader allow rule cancelled the deny, so it is enough to swap their order in the file
- The deny pattern is relative, so an absolute path in the rule would also stop the custom script
- The deny rule must also be written in `CLAUDE.md` so that Bash starts to respect the rule
- The rule covers tool access; scripts run by the shell need their own control, such as a sandbox

> Per-tool rules do not guarantee the same data via another path; restrict at the system level. Changing the path, the order or the file where the rule lives does not change that: deny already beats allow, also covers subagents, and `CLAUDE.md` does not enforce.

## code-504

A task involves understanding 60 legacy files and then changing three. When everything is explored in the main conversation, the edit comes out poorly and the context fills up. The developer wants decisions to stay visible. What should be done?

- Delegate the exploration to a subagent that returns a short map and edit in the main conversation
- Explore in the main conversation and use `/clear` right before starting to change the three files
- Delegate both exploration and editing to the same subagent, asking it to report back when done
- Delegate the exploration to subagents that return the full content of the relevant files

> The subagent absorbs the volume and the main conversation keeps decisions. `/clear` erases what was learned; delegating all hides decisions; returning full files brings the noise back.

## code-505

A company has a 15-step release process, with scripts. Six repositories use it, it must start only on human request, and it changes monthly. Which packaging fits best?

- A `SessionStart` hook that injects the fifteen steps into every repository session
- A Skill in a shared plugin, with invocation by the model disabled
- A section in each repository's `CLAUDE.md`, reviewed by the team every month
- A Skill in a shared plugin, with a description asking for use only on human request

> A reusable, versioned procedure calls for a Skill in a plugin, and manual invocation is configurable. Copies diverge; a description guides but does not prevent invocation; the hook always takes up context.

## code-506

A `PreToolUse` hook should stop migrations on the production database. It detects the command, writes the reason to stderr and exits with code 1, but the migration runs. The team also wants Claude to know why. Which fix meets both needs?

- Exit with code 0 and write "blocked" to stdout, which Claude then treats as a denial
- Keep code 1 and add to `CLAUDE.md` the statement that production migrations are forbidden
- Exit with code 2, keeping the reason on stderr, in order to block and inform Claude
- Move the check to `PostToolUse`, which receives the result and can undo the migration

> Code 2 blocks and shows stderr; 1 is a non-blocking error by default. `PostToolUse` happens too late; free text with code 0 does not deny. `CLAUDE.md` guides but does not block.
