import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
    @ApiProperty({ example: 'clx1234567890', description: 'Unique user ID' })
    id: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name', nullable: true })
    name: string | null;

    @ApiProperty({ example: true, description: 'Whether email has been verified' })
    emailVerified: boolean;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User profile image', nullable: true })
    image: string | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Account creation date' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
    updatedAt: Date;
}
