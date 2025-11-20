# Tokyo Trip 2026 - GitHub Pages Plan

## Project Structure

```
pages/
├── index.html              # Navigator หลัก + Currency Converter
├── sw.js                   # Service Worker (Offline)
├── manifest.json           # PWA manifest
├── plan.md                 # ไฟล์นี้
├── asset/
│   ├── css/
│   │   ├── common.css      # Base styles + Responsive + Lightbox
│   │   ├── trip-clean.css  # Clean theme (จาก v5)
│   │   ├── cover.css       # Cover page styles
│   │   └── guidebook.css   # Shopping/Guide styles
│   └── js/
│       ├── common.js       # Navigator + Go-to-top + Lightbox
│       └── trip.js         # Toggle/Collapse functions
├── images/                 # รูปภาพ
├── calendar/               # ICS Calendar files (8 days)
│   ├── day1-2026-03-06.ics
│   ├── day2-2026-03-07.ics
│   ├── day3-2026-03-08.ics
│   ├── day4-2026-03-09.ics
│   ├── day5-2026-03-10.ics
│   ├── day6-2026-03-11.ics
│   ├── day7-2026-03-12.ics
│   └── day8-2026-03-13.ics
├── th/
│   ├── trip-plan.html      # Tokyo-Trip-v5-Clean
│   ├── cover-page.html     # สรุปแผนรายวัน + รูปภาพ
│   ├── cover.html          # Cover page (A4 Print)
│   ├── shopping.html       # Shopping guide
│   └── shopping-list.html  # Shopping list + รูปภาพ
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
- [x] ทดสอบบน iPad/Mobile

### Phase 7: Enhanced Features (Nov 2025)
- [x] Currency Converter (JPY ↔ THB) พร้อม auto-format #,###.##
- [x] อัตราแลกเปลี่ยน 3 แบบ: 1 JPY, 1 THB, 100 JPY
- [x] Image Lightbox - กดรูปขยาย กดอีกทีปิด
- [x] Responsive CSS ทุกหน้า (768px, 480px breakpoints)
- [x] Home button (มุมล่างขวา)

### Phase 8: Calendar Integration
- [x] สร้าง ICS files 8 วัน (~120 events)
- [x] รองรับ Google Calendar import
- [x] Timezone Asia/Tokyo
- [x] Categories: TRAVEL, HOTEL, FOOD, SHOPPING, ATTRACTION, SPECIAL
- [x] รายละเอียดครบ: สถานที่, เบอร์โทร, ราคา, หมายเหตุ

### Phase 9: Multi-language (Planned)
- [ ] สร้าง en/ folder - English version
- [ ] สร้าง jp/ folder - Japanese version
- [ ] Language switcher ใน Navigator

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

### 3. Home Button (มุมล่างขวา)
- ปุ่มกลม (🏠)
- Position: `bottom: 1.5rem; right: 1.5rem;`
- ลิงก์ไป index.html

### 4. Image Lightbox
- กดรูปภาพ → แสดง popup เต็มจอ
- กดอีกที / ปุ่ม ✕ / Escape → ปิด
- รองรับทุกรูปอัตโนมัติ (ยกเว้น icon/logo)

### 5. Currency Converter (index.html)
- แปลงค่า JPY ↔ THB แบบ real-time
- Auto-format ตัวเลข #,###.##
- อัตราแลกเปลี่ยน 3 รูปแบบ:
  - 1 JPY = x THB
  - 1 THB = x JPY
  - 100 JPY = x THB
- บันทึก rate ลง localStorage

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

## Calendar Files (ICS)

### วิธีใช้
1. ดาวน์โหลดไฟล์ `.ics` จาก `calendar/` folder
2. Import เข้า Google Calendar หรือ Apple Calendar
3. Events จะแสดงตาม Timezone Asia/Tokyo

### Event Format
- **SUMMARY**: ชื่อกิจกรรม (ไทย + อังกฤษ)
- **DESCRIPTION**: รายละเอียด, สถานที่, เบอร์โทร, ราคา
- **LOCATION**: สถานที่
- **CATEGORIES**: ประเภท (TRAVEL, HOTEL, FOOD, etc.)

### Icons ใช้ใน Events
- ➡️🏢 Check-in
- 🏣🚶‍➡️ Check-out
- 🚃 การเดินทาง
- 🍜 อาหาร
- 🛍️ ช็อปปิ้ง
- 📸 สถานที่ท่องเที่ยว

---

## Notes
- ทุกหน้าใช้ CSS/JS ร่วมกัน (consistent theme)
- Floating UI ต้องไม่บัง content
- รองรับ responsive (Mobile/Tablet/Desktop)
- Offline mode สำหรับดูโดยไม่มี internet
- Image Lightbox ทำงานอัตโนมัติกับทุกรูป
