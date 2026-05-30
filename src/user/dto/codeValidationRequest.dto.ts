import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CodeValidationRequestDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'chis@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase())
    email: string;
    
    @ApiProperty({
        description: 'Verification code sent to the user',
        example: '123456',
    })
    @IsNotEmpty()
    code: string;
}