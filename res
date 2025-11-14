enum Role{
 DOCTOR
 CLIENT 
}

model User {
  id    String     @id @default(uuid()) 
  name  String?
  email String @unique
  password String 
  role Role
  createAt DateTime @default(now())
}