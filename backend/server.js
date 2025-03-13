const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Rota raiz para teste
app.get('/', (req, res) => {
  res.send('Backend está funcionando!');
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
        //fields: 'ad_creative_link_title,ad_creative_link_description',
        access_token: accessToken, // Token atualizado
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
