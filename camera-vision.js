// Camera Vision Module - Detect products from paper using Computer Vision

let mediaStream = null;
let detectedData = {
    customerName: '',
    products: []
};

// Initialize camera vision features
function initializeCameraVision() {
    document.getElementById('openCameraBtn')?.addEventListener('click', openCamera);
    document.getElementById('capturePhotoBtn')?.addEventListener('click', capturePhoto);
    document.getElementById('closeCameraBtn')?.addEventListener('click', closeCamera);
    document.getElementById('closePreviewBtn')?.addEventListener('click', closeDetectedDataPreview);
    document.getElementById('saveDetectedDataBtn')?.addEventListener('click', saveDetectedData);
    document.getElementById('cancelDetectedDataBtn')?.addEventListener('click', closeDetectedDataPreview);
}

// Open camera
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.getElementById('cameraVideo');
        videoElement.srcObject = mediaStream;
        
        document.getElementById('cameraContainer').classList.remove('hidden');
        
        // Wait for video to be ready
        await new Promise(resolve => {
            videoElement.onloadedmetadata = () => resolve();
        });
        
        showNotification('Camera opened successfully', 'success');
    } catch (error) {
        showNotification('Unable to access camera: ' + error.message, 'error');
        console.error('Camera error:', error);
    }
}

// Close camera
function closeCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    document.getElementById('cameraContainer').classList.add('hidden');
}

// Capture photo from camera
async function capturePhoto() {
    try {
        const video = document.getElementById('cameraVideo');
        const canvas = document.getElementById('cameraCanvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        closeCamera();
        
        document.getElementById('visionProcessing').classList.remove('hidden');
        document.getElementById('processingText').textContent = 'Processing image with AI...';
        
        // Get image data
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Process with OCR
        await processImageWithOCR(imageData);
        
    } catch (error) {
        showNotification('Error capturing photo: ' + error.message, 'error');
        console.error('Capture error:', error);
        document.getElementById('visionProcessing').classList.add('hidden');
    }
}

// Process image with Tesseract OCR
async function processImageWithOCR(imageData) {
    try {
        document.getElementById('processingText').textContent = 'Analyzing text...';
        
        const result = await Tesseract.recognize(imageData, 'eng+hin');
        const detectedText = result.data.text;
        
        console.log('Detected text:', detectedText);
        
        // Parse the detected text
        parseDetectedData(detectedText);
        
        document.getElementById('visionProcessing').classList.add('hidden');
        displayDetectedDataPreview();
        
    } catch (error) {
        showNotification('OCR processing error: ' + error.message, 'error');
        console.error('OCR error:', error);
        document.getElementById('visionProcessing').classList.add('hidden');
    }
}

// Parse detected text to extract customer name, products, and prices
function parseDetectedData(text) {
    // Reset data
    detectedData = {
        customerName: '',
        products: []
    };
    
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
        showNotification('No text detected in image', 'error');
        return;
    }
    
    // First line is typically the customer name
    detectedData.customerName = lines[0].trim();
    
    // Process remaining lines to extract products and prices
    // Format: product name on left, price on right
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Try to extract product name and price
        // Prices typically contain numbers with rupee symbol or just numbers
        const priceMatch = line.match(/[\d,]+(?:\.\d{2})?|₹[\d,]+(?:\.\d{2})?/);
        
        if (priceMatch) {
            const price = priceMatch[0].replace(/[₹,]/g, '');
            const productName = line.substring(0, priceMatch.index).trim();
            
            if (productName.length > 0 && !isNaN(parseFloat(price))) {
                detectedData.products.push({
                    name: productName,
                    price: parseFloat(price),
                    quantity: 1
                });
            }
        } else if (line.length > 2 && !line.match(/^\d+\.?\d*$/)) {
            // If no price found but line has text, it might be a product name without price
            // Try to parse as just a product name
            const potentialProduct = line.replace(/\s+/g, ' ');
            
            // Avoid adding very short lines or numbers only
            if (potentialProduct.length > 2 && !potentialProduct.match(/^[\d\s,₹.]+$/)) {
                detectedData.products.push({
                    name: potentialProduct,
                    price: 0,
                    quantity: 1
                });
            }
        }
    }
    
    // Remove duplicates
    detectedData.products = detectedData.products.filter((product, index, self) =>
        index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    );
    
    console.log('Parsed data:', detectedData);
}

