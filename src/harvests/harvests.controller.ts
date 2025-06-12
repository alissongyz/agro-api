import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HarvestService } from './harvests.service';

@ApiTags('Harvests')
@Controller('/v1/harvests')
export class HarvestController {
    constructor(private readonly harvestService: HarvestService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new harvest' })
    create(@Body() dto: CreateHarvestDto) {
        return this.harvestService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all harvests' })
    findAll() {
        return this.harvestService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get harvest by id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.harvestService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a harvest' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHarvestDto) {
        return this.harvestService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a harvest' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.harvestService.remove(id);
    }
}