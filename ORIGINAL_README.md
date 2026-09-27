<div align="center">

# 🎓 SmartEdu

**AI-Enabled Scholarship and Fellowship Management System**

**Offline-First • Simulated AI OCR • Role-Based Workflows • Persistent Local Storage**

[![MoTA 2026](https://img.shields.io/badge/MoTA-2026-blue.svg)](#)
[![Next.js Frontend](https://img.shields.io/badge/Next.js-Frontend-black.svg)](#)
[![PWA Installable](https://img.shields.io/badge/PWA-Installable-4caf50.svg)](#)
[![Offline Ready](https://img.shields.io/badge/Offline-Ready-ff9800.svg)](#)

[🚀 Live Demo](https://amanbit-01.github.io/SmartEdu/) • [📲 Install App](#pwa-installation) • [📄 Local Setup](#local-development)

</div>

---

## 🎯 Problem Statement

The Ministry of Tribal Affairs (MoTA) and Scheduled Tribe students face several challenges in the scholarship management process:
- **No reliable internet** in remote areas — existing cloud-based applications time out or lose progress.
- **Untrained officers** manually cross-checking thousands of physical documents and income certificates.
- **Fragmented workflows** causing miscommunication between students and reviewers during correction requests.
- **Zero audit trails** — making it difficult for the selection committee to track why an application was delayed.

## 💡 Solution

**SmartEdu** is an **offline-first Progressive Web App (PWA)** that streamlines the entire lifecycle of scholarship applications (e.g., NFST, NOS) entirely in the browser. 

It provides an end-to-end, seamless workflow connecting Students, Reviewing Officers, and Selection Committees without requiring a constant internet connection or a traditional backend database.

---

## ✨ Key Features

### 👨‍🎓 Student Portal
- **Interactive Application Wizard:** Apply for schemes with a multi-step form and save drafts locally.
- **Document Management:** Upload PDFs and Images which are persisted via Base64 offline storage.
- **Live Timeline:** Track application status (Draft, Under Verification, Correction Required).
- **Simulated Notifications:** Receive real-time alerts for required corrections or payment disbursements.

### 👮‍♂️ Reviewing Officer Portal
- **Eligibility Checklist:** Validate income matches and category constraints.
- **Simulated AI Document Analysis:** Mock OCR engine that cross-references uploaded certificates against declared income/caste.
- **Actionable Feedback:** Request corrections, add internal notes, and flag suspicious applications.

### ⚖️ Selection Committee Console
- **Final Decision Matrix:** Review verified applications and simulated ranking scores to Select, Waitlist, or Reject.
- **Tamper-Proof Audit Logs:** View a complete, timestamped history of every action taken on an application.

---

## 📱 PWA & Offline Functionality

Because this is a frontend prototype leveraging browser storage and service workers, it **functions offline after the initial load**. 

- **Installation:** 
  - **Desktop (Chrome/Edge):** Click the "Install" icon (🖥️↓) in the right side of your URL address bar.
  - **Mobile (iOS Safari):** Tap the Share button (📤) and select "Add to Home Screen".
  - **Mobile (Android Chrome):** Tap the three dots (⋮) and select "Install app".
- **Offline Mode:** Once installed or cached, you can close your laptop, disable Wi-Fi, and the entire workflow (including uploading documents and switching roles) will still function!

---

## 🛠️ Local Development (VS Code)

If you downloaded this project as a ZIP, **do not** open `index.html` in your browser. This is a Next.js (React) application that requires a local Node.js server.

1. Ensure you have **[Node.js](https://nodejs.org/)** installed.
2. Open the extracted folder in **VS Code**.
3. Open the VS Code terminal (`Ctrl + ~`).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to **`http://localhost:3000`**.

---

## ⚠️ Features that remain Simulated

This project is a high-fidelity demonstration prototype.
- **Authentication:** Registration and login accept fictional details. Passwords are not authenticated. 
- **AI Document Analysis:** OCR extraction is simulated with static responses.
- **Database:** Data is persisted in your browser (`localStorage`). It will not sync across different devices or incognito windows. Clearing your browser data will reset the application.

## 🚀 GitHub Pages Deployment

To deploy this exactly as you see it:
1. Push this repository to your GitHub account as `SmartEdu`.
2. Go to **Settings > Pages**.
3. Change the Build and Deployment source to **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` file will automatically compile the Next.js site and publish it!
