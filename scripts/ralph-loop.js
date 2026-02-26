#!/usr/bin/env node

/**
 * Pi Builder Ralph Loop - Node.js TUI Launcher
 * Cross-platform launcher for mprocs-based development environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const projectDir = __dirname;
const prdPath = path.join(projectDir, 'PI_BUILDER_PRD.json');
const startHerePath = path.join(projectDir, 'START_HERE_PI_BUILDER.md');
const promptPath = path.join(projectDir, 'PI_BUILDER_PROMPT.md');
const progressPath = path.join(projectDir, 'PI_BUILDER_PROGRESS.txt');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('');
  log('╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║' + title.padStart(title.length + 33).padEnd(65) + '║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('');
}

function showMenu() {
  header('🚀 Pi Builder Ralph Loop - mprocs TUI');
  
  log('Select mode:', 'yellow');
  console.log('');
  log('  1) 📚 Documentation Viewer (read all research)', 'green');
  log('  2) 🔄 Development Mode (git monitoring)', 'green');
  log('  3) 🎯 Ralph Loop Stories (execute story-by-story)', 'green');
  log('  4) 📖 Quick Start (Story 001 guide)', 'green');
  log('  5) 📊 Project Status', 'green');
  log('  6) 🔍 View Current Progress', 'green');
  log('  7) 📝 View Git Log', 'green');
  log('  0) Exit', 'green');
  console.log('');
  
  rl.question('Choose (0-7): ', handleChoice);
}

function handleChoice(choice) {
  process.chdir(projectDir);
  
  switch(choice) {
    case '1':
      showDocumentation();
      break;
    case '2':
      startDevelopmentMode();
      break;
    case '3':
      startRalphLoop();
      break;
    case '4':
      showQuickStart();
      break;
    case '5':
      showStatus();
      break;
    case '6':
      showProgress();
      break;
    case '7':
      showGitLog();
      break;
    case '0':
      log('Goodbye! 👋', 'cyan');
      rl.close();
      process.exit(0);
      break;
    default:
      log('Invalid choice', 'red');
      console.log('');
      showMenu();
  }
}

function showDocumentation() {
  log('📚 Starting documentation viewer with mprocs...', 'cyan');
  console.log('');
  
  try {
    execSync('mprocs -c mprocs-simple.yaml', {
      cwd: projectDir,
      stdio: 'inherit'
    });
  } catch (e) {
    if (e.message.includes('not found')) {
      log('❌ mprocs not found. Installing...', 'red');
      execSync('npm install -g mprocs', { stdio: 'inherit' });
      execSync('mprocs -c mprocs-simple.yaml', {
        cwd: projectDir,
        stdio: 'inherit'
      });
    }
  }
  
  console.log('');
  showMenu();
}

function startDevelopmentMode() {
  log('🔄 Starting development mode...', 'cyan');
  console.log('');
  
  try {
    execSync('mprocs -c mprocs-dev.yaml', {
      cwd: projectDir,
      stdio: 'inherit'
    });
  } catch (e) {
    // User exited mprocs
  }
  
  console.log('');
  showMenu();
}

function startRalphLoop() {
  console.log('');
  log('🎯 Ralph Loop Story Execution', 'cyan');
  console.log('');
  
  try {
    const prd = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
    const incomplete = prd.stories.filter(s => !s.passes);
    const complete = prd.stories.filter(s => s.passes);
    
    log(`Complete: ${complete.length}/${prd.stories.length}`, 'green');
    log(`Remaining: ${incomplete.length}/${prd.stories.length}`, 'yellow');
    console.log('');
    
    log('Next stories:', 'yellow');
    incomplete.slice(0, 5).forEach(s => {
      log(`  [${s.id}] ${s.title} (${s.priority})`, 'green');
    });
    console.log('');
    
    rl.question('Start with Story 001? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        showStoryDetails('001');
      } else {
        console.log('');
        showMenu();
      }
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
    console.log('');
    showMenu();
  }
}

function showStoryDetails(storyId) {
  try {
    const prd = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
    const story = prd.stories.find(s => s.id === storyId);
    
    if (!story) {
      log(`Story ${storyId} not found`, 'red');
      console.log('');
      showMenu();
      return;
    }
    
    console.log('');
    log(`Story ${story.id}: ${story.title}`, 'yellow');
    log(`Priority: ${story.priority}`, 'green');
    log(`Description: ${story.description}`, 'cyan');
    console.log('');
    log('Acceptance Criteria:', 'yellow');
    story.acceptance.forEach(criterion => {
      log(`  ✓ ${criterion}`, 'green');
    });
    console.log('');
    
    rl.question('View implementation guide (START_HERE_PI_BUILDER.md)? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        showQuickStart();
      } else {
        console.log('');
        showMenu();
      }
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
    console.log('');
    showMenu();
  }
}

function showQuickStart() {
  console.log('');
  log('📖 Story 001 Quick Start Guide', 'cyan');
  log('═'.repeat(64), 'cyan');
  console.log('');
  
  try {
    const content = fs.readFileSync(startHerePath, 'utf-8');
    const lines = content.split('\n').slice(0, 50);
    console.log(lines.join('\n'));
    console.log('');
    log('(Full guide available in START_HERE_PI_BUILDER.md)', 'gray');
    console.log('');
    
    rl.question('Ready to execute? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        log('Follow the instructions in START_HERE_PI_BUILDER.md to:', 'cyan');
        log('1. Create directory structure', 'green');
        log('2. Create package files', 'green');
        log('3. Run pnpm install', 'green');
        log('4. Verify build', 'green');
        log('5. Commit to git', 'green');
        console.log('');
        log('After Story 001, run this script again for Story 002', 'yellow');
      }
      console.log('');
      showMenu();
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
    console.log('');
    showMenu();
  }
}

function showStatus() {
  console.log('');
  log('📊 Project Status', 'cyan');
  console.log('');
  
  try {
    const prd = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
    const complete = prd.stories.filter(s => s.passes).length;
    const total = prd.stories.length;
    
    const percentage = Math.round((complete / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * complete) / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    
    console.log('');
    log(`Progress: [${bar}] ${percentage}%`, 'cyan');
    log(`Stories: ${complete}/${total}`, 'green');
    console.log('');
    
    log('Remaining stories:', 'yellow');
    prd.stories.filter(s => !s.passes).slice(0, 10).forEach(s => {
      log(`  [${ s.id}] ${s.title}`, 'green');
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
  }
  
  console.log('');
  rl.question('Press Enter to continue...', () => {
    showMenu();
  });
}

function showProgress() {
  console.log('');
  log('📄 Progress Log (Last 30 lines)', 'cyan');
  console.log('');
  
  try {
    const content = fs.readFileSync(progressPath, 'utf-8');
    const lines = content.split('\n');
    const last30 = lines.slice(-30).join('\n');
    console.log(last30);
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
  }
  
  console.log('');
  rl.question('Press Enter to continue...', () => {
    showMenu();
  });
}

function showGitLog() {
  console.log('');
  log('📝 Git Commit History', 'cyan');
  console.log('');
  
  try {
    const log = execSync('git log --oneline -15', {
      cwd: projectDir,
      encoding: 'utf-8'
    });
    console.log(log);
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
  }
  
  console.log('');
  rl.question('Press Enter to continue...', () => {
    showMenu();
  });
}

// Start the app
console.clear();
showMenu();
