import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OutlinesService } from './outlines.service.js';
import { CreateOutlineDto } from './dto/create-outline.dto.js';
import { UpdateOutlineDto } from './dto/update-outline.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { OrgMemberGuard } from '../common/guards/org-member.guard.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Outlines')
@ApiBearerAuth()
@UseGuards(AuthGuard, OrgMemberGuard)
@Controller('/organizations/:organizationId/outlines')
export class OutlinesController {
    constructor(private readonly outlinesService: OutlinesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new outline' })
    @ApiResponse({ status: 201, description: 'The outline has been successfully created.' })
    create(
        @Param('organizationId') organizationId: string,
        @Body() createOutlineDto: CreateOutlineDto,
    ) {
        return this.outlinesService.create(organizationId, createOutlineDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all outlines for organization' })
    @ApiResponse({ status: 200, description: 'Return all outlines.' })
    findAll(@Param('organizationId') organizationId: string) {
        return this.outlinesService.findAll(organizationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get outline details' })
    @ApiResponse({ status: 200, description: 'Return the outline details.' })
    findOne(
        @Param('organizationId') organizationId: string,
        @Param('id') id: string,
    ) {
        return this.outlinesService.findOne(organizationId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update outline' })
    @ApiResponse({ status: 200, description: 'The outline has been successfully updated.' })
    update(
        @Param('organizationId') organizationId: string,
        @Param('id') id: string,
        @Body() updateOutlineDto: UpdateOutlineDto,
    ) {
        return this.outlinesService.update(organizationId, id, updateOutlineDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete outline' })
    @ApiResponse({ status: 200, description: 'The outline has been successfully deleted.' })
    remove(
        @Param('organizationId') organizationId: string,
        @Param('id') id: string,
    ) {
        return this.outlinesService.remove(organizationId, id);
    }
}
