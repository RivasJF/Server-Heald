import { $Enums, User as UserPrisma } from "generated/prisma";

export class User implements UserPrisma{
    id: string;
    name: string;
    email: string;
    password: string;
    role: $Enums.Role;
    createAt: Date;
}
