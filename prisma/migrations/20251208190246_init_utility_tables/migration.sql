-- CreateTable
CREATE TABLE "utility_tenant" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utility_tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utility_customer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "full_name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "service_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "account_status" TEXT NOT NULL,
    "current_balance" DOUBLE PRECISION NOT NULL,
    "ssn_last4" TEXT,
    "enrollment_date" TEXT,
    "autopay_enrolled" BOOLEAN,
    "paperless_billing" BOOLEAN,
    "preferred_contact" TEXT,
    "vip_tier" TEXT,
    "customer_notes" TEXT,
    "last_payment_date" TEXT,
    "last_payment_amount" DOUBLE PRECISION,
    "account_opened" TEXT,
    "account_type" TEXT,
    "auto_payment" BOOLEAN,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "water_hardness_preference" TEXT,
    "special_instructions" TEXT,

    CONSTRAINT "utility_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utility_bill" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "bill_id" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "bill_date" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "previous_balance" DOUBLE PRECISION NOT NULL,
    "current_charges" DOUBLE PRECISION NOT NULL,
    "payment_status" TEXT NOT NULL,
    "paid_date" TEXT,
    "paid_amount" DOUBLE PRECISION,
    "billing_period_start" TEXT NOT NULL,
    "billing_period_end" TEXT NOT NULL,
    "meter_number" TEXT NOT NULL,
    "meter_reading_start" DOUBLE PRECISION NOT NULL,
    "meter_reading_end" DOUBLE PRECISION NOT NULL,
    "estimated_reading" BOOLEAN,
    "late_fees" DOUBLE PRECISION,
    "kwh_used" DOUBLE PRECISION,
    "kwh_rate" DOUBLE PRECISION,
    "delivery_charge" DOUBLE PRECISION,
    "utility_tax" DOUBLE PRECISION,
    "renewable_energy_credit" DOUBLE PRECISION,
    "peak_usage_surcharge" DOUBLE PRECISION,
    "weather_adjustment" DOUBLE PRECISION,
    "payments_received" DOUBLE PRECISION,
    "water_usage_gallons" DOUBLE PRECISION,
    "water_rate_per_1000gal" DOUBLE PRECISION,
    "base_service_fee" DOUBLE PRECISION,
    "sewer_charge" DOUBLE PRECISION,
    "stormwater_fee" DOUBLE PRECISION,
    "infrastructure_surcharge" DOUBLE PRECISION,
    "late_payment_fee" DOUBLE PRECISION,
    "leak_detected" BOOLEAN,
    "leak_description" TEXT,
    "usage_anomaly" BOOLEAN,
    "anomaly_notes" TEXT,
    "conservation_credit" DOUBLE PRECISION,
    "special_notes" TEXT,
    "status_notes" TEXT,

    CONSTRAINT "utility_bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utility_tenant_code_key" ON "utility_tenant"("code");

-- CreateIndex
CREATE INDEX "utility_customer_tenant_id_idx" ON "utility_customer"("tenant_id");

-- CreateIndex
CREATE INDEX "utility_customer_phone_idx" ON "utility_customer"("phone");

-- CreateIndex
CREATE INDEX "utility_customer_account_number_idx" ON "utility_customer"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "utility_customer_tenant_id_customer_id_key" ON "utility_customer"("tenant_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "utility_customer_tenant_id_account_number_key" ON "utility_customer"("tenant_id", "account_number");

-- CreateIndex
CREATE INDEX "utility_bill_tenant_id_idx" ON "utility_bill"("tenant_id");

-- CreateIndex
CREATE INDEX "utility_bill_customer_id_idx" ON "utility_bill"("customer_id");

-- CreateIndex
CREATE INDEX "utility_bill_account_number_idx" ON "utility_bill"("account_number");

-- CreateIndex
CREATE INDEX "utility_bill_bill_date_idx" ON "utility_bill"("bill_date");

-- CreateIndex
CREATE UNIQUE INDEX "utility_bill_tenant_id_bill_id_key" ON "utility_bill"("tenant_id", "bill_id");

-- AddForeignKey
ALTER TABLE "utility_customer" ADD CONSTRAINT "utility_customer_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "utility_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utility_bill" ADD CONSTRAINT "utility_bill_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "utility_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utility_bill" ADD CONSTRAINT "utility_bill_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "utility_customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
