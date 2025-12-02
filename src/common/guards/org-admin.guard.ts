import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { auth } from '../../config/auth.config';

@Injectable()
export class OrgAdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const organizationId = request.params.id || request.params.organizationId;
        const user = request.user;

        if (!user || !organizationId) {
            return false;
        }

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

            // Allow both admin and owner roles
            if (member.role !== 'admin' && member.role !== 'owner') {
                throw new ForbiddenException('You must be an admin or owner of this organization');
            }

            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new ForbiddenException('Access denied');
        }
    }
}
