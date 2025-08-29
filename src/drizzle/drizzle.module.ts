import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { config } from '../configs/env.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/schema';
import { DrizzleDB } from './types/drizzle.type';

export const DRIZZLE = Symbol(config.provide_db);

const pool = new Pool({
  connectionString: config.db_url,
})

const drizzleProvider = {
  provide: DRIZZLE,
  useValue: drizzle(pool, {schema}) as DrizzleDB
}

@Module({
    providers: [drizzleProvider],
    exports: [drizzleProvider]
})
export class DrizzleModule {}
