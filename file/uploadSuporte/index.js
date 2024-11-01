import express from 'express';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs'; // Importa o módulo fs para manipulação de arquivos

dotenv.config();

const app = express();

// Configurações do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  destination: '../suporteDocs', //alterar a pasta aqui<-------------------
  filename: (_req, file, callback) => {
    try {
      const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `${fileNameWithoutSpaces.replace(ext, '')}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    } catch (error) {
      callback(error, null);
    }
  },
});

// Tipos MIME permitidos
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const upload = multer({ storage });

// Serviço para salvar dados do arquivo
const fileService = {
  salvarDados: async (file, req) => {
    if (!file) {
      throw new Error('File not provided or upload failed.');
    }
    
    // Cria a URL para acessar o arquivo
    const fileUrl = `${req.protocol}://localhost:3005/download/suporte/${file.filename}`;
    const viewUrl = `${req.protocol}://localhost:3007/view/suporte/${file.filename}`;

    return {
      message: 'File saved successfully',
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      url: fileUrl,
      viewUrl: viewUrl,
      contentLength: file.size,
      contentType: file.mimetype,
    };
  },
};

// Rota para upload de arquivos
app.post('/upload/suporte', upload.single('file'), async (req, res) => {
  const file = req.file;
  console.log("🚀 ~ app.post ~ file:", file)

  // Verifica se o arquivo é válido
  if (!file || !allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.',
    });
  }

  try {
    const savedFile = await fileService.salvarDados(file, req);
    res.status(200).json(savedFile);
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ message: 'Failed to save file data.' });
  }
});

// Rota para deletar arquivos
app.delete('/delete/suporte/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join('../suporteDocs', filename);

  // Verifica se o arquivo existe
  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found.' });
      }
      return res.status(500).json({ message: 'Error checking file.' });
    }

    // Deleta o arquivo
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to delete file.' });
      }
      res.status(200).json({ message: 'File deleted successfully.' });
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
