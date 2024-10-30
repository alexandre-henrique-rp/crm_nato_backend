import dotenv from 'dotenv';
import express from 'express';
import { existsSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/view/suporte/:filename', async (req, res) => {
    const fileName = req.params.filename;
    await getSuporteFile(fileName, res);
});

async function getSuporteFile(fileName, res) {
    const filePath = path.resolve(__dirname, '../suporteDocs/', fileName);

    try {
        if (!existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = statSync(filePath);
        if (!file.isFile()) {
            return res.status(404).json({ error: 'File not found' });
        }

        return res.sendFile(filePath);
    } catch (error) {
        console.error('Erro ao exibir arquivo:', error);
        return res.status(500).json({ message: 'Erro ao exibir o arquivo', error: error.message });
    }
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
