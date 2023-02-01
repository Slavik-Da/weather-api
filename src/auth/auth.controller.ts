import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { TokensType } from "./types";
import { AuthGuard } from "@nestjs/passport";
import { UserDecorator } from "./decorators/user.decorator";
import { RefreshTokenFromHeaders } from "./decorators/refresh-token.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() userData: CreateUserDto): Promise<TokensType> {
    return this.authService.login(userData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(
    @UserDecorator() user,
    @RefreshTokenFromHeaders() refreshToken
  ): Promise<void> {
    return this.authService.logout(user.sub, refreshToken);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(
    @UserDecorator() user,
    @RefreshTokenFromHeaders() refreshToken
  ): Promise<TokensType> {
    return this.authService.refresh(user.sub, refreshToken);
  }
}
