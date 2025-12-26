import { AuthProvider } from "../enums/authProvider.enum";
import { Role } from "../enums/role.enum";
import { Status } from "../enums/status.enum";
import { InvalidUserException } from "../exceptions/invalid-user.exception";


export type CreateUserProps = {
    email: string;
    role?: Role;
    status?: Status;
    authProvider?: AuthProvider;
    name?: string | null;
    googleId?: string | null;
    password?: string | null;
    id?: string;
}

export class User {
    constructor(
        public readonly email: string,
        public readonly role: Role,
        public readonly status: Status,
        public readonly authProvider: AuthProvider,
        public readonly name: string,
        public readonly googleId: string | null,
        public readonly password: string | null,
        public readonly id: string | undefined,
    ) {
        this.validate();
    }

    public static create(props: CreateUserProps): User {

        const name = props.name ?? props.email.split('@')[0];

        return new User(
            props.email,
            props.role ?? Role.USER,
            props.status ?? Status.ACTIVE,
            props.authProvider ?? AuthProvider.LOCAL,
            name,
            props.googleId ?? null,
            props.password ?? null,
            props.id,
        );
    }

    private validate(): void {
        if (this.authProvider === AuthProvider.GOOGLE && !this.googleId) {
            throw new InvalidUserException('Google ID is required for Google authentication');
        } 

        if (this.authProvider === AuthProvider.LOCAL && !this.password) {
            throw new InvalidUserException('Password is required for local authentication');
        }

        if (this.role === Role.ADMIN && this.authProvider !== AuthProvider.LOCAL) {
            throw new InvalidUserException('Admin user must be local');
        }
    }

    public changeName(newName: string): User {
        if(!newName || newName.trim() === '') {
            throw new InvalidUserException('Name is required');
        }

        return this.copyWith({ name: newName });
    }

    public promoteToAdmin(): User {
        if (this.authProvider !== AuthProvider.LOCAL) {
            throw new InvalidUserException('Admin user must be local');
        }

        return this.copyWith({ role: Role.ADMIN });
    }

    private copyWith(partialUser: Partial<User>): User {
        return new User(
            partialUser.email ?? this.email,
            partialUser.role ?? this.role,
            partialUser.status ?? this.status,
            partialUser.authProvider ?? this.authProvider,
            partialUser.name ?? this.name,
            partialUser.googleId ?? this.googleId,
            partialUser.password ?? this.password,
            partialUser.id ?? this.id,
        );
    }
}