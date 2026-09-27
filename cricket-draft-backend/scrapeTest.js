const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePlayers() {
  try {
    const { data } = await axios.get('https://www.cricbuzz.com/cricket-team/india/2/players');
    const $ = cheerio.load(data);
    const players = [];
    
    $('a.cb-col.cb-col-50').each((i, el) => {
      const name = $(el).find('div').text().trim();
      if (name) players.push(name);
    });
    
    console.log("Scraped players:", players.slice(0, 10));
  } catch (error) {
    console.error("Scraping failed:", error.message);
  }
}

scrapePlayers();
