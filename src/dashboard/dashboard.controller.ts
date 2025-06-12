import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('total-farms')
  @ApiOperation({ summary: 'Retorna o total de fazendas cadastradas' })
  @ApiResponse({ status: 200, description: 'Quantidade total de fazendas' })
  async totalFarms() {
    const total = await this.dashboardService.totalFarms();
    return { totalFarms: total }; // opcional para garantir json
  }

  @Get('total-hectares')
  @ApiOperation({ summary: 'Retorna a soma da área total das fazendas' })
  @ApiResponse({ status: 200, description: 'Área total em hectares' })
  async totalHectares() {
    const hectares = await this.dashboardService.totalHectares();
    return { totalHectares: hectares };
  }

  @Get('farms-by-state')
  @ApiOperation({ summary: 'Retorna a quantidade de fazendas por estado' })
  @ApiResponse({ status: 200, description: 'Lista com estados e quantidade' })
  async farmsByState() {
    return await this.dashboardService.farmsByState();
  }

  @Get('cultures-count')
  @ApiOperation({ summary: 'Retorna a contagem de culturas plantadas' })
  @ApiResponse({ status: 200, description: 'Lista com nome das culturas e contagem' })
  async culturesCount() {
    return await this.dashboardService.culturesCount();
  }

  @Get('land-use-summary')
  @ApiOperation({ summary: 'Retorna a soma das áreas agricultável e de vegetação' })
  @ApiResponse({ status: 200, description: 'Resumo do uso do solo' })
  async landUseSummary() {
    return await this.dashboardService.landUseSummary();
  }
}