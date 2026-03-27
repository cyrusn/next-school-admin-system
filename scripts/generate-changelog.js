const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateChangelog() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
    const stdout = execSync('git log -n 200 --pretty=format:"%D<<||>>%s<<||>>%b<<END_COMMIT>>"').toString();
    const commits = stdout.split('<<END_COMMIT>>').filter(Boolean);
    
    const versions = [];
    let currentVersion = { version: `v${pkg.version}`, commits: [] };
    
    for (const commit of commits) {
      const parts = commit.split('<<||>>');
      if (parts.length < 3) continue;
      
      const refs = parts[0].trim();
      const subject = parts[1].trim();
      const body = parts[2].trim();
      
      const tagMatch = refs.match(/tag: (v[0-9\.]+)/);
      if (tagMatch) {
        if (currentVersion.commits.length > 0 || currentVersion.version !== tagMatch[1]) {
          versions.push(currentVersion);
        }
        currentVersion = { version: tagMatch[1], commits: [] };
      }
      
      // Filter out chore commits, version bumps, and merges
      if (!subject || subject.startsWith('chore:') || subject.match(/^[0-9\.]+$/) || subject.match(/^v[0-9\.]+$/) || subject.startsWith('Squash merge') || subject.startsWith('docs: update changelog') || subject.startsWith('docs: changelog') || subject.startsWith('bump version') || subject.includes('update version number')) {
        continue;
      }
      
      let notes = [subject];
      if (body) {
        const bullets = body.split('\n').filter(l => l.trim().startsWith('-'));
        if (bullets.length > 0) {
          notes = bullets.map(b => b.replace(/^- /, '').trim());
        }
      }
      
      currentVersion.commits.push(...notes);
    }
    
    if (currentVersion.commits.length > 0) {
      versions.push(currentVersion);
    }
    
    const outPath = path.join(__dirname, '../src/config/changelog.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    
    // Filter empty versions and save the top 5
    const finalVersions = versions.filter(v => v.commits.length > 0).slice(0, 5);
    
    fs.writeFileSync(outPath, JSON.stringify(finalVersions, null, 2));
    console.log(`Changelog generated successfully at ${outPath}`);
  } catch (err) {
    console.error('Failed to generate changelog:', err);
  }
}

generateChangelog();
