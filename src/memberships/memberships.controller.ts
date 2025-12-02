import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import { TransferOwnershipDto } from './dto/transfer-ownership.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { OrgMemberGuard } from '../common/guards/org-member.guard.js';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Memberships')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('organizations/:organizationId')
export class MembershipsController {
    constructor(private readonly membershipsService: MembershipsService) { }

    @Get('members')
    @UseGuards(OrgMemberGuard)
    @ApiOperation({ summary: 'List organization members' })
    @ApiResponse({ status: 200, description: 'Return all members of the organization.' })
    findAll(@Param('organizationId') organizationId: string, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.membershipsService.findAllByOrganization(organizationId, headers);
    }

    @Delete('members/:userId')
    @UseGuards(OrgOwnerGuard)
    @ApiOperation({ summary: 'Remove a member from the organization' })
    @ApiResponse({ status: 200, description: 'The member has been successfully removed.' })
    remove(@Param('organizationId') organizationId: string, @Param('userId') userId: string, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.membershipsService.removeMember(organizationId, userId, headers);
    }

    @Patch('members/:userId')
    @UseGuards(OrgOwnerGuard)
    @ApiOperation({ summary: 'Update a member\'s role' })
    @ApiResponse({ status: 200, description: 'The member role has been successfully updated.' })
    updateRole(
        @Param('organizationId') organizationId: string,
        @Param('userId') userId: string,
        @Body('role') role: string,
        @Req() req: Request,
    ) {
        const headers = new Headers(req.headers as any);
        return this.membershipsService.updateRole(organizationId, userId, role, headers);
    }
}

@ApiTags('Memberships')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('organizations/:organizationId')
export class OwnershipController {
    constructor(private readonly membershipsService: MembershipsService) { }

    @Patch('transfer-ownership')
    @UseGuards(OrgOwnerGuard)
    @ApiOperation({ summary: 'Transfer organization ownership' })
    @ApiResponse({ status: 200, description: 'Ownership has been successfully transferred.' })
    transferOwnership(
        @Param('organizationId') organizationId: string,
        @Body() transferOwnershipDto: TransferOwnershipDto,
        @CurrentUser() user: any,
        @Req() req: Request,
    ) {
        const headers = new Headers(req.headers as any);
        return this.membershipsService.transferOwnership(
            organizationId,
            transferOwnershipDto.newOwnerId,
            user.id,
            headers,
        );
    }
}
