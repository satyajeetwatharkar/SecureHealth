# SecureHealth: Tamper-Proof Medical Data via Blockchain & Gemini AI

> ⚠️ **Note:** This project is currently in active development. Features and architecture are subject to upgrades as we scale.

### The Problem
Traditional health records are often stored in siloed, centralized databases that are vulnerable to internal data tampering, unauthorized scraping, and silent corruption. Patients and administrators have no way to cryptographically prove that historical medical records remain unmodified over time. 

### The Solution
**SecureHealth** introduces a hybrid zero-trust architecture. It combines the speed of traditional relational databases with the cryptographic certainty of Ethereum Smart Contracts. Every medical record is anchored on-chain upon creation. Simultaneously, a background AI daemon built on Google Gemini 2.5 Flash monitors access logs continuously to detect anomalous insider behavior.

---

## 🛠 Technology Stack
*   **Frontend:** Next.js 14, React, Tailwind CSS (Vanilla styling architecture)
*   **Backend:** Next.js Server Actions, NextAuth.js (Credentials Provider)
*   **Database:** PostgreSQL, Prisma ORM
*   **Blockchain Immutability Layer:** Ethereum (Testnet/Simulator via viem), cryptographically hashing records
*   **AI Threat Detection:** Google Gemini 2.5 Flash (for continuous background log analysis)
*   **Containerization:** Docker & Docker Compose (for the database layer)

---

## 🏗 Architecture Overview

The system operates on a dual-layer strategy:

1.  **High-Speed Storage (PostgreSQL):** Health data is immediately structured, validated, and persisted for fast retrieval in the user dashboards.
2.  **Immutable Anchors (Smart Contract):** A SHA-256 hash of the sensitive data is computed server-side and submitted as a transaction to the blockchain.
3.  **Continuous Auditing (Gemini AI):** The AI module continuously ingests access logs (who accessed what, when) and uses LLM-based anomaly detection to flag suspicious behaviors (like a user scraping data at 3 AM).
4.  **Verification:** Upon data retrieval, the retrieved record is re-hashed. If the hash does not match the blockchain's stored anchor, the data is automatically flagged as tampered with.

---

## 🚀 Local Setup Instructions

Follow these steps to run the platform locally from scratch.

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose (for running the PostgreSQL database)
*   A Gemini API Key from Google AI Studio

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/SecureHealth.git
cd SecureHealth
```

### 2. Environment Variables
Create a `.env` file in the root of the project and add your configurations.
```env
DATABASE_URL="postgresql://admin:securepassword123@localhost:5432/healthcare_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Start the Database
Ensure Docker Desktop is running, then spin up the PostgreSQL container:
```bash
docker-compose up -d
```

### 4. Install Dependencies & Setup Schema
Install the Node modules, push the Prisma schema to the DB, and seed default test users:
```bash
npm install
npx prisma db push
npx prisma generate
node prisma/seed.js
```

> **Default Seed Users:**
> The `seed.js` script will automatically create accounts for `admin@test.com`, `doctor@test.com`, `receptionist@test.com`, and `patient@test.com`. The default password for all prototype accounts is `password123`.

### 5. Run the Application
Start the Next.js development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---
*Built with ❤️ to redefine data trust in the healthcare industry.*
