import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { loadCachedPicks, fetchAndCacheAllSports, timeSinceUpdate, getActiveSports } from '../lib/oddsApi';

const ODDS_API_KEY = '1ad6289c29935840d01c48d6e9438cb9';

export default function DailyPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bankroll, setBankroll] = useState(1000);
  const [unitSize, setUnitSize] = useState(50);
  const [apiCallsRemaining, setApiCallsRemaining] = useState(null);
  const [sportsChecked, setSportsChecked] = useState([]);
  const [manualFetchCount, setManualFetchCount] = useState(0);

  useEffect(() => {
    const savedBankroll = localStorage.getItem('bankroll');
    const savedUnit = localStorage.getItem('unitSize');
    const savedFetchCount = localStorage.getItem('manualFetchCount');
    
    if (savedBankroll) setBankroll(parseFloat(savedBankroll));
    if (savedUnit) setUnitSize(parseFloat(savedUnit));
    if (savedFetchCount) setManualFetchCount(parseInt(savedFetchCount));
    
    // Load cached picks on mount
    loadPicks();
  }, []);

  function loadPicks() {
    const cached = loadCachedPicks();
    if (cached) {
      setPicks(cached.picks);
      setLastUpdated(cached.timestamp);
      setSportsChecked(cached.sportsChecked || []);
    } else {
      // No cached data yet
      setPicks([]);
      setLastUpdated(null);
    }
    setLoading(false);
  }

  async function manualRefresh() {
    // Warn about API usage
    if (manualFetchCount >= 3) {
      alert('Warning: You\'ve manually refreshed 3 times today. Each refresh uses API calls from your 500/month quota. The system auto-updates twice daily (10 AM and 5 PM).');
    }
    
    setLoading(true);
    try {
      const result = await fetchAndCacheAllSports(ODDS_API_KEY);
      setPicks(result.picks);
      setLastUpdated(result.timestamp);
      setSportsChecked(result.sportsChecked);
      
      // Track manual fetches
      const newCount = manualFetchCount + 1;
      setManualFetchCount(newCount);
      localStorage.setItem('manualFetchCount', newCount.toString());
    } catch (e) {
      console.error('Fetch error:', e);
      alert('Failed to fetch fresh data. Using cached picks if available.');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No data yet';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalRisk = picks.reduce((sum, p) => sum + (p.units * unitSize), 0);
  const activeSports = getActiveSports();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📋 Roci's Daily Picks</h1>
        <p style={{ color: '#666' }}>Auto-updates at 10 AM & 5 PM ET • {timeSinceUpdate(lastUpdated)}</p>
      </header>

      <Nav />

      {/* API Usage Warning */}
      <div style={{ 
        background: '#fff3e0', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <strong>📊 API Usage:</strong> Free tier = 500 requests/month. 
        System auto-fetches 8 sports × 2 times daily = ~480 requests/month. 
        Manual refreshes count against quota (used {manualFetchCount} today).
      </div>

      {/* Bankroll Status */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px'
      }}>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Bankroll</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>${bankroll.toFixed(2)}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Unit Size</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>${unitSize}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Today's Risk</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: totalRisk > unitSize * 3 ? '#f44336' : '#4caf50' }}>
            ${totalRisk.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Active Picks</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{picks.length}</p>
        </div>
      </div>

      {/* Sports Tracked */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
          <strong>Tracking {activeSports.length} sports:</strong> {activeSports.map(s => s.name).join(', ')}
        </p>
        {sportsChecked.length > 0 && (
          <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
            Last scan checked: {sportsChecked.join(', ')}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={manualRefresh}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#999' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : '🔄 Manual Refresh'}
        </button>
        <span style={{ color: '#666', fontSize: '12px' }}>
          Auto-refreshes: 10:00 AM & 5:00 PM ET
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Analyzing lines across {activeSports.length} sports...</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Calculating expected value and ranking plays</p>
        </div>
      ) : picks.length === 0 ? (
        <div style={{ 
          background: '#fff3e0', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h2>No picks available</h2>
          <p style={{ color: '#666' }}>
            The system updates automatically at 10 AM and 5 PM ET.<br/>
            Check back after the next scheduled update, or click Manual Refresh.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h2>Top Plays from {sportsChecked.length} Sports</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Auto-generated from DraftKings odds • Last updated: {formatDate(lastUpdated)}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {picks.map((pick, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${pick.confidence === 'high' ? '#4caf50' : pick.confidence === 'medium' ? '#ff9800' : '#f44336'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: pick.confidence === 'high' ? '#e8f5e9' : pick.confidence === 'medium' ? '#fff3e0' : '#ffebee',
                      color: pick.confidence === 'high' ? '#4caf50' : pick.confidence === 'medium' ? '#ff9800' : '#f44336',
                      marginBottom: '8px'
                    }}>
                      #{i + 1} {pick.sport} • {pick.confidence.toUpperCase()} CONFIDENCE
                    </span>
                    <h3 style={{ margin: '0 0 5px 0' }}>{pick.pick}</h3>
                    <p style={{ margin: 0, color: '#666' }}>{pick.game}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>
                      {pick.odds > 0 ? '+' : ''}{pick.odds}
                    </p>
                    <p style={{ margin: 0, color: '#666' }}>{pick.units} units</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#999' }}>
                      ${(pick.units * unitSize).toFixed(0)}
                    </p>
                    {pick.ev !== undefined && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: pick.ev > 0 ? '#4caf50' : '#666' }}>
                        EV: {(pick.ev * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ 
                  background: '#f5f5f5', 
                  padding: '15px', 
                  borderRadius: '6px',
                  marginTop: '15px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Analysis</h4>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{pick.analysis}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ 
        background: '#ffebee', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '30px' 
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Responsible Betting Reminder</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Only bet what you can afford to lose</li>
          <li>Set a stop-loss and stick to it</li>
          <li>Never chase losses</li>
          <li>Track every bet in the <a href="/tracker" style={{ color: '#2196f3' }}>Tracker</a></li>
          <li>If it's not fun, stop immediately</li>
        </ul>
      </div>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
        <p>🚀 Picks auto-generated via The Odds API • Live DraftKings lines</p>
        <p style={{ fontSize: '12px' }}>Not financial advice. For entertainment purposes only.</p>
      </footer>
    </div>
  );
}
