import { Body, Controller, Post, Res, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ZodValidationPipe } from '../pipes/zodValidation.pipe';
import { registerSchema, RegisterZodDto } from './dto/registrationZod.dto';
import { loginSchema, LoginZodDto } from './dto/loginZod.dto';
import { UserBlockInterceptor } from './interceptors/isBlock.interceptor';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/swaggerDto.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post('/register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    @ApiBody({ type: RegisterDto })
    @UsePipes(new ZodValidationPipe(registerSchema))
    async registration(@Body() registerInfo: RegisterZodDto) {
        return await this.authService.register(registerInfo);
    }

    @Post('/login')
    @UseInterceptors(UserBlockInterceptor)
    @UsePipes(new ZodValidationPipe(loginSchema))
    @ApiOperation({ summary: 'Login user and set JWT cookie' })
    @ApiResponse({ status: 200, description: 'Logged in successfully' })
    @ApiResponse({ status: 400, description: 'Invalid email or password' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginInfo: LoginZodDto,
        @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.login(loginInfo);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 14,
        });
        return {message: 'Logged in successfully!'}
    }
}