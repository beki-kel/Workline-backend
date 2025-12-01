import { Injectable, NotFoundException } from '@nestjs/common';
import { auth } from '../config/auth.config';

@Injectable()
export class MembershipsService {
    /**
     * Find all members of an organization
     */
    async findAllByOrganization(organizationId: string, headers: Headers) {
        const result = await auth.api.getFullOrganization({
            query: {
                organizationId: organizationId,
            },
            headers,
        });
        return result?.members || [];
    }

    /**
     * Remove a member from an organization
     */
    async removeMember(organizationId: string, userId: string, headers: Headers) {
        const memberId = await this.getMemberId(organizationId, userId, headers);

        const result = await auth.api.removeMember({
            body: {
                memberIdOrEmail: memberId,
            },
            headers,
        });
        return result;
    }

    /**
     * Transfer ownership of an organization
     */
    async transferOwnership(organizationId: string, newOwnerId: string, currentOwnerId: string, headers: Headers) {
        const newOwnerMemberId = await this.getMemberId(organizationId, newOwnerId, headers);
        const currentOwnerMemberId = await this.getMemberId(organizationId, currentOwnerId, headers);

        // 1. Promote new owner
        await auth.api.updateMemberRole({
            body: {
                memberId: newOwnerMemberId,
                role: 'owner',
            },
            headers,
        });

        // 2. Demote current owner to member
        await auth.api.updateMemberRole({
            body: {
                memberId: currentOwnerMemberId,
                role: 'member',
            },
            headers,
        });

        return { message: 'Ownership transferred successfully' };
    }

    /**
     * Update a member's role
     */
    async updateRole(organizationId: string, userId: string, role: string, headers: Headers) {
        const memberId = await this.getMemberId(organizationId, userId, headers);

        const result = await auth.api.updateMemberRole({
            body: {
                memberId,
                role: role as 'member' | 'admin' | 'owner',
            },
            headers,
        });
        return result;
    }

    /**
     * Helper to get member ID from user ID
     */
    private async getMemberId(organizationId: string, userId: string, headers: Headers): Promise<string> {
        const org = await auth.api.getFullOrganization({
            query: {
                organizationId: organizationId,
            },
            headers,
        });

        const member = org?.members.find((m: any) => m.userId === userId);
        if (!member) {
            throw new NotFoundException('Member not found');
        }

        return member.id;
    }
}
