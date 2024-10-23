import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Param,
  Res,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, statSync } from 'fs';
import { console } from 'inspector';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          try {
            const fileNameWithoutSpaces = file.originalname.replace(
              /\s+/g,
              '_',
            );
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${fileNameWithoutSpaces.replace(ext, '')}-${uniqueSuffix}${ext}`;
            callback(null, filename);
          } catch (error) {
            callback(error, null);
          }
        },
      }),
    }),
  )
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new InternalServerErrorException(
        'File not provided or upload failed.',
      );
    }

    try {
      const savedFile = await this.fileService.salvarDados(file, req);
      return savedFile;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new InternalServerErrorException('Failed to save file data.');
    }
  }

  @Get('uploads/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', filename);
    try {
      const fileStats = statSync(filePath);
      if (fileStats.isFile()) {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`,
        );
        return createReadStream(filePath).pipe(res);
      } 
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new NotFoundException('File not found');
    }
  }

  @Post('suporte/update')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './print-suporte-files',
        filename: (req, file, callback) => {
          console.log('🚀 ~ FileController ~ req:', req);
          try {
            const fileNameWithoutSpaces = file.originalname.replace(
              /\s+/g,
              '_',
            );
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${fileNameWithoutSpaces.replace(ext, '')}-${uniqueSuffix}${ext}`;
            callback(null, filename);
          } catch (error) {
            callback(error, null);
          }
        },
      }),
    }),
  )
  async uploadSuporteFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new InternalServerErrorException(
        'File not provided or upload failed.',
      );
    }
    try {
      const savedFile = await this.fileService.salvarDados(file, req);
      console.log('File saved:', savedFile);
      return savedFile;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new InternalServerErrorException('Failed to save file data.');
    }
  }

  @Get('view/suporte/:filename')
  async viewFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return this.fileService.getFileSuporte(filename, res);
  }

  @Get('downloads/suporte/:filename')
  async downloadFileSuporte(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return this.fileService.downloadFileSuporte(filename, res);
  }

  @Post('test/suporte')
  async testSuporte(@Req() req: Request) {
    console.log('🚀 ~ FileController ~ req:', req);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const location = req.headers['cf-ipcountry'];
    console.log('🚀 ~ FileController ~ ip:', ip);
    console.log('🚀 ~ FileController ~ userAgent:', userAgent);
    console.log('🚀 ~ FileController ~ location:', location);
    return JSON.stringify({ ip, userAgent, location });
  }
  // visualização de arquivos pelo navegador pode ser adicionada aqui.
}
