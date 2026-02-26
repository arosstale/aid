#!/bin/bash
# Scan OpenClaw issues for Jules-fixable bugs
# Outputs issues ranked by: freshness × simplicity × no-competition

cd /tmp/openclaw-fork 2>/dev/null || cd /tmp/openclaw 2>/dev/null

echo "=== Scanning OpenClaw issues for agent-fixable bugs ==="
echo ""

# Get fresh bug issues (last 24h)
gh issue list -R openclaw/openclaw --state open --limit 50 \
    --json number,title,createdAt,body,labels \
    --jq '.[] | select(
        (.labels | map(.name) | (index("bug") or length == 0)) and
        (.title | test("[Ff]eat|[Ff]eature|[Rr]equest") | not)
    )' 2>/dev/null | python3 -c "
import json, sys, re

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

issues = []
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        issue = json.loads(line)
        issues.append(issue)
    except:
        pass

print(f'Found {len(issues)} potential bug issues\n')

for issue in issues[:20]:
    num = issue['number']
    title = issue['title'][:70]
    body = issue.get('body', '') or ''
    
    # Heuristic: is this a simple fix?
    simple_signals = 0
    if 'hardcoded' in body.lower(): simple_signals += 2
    if 'typo' in body.lower(): simple_signals += 2
    if 'missing' in body.lower() and len(body) < 1000: simple_signals += 1
    if 'default' in body.lower() and 'should be' in body.lower(): simple_signals += 1
    if re.search(r'1.line|one.line|simple.fix|easy.fix', body.lower()): simple_signals += 2
    if 'Suggested Fix' in body or 'Fix:' in body: simple_signals += 2
    if len(body) < 500: simple_signals += 1  # short = usually clear
    
    # Estimate: has suggested code?
    has_code = '\`\`\`' in body
    if has_code: simple_signals += 1
    
    score_str = '★' * min(simple_signals, 5) + '☆' * (5 - min(simple_signals, 5))
    
    print(f'#{num} [{score_str}] {title}')
    if simple_signals >= 3:
        # Show first line of body for high-signal issues
        first_line = body.split('\n')[0][:100] if body else ''
        print(f'  → {first_line}')
    print()
" 2>&1

echo ""
echo "★★★★★ = Very likely agent-fixable (suggested fix, hardcoded value, etc)"
echo "★☆☆☆☆ = Needs investigation"
