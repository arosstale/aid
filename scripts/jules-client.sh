#!/bin/bash
# Jules API Client for OpenClaw Contributions
# API: https://developers.google.com/jules/api/reference/rest
# 
# Jules API v1alpha — Google's AI coding agent
# Base: https://jules.googleapis.com/v1alpha
# Auth: X-Goog-Api-Key header
#
# Resources:
#   sessions        — A unit of work (read issue → plan → code → PR)
#   sessions.activities — Individual steps within a session
#   sources         — Connected GitHub repos
#
# Session States:
#   QUEUED → PLANNING → AWAITING_PLAN_APPROVAL → IN_PROGRESS → COMPLETED
#                                              → FAILED
#
# AutomationMode:
#   AUTOMATION_MODE_UNSPECIFIED — No auto PR
#   AUTO_CREATE_PR — Auto-create branch + PR when code patch is ready
#
# SETUP:
#   1. Install Jules GitHub App on arosstale/openclaw (https://jules.google.com)
#   2. export JULES_API_KEY=your-key
#   3. chmod +x jules-client.sh && ./jules-client.sh sources

set -euo pipefail

BASE="https://jules.googleapis.com/v1alpha"
REPO_SOURCE="sources/github/arosstale/openclaw"

die() { echo "ERROR: $*" >&2; exit 1; }

[ -n "${JULES_API_KEY:-}" ] || die "JULES_API_KEY not set. Get one at https://jules.google.com → Settings → API Keys"

api() {
    local method="$1" path="$2"
    shift 2
    curl -sf "$BASE/$path" \
        -X "$method" \
        -H "X-Goog-Api-Key: $JULES_API_KEY" \
        -H "Content-Type: application/json" \
        "$@"
}

# ─── Sources ───

