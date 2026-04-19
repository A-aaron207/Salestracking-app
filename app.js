// Main Application Logic for Cosmetic Zone Manager PRO

// ========== LANGUAGE SUPPORT ==========

const translations = {
    en: {
        dashboard: 'Dashboard',
        products: 'Products',
        customers: 'Customers',
        sales: 'Sales',
        profile: 'Profile',
        todaysSales: "Today's Sales",
        totalRevenue: 'Total Revenue',
        totalCustomers: 'Total Customers',
        totalProducts: 'Total Products',
        topSellingProduct: 'Top Selling Product',
        lowStockAlerts: 'Low Stock Alerts',
        addProduct: '+ Add Product',
        addCustomer: '+ Add Customer',
        importVcf: '📥 Import VCF',
        recordSale: '+ Record Sale',
        backupData: '📥 Backup Data',
        restoreData: '📤 Restore Data',
        saveProfile: 'Save Profile',
        productName: 'Product Name',
        price: 'Price (₹)',
        stock: 'Stock Quantity',
        customerName: 'Customer Name',
        phoneNumber: 'Phone Number',
        businessName: 'Business Name',
        ownerName: 'Owner Name',
        shopAddress: 'Shop Address (Optional)',
        dataManagement: 'Data Management',
        appInformation: 'App Information',
        languageSettings: 'Language / भाषा',
        selectLanguage: 'Select Language:',
        noProductsAdded: 'No products added yet',
        noCustomersAdded: 'No customers added yet',
        noSalesRecorded: 'No sales recorded yet',
    },
    hi: {
        dashboard: 'डैशबोर्ड',
        products: 'उत्पाद',
        customers: 'ग्राहक',
        sales: 'बिक्रय',
        profile: 'प्रोफ़ाइल',
        todaysSales: 'आज की बिक्रय',
        totalRevenue: 'कुल राजस्व',
        totalCustomers: 'कुल ग्राहक',
        totalProducts: 'कुल उत्पाद',
        topSellingProduct: 'बेस्ट सेलिंग प्रोडक्ट',
        lowStockAlerts: 'कम स्टॉक चेतावनी',
        addProduct: '+ उत्पाद जोड़ें',
        addCustomer: '+ ग्राहक जोड़ें',
        importVcf: '📥 VCF आयात करें',
        recordSale: '+ बिक्रय रिकॉर्ड करें',
        backupData: '📥 डेटा बैकअप',
        restoreData: '📤 डेटा पुनः स्थापित करें',
        saveProfile: 'प्रोफाइल सहेजें',
        productName: 'उत्पाद का नाम',
        price: 'मूल्य (₹)',
        stock: 'स्टॉक की मात्रा',
        customerName: 'ग्राहक का नाम',
        phoneNumber: 'फोन नंबर',
        businessName: 'व्यवसाय का नाम',
        ownerName: 'मालिक का नाम',
        shopAddress: 'दुकान का पता (वैकल्पिक)',
        dataManagement: 'डेटा प्रबंधन',
        appInformation: 'ऐप जानकारी',
        languageSettings: 'भाषा / Language',
        selectLanguage: 'भाषा चुनें:',
        noProductsAdded: 'अभी कोई उत्पाद नहीं जोड़ा गया',
        noCustomersAdded: 'अभी कोई ग्राहक नहीं जोड़ा गया',
        noSalesRecorded: 'अभी कोई बिक्रय दर्ज नहीं किया गया',
    }
};

// Get current language from localStorage or default to English
function getCurrentLanguage() {
    return localStorage.getItem('czm_language') || 'en';
}

// Set language and update UI
function setLanguage(lang) {
    localStorage.setItem('czm_language', lang);
    updateLanguageUI();
}

// Update UI text based on current language
function updateLanguageUI() {
    const lang = getCurrentLanguage();
    // This function will be expanded as needed to update various text elements
}

// ========== FIRST LAUNCH DETECTION ==========

function isFirstLaunch() {
    return !localStorage.getItem('czm_launched');
}

function markAppAsLaunched() {
    localStorage.setItem('czm_launched', 'true');
}

function showWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    if (welcomeModal) {
        welcomeModal.classList.remove('hidden');
        
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                welcomeModal.classList.add('hidden');
                markAppAsLaunched();
            });
        }
        
        const closeBtn = welcomeModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                welcomeModal.classList.add('hidden');
                markAppAsLaunched();
            });
        }
    }
}

// ========== INITIALIZATION ==========

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service Worker registered:', reg);
                updateOnlineStatus();
            })
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

// Track online/offline status
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const appStatus = document.getElementById('appStatus');
    
    if (navigator.onLine) {
        statusIndicator.textContent = '🟢';
        if (appStatus) appStatus.textContent = 'Online';
        console.log('App is online');
    } else {
        statusIndicator.textContent = '🔴';
        if (appStatus) appStatus.textContent = 'Offline';
        console.log('App is offline');
    }
}

// ========== PAGE INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Show welcome modal if first launch
        if (isFirstLaunch()) {
            showWelcomeModal();
        }
        
        // Set up language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = getCurrentLanguage();
            languageSelect.addEventListener('change', (e) => {
                setLanguage(e.target.value);
            });
        }

        // Wait for DB to be ready
        await new Promise(resolve => {
            if (db.db) {
                resolve();
            } else {
                let attempts = 0;
                const checkDb = setInterval(() => {
                    if (db.db) {
                        clearInterval(checkDb);
                        resolve();
                    }
                    attempts++;
                    if (attempts > 50) {
                        clearInterval(checkDb);
                        resolve();
                    }
                }, 100);
            }
        });

        // Initialize UI
        await loadProfile();
        initializeEventListeners();
        updateDashboard();
        updateProductsList();
        updateCustomersList();
        updateSalesList();
        updateOnlineStatus();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ========== EVENT LISTENERS ==========

function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });

    // Dashboard - no specific listeners needed

    // Products
    document.getElementById('addProductBtn')?.addEventListener('click', showProductForm);
    document.getElementById('cancelProductBtn')?.addEventListener('click', hideProductForm);
    document.getElementById('productFormElement')?.addEventListener('submit', handleSaveProduct);

    // Customers
    document.getElementById('addCustomerBtn')?.addEventListener('click', showCustomerForm);
    document.getElementById('cancelCustomerBtn')?.addEventListener('click', hideCustomerForm);
    document.getElementById('customerFormElement')?.addEventListener('submit', handleSaveCustomer);
    document.getElementById('importVcfBtn')?.addEventListener('click', showVcfForm);
    document.getElementById('vcfFile')?.addEventListener('change', handleVcfFileSelect);
    document.getElementById('importSelectedBtn')?.addEventListener('click', handleImportVcf);
    document.getElementById('cancelVcfBtn')?.addEventListener('click', hideVcfForm);
    document.getElementById('cancelVcfBtn2')?.addEventListener('click', hideVcfForm);

    // Sales
    document.getElementById('recordSaleBtn')?.addEventListener('click', showSaleForm);
    document.getElementById('cancelSaleBtn')?.addEventListener('click', hideSaleForm);
    document.getElementById('saleFormElement')?.addEventListener('submit', handleSaveSale);
    document.getElementById('addItemBtn')?.addEventListener('click', addSaleItem);
    document.getElementById('saleCustomer')?.addEventListener('change', updateSaleForm);

    // Profile
    document.getElementById('profileFormElement')?.addEventListener('submit', handleSaveProfile);
    document.getElementById('backupBtn')?.addEventListener('click', handleBackupData);
    document.getElementById('restoreBtn')?.addEventListener('click', () => {
        document.getElementById('restoreFile').click();
    });
    document.getElementById('restoreFile')?.addEventListener('change', handleRestoreData);

    // Modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModals();
        });
    });
}

// ========== NAVIGATION ==========

function handleNavigation(e) {
    // Get the button element (handle clicks on span children too)
    const button = e.target.closest('.nav-btn');
    if (!button) return;
    
    const section = button.getAttribute('data-section');
    if (!section) return;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Hide all forms and modals
    hideProductForm();
    hideCustomerForm();
    hideVcfForm();
    hideSaleForm();
    closeModals();
    
    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Refresh content when switching sections
    if (section === 'dashboard') {
        updateDashboard();
    } else if (section === 'products') {
        updateProductsList();
    } else if (section === 'customers') {
        updateCustomersList();
    } else if (section === 'sales') {
        updateSalesList();
        updateSaleCustomerDropdown();
    }
}

