import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { HashedRefreshToken } from "../auth/entities/refreshTokens.entity";
import { UsersDAO } from "./dao/usersDAO";
import { CityDAO } from "../city/dao/cityDAO";
import { City } from "../city/entities/city.entity";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersDAO, CityDAO],
  imports: [TypeOrmModule.forFeature([User, HashedRefreshToken, City])],
  exports: [UsersService],
})
export class UsersModule {}
