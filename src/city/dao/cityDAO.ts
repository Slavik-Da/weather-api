import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { City } from "../entities/city.entity";
import { CreateCityDto } from "../dto/create-city.dto";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class CityDAO {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>
  ) {}

  saveCity(city: CreateCityDto): Promise<City> {
    return this.cityRepository.save(city);
  }

  findCityByNameAndCounty(name: string, country: string): Promise<City> {
    return this.cityRepository.findOneBy({ name: name, country: country });
  }
}
