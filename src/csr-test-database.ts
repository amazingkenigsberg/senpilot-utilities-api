/**
 * CSR Test Database - 3 Fake Utilities with Weird & Realistic Data
 *
 * Structure:
 * - ZapCo Electric (Direct Access): zapco_customers, zapco_bills
 * - AquaFlow Water (Direct Access): aquaflow_customers, aquaflow_bills
 * - GreenLeaf Energy (External API): Has own database accessed via API
 */

// ============================================================================
// ZAPCO ELECTRIC - Direct Table Access
// ============================================================================

export interface ZapCoCustomer {
  customer_id: string;
  account_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  service_address: string;
  city: string;
  state: string;
  zip: string;
  ssn_last4: string;
  enrollment_date: string;
  account_status: "active" | "suspended" | "disconnected" | "pending_reconnect";
  autopay_enrolled: boolean;
  paperless_billing: boolean;
  preferred_contact: "phone" | "email" | "text" | "carrier_pigeon";
  vip_tier: "none" | "bronze" | "silver" | "gold" | "platinum" | "uranium";
  customer_notes: string;
  current_balance: number;
  last_payment_date: string;
  last_payment_amount: number;
}

export interface ZapCoBill {
  bill_id: string;
  customer_id: string;
  account_number: string;
  billing_period_start: string;
  billing_period_end: string;
  bill_date: string;
  due_date: string;
  total_amount_due: number;
  previous_balance: number;
  current_charges: number;
  late_fees: number;
  kwh_used: number;
  kwh_rate: number;
  delivery_charge: number;
  utility_tax: number;
  renewable_energy_credit: number;
  peak_usage_surcharge: number;
  payment_status: "paid" | "unpaid" | "partial" | "overdue" | "disputed";
  paid_date?: string;
  paid_amount?: number;
  meter_number: string;
  meter_reading_start: number;
  meter_reading_end: number;
  estimated_reading: boolean;
  weather_adjustment: number;
  special_notes: string;
}

