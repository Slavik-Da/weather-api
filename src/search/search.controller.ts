import { Controller, Get, Param } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get(":cityName")
  find(@Param("cityName") cityName: string): Promise<any> {
    return this.searchService.find(cityName);
  }
}