// ========== DASHBOARD ==========

async function updateDashboard() {
    try {
        const stats = await db.getStats();
        const products = await db.getAllProducts();
        const sales = await db.getAllSales();
        const customers = await db.getAllCustomers();
        
        // Update stat cards
        document.getElementById('todaySales').textContent = '₹' + stats.todayRevenue.toFixed(2);
        document.getElementById('totalRevenue').textContent = '₹' + stats.totalRevenue.toFixed(2);
        document.getElementById('totalCustomers').textContent = customers.length;
        document.getElementById('totalProducts').textContent = products.length;
        
        // Top selling product
        const productSales = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                productSales[item.productName] = (productSales[item.productName] || 0) + item.qty;
            });
        });
        
        const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
        const topProductEl = document.getElementById('topProduct');
        
        if (topProduct) {
            topProductEl.innerHTML = `
                <div class="info-box">
                    <div class="stat-label">Top Product</div>
                    <div class="product-name">${topProduct[0]}</div>
                    <div class="product-stock">${topProduct[1]} units sold</div>
                </div>
            `;
        } else {
            topProductEl.innerHTML = '<p class="empty-state">No sales yet</p>';
        }
        
        // Low stock alerts
        const lowStockProducts = products.filter(p => p.stock < 10);
        const lowStockEl = document.getElementById('lowStockAlerts');
        
        if (lowStockProducts.length > 0) {
            lowStockEl.innerHTML = lowStockProducts.map(p => `
                <div class="low-stock-item">
                    <div class="low-stock-name">${p.name}</div>
                    <div class="low-stock-info">Only ${p.stock} units in stock</div>
                </div>
            `).join('');
        } else {
            lowStockEl.innerHTML = '<p class="empty-state">All products well stocked</p>';
        }
    } catch (error) {
        console.error('Dashboard update error:', error);
    }
}

// ========== PRODUCTS ==========

function showProductForm() {
    document.getElementById('productForm').classList.remove('hidden');
    document.getElementById('productFormTitle').textContent = 'Add New Product';
    document.getElementById('productFormElement').reset();
    document.getElementById('productFormElement').dataset.editId = '';
}

function hideProductForm() {
    document.getElementById('productForm').classList.add('hidden');
    document.getElementById('productFormElement').reset();
    document.getElementById('productFormElement').dataset.editId = '';
}

async function handleSaveProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const editId = document.getElementById('productFormElement').dataset.editId;
    
    try {
        if (editId) {
            // Update existing product and remove isPending flag if it was pending
            await db.updateProduct(parseInt(editId), { name, price, stock, isPending: false });
            showNotification('Product updated successfully');
        } else {
            await db.addProduct({ name, price, stock });
            showNotification('Product added successfully');
        }
        
        hideProductForm();
        updateProductsList();
        updateDashboard();
    } catch (error) {
        showNotification('Error saving product: ' + error.message, 'error');
        console.error('Save product error:', error);
    }
}

async function updateProductsList() {
    try {
        const products = await db.getAllProducts();
        const productsList = document.getElementById('productsList');
        
        if (products.length === 0) {
            productsList.innerHTML = '<p class="empty-state">No products added yet</p>';
        } else {
            productsList.innerHTML = products.map(p => {
                const stockClass = p.stock < 5 ? 'stock-critical' : p.stock < 10 ? 'stock-warning' : '';
                const pendingClass = p.isPending ? 'product-pending' : '';
                const pendingBadge = p.isPending ? '<span class="pending-badge">⏳ Pending Details</span>' : '';
                return `
                    <div class="product-card ${stockClass} ${pendingClass}" onclick="showProductModal(${p.id})">
                        ${pendingBadge}
                        <div class="product-name">${p.name}</div>
                        <div class="product-price">₹${p.price.toFixed(2)}</div>
                        <div class="product-stock">📦 ${p.stock} units</div>
                    </div>
                `;
            }).join('');
        }
        
        // Check for pending products
        const pendingProducts = await db.getPendingProducts();
        if (pendingProducts.length > 0) {
            showPendingProductsModal(pendingProducts);
        }
    } catch (error) {
        console.error('Products list error:', error);
    }
}

