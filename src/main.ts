import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const Porta = process.env.NEST_PORT;
  const app = await NestFactory.create(AppModule);
  await app.listen(Porta, () => {
    console.log(``);
    console.log(``);
    console.log(``);
    console.log(`Nest running on http://localhost:${Porta}`);
    console.log(``);
  });
}
bootstrap();
