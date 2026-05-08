# 📈 FinSight AI – Frontend Application

[![Angular](https://img.shields.io/badge/Angular-16+-red)](https://angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-Reactive-pink)](https://rxjs.dev/)

> **The modern, high-performance user interface for the FinSight AI personal finance engine.**

This repository contains the Angular frontend for FinSight AI, a UPI-centric financial tracking application. It provides a seamless, responsive experience for users to upload bank statements, review AI-categorized transactions, and manage their monthly budgets.

## ✨ Key UI Features
*   **Human-in-the-Loop (HITL) Interface:** A dedicated staging dashboard where users can review, edit, and approve AI-generated transaction categorizations before they are committed to the database.
*   **High-Performance Ledger:** Utilizes RxJS debouncing and server-side pagination to instantly search and filter thousands of micro-transactions without browser lag.
*   **Smart Budget Dashboard:** Real-time visual progress bars and charts tracking spending against category limits using a custom Glassmorphism UI.
*   **Generative Insights View:** A dedicated analytics screen displaying personalized, AI-generated financial advice based on monthly spending habits.

## 🛠️ Tech Stack
*   **Framework:** Angular 19
*   **Styling:** Tailwind CSS, Angular Material
*   **State Management/Reactivity:** RxJS
*   **Routing:** Angular Router (with Route Guards for JWT Auth)

## 🚀 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/FinSight-AI-Frontend.git](https://github.com/yourusername/FinSight-AI-Frontend.git)
   cd FinSight-AI-Frontend
