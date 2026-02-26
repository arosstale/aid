#!/usr/bin/env node

/**
 * Pi Builder Ralph Loop - Simplified TUI Launcher
 * No mprocs dependency - pure Node.js
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
process.chdir(projectDir);

// Colors
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

function clear() {
  console.clear();
}

function header(title) {
  console.log('');
  log('╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║ ' + title.padEnd(62) + '║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('');
}

function showMenu() {
  clear();
  header('🚀 Pi Builder Ralph Loop');
  
  log('Select mode:', 'yellow');
  console.log('');
  log('  1) 📚 Documentation (view all docs)', 'green');
  log('  2) 🎯 Ralph Loop Stories (execute story-by-story)', 'green');
  log('  3) 📖 Quick Start (Story 001 guide)', 'green');
  log('  4) 📊 Project Status', 'green');
  log('  5) 📝 Git Log', 'green');
  log('  6) 📄 View Progress', 'green');
  log('  0) Exit', 'green');
  console.log('');
  
  rl.question('Choose (0-6): ', (answer) => {
    handleMenu(answer);
  });
}

function handleMenu(choice) {
  switch(choice) {
    case '1':
      showDocumentation();
      break;
    case '2':
      startRalphLoop();
      break;
    case '3':
      showQuickStart();
      break;
    case '4':
      showStatus();
      break;
    case '5':
      showGitLog();
      break;
    case '6':
      showProgress();
      break;
    case '0':
      log('Goodbye! 👋', 'cyan');
      rl.close();
      process.exit(0);
      break;
    default:
      log('Invalid choice', 'red');
      setTimeout(showMenu, 1000);
  }
}

function showDocumentation() {
  clear();
  header('📚 Documentation - Available Guides');
  
  const docs = [
    { name: '00_README_PI_BUILDER.md', desc: 'Main entry point' },
    { name: 'QUICK_REFERENCE.md', desc: '2-minute overview' },
    { name: 'RESEARCH_SUMMARY.md', desc: '5-minute summary' },
    { name: 'START_HERE_PI_BUILDER.md', desc: 'Story 001 quick start' },
    { name: 'AUTOMAKER_VS_PI_BUILDER.md', desc: 'Technical comparison' },
    { name: 'RESEARCH_PI_BUILDER_IMPROVEMENTS.md', desc: 'Detailed improvements' },
    { name: 'PI_BUILDER_REVERSE_ENGINEERING.md', desc: 'Legal + patterns' },
    { name: 'FINAL_STATUS.md', desc: 'Current status' }
  ];
  
  docs.forEach((doc, i) => {
    log(`  ${i+1}) ${doc.name}`, 'green');
    log(`     → ${doc.desc}`, 'cyan');
  });
  
  console.log('');
  rl.question('Select document (1-8) or 0 to go back: ', (answer) => {
    const idx = parseInt(answer) - 1;
    if (idx >= 0 && idx < docs.length) {
      const docPath = path.join(projectDir, docs[idx].name);
      if (fs.existsSync(docPath)) {
        try {
          const content = fs.readFileSync(docPath, 'utf-8');
          clear();
          log(docs[idx].name, 'cyan');
          log('═'.repeat(64), 'cyan');
          console.log(content);
          console.log('');
          rl.question('Press Enter to go back to menu...', () => {
            showMenu();
          });
        } catch (e) {
          log(`Error reading file: ${e.message}`, 'red');
          showDocumentation();
        }
      } else {
        log('File not found', 'red');
        showDocumentation();
      }
    } else if (answer === '0') {
      showMenu();
    } else {
      log('Invalid choice', 'red');
      showDocumentation();
    }
  });
}

function startRalphLoop() {
  clear();
  header('🎯 Ralph Loop Story Execution');
  
  try {
    const prd = JSON.parse(fs.readFileSync(path.join(projectDir, 'PI_BUILDER_PRD.json'), 'utf-8'));
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
        showStoryDetails('001', prd);
      } else {
        showMenu();
      }
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
    showMenu();
  }
}

function showStoryDetails(storyId, prd) {
  const story = prd.stories.find(s => s.id === storyId);
  if (!story) {
    log(`Story ${storyId} not found`, 'red');
    showMenu();
    return;
  }
  
  clear();
  header(`Story ${story.id}: ${story.title}`);
  
  log(`Priority: ${story.priority}`, 'green');
  log(`Description: ${story.description}`, 'cyan');
  console.log('');
  log('Acceptance Criteria:', 'yellow');
  story.acceptance.forEach(criterion => {
    log(`  ✓ ${criterion}`, 'green');
  });
  console.log('');
  
  rl.question('View implementation guide? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      showQuickStart();
    } else {
      showMenu();
    }
  });
}

function showQuickStart() {
  clear();
  header('📖 Story 001: Quick Start Guide');
  
  try {
    const content = fs.readFileSync(path.join(projectDir, 'START_HERE_PI_BUILDER.md'), 'utf-8');
    console.log(content);
    console.log('');
    rl.question('Press Enter to go back to menu...', () => {
      showMenu();
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
    showMenu();
  }
}

function showStatus() {
  clear();
  header('📊 Project Status');
  
  try {
    const prd = JSON.parse(fs.readFileSync(path.join(projectDir, 'PI_BUILDER_PRD.json'), 'utf-8'));
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
      log(`  [${s.id}] ${s.title}`, 'green');
    });
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
  }
  
  console.log('');
  rl.question('Press Enter to go back to menu...', () => {
    showMenu();
  });
}

function showGitLog() {
  clear();
  header('📝 Git Commit History');
  
  try {
    const log = execSync('git log --oneline -15', { encoding: 'utf-8' });
    console.log(log);
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
  }
  
  console.log('');
  rl.question('Press Enter to go back to menu...', () => {
    showMenu();
  });
}

function showProgress() {
  clear();
  header('📄 Progress Log (Last 30 lines)');
  
  try {
    const content = fs.readFileSync(path.join(projectDir, 'PI_BUILDER_PROGRESS.txt'), 'utf-8');
    const lines = content.split('\n');
    const last30 = lines.slice(-30).join('\n');
    console.log(last30);
  } catch (e) {
    log(`Error: ${e.message}`, 'red');
  }
  
  console.log('');
  rl.question('Press Enter to go back to menu...', () => {
    showMenu();
  });
}

// Start
clear();
showMenu();
