import { Injectable } from "@nestjs/common";
import { UsersDAO } from "../users/dao/usersDAO";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class WeatherService {
  constructor(
    public usersDAO: UsersDAO,
    private readonly configService: ConfigService
  ) {}
  async getWeatherInfo(userEmail: string) {
    const openWeatherAPIKey = this.configService.get("OPEN_WEATHER_API_KEY");
    const cities = await this.usersDAO.getCities(userEmail);

    const promisesArr = cities.map((city) => {
      return this.callOpenWeatherApi(openWeatherAPIKey, city.lat, city.lon);
    });

    return Promise.all(promisesArr);
  }

  callOpenWeatherApi = async (apiKey: string, lat: string, lon: string) => {
    const units = "metric";
    const cnt = 6;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&units=${units}&appid=${apiKey}`
    );
    return response.data;
  };
}
