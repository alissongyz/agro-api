import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreatePlantedCultureDto } from './dto/create-planted-culture.dto';
import { UpdatePlantedCultureDto } from './dto/update-planted-culture.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlantedCultureService } from './planted-cultures.service';

@ApiTags('Planted Cultures')
@Controller('/v1/planted-cultures')
export class PlantedCultureController {
    constructor(private readonly cultureService: PlantedCultureService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new planted culture' })
    create(@Body() dto: CreatePlantedCultureDto) {
        return this.cultureService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all planted cultures' })
    findAll() {
        return this.cultureService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get planted culture by id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.cultureService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a planted culture' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlantedCultureDto) {
        return this.cultureService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a planted culture' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.cultureService.remove(id);
    }
}