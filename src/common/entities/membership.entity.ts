import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '../enums/member-role.enum';
import { UserEntity } from './user.entity';
import { OrganizationEntity } from './organization.entity';

export class MembershipEntity {
    @ApiProperty({ example: 'clx1234567890', description: 'Unique membership ID' })
    id: string;

    @ApiProperty({ example: 'clx1234567890', description: 'User ID' })
    userId: string;

    @ApiProperty({ example: 'clx1234567890', description: 'Organization ID' })
    organizationId: string;

    @ApiProperty({ enum: MemberRole, example: MemberRole.MEMBER, description: 'Member role in organization' })
    role: MemberRole;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Date joined organization' })
    joinedAt: Date;

    @ApiProperty({ type: () => UserEntity, required: false })
    user?: UserEntity;

    @ApiProperty({ type: () => OrganizationEntity, required: false })
    organization?: OrganizationEntity;
}
