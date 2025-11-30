import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class CreateOrganizationDto {
    @ApiProperty({
        example: 'Acme Corporation',
        description: 'Organization name',
        minLength: 3,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Organization name must be at least 3 characters long' })
    name: string;

    @ApiProperty({
        example: 'acme-corporation',
        description: 'URL-friendly slug (auto-generated if not provided)',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9-]+$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens'
    })
    slug?: string;

    @ApiProperty({
        example: 'Leading provider of innovative solutions',
        description: 'Organization description',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
