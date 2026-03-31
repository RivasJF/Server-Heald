import { Request } from 'express';
import { Role } from 'generated/prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}
