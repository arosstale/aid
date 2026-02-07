#!/bin/bash

# Pi Builder Ralph Loop - TUI-based workflow orchestrator
# Uses mprocs to manage multiple concurrent views

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║            🚀 Pi Builder Ralph Loop - mprocs TUI              ║"
echo "║                                                                ║"
echo "║         Starting multi-process development environment        ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if mprocs is installed
if ! command -v mprocs &> /dev/null; then
    echo "❌ mprocs not found. Installing..."
    npm install -g mprocs
fi

# Show options
echo "Select mode:"
echo ""
echo "  1) Documentation & Research (read-only)"
echo "  2) Development Mode (with git monitoring)"
echo "  3) Full Story Execution (story-by-story)"
echo ""
read -p "Choose (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📚 Starting documentation viewer..."
        echo "   You can read all research documents side-by-side"
        echo ""
        mprocs -c mprocs-simple.yaml
        ;;
    2)
        echo ""
        echo "🔄 Starting development mode..."
        echo "   - Document viewer"
        echo "   - Git monitor"
        echo "   - File explorer"
        echo "   - Code editor"
        echo ""
        mprocs -c mprocs-dev.yaml
        ;;
    3)
        echo ""
        echo "🎯 Starting Ralph Loop story execution..."
        echo ""
        echo "Stories to implement:"
        node -e "
        const fs = require('fs');
        const prd = JSON.parse(fs.readFileSync('PI_BUILDER_PRD.json', 'utf-8'));
        const incomplete = prd.stories.filter(s => !s.passes);
        console.log('');
        incomplete.slice(0, 5).forEach(s => {
            console.log('  📝 Story ' + s.id + ': ' + s.title + ' (' + s.priority + ')');
        });
        console.log('');
        console.log('Total incomplete: ' + incomplete.length + '/24');
        console.log('');
        "
        
        echo ""
        read -p "Start with Story 001? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            echo ""
            echo "📖 Reading PI_BUILDER_PROMPT.md..."
            echo ""
            cat PI_BUILDER_PROMPT.md
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "Ready to implement Story 001?"
            echo ""
            read -p "Continue (y/n): " continue_choice
            if [ "$continue_choice" = "y" ]; then
                cat START_HERE_PI_BUILDER.md
            fi
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
