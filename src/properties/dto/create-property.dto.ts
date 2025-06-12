import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePropertyDto {
    @ApiProperty({ example: 'Fazenda Santa Maria' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Ribeirão Preto' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'SP' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(0)
    totalArea: number;

    @ApiProperty({ example: 60 })
    @IsNumber()
    @Min(0)
    farmingArea: number;

    @ApiProperty({ example: 30 })
    @IsNumber()
    @Min(0)
    vegetationArea: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    producerId: number;
}
