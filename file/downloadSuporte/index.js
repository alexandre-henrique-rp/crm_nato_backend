import express from 'express';
import path from 'path';
import { existsSync, statSync } from 'fs';

const app = express();
const PORT = process.env.PORT || 3005;

// Rota para baixar o arquivo de suporte
app.get('/download/suporte/:filename', async (req, res) => {
  const filename = req.params.filename;
  await downloadFileSuporte(filename, res);
});

// Função para baixar o arquivo de suporte
async function downloadFileSuporte(filename, res) {
  const filePath = path.join('../suporteDocs', filename); //alterar a pasta aqui<-------------------

  try {
    // Verifica se o arquivo existe
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }

    const fileStats = statSync(filePath);
    if (!fileStats.isFile()) {
      return res.status(404).json({ message: 'Erro: O caminho não é um arquivo' });
    }

    // Faz o download do arquivo
    return res.download(filePath);
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error);
    return res.status(500).json({ message: 'Erro ao baixar o arquivo', error: error.message });
  }
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
