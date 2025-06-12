import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { PlantedCultureService } from '../planted-cultures.service';
import { PlantedCulture } from '../entities/planted-culture.entity';
import { Harvest } from '../../harvests/entities/harvest.entity';
import { Property } from '../../properties/entities/properties.entity';

describe('PlantedCultureService', () => {
    let service: PlantedCultureService;
    let plantedCultureRepository: jest.Mocked<Repository<PlantedCulture>>;
    let harvestRepository: jest.Mocked<Repository<Harvest>>;
    let propertyRepository: jest.Mocked<Repository<Property>>;

    const fakeProperty: Property = {
        id: 1,
        name: 'Fazenda Teste',
        city: 'Cidade',
        state: 'Estado',
        totalArea: 100,
        farmingArea: 50,
        vegetationArea: 30,
        producer: undefined,
        harvests: [],
    };

    const fakeHarvest: Harvest = {
        id: 1,
        year: 2024,
        property: fakeProperty,
        plantedCultures: [],
    };

    const fakePlantedCulture: PlantedCulture = {
        id: 1,
        name: 'Soja',
        harvest: fakeHarvest,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlantedCultureService,
                {
                    provide: getRepositoryToken(PlantedCulture),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        save: jest.fn(),
                        create: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Harvest),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Property),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PlantedCultureService>(PlantedCultureService);
        plantedCultureRepository = module.get(getRepositoryToken(PlantedCulture));
        harvestRepository = module.get(getRepositoryToken(Harvest));
        propertyRepository = module.get(getRepositoryToken(Property));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('create() should save a planted culture', async () => {
        harvestRepository.findOne.mockResolvedValue(fakeHarvest);

        plantedCultureRepository.findOne.mockResolvedValue(null);

        plantedCultureRepository.create.mockImplementation(dto => dto as any);

        plantedCultureRepository.save.mockResolvedValue(fakePlantedCulture);

        const dto = { name: 'Soja', harvestId: 1, propertyId: 1 };
        const result = await service.create(dto);

        expect(harvestRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.harvestId } });
        expect(plantedCultureRepository.findOne).toHaveBeenCalledWith({
            where: { name: dto.name, harvest: { id: dto.harvestId } },
            relations: ['harvest'],
        });
        expect(plantedCultureRepository.create).toHaveBeenCalledWith({
            ...dto,
            harvest: fakeHarvest,
        });
        expect(plantedCultureRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: dto.name }));
        expect(result).toEqual(fakePlantedCulture);
    });

    it('findAll() should return all planted cultures', async () => {
        plantedCultureRepository.find.mockResolvedValue([fakePlantedCulture]);

        const result = await service.findAll();

        expect(plantedCultureRepository.find).toHaveBeenCalledWith({ relations: ['harvest'] });
        expect(result).toEqual([fakePlantedCulture]);
    });

    it('findOne() should return a planted culture by id', async () => {
        plantedCultureRepository.findOne.mockResolvedValue(fakePlantedCulture);

        const result = await service.findOne(1);

        expect(plantedCultureRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['harvest'],
        });
        expect(result).toEqual(fakePlantedCulture);
    });

    it('update() should update a planted culture', async () => {
        plantedCultureRepository.findOne.mockResolvedValue(fakePlantedCulture);
        const updatedCulture = { ...fakePlantedCulture, name: 'Milho' };
        plantedCultureRepository.save.mockResolvedValue(updatedCulture);

        const dto = { name: 'Milho', harvestId: 1, propertyId: 1 };
        const result = await service.update(1, dto);

        expect(plantedCultureRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['harvest'],
        });
        expect(plantedCultureRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'Milho' }));
        expect(result).toEqual(updatedCulture);
    });

    it('remove() should delete a planted culture', async () => {
        // Mock delete returning a result with affected > 0
        plantedCultureRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

        await expect(service.remove(1)).resolves.toBeUndefined();

        expect(plantedCultureRepository.delete).toHaveBeenCalledWith(1);
    });
});
