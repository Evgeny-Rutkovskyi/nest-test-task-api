import { defineConfig } from 'drizzle-kit';
import { config } from './env.config';


export default defineConfig({
    schema: './src/drizzle/schema/**.schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: config.db_url
    }
})