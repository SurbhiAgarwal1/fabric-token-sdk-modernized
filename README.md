# Fabric Token SDK - Modernized Expansion Node

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)](https://golang.org)
[![Fabric Token SDK](https://img.shields.io/badge/Token%20SDK-v0.8.1-blueviolet)](https://github.com/hyperledger/fabric-token-sdk)
[![Fabric Smart Client](https://img.shields.io/badge/FSC-v0.10.0-blue)](https://github.com/hyperledger/fabric-smart-client)
[![Docker Support](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

An updated, modernized implementation built to orchestrate internal logic for the Hyperledger Fabric Token SDK. This repository aligns native token operations with the newest stable driver specifications (v0.8.1).

Instead of spinning up heavy CouchDB/Kafka ledgers purely to test UI/API orchestration, this package utilizes a **Thread-Safe Simulated Engine Design**, allowing lightning-fast local development and architecture validation prior to on-chain deployment.

---

## 🎯 Architecture & Innovations

- **Refactored Dependency Baselines:** Escaped the legacy `v0.3.0` bindings to orchestrate Zero-Knowledge Proof (ZKP) generations compatible with `FSC v0.10.0`.
- **Complete UTXO Operation Parity:** Adds mature robust support for `Issue`, `Transfer`, `Split`, and `Merge`—actions severely under-documented in default samples.
- **Concurrent Memory Simulation:** Incorporates standard `sync.RWMutex` maps. Prevents ledger data races when rapidly firing concurrent UTXO Split/Merge commands from multiple clients.
- **DevOps Ready:** Delivered with an optimized Multi-Stage Dockerfile enabling zero-dependency runtime environments.

## 📂 Project Structure

```text
.
├── cmd/                # Entry point (main.go)
├── internal/
│   ├── rest/           # Custom CORS-enabled Http router and Handlers
│   └── tokensdk/       # Thread-safe ZKATdlog core simulation engine
├── frontend/           # Vanilla JS dashboard for workflow visualization
├── docker-compose.yml  # Compose networking
└── Dockerfile          # Multi-stage optimized Alpine builder
```

## 🚀 Quickstart (Deployment)

You can run this application locally using either Docker (recommended for consistency) or natively via Go.

### Option A: Docker (Preferred)
Requires zero configuration. Instantly builds the optimized Alpine binaries and exposes the port.

```bash
docker-compose up --build -d
```
Access the dashboard at: `http://localhost:8080`

### Option B: Native Go
Ensure Go 1.22+ is installed on your machine.

```bash
go run cmd/main.go -mode server
```
Access the dashboard at: `http://localhost:8080`

## 🧠 Technical Workflow (Under The Hood)
When a `TRANSFER` request is initiated from the client dashboard:
1. The `rest/server` triggers `enableCORS` and injects contextual bounds.
2. The `tokensdk.Engine` calculates a simulated latency map matching the Pedersen Commitment delays.
3. The internal Map asserts an `RWMutex` lock, verifies available vault balances to avoid overdrafting, processes simulated cryptographic deductions, and unlocks.
4. An `OpMetadata` struct is serialized back to the client detailing proof size and node latency.

---
*Built to serve as an extensible template for Enterprise Hyperledger prototyping.*
