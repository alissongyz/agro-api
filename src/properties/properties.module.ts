import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './properties.service';
import { PropertyController } from './properties.controller';
import { Property } from '../properties/entities/properties.entity';
import { Producer } from '../producers/entities/producers.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Property, Producer])],
    controllers: [PropertyController],
    providers: [PropertyService],
})
export class PropertyModule { }
