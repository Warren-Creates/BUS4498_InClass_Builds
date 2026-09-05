## 1. Workflow Overview

### 1.1 Workflow Goal

This workflow supports the system goal defined in `my_first_agent/README.md`: take a customer food order from first request through confirmed payment and accurate handoff, including clarification when the request is unclear and preserving evidence for later improvement.

### 1.2 Workflow Trigger

The workflow starts when a customer begins an order (spoken or entered) for menu items.

### 1.3 Completion Condition at Runtime

The workflow is complete when a paid, completeness- and accuracy-checked order has been handed to the customer, and the run’s order details, any exception/routing choice, and outcome have been stored.

### 1.4 General Workflow

On the normal path, the system loads menu, prices, availability, and order policy; interprets the customer’s order; assesses whether the request is feasible and unambiguous; routes to automated handling; requests and processes payment; prepares the order; verifies payment, completeness, and accuracy; hands the order to the customer; stores the run record; and, when human review finds recurring failures, updates guidance for future runs.

The main exception path is clarification: if the request is infeasible or ambiguous, the system selects employee clarification instead of automated handling, resolves the order with a human, then continues to payment and fulfillment. Human-review points are (1) employee clarification before payment and (2) post-run review that may trigger Learn updates. The workflow does not end at payment alone — preparation, verify, and handoff are required for completion.

### 1.5 Workflow Diagram

```mermaid
flowchart TD
    T1["T1: Load menu and policy"] --> T2["T2: Interpret customer order"]
    T2 --> T3["T3: Assess feasibility"]
    T3 --> D1{"Feasible and unambiguous?"}
    D1 -->|Yes| T4["T4: Select automated handling"]
    D1 -->|No| H1["H1: Employee clarification"]
    H1 --> T4
    T4 --> T5["T5: Request and process payment"]
    T5 --> T6["T6: Prepare the order"]
    T6 --> T7["T7: Confirm payment completeness accuracy"]
    T7 --> D2{"Verify passed?"}
    D2 -->|No| H2["H2: Fix order before handoff"]
    H2 --> T7
    D2 -->|Yes| T8["T8: Hand order to customer"]
    T8 --> T9["T9: Store order and outcome"]
    T9 --> D3{"Recurring failure after review?"}
    D3 -->|Yes| T10["T10: Revise guidance"]
    D3 -->|No| C1([C1: Workflow complete])
    T10 --> C1
