import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface Player {
  id: number;
  name: string;
  place: string;
  age: number;
  gender: string;
  highScore: number;
  createdAt: string;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get<Player[]>('/api/players');
      setPlayers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch players');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    try {
      await axios.delete(`/api/players/${id}`);
      setPlayers(players.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete player');
    }
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.place?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPlayers = players.length;
  const totalHighScore = players.reduce((sum, p) => sum + p.highScore, 0);
  const avgScore = totalPlayers > 0 ? Math.round(totalHighScore / totalPlayers) : 0;
  const topPlayer = players.reduce((max, p) => p.highScore > max.highScore ? p : max, players[0] || { highScore: 0 });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>🎈 Admin Dashboard</h1>
          <p>Balloon Pop Game Management</p>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{totalPlayers}</div>
            <div className="stat-label">Total Players</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{avgScore}</div>
            <div className="stat-label">Avg Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">{topPlayer?.highScore || 0}</div>
            <div className="stat-label">Top Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-info">
            <div className="stat-value">{topPlayer?.name || 'N/A'}</div>
            <div className="stat-label">Top Player</div>
          </div>
        </div>
      </div>

      <div className="players-section">
        <div className="section-header">
          <h2>Players List</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="table-container">
            <table className="players-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Place</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>High Score</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                      No players found
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player) => (
                    <tr key={player.id}>
                      <td>{player.id}</td>
                      <td className="player-name">{player.name}</td>
                      <td>{player.place || '-'}</td>
                      <td>{player.age || '-'}</td>
                      <td>{player.gender || '-'}</td>
                      <td className="high-score">{player.highScore}</td>
                      <td>{new Date(player.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
