#!/usr/bin/env node

/**
 * Fetch odds data from The Odds API and save to JSON file
 * Run via cron: 0 10 * * * and 0 17 * * *
 * Usage: node scripts/fetch-odds.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = '1ad6289c29935840d01c48d6e9438cb9';

const TRACKED_SPORTS = [
  { key: 'basketball_nba', name: 'NBA', season: 'always' },
  { key: 'icehockey_nhl', name: 'NHL', season: 'always' },
  { key: 'basketball_ncaab', name: 'NCAAB', season: 'always' },
  { key: 'americanfootball_nfl', name: 'NFL', season: 'sep-feb' },
  { key: 'americanfootball_ncaaf', name: 'NCAAF', season: 'sep-jan' },
  { key: 'baseball_mlb', name: 'MLB', season: 'apr-oct' },
  { key: 'soccer_epl', name: 'EPL', season: 'always' },
  { key: 'tennis_atp', name: 'Tennis ATP', season: 'always' },
];

function isInSeason(season) {
  if (season === 'always') return true;
  const now = new Date();
  const month = now.getMonth();
  
  switch(season) {
    case 'sep-feb': return month >= 8 || month <= 1;
    case 'sep-jan': return month >= 8 || month <= 0;
    case 'apr-oct': return month >= 3 && month <= 9;
    default: return true;
  }
}

function impliedProbability(odds) {
  if (odds > 0) return 100 / (odds + 100);
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

function calculateEV(trueProb, odds) {
  const winReturn = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  return (trueProb * winReturn) - (1 - trueProb);
}

async function fetchOdds(sport) {
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${API_KEY}&regions=us&oddsFormat=american&bookmakers=draftkings`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error(`Error fetching ${sport}:`, e.message);
    return [];
  }
}

function analyzeGame(game) {
  const draftkings = game.bookmakers?.find(b => b.key === 'draftkings');
  if (!draftkings) return [];
  
  const h2h = draftkings.markets?.find(m => m.key === 'h2h');
  if (!h2h) return [];
  
  const picks = [];
  
  for (const outcome of h2h.outcomes) {
    const implied = impliedProbability(outcome.price);
    let estimatedProb = implied;
    let confidence = 'low';
    let units = 1;
    
    const isHome = outcome.name === game.home_team;
    const isFavorite = outcome.price < 0;
    
    if (isHome && isFavorite) {
      estimatedProb = Math.min(0.72, implied + 0.025);
    } else if (!isHome && !isFavorite) {
      estimatedProb = Math.max(0.22, implied - 0.015);
    }
    
    const ev = calculateEV(estimatedProb, outcome.price);
    
    if (ev > -0.03 && Math.abs(outcome.price) < 250) {
      if (ev > 0.04) { confidence = 'high'; units = 3; }
      else if (ev > 0.01) { confidence = 'medium'; units = 2; }
      
      picks.push({
        pick: `${outcome.name} ${outcome.price > 0 ? '+' : ''}${outcome.price}`,
        game: `${game.away_team} at ${game.home_team}`,
        sport: game.sport_title,
        odds: outcome.price,
        units: units,
        confidence: confidence,
        ev: ev,
        commenceTime: game.commence_time,
        analysis: `${outcome.name} ${isHome ? 'at home' : 'on the road'}. Market implies ${(implied*100).toFixed(1)}% but estimated ${(estimatedProb*100).toFixed(1)}% gives ${(ev*100).toFixed(1)}% EV.`
      });
    }
  }
  
  return picks;
}

async function main() {
  console.log('Starting odds fetch...', new Date().toISOString());
  
  const activeSports = TRACKED_SPORTS.filter(s => isInSeason(s.season));
  console.log(`Checking ${activeSports.length} sports: ${activeSports.map(s => s.name).join(', ')}`);
  
  const allPicks = [];
  const errors = [];
  
  for (const sport of activeSports) {
    console.log(`Fetching ${sport.name}...`);
    const games = await fetchOdds(sport.key);
    
    for (const game of games) {
      const picks = analyzeGame(game);
      allPicks.push(...picks);
    }
  }
  
  // Sort by EV, take top 5
  allPicks.sort((a, b) => b.ev - a.ev);
  const topPicks = allPicks.slice(0, 5);
  
  const result = {
    picks: topPicks,
    timestamp: new Date().toISOString(),
    sportsChecked: activeSports.map(s => s.name),
    totalGames: allPicks.length,
    nextUpdate: '10:00 AM ET or 5:00 PM ET'
  };
  
  // Save to data file
  const dataPath = path.join(__dirname, '..', 'data', 'picks.json');
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(result, null, 2));
  
  console.log(`Saved ${topPicks.length} picks to data/picks.json`);
  console.log('Top pick:', topPicks[0]?.pick || 'None');
}

main().catch(console.error);
