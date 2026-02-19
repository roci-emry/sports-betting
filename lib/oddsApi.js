const ODDS_API_KEY = '1ad6289c29935840d01c48d6e9438cb9';

// Calculate implied probability from odds
function impliedProbability(odds) {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

// Calculate expected value
function calculateEV(trueProb, odds) {
  const implied = impliedProbability(odds);
  const winReturn = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  return (trueProb * winReturn) - (1 - trueProb);
}

// Fetch odds from API
async function fetchOdds(sport) {
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${ODDS_API_KEY}&regions=us&oddsFormat=american&bookmakers=draftkings`
    );
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (e) {
    console.error(`Error fetching ${sport}:`, e);
    return [];
  }
}

// Analyze games and find value
async function generatePicks() {
  const allPicks = [];
  
  // Fetch NBA odds
  const nbaGames = await fetchOdds('basketball_nba');
  
  for (const game of nbaGames) {
    const draftkings = game.bookmakers.find(b => b.key === 'draftkings');
    if (!draftkings) continue;
    
    const h2h = draftkings.markets.find(m => m.key === 'h2h');
    if (!h2h) continue;
    
    for (const outcome of h2h.outcomes) {
      const implied = impliedProbability(outcome.price);
      
      // Simple heuristic: look for underdogs with implied prob < 40%
      // or favorites where we think they're stronger than market
      let estimatedProb = implied;
      let confidence = 'low';
      let units = 1;
      
      // Apply basic situational analysis
      const isHome = outcome.name === game.home_team;
      const isFavorite = outcome.price < 0;
      
      if (isHome && isFavorite) {
        // Home favorites - slightly boost confidence
        estimatedProb = Math.min(0.75, implied + 0.03);
      } else if (!isHome && !isFavorite) {
        // Road underdogs - reduce confidence unless special circumstances
        estimatedProb = Math.max(0.20, implied - 0.02);
      }
      
      const ev = calculateEV(estimatedProb, outcome.price);
      
      // Only include +EV plays or close to it
      if (ev > -0.05 && outcome.price > -200) {
        if (ev > 0.05) {
          confidence = 'high';
          units = 3;
        } else if (ev > 0) {
          confidence = 'medium';
          units = 2;
        }
        
        allPicks.push({
          pick: `${outcome.name} ${outcome.price > 0 ? '+' : ''}${outcome.price}`,
          game: `${game.away_team} at ${game.home_team}`,
          sport: 'NBA',
          odds: outcome.price,
          units: units,
          confidence: confidence,
          ev: ev.toFixed(3),
          impliedProb: (implied * 100).toFixed(1),
          estimatedProb: (estimatedProb * 100).toFixed(1),
          commenceTime: game.commence_time,
          analysis: generateAnalysis(outcome.name, game, outcome.price, ev, isHome)
        });
      }
    }
  }
  
  // Sort by EV descending
  allPicks.sort((a, b) => parseFloat(b.ev) - parseFloat(a.ev));
  
  // Return top 3
  return allPicks.slice(0, 3);
}

function generateAnalysis(team, game, odds, ev, isHome) {
  const location = isHome ? 'at home' : 'on the road';
  const evText = ev > 0 ? `+${(ev * 100).toFixed(1)}%` : `${(ev * 100).toFixed(1)}%`;
  
  if (ev > 0.05) {
    return `${team} ${location} showing positive expected value (${evText} EV). Market may be undervaluing ${isHome ? 'home court advantage' : 'their recent form'}. Worth a confident play.`;
  } else if (ev > 0) {
    return `${team} ${location} with slight edge (${evText} EV). Modest value play in a competitive spot.`;
  } else {
    return `${team} ${location}. Close to fair value but situational factors suggest minor edge.`;
  }
}

// Main execution
if (typeof window !== 'undefined') {
  window.generatePicks = generatePicks;
  window.fetchOdds = fetchOdds;
}

export { generatePicks, fetchOdds, calculateEV, impliedProbability };
