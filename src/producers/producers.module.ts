import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './entities/producers.entity';
import { ProducerController } from './producers.controller';
import { ProducerService } from './producers.service';

@Module({
    imports: [TypeOrmModule.forFeature([Producer])],
    controllers: [ProducerController],
    providers: [ProducerService],
    exports: [ProducerService],
})
export class ProducerModule { }