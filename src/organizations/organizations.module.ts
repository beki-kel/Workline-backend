import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service.js';
import { OrganizationsController } from './organizations.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
import { OrgMemberGuard } from '../common/guards/org-member.guard.js';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard.js';

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationsController],
    providers: [OrganizationsService, OrgMemberGuard, OrgOwnerGuard],
    exports: [OrganizationsService],
})
export class OrganizationsModule { }
