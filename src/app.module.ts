import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { DataSource } from "typeorm";
import { InviteModule } from "./invite/invite.module";
import { SearchModule } from "./search/search.module";
import { CityModule } from "./city/city.module";
import { WeatherModule } from "./weather/weather.module";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    InviteModule,
    SearchModule,
    CityModule,
    WeatherModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
