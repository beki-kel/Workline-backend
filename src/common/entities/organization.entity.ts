import { ApiProperty } from '@nestjs/swagger';

export class OrganizationEntity {
    @ApiProperty({ example: 'clx1234567890', description: 'Unique organization ID' })
    id: string;

    @ApiProperty({ example: 'Acme Corporation', description: 'Organization name' })
    name: string;

    @ApiProperty({ example: 'acme-corporation', description: 'Unique URL-friendly slug' })
    slug: string;

    @ApiProperty({ example: 'Leading provider of innovative solutions', description: 'Organization description', nullable: true })
    description: string | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
    updatedAt: Date;
}
