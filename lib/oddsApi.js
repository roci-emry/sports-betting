// Sports to track (8 total)
export const TRACKED_SPORTS = [
  { key: 'basketball_nba', name: 'NBA', season: 'always' },
  { key: 'icehockey_nhl', name: 'NHL', season: 'always' },
  { key: 'basketball_ncaab', name: 'NCAAB', season: 'always' },
  { key: 'americanfootball_nfl', name: 'NFL', season: 'sep-feb' },
  { key: 'americanfootball_ncaaf', name: 'NCAAF', season: 'sep-jan' },
  { key: 'baseball_mlb', name: 'MLB', season: 'apr-oct' },
  { key: 'soccer_epl', name: 'EPL', season: 'always' },
  { key: 'tennis_atp', name: 'Tennis ATP', season: 'always' },
];

// Check if sport is in season
export function isInSeason(season) {
  if (season === 'always') return true;
  
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  switch(season) {
    case 'sep-feb': // NFL
      return month >= 8 || month <= 1; // Sep (8) - Feb (1)
    case 'sep-jan': // NCAAF
      return month >= 8 || month <= 0; // Sep (8) - Jan (0)
    case 'apr-oct': // MLB
      return month >= 3 && month <= 9; // Apr (3) - Oct (9)
    default:
      return true;
  }
}

// Get active sports for current date
export function getActiveSports() {
  return TRACKED_SPORTS.filter(sport => isInSeason(sport.season));
}

// Calculate implied probability from odds
export function impliedProbability(odds) {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

// Calculate expected value
export function calculateEV(trueProb, odds) {
  const winReturn = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  return (trueProb * winReturn) - (1 - trueProb);
}

// Generate analysis text
export function generateAnalysis(team, game, odds, ev, isHome, implied, estimated) {
  const location = isHome ? 'at home' : 'on the road';
  const evText = (ev * 100).toFixed(1);
  
  if (ev > 0.04) {
    return `${team} ${location}. Market implies ${(implied*100).toFixed(1)}% win probability, but situational analysis suggests ${(estimated*100).toFixed(1)}%. Strong +${evText}% expected value.`;
  } else if (ev > 0.01) {
    return `${team} ${location} with modest edge. Market pricing at ${(implied*100).toFixed(1)}% vs. estimated ${(estimated*100).toFixed(1)}% gives +${evText}% EV.`;
  } else {
    return `${team} ${location}. Near fair value with slight situational edge.`;
  }
}

// Analyze a single game
export function analyzeGame(game) {
  const draftkings = game.bookmakers?.find(b => b.key === 'draftkings');
  if (!draftkings) return [];
  
  const h2h = draftkings.markets?.find(m => m.key === 'h2h');
  if (!h2h) return [];
  
  const picks = [];
  
  for (const outcome of h2h.outcomes) {
    const implied = impliedProbability(outcome.price);
    
    // Basic analysis
    let estimatedProb = implied;
    let confidence = 'low';
    let units = 1;
    
    const isHome = outcome.name === game.home_team;
    const isFavorite = outcome.price < 0;
    
    // Apply simple adjustments
    if (isHome && isFavorite) {
      estimatedProb = Math.min(0.72, implied + 0.025);
    } else if (!isHome && !isFavorite) {
      estimatedProb = Math.max(0.22, implied - 0.015);
    }
    
    const ev = calculateEV(estimatedProb, outcome.price);
    
    // Only include decent plays
    if (ev > -0.03 && Math.abs(outcome.price) < 250) {
      if (ev > 0.04) {
        confidence = 'high';
        units = 3;
      } else if (ev > 0.01) {
        confidence = 'medium';
        units = 2;
      }
      
      picks.push({
        pick: `${outcome.name} ${outcome.price > 0 ? '+' : ''}${outcome.price}`,
        game: `${game.away_team} at ${game.home_team}`,
        sport: game.sport_title,
        odds: outcome.price,
        units: units,
        confidence: confidence,
        ev: ev,
        commenceTime: game.commence_time,
        analysis: generateAnalysis(outcome.name, game, outcome.price, ev, isHome, implied, estimatedProb)
      });
    }
  }
  
  return picks;
}

// Fetch and cache all sports data
export async function fetchAndCacheAllSports(apiKey) {
  const activeSports = getActiveSports();
  const allPicks = [];
  const errors = [];
  
  for (const sport of activeSports) {
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport.key}/odds?apiKey=${apiKey}&regions=us&oddsFormat=american&bookmakers=draftkings`
      );
      
      if (!response.ok) {
        errors.push(`${sport.name}: API error`);
        continue;
      }
      
      const games = await response.json();
      
      for (const game of games) {
        const picks = analyzeGame(game);
        allPicks.push(...picks);
      }
    } catch (e) {
      errors.push(`${sport.name}: ${e.message}`);
    }
  }
  
  // Sort by EV and take top 5
  allPicks.sort((a, b) => b.ev - a.ev);
  const topPicks = allPicks.slice(0, 5);
  
  // Cache results
  const cacheData = {
    picks: topPicks,
    timestamp: new Date().toISOString(),
    sportsChecked: activeSports.map(s => s.name),
    errors: errors
  };
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cachedPicks', JSON.stringify(cacheData));
  }
  
  return cacheData;
}

// Load cached picks
export function loadCachedPicks() {
  if (typeof localStorage === 'undefined') return null;
  
  const cached = localStorage.getItem('cachedPicks');
  if (!cached) return null;
  
  return JSON.parse(cached);
}

// Format time since last update
export function timeSinceUpdate(timestamp) {
  if (!timestamp) return 'Never';
  
  const now = new Date();
  const updated = new Date(timestamp);
  const diffMs = now - updated;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 5) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
}
