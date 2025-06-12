import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from '../properties.service';
import { Repository, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Property } from '../entities/properties.entity';
import { Producer } from '../../producers/entities/producers.entity';

describe('PropertyService', () => {
    let service: PropertyService;
    let propertyRepo: Repository<Property>;
    let producerRepo: Repository<Producer>;

    const fakeProducer: Producer = {
        id: 1,
        cpfCnpj: '12345678901',
        name: 'Produtor Teste',
        properties: [],
    };

    const fakeProperty: Property = {
        id: 1,
        name: 'Fazenda Teste',
        city: 'Cidade X',
        state: 'Estado Y',
        totalArea: 100,
        farmingArea: 40,
        vegetationArea: 30,
        producer: fakeProducer,
        harvests: [],
    };

    const deleteResult: DeleteResult = {
        raw: {},
        affected: 1,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PropertyService,
                {
                    provide: getRepositoryToken(Property),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        create: jest.fn().mockImplementation((data) => data),
                    },
                },
                {
                    provide: getRepositoryToken(Producer),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PropertyService>(PropertyService);
        propertyRepo = module.get<Repository<Property>>(getRepositoryToken(Property));
        producerRepo = module.get<Repository<Producer>>(getRepositoryToken(Producer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and return a property', async () => {
            jest.spyOn(producerRepo, 'findOne').mockResolvedValue(fakeProducer);
            jest.spyOn(propertyRepo, 'save').mockResolvedValue(fakeProperty);

            const dto = {
                name: 'Fazenda Teste',
                city: 'Cidade X',
                state: 'Estado Y',
                totalArea: 100,
                farmingArea: 40,
                vegetationArea: 30,
                producerId: 1,
            };

            const result = await service.create(dto);
            expect(result).toEqual(fakeProperty);
            expect(producerRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.producerId } });
            expect(propertyRepo.save).toHaveBeenCalledWith(expect.objectContaining({
                ...dto,
                producer: expect.objectContaining({ id: dto.producerId }),
            }));
        });

        it('should throw error if producer not found', async () => {
            jest.spyOn(producerRepo, 'findOne').mockResolvedValue(null);

            await expect(service.create({
                name: 'Fazenda Teste',
                city: 'Cidade X',
                state: 'Estado Y',
                totalArea: 100,
                farmingArea: 40,
                vegetationArea: 30,
                producerId: 999,
            })).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOne', () => {
        it('should return a property', async () => {
            jest.spyOn(propertyRepo, 'findOne').mockResolvedValue(fakeProperty);

            const result = await service.findOne(1);
            expect(result).toEqual(fakeProperty);
            expect(propertyRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['producer'] });
        });

        it('should throw NotFoundException if not found', async () => {
            jest.spyOn(propertyRepo, 'findOne').mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return an array of properties', async () => {
            jest.spyOn(propertyRepo, 'find').mockResolvedValue([fakeProperty]);

            const result = await service.findAll();
            expect(result).toEqual([fakeProperty]);
            expect(propertyRepo.find).toHaveBeenCalledWith({ relations: ['producer'] });
        });
    });

    describe('update', () => {
        it('should update and return updated property', async () => {
            const updatedProperty = { ...fakeProperty, name: 'Fazenda Atualizada' };
            jest.spyOn(propertyRepo, 'findOne').mockResolvedValue(fakeProperty);
            jest.spyOn(propertyRepo, 'save').mockResolvedValue(updatedProperty);

            const dto = { name: 'Fazenda Atualizada' };
            const result = await service.update(1, dto);

            expect(result).toEqual(updatedProperty);
            expect(propertyRepo.save).toHaveBeenCalledWith(expect.objectContaining({
                id: 1,
                name: 'Fazenda Atualizada',
            }));
        });

        it('should throw error if property not found', async () => {
            jest.spyOn(propertyRepo, 'findOne').mockResolvedValue(null);

            await expect(service.update(999, { name: 'Nova' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete and return void', async () => {
            jest.spyOn(propertyRepo, 'delete').mockResolvedValue(deleteResult);

            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(propertyRepo.delete).toHaveBeenCalledWith(1);
        });

        it('should throw error if delete affected 0', async () => {
            jest.spyOn(propertyRepo, 'delete').mockResolvedValue({ raw: {}, affected: 0 });

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
