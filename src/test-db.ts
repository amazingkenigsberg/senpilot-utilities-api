import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const zapcoTenant = await prisma.utilityTenant.findUnique({
    where: { code: 'zapco' },
  });

  console.log('ZapCo Tenant:', zapcoTenant);

  const customers = await prisma.utilityCustomer.findMany({
    where: {
      tenantId: zapcoTenant?.id,
    },
    select: {
      phone: true,
      accountNumber: true,
      firstName: true,
      lastName: true,
      fullName: true,
    },
    take: 5,
  });

  console.log('\nZapCo Customers:');
  customers.forEach((c, i) => {
    console.log(`${i + 1}. Phone: ${c.phone}, Account: ${c.accountNumber}, Name: ${c.firstName} ${c.lastName || c.fullName}`);
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
