# Briefing
- `CLAUDE.md` = persistent context; `settings.json` = configuration enforced by the harness.
- Skill: procedure loaded on demand. Subagent: separate context. Hook: deterministic action. Plugin: distributable package.
- `claude -p` runs without an interface, useful in CI.
- `/clear` resets the conversation; `/compact` summarizes it.

# Questions

## code-01
Where should you put build commands and conventions that the whole team and Claude Code must know?
- In the project's `CLAUDE.md`, versioned in git
- In one developer's `~/.claude/CLAUDE.md`
- In a hook that blocks every edit
- In the history of a shared session
> The project file is shared. The one in the user directory applies only to that user.

## code-02
Which mechanism is enforced by the harness, not the model, to block commands like `rm -rf` in Claude Code?
- A deny permission rule or a `PreToolUse` hook
- An emphatic, detailed instruction in `CLAUDE.md`
- A request at the start of each session
- A Skill with shell best practices
> Permissions and hooks are enforced by the harness; instructions only guide the model. A deny rule for `rm` does not cover variants such as `bash -c`: for a strong guarantee, use a sandbox. The hook blocks with exit 2 or a deny decision; exit 1 does not block.

## code-03
The team wants to run Claude Code in a CI job, with no interaction. What should they use?
- `claude -p` with a structured output format
- `/compact` before each commit
- `/clear` in a loop in the terminal
- An interactive session kept open on the runner
> `-p` is headless mode. `--output-format json` or `stream-json` eases integration.

## code-04
A 200-line release procedure is only needed occasionally. Where should it live?
- In a Skill, loaded when it is relevant
- In the root `CLAUDE.md`, loaded in every session
- In a session start hook
- In a comment at the top of the code
> Skills use progressive disclosure: the description is always visible, the body only when needed.

## code-05
You finished a task and will start an unrelated one in the same session. Which command should you use?
- =
> `/clear` starts with a clean context. `/compact` is for continuing the same work with a summarized history.

## code-06
What does `/init` do in a repository?
- Analyzes the code and generates an initial `CLAUDE.md`
- Creates a git repository together with its main branch
- Installs all recommended plugins
- Deletes the project's old sessions
> It is the starting point. Review it and keep it lean.

## code-07
How do you distribute skills, commands, agents, hooks and MCP servers together across several repositories?
- Package everything in a plugin
- Copy everything into a single `CLAUDE.md`
- Save a session and share it
- Create a subagent for each repository
> Plugins group extensions into one versioned, installable unit.

## code-08
A developer wants a personal preference for this project, outside git. Which file should they use?
- =
> `settings.local.json` is personal to the project; `settings.json` is shared; the home one applies to all projects.

## code-09
Which situations call for a **subagent** in Claude Code? (Choose 2)
- Exploring many files without polluting the main conversation
- Reviewing with restricted tools and its own instructions
- Always formatting the file after each edit
- Storing the database credential
> Subagents isolate context and permissions. Always formatting is a job for a hook; secrets do not go in agents.

## code-10
`CLAUDE.md` has reached 900 lines and rules are being ignored. What is the best action?
- Trim it and move details to scoped rules and Skills
- Duplicate the most important rules at the end
- Split it into `@` imports, all loaded at startup
- Copy the file into every subdirectory
> Permanent context competes for attention. Keep only what almost always applies.

## code-11
A `PreToolUse` hook must **stop** a command. Which exit code blocks it and returns the reason to Claude?
- Any code that is different from zero
- Code 2, with the reason on stderr
- Code 1, with the reason on stdout
- Code 0, with the reason on stderr
> On blockable events, code 2 prevents the action and shows stderr. Code 1 is by default a non-blocking error: the action goes ahead.

## code-12
A team put a hook on `PostToolUse` that "prevents" editing `prod.yml`, but the file keeps changing. Why?
- The event fires after the tool already ran
- The hook must be written in JavaScript
- Hooks cannot see the names of the files
- The event only fires for shell commands
> `PostToolUse` is for reacting (format, test). To prevent, use `PreToolUse` or a deny rule.