// Display detected data preview
function displayDetectedDataPreview() {
    const preview = document.getElementById('detectedDataPreview');
    const customerInput = document.getElementById('detectedCustomerName');
    const productsList = document.getElementById('detectedProductsList');
    
    customerInput.value = detectedData.customerName;
    
    if (detectedData.products.length === 0) {
        productsList.innerHTML = '<p style="color: #999;">No products detected. You can add them manually below.</p>';
    } else {
        productsList.innerHTML = detectedData.products.map((product, index) => `
            <div class="detected-product-item">
                <div class="product-field">
                    <label>Product Name:</label>
                    <input type="text" class="product-name-input" value="${product.name}" data-index="${index}">
                </div>
                <div class="product-field">
                    <label>Price (₹):</label>
                    <input type="number" class="product-price-input" value="${product.price}" min="0" step="0.01" data-index="${index}">
                </div>
                <button type="button" class="btn-icon" onclick="removeDetectedProduct(${index})">Remove</button>
            </div>
        `).join('');
        
        // Add event listeners to update detected data
        document.querySelectorAll('.product-name-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                detectedData.products[index].name = e.target.value;
            });
        });
        
        document.querySelectorAll('.product-price-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                detectedData.products[index].price = parseFloat(e.target.value) || 0;
            });
        });
    }
    
    preview.classList.remove('hidden');
}

// Remove detected product
function removeDetectedProduct(index) {
    detectedData.products.splice(index, 1);
    displayDetectedDataPreview();
}

// Close detected data preview
function closeDetectedDataPreview() {
    document.getElementById('detectedDataPreview').classList.add('hidden');
    detectedData = { customerName: '', products: [] };
}

// Save detected data to database
async function saveDetectedData() {
    try {
        const customerName = document.getElementById('detectedCustomerName').value.trim();
        
        if (!customerName) {
            showNotification('Please enter customer name', 'error');
            return;
        }
        
        if (detectedData.products.length === 0) {
            showNotification('Please add at least one product', 'error');
            return;
        }
        
        let productsAdded = 0;
        let productsDuplicate = 0;
        let customerAdded = false;
        
        // Check if customer exists
        const existingCustomer = await db.getCustomerByPhone(customerName);
        let customerId = null;
        
        if (!existingCustomer) {
            try {
                // Add customer without phone (phone is optional)
                customerId = await db.addCustomer({
                    name: customerName,
                    phone: '' // Phone can be added later
                });
                customerAdded = true;
            } catch (error) {
                console.warn('Customer might already exist or error occurred:', error);
                // Try to get customer by name
                const customerByName = await db.getCustomerByName(customerName);
                if (customerByName) {
                    customerId = customerByName.id;
                } else {
                    showNotification('Error saving customer', 'error');
                    return;
                }
            }
        } else {
            customerId = existingCustomer.id;
        }
        
        // Add products
        for (const product of detectedData.products) {
            try {
                const existingProduct = await db.getProductByName(product.name);
                
                if (!existingProduct) {
                    await db.addProduct({
                        name: product.name,
                        price: product.price || 0,
                        stock: 0, // Will be set after notification
                        fromVision: true
                    });
                    productsAdded++;
                } else {
                    productsDuplicate++;
                }
            } catch (error) {
                console.warn('Error adding product:', error);
                productsDuplicate++;
            }
        }
        
        // Show success notification
        let successMessage = `✅ Saved successfully!\n`;
        if (customerAdded) {
            successMessage += `New customer: ${customerName}\n`;
        }
        successMessage += `Products added: ${productsAdded}`;
        if (productsDuplicate > 0) {
            successMessage += `\nDuplicates skipped: ${productsDuplicate}`;
        }
        
        showNotification(successMessage, 'success');
        
        // Show special notification for newly added products
        if (productsAdded > 0) {
            showNotification('⚠️ Set the stock of your newly registered products!', 'warning');
        }
        
        closeDetectedDataPreview();
        updateProductsList();
        updateCustomersList();
        updateDashboard();
        
    } catch (error) {
        showNotification('Error saving data: ' + error.message, 'error');
        console.error('Save error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for db to be ready
    setTimeout(() => {
        initializeCameraVision();
    }, 500);
});
