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
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Busca de Anúncios do Facebook</h1>
      <div className="search-container">
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
        </select>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div className="ads-container">
        {ads.map((ad, index) => (
          <div key={index} className="ad-card">
            {/* Ad Image Section */}
            <div className="ad-image">
              <img 
                  src={ad.ad_creative_images?.[0]}
                  alt={ad.ad_creative_link_captions?.[0] || 'Ad image'}
              />
            </div>

            {/* Ad Content Section */}
            <div className="ad-content">
              <h3>{ad.ad_creative_link_captions?.[0] || 'Untitled Ad'}</h3>
              <p className="ad-message">{ad.ad_creative_bodies?.[0]}</p>
              <p className="ad-description">{ad.ad_creative_link_descriptions?.[0]}</p>
              
              {/* Ad Details Section */}
              <div className="ad-details">
                <p><strong>Page:</strong> {ad.page_name}</p>
                <p><strong>Platform:</strong> {ad.publisher_platforms?.join(', ')}</p>
                
                {/* Timing Information */}
                <p><strong>Start Date:</strong> {new Date(ad.ad_delivery_start_time).toLocaleDateString()}</p>
                {ad.ad_delivery_stop_time && (
                  <p><strong>End Date:</strong> {new Date(ad.ad_delivery_stop_time).toLocaleDateString()}</p>
                )}

                {/* Targeting Information */}
                {ad.target_gender && (
                  <p><strong>Target Gender:</strong> {ad.target_gender}</p>
                )}
                {ad.target_ages && (
                  <p><strong>Target Age Range:</strong> {ad.target_ages}</p>
                )}
                {ad.target_locations && (
                  <p><strong>Target Locations:</strong> {
                    Array.isArray(ad.target_locations) 
                      ? ad.target_locations.map(loc => loc.name).join(', ')
                      : ad.target_locations
                  }</p>
                )}
                
                {/* Performance Metrics */}
                {ad.estimated_audience_size && (
                  <p><strong>Estimated Audience:</strong> {
                    typeof ad.estimated_audience_size === 'object'
                      ? `${ad.estimated_audience_size.lower_bound} - ${ad.estimated_audience_size.upper_bound}`
                      : ad.estimated_audience_size
                  }</p>
                )}
                {ad.spend && (
                  <p><strong>Spend Range:</strong> {`${ad.spend.lower_bound} - ${ad.spend.upper_bound} ${ad.spend.currency}`}</p>
                )}
                {ad.impressions && (
                  <p><strong>Impressions:</strong> {
                    typeof ad.impressions === 'object'
                      ? `${ad.impressions.lower_bound} - ${ad.impressions.upper_bound}`
                      : ad.impressions
                  }</p>
                )}

                {/* Regional Distribution */}
                {ad.delivery_by_region && ad.delivery_by_region.length > 0 && (
                  <p><strong>Top Regions:</strong> {
                    ad.delivery_by_region
                      .slice(0, 3)
                      .map(region => `${region.region}: ${region.percentage}%`)
                      .join(', ')
                  }</p>
                )}
              </div>

              {/* Ad Links Section */}
              <div className="ad-links">
                {ad.ad_data?.link_url && (
                  <a href={ad.ad_data.link_url} target="_blank" rel="noopener noreferrer" className="ad-link">
                    Visit Website
                  </a>
                )}
                <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer" className="ad-link">
                  View on Facebook
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
