# Baseline GTM Wizards

Shared workspace for the Baseline Payments go-to-market team. Used for collaborative Claude Code/Co-work sessions, one-off projects (digital sales room, marketing initiatives), and shared plugins.

## Team

- Tyler — owner, Claude Code power user
- Marc, Matt, JS — team members

## What Lives Here

- Shared Claude skills and plugins for the GTM team
- One-off project work (website builders, marketing tools)
- Digital sales room prototypes
- Team collaboration on Claude Code/Co-work

## Conventions

- Follow the HTML design system from global CLAUDE.md for any generated output
- Use Firebase Hosting deploy for sharing HTML outputs with the team

## MANDATORY: Plugin Version Bump on Every Commit

**This is non-negotiable.** Every single commit to this repo MUST include a version bump in `.claude-plugin/plugin.json`.

- When the user says "commit", "push", "merge", or any variation — bump the version FIRST, then commit.
- Do NOT create a commit without bumping the version. No exceptions.
- Semver rules: PATCH for fixes/tweaks/copy/assets, MINOR for features/new skills/structural changes, MAJOR for breaking changes.
- If you forget, the user will have to ask you to fix it. Don't make them ask.
- The version file is: `.claude-plugin/plugin.json` → `"version"` field.
