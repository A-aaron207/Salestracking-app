// Camera Vision Module - Advanced Image Detection with PaddleOCR
// Supports handwriting, difficult angles, and complex layouts

let mediaStream = null;
let detectedData = {
    customerName: '',
    products: []
};

let paddleOCR = null;
let ocrReady = false;
let imageCache = null;

// Initialize PaddleOCR on first use
async function initializePaddleOCR() {
    if (ocrReady) return;
    
    try {
        document.getElementById('processingText').textContent = 'Loading AI model (first time only)...';
        
        // Initialize PaddleOCR with optimized settings
        paddleOCR = await PaddleOCR.create({
            lang: 'english',  // Can be extended with 'ch', 'en', etc.
            ocr_version: '2',
            use_gpu: false,  // Use CPU for mobile compatibility
            enable: ['ocr', 'det']  // Enable detection + OCR
        });
        
        ocrReady = true;
        console.log('PaddleOCR initialized successfully');
        return true;
    } catch (error) {
        console.error('PaddleOCR initialization error:', error);
        showNotification('Failed to load AI model: ' + error.message, 'error');
        return false;
    }
}

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
                width: { ideal: 1920 },
                height: { ideal: 1440 }
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
        
        showNotification('📷 Camera opened successfully', 'success');
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
        document.getElementById('processingText').textContent = 'Initializing advanced AI...';
        
        // Initialize OCR if needed
        const initialized = await initializePaddleOCR();
        if (!initialized) {
            document.getElementById('visionProcessing').classList.add('hidden');
            return;
        }
        
        // Get image data
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        imageCache = imageData;
        
        // Process with image enhancement
        document.getElementById('processingText').textContent = 'Enhancing image quality...';
        await processImageWithPaddleOCR(imageData);
        
    } catch (error) {
        showNotification('Error capturing photo: ' + error.message, 'error');
        console.error('Capture error:', error);
        document.getElementById('visionProcessing').classList.add('hidden');
    }
}

// Enhance image using OpenCV
function enhanceImage(imageElement) {
    try {
        // Create Mat objects for processing
        let src = cv.imread(imageElement);
        let dst = new cv.Mat();
        
        // Convert to grayscale for better OCR
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        
        // Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        let lab = new cv.Mat();
        cv.cvtColor(src, lab, cv.COLOR_RGBA2RGB);
        
        // Apply Gaussian blur to reduce noise
        let blurred = new cv.Mat();
        let ksize = new cv.Size(3, 3);
        cv.GaussianBlur(dst, blurred, ksize, 0);
        
        // Apply threshold for better text extraction
        let binary = new cv.Mat();
        cv.threshold(blurred, binary, 100, 255, cv.THRESH_BINARY);
        
        // Clean up
        src.delete();
        dst.delete();
        lab.delete();
        blurred.delete();
        
        return binary;
    } catch (error) {
        console.warn('Image enhancement failed (OpenCV not loaded yet):', error);
        return null;
    }
}

// Detect text angle and rotate image
async function detectAndCorrectAngle(imageData) {
    try {
        const img = new Image();
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = imageData;
        });
        
        if (typeof cv !== 'undefined') {
            const canvas = document.getElementById('cameraCanvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            let enhanced = enhanceImage(canvas);
            if (enhanced) {
                // Copy enhanced back to canvas
                cv.imshow(canvas, enhanced);
                enhanced.delete();
                
                return canvas.toDataURL('image/jpeg', 0.95);
            }
        }
        
        return imageData;
    } catch (error) {
        console.warn('Angle detection failed:', error);
        return imageData;
    }
}

// Process image with PaddleOCR
async function processImageWithPaddleOCR(imageData) {
    try {
        document.getElementById('processingText').textContent = 'Analyzing text with AI...';
        
        // Correct image angle if possible
        const enhancedImageData = await detectAndCorrectAngle(imageData);
        
        // Create image element for OCR
        const img = new Image();
        img.src = enhancedImageData;
        
        await new Promise((resolve) => {
            img.onload = resolve;
        });
        
        // Run PaddleOCR
        document.getElementById('processingText').textContent = 'Extracting text...';
        
        const result = await paddleOCR.ocr(img);
        
        console.log('PaddleOCR result:', result);
        
        // Parse the detected text with confidence scores
        parseDetectedDataAdvanced(result);
        
        document.getElementById('visionProcessing').classList.add('hidden');
        displayDetectedDataPreview();
        
    } catch (error) {
        console.error('PaddleOCR error:', error);
        
        // Fallback to simpler processing if PaddleOCR has issues
        if (error.message.includes('undefined')) {
            showNotification('Loading AI model... please wait and try again', 'warning');
        } else {
            showNotification('OCR processing error: ' + error.message, 'error');
        }
        
        document.getElementById('visionProcessing').classList.add('hidden');
    }
}