export const zapco_customers: ZapCoCustomer[] = [
  {
    customer_id: "ZC-001",
    account_number: "87234-HTG-2019",
    first_name: "Bartholomew",
    last_name: "Skittles",
    phone: "503-555-ZAPS",
    email: "bart.skittles1987@hotmail.com",
    service_address: "1313 Mockingbird Lane",
    city: "Portland",
    state: "OR",
    zip: "97201",
    ssn_last4: "4892",
    enrollment_date: "2019-03-15",
    account_status: "active",
    autopay_enrolled: false,
    paperless_billing: false,
    preferred_contact: "phone",
    vip_tier: "uranium",
    customer_notes: "Has been with us since we were 'BoltCorp'. Insists on calling customer service to pay bill in person via phone. Believes digital payments steal your 'energy signature'. VIP because he once saved a technician from a raccoon.",
    current_balance: 234.56,
    last_payment_date: "2024-10-28",
    last_payment_amount: 198.43,
  },
  {
    customer_id: "ZC-002",
    account_number: "92847-PLM-2021",
    first_name: "Crystal",
    last_name: "Metheny",
    phone: "971-555-0420",
    email: "definitely.not.suspicious@protonmail.com",
    service_address: "420 High Street, Unit B",
    city: "Portland",
    state: "OR",
    zip: "97214",
    ssn_last4: "1337",
    enrollment_date: "2021-04-20",
    account_status: "active",
    autopay_enrolled: true,
    paperless_billing: true,
    preferred_contact: "text",
    vip_tier: "none",
    customer_notes: "Usage patterns suggest either a server farm or... something else. We investigated. It's tomatoes. A LOT of tomatoes. Indoor hydroponic setup. Cooperated fully with inspection. Grows heirloom varieties. Actually a data scientist.",
    current_balance: 0,
    last_payment_date: "2024-11-30",
    last_payment_amount: 892.17,
  },
  {
    customer_id: "ZC-003",
    account_number: "10483-VVR-1998",
    first_name: "Gertrude",
    last_name: "Pumpernickel",
    phone: "503-555-GERT",
    email: "g.pumpernickel@aol.com",
    service_address: "742 Evergreen Terrace",
    city: "Beaverton",
    state: "OR",
    zip: "97005",
    ssn_last4: "9876",
    enrollment_date: "1998-06-12",
    account_status: "active",
    autopay_enrolled: false,
    paperless_billing: false,
    preferred_contact: "phone",
    vip_tier: "gold",
    customer_notes: "Calls every Tuesday at 2:47 PM. Has been for 26 years. We don't know why. She doesn't really have questions. Just wants to chat. Once paid her bill with a check written on a paper bag (we accepted it). Sends Christmas cards to the CEO. CEO sends them back.",
    current_balance: 127.89,
    last_payment_date: "2024-11-05",
    last_payment_amount: 134.22,
  },
  {
    customer_id: "ZC-004",
    account_number: "55512-KKT-2023",
    first_name: "Luna",
    last_name: "Starbeam-Rodriguez",
    phone: "971-555-MOON",
    email: "luna.starbeam@ethereal.co",
    service_address: "888 Chakra Boulevard, Apt 7",
    city: "Portland",
    state: "OR",
    zip: "97202",
    ssn_last4: "1111",
    enrollment_date: "2023-02-14",
    account_status: "suspended",
    autopay_enrolled: false,
    paperless_billing: true,
    preferred_contact: "email",
    vip_tier: "none",
    customer_notes: "Disputes bill every month based on astrological events. Submitted 47-page complaint about how electricity disrupts 'natural energy flows'. Service suspended after non-payment. Claims she can photosynthesize. Account shows she cannot. Actually works at Intel.",
    current_balance: 1247.33,
    last_payment_date: "2024-07-15",
    last_payment_amount: 200.00,
  },
  {
    customer_id: "ZC-005",
    account_number: "77821-ABC-2020",
    first_name: "Marcus",
    last_name: "Unnecessarily-Long-Hyphenated-Name III",
    phone: "503-555-NAME",
    email: "the.third@legacy.com",
    service_address: "1 Mansion Drive",
    city: "Lake Oswego",
    state: "OR",
    zip: "97034",
    ssn_last4: "0001",
    enrollment_date: "2020-01-01",
    account_status: "active",
    autopay_enrolled: true,
    paperless_billing: true,
    preferred_contact: "carrier_pigeon",
    vip_tier: "platinum",
    customer_notes: "Literally asked if we could accommodate carrier pigeon. We said yes as a joke. He sent one. We now have a pigeon coop. Bills are paid via wire transfer. Has underground bunker that uses more power than his house. Prepper? Billionaire? Both? Donated $50k to our employee scholarship fund.",
    current_balance: 0,
    last_payment_date: "2024-12-01",
    last_payment_amount: 3247.82,
  },
  {
    customer_id: "ZC-006",
    account_number: "33929-ZZX-2022",
    first_name: "Robert",
    last_name: "Tables",
    phone: "503-555-DROP",
    email: "bobby@tables.dev",
    service_address: "404 Not Found Street",
    city: "Tigard",
    state: "OR",
    zip: "97223",
    ssn_last4: "1234",
    enrollment_date: "2022-05-18",
    account_status: "active",
    autopay_enrolled: true,
    paperless_billing: true,
    preferred_contact: "email",
    vip_tier: "none",
    customer_notes: "Parents named him Robert Tables. Yes, like the XKCD comic. Tried SQL injection on our payment portal. Didn't work. We sent him a t-shirt that says 'Nice Try'. He wears it to customer appreciation events. Actually works in cybersecurity. Has helped us patch 3 vulnerabilities. Good kid.",
    current_balance: 0,
    last_payment_date: "2024-11-29",
    last_payment_amount: 87.43,
  },
];

