/**
 * GreenLeaf Energy Co. - External Utility API Database
 * "97% Green. 100% Confusing."
 *
 * This utility has its own quirky API that doesn't match any standard format.
 * Because that's what external partners do.
 */

export interface GreenLeafCustomer {
  cust_uuid: string;
  acct_ref: string;
  name_first: string;
  name_last: string;
  name_middle?: string;
  name_suffix?: string;
  contact_primary_phone: string;
  contact_secondary_phone?: string;
  contact_email_primary: string;
  loc_service_addr: string;
  loc_city: string;
  loc_state_code: string;
  loc_zip_code: string;
  loc_coordinates?: { lat: number; lng: number };
  enrolled_timestamp: string;
  acct_tier: "standard" | "green" | "super_green" | "ultra_green" | "literally_photosynthesis";
  acct_state: "OK" | "SUSPENDED" | "TERMINATED" | "PENDING" | "MEDITATION_REQUIRED";
  billing_auto_pay: boolean;
  billing_electronic_statement: boolean;
  contact_preference: string[];
  customer_since_days: number;
  meditation_score: number;
  plant_parent_level: "novice" | "intermediate" | "expert" | "druid";
  special_requests: string;
  balance_current_cents: number;
  balance_last_updated: string;
}

export interface GreenLeafBill {
  bill_uuid: string;
  cust_uuid: string;
  acct_ref: string;
  cycle_start_date: string;
  cycle_end_date: string;
  generated_date: string;
  payment_due_date: string;
  amount_total_cents: number;
  amount_previous_balance_cents: number;
  amount_current_cycle_cents: number;
  amount_adjustments_cents: number;
  amount_late_charges_cents: number;
  gas_usage_therms: number;
  gas_base_rate_per_therm_cents: number;
  gas_distribution_fee_cents: number;
  gas_transportation_fee_cents: number;
  gas_green_surcharge_cents: number;
  gas_carbon_offset_credit_cents: number;
  gas_mindfulness_discount_cents: number;
  gas_meter_number: string;
  gas_meter_reading_prev: number;
  gas_meter_reading_curr: number;
  gas_meter_reader_name: string;
  gas_meter_reader_mood: "happy" | "neutral" | "contemplative" | "one_with_nature";
  payment_received: boolean;
  payment_received_date?: string;
  payment_received_amount_cents?: number;
  payment_method?: string;
  bill_status: "OPEN" | "PAID" | "PAST_DUE" | "DISPUTED" | "COSMIC_REVIEW";
  carbon_footprint_kg: number;
  trees_planted_equivalent: number;
  meditation_minutes_earned: number;
  internal_notes: string;
}

