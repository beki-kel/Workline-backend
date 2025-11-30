import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { PrismaModule } from '../database/prisma.module';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard';

@Module({
    imports: [PrismaModule],
    controllers: [InvitationsController],
    providers: [InvitationsService, OrgOwnerGuard],
    exports: [InvitationsService],
})
export class InvitationsModule { }
