import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantedCultureDto } from './create-planted-culture.dto';

export class UpdatePlantedCultureDto extends PartialType(CreatePlantedCultureDto) { }