cmd_sources() {
    echo "Connected repositories:"
    api GET "sources" | python3 -c "
import json,sys
data = json.load(sys.stdin)
for s in data.get('sources', []):
    print(f\"  {s['id']}  →  {s['name']}\")
if not data.get('sources'):
    print('  (none — install Jules GitHub App first)')
"
}

# ─── Sessions ───

cmd_sessions() {
    local n="${1:-10}"
    api GET "sessions?pageSize=$n" | python3 -c "
import json,sys
data = json.load(sys.stdin)
for s in data.get('sessions', []):
    state = s.get('state','?')
    sid = s.get('id','?')
    title = s.get('title','untitled')[:60]
    pr = ''
    for o in s.get('outputs', []):
        if 'pullRequest' in o:
            pr = ' → ' + o['pullRequest'].get('url','')
    print(f\"  [{state:25s}] {sid}  {title}{pr}\")
"
}

cmd_session() {
    [ -n "${1:-}" ] || die "Usage: $0 session <session_id>"
    api GET "sessions/$1" | python3 -m json.tool
}

# ─── Create Fix Session ───

cmd_fix() {
    local issue="${1:-}" desc="${2:-}"
    [ -n "$issue" ] || die "Usage: $0 fix <issue_number> [description]"
    
    if [ -z "$desc" ]; then
        # Fetch issue title from GitHub
        desc=$(cd /tmp/openclaw-fork 2>/dev/null && gh issue view "$issue" -R openclaw/openclaw --json title --jq '.title' 2>/dev/null || echo "Fix issue #$issue")
    fi

    echo "Creating Jules session for issue #$issue..."
    echo "  Description: $desc"
    echo "  Mode: requirePlanApproval (review before coding)"
    echo ""

    local prompt="Fix GitHub issue openclaw/openclaw#$issue: $desc

RULES:
- Read the issue carefully. Check for existing PRs first.
- Keep the fix minimal — ideally under 20 lines changed.
- Match existing code style. Use the project's formatter (oxfmt).
- Add a test if the fix touches runtime logic.
- Do NOT modify unrelated files.
- The branch name should be: fix/$issue-<short-slug>

After coding, run these checks:
  pnpm lint
  pnpm check  
  pnpm build
  pnpm test

Do not create a PR yet. I will review the changes first."

    api POST "sessions" \
        -d "$(python3 -c "
import json,sys
print(json.dumps({
    'prompt': sys.stdin.read(),
    'sourceContext': {
        'source': '$REPO_SOURCE',
        'githubRepoContext': {'startingBranch': 'main'}
    },
    'requirePlanApproval': True
}))" <<< "$prompt")" | python3 -c "
import json,sys
s = json.load(sys.stdin)
print(f\"Session created!\")
print(f\"  ID:    {s.get('id','?')}\")
print(f\"  State: {s.get('state','?')}\")
print(f\"  URL:   {s.get('url','?')}\")
print(f\"\")
print(f\"Next: Review the plan at the URL above, then:\")
print(f\"  $0 approve {s.get('id','SESSION_ID')}\")
"
}

cmd_fix_auto() {
    local issue="${1:-}" desc="${2:-}"
    [ -n "$issue" ] || die "Usage: $0 fix-auto <issue_number> [description]"
    
    if [ -z "$desc" ]; then
        desc=$(cd /tmp/openclaw-fork 2>/dev/null && gh issue view "$issue" -R openclaw/openclaw --json title --jq '.title' 2>/dev/null || echo "Fix issue #$issue")
    fi

    echo "Creating Jules session for issue #$issue (AUTO-PR mode)..."

    local prompt="Fix GitHub issue openclaw/openclaw#$issue: $desc

RULES:
- Minimal fix, under 20 lines.
- Match existing code style. 
- Include 'lobster-biscuit' in the PR description.
- PR title: fix(scope): short description
- PR description template:
  #### Summary
  #### Root Cause
  #### Behavior Changes
  #### Tests
  **Sign-Off**
  - Models used: Jules (Gemini)
  - Submitter effort: AI-generated, human-reviewed

Run: pnpm lint && pnpm check && pnpm build && pnpm test"

    api POST "sessions" \
        -d "$(python3 -c "
import json,sys
print(json.dumps({
    'prompt': sys.stdin.read(),
    'sourceContext': {
        'source': '$REPO_SOURCE',
        'githubRepoContext': {'startingBranch': 'main'}
    },
    'automationMode': 'AUTO_CREATE_PR'
}))" <<< "$prompt")" | python3 -c "
import json,sys
s = json.load(sys.stdin)
print(f\"Session created (auto-PR)!\")
print(f\"  ID:    {s.get('id','?')}\")
print(f\"  State: {s.get('state','?')}\")
print(f\"  URL:   {s.get('url','?')}\")
"
}

# ─── Session Actions ───

cmd_approve() {
    [ -n "${1:-}" ] || die "Usage: $0 approve <session_id>"
    echo "Approving plan for session $1..."
    api POST "sessions/$1:approvePlan" | python3 -c "
import json,sys
print('Plan approved. Session will begin coding.')
"
}

cmd_message() {
    [ -n "${1:-}" ] && [ -n "${2:-}" ] || die "Usage: $0 message <session_id> <message>"
    api POST "sessions/$1:sendMessage" \
        -d "{\"prompt\": \"$2\"}" && echo "Message sent."
}

cmd_activities() {
    [ -n "${1:-}" ] || die "Usage: $0 activities <session_id>"
    api GET "sessions/$1/activities?pageSize=30" | python3 -c "
import json,sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
data = json.load(sys.stdin)
for a in data.get('activities', []):
    who = a.get('originator', '?')
    aid = a.get('id', '?')[:12]
    # Determine activity type
    atype = 'unknown'
    for k in ['planGenerated','planApproved','progressUpdated','sessionCompleted','commandExecuted','messageSent']:
        if k in a:
            atype = k
            break
    detail = ''
    if 'progressUpdated' in a:
        detail = a['progressUpdated'].get('title', '')[:60]
    elif 'commandExecuted' in a:
        detail = 'exit=' + str(a['commandExecuted'].get('exitCode','?'))
    print(f\"  [{who:6s}] {atype:20s} {detail}  ({aid})\")
"
}

# ─── Batch: Scan + Fix Multiple Issues ───

cmd_batch() {
    local count="${1:-3}"
    echo "=== Batch: Finding $count agent-fixable issues ==="
    
    cd /tmp/openclaw-fork 2>/dev/null || die "No openclaw clone found"
    
    # Find fresh issues with no PRs and simple fix signals
    gh issue list -R openclaw/openclaw --state open --limit 30 \
        --json number,title,body,createdAt \
        --jq '.[]' | python3 -c "
import json,sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
issues = []
for line in sys.stdin:
    line = line.strip()
    if not line: continue
    try:
        issues.append(json.loads(line))
    except: pass

# Score by fixability
scored = []
for i in issues:
    body = (i.get('body','') or '').lower()
    score = 0
    if 'hardcoded' in body: score += 3
    if 'suggested fix' in body.lower() or 'fix:' in body: score += 2
    if 'typo' in body: score += 2
    if 'missing' in body and len(body) < 1000: score += 1
    if len(body) < 500: score += 1
    if 'feature' in i.get('title','').lower(): score -= 5
    scored.append((score, i))

scored.sort(key=lambda x: -x[0])
for score, i in scored[:$count]:
    if score > 0:
        print(json.dumps({'number': i['number'], 'title': i['title'][:70], 'score': score}))
" | while read -r line; do
        num=$(echo "$line" | python3 -c "import json,sys; print(json.load(sys.stdin)['number'])")
        title=$(echo "$line" | python3 -c "import json,sys; print(json.load(sys.stdin)['title'])")
        score=$(echo "$line" | python3 -c "import json,sys; print(json.load(sys.stdin)['score'])")
        
        echo ""
        echo "  → #$num (score: $score): $title"
        
        # Check for competing PRs
        competing=$(gh api "repos/openclaw/openclaw/issues/$num/timeline" --paginate 2>/dev/null | python3 -c "
import json,sys
raw = sys.stdin.read().replace('][', ',')
try: data = json.loads(raw)
except: data = []
def flat(x):
    if isinstance(x, list):
        for i in x: yield from flat(i)
    else: yield x
count = 0
for item in flat(data):
    if isinstance(item, dict) and item.get('event') == 'cross-referenced':
        src = item.get('source', {}).get('issue', {})
        if src.get('pull_request') and src.get('state') == 'open':
            count += 1
print(count)
" 2>/dev/null || echo "?")
        
        if [ "$competing" != "0" ] && [ "$competing" != "?" ]; then
            echo "    SKIP: $competing competing PR(s)"
        else
            echo "    NO COMPETITION — good candidate"
            echo "    To fix: ./jules-client.sh fix $num"
        fi
    done
}

# ─── Poll session until done ───

cmd_wait() {
    [ -n "${1:-}" ] || die "Usage: $0 wait <session_id>"
    local sid="$1"
    echo "Polling session $sid..."
    while true; do
        local state=$(api GET "sessions/$sid" | python3 -c "import json,sys; print(json.load(sys.stdin).get('state','?'))")
        echo "  $(date +%H:%M:%S) state=$state"
        case "$state" in
            COMPLETED|FAILED) break ;;
            *) sleep 15 ;;
        esac
    done
    echo ""
    cmd_session "$sid"
}

# ─── Help ───

cmd_help() {
    cat << 'HELP'
Jules API Client for OpenClaw

SETUP:
  1. Install Jules GitHub App: https://jules.google.com
  2. export JULES_API_KEY=your-key

COMMANDS:
  sources                    List connected repos
  sessions [n]               List recent sessions (default: 10)
  session <id>               Get session details + outputs
  activities <id>            List activities in a session

  fix <issue> [desc]         Create fix session (plan approval required)
  fix-auto <issue> [desc]    Create fix session (auto-creates PR)
  approve <id>               Approve a session's plan
  message <id> <msg>         Send follow-up message to session
  wait <id>                  Poll until session completes

  batch [n]                  Find n agent-fixable issues (default: 3)

WORKFLOW:
  1. ./jules-client.sh batch 5          # Find fixable issues
  2. ./jules-client.sh fix 15368        # Create session with plan review
  3. (review plan in Jules web UI)
  4. ./jules-client.sh approve <id>     # Approve the plan
  5. ./jules-client.sh wait <id>        # Wait for completion
  6. (review code on fork branch)
  7. gh pr create ...                   # Submit to upstream

HELP
}

# ─── Dispatch ───

case "${1:-help}" in
    sources)    cmd_sources ;;
    sessions)   cmd_sessions "${2:-}" ;;
    session)    cmd_session "${2:-}" ;;
    activities) cmd_activities "${2:-}" ;;
    fix)        cmd_fix "${2:-}" "${3:-}" ;;
    fix-auto)   cmd_fix_auto "${2:-}" "${3:-}" ;;
    approve)    cmd_approve "${2:-}" ;;
    message)    cmd_message "${2:-}" "${3:-}" ;;
    wait)       cmd_wait "${2:-}" ;;
    batch)      cmd_batch "${2:-}" ;;
    help|--help|-h) cmd_help ;;
    *)          die "Unknown command: $1. Run '$0 help' for usage." ;;
esac
