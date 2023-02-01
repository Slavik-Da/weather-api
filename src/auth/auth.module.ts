import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { User } from "../users/entities/users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HashedRefreshToken } from "./entities/refreshTokens.entity";
import { HashedRefreshTokensDAO } from "./dao/hashedRefreshTokensDAO";
import { UsersDAO } from "../users/dao/usersDAO";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UsersDAO,
    HashedRefreshTokensDAO,
    User,
  ],
  imports: [
    TypeOrmModule.forFeature([User, HashedRefreshToken]),
    UsersModule,
    JwtModule.register({}),
  ],
})
export class AuthModule {}
