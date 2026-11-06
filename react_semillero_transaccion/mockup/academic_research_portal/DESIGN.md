---
name: Academic Research Portal
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#5c403f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#906f6e'
  outline-variant: '#e5bdbb'
  surface-tint: '#bf0229'
  primary: '#9e001f'
  on-primary: '#ffffff'
  primary-container: '#c8102e'
  on-primary-container: '#ffdad8'
  inverse-primary: '#ffb3b1'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#0043b4'
  on-tertiary: '#ffffff'
  tertiary-container: '#1259e2'
  on-tertiary-container: '#dae1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes an institutional, modern, and structured visual identity tailored for academic research management at the university level. It serves researchers, faculty directors, student leaders, and institutional administrators who require clarity, rigor, and immediate access to complex academic data.

The aesthetic blends **Modern Corporate** structure with **Editorial Academic Precision**:
- **Structured Authority:** Reliable, balanced layout architecture reflecting institutional prestige and governmental/academic compliance.
- **Data Clarity:** High-legibility data tables, contextual status badges, and dense yet breathable administrative dashboards.
- **Restraint and Focus:** The dominant canvas remains light and neutral to reduce cognitive fatigue during prolonged operational sessions, reserving high-chroma university red strictly for primary wayfinding and decisive actions.

## Colors

The palette balances institutional identity with functional data hierarchy:

### Core Identity
- **Primary Red (`#C8102E`):** Institutional brand core, reserved for primary interactive triggers, active navigation highlights, and administrator privileges.
- **Primary Hover/Dark (`#9E0B22`):** Interactive pressed/hover states and high-contrast header sections.
- **Secondary Charcoal (`#1E293B`):** Deep slate-navy anchoring the persistent sidebar, top-level navigation headers, and high-contrast body typography.

### Backgrounds & Surfaces
- **Canvas Base (`#F8FAFC`):** Global neutral background providing subtle separation from interactive modules.
- **Surface Pure (`#FFFFFF`):** High-priority operational layers including cards, data grids, side drawers, and dialog surfaces.
- **Surface Subdued (`#F1F5F9`):** Table header fills, segmented control tracks, and input disabled states.
- **Border Default (`#E2E8F0`):** Hairline structure dividers ensuring crisp data segmentation without visual noise.

### Functional & Role Accents
- **Academic Blue (`#2563EB` / Tint `#DBEAFE`):** Director role indicators, research group associations, and informational guidance.
- **Success Green (`#16A34A` / Tint `#DCFCE7`):** 'REGISTRADO', project active status, and validation confirmation.
- **Leadership Amber (`#D97706` / Tint `#FEF3C7`):** Student leader, committee member roles, and pending review states.
- **Alert Crimson (`#DC2626` / Tint `#FEE2E2`):** System error boundaries, critical validation alerts, and destructive actions.

## Typography

Typography pairs geometric distinction for institutional landmarks with technical legibility for high-density academic information:

- **Headings & Wayfinding (Plus Jakarta Sans):** Used for view headers, modal titles, and metric highlights. It provides institutional authority with modern, approachable geometric terminals.
- **Body & Data Displays (Inter):** System workhorse for dense research dossiers, metadata rosters, forms, and data tables. Tall x-height and clear distinction between glyphs ensure error-free data scanning.
- **Badges & Role Indicators:** Set in `label-sm` with explicit uppercase letter-spacing (+0.05em) and semi-bold weights for rapid contextual recognition across administrative lists.

## Layout & Spacing

The layout is built around a responsive dashboard shell featuring a persistent 260px desktop navigation rail, a flexible top context bar, and an inner 12-column grid.

### Breakpoints & Adaptive Logic
- **Desktop (≥ 1280px):** 12-column grid, persistent dark charcoal navigation sidebar, 32px canvas margins, and 24px component gutters.
- **Tablet (768px – 1279px):** Collapsible navigation drawer, 8-column layout, 24px margins, and 16px gutters. Analytical charts and metric cards stack into 2-column configurations.
- **Mobile (< 768px):** Off-canvas navigation menu, 4-column flow, 16px margins, and 12px gutters. Data tables switch to stacked card-based records with direct touch targets.

## Elevation & Depth

Visual hierarchy uses clean surface separation and controlled, neutral ambient shadows to preserve an academic, uncluttered workspace:

- **Elevation 0 (Flat):** Canvas background (`#F8FAFC`) and sub-panels. Borders (`1px solid #E2E8F0`) define structural division without elevation.
- **Elevation 1 (Card & Content Surface):** `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04);` combined with a subtle border. Used for metric widgets, research group cards, and table housings.
- **Elevation 2 (Dropdowns & Overlays):** `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);`. Applied to role filter popovers, action menus, and floating date-pickers.
- **Elevation 3 (Modals & Command Dialogs):** `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06);`. Used for research project creation flows, member attribution dialogs, and validation prompts.

## Shapes

The design uses balanced, modern geometric curvature to project institutional rigor while maintaining contemporary software standards:

- **Standard Elements (0.5rem / 8px):** Form inputs, buttons, chips, table cell selection containers, and contextual tooltips.
- **Structural Containers (0.75rem / 12px):** Research cards, dashboard analytic widgets, table wrappers, and modals.
- **Badges & Role Tags (0.375rem / 6px to Full Rounded):** Role pills and status flags use soft, compact curvature to fit inline within tight data tables without breaking baseline rhythms.

## Components

### Buttons
- **Primary:** Filled `#C8102E` with white text, transitioning to `#9E0B22` on hover. 8px border-radius, font-weight 600, height 40px (desktop) / 36px (compact table action).
- **Secondary / Charcoal:** Surface `#1E293B`, hover `#0F172A`. Applied to administrative export actions and root level operations.
- **Outline / Neutral:** Transparent fill with `1px solid #CBD5E1` border and `#334155` text. Hover surface `#F1F5F9`.
- **Destructive:** Subtle crimson wash `#FEE2E2` with `#DC2626` text; primary destructive uses full `#DC2626` fill.

### Badges & Role Status Tags
Constructed with an explicit tint-to-solid contrast ratio for rapid role categorization:
- **ADMINISTRADOR:** `#FEE2E2` background, `#C8102E` label, subtle border `#FECACA`.
- **DIRECTOR:** `#DBEAFE` background, `#1D4ED8` label, subtle border `#BFDBFE`.
- **MIEMBRO / Líder Estudiantil:** `#FEF3C7` background, `#B45309` label, subtle border `#FDE68A`.
- **REGISTRADO (Status):** `#DCFCE7` background, `#15803D` label, subtle border `#BBF7D0`.

### Data Tables & Rosters
- **Container:** Wrapped in pure white with 12px radius and a 1px `#E2E8F0` border.
- **Header Cells:** `#F8FAFC` background, uppercase `label-sm` typography in `#64748B`, 44px height, bottom divider only.
- **Body Cells:** 52px row height, `#1E293B` text, soft `#F8FAFC` row hover highlight, single hairline horizontal separators.

### Input Fields & Selectors
- **Default State:** Height 40px, pure white surface, `1px solid #CBD5E1`, 8px border-radius, placeholder in `#94A3B8`.
- **Focus State:** Border transitions to `#C8102E` accompanied by an institutional glow ring (`0 0 0 3px rgba(200, 16, 46, 0.15)`).
- **Error State:** Border `#DC2626` with red validation caption (`12px`) and error icon.

### Cards & Analytical Widgets
- Pure white fill with 12px rounded corners and Elevation 1. Includes structured 16px vertical padding, separated header border for section titling, and clean visual anchors for project metrics, semillero affiliations, and lead faculty profiles.