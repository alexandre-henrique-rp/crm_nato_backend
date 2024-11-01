import express from 'express';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configurações do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  destination: '../arquivos',
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

// Define os tipos MIME permitidos
const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const upload = multer({ storage });

const fileService = {
  salvarDados: async (file, req) => {
    const fileUrl = `${req.protocol}://${req.get('host')}/files/download/${file.filename}`;
    
    return {
      fileName: file.filename,
      contentLength: file.size,
      contentType: file.mimetype,
      url: fileUrl,
    };
  },
};

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  // Verifica se o arquivo é válido
  if (!file || !allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only JPEG, PNG, or PDF files are allowed.',
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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
