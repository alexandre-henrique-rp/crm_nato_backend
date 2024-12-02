import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'; // Importação corrigida
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const Porta = process.env.NEST_PORT || 3000; // Adiciona um valor padrão para a porta
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sis Nato Api')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Lança erro se houver propriedades não definidas
      transform: true, // Converte automaticamente os tipos
    }),
  );

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
