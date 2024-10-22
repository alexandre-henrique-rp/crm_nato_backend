import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { createReadStream, existsSync, promises as fs, statSync } from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor() {}

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

  // async getFile(filename: string): Promise<string> {
  //   const filePath = path.join(__dirname, '../../uploads', filename);
  //   try {
  //     await fs.access(filePath); // Verifica se o arquivo existe
  //     return filePath; // Retorna o caminho do arquivo se existir
  //   } catch (error) {
  //     console.error('Error accessing file:', error);
  //     throw new NotFoundException(`File not found: ${filename}`);
  //   }
  // }

  //suporte

  //salvar imagem de suporte

  /**
   * Salva uma imagem de suporte no servidor.
   *
   * @param file Imagem a ser salva.
   * @param req Requeste do HTTP.
   * @returns Um objeto com informa es sobre o arquivo salvo.
   * @throws {Error} Se n o houver imagem para ser salva.
   */
  async salvarImgSuporte(file: Express.Multer.File, req: Request) {
    if (!file) {
      throw new Error('File not provided or upload failed.');
    }
    // Cria a URL para acessar o arquivo
    const fileUrl = `${req.protocol}://${req.get('host')}/file/uploads/suporte/${file.filename}`;

    return {
      fileName: file.filename,
      contentLength: file.size,
      contentType: file.mimetype,
      url: fileUrl,
    };
  }

  //view imagem de suporte
  /**
   * Retorna um arquivo de suporte que est  salvo no servidor.
   *
   * @param filename Nome do arquivo a ser retornado.
   * @param res Resposta do HTTP.
   * @throws {NotFoundException} Se o arquivo n o existir.
   * @throws {NotFoundException} Se houver um erro ao enviar o arquivo.
   */
  async getFileSuporte(filename: string, res: Response) {
    const filePath = path.join(process.cwd(), 'print-suporte-files', filename);

    try {
      // Verifica se o arquivo existe
      if (!existsSync(filePath)) {
        throw new NotFoundException('Arquivo não encontrado');
      }

      const fileStats = statSync(filePath);
      if (fileStats.isFile()) {
        // Envia o arquivo para o cliente se ele existir
        return res.sendFile(filePath);
      } else {
        throw new NotFoundException('Erro ao mostrar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao exibir arquivo:', error);
      throw new NotFoundException('Erro', error.message);
    }
  }

  //download imagem de suporte

  /**
   * Retorna um arquivo de suporte que est  salvo no servidor.
   *
   * @param filename Nome do arquivo a ser retornado.
   * @param res Resposta do HTTP.
   * @throws {NotFoundException} Se o arquivo n o existir.
   * @throws {NotFoundException} Se houver um erro ao enviar o arquivo.
   */
  async downloadFileSuporte(filename: string, res: Response) {
    const filePath = path.join(process.cwd(), 'print-suporte-files', filename);

    try {
      // Verifica se o arquivo existe
      if (!existsSync(filePath)) {
        throw new NotFoundException('Arquivo não encontrado');
      }
      const fileStats = statSync(filePath);
      if (fileStats.isFile()) {
        // Envia o arquivo para o cliente se ele existir
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`,
        );
        return createReadStream(filePath).pipe(res);
      } else {
        throw new NotFoundException('Erro ao baixar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao exibir arquivo:', error);
      throw new NotFoundException('Erro', error.message);
    }
  }
}