export const zapco_bills: ZapCoBill[] = [
  {
    bill_id: "ZB-2024-11-001",
    customer_id: "ZC-001",
    account_number: "87234-HTG-2019",
    billing_period_start: "2024-10-01",
    billing_period_end: "2024-10-31",
    bill_date: "2024-11-01",
    due_date: "2024-11-25",
    total_amount_due: 234.56,
    previous_balance: 0,
    current_charges: 234.56,
    late_fees: 0,
    kwh_used: 1247,
    kwh_rate: 0.142,
    delivery_charge: 12.00,
    utility_tax: 18.74,
    renewable_energy_credit: -2.50,
    peak_usage_surcharge: 29.20,
    payment_status: "unpaid",
    meter_number: "MTR-87234-A",
    meter_reading_start: 842134,
    meter_reading_end: 843381,
    estimated_reading: false,
    weather_adjustment: 0,
    special_notes: "Usage up 23% from last month. Space heater season has begun. Customer called to ask if we could 'make the electrons warmer'. Bless him.",
  },
  {
    bill_id: "ZB-2024-11-002",
    customer_id: "ZC-002",
    account_number: "92847-PLM-2021",
    billing_period_start: "2024-10-01",
    billing_period_end: "2024-10-31",
    bill_date: "2024-11-01",
    due_date: "2024-11-25",
    total_amount_due: 892.17,
    previous_balance: 0,
    current_charges: 892.17,
    late_fees: 0,
    kwh_used: 6234,
    kwh_rate: 0.142,
    delivery_charge: 12.00,
    utility_tax: 71.37,
    renewable_energy_credit: -10.00,
    peak_usage_surcharge: 0,
    payment_status: "paid",
    paid_date: "2024-11-30",
    paid_amount: 892.17,
    meter_number: "MTR-92847-S",
    meter_reading_start: 234822,
    meter_reading_end: 241056,
    estimated_reading: false,
    weather_adjustment: 0,
    special_notes: "Consistent high usage. Tomato crop must be thriving. Customer actually sent us tomatoes last month. They were delicious. Cherry heirlooms.",
  },
  {
    bill_id: "ZB-2024-07-004",
    customer_id: "ZC-004",
    account_number: "55512-KKT-2023",
    billing_period_start: "2024-06-01",
    billing_period_end: "2024-06-30",
    bill_date: "2024-07-01",
    due_date: "2024-07-25",
    total_amount_due: 247.33,
    previous_balance: 0,
    current_charges: 247.33,
    late_fees: 75.00,
    kwh_used: 1389,
    kwh_rate: 0.142,
    delivery_charge: 12.00,
    utility_tax: 19.78,
    renewable_energy_credit: -2.50,
    peak_usage_surcharge: 0,
    payment_status: "disputed",
    meter_number: "MTR-55512-S",
    meter_reading_start: 45822,
    meter_reading_end: 47211,
    estimated_reading: false,
    weather_adjustment: 0,
    special_notes: "Customer disputes charge. Claims Mercury was in retrograde during billing period. Also claims full moon affected meter reading. Meter reading verified by two separate technicians. Dispute denied. Customer sent 12-page letter about corporate spiritual insensitivity.",
  },
  {
    bill_id: "ZB-2024-11-005",
    customer_id: "ZC-005",
    account_number: "77821-ABC-2020",
    billing_period_start: "2024-10-01",
    billing_period_end: "2024-10-31",
    bill_date: "2024-11-01",
    due_date: "2024-11-25",
    total_amount_due: 3247.82,
    previous_balance: 0,
    current_charges: 3247.82,
    late_fees: 0,
    kwh_used: 22847,
    kwh_rate: 0.142,
    delivery_charge: 45.00,
    utility_tax: 259.83,
    renewable_energy_credit: -50.00,
    peak_usage_surcharge: 0,
    payment_status: "paid",
    paid_date: "2024-12-01",
    paid_amount: 3247.82,
    meter_number: "MTR-77821-P",
    meter_reading_start: 892341,
    meter_reading_end: 915188,
    estimated_reading: false,
    weather_adjustment: 0,
    special_notes: "Two meters on property. House uses 2847 kWh. 'Underground facility' uses 20,000 kWh. We don't ask questions. Payment always on time. Customer sent thank you note written in calligraphy. And a live pigeon (we kept it, named it Tesla).",
  },
];

