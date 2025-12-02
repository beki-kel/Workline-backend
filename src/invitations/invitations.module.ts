import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { PrismaModule } from '../database/prisma.module';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard';
import { OrgAdminGuard } from '../common/guards/org-admin.guard';

@Module({
    imports: [PrismaModule],
    controllers: [InvitationsController],
    providers: [InvitationsService, OrgOwnerGuard, OrgAdminGuard],
    exports: [InvitationsService],
})
export class InvitationsModule { }
