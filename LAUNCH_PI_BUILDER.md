# 🚀 Launch Pi Builder Ralph Loop - mprocs TUI

## Quick Start

### Option 1: Node.js Launcher (Recommended for Windows)

```bash
# Start the interactive TUI launcher
node ralph-loop.js
```

**Features:**
- ✅ Cross-platform (Windows, Mac, Linux)
- ✅ Interactive menu system
- ✅ Project status at a glance
- ✅ Story management
- ✅ Progress tracking
- ✅ Git integration

---

### Option 2: PowerShell Launcher (Windows Only)

```powershell
# Run the PowerShell launcher
.\start-ralph-loop.ps1
```

**Features:**
- ✅ Windows-native colors
- ✅ Interactive menu
- ✅ Project status
- ✅ Paging for long documents

---

### Option 3: Bash Launcher (Mac/Linux)

```bash
# Run the bash script
./ralph-loop.sh
```

**Features:**
- ✅ Pure bash implementation
- ✅ Watch command for monitoring
- ✅ Document viewer

---

## mprocs Configurations

### mprocs-simple.yaml
**Use for:** Reading documentation

Runs:
- Main README
- Research Summary
- Quick Start
- Git Log
- Progress Log

```bash
mprocs -c mprocs-simple.yaml
```

---

### mprocs-dev.yaml
**Use for:** Development with monitoring

Runs:
- Documentation viewer
- Git monitor (live updates)
- PRD status
- Code editor
- File explorer

```bash
mprocs -c mprocs-dev.yaml
```

---

### mprocs.yaml
**Use for:** Full monitoring setup

Runs all processes with watches and live updates.

---

## Menu Options in ralph-loop.js

### 1️⃣ Documentation Viewer
Opens mprocs with all research documents side-by-side.

**Use when:** Reading research, understanding architecture

```bash
# Via launcher
> Choose: 1
> mprocs opens documentation

# Direct command
mprocs -c mprocs-simple.yaml
```

---

### 2️⃣ Development Mode
Opens mprocs with git monitoring, code editor, and file explorer.

**Use when:** Working on stories, tracking progress

```bash
# Via launcher
> Choose: 2
> mprocs opens dev environment

# Direct command
mprocs -c mprocs-dev.yaml
```

---

### 3️⃣ Ralph Loop Stories
Interactive story execution with PRD status and acceptance criteria.

**Use when:** Implementing stories, following Ralph Loop

```bash
> Choose: 3
> Shows next incomplete stories
> Select story 001
> View acceptance criteria
> Get implementation guide
```

---

### 4️⃣ Quick Start
Display Story 001 implementation guide.

**Use when:** Ready to implement your first story

```bash
> Choose: 4
> Shows START_HERE_PI_BUILDER.md
```

---

### 5️⃣ Project Status
Show progress bar and remaining stories.

**Use when:** Checking overall progress

```bash
> Choose: 5
> Shows:
>   - Progress bar
>   - Stories complete/total
>   - List of remaining stories
```

---

### 6️⃣ View Progress
Show last 30 lines of progress log.

**Use when:** Reviewing what was learned recently

```bash
> Choose: 6
> Shows PI_BUILDER_PROGRESS.txt (last 30 lines)
```

---

### 7️⃣ View Git Log
Show last 15 commits.

**Use when:** Tracking implementation progress

```bash
> Choose: 7
> Shows: git log --oneline -15
```

---

## Ralph Loop Workflow with mprocs

### Iteration Pattern

```
1. Run: node ralph-loop.js
2. Choose: 3 (Ralph Loop Stories)
3. Choose: Story 001 (first time)
4. View: Implementation guide
5. Open: Terminal
6. Execute: Story 001 commands
7. Update: PI_BUILDER_PRD.json (passes: true)
8. Append: PI_BUILDER_PROGRESS.txt (learnings)
9. Commit: git commit -m "Feat: [story-001]"
10. Exit: Close mprocs
11. Repeat: For Story 002 (fresh context)
```

