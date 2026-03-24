# 🃏 The Card Flipper

A full-stack, AI-powered inventory management and listing assistant designed specifically for sports card and trading card resellers. 

Built to eliminate the tedious data-entry of cross-platform selling, **The Card Flipper** utilizes the Gemini API to automatically generate optimized listing titles, market estimates, and compelling descriptions based on minimal card data.

## ✨ Key Features

* **🤖 AI-Powered Listings:** Input basic card details (Year, Brand, Player, Condition) and let Google's Gemini API instantly generate SEO-optimized titles, estimated market values, and selling tips.
* **📋 One-Click Copy:** Seamlessly copy generated titles to your clipboard for rapid listing on platforms like eBay, Facebook Marketplace, and Mercari.
* **🗄️ Inventory Management:** A beautifully responsive grid dashboard to track your entire vault. 
* **🔄 Status Tracking:** Instantly update inventory status (Active, Sold, Personal, Draft) directly from the dashboard.
* **📄 Smooth Pagination:** Custom-built pagination with a sliding window to handle large databases without breaking a sweat.

## 🛠️ Tech Stack

**Frontend:**
* [React 19](https://react.dev/) (Bootstrapped with [Vite](https://vitejs.dev/))
* CSS Modules & Responsive CSS Grid

**Backend & Database:**
* PHP (Custom RESTful API Architecture)
* MySQL 
* XAMPP / AMPPS Server Environment

**Artificial Intelligence:**
* Google Gemini API 

## 🚀 Getting Started

### Prerequisites
* Node.js & npm installed
* A local PHP server environment (e.g., XAMPP, AMPPS)
* A Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/card-flipper.git](https://github.com/yourusername/card-flipper.git)
    cd card-flipper
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Setup the Backend API**
    * Move the `/card-flipper-api` folder into your local server's root directory (e.g., `htdocs` or `www`).
    * Import the provided SQL schema to your MySQL database.
    * Update your database credentials and Gemini API key within the PHP configuration files.

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    *Note: The Vite config is already set up to proxy API requests to `http://localhost/card-flipper-api`.*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
