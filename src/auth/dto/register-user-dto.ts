import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password:string;

    @ApiProperty()
    @IsString()
    firstName:string;

    @ApiProperty()
    @IsString()
    lastName:string;
}