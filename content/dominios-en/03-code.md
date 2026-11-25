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
