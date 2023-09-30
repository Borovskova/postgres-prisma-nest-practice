import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    link:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?:string;
}