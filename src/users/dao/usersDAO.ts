import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { SaveUserDto } from "../dto/save-user.dto";
import { User } from "../entities/users.entity";
import { City } from "../../city/entities/city.entity";
import { AddCityDto } from "../dto/add-city.dto";
import { RemoveCityDto } from "../dto/remove-city.dto";
@Injectable()
export class UsersDAO {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  getUserByEmail(userEmail: string): Promise<User> {
    return this.userRepository.findOneBy({ email: userEmail });
  }

  saveUser(user: SaveUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  findUserById(userId: string): Promise<User> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async addCity(userEmail: string, city: AddCityDto): Promise<City[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userFromDb = await this.getUserByEmail(userEmail);
      const cityFromDb = await queryRunner.manager.findOne(City, {
        where: { name: city.name, country: city.country },
      });
      userFromDb.cities.push(cityFromDb);
      const user = await this.dataSource.manager.save(userFromDb);
      await queryRunner.commitTransaction();
      //TODO: fix bug with cities duplicating
      return user.cities;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        "Failed to add a city",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getCities(userEmail: string): Promise<City[]> {
    const user = await this.userRepository.findOneBy({ email: userEmail });
    return user.cities;
  }

  async removeCity(userEmail: string, city: RemoveCityDto): Promise<City[]> {
    const user = await this.getUserByEmail(userEmail);

    const citiesToSave = user.cities.filter((cityElement) => {
      const isNameMatch = cityElement.name === city.name;
      const isCountryMatch = cityElement.country === city.country;
      return !(isNameMatch && isCountryMatch);
    });

    user.cities = citiesToSave;
    await this.saveUser(user);
    return user.cities;
  }
}