export const greenleaf_customers: GreenLeafCustomer[] = [
  {
    cust_uuid: "GL-7a8f2c3d-5e9b-4d1a-8c6f-2b3d4e5f6a7b",
    acct_ref: "GLE-2019-PHX-0847",
    name_first: "Phoenix",
    name_last: "Moonbeam-Chakravarthy",
    name_middle: "Solstice",
    name_suffix: "II",
    contact_primary_phone: "+1-503-555-GRÜN",
    contact_secondary_phone: "+1-503-555-LEAF",
    contact_email_primary: "phoenix.moonbeam@cosmicenergy.guru",
    loc_service_addr: "777 Enlightenment Boulevard",
    loc_city: "Salem",
    loc_state_code: "OR",
    loc_zip_code: "97301",
    loc_coordinates: { lat: 44.9429, lng: -123.0351 },
    enrolled_timestamp: "2019-03-20T11:11:11Z",
    acct_tier: "ultra_green",
    acct_state: "OK",
    billing_auto_pay: true,
    billing_electronic_statement: true,
    contact_preference: ["email", "telepathy", "carrier_pigeon"],
    customer_since_days: 2084,
    meditation_score: 97,
    plant_parent_level: "druid",
    special_requests: "Please ensure all bills are printed on recycled paper with soy-based ink, even though I requested electronic statements. It's the principle. Also, can you tell me what chakra my gas meter resonates with? I've asked 47 times.",
    balance_current_cents: 0,
    balance_last_updated: "2024-12-01T00:00:00Z",
  },
  {
    cust_uuid: "GL-2b4f6a8c-9d1e-3f5a-7b9c-4d6e8f0a1b2c",
    acct_ref: "GLE-2021-STK-1923",
    name_first: "Stanley",
    name_last: "Kowalski",
    contact_primary_phone: "+1-503-555-STEL",
    contact_email_primary: "stan.k@normalpeople.com",
    loc_service_addr: "632 Elysian Fields Avenue",
    loc_city: "Keizer",
    loc_state_code: "OR",
    loc_zip_code: "97303",
    enrolled_timestamp: "2021-08-15T14:30:00Z",
    acct_tier: "standard",
    acct_state: "OK",
    billing_auto_pay: true,
    billing_electronic_statement: true,
    contact_preference: ["email", "phone"],
    customer_since_days: 1206,
    meditation_score: 12,
    plant_parent_level: "novice",
    special_requests: "Just want normal gas service. Why do I have to have a 'meditation score'? Why did your rep ask me to 'center my energy' before discussing my bill? I just want to heat my house. Please stop sending me plant seeds.",
    balance_current_cents: 0,
    balance_last_updated: "2024-11-28T00:00:00Z",
  },
  {
    cust_uuid: "GL-5c8d1f3a-6e9b-4c2d-8f1a-3b5d7e9f2a4c",
    acct_ref: "GLE-2020-MNG-3847",
    name_first: "Mangolia",
    name_last: "Greenhouse",
    contact_primary_phone: "+1-503-555-GROW",
    contact_email_primary: "mangolia@botanicalbliss.farm",
    loc_service_addr: "2048 Chlorophyll Lane",
    loc_city: "Woodburn",
    loc_state_code: "OR",
    loc_zip_code: "97071",
    loc_coordinates: { lat: 45.1437, lng: -122.8554 },
    enrolled_timestamp: "2020-05-10T08:00:00Z",
    acct_tier: "super_green",
    acct_state: "OK",
    billing_auto_pay: true,
    billing_electronic_statement: true,
    contact_preference: ["email"],
    customer_since_days: 1668,
    meditation_score: 73,
    plant_parent_level: "expert",
    special_requests: "Commercial greenhouse operation. High gas usage for heating. Appreciate your carbon offset program. Less enthusiastic about mandatory meditation breaks for meter readers. My plants don't judge them, why should they judge their 'energy'?",
    balance_current_cents: 0,
    balance_last_updated: "2024-12-02T00:00:00Z",
  },
  {
    cust_uuid: "GL-9e2f4c6d-8a1b-5d3e-7f9a-2c4d6e8f0a1b",
    acct_ref: "GLE-2018-NRM-5521",
    name_first: "Norman",
    name_last: "Normal",
    contact_primary_phone: "+1-503-555-NORM",
    contact_email_primary: "norm@regular.guy",
    loc_service_addr: "123 Main Street",
    loc_city: "Silverton",
    loc_state_code: "OR",
    loc_zip_code: "97381",
    enrolled_timestamp: "2018-11-03T10:00:00Z",
    acct_tier: "standard",
    acct_state: "MEDITATION_REQUIRED",
    billing_auto_pay: false,
    billing_electronic_statement: false,
    contact_preference: ["phone", "mail"],
    customer_since_days: 2222,
    meditation_score: 3,
    plant_parent_level: "novice",
    special_requests: "Account flagged for 'insufficient mindfulness engagement'. I DON'T WANT TO MEDITATE. I JUST WANT GAS. Why is my bill higher because I refused to complete the 'Chakra Assessment Survey'? This can't be legal. I've filed three complaints. They sent me incense.",
    balance_current_cents: 52719,
    balance_last_updated: "2024-12-03T00:00:00Z",
  },
  {
    cust_uuid: "GL-3d5f7a9b-2c4e-6d8f-1a3b-5c7d9e1f3a5b",
    acct_ref: "GLE-2022-FRN-7234",
    name_first: "Fernanda",
    name_last: "Succulentsson",
    name_middle: "Aloe",
    contact_primary_phone: "+1-971-555-FERN",
    contact_email_primary: "fern.succulent@plantmail.com",
    loc_service_addr: "1313 Terrarium Terrace, Unit 420",
    loc_city: "Salem",
    loc_state_code: "OR",
    loc_zip_code: "97302",
    enrolled_timestamp: "2022-04-20T16:20:00Z",
    acct_tier: "green",
    acct_state: "OK",
    billing_auto_pay: true,
    billing_electronic_statement: true,
    contact_preference: ["email", "plant_based_semaphore"],
    customer_since_days: 958,
    meditation_score: 84,
    plant_parent_level: "expert",
    special_requests: "LOVE the company philosophy! Finally a utility that understands that energy is spiritual! Have you considered offering classes on communicating with plants? I would attend. I speak to my succulents daily. They understand me. My therapist says this is 'fine'.",
    balance_current_cents: 0,
    balance_last_updated: "2024-11-30T00:00:00Z",
  },
];

