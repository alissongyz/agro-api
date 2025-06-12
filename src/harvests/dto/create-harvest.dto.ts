import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({ example: 2001 })
  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;
}