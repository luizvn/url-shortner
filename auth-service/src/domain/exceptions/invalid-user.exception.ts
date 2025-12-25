import { DomainException } from "./domain.exception";


export class InvalidUserException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUserException';
    }
}