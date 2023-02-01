import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs";

@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  async find(cityName: string): Promise<any> {
    const openWeatherAPIKey = this.configService.get("OPEN_WEATHER_API_KEY");
    const limit = 5;

    return this.httpService
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${openWeatherAPIKey}`
      )
      .pipe(map((res) => res.data));
  }
}
