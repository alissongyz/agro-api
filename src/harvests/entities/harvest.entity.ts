import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Property } from '../../properties/entities/properties.entity';
import { PlantedCulture } from '../../planted_cultures/entities/planted-culture.entity';

@Entity()
export class Harvest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @ManyToOne(() => Property, property => property.harvests, { eager: true })
  property: Property;

  @OneToMany(() => PlantedCulture, culture => culture.harvest)
  plantedCultures: PlantedCulture[];
}
