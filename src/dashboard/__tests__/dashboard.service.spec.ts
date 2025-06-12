import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardService } from '../dashboard.service';
import { Property } from '../../properties/entities/properties.entity';
import { PlantedCulture } from '../../planted_cultures/entities/planted-culture.entity';

describe('DashboardService', () => {
    let service: DashboardService;
    let propertyRepo: Repository<Property>;
    let cultureRepo: Repository<PlantedCulture>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DashboardService,
                {
                    provide: getRepositoryToken(Property),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(PlantedCulture),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<DashboardService>(DashboardService);
        propertyRepo = module.get<Repository<Property>>(getRepositoryToken(Property));
        cultureRepo = module.get<Repository<PlantedCulture>>(getRepositoryToken(PlantedCulture));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('totalFarms calls repository count', async () => {
        jest.spyOn(propertyRepo, 'count').mockResolvedValue(5);
        expect(await service.totalFarms()).toBe(5);
    });

    it('totalHectares returns sum from raw query', async () => {
        jest.spyOn(propertyRepo, 'createQueryBuilder').mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ sum: '100.5' }),
        } as any);
        expect(await service.totalHectares()).toBe(100.5);
    });

    it('farmsByState returns grouped counts', async () => {
        const mockData = [{ state: 'SP', count: '3' }, { state: 'MG', count: '2' }];
        jest.spyOn(propertyRepo, 'createQueryBuilder').mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(mockData),
        } as any);
        expect(await service.farmsByState()).toEqual(mockData);
    });

    it('culturesCount returns counts grouped by culture name', async () => {
        const mockData = [{ name: 'soja', count: '4' }, { name: 'milho', count: '1' }];
        jest.spyOn(cultureRepo, 'createQueryBuilder').mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(mockData),
        } as any);
        expect(await service.culturesCount()).toEqual(mockData);
    });

    it('landUseSummary returns sums of farmingArea and vegetationArea', async () => {
        const mockResult = { farmingArea: '50.5', vegetationArea: '40.5' };
        jest.spyOn(propertyRepo, 'createQueryBuilder').mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(mockResult),
        } as any);
        expect(await service.landUseSummary()).toEqual(mockResult);
    });
});