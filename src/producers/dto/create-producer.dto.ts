import { IsNotEmpty, Validate } from 'class-validator';
import { IsCpfOrCnpj } from '../../common/validators/cpf-cnpj.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
    @ApiProperty({ example: '94077079039' })
    @IsNotEmpty()
    @Validate(IsCpfOrCnpj)
    cpfCnpj: string;

    @ApiProperty({ example: 'Nome' })
    @IsNotEmpty()
    name: string;
}