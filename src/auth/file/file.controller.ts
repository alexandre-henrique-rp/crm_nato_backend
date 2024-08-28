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

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          try {
            const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${fileNameWithoutSpaces.replace(ext, '')}-${uniqueSuffix}${ext}`;
            callback(null, filename);
          } catch (error) {
            callback(error, null);
          }
        },
      }),
    })
  )
  async uploadSingleFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new InternalServerErrorException('File not provided or upload failed.');
    }

    try {
      const savedFile = await this.fileService.salvarDados(file, req);
      // console.log('File saved:', savedFile);
      return savedFile;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new InternalServerErrorException('Failed to save file data.');
    }
  }

  @Get('uploads/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);

    try {
      const fileStats = statSync(filePath);
      if (fileStats.isFile()) {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return createReadStream(filePath).pipe(res);
      } else {
        throw new NotFoundException('File not found');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new NotFoundException('File not found');
    }
  }

  // visualização de arquivos pelo navegador pode ser adicionada aqui.
}
