import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'chis@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase())
    email: string;

    @ApiProperty({
        description: 'New password for the user',
        example: 'newPassword123',
    })
    @IsNotEmpty()
    newPassword: string;
}