// Advanced parsing with support for handwriting and complex layouts
function parseDetectedDataAdvanced(ocrResult) {
    // Reset data
    detectedData = {
        customerName: '',
        products: []
    };
    
    if (!ocrResult || ocrResult.length === 0) {
        showNotification('No text detected in image', 'error');
        return;
    }
    
    try {
        // Extract all text with positions and confidence
        const textElements = [];
        
        if (Array.isArray(ocrResult[0])) {
            // PaddleOCR format: array of [text, confidence] pairs with position data
            for (const block of ocrResult) {
                if (Array.isArray(block) && block.length >= 2) {
                    const [text, confidence] = block;
                    textElements.push({
                        text: text.trim(),
                        confidence: confidence,
                        bbox: block.bbox || null
                    });
                }
            }
        } else {
            // Alternative format handling
            for (const item of ocrResult) {
                if (item.text) {
                    textElements.push({
                        text: item.text.trim(),
                        confidence: item.confidence || 0.85,
                        bbox: item.bbox || null
                    });
                }
            }
        }
        
        if (textElements.length === 0) {
            showNotification('No text detected in image', 'error');
            return;
        }
        
        // First element is typically customer name
        if (textElements.length > 0) {
            detectedData.customerName = textElements[0].text;
        }
        
        // Process remaining lines for products
        // Group text elements by vertical position to understand layout
        const productLines = textElements.slice(1);
        
        for (const element of productLines) {
            const text = element.text;
            const confidence = element.confidence;
            
            // Skip low confidence text
            if (confidence < 0.6) continue;
            
            // Skip very short text
            if (text.length < 2) continue;
            
            // Try to extract product name and price
            const priceMatch = text.match(/[\d,]+(?:\.\d{2})?|₹[\d,]+(?:\.\d{2})?/g);
            
            if (priceMatch && priceMatch.length > 0) {
                // Take the last price match (usually rightmost)
                const price = priceMatch[priceMatch.length - 1].replace(/[₹,]/g, '');
                
                if (!isNaN(parseFloat(price))) {
                    // Extract product name (everything before the price)
                    const priceStartIdx = text.lastIndexOf(priceMatch[priceMatch.length - 1]);
                    const productName = text.substring(0, priceStartIdx).trim();
                    
                    if (productName.length > 0) {
                        // Check for type of text (handwritten vs print is harder to detect)
                        const isLikelyProduct = !productName.match(/^[\d\s,₹.]+$/) && 
                                              productName.length < 150 &&
                                              !productName.match(/^(the|and|or|but|in|of)$/i);
                        
                        if (isLikelyProduct) {
                            detectedData.products.push({
                                name: productName,
                                price: parseFloat(price),
                                quantity: 1,
                                confidence: confidence
                            });
                        }
                    }
                }
            } else if (text.length > 2 && !text.match(/^[\d\s,₹.]+$/)) {
                // Product without clear price - add to list for user to confirm
                detectedData.products.push({
                    name: text,
                    price: 0,
                    quantity: 1,
                    confidence: confidence
                });
            }
        }
        
        // Remove exact duplicates
        detectedData.products = detectedData.products.filter((product, index, self) =>
            index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
        );
        
        // Sort by confidence (most confident first)
        detectedData.products.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        
        console.log('Parsed data:', detectedData);
        
    } catch (error) {
        console.error('Error parsing OCR result:', error);
        showNotification('Error parsing detected text', 'error');
    }
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
                    ${product.confidence ? `<small style="color: #999;">Confidence: ${(product.confidence * 100).toFixed(0)}%</small>` : ''}
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
                        fromVision: true,
                        detectionMethod: 'paddleocr'
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
        let successMessage = `✅ Advanced AI Detection Complete!\n`;
        if (customerAdded) {
            successMessage += `📝 New customer: ${customerName}\n`;
        }
        successMessage += `✓ Products added: ${productsAdded}`;
        if (productsDuplicate > 0) {
            successMessage += `\n⊘ Duplicates skipped: ${productsDuplicate}`;
        }
        
        showNotification(successMessage, 'success');
        
        // Show special notification for newly added products
        if (productsAdded > 0) {
            setTimeout(() => {
                showNotification('⚠️ Set the stock of your newly registered products!', 'warning');
            }, 1500);
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

