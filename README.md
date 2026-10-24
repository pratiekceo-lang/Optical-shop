# OCULIS — Optical Atelier & Eye Clinic

A bespoke optical boutique and clinical optometry web application built with **React 19**, **Tailwind CSS v4**, and **Vite**. Features an eyewear catalog, clinical services breakdown, interactive calendar appointment booking, iCalendar (`.ics`) & Google Calendar sync, and in-store try-on tray management.

---

## 🚀 Quick Start Guide (Running Locally from GitHub)

### 1. Prerequisites
Ensure you have **Node.js 18.0+** or **Node.js 20.0+** installed:
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>.git
cd <YOUR_REPO_NAME>
```

### 3. Install Dependencies
```bash
npm install
```
*(Note: Dependency peer resolutions have been configured to ensure smooth installation with zero conflicts).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Builds the optimized production bundle to `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 🌐 Deploying to GitHub Pages

This repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`).

To enable automated deployment on GitHub:
1. Push your repository to GitHub.
2. In your GitHub repository, click on **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push any commit to `main` (or run the workflow manually under the **Actions** tab).
5. Your optical shop site will be live at `https://<username>.github.io/<repo-name>/`!

---

## ✨ Features Included

- **Eyewear Atelier Collection**: Filtering by material (Japanese Titanium, Italian Bio-Acetate, Rimless Wire, Polarized Sunglasses) and shape (Round, Square, Geometric, Cat-Eye, Aviator).
- **Interactive Calendar Scheduling**: Real-time interactive month/day calendar, morning & afternoon time slots, and doctor selection.
- **Calendar Integrations**:
  - Direct **Download .ics File** for Apple Calendar, Outlook, and mobile devices.
  - One-click **Add to Google Calendar** link.
- **In-Store Try-On Tray**: Customers can queue up to 4 frames for their optometric fitting.
- **My Bookings Manager**: View, reschedule, or cancel appointments stored locally.
