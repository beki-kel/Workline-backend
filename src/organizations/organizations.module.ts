import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaModule } from '../database/prisma.module';
import { OrgMemberGuard } from '../common/guards/org-member.guard';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard';

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationsController],
    providers: [OrganizationsService, OrgMemberGuard, OrgOwnerGuard],
    exports: [OrganizationsService],
})
export class OrganizationsModule { }
