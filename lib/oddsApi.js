// Sports configuration with priority system
// Always maintains exactly 8 active sports

const ALL_SPORTS = [
  // Tier 1: Primary sports (long seasons or year-round)
  { key: 'basketball_nba', name: 'NBA', months: [0,1,2,3,4,5,9,10,11] }, // Jan-Jun, Oct-Dec (skip Jul-Aug mostly)
  { key: 'icehockey_nhl', name: 'NHL', months: [0,1,2,3,4,9,10,11] }, // Oct-Apr
  { key: 'basketball_ncaab', name: 'NCAAB', months: [0,1,2,3,10,11] }, // Nov-Mar, plus tournaments
  { key: 'soccer_epl', name: 'EPL', months: [0,1,2,3,4,7,8,9,10,11] }, // Aug-May (skip June mostly)
  { key: 'tennis_atp', name: 'Tennis ATP', months: [0,1,2,3,4,5,6,7,8,9,10,11] }, // Year-round
  { key: 'baseball_mlb', name: 'MLB', months: [3,4,5,6,7,8,9,10] }, // Apr-Oct
  
  // Tier 2: Seasonal sports (fill slots when active)
  { key: 'americanfootball_nfl', name: 'NFL', months: [8,9,10,11,0,1] }, // Sep-Feb
  { key: 'americanfootball_ncaaf', name: 'NCAAF', months: [8,9,10,11,0] }, // Sep-Jan
  
  // Tier 3: Alternates (fill gaps when Tier 1/2 aren't enough)
  { key: 'basketball_wnba', name: 'WNBA', months: [4,5,6,7,8,9] }, // May-Sep (fills NBA summer gap)
  { key: 'soccer_usa_mls', name: 'MLS', months: [1,2,3,4,5,6,7,8,9,10] }, // Feb-Oct (fills soccer gap)
  { key: 'golf_masters_tournament_winner', name: 'Golf', months: [0,1,2,3,4,5,6,7,8,9,10,11] }, // Year-round events
  { key: 'mma_mixed_martial_arts', name: 'UFC/MMA', months: [0,1,2,3,4,5,6,7,8,9,10,11] }, // Year-round events
  { key: 'basketball_euroleague', name: 'EuroLeague', months: [0,1,2,3,4,9,10,11] }, // Oct-Apr
  { key: 'soccer_uefa_champs_league', name: 'Champions League', months: [0,1,2,3,4,8,9,10,11] }, // Sep-May
];

// Get current month (0-11)
function getCurrentMonth() {
  return new Date().getMonth();
}

// Check if sport is active this month
function isSportActive(sport) {
  const currentMonth = getCurrentMonth();
  return sport.months.includes(currentMonth);
}

// Get exactly 8 sports to track
export function getTrackedSports() {
  const currentMonth = getCurrentMonth();
  const activeSports = ALL_SPORTS.filter(s => isSportActive(s));
  
  // If we have exactly 8, perfect
  if (activeSports.length === 8) {
    return activeSports;
  }
  
  // If we have more than 8, take first 8 (by priority order in ALL_SPORTS)
  if (activeSports.length > 8) {
    return activeSports.slice(0, 8);
  }
  
  // If we have fewer than 8, add alternates until we hit 8
  const selected = [...activeSports];
  const needed = 8 - selected.length;
  
  // Get alternates that aren't already selected
  const alternates = ALL_SPORTS.filter(s => 
    !selected.find(sel => sel.key === s.key)
  );
  
  // Add alternates (prioritize year-round ones)
  const yearRoundAlternates = alternates.filter(s => s.months.length === 12);
  const seasonalAlternates = alternates.filter(s => s.months.length < 12);
  
  // First add year-round alternates
  for (const sport of yearRoundAlternates) {
    if (selected.length >= 8) break;
    selected.push(sport);
  }
  
  // Then add seasonal alternates if still needed
  for (const sport of seasonalAlternates) {
    if (selected.length >= 8) break;
    // Only add if it's in season
    if (isSportActive(sport)) {
      selected.push(sport);
    }
  }
  
  return selected;
}

// Format month names for display
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Get sports schedule info for display
export function getSportsScheduleInfo() {
  const tracked = getTrackedSports();
  const currentMonth = getCurrentMonth();
  
  return tracked.map(sport => {
    const monthNames = sport.months.map(m => MONTH_NAMES[m]).join(', ');
    const isInSeason = sport.months.includes(currentMonth);
    return {
      ...sport,
      monthRange: monthNames,
      isInSeason
    };
  });
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
  const trackedSports = getTrackedSports();
  const allPicks = [];
  const errors = [];
  
  for (const sport of trackedSports) {
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport.key}/odds?apiKey=${apiKey}&regions=us&oddsFormat=american&bookmakers=draftkings`
      );
      
      if (!response.ok) {
        errors.push(`${sport.name}: API error ${response.status}`);
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
    sportsChecked: trackedSports.map(s => s.name),
    errors: errors,
    month: getCurrentMonth()
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
