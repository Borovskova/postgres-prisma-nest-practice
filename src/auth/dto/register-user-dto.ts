import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({
        required: true
      })
    @IsNotEmpty()
    @IsString()
    email:string;

    @ApiProperty({
        required: true
      })
    @IsNotEmpty()
    @IsString()
    password:string;

    @ApiProperty({
        required: true
      })
    @IsString()
    firstName:string;

    @ApiProperty({
        required: true
      })
    @IsString()
    lastName:string;
}