async function showPendingProductsModal(pendingProducts) {
    const modal = document.getElementById('pendingProductsModal');
    if (!modal) return;
    
    const list = document.getElementById('pendingProductsList');
    if (list) {
        list.innerHTML = pendingProducts.map(p => `
            <div class="pending-product-item">
                <div class="pending-product-info">
                    <div class="pending-product-name">${p.name}</div>
                    <div class="pending-product-price">₹${p.price}</div>
                </div>
                <button class="btn-primary-small" onclick="editPendingProduct(${p.id})">Complete Details</button>
            </div>
        `).join('');
    }
    
    modal.classList.remove('hidden');
}

async function editPendingProduct(productId) {
    try {
        const product = await db.getProduct(productId);
        if (!product) return;
        
        // Close pending products modal
        const pendingModal = document.getElementById('pendingProductsModal');
        if (pendingModal) {
            pendingModal.classList.add('hidden');
        }
        
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = '₹' + product.price.toFixed(2);
        document.getElementById('modalProductStock').textContent = product.stock + ' units';
        
        document.getElementById('editProductBtn').onclick = () => {
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productFormElement').dataset.editId = product.id;
            document.getElementById('productFormTitle').textContent = 'Complete Product Details';
            document.getElementById('productForm').classList.remove('hidden');
            closeModals();
        };
        
        document.getElementById('deleteProductBtn').onclick = async () => {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await db.deleteProduct(productId);
                    showNotification('Product deleted successfully');
                    closeModals();
                    updateProductsList();
                    updateDashboard();
                } catch (error) {
                    showNotification('Error deleting product: ' + error.message, 'error');
                }
            }
        };
        
        document.getElementById('productModal').classList.remove('hidden');
    } catch (error) {
        console.error('Show pending product modal error:', error);
    }
}

async function showProductModal(id) {
    try {
        const product = await db.getProduct(id);
        if (!product) return;
        
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = '₹' + product.price.toFixed(2);
        document.getElementById('modalProductStock').textContent = product.stock + ' units';
        
        document.getElementById('editProductBtn').onclick = () => {
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productFormElement').dataset.editId = product.id;
            document.getElementById('productFormTitle').textContent = 'Edit Product';
            document.getElementById('productForm').classList.remove('hidden');
            closeModals();
        };
        
        document.getElementById('deleteProductBtn').onclick = async () => {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await db.deleteProduct(id);
                    showNotification('Product deleted successfully');
                    closeModals();
                    updateProductsList();
                    updateDashboard();
                } catch (error) {
                    showNotification('Error deleting product: ' + error.message, 'error');
                }
            }
        };
        
        document.getElementById('productModal').classList.remove('hidden');
    } catch (error) {
        console.error('Show product modal error:', error);
    }
}

// ========== CUSTOMERS ==========

function showCustomerForm() {
    document.getElementById('customerForm').classList.remove('hidden');
    document.getElementById('customerFormElement').reset();
}

function hideCustomerForm() {
    document.getElementById('customerForm').classList.add('hidden');
    document.getElementById('customerFormElement').reset();
}

async function handleSaveCustomer(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    
    try {
        // Check if customer with this phone already exists
        const existing = await db.getCustomerByPhone(phone);
        if (existing) {
            showNotification('Customer with this phone number already exists', 'error');
            return;
        }
        
        await db.addCustomer({ name, phone });
        showNotification('Customer added successfully');
        hideCustomerForm();
        updateCustomersList();
        updateDashboard();
    } catch (error) {
        showNotification('Error saving customer: ' + error.message, 'error');
        console.error('Save customer error:', error);
    }
}

