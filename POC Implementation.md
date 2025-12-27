# 📊 Admin Panel – Chart Image Generator (POC)

## 1. Objective

Implement a **new “Chart Generator (POC)” tab** inside the existing admin panel that enables admin users to:

- Manually enter chart data
- Configure chart metadata (title, subtitle, axis labels, units)
- Upload and position a brand logo
- Select chart types (Bar, Stacked Bar, Pie – POC focus)
- Generate **high-quality exportable images (PNG / WEBP)**
- Produce **market-research–grade visuals** similar to professional reports

The generated charts must be suitable for:

- Market research reports
- Blogs & landing pages
- PDFs & presentations

---

## 2. Scope (POC)

### Included

- Vertical Bar Chart
- Stacked Bar Chart
- Pie Chart
- Client-side image generation
- Manual data entry via admin panel

### Excluded (Future Phase)

- Backend persistence
- Automated data fetching
- PDF generation
- Multi-language labels

---

## 3. Route & Navigation

### Route

/admin/chart-generator

css
Copy code

### Navigation

Add a sidebar menu item:
📊 Chart Generator (POC)

yaml
Copy code

---

## 4. Page Layout

Single-page layout divided into **three panels**.

---

### A. Left Panel – Chart Configuration

**Controls**

- Chart Type (Dropdown)
  - Bar Chart
  - Stacked Bar Chart
  - Pie Chart
- Chart Orientation (Bar only)
  - Vertical
  - Horizontal
- Color Theme
  - Default (brand palette)
  - Custom (color picker per series)

---

### B. Middle Panel – Data & Metadata Input

#### 1. Chart Metadata

- Chart Title (text input)
- Subtitle (text input)
- X-Axis Label (text input)
- Y-Axis Label (text input)
- Unit Suffix (optional, e.g. `USD Billion`)
- Decimal Precision (0–2)
- Toggles:
  - Show Legend
  - Show Gridlines

---

#### 2. Logo Configuration

- Upload Logo (PNG / SVG)
- Logo Position
  - Top-right
  - Top-left
  - Bottom-right
- Watermark Opacity (slider: 0–100%)

---

#### 3. Data Table (Dynamic)

Editable table supporting:

- Add / remove rows
- Add / remove data series
- Inline numeric validation
- Max 20 rows (POC limit)

**Example (Stacked Bar Chart)**

| Year | Hardware | Software | Services |
| ---- | -------- | -------- | -------- |
| 2023 | 2.6      | 1.3      | 0.8      |
| 2024 | 2.8      | 1.4      | 0.9      |

---

### C. Right Panel – Preview & Export

- Live chart preview (auto-refresh)
- Preview must exactly match exported image
- Actions:
  - Generate Image
  - Download PNG
  - Download WEBP
  - Reset Configuration

---

## 5. Chart Rendering

### Library (Choose One)

- Chart.js (Canvas-based)
- ECharts (Preferred – professional styling)
- Recharts + html-to-image

> Output **must be image-based**, not SVG-only.

---

### Styling Guidelines (Critical)

Charts must resemble **professional market research visuals**:

- Light or white background
- Muted, professional color palette
- Rounded bars
- Clean gridlines
- Clear legend spacing
- Font hierarchy:
  - Title → Large, bold
  - Subtitle → Medium
  - Axis labels → Regular
  - Values → Subtle

---

## 6. Image Generation & Export

### Requirements

- Client-side generation
- Export formats:
  - PNG
  - WEBP
- Resolution:
  - Default: 1200 × 700
  - High-res: 2400 × 1400
- No blurry text or scaling artifacts

### Suggested Tools

- `html-to-image`
- `dom-to-image`
- Canvas `toBlob()`

---

## 7. Data Handling (POC)

- Chart configuration stored in local React state
- Optional:
  - Export chart config as JSON
  - Import JSON to regenerate chart

---

## 8. Edge Cases & Validation

- Empty data → block generation with error message
- Large values → auto-format (e.g. `10.3`)
- Long titles → text wrapping
- Too many legend items → auto-wrap
- Missing logo → layout remains aligned

---

## 9. Non-Functional Requirements

- Clean component separation
- Reusable chart config schema
- No hardcoded data
- Easy extension for:
  - Report automation
  - PDF generation
  - Backend persistence

---

## 10. Deliverables

- New Admin Panel tab
- Working chart generator (end-to-end)
- Image export functionality
- Sample pre-filled dataset (demo)
- README covering:
  - Adding new chart types
  - Styling adjustments
  - Export logic

---

## 11. Success Criteria

- Admin can recreate professional market-research charts
- Output images are report-ready
- Export works reliably across browsers
- Chart configuration is reusable and scalable

---

## 12. Future Enhancements (Post-POC)

- Line & Area charts
- PDF export
- Backend storage
- Chart templates
- Multi-language support
- Automated report pipelines
