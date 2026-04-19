// IndexedDB Database Management for Cosmetic Zone Manager PRO

class CosmeticDB {
    constructor() {
        this.dbName = 'CosmeticZoneDB';
        this.dbVersion = 1;
        this.db = null;
    }

    /**
     * Initialize the database and create object stores
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
                    productStore.createIndex('name', 'name', { unique: false });
                    console.log('Products store created');
                }

                if (!db.objectStoreNames.contains('customers')) {
                    const customerStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
                    customerStore.createIndex('phone', 'phone', { unique: true });
                    customerStore.createIndex('name', 'name', { unique: false });
                    console.log('Customers store created');
                }

                if (!db.objectStoreNames.contains('sales')) {
                    const saleStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
                    saleStore.createIndex('customerId', 'customerId', { unique: false });
                    saleStore.createIndex('date', 'date', { unique: false });
                    console.log('Sales store created');
                }

                if (!db.objectStoreNames.contains('profile')) {
                    db.createObjectStore('profile', { keyPath: 'key' });
                    console.log('Profile store created');
                }
            };
        });
    }

    // ========== PRODUCT OPERATIONS ==========

    /**
     * Add a new product
     */
    async addProduct(product) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.add({
                ...product,
                createdAt: new Date().toISOString()
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all products
     */
    async getAllProducts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a product by ID
     */
    async getProduct(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update a product
     */
    async updateProduct(id, updates) {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await this.getProduct(id);
                if (!product) {
                    reject(new Error('Product not found'));
                    return;
                }

                const updated = { ...product, ...updates, updatedAt: new Date().toISOString() };
                
                const transaction = this.db.transaction(['products'], 'readwrite');
                const store = transaction.objectStore('products');
                const request = store.put(updated);

                request.onsuccess = () => resolve(updated);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete a product
     */
    async deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get product by name
     */
    async getProductByName(name) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const index = store.index('name');
            const request = index.get(name);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all pending products (products without price/stock)
     */
    async getPendingProducts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => {
                const pendingProducts = request.result.filter(p => p.isPending === true);
                resolve(pendingProducts);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // ========== CUSTOMER OPERATIONS ==========

    /**
     * Add a new customer
     */
    async addCustomer(customer) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['customers'], 'readwrite');
            const store = transaction.objectStore('customers');
            const request = store.add({
                ...customer,
                purchaseHistory: [],
                totalSpent: 0,
                lastPurchaseDate: null,
                createdAt: new Date().toISOString()
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all customers
     */
    async getAllCustomers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['customers'], 'readonly');
            const store = transaction.objectStore('customers');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a customer by ID
     */
    async getCustomer(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['customers'], 'readonly');
            const store = transaction.objectStore('customers');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get customer by phone
     */
    async getCustomerByPhone(phone) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['customers'], 'readonly');
            const index = transaction.objectStore('customers').index('phone');
            const request = index.get(phone);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get customer by name
     */
    async getCustomerByName(name) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['customers'], 'readonly');
            const index = transaction.objectStore('customers').index('name');
            const request = index.get(name);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update a customer
     */
    async updateCustomer(id, updates) {
        return new Promise(async (resolve, reject) => {
            try {
                const customer = await this.getCustomer(id);
                if (!customer) {
                    reject(new Error('Customer not found'));
                    return;
                }

                const updated = { ...customer, ...updates, updatedAt: new Date().toISOString() };
                
                const transaction = this.db.transaction(['customers'], 'readwrite');
                const store = transaction.objectStore('customers');
                const request = store.put(updated);

                request.onsuccess = () => resolve(updated);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete a customer
     */
    async deleteCustomer(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['customers'], 'readwrite');
            const store = transaction.objectStore('customers');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ========== SALE OPERATIONS ==========

    /**
     * Add a new sale
     */
    async addSale(sale) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sales'], 'readwrite');
            const store = transaction.objectStore('sales');
            const request = store.add({
                ...sale,
                date: new Date().toISOString()
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all sales
     */
    async getAllSales() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sales'], 'readonly');
            const store = transaction.objectStore('sales');
            const request = store.getAll();

            request.onsuccess = () => {
                // Sort by date descending
                const sales = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(sales);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get sales by customer ID
     */
    async getSalesByCustomer(customerId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sales'], 'readonly');
            const index = transaction.objectStore('sales').index('customerId');
            const request = index.getAll(customerId);

            request.onsuccess = () => {
                const sales = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(sales);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get sales for a specific date range
     */
    async getSalesByDateRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sales'], 'readonly');
            const store = transaction.objectStore('sales');
            const request = store.getAll();

            request.onsuccess = () => {
                const sales = request.result.filter(sale => {
                    const saleDate = new Date(sale.date);
                    return saleDate >= startDate && saleDate <= endDate;
                }).sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(sales);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get today's sales
     */
    async getTodaySales() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.getSalesByDateRange(today, tomorrow);
    }

    // ========== PROFILE OPERATIONS ==========

    /**
     * Save profile data
     */
    async saveProfile(profile) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['profile'], 'readwrite');
            const store = transaction.objectStore('profile');
            const request = store.put({ key: 'owner', ...profile });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get profile data
     */
    async getProfile() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['profile'], 'readonly');
            const store = transaction.objectStore('profile');
            const request = store.get('owner');

            request.onsuccess = () => resolve(request.result || {});
            request.onerror = () => reject(request.error);
        });
    }

    // ========== BACKUP & RESTORE ==========

    /**
     * Export all data as JSON
     */
    async exportData() {
        try {
            const products = await this.getAllProducts();
            const customers = await this.getAllCustomers();
            const sales = await this.getAllSales();
            const profile = await this.getProfile();

            return {
                version: '1.0',
                exportDate: new Date().toISOString(),
                products,
                customers,
                sales,
                profile
            };
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }

    /**
     * Import data from JSON
     */
    async importData(data) {
        try {
            // Clear existing data
            await this.clearAllData();

            // Import products
            if (data.products && Array.isArray(data.products)) {
                for (const product of data.products) {
                    const { id, ...productData } = product;
                    await this.addProduct(productData);
                }
            }

            // Import customers
            if (data.customers && Array.isArray(data.customers)) {
                for (const customer of data.customers) {
                    const { id, ...customerData } = customer;
                    await this.addCustomer(customerData);
                }
            }

            // Import sales
            if (data.sales && Array.isArray(data.sales)) {
                for (const sale of data.sales) {
                    const { id, ...saleData } = sale;
                    await this.addSale(saleData);
                }
            }

            // Import profile
            if (data.profile && Object.keys(data.profile).length > 0) {
                const { key, ...profileData } = data.profile;
                await this.saveProfile(profileData);
            }

            return true;
        } catch (error) {
            console.error('Import error:', error);
            throw error;
        }
    }

    /**
     * Clear all data from the database
     */
    async clearAllData() {
        return Promise.all([
            this.clearStore('products'),
            this.clearStore('customers'),
            this.clearStore('sales'),
            this.clearStore('profile')
        ]);
    }

    /**
     * Clear a specific object store
     */
    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get database statistics
     */
    async getStats() {
        const products = await this.getAllProducts();
        const customers = await this.getAllCustomers();
        const sales = await this.getAllSales();

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const todaySales = await this.getTodaySales();
        const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        return {
            totalProducts: products.length,
            totalCustomers: customers.length,
            totalSales: sales.length,
            totalRevenue,
            todayRevenue,
            todaySalesCount: todaySales.length
        };
    }
}

// Initialize database
const db = new CosmeticDB();
db.init().catch(err => console.error('Failed to initialize database:', err));
