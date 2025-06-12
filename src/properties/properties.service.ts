import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/properties.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Producer } from '../producers/entities/producers.entity';
import { PropertyErrorCode } from '../common/errors/error-codes.enum';

@Injectable()
export class PropertyService {
    constructor(
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,

        @InjectRepository(Producer)
        private producerRepository: Repository<Producer>,
    ) { }

    async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
        const { totalArea, farmingArea, vegetationArea, producerId } = createPropertyDto;

        this.validateAreas(totalArea, farmingArea, vegetationArea);

        const producer = await this.producerRepository.findOne({ where: { id: producerId } });
        if (!producer) {
            throw new NotFoundException({
                message: 'Producer not found',
                errorCode: PropertyErrorCode.PRODUCER_NOT_FOUND,
            });
        }

        const property = this.propertyRepository.create({
            ...createPropertyDto,
            producer,
        });

        return this.propertyRepository.save(property);
    }

    async update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
        const property = await this.propertyRepository.findOne({ where: { id }, relations: ['producer'] });

        if (!property) {
            throw new NotFoundException({
                message: 'Property not found',
                errorCode: PropertyErrorCode.PROPERTY_NOT_FOUND,
            });
        }

        const totalArea = updatePropertyDto.totalArea ?? property.totalArea;
        const farmingArea = updatePropertyDto.farmingArea ?? property.farmingArea;
        const vegetationArea = updatePropertyDto.vegetationArea ?? property.vegetationArea;

        this.validateAreas(totalArea, farmingArea, vegetationArea);

        Object.assign(property, updatePropertyDto);
        return this.propertyRepository.save(property);
    }

    async findAll(): Promise<Property[]> {
        return this.propertyRepository.find({ relations: ['producer'] });
    }

    async findOne(id: number): Promise<Property> {
        const property = await this.propertyRepository.findOne({ where: { id }, relations: ['producer'] });

        if (!property) {
            throw new NotFoundException({
                message: 'Property not found',
                errorCode: PropertyErrorCode.PROPERTY_NOT_FOUND,
            });
        }

        return property;
    }

    async remove(id: number): Promise<void> {
        const result = await this.propertyRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException({
                message: 'Property not found',
                errorCode: PropertyErrorCode.PROPERTY_NOT_FOUND,
            });
        }
    }

    private validateAreas(total: number, farming: number, vegetation: number): void {
        if (farming + vegetation > total) {
            throw new BadRequestException({
                message: 'farmingArea + vegetationArea cannot exceed totalArea',
                errorCode: PropertyErrorCode.INVALID_AREA_SUM,
            });
        }
    }
}