## code-13
Permissions contain `allow: Bash(git push *)` and `deny: Bash(git *)`. What happens with `git push origin main`?
- It is allowed, since the rule is more specific
- It asks for approval, since the rules conflict
- It is allowed, since allow was listed before
- It is denied, since deny is evaluated first
> The order is deny, ask, allow. Specificity does not change it.

## code-14
The company needs a Claude Code policy that no developer can override. Where should it be defined?
- In `~/.claude/settings.json`
- In the root `CLAUDE.md`
- In managed settings
- In `.claude/settings.json`
> Managed settings have the highest precedence. `CLAUDE.md` is context, not enforcement.

## code-15
SQL rules matter only when editing `db/**`. How do you keep them out of context in other tasks?
- Putting them at the top of each user `CLAUDE.md`
- A rule in `.claude/rules` with `paths` frontmatter
- An `@import` of these rules in the root `CLAUDE.md`
- Repeating them in each commit message of the team
> Rules with `paths` load when matching files come into play. `@import` organizes but does not save context.

## code-16
After `/compact`, Claude Code forgot a convention. What is the most likely cause?
- It was said only in chat, not in `CLAUDE.md`
- The root `CLAUDE.md` is erased by compaction
- The `/compact` command disables permissions
- The command changes the model of the session
> The root `CLAUDE.md` is re-read after compaction; chat-only instructions may be lost in the summary.

## code-17
Before a risky change, you want Claude to explore the code and propose a path **without editing**. What should you use?
- acceptEdits mode
- `claude --continue`
- A `Stop` hook
- Plan mode
> In plan mode Claude reads and investigates, then presents a plan for approval.

## code-18
A script needs to read the `claude -p` response as a single object with session metadata. Which option should it use?
- `--output-format stream-json`
- `--allowedTools json`
- `--output-format json`
- `--output-format text`
> `json` returns one object; `stream-json` emits events as they happen.

## code-19
A team uses `--allowedTools "Read"` believing it **forbids** everything else. What is the actual effect?
- It applies only to interactive terminal sessions
- It pre-approves Read; the rest follows permissions
- It removes all the other tools from the model
- It blocks any reading outside the current project
> The option is an auto-approve list. To forbid, use deny or remove the tool.

## code-20
The whole team should use the same MCP server in this repository. Where should it be configured?
- In the root `.mcp.json`, versioned
- In each person's `~/.claude.json`
- In a Skill with the server URL
- In `CLAUDE.md`, as an instruction
> Project scope lives in `.mcp.json` and goes in git. Local and user are personal.

## code-21
The `.mcp.json` needs a different token per person, kept out of git. What is the proper way?
- Write the token and mention it in the README
- Encode the token as base64 inside the file
- Have Claude ask for the token in the chat
- Reference a variable such as `${CRM_TOKEN}`
> Environment variables are expanded in the configuration; the secret stays out of the repository.

## code-22
A deploy Skill must **never** be triggered on the model's initiative, only by `/deploy`. What should you configure?
- An empty description in the file
- Moving the Skill to `CLAUDE.md`
- `disable-model-invocation: true`
- `allowed-tools: none`
> The field prevents automatic invocation and keeps the manual command.

## code-23
A reviewer subagent must not change files. Which configuration best guarantees that?
- Choosing a smaller model for the subagent
- A `tools` field with read-only tools
- Asking in its prompt not to edit files
- Giving it the same context as the parent
> The tool list is enforced by the harness; a prompt is only guidance. Note that Bash can also write.

## code-24
Why do checkpoints and `/rewind` not replace git?
- They miss things, like files changed only via Bash
- They erase the commit history on each restore
- They work only on files that are smaller than 1 MB
- They require a separate branch for every prompt
> Checkpoints track file-tool edits. Bash-only or external changes may be left out.

## code-25
A CI job runs `claude -p` on PRs from **strangers**. Which risk should you consider first?
- The `-p` mode always ignores project configuration
- The PR stays private until the job run is finished
- The `-p` mode cannot read files in the repository
- The repository may bring hooks and MCP servers
> Without isolation, project configuration applies with no trust dialog. Restrict secrets and permissions; `--bare` skips hooks, MCP and `CLAUDE.md`.
