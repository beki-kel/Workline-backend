import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { auth } from '../../config/auth.config';

@Injectable()
export class OrgMemberGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const organizationId = request.params.id || request.params.organizationId;
        const user = request.user;

        if (!user || !organizationId) {
            return false;
        }

        // Check if active organization matches
        if (request.session?.activeOrganizationId === organizationId) {
            return true;
        }

        try {
            // Check membership via Better Auth API
            const headers = new Headers(request.headers as any);
            const org = await auth.api.getFullOrganization({
                query: {
                    orgId: organizationId,
                },
                headers,
            });

            const isMember = org?.members.some((m: any) => m.userId === user.id);
            if (!isMember) {
                throw new ForbiddenException('You are not a member of this organization');
            }

            return true;
        } catch (error) {
            throw new ForbiddenException('Access denied');
        }
    }
}
