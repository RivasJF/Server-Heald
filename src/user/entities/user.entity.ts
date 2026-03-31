import { Role } from './user.enum';

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
};

export class User {

  private id?: string;
  private name: string;
  private email: string;
  private password: string;
  private phoneNumber?: string;
  private birthDate?: Date;
  private role: Role;
  private createdAt?: Date;
  private updatedAt?: Date;

  private constructor(name: string, email: string, password: string, role: Role, phoneNumber?: string, birthDate?: Date, id?: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.phoneNumber = phoneNumber
    this.birthDate = birthDate
    this.role = role
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static create(name: string, email: string, password: string, role: Role, phoneNumber?: string, birthDate?: Date, id?: string, createdAt?: Date, updatedAt?: Date) {
    if(name.length<3) throw new Error("Name must be longer than 3 letters");
    if(password.length<6) throw new Error("Password must be at least 6 characters long");
    return new User(name, email, password, role, phoneNumber, birthDate, id, createdAt, updatedAt);
  }

  public updateData(data: UpdateUserData) {
    if (data.name !== undefined) {
      if (data.name.length < 3) throw new Error('Name must be longer than 3 letters');
      this.name = data.name;
    }

    if (data.email !== undefined) {
      this.email = data.email.toLowerCase().trim();
    }

    if (data.password !== undefined) {
      if (data.password.length < 6) throw new Error('Password must be at least 6 characters long');
      this.password = data.password;
    }

    if (data.phoneNumber !== undefined) {
      this.phoneNumber = data.phoneNumber;
    }
  }

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getEmail() {
    return this.email;
  }
  getPassword() {
    return this.password;
  }
  getPhoneNumber() {
    return this.phoneNumber;
  }
  getBirthDate() {
    return this.birthDate;
  }
  getRole() {
    return this.role;
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }
}
