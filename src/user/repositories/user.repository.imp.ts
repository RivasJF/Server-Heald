import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(entity: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  fiendAll(): Promise<User[]>;
  delete(id: string): Promise<User | null>;
}
