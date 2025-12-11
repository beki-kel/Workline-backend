import 'dotenv/config';
import { defineConfig } from 'prisma/config';

console.log('🔍 Prisma Config: DATABASE_URL loaded:', process.env.DATABASE_URL ? '✅ Found' : '❌ Missing');

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL!,
    },

});
