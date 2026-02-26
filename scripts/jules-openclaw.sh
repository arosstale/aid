#!/bin/bash
# Jules API integration for OpenClaw contributions
# Base URL: https://jules.googleapis.com/v1alpha
# Auth: X-Goog-Api-Key header
#
# SETUP: 
#   1. Install Jules GitHub App on arosstale/openclaw fork
#   2. Set JULES_API_KEY env var
#   3. Run: ./jules-openclaw.sh <command> [args]

BASE="https://jules.googleapis.com/v1alpha"

if [ -z "$JULES_API_KEY" ]; then
    echo "Error: JULES_API_KEY not set"
    echo "Set it with: export JULES_API_KEY=your-key"
    exit 1
fi

HEADERS=(-H "X-Goog-Api-Key: $JULES_API_KEY" -H "Content-Type: application/json")

# === Commands ===

list_sources() {
    echo "=== Available Sources ==="
    curl -s "$BASE/sources" "${HEADERS[@]}" | python3 -m json.tool
}

list_sessions() {
    echo "=== Recent Sessions ==="
    curl -s "$BASE/sessions?pageSize=${1:-10}" "${HEADERS[@]}" | python3 -m json.tool
}

get_session() {
    local session_id="$1"
    echo "=== Session $session_id ==="
    curl -s "$BASE/sessions/$session_id" "${HEADERS[@]}" | python3 -m json.tool
}

list_activities() {
    local session_id="$1"
    echo "=== Activities for $session_id ==="
    curl -s "$BASE/sessions/$session_id/activities?pageSize=30" "${HEADERS[@]}" | python3 -m json.tool
}

# Create a fix session for an OpenClaw issue
create_fix() {
    local issue_num="$1"
    local prompt="$2"
    
    if [ -z "$issue_num" ] || [ -z "$prompt" ]; then
        echo "Usage: $0 fix <issue_number> <prompt>"
        echo "Example: $0 fix 15368 'Fix cron cleanup hardcoded to keep'"
        exit 1
    fi

    echo "=== Creating Jules session for issue #$issue_num ==="
    
    # Build the full prompt with our conventions
    local full_prompt="Fix GitHub issue #$issue_num in the openclaw project.

$prompt

IMPORTANT CONVENTIONS:
- This is a bug fix PR. Keep changes minimal (ideally <20 lines).
- Run: pnpm lint, pnpm check, pnpm build, pnpm test
- Format with oxfmt (the project formatter)
- PR title format: fix(scope): description
- Include 'lobster-biscuit' in PR description
- PR description must follow this template:
  #### Summary
  #### Root Cause  
  #### Behavior Changes
  #### Tests
  **Sign-Off**
  - Models used: Jules (Google Gemini)
  - Submitter effort: AI-assisted with human review

Do NOT create the PR yet - just make the fix on a branch. I will review before PR creation."

    curl -s "$BASE/sessions" \
        -X POST \
        "${HEADERS[@]}" \
        -d "$(python3 -c "
import json
print(json.dumps({
    'prompt': '''$full_prompt''',
    'sourceContext': {
        'source': 'sources/github/arosstale/openclaw',
        'githubRepoContext': {
            'startingBranch': 'main'
        }
    },
    'requirePlanApproval': True
}))
")" | python3 -m json.tool
}

# Create a fix session with auto-PR
create_fix_auto() {
    local issue_num="$1"
    local prompt="$2"
    
    if [ -z "$issue_num" ] || [ -z "$prompt" ]; then
        echo "Usage: $0 fix-auto <issue_number> <prompt>"
        exit 1
    fi

    echo "=== Creating Jules session (auto-PR) for issue #$issue_num ==="
    
    curl -s "$BASE/sessions" \
        -X POST \
        "${HEADERS[@]}" \
        -d "$(python3 -c "
import json
print(json.dumps({
    'prompt': 'Fix issue #$issue_num: $prompt. Keep the fix minimal. Include lobster-biscuit in PR description.',
    'sourceContext': {
        'source': 'sources/github/arosstale/openclaw',
        'githubRepoContext': {
            'startingBranch': 'main'
        }
    },
    'automationMode': 'AUTO_CREATE_PR'
}))
")" | python3 -m json.tool
}

approve_plan() {
    local session_id="$1"
    echo "=== Approving plan for session $session_id ==="
    curl -s "$BASE/sessions/$session_id:approvePlan" \
        -X POST \
        "${HEADERS[@]}" | python3 -m json.tool
}

send_message() {
    local session_id="$1"
    local message="$2"
    echo "=== Sending message to session $session_id ==="
    curl -s "$BASE/sessions/$session_id:sendMessage" \
        -X POST \
        "${HEADERS[@]}" \
        -d "{\"prompt\": \"$message\"}" | python3 -m json.tool
}

# === Dispatch ===

case "$1" in
    sources)    list_sources ;;
    sessions)   list_sessions "$2" ;;
    session)    get_session "$2" ;;
    activities) list_activities "$2" ;;
    fix)        create_fix "$2" "$3" ;;
    fix-auto)   create_fix_auto "$2" "$3" ;;
    approve)    approve_plan "$2" ;;
    message)    send_message "$2" "$3" ;;
    *)
        echo "Jules-OpenClaw Agent"
        echo ""
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  sources              List connected repos"
        echo "  sessions [n]         List recent sessions"
        echo "  session <id>         Get session details"
        echo "  activities <id>      List session activities"
        echo "  fix <issue> <desc>   Create fix session (plan approval required)"
        echo "  fix-auto <issue> <d> Create fix session (auto-PR)"
        echo "  approve <id>         Approve session plan"
        echo "  message <id> <msg>   Send message to session"
        ;;
esac
