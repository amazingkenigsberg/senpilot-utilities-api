import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { zapco_customers, zapco_bills, aquaflow_customers, aquaflow_bills } from './csr-test-database.js';

const prisma = new PrismaClient({});

async function main() {
  console.log('Starting database seed...');

  // Create tenants
  console.log('Creating tenants...');
  const zapcoTenant = await prisma.utilityTenant.upsert({
    where: { code: 'zapco' },
    update: {},
    create: {
      code: 'zapco',
      name: 'ZapCo Electric',
      type: 'electric',
      description: 'Portland-based electric utility with direct database access',
    },
  });

  const aquaflowTenant = await prisma.utilityTenant.upsert({
    where: { code: 'aquaflow' },
    update: {},
    create: {
      code: 'aquaflow',
      name: 'AquaFlow Water',
      type: 'water',
      description: 'Water utility with direct database access',
    },
  });

  const greenleafTenant = await prisma.utilityTenant.upsert({
    where: { code: 'greenleaf' },
    update: {},
    create: {
      code: 'greenleaf',
      name: 'GreenLeaf Energy',
      type: 'gas',
      description: 'Natural gas utility with external API access',
    },
  });

  console.log('✅ Tenants created');

  // Seed ZapCo customers and bills
  console.log('\nSeeding ZapCo Electric data...');
  for (const customer of zapco_customers) {
    const dbCustomer = await prisma.utilityCustomer.upsert({
      where: {
        tenantId_customerId: {
          tenantId: zapcoTenant.id,
          customerId: customer.customer_id,
        },
      },
      update: {},
      create: {
        tenantId: zapcoTenant.id,
        customerId: customer.customer_id,
        accountNumber: customer.account_number,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        email: customer.email,
        serviceAddress: customer.service_address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        accountStatus: customer.account_status,
        currentBalance: customer.current_balance,
        // ZapCo-specific fields
        ssnLast4: customer.ssn_last4,
        enrollmentDate: customer.enrollment_date,
        autopayEnrolled: customer.autopay_enrolled,
        paperlessBilling: customer.paperless_billing,
        preferredContact: customer.preferred_contact,
        vipTier: customer.vip_tier,
        customerNotes: customer.customer_notes,
        lastPaymentDate: customer.last_payment_date,
        lastPaymentAmount: customer.last_payment_amount,
      },
    });

    // Seed bills for this customer
    const customerBills = zapco_bills.filter(b => b.customer_id === customer.customer_id);
    for (const bill of customerBills) {
      await prisma.utilityBill.upsert({
        where: {
          tenantId_billId: {
            tenantId: zapcoTenant.id,
            billId: bill.bill_id,
          },
        },
        update: {},
        create: {
          tenantId: zapcoTenant.id,
          customerId: dbCustomer.id,
          billId: bill.bill_id,
          accountNumber: bill.account_number,
          billDate: bill.bill_date,
          dueDate: bill.due_date,
          totalAmount: bill.total_amount_due,
          previousBalance: bill.previous_balance,
          currentCharges: bill.current_charges,
          paymentStatus: bill.payment_status,
          paidDate: bill.paid_date,
          paidAmount: bill.paid_amount,
          billingPeriodStart: bill.billing_period_start,
          billingPeriodEnd: bill.billing_period_end,
          meterNumber: bill.meter_number,
          meterReadingStart: bill.meter_reading_start,
          meterReadingEnd: bill.meter_reading_end,
          estimatedReading: bill.estimated_reading,
          // ZapCo-specific bill fields
          lateFees: bill.late_fees,
          kwhUsed: bill.kwh_used,
          kwhRate: bill.kwh_rate,
          deliveryCharge: bill.delivery_charge,
          utilityTax: bill.utility_tax,
          renewableEnergyCredit: bill.renewable_energy_credit,
          peakUsageSurcharge: bill.peak_usage_surcharge,
          weatherAdjustment: bill.weather_adjustment,
          specialNotes: bill.special_notes,
        },
      });
    }
  }
  console.log(`✅ Seeded ${zapco_customers.length} ZapCo customers and ${zapco_bills.length} bills`);

  // Seed AquaFlow customers and bills
  console.log('\nSeeding AquaFlow Water data...');
  for (const customer of aquaflow_customers) {
    const dbCustomer = await prisma.utilityCustomer.upsert({
      where: {
        tenantId_customerId: {
          tenantId: aquaflowTenant.id,
          customerId: customer.customer_id,
        },
      },
      update: {},
      create: {
        tenantId: aquaflowTenant.id,
        customerId: customer.customer_id,
        accountNumber: customer.account_number,
        fullName: customer.full_name,
        phone: customer.contact_phone,
        email: customer.contact_email,
        serviceAddress: customer.service_location,
        city: customer.city,
        state: customer.state,
        zip: customer.postal_code,
        accountStatus: customer.service_status,
        currentBalance: customer.current_balance,
        // AquaFlow-specific fields
        accountOpened: customer.account_opened,
        accountType: customer.account_type,
        autoPayment: customer.auto_payment,
        emergencyContactName: customer.emergency_contact_name,
        emergencyContactPhone: customer.emergency_contact_phone,
        waterHardnessPreference: customer.water_hardness_preference,
        specialInstructions: customer.special_instructions,
      },
    });

    // Seed bills for this customer
    const customerBills = aquaflow_bills.filter(b => b.customer_id === customer.customer_id);
    for (const bill of customerBills) {
      await prisma.utilityBill.upsert({
        where: {
          tenantId_billId: {
            tenantId: aquaflowTenant.id,
            billId: bill.bill_id,
          },
        },
        update: {},
        create: {
          tenantId: aquaflowTenant.id,
          customerId: dbCustomer.id,
          billId: bill.bill_id,
          accountNumber: bill.account_number,
          billDate: bill.statement_date,
          dueDate: bill.due_date,
          totalAmount: bill.total_charges,
          previousBalance: bill.previous_balance,
          currentCharges: bill.total_charges - bill.previous_balance,
          paymentStatus: bill.payment_status,
          paidDate: bill.payments_received > 0 ? bill.statement_date : null,
          paidAmount: bill.payments_received > 0 ? bill.payments_received : null,
          billingPeriodStart: bill.billing_start,
          billingPeriodEnd: bill.billing_end,
          meterNumber: bill.meter_number,
          meterReadingStart: bill.meter_reading_previous,
          meterReadingEnd: bill.meter_reading_current,
          estimatedReading: false,
          // AquaFlow-specific bill fields
          paymentsReceived: bill.payments_received,
          waterUsageGallons: bill.water_usage_gallons,
          waterRatePer1000gal: bill.water_rate_per_1000gal,
          baseServiceFee: bill.base_service_fee,
          sewerCharge: bill.sewer_charge,
          stormwaterFee: bill.stormwater_fee,
          infrastructureSurcharge: bill.infrastructure_surcharge,
          latePaymentFee: bill.late_payment_fee,
          leakDetected: bill.leak_detected,
          leakDescription: null,
          usageAnomaly: bill.usage_anomaly,
          anomalyNotes: null,
          conservationCredit: bill.conservation_credit,
          statusNotes: bill.status_notes,
        },
      });
    }
  }
  console.log(`✅ Seeded ${aquaflow_customers.length} AquaFlow customers and ${aquaflow_bills.length} bills`);

  console.log('\n✨ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
