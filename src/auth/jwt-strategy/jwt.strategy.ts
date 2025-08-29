import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from '../../configs/env.config';
import { Payload } from "src/types/payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.['jwt'] || null,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.jwt_secret
        });
    }

    async validate(payload: Payload) {
        return {userId: payload.userId, email: payload.email, role: payload.role};
    }
}