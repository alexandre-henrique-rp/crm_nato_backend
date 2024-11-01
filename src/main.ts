import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'; // Importação corrigida
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const Porta = process.env.NEST_PORT || 3000; // Adiciona um valor padrão para a porta
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Lança erro se houver propriedades não definidas
    transform: true // Converte automaticamente os tipos
  }));
  
  // Aumenta o limite do payload para 50MB
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(Porta, () => {
    console.log(` `);
    console.log(` `);
    console.log(` `);
    console.log(`Nest running on http://localhost:${Porta}`);
    console.log(` `);
  });
}
bootstrap();
