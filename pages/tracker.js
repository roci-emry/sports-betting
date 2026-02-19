import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function Tracker() {
  const [bets, setBets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sport: '',
    game: '',
    pick: '',
    odds: '',
    betAmount: '',
    result: 'pending'
  });

  useEffect(() => {
    const saved = localStorage.getItem('bets');
    if (saved) setBets(JSON.parse(saved));
  }, []);

  const saveBets = (newBets) => {
    setBets(newBets);
    localStorage.setItem('bets', JSON.stringify(newBets));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBet = {
      id: Date.now(),
      ...formData,
      odds: parseFloat(formData.odds),
      betAmount: parseFloat(formData.betAmount),
      profit: formData.result === 'win' ? calculateProfit(formData.odds, formData.betAmount) : 
              formData.result === 'loss' ? -parseFloat(formData.betAmount) : 0
    };
    saveBets([newBet, ...bets]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      sport: '',
      game: '',
      pick: '',
      odds: '',
      betAmount: '',
      result: 'pending'
    });
    setShowForm(false);
  };

  const calculateProfit = (odds, amount) => {
    const bet = parseFloat(amount);
    if (odds > 0) return bet * (odds / 100);
    return bet * (100 / Math.abs(odds));
  };

  const updateResult = (id, result) => {
    const updated = bets.map(bet => {
      if (bet.id === id) {
        const profit = result === 'win' ? calculateProfit(bet.odds, bet.betAmount) : 
                      result === 'loss' ? -bet.betAmount : 0;
        return { ...bet, result, profit };
      }
      return bet;
    });
    saveBets(updated);
  };

  const deleteBet = (id) => {
    if (confirm('Delete this bet?')) {
      saveBets(bets.filter(b => b.id !== id));
    }
  };

  // Stats
  const completedBets = bets.filter(b => b.result !== 'pending');
  const wins = completedBets.filter(b => b.result === 'win').length;
  const losses = completedBets.filter(b => b.result === 'loss').length;
  const winRate = completedBets.length > 0 ? (wins / completedBets.length * 100).toFixed(1) : 0;
  const totalProfit = completedBets.reduce((sum, b) => sum + b.profit, 0);
  const totalBet = completedBets.reduce((sum, b) => sum + b.betAmount, 0);
  const roi = totalBet > 0 ? (totalProfit / totalBet * 100).toFixed(1) : 0;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#0a0e27',
      minHeight: '100vh',
      color: '#ccd6f6'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <header style={{ 
          borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
          paddingBottom: '30px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00f3ff 0%, #0066ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ◈
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '32px',
                fontWeight: '700',
                background: 'linear-gradient(90deg, #00f3ff, #0066ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                ROCi SPORTS
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#8892b0', fontSize: '14px', fontFamily: 'monospace' }}>
                BET TRACKER & ANALYTICS
              </p>
            </div>
          </div>
        </header>

        <Nav />

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'TOTAL BETS', value: completedBets.length, color: '#00f3ff' },
            { label: 'WIN RATE', value: `${winRate}%`, color: '#64ffda' },
            { label: 'PROFIT', value: `$${totalProfit.toFixed(2)}`, color: totalProfit >= 0 ? '#00f3ff' : '#e94560' },
            { label: 'ROI', value: `${roi}%`, color: roi >= 0 ? '#64ffda' : '#e94560' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(10, 25, 47, 0.7)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(0, 243, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${stat.color}, transparent)`
              }} />
              <p style={{ 
                margin: '0 0 8px 0', 
                color: '#8892b0', 
                fontSize: '10px',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                {stat.label}
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '22px', 
                fontWeight: '700',
                color: stat.color,
                fontFamily: 'monospace'
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '14px 28px',
              background: showForm ? 'rgba(233, 69, 96, 0.2)' : 'linear-gradient(90deg, #00f3ff, #0066ff)',
              color: showForm ? '#e94560' : '#0a0e27',
              border: showForm ? '1px solid rgba(233, 69, 96, 0.5)' : 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'monospace',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            {showForm ? 'Cancel' : '+ Log New Bet'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ccd6f6',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({...formData, sport: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ccd6f6',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select...</option>
                  <option value="NBA">NBA</option>
                  <option value="NHL">NHL</option>
                  <option value="NCAAB">NCAAB</option>
                  <option value="NFL">NFL</option>
                  <option value="EPL">EPL</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>Game</label>
                <input
                  type="text"
                  placeholder="e.g., Chiefs vs Eagles"
                  value={formData.game}
                  onChange={(e) => setFormData({...formData, game: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ccd6f6',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>Pick</label>
                <input
                  type="text"
                  placeholder="e.g., Chiefs -3"
                  value={formData.pick}
                  onChange={(e) => setFormData({...formData, pick: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ccd6f6',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>Odds</label>
                <input
                  type="number"
                  placeholder="-110 or +150"
                  value={formData.odds}
                  onChange={(e) => setFormData({...formData, odds: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ccd6f6',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>Bet Amount ($)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={formData.betAmount}
                  onChange={(e) => setFormData({...formData, betAmount: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ccd6f6',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <button type="submit" style={{
              marginTop: '20px',
              padding: '14px 28px',
              background: 'linear-gradient(90deg, #00f3ff, #0066ff)',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'monospace',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Save Bet
            </button>
          </form>
        )}

        {/* Bet History */}
        <h2 style={{ 
          color: '#ccd6f6',
          fontSize: '14px',
          fontFamily: 'monospace',
          letterSpacing: '2px',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          Bet History
        </h2>
        
        {bets.length === 0 ? (
          <div style={{
            background: 'rgba(10, 25, 47, 0.5)',
            padding: '40px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.1)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#00f3ff', fontSize: '18px' }}>NO BETS LOGGED</p>
            <p style={{ color: '#8892b0', fontSize: '14px' }}>Start tracking your wagers</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {bets.map(bet => (
              <div key={bet.id} style={{
                background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 243, 255, 0.1)',
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '15px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', color: '#8892b0', fontFamily: 'monospace' }}>{bet.date}</span>
                    <span style={{ fontSize: '11px', background: 'rgba(0, 243, 255, 0.1)', padding: '3px 8px', borderRadius: '4px', color: '#00f3ff', fontFamily: 'monospace' }}>{bet.sport}</span>
                  </div>
                  <p style={{ margin: '0 0 3px 0', fontWeight: '600', color: '#ccd6f6' }}>{bet.game}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#8892b0' }}>{bet.pick} @ {bet.odds > 0 ? '+' : ''}{bet.odds}</p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#ccd6f6', fontFamily: 'monospace' }}>${bet.betAmount}</p>
                  {bet.result !== 'pending' && (
                    <p style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      color: bet.profit > 0 ? '#00f3ff' : bet.profit < 0 ? '#e94560' : '#8892b0',
                      fontWeight: '600',
                      fontFamily: 'monospace'
                    }}>
                      {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {bet.result === 'pending' ? (
                    <>
                      <button onClick={() => updateResult(bet.id, 'win')} style={{
                        padding: '8px 14px',
                        background: 'rgba(0, 243, 255, 0.2)',
                        color: '#00f3ff',
                        border: '1px solid rgba(0, 243, 255, 0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        WIN
                      </button>
                      <button onClick={() => updateResult(bet.id, 'loss')} style={{
                        padding: '8px 14px',
                        background: 'rgba(233, 69, 96, 0.2)',
                        color: '#e94560',
                        border: '1px solid rgba(233, 69, 96, 0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        LOSS
                      </button>
                    </>
                  ) : (
                    <span style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      background: bet.result === 'win' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(233, 69, 96, 0.1)',
                      color: bet.result === 'win' ? '#00f3ff' : '#e94560',
                      border: `1px solid ${bet.result === 'win' ? 'rgba(0, 243, 255, 0.3)' : 'rgba(233, 69, 96, 0.3)'}`
                    }}>
                      {bet.result.toUpperCase()}
                    </span>
                  )}
                  <button onClick={() => deleteBet(bet.id)} style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    color: '#8892b0',
                    border: '1px solid rgba(136, 146, 176, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer style={{ 
          borderTop: '1px solid rgba(0, 243, 255, 0.1)',
          paddingTop: '30px',
          marginTop: '40px',
          color: '#8892b0',
          fontSize: '12px',
          fontFamily: 'monospace',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>◈ ROCi SPORTS INTELLIGENCE ◈</p>
          <p style={{ margin: 0, opacity: 0.6 }}>Track. Analyze. Improve.</p>
        </footer>
      </div>
    </div>
  );
}
