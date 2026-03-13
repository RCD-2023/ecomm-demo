import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import sampleData from './sample-data';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });

  console.log('Database seeded successfully');
}

main().catch(console.error);
