import { PasswordReset } from "src/user/entities/passrod-reset";
import { IPasswordResetRepository } from "../password-reset.respository.imp";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PasswordReset as PasswordResetSchema } from "generated/prisma";


@Injectable()
export class PasswordResetRepository implements IPasswordResetRepository {

    constructor(private readonly prisma: PrismaService) { }

    async save(entity: PasswordReset): Promise<PasswordReset> {
        if (!entity.getId()) {
            const row = await this.prisma.passwordReset.create({
                data: {
                    email: entity.getEmail(),
                    code: entity.getCode(),
                    attempts: entity.getAttempts(),
                    expireAt: entity.getExpireAt(),
                    verified: entity.getVerified(),
                }
            });
            return this.toDomain(row);
        }
        const update = await this.prisma.passwordReset.update({
            where: { id: entity.getId() },
            data: {
                code: entity.getCode(),
                attempts: entity.getAttempts(),
                expireAt: entity.getExpireAt(),
                verified: entity.getVerified(),
            }
        });
        return this.toDomain(update);

    }
    async findByEmail(email: string): Promise<PasswordReset | null> {
        const row = await this.prisma.passwordReset.findUnique({ where: { email } });
        if (!row) return null;
        return this.toDomain(row);
    }
    async deleteById(id: string): Promise<PasswordReset | null> {
        const row = await this.prisma.passwordReset.delete({ where: { id } });
        if (!row) return null;
        return this.toDomain(row);
    }

    private toDomain(data: PasswordResetSchema): PasswordReset {
        return PasswordReset.create(
            data.email,
            data.code,
            data.id,
            data.attempts,
            data.expireAt,
            data.verified,
        );
    }
}