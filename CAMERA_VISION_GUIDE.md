# 📷 Camera Vision Feature - User Guide

## Overview
The Camera Vision feature allows you to automatically detect product lists from paper using computer vision and OCR technology. This saves time from manually entering product information.

## How to Use

### Step 1: Open Camera Vision
1. Open the Cosmetic Zone Manager PRO app
2. Tap the **📷 Camera** tab in the bottom navigation
3. Tap **📷 Open Camera** button

### Step 2: Prepare Your Paper
Before capturing, arrange your paper like this:
```
Recipient/Customer Name
═════════════════════════
Product Name 1    ₹100
Product Name 2    ₹250
Product Name 3    ₹150
```

**Format Requirements:**
- Customer/recipient name on the **first line** (top of paper)
- Product names on the **left side**
- Prices on the **right side** (with ₹ symbol or just numbers)
- Each product on a separate line

### Step 3: Capture Photo
1. Position your phone camera to capture the entire list
2. Make sure lighting is good (avoid shadows)
3. Tap **📸 Capture Photo** button
4. Wait for AI to process (it will show "Processing image with AI...")

### Step 4: Review Detected Data
After processing, you'll see:
- **✅ Detected Information** panel
- Editable customer name
- List of detected products with prices
- You can edit any field before saving

### Step 5: Save
1. Review all information
2. Edit any incorrect data
3. Click **✓ Save All** to save everything
4. App will:
   - Add new customer (if not already saved)
   - Add new products (if not already saved)
   - Skip duplicates
   - Show notification: "⚠️ Set the stock of your newly registered products!"

---

## Smart Features

### 🎯 Automatic Duplicate Detection
- If a product with the same name already exists, it's skipped
- If a customer with the same name exists, it's not duplicated
- New products show up in the Products section immediately

### 🔍 VCF Import Filter (Enhanced)
When importing contacts from VCF files:
- App automatically filters to show only contacts with:
  - **"Saloon"**
  - **"Salon"**
  - **"Beauty"**
  - **"Cosmetic"** in their names
- This reduces selection from 1300+ contacts to only relevant ones
- You can still manually uncheck/check contacts
- Shows count of relevant contacts found

### 📢 Stock Notification
After saving new products from camera:
- You'll see: "⚠️ Set the stock of your newly registered products!"
- Go to **📦 Products** section
- Set stock quantity for newly added items

---

## Supported Languages
- 🇮🇳 **Hindi** (हिंदी)
- 🇬🇧 **English**
- Mixed text works too!

---

## Tips for Best Results

✅ **Good Lighting** - Natural light or bright indoor lighting
✅ **Clear Photo** - Keep camera steady, avoid blur
✅ **Good Resolution** - Use clear, crisp paper with good contrast
✅ **Straight Alignment** - Capture paper straight (not at an angle)
✅ **Format Consistency** - Keep products in clear columns
❌ **Avoid** - Blurry photos, bad lighting, skewed angles, smudged text

---

## Troubleshooting

### Camera Won't Open
- Check if you've granted camera permission
- Try closing and reopening the app
- Restart your phone if issue persists

### Products Not Detected
- Ensure good lighting
- Make sure text is clearly visible
- Try capturing again with better angle
- Check if paper format matches example above

### Price Not Recognized
- Make sure price is clearly visible with numbers
- Use ₹ symbol or just numbers (e.g., "₹100" or "100")
- Avoid currency symbols other than ₹

### Duplicate Warnings
- If you see "duplicates skipped", it means those products already exist
- Check 📦 Products section to view existing items

---

## Workflow Example

**Scenario**: You have a paper order form from a customer

```
📝 ORIGINAL PAPER:
─────────────────
Elite Saloon
────────────────
Shampoo       ₹150
Conditioner   ₹200
Hair Oil      ₹250
Face Mask     ₹300
```

**What Happens:**
1. Camera captures the form
2. OCR detects "Elite Saloon" as customer name
3. Detects 4 products with prices
4. Shows preview for your review
5. You confirm and save
6. App creates:
   - New customer: "Elite Saloon" (if new)
   - New products: Shampoo (150), Conditioner (200), Hair Oil (250), Face Mask (300)
7. You get reminder to set stock quantities

---

## Integration with Other Features

### 📦 Products Section
- New products from camera appear here
- Set stock quantity for newly added items
- View all product listings

### 👥 Customers Section
- New customers from camera appear here
- Can call customers with one tap
- View purchase history

### 💰 Sales Section
- Use detected products when recording sales
- Products are ready to use immediately after detection

### 💾 Data Management
- All camera-detected data is backed up when you backup
- Restore includes all camera-detected records

---

## Version Info
- **Camera Vision Feature**: v1.0
- **Tesseract.js**: v5 (OCR Engine)
- **Supported Formats**: Paper with printed/clear text
- **Languages**: English, Hindi

---

## Security & Privacy
✅ All processing happens **locally on your device**
✅ No data sent to cloud or external servers
✅ Works **completely offline**
✅ Your data never leaves your phone
