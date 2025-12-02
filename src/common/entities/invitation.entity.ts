import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '../enums/member-role.enum.js';

export class InvitationEntity {
    @ApiProperty({ example: 'clx1234567890', description: 'Unique invitation ID' })
    id: string;

    @ApiProperty({ example: 'invitee@example.com', description: 'Email address of invited user' })
    email: string;

    @ApiProperty({ example: 'clx1234567890', description: 'Organization ID' })
    organizationId: string;

    @ApiProperty({ enum: MemberRole, example: MemberRole.MEMBER, description: 'Role to be assigned' })
    role: MemberRole;

    @ApiProperty({ example: 'abc123xyz789', description: 'Unique invitation token' })
    token: string;

    @ApiProperty({ example: '2024-12-31T23:59:59.000Z', description: 'Expiration date' })
    expiresAt: Date;

    @ApiProperty({ example: false, description: 'Whether invitation has been accepted' })
    accepted: boolean;

    @ApiProperty({ example: 'clx1234567890', description: 'ID of user who created invitation' })
    createdById: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
    createdAt: Date;
}
