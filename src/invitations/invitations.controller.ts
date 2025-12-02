import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OrgOwnerGuard } from '../common/guards/org-owner.guard';
import { OrgAdminGuard } from '../common/guards/org-admin.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Invitations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Post('organizations/:organizationId/invitations')
    @UseGuards(OrgAdminGuard)
    @ApiOperation({ summary: 'Send an invitation to join organization (Admin/Owner only)' })
    @ApiResponse({ status: 201, description: 'The invitation has been successfully sent.' })
    create(
        @Param('organizationId') organizationId: string,
        @Body() createInvitationDto: CreateInvitationDto,
        @CurrentUser() user: any,
        @Req() req: Request,
    ) {
        const headers = new Headers(req.headers as any);
        return this.invitationsService.create(organizationId, createInvitationDto, headers);
    }

    @Get('organizations/:organizationId/invitations')
    @UseGuards(OrgOwnerGuard)
    @ApiOperation({ summary: 'List pending invitations' })
    @ApiResponse({ status: 200, description: 'Return all pending invitations.' })
    findAll(@Param('organizationId') organizationId: string, @Req() req: Request) {
        console.log('📞 GET /organizations/:organizationId/invitations called with:', organizationId);
        const headers = new Headers(req.headers as any);
        return this.invitationsService.findPendingByOrganization(organizationId, headers);
    }

    @Get('invitations/user')
    @ApiOperation({ summary: 'Get invitations for current user' })
    @ApiResponse({ status: 200, description: 'Return all invitations for the current user.' })
    findByUser(@Req() req: Request) {
        console.log('📞 GET /invitations/user called');
        console.log('👤 User:', req.user);
        const headers = new Headers(req.headers as any);
        const userEmail = req.user?.email;
        console.log('📧 User email:', userEmail);
        if (!userEmail) {
            console.log('❌ No user email found');
            return [];
        }
        return this.invitationsService.findByUserEmail(userEmail, headers);
    }

    @Post('invitations/:id/accept')
    @ApiOperation({ summary: 'Accept an invitation' })
    @ApiResponse({ status: 201, description: 'The invitation has been accepted.' })
    accept(@Param('id') id: string, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.invitationsService.accept(id, headers);
    }
}
