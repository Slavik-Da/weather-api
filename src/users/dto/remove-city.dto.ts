import { IsNotEmpty } from "class-validator";

export class RemoveCityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  country: string;
}
