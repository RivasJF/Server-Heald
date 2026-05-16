import { Injectable } from '@nestjs/common';
import { Verification } from '../entities/verification.entity';
import { IVerificationRepository } from './verification.repository.imp';
import { PrismaService } from 'src/prisma/prisma.service';
import { Verification as VerificationSchema, User as UserSchema } from 'generated/prisma';

@Injectable()
export class VerificationRepository implements IVerificationRepository {
    constructor(private readonly prisma: PrismaService) {}

    private toDomain(data: VerificationSchema): Verification {
        return Verification.create(
            data.email,
            data.code,
            data.id,
            data.attempts,
            data.resendAttempts,
            data.isVerified,
            data.expireAt,
            data.lastResendAt,
        );
    }

    async findByEmail(email: string): Promise<Verification | null> {
        const row = await this.prisma.verification.findUnique({ where: { email } });
        if (!row) return null;
        return this.toDomain(row);
    }

    async save(entity: Verification): Promise<Verification> {
        if (!entity.getId()) {
            const created = await this.prisma.verification.create({
                data: {
                    email: entity.getEmail(),
                    code: entity.getCode(),
                    expireAt: entity.getExpiresAt ? entity.getExpiresAt() : undefined,
                    attempts: entity.getAttempts(),
                    resendAttempts: entity.getResendAttempts(),
                    lastResendAt: entity.getLastResendAt ? entity.getLastResendAt() : undefined,
                    isVerified: entity.getIsVerified ? entity.getIsVerified() : false,
                },
            });
            return this.toDomain(created);
        }

        const updated = await this.prisma.verification.update({
            where: { id: entity.getId() },
            data: {
                email: entity.getEmail(),
                code: entity.getCode(),
                expireAt: entity.getExpiresAt ? entity.getExpiresAt() : undefined,
                attempts: entity.getAttempts(),
                resendAttempts: entity.getResendAttempts(),
                lastResendAt: entity.getLastResendAt ? entity.getLastResendAt() : undefined,
                isVerified: entity.getIsVerified ? entity.getIsVerified() : false,
            },
        });

        return this.toDomain(updated);
    }

    async findById(id: string): Promise<Verification | null> {
        const row = await this.prisma.verification.findUnique({ where: { id } });
        if (!row) return null;
        return this.toDomain(row);
    }

    async findByUserId(userId: string): Promise<Verification | null> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;
        const row = await this.prisma.verification.findUnique({ where: { email: user.email } });
        if (!row) return null;
        return this.toDomain(row);
    }

    async delete(id: string): Promise<Verification | null> {
        const existing = await this.findById(id);
        if (!existing) return null;
        const deleted = await this.prisma.verification.delete({ where: { id } });
        return this.toDomain(deleted);
    }
}