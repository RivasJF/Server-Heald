import { PasswordReset } from "../entities/passrod-reset";

export interface IPasswordResetRepository {
    save(entity: PasswordReset): Promise<PasswordReset>;
    findByEmail(email: string): Promise<PasswordReset | null>;
    deleteById(id: string): Promise<PasswordReset | null>;
}