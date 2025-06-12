import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppTestModule } from './app-test.module';

describe('App e2e (full flow)', () => {
  let app: INestApplication;

  let producerId: number;
  let propertyId: number;
  let harvestId: number;
  let plantedCultureId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ProducerController', () => {
    it('should create a producer', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/producers')
        .send({ cpfCnpj: '59058642097', name: 'Producer Test' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      producerId = res.body.id;
    });

    it('should get all producers', async () => {
      const res = await request(app.getHttpServer()).get('/v1/producers').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PropertyController', () => {
    it('should create a property with valid areas', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/properties')
        .send({
          name: 'Property Test',
          city: 'City X',
          state: 'ST',
          totalArea: 100,
          farmingArea: 60,
          vegetationArea: 40,
          producerId,
        })
        .expect(201);

      expect(res.body.id).toBeDefined();
      propertyId = res.body.id;
    });

    it('should fail to create property with invalid areas', async () => {
      await request(app.getHttpServer())
        .post('/v1/properties')
        .send({
          name: 'Bad Property',
          city: 'City X',
          state: 'ST',
          totalArea: 100,
          farmingArea: 80,
          vegetationArea: 30,
          producerId,
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toHaveProperty('errorCode', 'PROPERTIES_003');
        });
    });

    it('should get property by id', async () => {
      const res = await request(app.getHttpServer()).get(`/v1/properties/${propertyId}`).expect(200);
      expect(res.body.id).toBe(propertyId);
    });

    it('should update property', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/v1/properties/${propertyId}`)
        .send({ city: 'New City' })
        .expect(200);

      expect(res.body.city).toBe('New City');
    });
  });

  describe('HarvestController', () => {
    it('should create a harvest', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/harvests')
        .send({
          year: 2023,
          propertyId,
        })
        .expect(201);

      expect(res.body.id).toBeDefined();
      harvestId = res.body.id;
    });

    it('should get harvests for property', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/harvests')
        .query({ propertyId })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should update harvest', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/v1/harvests/${harvestId}`)
        .send({ year: 2024 })
        .expect(200);

      expect(res.body.year).toBe(2024);
    });
  });

  describe('PlantedCultureController (e2e)', () => {
    it('should create a planted culture', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/planted-cultures')
        .send({
          name: 'Milho',
          harvestId,
        })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe('Milho');
      expect(res.body.harvest.id).toBe(harvestId);

      plantedCultureId = res.body.id;
    });

    it('should update a planted culture', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/v1/planted-cultures/${plantedCultureId}`)
        .send({ name: 'Milho Atualizado' })
        .expect(200);

      expect(res.body.name).toBe('Milho Atualizado');
    });

    it('should delete a planted culture', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/planted-cultures/${plantedCultureId}`)
        .expect(200);
    });
  });

  describe('DashboardController', () => {
    it('/dashboard/total-farms (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/dashboard/total-farms')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('/dashboard/total-hectares (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/dashboard/total-hectares')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('/dashboard/farms-by-state (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/dashboard/farms-by-state')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('/dashboard/cultures-count (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/dashboard/cultures-count')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('/dashboard/land-use-summary (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/dashboard/land-use-summary')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});
