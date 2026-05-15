import { Verification } from '../entities/verification.entity';

export interface IVerificationRepository {
  findByEmail(email: string): Promise<Verification | null>;
  save(entity: Verification): Promise<Verification>;
  findById(id: string): Promise<Verification | null>;
  findByUserId(userId: string): Promise<Verification | null>;
  delete(id: string): Promise<Verification | null>;
}
