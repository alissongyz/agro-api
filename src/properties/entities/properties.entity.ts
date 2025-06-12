import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Producer } from '../../producers/entities/producers.entity';
import { Harvest } from '../../harvests/entities/harvest.entity';

@Entity()
export class Property {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column('float')
    totalArea: number;

    @Column('float')
    farmingArea: number;

    @Column('float')
    vegetationArea: number;

    @ManyToOne(() => Producer, producer => producer.properties, { eager: true })
    producer?: Producer;

    @OneToMany(() => Harvest, harvest => harvest.property)
    harvests?: Harvest[];
}
