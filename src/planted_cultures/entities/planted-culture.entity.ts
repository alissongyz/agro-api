import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Harvest } from '../../harvests/entities/harvest.entity';
import { Property } from '../../properties/entities/properties.entity';

@Entity()
export class PlantedCulture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Harvest, harvest => harvest.plantedCultures, { eager: true })
  harvest: Harvest;
}
