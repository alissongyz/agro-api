import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../properties/entities/properties.entity';
import { PlantedCulture } from '../planted_cultures/entities/planted-culture.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
        @InjectRepository(PlantedCulture)
        private cultureRepository: Repository<PlantedCulture>,
    ) { }

    async totalFarms() {
        return this.propertyRepository.count();
    }

    async totalHectares() {
        const result = await this.propertyRepository
            .createQueryBuilder('property')
            .select('SUM(property.totalArea)', 'sum')
            .getRawOne();
        return parseFloat(result.sum) || 0;
    }

    async farmsByState() {
        return this.propertyRepository
            .createQueryBuilder('property')
            .select('property.state', 'state')
            .addSelect('COUNT(*)', 'count')
            .groupBy('property.state')
            .getRawMany();
    }

    async culturesCount() {
        return this.cultureRepository
            .createQueryBuilder('culture')
            .select('culture.name', 'name')
            .addSelect('COUNT(*)', 'count')
            .groupBy('culture.name')
            .getRawMany();
    }

    async landUseSummary() {
        return this.propertyRepository
            .createQueryBuilder('property')
            .select('SUM(property.farmingArea)', 'farmingArea')
            .addSelect('SUM(property.vegetationArea)', 'vegetationArea')
            .getRawOne();
    }
}