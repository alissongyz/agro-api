import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProducerModule } from './producers/producers.module';
import { PropertyModule } from './properties/properties.module';
import { HarvestModule } from './harvests/harvests.module';
import { PlantedCultureModule } from './planted_cultures/planted-cultures.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProducerModule,
    PropertyModule,
    HarvestModule,
    PlantedCultureModule,
    DashboardModule,
  ],
})
export class AppModule { }

