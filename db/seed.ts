import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import sampleData from './sample-data';



const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log('Database seeded successfully');
}
// console.log('URL exists:', !!process.env.DATABASE_URL_UNPOOLED);
// console.log(process.env.DATABASE_URL_UNPOOLED);

main().catch(console.error);
