# Cosmetic Zone Manager PRO

**A Progressive Web App (PWA) for managing cosmetics business operations - products, customers, and sales. Works offline!**

## Features

✨ **Complete Business Management System**

### 1. 📊 Dashboard
- Today's total sales with revenue
- Total revenue analytics
- Top-selling products
- Low stock alerts
- Real-time statistics

### 2. 💄 Product Management
- Add, edit, and delete products
- Track product prices and stock quantities
- Automatic low stock warnings (< 10 units)
- Quick stock status overview

### 3. 👥 Customer Management
- Add customers manually
- **VCF Contact Import** - Bulk import contacts from .vcf files
- View customer profiles
- Track customer purchase history
- Monitor total spending per customer
- **Call customer** directly with one tap

### 4. 💳 Sales Recording
- Record sales with multiple items
- Auto-calculate total price
- Update product stock automatically
- Track customer purchase history
- Store sales with timestamp

### 5. ⚙️ User Profile
- Store shop owner details
- Save business name
- Store contact information
- Add shop address

### 6. 💾 Data Management
- **Backup** - Export all data as JSON file
- **Restore** - Import previous backups
- Secure local storage with IndexedDB

### 7. 📱 PWA Features
- **Install on home screen** (All devices)
- **Works completely offline** - No internet required
- Fast, lightweight, and responsive
- Mobile-first design
- Service Worker for caching

## Tech Stack

- **Frontend**: Vanilla JavaScript (No heavy frameworks)
- **Storage**: IndexedDB for offline data persistence
- **PWA**: Service Worker, Web Manifest
- **Styling**: Modern responsive CSS
- **Performance**: Optimized for low-end devices

## Getting Started

### Installation

1. **Open in Browser**
   - Open `index.html` in any modern web browser

2. **Install as App**
   - **Mobile**: Open in your mobile browser → Menu → "Install app" or "Add to Home Screen"
   - **Desktop**: Chrome/Edge → Menu → "Install app"
   - Desktop PWAs work like native apps with their own window

3. **No Server Required**
   - All data is stored locally on your device
   - Works completely offline

### First Steps

1. **Set Up Profile**
   - Go to "Profile" section
   - Enter shop owner details
   - Save your information

2. **Add Products**
   - Navigate to "Products"
   - Click "+ Add Product"
   - Enter product name, price, and initial stock
   - Your products are now ready for sales

3. **Add Customers**
   - Go to "Customers"
   - Click "+ Add Customer" for manual entry
   - OR click "📥 Import VCF" to bulk import contacts
   - Select contacts from VCF file to import

4. **Record Sales**
   - Click "💳 Sales"
   - Click "+ Record Sale"
   - Select customer
   - Add items and quantities
   - Save sale (stock and customer records auto-update)

5. **Monitor Business**
   - Check "📊 Dashboard" for daily insights
   - Track revenue, top products, and low stock alerts

## How to Use Key Features

### VCF Contact Import

The app supports bulk importing contacts from .vcf files (standard contact format):

1. Click "📥 Import VCF" in Customers section
2. Select a .vcf file from your device
3. Review the contact list with checkboxes
4. Select which contacts to import
5. Selected contacts are added as customers

**Note**: Only contacts with name and phone number are imported.

### Backup & Restore Data

**Backup** (Export):
- Go to "Profile" → "Data Management"
- Click "📥 Backup Data"
- A JSON file downloads with all your data
- Keep safe copies for security

**Restore** (Import):
- Go to "Profile" → "Data Management"
- Click "📤 Restore Data"
- Select a previously backed-up JSON file
- Confirm the operation (existing data will be replaced)

### Call Customer

- In Customers section, click on a customer card
- Click "📞" button
- In Sales section, open a sale for contact info

## Data Structure

All data is stored locally in IndexedDB:

