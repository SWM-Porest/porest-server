import { PartialType } from "@nestjs/swagger";
import { CreateRestaurantsDto } from "./create-restaurants.dto";


export class UpdateRestaurantsDto extends PartialType(CreateRestaurantsDto) {}