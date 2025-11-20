# Tokyo Trip 2026 - GitHub Pages Plan

## Project Structure

```
pages/
├── index.html              # Navigator หลัก
├── sw.js                   # Service Worker (Offline)
├── manifest.json           # PWA manifest
├── plan.md                 # ไฟล์นี้
├── asset/
│   ├── css/
│   │   ├── common.css      # Base styles ทุกหน้าใช้ร่วม
│   │   ├── trip-clean.css  # Clean theme (จาก v5)
│   │   ├── cover.css       # Cover page styles
│   │   └── guidebook.css   # Shopping/Guide styles
│   └── js/
│       ├── common.js       # Navigator + Go-to-top
│       └── trip.js         # Toggle/Collapse functions
├── images/                 # รูปภาพ
├── th/
│   ├── trip-plan.html      # Tokyo-Trip-v5-Clean
│   ├── cover.html          # Cover page
│   └── shopping.html       # Shopping list
├── en/                     # (สำหรับแปลในอนาคต)
└── jp/                     # (สำหรับแปลในอนาคต)
```

---

## Checklist

### Phase 1: CSS Files
- [x] สร้าง `asset/css/common.css` - Base styles (fonts, colors, buttons, floating UI)
- [x] สร้าง `asset/css/trip-clean.css` - Clean theme styles จาก v5
- [x] สร้าง `asset/css/cover.css` - Cover page styles
- [x] สร้าง `asset/css/guidebook.css` - Shopping/Guide styles

### Phase 2: JS Files
- [x] สร้าง `asset/js/common.js` - Navigator menu + Go-to-top + Shared functions
- [x] สร้าง `asset/js/trip.js` - Toggle/Collapse/Copy functions

### Phase 3: Main Navigator
- [x] สร้าง `index.html` - Main navigator page พร้อม floating menu

### Phase 4: Convert HTML Pages
- [x] แปลง `th/trip-plan.html` - ลิงก์ CSS/JS ภายนอก + เพิ่ม data-i18n
- [x] แปลง `th/cover.html` - ลิงก์ CSS/JS ภายนอก + เพิ่ม data-i18n
- [x] แปลง `th/shopping.html` - ลิงก์ CSS/JS ภายนอก + เพิ่ม data-i18n

### Phase 5: PWA & Offline
- [x] สร้าง `sw.js` - Service Worker (Cache-first strategy)
- [x] สร้าง `manifest.json` - PWA manifest

### Phase 6: Testing
- [x] ทดสอบ Navigator menu (มุมบนขวา)
- [x] ทดสอบ Go-to-top button (มุมล่างซ้าย)
- [ ] ทดสอบ Offline mode
- [ ] ทดสอบบน iPad/Mobile

---

## UI Components

### 1. Navigator Menu (มุมบนขวา)
- Floating button (hamburger icon)
- Position: `top: 1rem; right: 1rem;`
- Slide-in menu จากขวา
- Links: Trip Plan, Cover, Shopping, Language selector

### 2. Go-to-Top Button (มุมล่างซ้าย)
- ปุ่มกลมเล็ก (↑)
- Position: `bottom: 1.5rem; left: 1.5rem;`
- แสดงเมื่อ scroll > 300px
- Smooth scroll to top

---

## i18n Pattern

### HTML Format
```html
<h1 data-i18n="trip-title">🗾 Tokyo Trip March 2026</h1>
<span data-i18n="date-range">6-13 มี.ค. 2026</span>
<p data-i18n="day1-activity-1">ออกจากบ้านไปสนามบินดอนเมือง</p>
```

### Regex Pattern
```regex
data-i18n="([^"]+)"[^>]*>([^<]+)</
```
- Group 1 = key (e.g., `trip-title`)
- Group 2 = content (e.g., `🗾 Tokyo Trip March 2026`)

### Workflow แปลภาษา
1. **Extract**: `grep -oP 'data-i18n="[^"]+"[^>]*>[^<]+<' th/trip-plan.html`
2. **Create CSV/JSON**: `{key: "th_text", en: "", jp: ""}`
3. **Translate**: แปลเนื้อหา
4. **Replace**: ใช้ sed/python script

---

## Service Worker Strategy

### Cache Files
- `index.html`
- `th/*.html`
- `asset/css/*.css`
- `asset/js/*.js`
- `images/*`

### Strategy
- **Cache-first**: ดึงจาก cache ก่อน
- **Network fallback**: ถ้าไม่มีใน cache ดึงจาก network
- **Version control**: เปลี่ยน version เมื่อ update content

---

## Source Files (จาก build/)
- `Tokyo-Trip-v5-Clean-20251115-205317.html` → `th/trip-plan.html`
- `cover-page.html` → `th/cover.html`
- `shopping-list.html` → `th/shopping.html`

---

## Notes
- ทุกหน้าใช้ CSS/JS ร่วมกัน (consistent theme)
- Floating UI ต้องไม่บัง content
- รองรับ responsive (Mobile/Tablet/Desktop)
- Offline mode สำหรับดูโดยไม่มี internet