### Products
```javascript
{
  id: 1,
  name: "Lipstick Red",
  price: 299.99,
  stock: 15,
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Customers
```javascript
{
  id: 1,
  name: "Priya Sharma",
  phone: "+919876543210",
  purchaseHistory: [1, 2, 3],
  totalSpent: 5000.00,
  lastPurchaseDate: "2024-01-20T15:45:00Z"
}
```

### Sales
```javascript
{
  id: 1,
  customerId: 1,
  items: [
    { productId: 1, productName: "Lipstick", qty: 2, price: 299.99 }
  ],
  totalAmount: 599.98,
  date: "2024-01-20T15:45:00Z"
}
```

### Profile
```javascript
{
  key: "owner",
  ownerName: "Rajesh Kumar",
  businessName: "Cosmetic Zone",
  phoneNumber: "+919876543210",
  shopAddress: "123, Main Street..."
}
```

## Offline Mode

The app works completely offline!

- **First Load**: Requires internet to download and cache files
- **Subsequent Uses**: Works without internet
- **Data**: All data synced locally - no cloud dependency
- **Status Indicator**: 🟢 = Online, 🔴 = Offline

## UI Design

### Mobile-First Responsive
- ✅ Optimized for small screens (phones)
- ✅ Scales beautifully to tablets and desktops
- ✅ Touch-friendly buttons and controls
- ✅ Minimal animations for fast performance

### Navigation
- 5 main sections with quick access
- Clean, minimal design
- No unnecessary features
- Fast interactions (<2 taps for main actions)

## Performance

- **Lightweight**: No heavy frameworks
- **Fast**: Vanilla JavaScript with local storage
- **Offline**: Service Worker caching
- **Battery Efficient**: Minimal processing and animations
- **Low-End Device Friendly**: Works on devices with 1GB+ RAM

## Browser Compatibility

✅ **Supported**:
- Chrome/Chromium 40+
- Firefox 35+
- Safari 11+ (iOS 11+)
- Edge 15+
- Samsung Internet

❌ **Not Supported**:
- Internet Explorer

## Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter**: Submit forms
- **Escape**: Close modals

## Tips & Tricks

1. **Quick Stock Check**: Dashboard shows low stock items
2. **Customer Insights**: Click any customer to see full history
3. **Bulk Import**: Use VCF files to quickly add many customers
4. **Regular Backups**: Download backups weekly to backup locally
5. **Offline Access**: App works offline - perfect for when WiFi is down

## Troubleshooting

### App Not Installing?
- Ensure you're using HTTPS (on web) or localhost (for testing)
- Try using Chrome or Firefox browser
- Check if browser allows PWA installation

### Data Not Saving?
- Clear browser cache but NOT site data
- Ensure enough storage space on device
- Check browser privacy settings

### Service Worker Not Working?
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Try opening in a new tab
- Check browser console for errors

### Contact Import Not Working?
- Ensure VCF file is properly formatted
- Contacts must have name and phone number
- Try using contacts from another source

## Privacy & Security

- 🔒 **All data stays on your device** - No cloud sync
- 🔒 **No tracking or analytics** 
- 🔒 **No internet required after first load**
- 🔒 **Your business data is private**

## File Structure

```
PWA inventory app/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── db.js               # IndexedDB management
├── app.js              # App logic and UI
├── service-worker.js   # Offline functionality
├── manifest.json       # PWA configuration
└── README.md           # This file
```

## Future Enhancements (Planned)

- 📈 Advanced analytics and reports
- 📊 Charts and graphs for data visualization
- 💬 SMS/WhatsApp integration for reminders
- 🔔 Push notifications for low stock
- 📤 Cloud sync (optional)
- 🎯 Discount codes and promotions
- 📅 Inventory scheduling

## Development

To modify or extend the app:

1. **HTML Changes**: Edit `index.html` for structure
2. **Styling**: Modify `styles.css` for appearance
3. **Database**: Update `db.js` for data storage logic
4. **Features**: Add code to `app.js` for new functionality
5. **PWA Config**: Change `manifest.json` for app details

## Support

For issues or feature requests:
1. Check browser console for error messages (F12)
2. Clear browser cache and reload
3. Try in a different browser
4. Reset data in Profile section

## License

Free to use and modify for your business needs.

## Version

**v1.0.0** - Initial Release
- Full feature set for cosmetics business management
- Offline-first PWA
- IndexedDB storage
- VCF contact import
- Complete backup/restore

---

**Made with ❤️ for small business owners**

Start managing your cosmetics business smarter today! 💅
