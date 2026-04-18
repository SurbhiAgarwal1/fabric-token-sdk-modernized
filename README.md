# Fabric Token SDK - Modernized Expansion Node

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)](https://golang.org)
[![Fabric Token SDK](https://img.shields.io/badge/Token%20SDK-v0.8.1-blueviolet)](https://github.com/hyperledger/fabric-token-sdk)
[![Fabric Smart Client](https://img.shields.io/badge/FSC-v0.10.0-blue)](https://github.com/hyperledger/fabric-smart-client)
[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=flat&logo=vercel)](https://fabric-token-sdk-modernized.vercel.app/frontend/)

An updated, modernized implementation built to orchestrate internal logic for the Hyperledger Fabric Token SDK. This repository aligns native token operations with the newest stable driver specifications (v0.8.1).

## 🚀 Live Implementation
**Dashboard Preview:** [https://fabric-token-sdk-modernized.vercel.app/frontend/](https://fabric-token-sdk-modernized.vercel.app/frontend/)

---

## 🎯 Problem Statement & Solution
The current official Hyperledger samples are often pinned to legacy versions (v0.3.0). This project bridges that gap by:
1. **Dependency Modernization:** Full migration to **Token SDK v0.8.1** and **FSC v0.10.0**.
2. **Persistence & Concurrency:** Implementing a stateful backend using memory-safe `sync.RWMutex` locks, ensuring that even in a simulated environment, data races are prevented during concurrent UTXO splits or merges.
3. **ZKP Observability:** Real-time logging of **Zero-Knowledge Proof (ZKATdlog)** generation latency and proof sizing.

## 📂 Project Architecture

```text
.
├── cmd/                # Server entry point with CLI flag handling
├── internal/
│   ├── rest/           # Custom API Router with CORS and state-mapped handlers
│   └── tokensdk/       # Core Engine: Thread-safe vault tracking & ZKP simulation
├── frontend/           # Dashboards styled with the official Sphinx/ReadTheDocs theme
├── Dockerfile          # Multi-stage optimized build (Alpine linux binary)
└── docker-compose.yml  # One-command full stack orchestration
```

## 🛠️ Technical Implementation Details

### **1. Backend Engine (Go)**
Located in `internal/tokensdk/engine.go`, the engine tracks `USD-Token` and `EUR-Token` balances. It performs validity checks (spending validation) before simulating the Pedersen Commitment generation. It proves architectural readiness for real Fabric integration by handling:
- **State Locking:** Uses `sync.RWMutex` to ensure integrity across concurrent REST requests.
- **Duration Benchmarking:** Returns high-precision `time.Duration` metrics for cryptographic overhead analysis.

### **2. Frontend Console**
Styled to match the **Official Hyperledger Fabric Documentation**, the dashboard provides:
- **Live Metrics:** Dynamic ZKP generation and commit latency tracking.
- **Activity Logs:** A technical console window that logs flow-level events (Issue, Transfer, Split).
- **Hybrid Demo Engine:** For serverless environments (like Vercel), the console includes an auto-detecting fallback engine that simulates logic directly in the browser.

## 🚀 Getting Started

### **Option 1: Docker (Recommended)**
```bash
docker-compose up --build
```
The dashboard will be available at `http://localhost:8080`.

### **Option 2: Native Go**
```bash
go run cmd/main.go -mode server
```

---
*Built as a high-fidelity prototype for Hyperledger Fabric architectural validation.*
