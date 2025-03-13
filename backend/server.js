const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Rota raiz para teste
app.get('/ping', (req, res) => {
  res.send('Pong');
});

// Add parameter validation helper
const validateParams = (param, allowedValues) => {
  return allowedValues.includes(param);
};

// Rota para buscar anúncios
app.get('/api/ads', async (req, res) => {
  const {
    searchTerm,
    country,
    adActiveStatus = 'ACTIVE',
    adDeliveryDateMax,
    adDeliveryDateMin,
    adType = 'ALL',
    bylines,
    deliveryByRegion,
    estimatedAudienceSizeMax,
    estimatedAudienceSizeMin,
    languages,
    mediaType = 'ALL',
    publisherPlatforms,
    searchPageIds,
    searchType = 'KEYWORD_UNORDERED',
    unmaskRemovedContent = false
  } = req.query;

  const accessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

  console.log('Parâmetros recebidos:', { searchTerm, country });

  if (!accessToken) {
    return res.status(500).json({
      error: {
        message: "Facebook Access Token não está definido nas variáveis de ambiente."
      }
    });
  }

  try {
    // Build query parameters
    const params = {
      access_token: accessToken,
      search_terms: searchTerm,
      ad_reached_countries: country,
      ad_active_status: adActiveStatus,
      ad_type: adType,
      search_type: searchType,
      unmask_removed_content: unmaskRemovedContent,
      fields: [
        'ad_data',
        'page_name',
        'page_id',
        'publisher_platforms',
        'ad_delivery_start_time',
        'ad_delivery_stop_time',
        'ad_snapshot_url',
        'id',
        'delivery_by_region',
        'demographic_distribution',
        'impressions',
        'spend',
        'estimated_audience_size',
        'target_locations',
        'target_gender',
        'target_ages',
        'ad_creative_link_descriptions',
        'ad_creative_link_captions',
        'ad_creative_bodies',
        'ad_creative_link_titles',
        'media_type',
        'languages'
      ].join(','),
    };

    // Add optional parameters if they exist
    if (adDeliveryDateMax) params.ad_delivery_date_max = adDeliveryDateMax;
    if (adDeliveryDateMin) params.ad_delivery_date_min = adDeliveryDateMin;
    if (bylines) params.bylines = JSON.parse(bylines);
    if (deliveryByRegion) params.delivery_by_region = JSON.parse(deliveryByRegion);
    if (estimatedAudienceSizeMax) params.estimated_audience_size_max = parseInt(estimatedAudienceSizeMax);
    if (estimatedAudienceSizeMin) params.estimated_audience_size_min = parseInt(estimatedAudienceSizeMin);
    if (languages) params.languages = JSON.parse(languages);
    if (mediaType) params.media_type = mediaType;
    if (publisherPlatforms) params.publisher_platforms = JSON.parse(publisherPlatforms);
    if (searchPageIds) params.search_page_ids = JSON.parse(searchPageIds);

    const response = await axios.get(`https://graph.facebook.com/v22.0/ads_archive`, { params });
    console.log('Resposta da API do Facebook:', response.data);
    res.json(response.data);
  }
  catch (error) {
    console.error('Erro na requisição:', error.message);
    if (error.response) {
      console.error('Resposta do erro:', error.response.data);
      return res.status(error.response.status || 400).json(error.response.data);
    }
    return res.status(500).json({
      error: {
        message: error.message || 'Erro interno do servidor'
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
