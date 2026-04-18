# Fabric Token SDK - Modernized Expansion Node

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)](https://golang.org)
[![Fabric Token SDK](https://img.shields.io/badge/Token%20SDK-v0.8.1-blueviolet)](https://github.com/hyperledger/fabric-token-sdk)
[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=flat&logo=vercel)](https://fabric-token-sdk-modernized.vercel.app/frontend/)

## 🌟 What is this Project?
This project is an advanced, user-friendly prototype for managing **Digital Assets** (Tokens) on a blockchain using the **Hyperledger Fabric Token SDK**.

In many blockchain systems, managing tokens (like digital cash or assets) is complex and lacks a visual interface. This project provides a **Professional Management Console** and a **Modern Backend** that allows you to Issue, Transfer, and Split tokens while maintaining privacy and high performance.

### **The "Why":**
Most examples for the Token SDK are outdated (stuck on v0.3.0). This repository provides a **fully modernized version (v0.8.1)** that is documented clearly so that anyone—from a beginner to a senior mentor—can understand how token orchestration works.

---

## 🚀 Live Demo
**Interactive Dashboard:** [https://fabric-token-sdk-modernized.vercel.app/frontend/](https://fabric-token-sdk-modernized.vercel.app/frontend/)  
*(No installation required! See the architecture in action immediately.)*

---

## ✨ Key Features

- **Official Theme:** The dashboard is custom-styled to match the official **Hyperledger Fabric** technical documentation for a seamless enterprise feel.
- **Privacy-First (ZKATdlog):** Uses Zero-Knowledge Proof (ZKP) technology to simulate private transactions where the amount and owner are hidden from the public eye.
- **Smart Concurrency:** Built with advanced Go logic (`sync.RWMutex`) to handle multiple transactions safely without data errors.
- **Docker Ready:** Includes a `Dockerfile` and `docker-compose.yml` so you can launch the entire project with a single command.

---

## 🎮 How to use the Dashboard
Once the app is running, use the **Quick Actions** panel:
1. **Issue Assets:** Add fresh tokens (e.g., USD-Token) into the system.
2. **Privacy Transfer:** Send tokens to another party. The dashboard will show you the **ZKP Generation Time**—the time it took to create the privacy proof.
3. **Split/Merge:** Organize your token "UTXOs" (unspent outputs) for better efficiency.

---

## 📂 Project Structure (For Developers)

- `/cmd`: The main entry point that starts the server.
- `/internal/tokensdk`: The **Core Brain** of the project. This is where the token logic and privacy simulations live.
- `/internal/rest`: The **API Layers** that connect the frontend to the backend engine.
- `/frontend`: The **User Interface** (HTML/JS/CSS).

---

## 🛠️ Setup Instructions

### **1. Using Docker (Instant Setup)**
If you have Docker installed, simply run:
```bash
docker-compose up --build
```
Open `http://localhost:8080` in your browser.

### **2. Using Go (Manual Setup)**
Ensure you have Go 1.22+ installed:
```bash
go run cmd/main.go -mode server
```
Open `http://localhost:8080` in your browser.

---
*Developed as a high-fidelity architectural prototype to modernize the Hyperledger Fabric Token SDK ecosystem.*
