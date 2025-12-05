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

// Main webhook endpoint for VAPI serverUrl pattern
// VAPI sends all function calls to this single endpoint
app.post("/csr-utilities", async (req: express.Request, res: express.Response) => {
  const toolCallList = req.body?.message?.toolCallList;

  if (!toolCallList || !Array.isArray(toolCallList) || toolCallList.length === 0) {
    res.status(400).json({ error: "Invalid VAPI request format" });
    return;
  }

  const toolCall = toolCallList[0];
  const { id: toolCallId, name: functionName, arguments: args } = toolCall;

  try {
    let result;

    // Call the appropriate handler based on function name
    switch (functionName) {
      case "check_account_balance": {
        const { utility, identifier, value } = args;
        if (!utility || !identifier || !value) {
          throw Object.assign(new Error("Missing required parameters: utility, identifier, value"), { status: 400 });
        }

        switch (utility) {
          case "zapco": {
            const customer = identifier === "phone"
              ? zapco_customers.find((c) => c.phone.includes(value as string))
              : zapco_customers.find((c) => c.account_number === value);

            if (!customer) {
              throw Object.assign(new Error("Customer not found"), { status: 404 });
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
            const customer = identifier === "phone"
              ? aquaflow_customers.find((c) => c.contact_phone.includes(value as string))
              : aquaflow_customers.find((c) => c.account_number === value);

            if (!customer) {
              throw Object.assign(new Error("Customer not found"), { status: 404 });
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
            const customer = identifier === "phone"
              ? greenleaf_customers.find((c) => c.contact_primary_phone.includes(value as string))
              : greenleaf_customers.find((c) => c.acct_ref === value);

            if (!customer) {
              throw Object.assign(new Error("Customer not found in meditation records"), { status: 404 });
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
            throw Object.assign(new Error("Invalid utility specified"), { status: 400 });
        }
        break;
      }

      case "check_outage_map": {
        const { utility, zip_code } = args;
        if (!utility || !zip_code) {
          throw Object.assign(new Error("Missing required parameters: utility, zip_code"), { status: 400 });
        }

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

        result = mockOutages[utility as string];
        if (!result) {
          throw Object.assign(new Error("Invalid utility specified"), { status: 400 });
        }
        break;
      }

      case "check_current_meter": {
        const { utility, account_number } = args;
        if (!utility || !account_number) {
          throw Object.assign(new Error("Missing required parameters: utility, account_number"), { status: 400 });
        }

        switch (utility) {
          case "zapco": {
            const bill = zapco_bills
              .filter((b) => b.account_number === account_number)
              .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())[0];

            if (!bill) {
              throw Object.assign(new Error("No meter data found"), { status: 404 });
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
              throw Object.assign(new Error("No meter data found"), { status: 404 });
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
              throw Object.assign(new Error("No meter consciousness detected"), { status: 404 });
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
            throw Object.assign(new Error("Invalid utility specified"), { status: 400 });
        }
        break;
      }

      case "analyze_meter": {
        const { utility, account_number } = args;
        if (!utility || !account_number) {
          throw Object.assign(new Error("Missing required parameters: utility, account_number"), { status: 400 });
        }

        switch (utility) {
          case "zapco": {
            const bills = zapco_bills
              .filter((b) => b.account_number === account_number)
              .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())
              .slice(0, 6);

            if (bills.length === 0) {
              throw Object.assign(new Error("No usage history found"), { status: 404 });
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
              throw Object.assign(new Error("No usage history found"), { status: 404 });
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
              throw Object.assign(new Error("No karmic energy records found"), { status: 404 });
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
            throw Object.assign(new Error("Invalid utility specified"), { status: 400 });
        }
        break;
      }

      case "analyze_bills": {
        const { utility, account_number } = args;
        if (!utility || !account_number) {
          throw Object.assign(new Error("Missing required parameters: utility, account_number"), { status: 400 });
        }

        switch (utility) {
          case "zapco": {
            const bills = zapco_bills
              .filter((b) => b.account_number === account_number)
              .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())
              .slice(0, 6);

            if (bills.length === 0) {
              throw Object.assign(new Error("No billing history found"), { status: 404 });
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
              throw Object.assign(new Error("No billing history found"), { status: 404 });
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
              throw Object.assign(new Error("No energy karma records found"), { status: 404 });
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
            throw Object.assign(new Error("Invalid utility specified"), { status: 400 });
        }
        break;
      }

      case "create_ticket": {
        const { utility, account_number, issue_type, description, priority } = args;
        if (!utility || !account_number || !issue_type || !description) {
          throw Object.assign(new Error("Missing required parameters: utility, account_number, issue_type, description"), { status: 400 });
        }

        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        result = {
          ticket_id: ticketId,
          utility,
          account_number,
          issue_type,
          description,
          priority: priority || "medium",
          status: "open",
          created_at: new Date().toISOString(),
        } as any;

        if (utility === "greenleaf") {
          result.spiritual_message = "Your concern has been received with mindful awareness";
          result.meditation_recommendation = "Practice deep breathing while we address your needs";
        }
        break;
      }

      default:
        res.status(400).json({
          results: [{
            toolCallId,
            result: { error: `Unknown function: ${functionName}` }
          }]
        });
        return;
    }

    res.json({
      results: [{
        toolCallId,
        result,
      }]
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      results: [{
        toolCallId,
        result: { error: error.message || "Internal server error" }
      }]
    });
  }
});

// Helper to parse VAPI request format and send VAPI response format
function handleVapiRequest(req: express.Request, res: express.Response, handler: (args: any) => Promise<any>) {
  const toolCallList = req.body?.message?.toolCallList;

  if (!toolCallList || !Array.isArray(toolCallList) || toolCallList.length === 0) {
    res.status(400).json({ error: "Invalid VAPI request format" });
    return;
  }

  const toolCall = toolCallList[0];
  const { id: toolCallId, arguments: args } = toolCall;

  handler(args)
    .then((result) => {
      res.json({
        results: [
          {
            toolCallId,
            result,
          },
        ],
      });
    })
    .catch((error) => {
      res.status(error.status || 500).json({
        results: [
          {
            toolCallId,
            result: { error: error.message || "Internal server error" },
          },
        ],
      });
    });
}

/**
 * Tool 1: Check Account Balance
 * POST /csr-utilities/check-balance
 */
app.post("/csr-utilities/check-balance", async (req, res) => {
  handleVapiRequest(req, res, async (args) => {
    const { utility, identifier, value } = args;

    if (!utility || !identifier || !value) {
      const error: any = new Error("Missing required parameters: utility, identifier, value");
      error.status = 400;
      throw error;
    }

    let result;

    switch (utility) {
      case "zapco": {
        const customer =
          identifier === "phone"
            ? zapco_customers.find((c) => c.phone.includes(value as string))
            : zapco_customers.find((c) => c.account_number === value);

        if (!customer) {
          const error: any = new Error("Customer not found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("Customer not found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("Customer not found in meditation records");
          error.status = 404;
          throw error;
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

      default: {
        const error: any = new Error("Invalid utility specified");
        error.status = 400;
        throw error;
      }
    }

    return result;
  });
});

/**
 * Tool 2: Check Outage Map
 * POST /csr-utilities/check-outages
 */
app.post("/csr-utilities/check-outages", async (req, res) => {
  handleVapiRequest(req, res, async (args) => {
    const { utility, zip_code } = args;

    if (!utility || !zip_code) {
      const error: any = new Error("Missing required parameters: utility, zip_code");
      error.status = 400;
      throw error;
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
      return result;
    } else {
      const error: any = new Error("Invalid utility specified");
      error.status = 400;
      throw error;
    }
  });
});

/**
 * Tool 3: Check Current Meter
 * POST /csr-utilities/check-meter
 */
app.post("/csr-utilities/check-meter", async (req, res) => {
  handleVapiRequest(req, res, async (args) => {
    const { utility, account_number } = args;

    if (!utility || !account_number) {
      const error: any = new Error("Missing required parameters: utility, account_number");
      error.status = 400;
      throw error;
    }

    let result;

    switch (utility) {
      case "zapco": {
        const bill = zapco_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())[0];

        if (!bill) {
          const error: any = new Error("No meter data found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("No meter data found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("No meter consciousness detected");
          error.status = 404;
          throw error;
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

      default: {
        const error: any = new Error("Invalid utility specified");
        error.status = 400;
        throw error;
      }
    }

    return result;
  });
});

/**
 * Tool 4: Analyze Meter (detailed analysis)
 * POST /csr-utilities/analyze-meter
 */
app.post("/csr-utilities/analyze-meter", async (req, res) => {
  handleVapiRequest(req, res, async (args) => {
    const { utility, account_number } = args;

    if (!utility || !account_number) {
      const error: any = new Error("Missing required parameters: utility, account_number");
      error.status = 400;
      throw error;
    }

    let result;

    switch (utility) {
      case "zapco": {
        const bills = zapco_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          const error: any = new Error("No usage history found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("No usage history found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("No karmic energy records found");
          error.status = 404;
          throw error;
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

      default: {
        const error: any = new Error("Invalid utility specified");
        error.status = 400;
        throw error;
      }
    }

    return result;
  });
});

/**
 * Tool 5: Analyze Bills
 * POST /csr-utilities/analyze-bills
 */
app.post("/csr-utilities/analyze-bills", async (req, res) => {
  handleVapiRequest(req, res, async (args) => {
    const { utility, account_number } = args;

    if (!utility || !account_number) {
      const error: any = new Error("Missing required parameters: utility, account_number");
      error.status = 400;
      throw error;
    }

    let result;

    switch (utility) {
      case "zapco": {
        const bills = zapco_bills
          .filter((b) => b.account_number === account_number)
          .sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime())
          .slice(0, 6);

        if (bills.length === 0) {
          const error: any = new Error("No billing history found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("No billing history found");
          error.status = 404;
          throw error;
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
          const error: any = new Error("No energy karma records found");
          error.status = 404;
          throw error;
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

      default: {
        const error: any = new Error("Invalid utility specified");
        error.status = 400;
        throw error;
      }
    }

    return result;
  });
});

/**
 * Tool 6: Create Ticket
 * POST /csr-utilities/create-ticket
 */
app.post("/csr-utilities/create-ticket", async (req, res) => {
  handleVapiRequest(req, res, async (args) => {
    const { utility, account_number, issue_type, description, priority } = args;

    if (!utility || !account_number || !issue_type || !description) {
      const error: any = new Error("Missing required parameters: utility, account_number, issue_type, description");
      error.status = 400;
      throw error;
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

    return result;
  });
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