// ============================================================================
// AQUAFLOW WATER - Direct Table Access
// ============================================================================

export interface AquaFlowCustomer {
  customer_id: string;
  account_number: string;
  full_name: string;
  contact_phone: string;
  contact_email: string;
  service_location: string;
  city: string;
  state: string;
  postal_code: string;
  account_opened: string;
  account_type: "residential" | "commercial" | "industrial" | "agricultural" | "suspicious";
  service_status: "active" | "inactive" | "delinquent" | "flagged";
  auto_payment: boolean;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  water_hardness_preference: "soft" | "normal" | "crunchy" | "i_can_taste_the_minerals";
  special_instructions: string;
  current_balance: number;
}

export interface AquaFlowBill {
  bill_id: string;
  customer_id: string;
  account_number: string;
  statement_date: string;
  due_date: string;
  billing_start: string;
  billing_end: string;
  total_charges: number;
  previous_balance: number;
  payments_received: number;
  water_usage_gallons: number;
  water_rate_per_1000gal: number;
  base_service_fee: number;
  sewer_charge: number;
  stormwater_fee: number;
  infrastructure_surcharge: number;
  late_payment_fee: number;
  meter_reading_current: number;
  meter_reading_previous: number;
  meter_number: string;
  leak_detected: boolean;
  leak_description?: string;
  usage_anomaly: boolean;
  anomaly_notes?: string;
  payment_status: "current" | "overdue" | "paid" | "payment_plan";
  conservation_credit: number;
  status_notes: string;
}

