import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get tenant by code (zapco, aquaflow, greenleaf)
 */
export async function getTenant(code: string) {
  return prisma.utilityTenant.findUnique({
    where: { code },
  });
}

/**
 * Find customer by phone or account number
 */
export async function findCustomer(
  tenantCode: string,
  identifier: 'phone' | 'accountNumber',
  value: string
) {
  const tenant = await getTenant(tenantCode);
  if (!tenant) return null;

  if (identifier === 'phone') {
    return prisma.utilityCustomer.findFirst({
      where: {
        tenantId: tenant.id,
        phone: {
          contains: value,
        },
      },
    });
  } else {
    return prisma.utilityCustomer.findFirst({
      where: {
        tenantId: tenant.id,
        accountNumber: value,
      },
    });
  }
}

/**
 * Get bills for a customer, sorted by date descending
 */
export async function getBills(tenantCode: string, accountNumber: string, limit?: number) {
  const tenant = await getTenant(tenantCode);
  if (!tenant) return [];

  const bills = await prisma.utilityBill.findMany({
    where: {
      tenantId: tenant.id,
      accountNumber,
    },
    orderBy: {
      billDate: 'desc',
    },
    take: limit,
  });

  return bills;
}

/**
 * Get most recent bill for an account
 */
export async function getLatestBill(tenantCode: string, accountNumber: string) {
  const bills = await getBills(tenantCode, accountNumber, 1);
  return bills[0] || null;
}

export { prisma };
