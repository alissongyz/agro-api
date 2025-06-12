import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { Property } from '../properties/entities/properties.entity';
import { HarvestController } from './harvests.controller';
import { HarvestService } from './harvests.service';

@Module({
    imports: [TypeOrmModule.forFeature([Harvest, Property])],
    controllers: [HarvestController],
    providers: [HarvestService],
    exports: [HarvestService],
})
export class HarvestModule { }