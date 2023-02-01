import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getBearerTokenFromHeaders } from "./libs/getBearerTokenFromHeaders";
import { JwtPayload } from "../../types";

interface ValidateReturn extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader("refresh-token"),
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET_KEY"),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): ValidateReturn {
    const refreshToken = getBearerTokenFromHeaders(req);
    return {
      ...payload,
      refreshToken,
    };
  }
}
