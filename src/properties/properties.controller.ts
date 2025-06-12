import {
    Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PropertyService } from './properties.service';

@ApiTags('Properties')
@Controller('/v1/properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    @Post()
    @ApiOperation({ summary: 'Cria uma nova propriedade' })
    @ApiResponse({ status: 201, description: 'Propriedade criada com sucesso.' })
    create(@Body() createPropertyDto: CreatePropertyDto) {
        return this.propertyService.create(createPropertyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as propriedades' })
    findAll() {
        return this.propertyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma propriedade pelo ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.propertyService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza uma propriedade' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePropertyDto: UpdatePropertyDto,
    ) {
        return this.propertyService.update(id, updatePropertyDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma propriedade' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.propertyService.remove(id);
    }
}
