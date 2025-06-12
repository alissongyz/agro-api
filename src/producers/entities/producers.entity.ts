import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Property } from '../../properties/entities/properties.entity';

@Entity()
export class Producer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cpfCnpj: string;

    @Column()
    name: string;

    @OneToMany(() => Property, property => property.producer)
    properties: Property[];
}
