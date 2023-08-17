import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    //IsInt, IsPositive, min
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    //IsString, MinLength
    @IsString()
    @MinLength(1)
    name: string;

}
