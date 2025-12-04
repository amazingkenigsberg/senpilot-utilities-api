/**
 * Senpilot Utilities API - Standalone Service
 *
 * This service provides:
 * 1. CSR Utilities API - 6 tool endpoints for VAPI integration
 * 2. GreenLeaf Mock API - External utility company simulation
 *
 * Designed to be deployed separately for easy testing without main repo permissions
 */

import express from "express";
import cors from "cors";
import {
  zapco_customers,
  zapco_bills,
  aquaflow_customers,
  aquaflow_bills,
} from "./csr-test-database.js";
import {
  greenleaf_customers,
  greenleaf_bills,
} from "./greenleaf-database.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Senpilot Utilities API",
    endpoints: {
      csr_utilities: "/csr-utilities/*",
      greenleaf_mock: "/greenleaf/*",
    },
  });
});

// =============================================================================
// CSR UTILITIES API - For VAPI Integration
// =============================================================================

/**
 * Tool 1: Check Account Balance
 * GET /csr-utilities/check-balance
 */
app.get("/csr-utilities/check-balance", async (req, res) => {
  const { utility, identifier, value } = req.query;

  if (!utility || !identifier || !value) {
    res.status(400).json({
      error: "Missing required parameters: utility, identifier, value",
    });
    return;
  }

  try {
    let result;

    switch (utility) {
      case "zapco": {
        const customer =
          identifier === "phone"
            ? zapco_customers.find((c) => c.phone.includes(value as string))
            : zapco_customers.find((c) => c.account_number === value);

        if (!customer) {
          res.status(404).json({ error: "Customer not found" });
          return;
        }

        result = {
          utility: "ZapCo Electric",
          customer_name: `${customer.first_name} ${customer.last_name}`,
          account_number: customer.account_number,
          current_balance: customer.current_balance,
          account_status: customer.account_status,
          last_payment: {
            date: customer.last_payment_date,
            amount: customer.last_payment_amount,
          },
          autopay: customer.autopay_enrolled,
        };
        break;
      }

      case "aquaflow": {
        const customer =
          identifier === "phone"
            ? aquaflow_customers.find((c) => c.contact_phone.includes(value as string))
            : aquaflow_customers.find((c) => c.account_number === value);

        if (!customer) {
          res.status(404).json({ error: "Customer not found" });
          return;
        }

        result = {
          utility: "AquaFlow Municipal Water",
          customer_name: customer.full_name,
          account_number: customer.account_number,
          current_balance: customer.current_balance,
          account_status: customer.service_status,
          autopay: customer.auto_payment,
          quirky_note: customer.water_hardness_preference,
        };
        break;
      }

      case "greenleaf": {
        // Direct data access since it's all in one service now
        const customer =
          identifier === "phone"
            ? greenleaf_customers.find((c) => c.contact_primary_phone.includes(value as string))
            : greenleaf_customers.find((c) => c.acct_ref === value);

        if (!customer) {
          res.status(404).json({ error: "Customer not found in meditation records" });
          return;
        }

        const recentBill = greenleaf_bills.find((b) => b.cust_uuid === customer.cust_uuid);

        result = {
          utility: "GreenLeaf Energy Co.",
          customer_name: `${customer.name_first} ${customer.name_last}`,
          account_number: customer.acct_ref,
          current_balance: recentBill ? recentBill.amount_total_cents / 100 : customer.balance_current_cents / 100,
          account_status: customer.acct_state === "OK" ? "active" : "inactive",
          meditation_score: customer.meditation_score,
          spiritual_guidance: "Your energy flows with the universe",
          quirky_note: `Plant parent level: ${customer.plant_parent_level}`,
        };
        break;
      }

      default:
        res.status(400).json({ error: "Invalid utility specified" });
        return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error checking balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Tool 2: Check Outage Map
 * GET /csr-utilities/check-outages
 */
app.get("/csr-utilities/check-outages", async (req, res) => {
  const { utility, zip_code } = req.query;

  if (!utility || !zip_code) {
    res.status(400).json({
      error: "Missing required parameters: utility, zip_code",
    });
    return;
  }

  // Mock outage data
  const mockOutages: Record<string, any> = {
    zapco: {
      utility: "ZapCo Electric",
      zip_code,
      current_outages: 0,
      affected_customers: 0,
      estimated_restoration: null,
      message: "No outages reported in your area",
    },
    aquaflow: {
      utility: "AquaFlow Municipal Water",
      zip_code,
      service_interruptions: false,
      maintenance_scheduled: false,
      message: "All systems operational",
    },
    greenleaf: {
      utility: "GreenLeaf Energy Co.",
      zip_code,
      energy_flow_status: "harmonious",
      cosmic_interference: "minimal",
      message: "The energy flows freely in your sector",
      meditation_recommendation: "Consider an evening meditation to align with grid energy",
    },
  };

  const result = mockOutages[utility as string];
  if (result) {
    res.json(result);
  } else {
    res.status(400).json({ error: "Invalid utility specified" });
  }
});

/**
 * Tool 3: Check Current Meter
 * GET /csr-utilities/check-meter
 */
app.get("/csr-utilities/check-meter", async (req, res) => {
  const { utility, account_number } = req.query;

  if (!utility || !account_number) {
    res.status(400).json({
      error: "Missing required parameters: utility, account_number",
    });
    return;
  }

  try {
    let result;

    switch (utility) {
      case "zapco": {
        const bill = zapco_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())[0];

        if (!bill) {
          res.status(404).json({ error: "No meter data found" });
          return;
        }

        result = {
          utility: "ZapCo Electric",
          account_number,
          current_reading: bill.meter_reading_end,
          previous_reading: bill.meter_reading_start,
          usage: bill.kwh_used,
          read_date: bill.bill_date,
        };
        break;
      }

      case "aquaflow": {
        const bill = aquaflow_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.statement_date).getTime() - new Date(a.statement_date).getTime())[0];

        if (!bill) {
          res.status(404).json({ error: "No meter data found" });
          return;
        }

        result = {
          utility: "AquaFlow Municipal Water",
          account_number,
          current_reading: bill.meter_reading_current,
          previous_reading: bill.meter_reading_previous,
          usage_gallons: bill.water_usage_gallons,
          read_date: bill.statement_date,
        };
        break;
      }

      case "greenleaf": {
        const bill = greenleaf_bills
          .filter((b) => greenleaf_customers.find(c => c.cust_uuid === b.cust_uuid)?.acct_ref === account_number)
          .sort((a, b) => new Date(b.generated_date).getTime() - new Date(a.generated_date).getTime())[0];

        if (!bill) {
          res.status(404).json({ error: "No meter consciousness detected" });
          return;
        }

        result = {
          utility: "GreenLeaf Energy Co.",
          account_number,
          current_reading: bill.gas_meter_reading_curr,
          previous_reading: bill.gas_meter_reading_prev,
          usage_therms: bill.gas_usage_therms,
          meter_mood: bill.gas_meter_reader_mood,
          spiritual_message: "Your energy consumption reflects inner balance",
        };
        break;
      }

      default:
        res.status(400).json({ error: "Invalid utility specified" });
        return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error checking meter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Tool 4: Analyze Meter (detailed analysis)
 * GET /csr-utilities/analyze-meter
 */
app.get("/csr-utilities/analyze-meter", async (req, res) => {
  const { utility, account_number } = req.query;

  if (!utility || !account_number) {
    res.status(400).json({
      error: "Missing required parameters: utility, account_number",
    });
    return;
  }

  try {
    let result;

    switch (utility) {
      case "zapco": {
        const bills = zapco_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          res.status(404).json({ error: "No usage history found" });
          return;
        }

        const avgUsage = bills.reduce((sum, b) => sum + b.kwh_used, 0) / bills.length;
        const latestUsage = bills[0]?.kwh_used || 0;
        const trend = latestUsage > avgUsage * 1.1 ? "increasing" : latestUsage < avgUsage * 0.9 ? "decreasing" : "stable";

        result = {
          utility: "ZapCo Electric",
          account_number,
          analysis_period: `Last ${bills.length} months`,
          average_monthly_usage: Math.round(avgUsage),
          latest_usage: latestUsage,
          trend,
          recommendation: trend === "increasing"
            ? "Usage is above average. Consider energy-saving measures."
            : "Usage is within normal range.",
        };
        break;
      }

      case "aquaflow": {
        const bills = aquaflow_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.statement_date).getTime() - new Date(a.statement_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          res.status(404).json({ error: "No usage history found" });
          return;
        }

        const avgUsage = bills.reduce((sum, b) => sum + b.water_usage_gallons, 0) / bills.length;
        const latestUsage = bills[0]?.water_usage_gallons || 0;

        result = {
          utility: "AquaFlow Municipal Water",
          account_number,
          analysis_period: `Last ${bills.length} months`,
          average_monthly_gallons: Math.round(avgUsage),
          latest_usage_gallons: latestUsage,
          trend: latestUsage > avgUsage * 1.1 ? "increasing" : "stable",
        };
        break;
      }

      case "greenleaf": {
        const bills = greenleaf_bills
          .filter((b) => greenleaf_customers.find(c => c.cust_uuid === b.cust_uuid)?.acct_ref === account_number)
          .sort((a, b) => new Date(b.generated_date).getTime() - new Date(a.generated_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          res.status(404).json({ error: "No karmic energy records found" });
          return;
        }

        const avgUsage = bills.reduce((sum, b) => sum + b.gas_usage_therms, 0) / bills.length;

        result = {
          utility: "GreenLeaf Energy Co.",
          account_number,
          analysis_period: `Last ${bills.length} lunar cycles`,
          average_monthly_therms: Math.round(avgUsage),
          karmic_balance: "harmonious",
          spiritual_recommendation: "Your energy consumption aligns with natural rhythms",
        };
        break;
      }

      default:
        res.status(400).json({ error: "Invalid utility specified" });
        return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error analyzing meter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Tool 5: Analyze Bills
 * GET /csr-utilities/analyze-bills
 */
app.get("/csr-utilities/analyze-bills", async (req, res) => {
  const { utility, account_number } = req.query;

  if (!utility || !account_number) {
    res.status(400).json({
      error: "Missing required parameters: utility, account_number",
    });
    return;
  }

  try {
    let result;

    switch (utility) {
      case "zapco": {
        const bills = zapco_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          res.status(404).json({ error: "No billing history found" });
          return;
        }

        result = {
          utility: "ZapCo Electric",
          account_number,
          total_bills: bills.length,
          bills: bills.map((b) => ({
            bill_date: b.bill_date,
            due_date: b.due_date,
            amount_due: b.total_amount_due,
            kwh_used: b.kwh_used,
            status: b.payment_status,
          })),
        };
        break;
      }

      case "aquaflow": {
        const bills = aquaflow_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.statement_date).getTime() - new Date(a.statement_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          res.status(404).json({ error: "No billing history found" });
          return;
        }

        result = {
          utility: "AquaFlow Municipal Water",
          account_number,
          total_bills: bills.length,
          bills: bills.map((b) => ({
            bill_date: b.statement_date,
            due_date: b.due_date,
            amount_due: b.total_charges,
            gallons_used: b.water_usage_gallons,
            status: b.payment_status === "paid" ? "Paid" : "Pending",
          })),
        };
        break;
      }

      case "greenleaf": {
        const bills = greenleaf_bills
          .filter((b) => greenleaf_customers.find(c => c.cust_uuid === b.cust_uuid)?.acct_ref === account_number)
          .sort((a, b) => new Date(b.generated_date).getTime() - new Date(a.generated_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          res.status(404).json({ error: "No energy karma records found" });
          return;
        }

        result = {
          utility: "GreenLeaf Energy Co.",
          account_number,
          total_bills: bills.length,
          meditation_minutes_earned: bills.reduce((sum, b) => sum + b.meditation_minutes_earned, 0),
          bills: bills.map((b) => ({
            bill_date: b.generated_date,
            due_date: b.payment_due_date,
            amount_cents: b.amount_total_cents,
            therms_used: b.gas_usage_therms,
            meditation_discount: b.gas_mindfulness_discount_cents / 100,
          })),
        };
        break;
      }

      default:
        res.status(400).json({ error: "Invalid utility specified" });
        return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error analyzing bills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Tool 6: Create Ticket
 * POST /csr-utilities/create-ticket
 */
app.post("/csr-utilities/create-ticket", async (req, res) => {
  const { utility, account_number, issue_type, description, priority } = req.body;

  if (!utility || !account_number || !issue_type || !description) {
    res.status(400).json({
      error: "Missing required parameters: utility, account_number, issue_type, description",
    });
    return;
  }

  const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const result: any = {
    ticket_id: ticketId,
    utility,
    account_number,
    issue_type,
    description,
    priority: priority || "medium",
    status: "open",
    created_at: new Date().toISOString(),
  };

  if (utility === "greenleaf") {
    result.spiritual_message = "Your concern has been received with mindful awareness";
    result.meditation_recommendation = "Practice deep breathing while we address your needs";
  }

  res.json(result);
});

// =============================================================================
// GREENLEAF MOCK API - External Utility Simulation
// =============================================================================

app.get("/greenleaf/health", (req, res) => {
  res.json({
    status: "ENLIGHTENED",
    message: "GreenLeaf Energy API is flowing smoothly",
    meditation_sessions_completed: 89,
    api_mood: "serene",
  });
});

app.get("/greenleaf/api/v2/customer/lookup/by-phone", (req, res) => {
  const { phone } = req.query;
  const customer = greenleaf_customers.find((c) => c.contact_primary_phone === phone);

  if (!customer) {
    res.status(404).json({
      error: "Customer consciousness not detected",
      meditation_recommendation: "Perhaps meditate on the correct phone number",
    });
    return;
  }

  res.json({
    ...customer,
    meditation_bonus: "+5 mindfulness points for account lookup",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Senpilot Utilities API running on port ${PORT}`);
  console.log(`📊 CSR Utilities: http://localhost:${PORT}/csr-utilities/*`);
  console.log(`🧘 GreenLeaf Mock: http://localhost:${PORT}/greenleaf/*`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});
