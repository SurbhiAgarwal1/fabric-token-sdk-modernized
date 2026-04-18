# Fabric Token SDK - Modernized Expansion Node

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)](https://golang.org)
[![Fabric Token SDK](https://img.shields.io/badge/Token%20SDK-v0.8.1-blueviolet)](https://github.com/hyperledger/fabric-token-sdk)
[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=flat&logo=vercel)](https://fabric-token-sdk-modernized.vercel.app/frontend/)

## Project Overview
This project is an architectural prototype for managing digital assets (Tokens) using the Hyperledger Fabric Token SDK. It provides a structured backend environment and a web-based management console to orchestrate token lifecycle events.

The system is built to demonstrate modern tokenization patterns including automated issuance, privacy-preserving transfers, and unspent transaction output (UTXO) management.

### Motivation
Most existing Hyperledger Fabric Token SDK samples are pinned to legacy versions (v0.3.0). This repository provides a modernized implementation aligned with Token SDK v0.8.1 and Fabric Smart Client (FSC) v0.10.0, providing a stable baseline for enterprise-grade development.

---

## Deployment Status
**Live Dashboard Preview:** [https://fabric-token-sdk-modernized.vercel.app/frontend/](https://fabric-token-sdk-modernized.vercel.app/frontend/)

---

## Core Features

- **Standard Documentation Theme:** The dashboard UI follows the official Hyperledger Fabric Sphinx/ReadTheDocs style for a professional, consistent experience.
- **Privacy Preservation (ZKATdlog):** Implements Zero-Knowledge Proof (ZKP) logic to simulate private transacting where asset amounts and ownership remain confidential.
- **Concurrent State Management:** Utilizes Go standard library concurrency primitives (sync.RWMutex) to ensure the integrity of the in-memory ledger across multiple client requests.
- **Containerized Build:** Optimized multi-stage Dockerfile included for standardized deployment across different environments.

---

## Dashboard Usage Guide
The management console provides access to core token operations:
1. **Issue Assets:** Generates fresh assets into the system vault.
2. **Privacy Transfer:** Moves assets between participants. The system logs the ZKP generation time and proof size for each transaction to monitor performance overhead.
3. **UTXO Management (Split/Merge):** Allows for the optimization of asset outputs for future transacting.

---

## Project Structure

- `/cmd`: Server entry point and CLI configuration handler.
- `/internal/tokensdk`: Core orchestration engine, including balance tracking and ZKP latency simulation.
- `/internal/rest`: HTTP router and service handlers with CORS support.
- `/frontend`: Web management console (HTML/JavaScript/CSS).

---

## Setup and Installation

### Option 1: Docker
Run the following command to build and launch the application:
```bash
docker-compose up --build
```
Access the console at: `http://localhost:8080`

### Option 2: Native Go
Ensure Go 1.22+ is installed:
```bash
go run cmd/main.go -mode server
```
Access the console at: `http://localhost:8080`

---
*High-fidelity architectural prototype for Hyperledger Fabric Token SDK expansion.*