---

## mprocs Keyboard Controls

In mprocs TUI:

```
h, j, k, l    - Navigate between windows
arrow keys    - Navigate between windows
p             - Move to previous window
n             - Move to next window
c             - Select channel (if multiple)
r             - Refresh window
q             - Quit mprocs
```

---

## File Structure

```
gh-repo/
├── ralph-loop.js              ← START HERE (interactive TUI)
├── start-ralph-loop.ps1       ← Windows PowerShell launcher
├── ralph-loop.sh              ← Bash launcher
├── mprocs-simple.yaml         ← Documentation viewer config
├── mprocs-dev.yaml            ← Development mode config
├── mprocs.yaml                ← Full monitoring config
│
├── LAUNCH_PI_BUILDER.md       ← This file
├── 00_README_PI_BUILDER.md    ← Main entry point
├── QUICK_REFERENCE.md         ← 2-min overview
├── RESEARCH_SUMMARY.md        ← 5-min summary
├── START_HERE_PI_BUILDER.md   ← Story 001 guide
│
├── PI_BUILDER_PRD.json        ← 24 stories (task list)
├── PI_BUILDER_PROMPT.md       ← Iteration template
├── PI_BUILDER_PROGRESS.txt    ← Learnings log
└── ... (10 research documents)
```

---

## Quick Commands

```bash
# Start interactive launcher
node ralph-loop.js

# Start documentation viewer
mprocs -c mprocs-simple.yaml

# Start development mode
mprocs -c mprocs-dev.yaml

# Check PRD status
node -e "const p=JSON.parse(require('fs').readFileSync('PI_BUILDER_PRD.json')); const c=p.stories.filter(s=>s.passes).length; console.log(c+'/'+p.stories.length+' complete')"

# View progress
tail -50 PI_BUILDER_PROGRESS.txt

# View git log
git log --oneline -10

# Show next story
node -e "const p=JSON.parse(require('fs').readFileSync('PI_BUILDER_PRD.json')); const s=p.stories.find(s=>!s.passes); console.log('['+s.id+'] '+s.title)"
```

---

## Troubleshooting

### mprocs not found

```bash
npm install -g mprocs
```

### Windows permissions error on .ps1

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git not found

```bash
# Install git or ensure it's in PATH
# Check: git --version
```

### Node.js colors not showing

TUI uses standard ANSI colors. If not working:
- Try: `node ralph-loop.js` (usually detects automatically)
- Set: `FORCE_COLOR=1 node ralph-loop.js`

---

## Next Steps

### Start Now

```bash
cd C:\Users\Artale\Projects\gh-repo
node ralph-loop.js
```

Then:
1. Choose option 1 (Documentation Viewer) - read for 15 minutes
2. Choose option 5 (Project Status) - see what's ahead
3. Choose option 3 (Ralph Loop) - implement Story 001

### After Story 001

1. Update PI_BUILDER_PRD.json (passes: true for story 001)
2. Append to PI_BUILDER_PROGRESS.txt (what you learned)
3. Commit: `git commit -m "Feat: [story-001]"`
4. Run ralph-loop.js again for Story 002 (fresh context)

---

## Pro Tips

### Use Multiple Terminals

Terminal 1: `node ralph-loop.js` (documentation)
Terminal 2: Your code editor / implementation

### mprocs Workflow

Keep mprocs open with:
- 1 window: Documentation
- 1 window: Git monitoring
- 1 window: Progress log

Then edit code in separate editor.

### Ralph Loop Discipline

- ✅ One story per iteration
- ✅ Fresh context (exit mprocs between stories)
- ✅ Update PRD + PROGRESS after each story
- ✅ Commit with story tag [story-XXX]

---

## Status

**Total Research:** 3,223 lines
**Stories:** 24 (0/24 complete, ready to start)
**Time to Production:** ~24-30 hours
**Next Action:** `node ralph-loop.js`

---

Ready to build? 🚀
