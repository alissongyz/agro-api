import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProducerService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Producers')
@Controller('/v1/producers')
export class ProducerController {
    constructor(private readonly producerService: ProducerService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new producer' })
    async create(@Body() dto: CreateProducerDto) {
        return this.producerService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all producers' })
    async findAll() {
        return await this.producerService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get producer by id' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.producerService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a producer' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProducerDto) {
        return await this.producerService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a producer' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.producerService.remove(id);
    }
}