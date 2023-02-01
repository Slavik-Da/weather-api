import { Module } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { WeatherController } from "./weather.controller";
import { UsersDAO } from "../users/dao/usersDAO";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, UsersDAO],
  imports: [TypeOrmModule.forFeature([User])],
})
export class WeatherModule {}
