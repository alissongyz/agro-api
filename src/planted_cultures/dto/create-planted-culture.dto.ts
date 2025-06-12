import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePlantedCultureDto {
    @ApiProperty({ example: 'Santa Maria' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    harvestId: number;
}