import { Controller, Get, UseGuards } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { AuthGuard } from "@nestjs/passport";
import { UserDecorator } from "../auth/decorators/user.decorator";

@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @UseGuards(AuthGuard("jwt"))
  @Get()
  getWeatherInfo(@UserDecorator() user) {
    return this.weatherService.getWeatherInfo(user.email);
  }
}
