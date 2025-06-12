import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../producers/entities/producers.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerErrorCode } from '../common/errors/error-codes.enum';

@Injectable()
export class ProducerService {
    constructor(
        @InjectRepository(Producer)
        private producerRepository: Repository<Producer>,
    ) { }

    async create(createProducerDto: CreateProducerDto): Promise<Producer> {
        const producer = this.producerRepository.create({
            ...createProducerDto,
            properties: [],
        });

        return this.producerRepository.save(producer);
    }

    async findAll(): Promise<Producer[]> {
        return this.producerRepository.find();
    }

    async findOne(id: number): Promise<Producer> {
        const producer = await this.producerRepository.findOne({ where: { id } });

        if (!producer) {
            throw new NotFoundException({
                message: 'Producer not found',
                errorCode: ProducerErrorCode.PRODUCER_NOT_FOUND,
            });
        }

        return producer;
    }

    async update(id: number, updateProducerDto: UpdateProducerDto): Promise<Producer> {
        const producer = await this.findOne(id);
        Object.assign(producer, updateProducerDto);
        return this.producerRepository.save(producer);
    }

    async remove(id: number): Promise<void> {
        const result = await this.producerRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException({
                message: 'Producer not found',
                errorCode: ProducerErrorCode.PRODUCER_NOT_FOUND,
            });
        }
    }
}