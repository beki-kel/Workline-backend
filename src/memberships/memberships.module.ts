import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController, OwnershipController } from './memberships.controller';
import { PrismaModule } from '../database/prisma.module';
import { OrgMemberGuard } from '../common/guards/org-member.guard';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard';

@Module({
    imports: [PrismaModule],
    controllers: [MembershipsController, OwnershipController],
    providers: [MembershipsService, OrgMemberGuard, OrgOwnerGuard],
    exports: [MembershipsService],
})
export class MembershipsModule { }
