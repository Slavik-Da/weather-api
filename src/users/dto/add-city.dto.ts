import { IsNotEmpty } from "class-validator";

export class AddCityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  lat: string;

  @IsNotEmpty()
  lon: string;
}
