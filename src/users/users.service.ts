import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { HashedRefreshToken } from "../auth/entities/refreshTokens.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersDAO } from "./dao/usersDAO";
import { hashData } from "../common/libs/hashData";
import { AddCityDto } from "./dto/add-city.dto";
import { CityDAO } from "../city/dao/cityDAO";
import { City } from "../city/entities/city.entity";
import { RemoveCityDto } from "./dto/remove-city.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    @InjectRepository(HashedRefreshToken)
    public hashedRefreshTokenRepository: Repository<HashedRefreshToken>,
    public usersDAO: UsersDAO,
    public cityDAO: CityDAO
  ) {}
  async register(newUser: CreateUserDto): Promise<User> {
    const user: User = await this.usersDAO.getUserByEmail(newUser.email);
    if (user) {
      throw new HttpException("User exists", HttpStatus.CONFLICT);
    }
    const hashedPass = await hashData(newUser.password);

    await this.usersDAO.saveUser({
      email: newUser.email,
      hashedPassword: hashedPass,
    });

    return this.usersDAO.getUserByEmail(newUser.email);
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  deleteById(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async addCity(userEmail: string, city: AddCityDto): Promise<City[]> {
    let cityFromDb = await this.cityDAO.findCityByNameAndCounty(
      city.name,
      city.country
    );

    if (!cityFromDb) {
      cityFromDb = await this.cityDAO.saveCity(city);
    }
    return this.usersDAO.addCity(userEmail, cityFromDb);
  }
  getCities(userEmail: string): Promise<City[]> {
    return this.usersDAO.getCities(userEmail);
  }

  async removeCity(userEmail: string, city: RemoveCityDto): Promise<City[]> {
    const userCities = await this.usersDAO.getCities(userEmail);

    const cityMatch = userCities.filter((cityElement) => {
      const isNameMatch = cityElement.name === city.name;
      const isCountryMatch = cityElement.country === city.country;
      return isNameMatch && isCountryMatch;
    });

    if (!cityMatch.length) {
      throw new HttpException("City not found", HttpStatus.NOT_FOUND);
    }

    return this.usersDAO.removeCity(userEmail, city);
  }
}
