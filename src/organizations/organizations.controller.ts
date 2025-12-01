import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new organization' })
    @ApiResponse({ status: 201, description: 'The organization has been successfully created.' })
    create(@Body() createOrganizationDto: CreateOrganizationDto, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.organizationsService.create(createOrganizationDto, headers);
    }

    @Get()
    @ApiOperation({ summary: 'List user organizations' })
    @ApiResponse({ status: 200, description: 'Return all organizations the user belongs to.' })
    findAll(@Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.organizationsService.findAllByUser(headers);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get organization details' })
    @ApiResponse({ status: 200, description: 'Return the organization details.' })
    findOne(@Param('id') id: string, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.organizationsService.findOne(id, headers);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update organization' })
    @ApiResponse({ status: 200, description: 'The organization has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.organizationsService.update(id, updateOrganizationDto, headers);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete organization' })
    @ApiResponse({ status: 200, description: 'The organization has been successfully deleted.' })
    remove(@Param('id') id: string, @Req() req: Request) {
        const headers = new Headers(req.headers as any);
        return this.organizationsService.remove(id, headers);
    }
}
