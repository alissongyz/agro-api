import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../properties/entities/properties.entity';
import { PlantedCulture } from '../planted_cultures/entities/planted-culture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PlantedCulture])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }