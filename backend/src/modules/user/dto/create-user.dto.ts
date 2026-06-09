export class CreateUserDto {
    userName!: string;
    password!: string;
    name?: string;
    designation?: string;
    contact?: string;
    userRoles?: string[];
}
 
