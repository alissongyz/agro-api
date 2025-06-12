import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from '../src/dashboard/dashboard.module';
import { ProducerModule } from '../src/producers/producers.module';
import { PropertyModule } from '../src/properties/properties.module';
import { HarvestModule } from '../src/harvests/harvests.module';
import { PlantedCultureModule } from '../src/planted_cultures/planted-cultures.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
        }),
        ProducerModule,
        PropertyModule,
        HarvestModule,
        PlantedCultureModule,
        DashboardModule,
    ],
})
export class AppTestModule { }
