import { IsNotEmpty } from "class-validator";
import { Date } from "mongoose";

export class CreateRestaurantsDto {
    @IsNotEmpty()
    name: string

    en_name: string

    phone_number: string

    address: string

    created_at: Date

    updated_at: Date

    status: number
}