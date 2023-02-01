import { IsNotEmpty } from "class-validator";

export class CreateCityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  lat: string;

  @IsNotEmpty()
  lon: string;
}
