import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { getTrackedSports, getSportsScheduleInfo } from '../lib/oddsApi';

export default function DailyPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bankroll, setBankroll] = useState(1000);
  const [unitSize, setUnitSize] = useState(50);
  const [sportsChecked, setSportsChecked] = useState([]);
  const [trackedSports, setTrackedSports] = useState([]);

  useEffect(() => {
    const savedBankroll = localStorage.getItem('bankroll');
    const savedUnit = localStorage.getItem('unitSize');
    if (savedBankroll) setBankroll(parseFloat(savedBankroll));
    if (savedUnit) setUnitSize(parseFloat(savedUnit));
    
    // Set tracked sports for display
    setTrackedSports(getTrackedSports());
    
    loadPicks();
  }, []);

  async function loadPicks() {
    setLoading(true);
    try {
      // Fetch from static JSON file (updated by cron job)
      const response = await fetch('/data/picks.json');
      if (response.ok) {
        const data = await response.json();
        setPicks(data.picks || []);
        setLastUpdated(data.timestamp);
        setSportsChecked(data.sportsChecked || []);
      } else {
        // Fallback to localStorage cache
        const cached = localStorage.getItem('cachedPicks');
        if (cached) {
          const data = JSON.parse(cached);
          setPicks(data.picks || []);
          setLastUpdated(data.timestamp);
          setSportsChecked(data.sportsChecked || []);
        }
      }
    } catch (e) {
      console.error('Failed to load picks:', e);
      setPicks([]);
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

  const timeSince = (dateStr) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    if (mins < 5) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours/24)}d ago`;
  };

  const totalRisk = picks.reduce((sum, p) => sum + (p.units * unitSize), 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📋 Roci's Daily Picks</h1>
        <p style={{ color: '#666' }}>Auto-updates at 10 AM & 5 PM ET • {timeSince(lastUpdated)}</p>
      </header>

      <Nav />

      {/* API Info & Tracked Sports */}
      <div style={{ 
        background: '#e8f5e9', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <strong>✅ System Optimized:</strong> Fetches 8 sports × 2× daily = ~480 API calls/month (within 500 free tier limit). 
        Data refreshes automatically at 10:00 AM and 5:00 PM ET.
        
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #c8e6c9' }}>
          <strong>Currently Tracking ({trackedSports.length} sports):</strong>{' '}
          {trackedSports.map((s, i) => (
            <span key={s.key}>
              {s.name}{i < trackedSports.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
          Sports rotate based on season. Priority: NBA, NHL, NCAAB, Soccer, Tennis, MLB, Football (when active), with alternates filling gaps.
        </p>
      </div>

      {/* Bankroll */}
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
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Risk Today</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: totalRisk > unitSize * 3 ? '#f44336' : '#4caf50' }}>
            ${totalRisk.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Picks</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{picks.length}</p>
        </div>
      </div>

      {sportsChecked.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
            <strong>Analyzed {sportsChecked.length} sports:</strong> {sportsChecked.join(', ')}
          </p>
          <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
            Last updated: {formatDate(lastUpdated)}
          </p>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading picks...</p>
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
            System updates at 10:00 AM and 5:00 PM ET daily.<br/>
            Check back after the next scheduled update.
          </p>
        </div>
      ) : (
        <>
          <h2>Top Value Plays</h2>
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
                      #{i + 1} {pick.sport} • {pick.confidence.toUpperCase()}
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

                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px', marginTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Analysis</h4>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{pick.analysis}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ background: '#ffebee', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Responsible Betting</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Only bet what you can afford to lose</li>
          <li>Track every bet in the <a href="/tracker" style={{ color: '#2196f3' }}>Tracker</a></li>
          <li>Set a stop-loss and stick to it</li>
        </ul>
      </div>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
        <p>🚀 Auto-generated via The Odds API • DraftKings lines • Updates 2× daily</p>
        <p style={{ fontSize: '12px' }}>Not financial advice. For entertainment purposes only.</p>
      </footer>
    </div>
  );
}
