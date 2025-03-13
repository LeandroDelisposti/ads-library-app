import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('BR');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/ads', {
        params: { searchTerm, country },
      });
      setAds(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
      const errorMessage = error.response?.data?.error?.message || 'Erro ao buscar anúncios. Tente novamente.';
      setError(errorMessage);
      setAds([]); // Clear ads on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Busca de Anúncios do Facebook</h1>
      <div>
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Digite uma palavra-chave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="BR">Brasil</option>
          <option value="US">Estados Unidos</option>
          {/* Adicione mais países conforme necessário */}
        </select>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div className="ads-container">
        {ads.map((ad, index) => (
          <div key={index} className="ad-card">
            <h3>{ad.ad_creative_link_title}</h3>
            <p>{ad.ad_creative_body}</p>
            <p>{ad.ad_creative_link_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
