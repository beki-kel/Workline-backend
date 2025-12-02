import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import { MembershipsController, OwnershipController } from './memberships.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
import { OrgMemberGuard } from '../common/guards/org-member.guard.js';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard.js';

@Module({
    imports: [PrismaModule],
    controllers: [MembershipsController, OwnershipController],
    providers: [MembershipsService, OrgMemberGuard, OrgOwnerGuard],
    exports: [MembershipsService],
})
export class MembershipsModule { }
