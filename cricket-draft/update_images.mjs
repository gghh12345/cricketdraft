import fs from 'fs';
import { players } from './src/data/players.js';

async function fetchImages() {
  const updatedPlayers = [];
  const opts = { headers: { 'User-Agent': 'CricketDraftBot/1.0 (contact@example.com)' } };
  
  for (const player of players) {
    if (!player.image.includes('pravatar.cc')) {
      // Already fetched
      updatedPlayers.push(player);
      continue;
    }
    
    try {
      let queryName = player.name;
      if (queryName === 'Steve Smith') queryName = 'Steve Smith (cricketer)';
      if (queryName === 'David Warner') queryName = 'David Warner (cricketer)';
      if (queryName === 'Rashid Khan') queryName = 'Rashid Khan (Afghan cricketer)';
      
      let res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(queryName), opts);
      let data = await res.json();
      
      let image = player.image;
      if (data.thumbnail && data.thumbnail.source) {
        image = data.thumbnail.source.replace(/\d+px-/, '500px-');
      } else {
        // Try searching without disambiguation if it failed
        if (queryName !== player.name) {
          res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(player.name), opts);
          data = await res.json();
          if (data.thumbnail && data.thumbnail.source) {
            image = data.thumbnail.source.replace(/\d+px-/, '500px-');
          }
        }
      }
      
      updatedPlayers.push({
        ...player,
        image
      });
      console.log(`Fetched ${player.name}: ${image !== player.image ? 'SUCCESS' : 'NO_IMAGE'}`);
    } catch (e) {
      console.error(`Failed ${player.name}: ${e.message}`);
      updatedPlayers.push(player);
    }
    // Sleep to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  const jsContent = `export const players = ${JSON.stringify(updatedPlayers, null, 2)};\n`;
  fs.writeFileSync('./src/data/players.js', jsContent);
  console.log('Successfully updated src/data/players.js');
  
  const backendFile = '../cricket-draft-backend/server.js';
  if (fs.existsSync(backendFile)) {
    let content = fs.readFileSync(backendFile, 'utf8');
    content = content.replace(/const players = \[\s*\{[\s\S]*?\];/m, `const players = ${JSON.stringify(updatedPlayers, null, 2)};`);
    fs.writeFileSync(backendFile, content);
    console.log('Successfully updated backend server.js');
  }
}

fetchImages();
