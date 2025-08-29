import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../configs/env.config';
import { JwtStrategy } from './jwt-strategy/jwt.strategy';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [JwtModule.register({
    secret: config.jwt_secret,
    signOptions: { expiresIn: '14d' }
  }), DrizzleModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}