async function updateCustomersList() {
    try {
        const customers = await db.getAllCustomers();
        const customersList = document.getElementById('customersList');
        
        if (customers.length === 0) {
            customersList.innerHTML = '<p class="empty-state">No customers added yet</p>';
            return;
        }
        
        customersList.innerHTML = customers.map(c => `
            <div class="customer-card" onclick="showCustomerModal(${c.id})">
                <div class="customer-name">${c.name}</div>
                <div class="customer-phone">📞 ${c.phone}</div>
                <div class="customer-stats">
                    <span class="customer-stat">💰 ₹${(c.totalSpent || 0).toFixed(2)}</span>
                    <span class="customer-stat">🛍️ ${(c.purchaseHistory || []).length} purchases</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Customers list error:', error);
    }
}

async function showCustomerModal(id) {
    try {
        const customer = await db.getCustomer(id);
        if (!customer) return;
        
        const sales = await db.getSalesByCustomer(id);
        
        document.getElementById('modalCustomerName').textContent = customer.name;
        document.getElementById('modalCustomerPhone').textContent = customer.phone;
        document.getElementById('modalCustomerTotalSpent').textContent = '₹' + (customer.totalSpent || 0).toFixed(2);
        
        const lastPurchase = customer.lastPurchaseDate 
            ? new Date(customer.lastPurchaseDate).toLocaleDateString()
            : 'Never';
        document.getElementById('modalCustomerLastPurchase').textContent = lastPurchase;
        
        document.getElementById('callBtn').onclick = () => {
            window.location.href = `tel:${customer.phone}`;
        };
        
        // Purchase history
        const historyEl = document.getElementById('modalPurchaseHistory');
        if (sales.length > 0) {
            historyEl.innerHTML = sales.map(sale => `
                <div class="purchase-item">
                    <div class="purchase-date">${new Date(sale.date).toLocaleDateString()}</div>
                    <div class="purchase-details">
                        ${sale.items.map(item => `${item.productName} (${item.qty}x)`).join(', ')}
                    </div>
                    <div class="purchase-amount">₹${sale.totalAmount.toFixed(2)}</div>
                </div>
            `).join('');
        } else {
            historyEl.innerHTML = '<p class="empty-state">No purchase history</p>';
        }
        
        document.getElementById('customerModal').classList.remove('hidden');
    } catch (error) {
        console.error('Show customer modal error:', error);
    }
}

// ========== VCF IMPORT ==========

function showVcfForm() {
    document.getElementById('vcfImportForm').classList.remove('hidden');
    document.getElementById('vcfFile').value = '';
    document.getElementById('vcfPreview').classList.add('hidden');
}

function hideVcfForm() {
    document.getElementById('vcfImportForm').classList.add('hidden');
    document.getElementById('vcfFile').value = '';
    document.getElementById('vcfPreview').classList.add('hidden');
    document.getElementById('vcfContactsList').innerHTML = '';
}

function handleVcfFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const vcfContent = event.target.result;
            const contacts = parseVcf(vcfContent);
            
            if (contacts.length === 0) {
                showNotification('No valid contacts found in VCF file', 'error');
                return;
            }
            
            displayVcfContacts(contacts);
            document.getElementById('vcfPreview').classList.remove('hidden');
            document.getElementById('vcfFormActions').style.display = 'none';
        } catch (error) {
            showNotification('Error parsing VCF file: ' + error.message, 'error');
            console.error('VCF parse error:', error);
        }
    };
    reader.readAsText(file);
}

function parseVcf(vcfContent) {
    const contacts = [];
    const lines = vcfContent.split('\n');
    let currentContact = {};
    
    for (let line of lines) {
        line = line.trim();
        
        if (line === 'BEGIN:VCARD') {
            currentContact = {};
        } else if (line === 'END:VCARD' && currentContact.name && currentContact.phone) {
            contacts.push(currentContact);
        } else if (line.startsWith('FN:') || line.startsWith('N:')) {
            const name = line.split(':')[1].trim();
            if (name && !currentContact.name) {
                currentContact.name = name;
            }
        } else if (line.startsWith('TEL')) {
            const phone = line.split(':')[1]?.trim();
            if (phone && !currentContact.phone) {
                // Clean phone number
                currentContact.phone = phone.replace(/[^\d+]/g, '');
            }
        }
    }
    
    return contacts;
}

function displayVcfContacts(contacts) {
    const contactsList = document.getElementById('vcfContactsList');
    contactsList.innerHTML = contacts.map((contact, index) => `
        <div class="vcf-contact-item">
            <input type="checkbox" id="vcf-contact-${index}" checked>
            <div class="vcf-contact-info">
                <div class="vcf-contact-name">${contact.name}</div>
                <div class="vcf-contact-phone">${contact.phone}</div>
            </div>
        </div>
    `).join('');
}

async function handleImportVcf() {
    try {
        const checkboxes = document.querySelectorAll('#vcfContactsList input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            showNotification('Please select at least one contact', 'error');
            return;
        }
        
        let imported = 0;
        let skipped = 0;
        
        for (let checkbox of checkboxes) {
            const index = parseInt(checkbox.id.split('-')[2]);
            const contactName = checkbox.parentElement.querySelector('.vcf-contact-name').textContent;
            const contactPhone = checkbox.parentElement.querySelector('.vcf-contact-phone').textContent;
            
            try {
                const existing = await db.getCustomerByPhone(contactPhone);
                if (existing) {
                    skipped++;
                } else {
                    await db.addCustomer({
                        name: contactName,
                        phone: contactPhone
                    });
                    imported++;
                }
            } catch (error) {
                console.warn(`Failed to import ${contactName}:`, error);
                skipped++;
            }
        }
        
        showNotification(`Imported ${imported} contacts${skipped > 0 ? `, ${skipped} skipped` : ''}`);
        hideVcfForm();
        updateCustomersList();
        updateDashboard();
    } catch (error) {
        showNotification('Error importing contacts: ' + error.message, 'error');
        console.error('Import VCF error:', error);
    }
}

// ========== SALES ==========

function showSaleForm() {
    document.getElementById('saleForm').classList.remove('hidden');
    document.getElementById('saleFormElement').reset();
    document.getElementById('saleItems').innerHTML = '';
    updateSaleForm();
    updateSaleCustomerDropdown();
}

function hideSaleForm() {
    document.getElementById('saleForm').classList.add('hidden');
    document.getElementById('saleFormElement').reset();
    document.getElementById('saleItems').innerHTML = '';
}

async function updateSaleCustomerDropdown() {
    const customers = await db.getAllCustomers();
    const dropdown = document.getElementById('saleCustomer');
    
    dropdown.innerHTML = '<option value="">Select a customer</option>' + 
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function updateSaleForm() {
    const customerId = document.getElementById('saleCustomer').value;
    
    if (!customerId) {
        document.getElementById('saleItems').innerHTML = '';
        return;
    }
    
    const products = await db.getAllProducts();
    const saleItemsContainer = document.getElementById('saleItems');
    
    if (saleItemsContainer.children.length === 0) {
        addSaleItem();
    }
}

async function addSaleItem() {
    const products = await db.getAllProducts();
    const saleItems = document.getElementById('saleItems');
    const itemIndex = saleItems.children.length;
    
    const itemHtml = `
        <div class="sale-item-row" id="sale-item-${itemIndex}">
            <div class="sale-item-product-wrapper">
                <select class="sale-item-product" onChange="updateSaleTotals()" required>
                    <option value="">Select product</option>
                    ${products.map(p => `<option value="${p.id}|${p.price}|${p.name}" data-product-id="${p.id}">${p.name} - ₹${p.price.toFixed(2)}</option>`).join('')}
                </select>
                <input type="text" class="sale-item-custom-name hidden" placeholder="Enter new product name" />
                <button type="button" class="btn-small" onclick="toggleCustomProduct(${itemIndex})">+ New</button>
            </div>
            <input type="number" class="sale-item-qty" min="1" value="1" onChange="updateSaleTotals()" placeholder="Qty" required>
            <input type="number" class="sale-item-custom-price hidden" min="0" step="0.01" placeholder="Price (₹)" />
            <div class="sale-item-price">₹<span class="item-price">0</span></div>
            <button type="button" class="sale-item-remove" onclick="removeSaleItem(${itemIndex})">Remove</button>
        </div>
    `;
    
    saleItems.innerHTML += itemHtml;
}

function toggleCustomProduct(index) {
    const itemRow = document.getElementById(`sale-item-${index}`);
    const select = itemRow.querySelector('.sale-item-product');
    const customName = itemRow.querySelector('.sale-item-custom-name');
    const customPrice = itemRow.querySelector('.sale-item-custom-price');
    const btn = itemRow.querySelector('.btn-small');
    
    if (select.classList.contains('hidden')) {
        // Switch back to select
        select.classList.remove('hidden');
        customName.classList.add('hidden');
        customPrice.classList.add('hidden');
        btn.textContent = '+ New';
        customName.value = '';
        customPrice.value = '';
    } else {
        // Switch to custom product
        select.classList.add('hidden');
        customName.classList.remove('hidden');
        customPrice.classList.remove('hidden');
        btn.textContent = 'Select';
        select.value = '';
    }
    updateSaleTotals();
}

function removeSaleItem(index) {
    document.getElementById(`sale-item-${index}`)?.remove();
    updateSaleTotals();
}

function updateSaleTotals() {
    let subtotal = 0;
    const items = document.querySelectorAll('.sale-item-row');
    
    items.forEach(item => {
        const productSelect = item.querySelector('.sale-item-product');
        const customName = item.querySelector('.sale-item-custom-name');
        const customPrice = item.querySelector('.sale-item-custom-price');
        const qtyInput = item.querySelector('.sale-item-qty');
        const priceSpan = item.querySelector('.item-price');
        
        if (qtyInput.value) {
            const qty = parseInt(qtyInput.value) || 0;
            let price = 0;
            
            if (productSelect.classList.contains('hidden')) {
                // Custom product
                price = parseFloat(customPrice.value) || 0;
            } else if (productSelect.value) {
                // Existing product
                const [, priceStr] = productSelect.value.split('|');
                price = parseFloat(priceStr);
            }
            
            const itemTotal = price * qty;
            priceSpan.textContent = itemTotal.toFixed(2);
            subtotal += itemTotal;
        }
    });
    
    document.getElementById('saleSubtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('saleTotalAmount').textContent = '₹' + subtotal.toFixed(2);
}

async function handleSaveSale(e) {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('saleCustomer').value);
    const items = [];
    let totalAmount = 0;
    
    document.querySelectorAll('.sale-item-row').forEach(item => {
        const productSelect = item.querySelector('.sale-item-product');
        const customName = item.querySelector('.sale-item-custom-name');
        const customPrice = item.querySelector('.sale-item-custom-price');
        const qtyInput = item.querySelector('.sale-item-qty');
        
        if (qtyInput.value) {
            let productId = 0;
            let productName = '';
            let price = 0;
            
            if (productSelect.classList.contains('hidden')) {
                // Custom product
                productName = customName.value.trim();
                price = parseFloat(customPrice.value) || 0;
                
                if (!productName) {
                    showNotification('Please enter product name for custom product', 'error');
                    throw new Error('Missing product name');
                }
                
                productId = null; // Will be created later
            } else if (productSelect.value) {
                // Existing product
                const [pId, priceStr, pName] = productSelect.value.split('|');
                productId = parseInt(pId);
                productName = pName;
                price = parseFloat(priceStr);
            } else {
                return; // Skip if nothing selected
            }
            
            const qty = parseInt(qtyInput.value);
            const itemTotal = price * qty;
            
            items.push({
                productId: productId,
                productName: productName,
                qty: qty,
                price: price,
                itemTotal: itemTotal
            });
            
            totalAmount += itemTotal;
        }
    });
    
    if (items.length === 0) {
        showNotification('Please add at least one item', 'error');
        return;
    }
    
    try {
        // Handle custom/new products
        for (let i = 0; i < items.length; i++) {
            if (items[i].productId === null) {
                // Check if product with this name already exists
                const existing = await db.getProductByName(items[i].productName);
                if (existing) {
                    items[i].productId = existing.id;
                } else {
                    // Create pending product
                    const newProductId = await db.addProduct({
                        name: items[i].productName,
                        price: items[i].price,
                        stock: 0,
                        isPending: true,
                        createdForSale: true
                    });
                    items[i].productId = newProductId;
                }
            }
        }
        
        // Save sale
        const saleId = await db.addSale({
            customerId,
            items,
            totalAmount
        });
        
        // Update customer
        const customer = await db.getCustomer(customerId);
        const updatedCustomer = {
            ...customer,
            purchaseHistory: [...(customer.purchaseHistory || []), saleId],
            totalSpent: (customer.totalSpent || 0) + totalAmount,
            lastPurchaseDate: new Date().toISOString()
        };
        await db.updateCustomer(customerId, updatedCustomer);
        
        // Update product stock
        for (const item of items) {
            const product = await db.getProduct(item.productId);
            const updatedStock = Math.max(0, product.stock - item.qty);
            await db.updateProduct(item.productId, { stock: updatedStock });
        }
        
        showNotification('Sale recorded successfully');
        hideSaleForm();
        updateSalesList();
        updateCustomersList();
        updateProductsList();
        updateDashboard();
    } catch (error) {
        showNotification('Error recording sale: ' + error.message, 'error');
        console.error('Save sale error:', error);
    }
}

async function updateSalesList() {
    try {
        const sales = await db.getAllSales();
        const salesList = document.getElementById('salesList');
        
        if (sales.length === 0) {
            salesList.innerHTML = '<p class="empty-state">No sales recorded yet</p>';
            return;
        }
        
        salesList.innerHTML = await Promise.all(sales.slice(0, 20).map(async (sale) => {
            const customer = await db.getCustomer(sale.customerId);
            const itemsText = sale.items.map(i => `${i.productName} (${i.qty})`).join(', ');
            
            return `
                <div class="sale-card">
                    <div class="sale-header">
                        <div class="sale-customer">${customer?.name || 'Unknown'}</div>
                        <div class="sale-date">${new Date(sale.date).toLocaleDateString()}</div>
                    </div>
                    <div class="sale-items">${itemsText}</div>
                    <div class="sale-total">₹${sale.totalAmount.toFixed(2)}</div>
                </div>
            `;
        })).then(html => html.join(''));
    } catch (error) {
        console.error('Sales list error:', error);
    }
}

// ========== PROFILE ==========

async function loadProfile() {
    try {
        const profile = await db.getProfile();
        if (profile && profile.ownerName) {
            document.getElementById('ownerName').value = profile.ownerName || '';
            document.getElementById('businessName').value = profile.businessName || '';
            document.getElementById('phoneNumber').value = profile.phoneNumber || '';
            document.getElementById('shopAddress').value = profile.shopAddress || '';
        }
    } catch (error) {
        console.error('Load profile error:', error);
    }
}

async function handleSaveProfile(e) {
    e.preventDefault();
    
    const profile = {
        ownerName: document.getElementById('ownerName').value,
        businessName: document.getElementById('businessName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        shopAddress: document.getElementById('shopAddress').value
    };
    
    try {
        await db.saveProfile(profile);
        showNotification('Profile saved successfully');
    } catch (error) {
        showNotification('Error saving profile: ' + error.message, 'error');
        console.error('Save profile error:', error);
    }
}

// ========== BACKUP & RESTORE ==========

async function handleBackupData() {
    try {
        const data = await db.exportData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cosmetic-zone-backup-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('Data backed up successfully');
    } catch (error) {
        showNotification('Error backing up data: ' + error.message, 'error');
        console.error('Backup error:', error);
    }
}

async function handleRestoreData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!confirm('This will replace all existing data. Are you sure?')) {
        e.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const data = JSON.parse(event.target.result);
            await db.importData(data);
            showNotification('Data restored successfully');
            
            // Refresh UI
            updateDashboard();
            updateProductsList();
            updateCustomersList();
            updateSalesList();
            await loadProfile();
        } catch (error) {
            showNotification('Error restoring data: ' + error.message, 'error');
            console.error('Restore error:', error);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// ========== UTILITIES ==========

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

function showNotification(message, type = 'success') {
    // Create a simple notification (you can enhance this with a more sophisticated solution)
    console.log(`[${type}] ${message}`);
    
    // Optional: Add visual feedback
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
