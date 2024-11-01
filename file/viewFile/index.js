import express from 'express';
import path from 'path';
import { existsSync, statSync } from 'fs';

const app = express();
const PORT = process.env.PORT || 3004;

// Rota para visualizar o arquivo de suporte
app.get('/files/view/:filename', async (req, res) => {
  const filename = req.params.filename;
  await getFileSuporte(filename, res);
});

// Função para obter o arquivo de suporte
async function getFileSuporte(filename, res) {
  const filePath = path.join('../arquivos', filename); // Caminho atualizado

  try {
    // Verifica se o arquivo existe
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }

    const fileStats = statSync(filePath);
    if (!fileStats.isFile()) {
      return res.status(404).json({ message: 'Erro: O caminho não é um arquivo' });
    }

    // Envia o arquivo para o cliente se ele existir
    return res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao exibir arquivo:', error);
    return res.status(500).json({ message: 'Erro ao exibir o arquivo', error: error.message });
  }
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
