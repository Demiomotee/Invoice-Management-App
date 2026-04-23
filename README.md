# Invoice App

A fully responsive Invoice Management Application built with React + TypeScript + Tailwind CSS, implementing the Frontend Mentor Invoice App design.

## Live Demo

**https://invoice-management-app-alpha.vercel.app**

## Repository

**https://github.com/Demiomotee/Invoice-Management-App**

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

**Requirements:** Node.js 18+ recommended.

## Architecture

```
src/
├── assets
│   ├── avatar.jpg
│   ├── empty-state.svg
│   └── logo.svg
├── context/
│   ├── ThemeContext.tsx      Light/dark mode, persisted to localStorage
│   ├── ToastContext.tsx 
│   └── InvoiceContext.tsx    All invoice state (CRUD, filter), persisted to localStorage
├── components/
│   ├── Sidebar.tsx           Navigation + theme toggle
│   ├── StatusBadge.tsx       Paid / Pending / Draft pill
│   ├── Filter.tsx            Dropdown checkbox filter
│   ├── InvoiceForm.tsx       Slide-in create/edit form with full validation
│   ├── Toast.tsx 
│   └── DeleteModal.tsx       Confirmation modal
├── pages/
│   ├── InvoiceList.tsx       Homepage — invoice list + empty state
│   └── InvoiceDetail.tsx     Full invoice view + actions
└── utils/
    └── formatters.ts         Currency (GBP) and date formatting
```

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS v3** for styling
- **React Router v6** for navigation
- **Context API + useReducer** for state management
- **localStorage** for data persistence

## State Management

- React Context + `useReducer` for invoice state
- Separate `ThemeContext` for theme
- All state persisted to `localStorage`
- Sample data pre-loaded on first visit

## Routing

React Router v6 with two routes:
- `/` — Invoice list
- `/invoice/:id` — Invoice detail

## Trade-offs

**localStorage over IndexedDB** — simpler and sufficient for this scale. IndexedDB would be better for larger datasets or offline-first requirements.

**No external state library** — Context + useReducer handles this scope cleanly without Redux overhead.

**Inline styles for dynamic colors** — Tailwind's static scanner can't detect class strings built at runtime, so status badge colors use inline `style` props instead.

**Native date input** — avoids a dependency at the cost of minor cross-browser styling inconsistency.

## Accessibility

- Semantic HTML throughout (`<header>`, `<nav>`, `<article>`, `<address>`, `<table>`)
- All form fields have associated `<label>` elements
- All interactive elements use `<button>` — never `<div>` or `<span>`
- Delete modal traps focus, closes on ESC, uses `role="alertdialog"` with `aria-labelledby` and `aria-describedby`
- Status badges use `role="status"` and `aria-label`
- Error messages use `role="alert"` for screen reader announcement
- `aria-invalid` on invalid form fields
- Focus-visible styles for keyboard navigation
- Color contrast meets WCAG AA in both light and dark modes

## Features Beyond Requirements

- Staggered list entry animations
- Smooth slide-in form panel
- Sample invoices pre-loaded on first visit
- Invoice ID auto-generated in `AA0000` format
- Payment due date auto-calculated from invoice date + payment terms
- Live item total calculation as user types
- Form re-validates on every keystroke after first submission attempt

---

## Author

**Demiomotee**
https://github.com/Demiomotee

