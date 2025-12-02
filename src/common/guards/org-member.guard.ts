import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { auth } from '../../config/auth.config';

@Injectable()
export class OrgMemberGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const organizationId = request.params.organizationId; // Fixed: only use organizationId
        const user = request.user;
        const session = request.session;

        if (!user || !organizationId) {
            throw new ForbiddenException('Authentication required');
        }

        // Check if the active organization matches the requested organizationId
        // Better Auth sets activeOrganizationId in the session
        if (session?.activeOrganizationId === organizationId) {
            // Attach organization context to request for controllers
            request.organizationId = organizationId;
            request.userRole = session.role || 'member';
            request.isOrgOwner = session.role === 'owner';
            request.isOrgAdmin = session.role === 'admin' || session.role === 'owner';
            return true;
        }

        // If active organization doesn't match, check if user is a member
        try {
            const headers = new Headers(request.headers as any);
            const org = await auth.api.getFullOrganization({
                query: {
                    organizationId: organizationId,
                },
                headers,
            });

            const member = org?.members.find((m: any) => m.userId === user.id);
            if (!member) {
                throw new ForbiddenException('You are not a member of this organization');
            }

            // Attach member role to request for use in controllers
            request.organizationId = organizationId;
            request.userRole = member.role;
            request.isOrgOwner = member.role === 'owner';
            request.isOrgAdmin = member.role === 'admin' || member.role === 'owner';

            return true;
        } catch (error) {
            console.error('❌ OrgMemberGuard Error:', error);
            console.error('User ID:', user.id);
            console.error('Organization ID:', organizationId);
            console.error('Error details:', error.message || error);
            throw new ForbiddenException('Access denied');
        }
    }
}
