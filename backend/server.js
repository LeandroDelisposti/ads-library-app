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

// Rota para buscar anúncios
app.get('/api/ads', async (req, res) => {
  const { searchTerm, country } = req.query;
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
    const response = await axios.get(`https://graph.facebook.com/v22.0/ads_archive?ad_reached_countries=${country}&search_terms=${searchTerm}`, {
      params: {
        search_terms: searchTerm,
        ad_reached_countries: country,
        access_token: accessToken, // Token atualizado
        fields: [
          'ad_data',                    // contains creative elements
          'page_name',                  // page name
          'page_id',                    // page id
          'publisher_platforms',        // platforms where the ad appears
          'ad_delivery_start_time',     // start time
          'ad_delivery_stop_time',      // end time
          'ad_snapshot_url',            // ad link
          'id',                         // ad id
          'delivery_by_region',         // regional delivery info
          'demographic_distribution',   // demographic info
          'impressions',                // impression data
          'spend',                      // spending info
          'estimated_audience_size',
          'target_locations',
          'target_gender',
          'target_ages',
          'ad_creative_link_descriptions',
          'ad_creative_link_captions',
          'ad_creative_bodies',
          'ad_creative_link_titles'
        ].join(','),
      },
    });

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
