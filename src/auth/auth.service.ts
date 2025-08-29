import { BadRequestException, ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ROLES } from '../enums/role.enum';
import { LoginZodDto } from './dto/loginZod.dto';
import { RegisterZodDto } from './dto/registrationZod.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle.type';
import { users } from 'src/drizzle/schema/users.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInfo: RegisterZodDto) {
    try {
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, registerInfo.email));

      if (existingUser.length > 0) {
        this.logger.warn(`Registration attempt with existing email: ${registerInfo.email}`);
        throw new ConflictException('Email is already in use');
      }

      const hashedPassword = await bcrypt.hash(registerInfo.password, 10);
      const [{ password, ...newUser }] = await this.db
        .insert(users)
        .values({
          email: registerInfo.email,
          password: hashedPassword,
          name: registerInfo.name,
          role: ROLES.USER,
        })
        .returning();

      this.logger.log(`New user registered with id=${newUser.id} email=${newUser.email}`);
      return { user: newUser };
    } catch (error) {
      this.logger.error(`Error during registration for email=${registerInfo.email}`, error.stack);
      throw error;
    }
  }

  async login(loginInfo: LoginZodDto) {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, loginInfo.email));

      if (!user) {
        this.logger.warn(`Failed login attempt: email not found ${loginInfo.email}`);
        throw new BadRequestException('Invalid email or password');
      }

      const comparePassword = await bcrypt.compare(loginInfo.password, user.password);
      if (!comparePassword) {
        this.logger.warn(`Failed login attempt: incorrect password for user id=${user.id}`);
        throw new BadRequestException('Invalid email or password');
      }

      const payload = { userId: user.id, email: user.email, role: user.role || ROLES.USER };
      const newToken = await this.jwtService.signAsync(payload);

      this.logger.log(`User logged in successfully: id=${user.id} email=${user.email}`);
      return newToken;
    } catch (error) {
      this.logger.error(`Error during login for email=${loginInfo.email}`, error.stack);
      throw error;
    }
  }
}
