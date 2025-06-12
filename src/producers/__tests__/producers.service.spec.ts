import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProducerService } from '../producers.service';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Producer } from '../entities/producers.entity';

describe('ProducerService', () => {
    let service: ProducerService;
    let repository: Repository<Producer>;

    const fakeProducer = {
        id: 1,
        cpfCnpj: '12345678901',
        name: 'Test Producer',
        properties: [],
    };

    const deleteResult: DeleteResult = {
        raw: {},
        affected: 1,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProducerService,
                {
                    provide: getRepositoryToken(Producer),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        create: jest.fn().mockImplementation((data) => data), // ✅ mock do create
                    },
                },
            ],
        }).compile();

        service = module.get<ProducerService>(ProducerService);
        repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and return a producer', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'save').mockResolvedValue(fakeProducer as any);
            const dto = { cpfCnpj: '12345678901', name: 'Test Producer' };
            const result = await service.create(dto);
            expect(result).toEqual(fakeProducer);
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                cpfCnpj: dto.cpfCnpj,
                name: dto.name,
                properties: expect.any(Array),
            }));
        });
    });

    describe('findOne', () => {
        it('should return a producer', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(fakeProducer as any);
            const result = await service.findOne(1);
            expect(result).toEqual(fakeProducer);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException if not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return an array of producers', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([fakeProducer] as any);
            const result = await service.findAll();
            expect(result).toEqual([fakeProducer]);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update and return updated producer', async () => {
            const updatedProducer = { ...fakeProducer, name: 'Updated' };
            jest.spyOn(repository, 'findOne').mockResolvedValue(fakeProducer as any);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProducer as any);
            const dto = { name: 'Updated' };
            const result = await service.update(1, dto);
            expect(result).toEqual(updatedProducer);
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                id: 1,
                name: 'Updated',
                properties: expect.any(Array),
            }));
        });

        it('should throw error if producer not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            await expect(service.update(999, { name: 'X' })).rejects.toThrow();
        });
    });

    describe('remove', () => {
        it('should delete and return void', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(repository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw error if delete affected 0', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ raw: {}, affected: 0 } as DeleteResult);
            await expect(service.remove(999)).rejects.toThrow();
        });
    });
});
