import { Module } from "@nestjs/common";
import { CityService } from "./city.service";
import { CityController } from "./city.controller";
import { CityDAO } from "./dao/cityDAO";
import { TypeOrmModule } from "@nestjs/typeorm";
import { City } from "./entities/city.entity";

@Module({
  controllers: [CityController],
  providers: [CityService, CityDAO],
  imports: [TypeOrmModule.forFeature([City])],
})
export class CityModule {}
