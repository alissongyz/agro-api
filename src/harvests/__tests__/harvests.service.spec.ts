import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from '../harvests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Harvest } from '../entities/harvest.entity';
import { Repository, DeleteResult } from 'typeorm';
import { Property } from '../../properties/entities/properties.entity';

describe('HarvestService', () => {
    let service: HarvestService;
    let harvestRepository: Repository<Harvest>;
    let propertyRepository: Repository<Property>;

    const fakeProperty: Property = {
        id: 1,
        name: 'Fazenda Teste',
        city: 'Cidade X',
        state: 'Estado Y',
        totalArea: 100,
        farmingArea: 40,
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HarvestService,
                {
                    provide: getRepositoryToken(Harvest),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Property),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<HarvestService>(HarvestService);
        harvestRepository = module.get<Repository<Harvest>>(getRepositoryToken(Harvest));
        propertyRepository = module.get<Repository<Property>>(getRepositoryToken(Property));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('create() should save a harvest', async () => {
        const dto = { year: 2024, propertyId: 1 };

        // Mock findOne to return the fake property
        jest.spyOn(propertyRepository, 'findOne').mockResolvedValue(fakeProperty);
        // Mock create to return a harvest object
        jest.spyOn(harvestRepository, 'create').mockReturnValue(fakeHarvest);
        // Mock save to resolve the same object
        jest.spyOn(harvestRepository, 'save').mockResolvedValue(fakeHarvest);

        const result = await service.create(dto);

        expect(propertyRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.propertyId } });
        expect(harvestRepository.create).toHaveBeenCalledWith({
            ...dto,
            property: fakeProperty,
        });
        expect(harvestRepository.save).toHaveBeenCalledWith(fakeHarvest);
        expect(result).toEqual(fakeHarvest);
    });

    it('findAll() should return all harvests', async () => {
        jest.spyOn(harvestRepository, 'find').mockResolvedValue([fakeHarvest]);

        const result = await service.findAll();

        expect(harvestRepository.find).toHaveBeenCalledWith({ relations: ['property'] });
        expect(result).toEqual([fakeHarvest]);
    });

    it('findOne() should return a harvest by id', async () => {
        jest.spyOn(harvestRepository, 'findOne').mockResolvedValue(fakeHarvest);

        const result = await service.findOne(1);

        expect(harvestRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['property'] });
        expect(result).toEqual(fakeHarvest);
    });

    it('update() should update a harvest', async () => {
        const updatedHarvest = { ...fakeHarvest, year: 2025 };
        jest.spyOn(service, 'findOne').mockResolvedValue(fakeHarvest);
        jest.spyOn(harvestRepository, 'save').mockResolvedValue(updatedHarvest);

        const dto = { year: 2025, propertyId: 1 };
        const result = await service.update(1, dto);

        expect(harvestRepository.save).toHaveBeenCalledWith({ ...fakeHarvest, ...dto });
        expect(result).toEqual(updatedHarvest);
    });

    it('remove() should delete a harvest', async () => {
        const deleteResult: DeleteResult = { raw: {}, affected: 1 };
        jest.spyOn(harvestRepository, 'delete').mockResolvedValue(deleteResult);

        const result = await service.remove(1);

        expect(harvestRepository.delete).toHaveBeenCalledWith(1);
        expect(result).toBeUndefined(); // porque o método `remove()` retorna `void`
    });
});
