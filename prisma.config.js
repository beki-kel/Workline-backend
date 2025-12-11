// Prisma 7 Config
// Using JS to avoid TypeScript runtime dependencies in production
export default {
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL,
    },
};
