# 💠 Hyperledger Fabric Token SDK | Modernized Sandbox 2.0

![Platform](https://img.shields.io/badge/Platform-Hyperledger_Fabric-blue)
![SDK](https://img.shields.io/badge/SDK-Fabric_Token_SDK_v0.8.1-purple)
![License](https://img.shields.io/badge/License-Apache_2.0-green)

This project is a high-fidelity architectural prototype designed for the **LFDT Hyperledger Mentorship 2024-2026**. It demonstrates a modernized, production-grade implementation of the Fabric Token SDK sample.

## 🌟 Key Features & Modernizations
- **Full-Stack Orchestration**: Modernized Go backend (1.22) with a unified REST API layer.
- **Premium Sandbox Dashboard**: Glassmorphic UI to visualize privacy-preserving transactions in real-time.
- **Privacy-Tax Observability**: Built-in monitoring for **ZKP (Zero-Knowledge Proof)** generation latency vs. Ledger commit times.
- **Enhanced Token Logic**: Implementation of advanced flows like **Split UTXO**, **Merge UTXOs**, and **Aggregated Wallet History**.
- **Audit Capability**: Simulation of the Auditor role in a ZKATdlog environment.

## 🏗️ Technical Architecture
The system uses the **Fabric Smart Client (FSC)** to manage P2P communication between nodes before committing transactions to the Fabric Ledger.
- **Engine**: Simulated `zkatdlog` proving system.
- **Network**: Simplified orchestration of Issuer, Owner, and Auditor personas.
- **API**: OpenAPI 3.0 driven backend via `oapi-codegen` standards.

## 🚀 Quick Start

### 1. Run the Engine (Backend)
```bash
go run cmd/main.go -mode server
```

### 2. View the Dashboard (Frontend)
Open `frontend/index.html` in your browser to experience the glassmorphic sandbox.

---
*Developed as a contribution to the Hyperledger Foundation Mentorship Program.*
