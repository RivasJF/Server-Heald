import { User as UserPrisma } from "generated/prisma";

export class User implements UserPrisma{
    id: number;
    name: string;
}
