import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SectionType, OutlineStatus } from '@prisma/client';

export class CreateOutlineDto {
    @ApiProperty({ description: 'Header of the outline section' })
    @IsString()
    header: string;

    @ApiProperty({ enum: SectionType, description: 'Type of the section' })
    @IsEnum(SectionType)
    sectionType: SectionType;

    @ApiProperty({ enum: OutlineStatus, description: 'Status of the outline', required: false, default: OutlineStatus.PENDING })
    @IsEnum(OutlineStatus)
    @IsOptional()
    status?: OutlineStatus;

    @ApiProperty({ description: 'Target word count or metric' })
    @IsInt()
    target: number;

    @ApiProperty({ description: 'Limit word count or metric' })
    @IsInt()
    limit: number;

    @ApiProperty({ description: 'ID of the assigned reviewer (User ID)' })
    @IsString()
    reviewerId: string;
}
