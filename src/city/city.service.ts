import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCityDto } from "./dto/create-city.dto";
import { CityDAO } from "./dao/cityDAO";

@Injectable()
export class CityService {
  constructor(private cityDAO: CityDAO) {}
  async create(city: CreateCityDto) {
    const cityFound = await this.cityDAO.findCityByNameAndCounty(
      city.name,
      city.country
    );
    if (cityFound) {
      throw new HttpException("City exists", HttpStatus.FOUND);
    }
    return this.cityDAO.saveCity(city);
  }
}
