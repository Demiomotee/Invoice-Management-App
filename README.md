# Invoice App

A fully responsive Invoice Management Application built with React + TypeScript + Tailwind CSS, implementing the Frontend Mentor Invoice App design.

## Live Demo

**[demiomotee.github.io/Invoice-Management-App](https://demiomotee.github.io/Invoice-Management-App/)**

## Repository

**[github.com/Demiomotee/Invoice-Management-App](https://github.com/Demiomotee/Invoice-Management-App)**

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
├── context/
│   ├── ThemeContext.jsx      Light/dark mode, persisted to localStorage
│   └── InvoiceContext.jsx    All invoice state (CRUD, filter), persisted to localStorage
├── components/
│   ├── Sidebar.jsx           Navigation + theme toggle
│   ├── StatusBadge.jsx       Paid / Pending / Draft pill
│   ├── Filter.jsx            Dropdown checkbox filter
│   ├── InvoiceForm.jsx       Slide-in create/edit form with full validation
│   └── DeleteModal.jsx       Confirmation modal
├── pages/
│   ├── InvoiceList.jsx       Homepage — invoice list + empty state
│   └── InvoiceDetail.jsx     Full invoice view + actions
└── utils/
    └── formatters.js         Currency (GBP) and date formatting
```

### State Management
- React Context + `useReducer` for invoice state
- Separate `ThemeContext` for theme
- All state persisted to `localStorage`
- Sample data pre-loaded on first visit

### Routing
React Router v6 with two routes:
- `/` — Invoice list
- `/invoice/:id` — Invoice detail

## Trade-offs

**LocalStorage over IndexedDB:** LocalStorage is simpler and sufficient for this data size. IndexedDB would be preferred for larger datasets or offline-first requirements.

**No external state library:** Context + useReducer handles this scope cleanly. Redux would add overhead without benefit here.

**Single-file components:** CSS is co-located with each component for easy portability, at the cost of a global stylesheet approach.

**No date picker library:** Native `<input type="date">` used for simplicity and accessibility — avoids a dependency at the cost of cross-browser styling inconsistency.

## Accessibility Notes

- Semantic HTML throughout (`<header>`, `<main>`, `<nav>`, `<article>`, `<address>`, `<table>`)
- All form fields have associated `<label>` elements with matching `for`/`id`
- All buttons use `<button>` — never `<div>` or `<span>`
- Delete modal traps focus, closes on ESC, and uses `role="alertdialog"` with `aria-labelledby` and `aria-describedby`
- Status badges use `role="status"` and `aria-label`
- Invoice list items have descriptive `aria-label` values
- Empty state uses `role="status"`
- Error messages use `role="alert"` for screen reader announcement
- `aria-invalid` set on invalid form fields
- Focus-visible styles for keyboard navigation
- Color contrast meets WCAG AA in both light and dark modes

## Beyond Requirements

- Staggered list entry animations
- Smooth slide-in form panel
- Sample invoices pre-loaded on first visit
- Invoice ID auto-generated in `AA0000` format matching Figma
- Payment due date auto-calculated from invoice date + payment terms
- Live item total calculation as user types
- Form re-validates on every change after first submission attempt
- Semantic `<address>` elements for sender/client addresses
