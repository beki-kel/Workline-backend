import { Injectable } from '@nestjs/common';
import { auth } from '../config/auth.config';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class InvitationsService {
    constructor(private readonly prisma: PrismaService) { }
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
        console.log('🔍 Finding invitations for organization:', organizationId);

        const org = await auth.api.getFullOrganization({
            query: {
                organizationId: organizationId,
            },
            headers,
        });

        console.log('📦 Organization data:', JSON.stringify(org, null, 2));
        console.log('📧 Invitations found:', org?.invitations?.length || 0);

        // Filter for pending invitations if needed, or return all
        // Better Auth invitations usually have status
        return org?.invitations || [];
    }

    /**
     * Find invitations by organization ID (alternative method)
     */
    async findByOrganization(organizationId: string, headers: Headers) {
        return this.findPendingByOrganization(organizationId, headers);
    }

    /**
     * Find invitations by user email
     */
    async findByUserEmail(email: string, headers: Headers) {
        console.log('🔍 Finding invitations for email:', email);

        // Get all organizations the user has access to
        const session = await auth.api.getSession({ headers });

        if (!session?.user) {
            console.log('❌ No session found');
            return [];
        }

        // Query the database directly for invitations by email
        try {
            const invitations = await this.prisma.invitation.findMany({
                where: {
                    email: email,
                    status: 'pending', // Only return pending invitations
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            console.log('📧 Invitations found:', invitations.length);
            console.log('📦 Invitation data:', JSON.stringify(invitations, null, 2));

            return invitations;
        } catch (error) {
            console.error('❌ Error fetching invitations by email:', error);
            return [];
        }
    }
}
