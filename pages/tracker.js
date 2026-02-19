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
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📊 Bet Tracker</h1>
        <p style={{ color: '#666' }}>Log every bet. Track performance. Find your edge.</p>
      </header>

      <Nav />

      {/* Stats Overview */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Total Bets</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{completedBets.length}</p>
        </div>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Win Rate</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{winRate}%</p>
        </div>
        <div style={{ background: totalProfit >= 0 ? '#e8f5e9' : '#ffebee', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Total Profit</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: totalProfit >= 0 ? '#4caf50' : '#f44336' }}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>
        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>ROI</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{roi}%</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showForm ? 'Cancel' : '+ Log New Bet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sport</label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData({...formData, sport: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select...</option>
                <option value="NFL">NFL</option>
                <option value="NBA">NBA</option>
                <option value="MLB">MLB</option>
                <option value="NHL">NHL</option>
                <option value="Soccer">Soccer</option>
                <option value="Tennis">Tennis</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Game/Matchup</label>
              <input
                type="text"
                placeholder="e.g., Chiefs vs Eagles"
                value={formData.game}
                onChange={(e) => setFormData({...formData, game: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Pick</label>
              <input
                type="text"
                placeholder="e.g., Chiefs -3"
                value={formData.pick}
                onChange={(e) => setFormData({...formData, pick: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Odds</label>
              <input
                type="number"
                placeholder="-110 or +150"
                value={formData.odds}
                onChange={(e) => setFormData({...formData, odds: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bet Amount ($)</label>
              <input
                type="number"
                placeholder="50"
                value={formData.betAmount}
                onChange={(e) => setFormData({...formData, betAmount: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Result</label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({...formData, result: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="pending">Pending</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="push">Push</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Save Bet
          </button>
        </form>
      )}

      {/* Bet History */}
      <h2>Bet History</h2>
      {bets.length === 0 ? (
        <p style={{ color: '#999', fontStyle: 'italic' }}>No bets logged yet. Start tracking!</p>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {bets.map(bet => (
            <div key={bet.id} style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>{bet.date}</span>
                  <span style={{ fontSize: '12px', background: '#e3f2fd', padding: '2px 8px', borderRadius: '4px' }}>{bet.sport}</span>
                </div>
                <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>{bet.game}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{bet.pick} @ {bet.odds > 0 ? '+' : ''}{bet.odds}</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>${bet.betAmount}</p>
                {bet.result !== 'pending' && (
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: bet.profit > 0 ? '#4caf50' : bet.profit < 0 ? '#f44336' : '#666',
                    fontWeight: 'bold'
                  }}>
                    {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '5px' }}>
                {bet.result === 'pending' ? (
                  <>
                    <button onClick={() => updateResult(bet.id, 'win')} style={{
                      padding: '6px 12px',
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Win
                    </button>
                    <button onClick={() => updateResult(bet.id, 'loss')} style={{
                      padding: '6px 12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Loss
                    </button>
                  </>
                ) : (
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: bet.result === 'win' ? '#e8f5e9' : bet.result === 'loss' ? '#ffebee' : '#f5f5f5',
                    color: bet.result === 'win' ? '#4caf50' : bet.result === 'loss' ? '#f44336' : '#666'
                  }}>
                    {bet.result.toUpperCase()}
                  </span>
                )}
                <button onClick={() => deleteBet(bet.id)} style={{
                  padding: '6px 12px',
                  background: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
        <p>🚀 Bet tracking by Roci</p>
      </footer>
    </div>
  );
}
