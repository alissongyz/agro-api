import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantedCulture } from './entities/planted-culture.entity';
import { PlantedCultureService } from './planted-cultures.service';
import { PlantedCultureController } from './planted-cultures.controller';
import { Harvest } from '../harvests/entities/harvest.entity';
import { Property } from '../properties/entities/properties.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PlantedCulture, Harvest, Property])],
    controllers: [PlantedCultureController],
    providers: [PlantedCultureService],
    exports: [PlantedCultureService],
})
export class PlantedCultureModule { }