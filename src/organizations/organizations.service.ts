import { Injectable } from '@nestjs/common';
import { auth } from '../config/auth.config.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';

@Injectable()
export class OrganizationsService {
    /**
     * Create a new organization
     */
    async create(createOrganizationDto: CreateOrganizationDto, headers: Headers) {
        const { name, slug, description } = createOrganizationDto;

        const result = await auth.api.createOrganization({
            body: {
                name,
                slug: (slug || this.generateSlug(name)) as string,
                metadata: { description: description || '' },
            },
            headers,
        });

        return result;
    }

    /**
     * Find all organizations for a user
     */
    async findAllByUser(headers: Headers) {
        console.log('🏢 Fetching organizations for user...');
        const result = await auth.api.listOrganizations({
            headers,
        });
        console.log('✅ Organizations fetched:', result ? 'success' : 'empty');
        console.log('📊 Org count:', Array.isArray(result) ? result.length : 'not an array');
        return result;
    }

    /**
     * Find one organization by ID
     */
    async findOne(id: string, headers: Headers) {
        const result = await auth.api.getFullOrganization({
            query: {
                organizationId: id,
            },
            headers,
        });
        return result;
    }

    /**
     * Update organization
     */
    async update(id: string, updateOrganizationDto: UpdateOrganizationDto, headers: Headers) {
        const result = await auth.api.updateOrganization({
            body: {
                organizationId: id,
                data: {
                    name: updateOrganizationDto.name,
                    slug: updateOrganizationDto.slug,
                    metadata: { description: updateOrganizationDto.description },
                },
            },
            headers,
        });
        return result;
    }

    /**
     * Delete organization
     */
    async remove(id: string, headers: Headers) {
        const result = await auth.api.deleteOrganization({
            body: {
                organizationId: id,
            },
            headers,
        });
        return result;
    }

    /**
     * Generate URL-friendly slug from name
     */
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}
