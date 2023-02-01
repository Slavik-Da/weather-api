import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { TokensType } from "./types";
import { hash, verify } from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/entities/users.entity";
import { HashedRefreshTokensDAO } from "./dao/hashedRefreshTokensDAO";
import { UsersDAO } from "../users/dao/usersDAO";
import { hashData } from "../common/libs/hashData";

@Injectable()
export class AuthService {
  constructor(
    private usersDAO: UsersDAO,
    private hashedRefreshTokenDAO: HashedRefreshTokensDAO,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async login(userData: CreateUserDto): Promise<TokensType> {
    const user: User = await this.usersDAO.getUserByEmail(userData.email);
    if (!user) {
      throw new HttpException("User not exists", HttpStatus.NOT_FOUND);
    }
    if (!user.hashedPassword) {
      throw new HttpException(
        "You need to complete your registration",
        HttpStatus.FORBIDDEN
      );
    }

    const isPasswordMatched: boolean = await verify(
      user.hashedPassword,
      userData.password
    );
    if (!isPasswordMatched) {
      throw new HttpException("Invalid credentials", HttpStatus.FORBIDDEN);
    }

    const tokens = await this.getTokens(user.id, user.email);
    const newHashedRefreshToken = await hashData(tokens.refresh_token);

    await this.hashedRefreshTokenDAO.saveHashedRefreshToken(
      user,
      newHashedRefreshToken
    );

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await this.usersDAO.findUserById(userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    const promisesWithMatchResult = user.hashedRefreshToken.map(
      async (hashedToken) => {
        return {
          fullTokenInfo: hashedToken,
          isMatched: await verify(hashedToken.token, refreshToken),
        };
      }
    );

    const results = await Promise.all(promisesWithMatchResult);
    const tokensMatched = results.filter((res) => res.isMatched);
    if (!tokensMatched.length) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const removePromises = tokensMatched.map((t) => {
      if (t.isMatched) {
        this.hashedRefreshTokenDAO.removeToken(t.fullTokenInfo.token);
      }
    });
    await Promise.all(removePromises);
  }

  async refresh(userId: string, refreshToken: string): Promise<TokensType> {
    const user = await this.usersDAO.findUserById(userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const promisesWithMatchResult = user.hashedRefreshToken.map(
      async (hashedToken) => {
        return {
          fullTokenInfo: hashedToken,
          isMatched: await verify(hashedToken.token, refreshToken),
        };
      }
    );

    const results = await Promise.all(promisesWithMatchResult);
    const tokensMatched = results.filter((res) => res.isMatched);

    const removePromises = tokensMatched.map((t) => {
      if (t.isMatched) {
        this.hashedRefreshTokenDAO.removeToken(t.fullTokenInfo.token);
      }
    });

    const awaitedRemoves = await Promise.all(removePromises);
    if (!awaitedRemoves.length) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const newTokens = await this.getTokens(user.id, user.email);
    if (!newTokens) {
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const newHashedRefreshToken = await hashData(newTokens.refresh_token);
    const updatedUser = await this.usersDAO.findUserById(userId);

    await this.hashedRefreshTokenDAO.saveHashedRefreshTokenForUser(
      updatedUser,
      newHashedRefreshToken
    );

    return newTokens;
  }

  private async getTokens(userId: string, email: string): Promise<TokensType> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET_KEY"),
          expiresIn: 60 * 15,
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET_KEY"),
          expiresIn: 60 * 60 * 24 * 7,
        }
      ),
    ]).catch((e) => {
      throw new HttpException(
        "Something went wrong",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
