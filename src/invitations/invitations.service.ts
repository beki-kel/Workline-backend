import { Injectable } from '@nestjs/common';
import { auth } from '../config/auth.config';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationsService {
    /**
     * Create a new invitation
     */
    async create(organizationId: string, createInvitationDto: CreateInvitationDto, headers: Headers) {
        const result = await auth.api.createInvitation({
            body: {
                organizationId,
                email: createInvitationDto.email,
                role: (createInvitationDto.role || 'member') as 'member' | 'admin' | 'owner',
            },
            headers,
        });
        return result;
    }

    /**
     * Accept an invitation
     */
    async accept(invitationId: string, headers: Headers) {
        const result = await auth.api.acceptInvitation({
            body: {
                invitationId,
            },
            headers,
        });
        return result;
    }

    /**
     * Find pending invitations for an organization
     */
    async findPendingByOrganization(organizationId: string, headers: Headers) {
        const org = await auth.api.getFullOrganization({
            query: {
                organizationId: organizationId,
            },
            headers,
        });

        // Filter for pending invitations if needed, or return all
        // Better Auth invitations usually have status
        return org?.invitations || [];
    }
}
