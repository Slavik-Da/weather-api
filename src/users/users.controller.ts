import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/users.entity";
import { DeleteResult } from "typeorm";
import { AuthGuard } from "@nestjs/passport";
import { UserDecorator } from "../auth/decorators/user.decorator";
import { AddCityDto } from "./dto/add-city.dto";
import { City } from "../city/entities/city.entity";
import { RemoveCityDto } from "./dto/remove-city.dto";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(AuthGuard("jwt"))
  @Delete("cities")
  removeCity(
    @UserDecorator() user,
    @Body() city: RemoveCityDto
  ): Promise<City[]> {
    return this.usersService.removeCity(user.email, city);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("cities")
  addCity(@UserDecorator() user, @Body() city: AddCityDto): Promise<City[]> {
    return this.usersService.addCity(user.email, city);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("cities")
  getUserCities(@UserDecorator() user): Promise<City[]> {
    return this.usersService.getCities(user.email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(@Body() newUser: CreateUserDto): Promise<User> {
    return this.usersService.register(newUser);
  }

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(":userId")
  getById(@Param("userId") userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  @Delete(":userId")
  deleteById(@Param("userId") userId: string): Promise<DeleteResult> {
    return this.usersService.deleteById(userId);
  }
}