export const aquaflow_customers: AquaFlowCustomer[] = [
  {
    customer_id: "AF-1001",
    account_number: "AQF-1998-MTB-7721",
    full_name: "Margaret 'Marge' Thunderbottom",
    contact_phone: "541-555-FLOW",
    contact_email: "marge.t@thunderbottomfamily.com",
    service_location: "2847 Rain Dance Road",
    city: "Eugene",
    state: "OR",
    postal_code: "97401",
    account_opened: "1998-03-22",
    account_type: "residential",
    service_status: "active",
    auto_payment: false,
    emergency_contact_name: "Her 47 cats (collectively)",
    emergency_contact_phone: "541-555-MEOW",
    water_hardness_preference: "i_can_taste_the_minerals",
    special_instructions: "DO NOT call before 10 AM or after 6 PM. Prefers postal mail. Has strong opinions about fluoride (pro-fluoride, surprisingly). Sends us recipes that use 'municipal water' as an ingredient. Makes her own soap from our water. It's actually pretty good.",
    current_balance: 67.43,
  },
  {
    customer_id: "AF-1002",
    account_number: "AQF-2021-JCK-8821",
    full_name: "Jackson 'Aquaman' Ripley",
    contact_phone: "541-555-SWIM",
    contact_email: "jripley@notaquaman.com",
    service_location: "1515 Neptune Court",
    city: "Springfield",
    state: "OR",
    postal_code: "97477",
    account_opened: "2021-06-15",
    account_type: "residential",
    service_status: "flagged",
    auto_payment: true,
    emergency_contact_name: "Coral Ripley (sister)",
    emergency_contact_phone: "541-555-REEF",
    water_hardness_preference: "soft",
    special_instructions: "USAGE FLAGGED: Investigation revealed customer has Olympic-size swimming pool that was 'forgotten to be mentioned'. Also has koi pond, waterfall feature, and hot tub. Not actually Aquaman. Just really likes water. Lifeguard at community pool. Usage now properly categorized. Pays extra for water feature permit.",
    current_balance: 0,
  },
  {
    customer_id: "AF-1003",
    account_number: "AQF-2019-VGN-9247",
    full_name: "Mx. River Stone",
    contact_phone: "541-555-H2OH",
    contact_email: "river.stone@flowstate.org",
    service_location: "369 Meditation Lane, Unit C",
    city: "Eugene",
    state: "OR",
    postal_code: "97402",
    account_opened: "2019-11-11",
    account_type: "residential",
    service_status: "active",
    auto_payment: true,
    emergency_contact_name: "Breeze Stone (sibling)",
    emergency_contact_phone: "541-555-WIND",
    water_hardness_preference: "soft",
    special_instructions: "Requested pH reports for water (we provided). Wanted to know 'water's astrological sign' (we declined to comment). Practices water conservation, actually uses 40% less than average household. Sometimes calls to thank us for clean water. Sent us crystals 'for the treatment plant'. We put them in the break room. They're pretty.",
    current_balance: 0,
  },
  {
    customer_id: "AF-1004",
    account_number: "AQF-2020-HGS-3382",
    full_name: "Dr. Hortense Gribbleflotz",
    contact_phone: "541-555-LABS",
    contact_email: "h.gribbleflotz@chemlab.edu",
    service_location: "247 Science Boulevard, Lab 6",
    city: "Eugene",
    state: "OR",
    postal_code: "97403",
    account_opened: "2020-09-01",
    account_type: "commercial",
    service_status: "active",
    auto_payment: true,
    emergency_contact_name: "University Facilities",
    emergency_contact_phone: "541-555-UNIV",
    water_hardness_preference: "normal",
    special_instructions: "Chemistry professor. Uses water for lab experiments. Required commercial account due to volume. Once called to report water tasted 'slightly more oxidized than usual' - our testing confirmed she was correct (maintenance issue, now fixed). Sends detailed water quality feedback monthly. We appreciate it. Kind of.",
    current_balance: 0,
  },
  {
    customer_id: "AF-1005",
    account_number: "AQF-2023-BRK-1144",
    full_name: "Bartholomew 'Bart' Leakyson",
    contact_phone: "541-555-DRIP",
    contact_email: "bart.leakyson@fixitpro.com",
    service_location: "8822 Old Pipe Drive",
    city: "Cottage Grove",
    state: "OR",
    postal_code: "97424",
    account_opened: "2023-02-14",
    account_type: "residential",
    service_status: "active",
    auto_payment: false,
    emergency_contact_name: "Diane Leakyson (wife, long-suffering)",
    emergency_contact_phone: "541-555-HELP",
    water_hardness_preference: "crunchy",
    special_instructions: "Irony alert: Customer is a plumber. Customer's house has ongoing leak issues. We've sent 3 courtesy notices. Wife called us crying once. We sent our best tech (off-the-clock) to help diagnose. Leak in foundation. Not customer's fault. He fixed it. Everyone's happy now. Couple sends us Christmas cookies now. They're homemade. They're terrible. We eat them anyway.",
    current_balance: 234.88,
  },
];

