# Pi Builder Ralph Loop Launcher - PowerShell version
# Windows-friendly launcher for mprocs TUI

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║            🚀 Pi Builder Ralph Loop - mprocs TUI              ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║         Starting multi-process development environment        ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check mprocs
$mprocs = Get-Command mprocs -ErrorAction SilentlyContinue
if (-not $mprocs) {
    Write-Host "❌ mprocs not found. Installing..." -ForegroundColor Red
    npm install -g mprocs
}

Write-Host "Select mode:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1) 📚 Documentation & Research (read-only)" -ForegroundColor Green
Write-Host "  2) 🔄 Development Mode (with monitoring)" -ForegroundColor Green
Write-Host "  3) 🎯 Ralph Loop Story Execution" -ForegroundColor Green
Write-Host "  4) 📖 Read START_HERE_PI_BUILDER.md" -ForegroundColor Green
Write-Host "  5) 📊 Show PRD Status" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "Choose (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📚 Starting documentation viewer..." -ForegroundColor Cyan
        Write-Host "   You can read all research documents" -ForegroundColor Cyan
        Write-Host ""
        & mprocs -c mprocs-simple.yaml
    }
    "2" {
        Write-Host ""
        Write-Host "🔄 Starting development mode..." -ForegroundColor Cyan
        Write-Host ""
        & mprocs -c mprocs-dev.yaml
    }
    "3" {
        Write-Host ""
        Write-Host "🎯 Ralph Loop Story Execution" -ForegroundColor Cyan
        Write-Host ""
        
        $prd = Get-Content PI_BUILDER_PRD.json | ConvertFrom-Json
        $incomplete = $prd.stories | Where-Object { -not $_.passes }
        
        Write-Host "Next stories to implement:" -ForegroundColor Yellow
        Write-Host ""
        $incomplete | Select-Object -First 5 | ForEach-Object {
            Write-Host "  📝 Story $($_.id): $($_.title) ($($_.priority))" -ForegroundColor Green
        }
        Write-Host ""
        Write-Host "Total incomplete: $($incomplete.Count)/24" -ForegroundColor Cyan
        Write-Host ""
        
        $confirm = Read-Host "Start with Story 001? (y/n)"
        if ($confirm -eq "y") {
            Write-Host ""
            Write-Host "📖 Reading PI_BUILDER_PROMPT.md..." -ForegroundColor Cyan
            Write-Host ""
            Get-Content PI_BUILDER_PROMPT.md | Select-Object -First 50
            Write-Host ""
            Write-Host "... (truncated, read full file)" -ForegroundColor Gray
            Write-Host ""
            
            $continue = Read-Host "View full PROMPT.md? (y/n)"
            if ($continue -eq "y") {
                Get-Content PI_BUILDER_PROMPT.md | Out-Host -Paging
            }
            
            $start = Read-Host ""
            Write-Host ""
            Write-Host "🚀 Ready to execute Story 001?" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Next step: Read START_HERE_PI_BUILDER.md" -ForegroundColor Green
            Write-Host ""
            Get-Content START_HERE_PI_BUILDER.md | Out-Host -Paging
        }
    }
    "4" {
        Write-Host ""
        Write-Host "📖 Story 001 Quick Start Guide" -ForegroundColor Cyan
        Write-Host ""
        Get-Content START_HERE_PI_BUILDER.md | Out-Host -Paging
    }
    "5" {
        Write-Host ""
        Write-Host "📊 Project Status" -ForegroundColor Cyan
        Write-Host ""
        
        $prd = Get-Content PI_BUILDER_PRD.json | ConvertFrom-Json
        $total = $prd.stories.Count
        $complete = ($prd.stories | Where-Object { $_.passes } | Measure-Object).Count
        
        Write-Host "Stories Complete: $complete/$total" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Remaining stories:" -ForegroundColor Yellow
        $prd.stories | Where-Object { -not $_.passes } | Select-Object -First 10 | ForEach-Object {
            Write-Host "  [$($_.id)] $($_.title)" -ForegroundColor Cyan
        }
        
        Write-Host ""
        Write-Host "Git commits:" -ForegroundColor Yellow
        & git log --oneline -5
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
        exit 1
    }
}
