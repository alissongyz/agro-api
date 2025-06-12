import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCpfOrCnpj', async: false })
export class IsCpfOrCnpj implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return cpf.isValid(text) || cnpj.isValid(text);
    }

    defaultMessage(args: ValidationArguments) {
        return 'cpfCnpj must be a valid CPF or CNPJ number';
    }
}