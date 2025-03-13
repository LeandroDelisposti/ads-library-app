import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    country: 'BR',
    adActiveStatus: 'ACTIVE',
    adType: 'ALL',
    adDeliveryDateMin: '',
    adDeliveryDateMax: '',
    mediaType: 'ALL',
    searchType: 'KEYWORD_UNORDERED',
    publisherPlatforms: 'ALL',
    languages: [],
    unmaskRemovedContent: false
  });
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (e, field) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setSearchParams(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/ads', {
        params: {
          ...searchParams,
          publisherPlatforms: JSON.stringify(searchParams.publisherPlatforms),
          languages: JSON.stringify(searchParams.languages)
        }
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
          <div className="error-message">{error}</div>
        )}
        
        <div className="search-form">
          <div className="form-group">
            <label>Termo de Busca:</label>
            <input
              type="text"
              name="searchTerm"
              value={searchParams.searchTerm}
              onChange={handleInputChange}
              placeholder="Digite uma palavra-chave"
            />
          </div>

          <div className="form-group">
            <label>País:</label>
            <select name="country" value={searchParams.country} onChange={handleInputChange}>
              <option value="BR">Brasil</option>
              <option value="US">Estados Unidos</option>
              {/* Add more countries as needed */}
            </select>
          </div>

          <div className="form-group">
            <label>Status do Anúncio:</label>
            <select name="adActiveStatus" value={searchParams.adActiveStatus} onChange={handleInputChange}>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
              <option value="ALL">Todos</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Anúncio:</label>
            <select name="adType" value={searchParams.adType} onChange={handleInputChange}>
              <option value="ALL">Todos</option>
              <option value="POLITICAL_AND_ISSUE_ADS">Político</option>
              <option value="HOUSING_ADS">Imóveis</option>
              <option value="EMPLOYMENT_ADS">Empregos</option>
              <option value="FINANCIAL_PRODUCTS_AND_SERVICES_ADS">Financeiro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Data Inicial:</label>
            <input
              type="date"
              name="adDeliveryDateMin"
              value={searchParams.adDeliveryDateMin}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Data Final:</label>
            <input
              type="date"
              name="adDeliveryDateMax"
              value={searchParams.adDeliveryDateMax}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Plataformas:</label>
            <select name="publisherPlatforms" value={searchParams.publisherPlatforms} onChange={handleInputChange}>
              <option value="ALL">Todos</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="MESSENGER">Messenger</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="AUDIENCE_NETWORK">Audience Network</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Mídia:</label>
            <select name="mediaType" value={searchParams.mediaType} onChange={handleInputChange}>
              <option value="ALL">Todos</option>
              <option value="IMAGE">Imagem</option>
              <option value="VIDEO">Vídeo</option>
              <option value="MEME">Meme</option>
              <option value="NONE">Nenhum</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="unmaskRemovedContent"
                checked={searchParams.unmaskRemovedContent}
                onChange={handleInputChange}
              />
              Mostrar Conteúdo Removido
            </label>
          </div>

          <button onClick={handleSearch} disabled={loading} className="search-button">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
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