export const greenleaf_bills: GreenLeafBill[] = [
  {
    bill_uuid: "GLB-2024-11-7a8f2c3d",
    cust_uuid: "GL-7a8f2c3d-5e9b-4d1a-8c6f-2b3d4e5f6a7b",
    acct_ref: "GLE-2019-PHX-0847",
    cycle_start_date: "2024-10-01",
    cycle_end_date: "2024-10-31",
    generated_date: "2024-11-01",
    payment_due_date: "2024-11-25",
    amount_total_cents: 18743,
    amount_previous_balance_cents: 0,
    amount_current_cycle_cents: 18743,
    amount_adjustments_cents: -500,
    amount_late_charges_cents: 0,
    gas_usage_therms: 127,
    gas_base_rate_per_therm_cents: 123,
    gas_distribution_fee_cents: 1200,
    gas_transportation_fee_cents: 450,
    gas_green_surcharge_cents: 890,
    gas_carbon_offset_credit_cents: -1500,
    gas_mindfulness_discount_cents: -750,
    gas_meter_number: "GLM-PHX-0847-G",
    gas_meter_reading_prev: 287421,
    gas_meter_reading_curr: 287548,
    gas_meter_reader_name: "Sage Willowbrook",
    gas_meter_reader_mood: "one_with_nature",
    payment_received: true,
    payment_received_date: "2024-11-20",
    payment_received_amount_cents: 18743,
    payment_method: "auto_pay_green_credits",
    bill_status: "PAID",
    carbon_footprint_kg: 45.2,
    trees_planted_equivalent: 3,
    meditation_minutes_earned: 45,
    internal_notes: "Customer achieved maximum mindfulness discount. Meter reader reported 'extremely positive energy' at service location. Found customer meditating next to gas meter. Customer explained they were 'thanking the natural gas for its service'. We... appreciate the enthusiasm?",
  },
  {
    bill_uuid: "GLB-2024-11-2b4f6a8c",
    cust_uuid: "GL-2b4f6a8c-9d1e-3f5a-7b9c-4d6e8f0a1b2c",
    acct_ref: "GLE-2021-STK-1923",
    cycle_start_date: "2024-10-01",
    cycle_end_date: "2024-10-31",
    generated_date: "2024-11-01",
    payment_due_date: "2024-11-25",
    amount_total_cents: 14892,
    amount_previous_balance_cents: 0,
    amount_current_cycle_cents: 14892,
    amount_adjustments_cents: 0,
    amount_late_charges_cents: 0,
    gas_usage_therms: 98,
    gas_base_rate_per_therm_cents: 123,
    gas_distribution_fee_cents: 1200,
    gas_transportation_fee_cents: 450,
    gas_green_surcharge_cents: 890,
    gas_carbon_offset_credit_cents: -200,
    gas_mindfulness_discount_cents: 0,
    gas_meter_number: "GLM-STK-1923-N",
    gas_meter_reading_prev: 124857,
    gas_meter_reading_curr: 124955,
    gas_meter_reader_name: "Breeze Cloudwalker",
    gas_meter_reader_mood: "neutral",
    payment_received: true,
    payment_received_date: "2024-11-28",
    payment_received_amount_cents: 14892,
    payment_method: "auto_pay_checking",
    bill_status: "PAID",
    carbon_footprint_kg: 58.3,
    trees_planted_equivalent: 1,
    meditation_minutes_earned: 0,
    internal_notes: "Customer declined participation in mindfulness program. Meter reader reported customer answered door and said 'Just read the damn meter'. We respect boundaries. Mostly. We still sent plant seeds. Customer called to complain. We apologized. Sent more seeds (by accident).",
  },
  {
    bill_uuid: "GLB-2024-11-5c8d1f3a",
    cust_uuid: "GL-5c8d1f3a-6e9b-4c2d-8f1a-3b5d7e9f2a4c",
    acct_ref: "GLE-2020-MNG-3847",
    cycle_start_date: "2024-10-01",
    cycle_end_date: "2024-10-31",
    generated_date: "2024-11-01",
    payment_due_date: "2024-11-25",
    amount_total_cents: 284719,
    amount_previous_balance_cents: 0,
    amount_current_cycle_cents: 284719,
    amount_adjustments_cents: -5000,
    amount_late_charges_cents: 0,
    gas_usage_therms: 2134,
    gas_base_rate_per_therm_cents: 118,
    gas_distribution_fee_cents: 4500,
    gas_transportation_fee_cents: 1800,
    gas_green_surcharge_cents: 3200,
    gas_carbon_offset_credit_cents: -8500,
    gas_mindfulness_discount_cents: -1200,
    gas_meter_number: "GLM-MNG-3847-C",
    gas_meter_reading_prev: 582741,
    gas_meter_reading_curr: 584875,
    gas_meter_reader_name: "River Stonepath",
    gas_meter_reader_mood: "contemplative",
    payment_received: true,
    payment_received_date: "2024-12-02",
    payment_received_amount_cents: 284719,
    payment_method: "business_auto_pay",
    bill_status: "PAID",
    carbon_footprint_kg: 892.7,
    trees_planted_equivalent: 42,
    meditation_minutes_earned: 180,
    internal_notes: "Commercial greenhouse account. High usage justified and efficient. Customer grows flowers and vegetables. Meter reader reported greenhouse is 'peaceful sanctuary'. Customer offered tomatoes. We accepted. They're growing heirloom varieties. Some are purple. Delicious.",
  },
  {
    bill_uuid: "GLB-2024-09-9e2f4c6d",
    cust_uuid: "GL-9e2f4c6d-8a1b-5d3e-7f9a-2c4d6e8f0a1b",
    acct_ref: "GLE-2018-NRM-5521",
    cycle_start_date: "2024-08-01",
    cycle_end_date: "2024-08-31",
    generated_date: "2024-09-01",
    payment_due_date: "2024-09-25",
    amount_total_cents: 17271,
    amount_previous_balance_cents: 0,
    amount_current_cycle_cents: 14271,
    amount_adjustments_cents: 3000,
    amount_late_charges_cents: 2500,
    gas_usage_therms: 89,
    gas_base_rate_per_therm_cents: 123,
    gas_distribution_fee_cents: 1200,
    gas_transportation_fee_cents: 450,
    gas_green_surcharge_cents: 890,
    gas_carbon_offset_credit_cents: 0,
    gas_mindfulness_discount_cents: 0,
    gas_meter_number: "GLM-NRM-5521-S",
    gas_meter_reading_prev: 98234,
    gas_meter_reading_curr: 98323,
    gas_meter_reader_name: "Autumn Leafwhisper",
    gas_meter_reader_mood: "neutral",
    payment_received: false,
    bill_status: "PAST_DUE",
    carbon_footprint_kg: 63.1,
    trees_planted_equivalent: 0,
    meditation_minutes_earned: 0,
    internal_notes: "Customer continues to refuse mindfulness assessment. Added 'non-cooperation surcharge' of $30. Legal reviewed: surcharge violates public utility commission rules. Removed surcharge. Sent apology letter. And incense. Why do we keep sending incense? Someone needs to talk to procurement.",
  },
];