export const aquaflow_bills: AquaFlowBill[] = [
  {
    bill_id: "AFB-2024-11-1001",
    customer_id: "AF-1001",
    account_number: "AQF-1998-MTB-7721",
    statement_date: "2024-11-01",
    due_date: "2024-12-01",
    billing_start: "2024-10-01",
    billing_end: "2024-10-31",
    total_charges: 67.43,
    previous_balance: 0,
    payments_received: 0,
    water_usage_gallons: 4200,
    water_rate_per_1000gal: 4.85,
    base_service_fee: 22.00,
    sewer_charge: 18.70,
    stormwater_fee: 3.25,
    infrastructure_surcharge: 2.10,
    late_payment_fee: 0,
    meter_reading_current: 2847293,
    meter_reading_previous: 2843093,
    meter_number: "AFM-7721-R",
    leak_detected: false,
    usage_anomaly: false,
    payment_status: "current",
    conservation_credit: -2.00,
    status_notes: "Consistent usage. Customer called to ask if we could make the water 'taste more like 1998'. We explained that's not how water works. She insisted water has gotten 'younger tasting'. We're still not sure what that means.",
  },
  {
    bill_id: "AFB-2024-10-1002",
    customer_id: "AF-1002",
    account_number: "AQF-2021-JCK-8821",
    statement_date: "2024-10-01",
    due_date: "2024-11-01",
    billing_start: "2024-09-01",
    billing_end: "2024-09-30",
    total_charges: 847.32,
    previous_balance: 0,
    payments_received: 847.32,
    water_usage_gallons: 152400,
    water_rate_per_1000gal: 4.85,
    base_service_fee: 45.00,
    sewer_charge: 78.00,
    stormwater_fee: 12.50,
    infrastructure_surcharge: 18.75,
    late_payment_fee: 0,
    meter_reading_current: 4827471,
    meter_reading_previous: 4675071,
    meter_number: "AFM-8821-P",
    leak_detected: false,
    usage_anomaly: true,
    anomaly_notes: "High usage verified as Olympic pool + water features. Usage actually decreased this month - customer winterizing pool. Swimming season over. Customer called to thank us for 'maintaining proper pool-filling quality water'. We'll take it.",
    payment_status: "paid",
    conservation_credit: 0,
    status_notes: "Customer paid extra $200 annual water feature permit. All legitimate. Probably throws best pool parties in Springfield but we've never been invited. Rude.",
  },
  {
    bill_id: "AFB-2024-11-1003",
    customer_id: "AF-1003",
    account_number: "AQF-2019-VGN-9247",
    statement_date: "2024-11-01",
    due_date: "2024-12-01",
    billing_start: "2024-10-01",
    billing_end: "2024-10-31",
    total_charges: 38.92,
    previous_balance: 0,
    payments_received: 0,
    water_usage_gallons: 2100,
    water_rate_per_1000gal: 4.85,
    base_service_fee: 22.00,
    sewer_charge: 9.35,
    stormwater_fee: 3.25,
    infrastructure_surcharge: 2.10,
    late_payment_fee: 0,
    meter_reading_current: 147821,
    meter_reading_previous: 145721,
    meter_number: "AFM-9247-S",
    leak_detected: false,
    usage_anomaly: false,
    payment_status: "current",
    conservation_credit: -5.00,
    status_notes: "Excellent conservation! Usage 40% below average. Customer practices 'mindful water consumption'. Still uses water for normal activities, just very efficiently. Low-flow everything. Collects rainwater for plants. We should give them an award. Maybe we will.",
  },
  {
    bill_id: "AFB-2024-09-1005",
    customer_id: "AF-1005",
    account_number: "AQF-2023-BRK-1144",
    statement_date: "2024-09-01",
    due_date: "2024-10-01",
    billing_start: "2024-08-01",
    billing_end: "2024-08-31",
    total_charges: 234.88,
    previous_balance: 0,
    payments_received: 0,
    water_usage_gallons: 38400,
    water_rate_per_1000gal: 4.85,
    base_service_fee: 22.00,
    sewer_charge: 31.20,
    stormwater_fee: 3.25,
    infrastructure_surcharge: 4.80,
    late_payment_fee: 15.00,
    meter_reading_current: 982447,
    meter_reading_previous: 944047,
    meter_number: "AFM-1144-L",
    leak_detected: true,
    leak_description: "Suspected foundation leak. Usage 400% above normal. Leak now repaired. Crisis averted. Marriage saved.",
    usage_anomaly: true,
    anomaly_notes: "THE IRONY. Plumber has leak. We were gentle in our notifications. Foundation leak discovered and repaired. Customer very embarrassed. We sent flowers. He fixed our facilities manager's kitchen sink for free. It's like a water-based rom-com.",
    payment_status: "overdue",
    conservation_credit: 0,
    status_notes: "Overdue but customer called, explained leak repair costs. Set up payment plan. We're understanding. These cookies though... they taste like drywall and hope.",
  },
];
