import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor() { }

  async salvarDados(file: Express.Multer.File, req: Request) {
    if (!file) {
      throw new Error('File not provided or upload failed.');
    }

    // Cria a URL para acessar o arquivo
    const fileUrl = `${req.protocol}://${req.get('host')}/file/uploads/${file.filename}`;

    return {
      fileName: file.filename,
      contentLength: file.size,
      contentType: file.mimetype,
      url: fileUrl,
    };
  }

  async getFile(filename: string): Promise<string> {
    const filePath = path.join(__dirname, '../../uploads', filename);


    try {
      await fs.access(filePath); // Verifica se o arquivo existe
      return filePath; // Retorna o caminho do arquivo se existir
    } catch (error) {
      console.error('Error accessing file:', error);
      throw new NotFoundException(`File not found: ${filename}`);
    }
  }
}
