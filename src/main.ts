import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './configs/env.config'
import { AllExceptionsFilter } from './allExceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Документація до NestJS API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);
  await app.listen(config.port || 3000)
}
bootstrap()
