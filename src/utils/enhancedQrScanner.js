/**
 * Enhanced QR Code Scanner with Image Preprocessing
 * Improves QR code detection for difficult images with poor lighting or low quality
 */

import QrScanner from 'qr-scanner';
import jsQR from 'jsqr';

/**
 * Preprocess image to improve QR code detection
 * @param {HTMLImageElement} img - Image element
 * @returns {ImageData[]} Array of preprocessed ImageData with different filters
 */
function preprocessImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const variations = [originalImageData];
    
    // 1. High Contrast
    const highContrast = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < originalImageData.data.length; i += 4) {
        const avg = (originalImageData.data[i] + originalImageData.data[i + 1] + originalImageData.data[i + 2]) / 3;
        const factor = 1.5;
        for (let j = 0; j < 3; j++) {
            highContrast.data[i + j] = Math.min(255, Math.max(0, (originalImageData.data[i + j] - 128) * factor + 128));
        }
        highContrast.data[i + 3] = 255;
    }
    variations.push(highContrast);
    
    // 2. Brightness Enhanced
    const brightened = ctx.createImageData(canvas.width, canvas.height);
    const brightnessAdjust = 50;
    for (let i = 0; i < originalImageData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            brightened.data[i + j] = Math.min(255, originalImageData.data[i + j] + brightnessAdjust);
        }
        brightened.data[i + 3] = 255;
    }
    variations.push(brightened);
    
    // 3. Grayscale with Threshold (Black & White)
    const threshold = ctx.createImageData(canvas.width, canvas.height);
    const thresholdValue = 128;
    for (let i = 0; i < originalImageData.data.length; i += 4) {
        const avg = (originalImageData.data[i] + originalImageData.data[i + 1] + originalImageData.data[i + 2]) / 3;
        const val = avg > thresholdValue ? 255 : 0;
        threshold.data[i] = threshold.data[i + 1] = threshold.data[i + 2] = val;
        threshold.data[i + 3] = 255;
    }
    variations.push(threshold);
    
    // 4. Inverted Colors (for white QR on black background)
    const inverted = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < originalImageData.data.length; i += 4) {
        inverted.data[i] = 255 - originalImageData.data[i];
        inverted.data[i + 1] = 255 - originalImageData.data[i + 1];
        inverted.data[i + 2] = 255 - originalImageData.data[i + 2];
        inverted.data[i + 3] = 255;
    }
    variations.push(inverted);
    
    // 5. Sharpened
    const sharpened = sharpenImage(originalImageData, canvas.width, canvas.height);
    variations.push(sharpened);
    
    // 6. Adaptive Threshold
    const adaptive = adaptiveThreshold(originalImageData, canvas.width, canvas.height);
    variations.push(adaptive);
    
    return variations;
}

/**
 * Apply sharpening filter to image
 */
function sharpenImage(imageData, width, height) {
    const result = new ImageData(width, height);
    const data = imageData.data;
    const out = result.data;
    
    // Sharpening kernel
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                        const kernelIdx = (ky + 1) * 3 + (kx + 1);
                        sum += data[idx] * kernel[kernelIdx];
                    }
                }
                const outIdx = (y * width + x) * 4 + c;
                out[outIdx] = Math.min(255, Math.max(0, sum));
            }
            out[(y * width + x) * 4 + 3] = 255;
        }
    }
    
    return result;
}

/**
 * Apply adaptive threshold to image
 */
function adaptiveThreshold(imageData, width, height) {
    const result = new ImageData(width, height);
    const data = imageData.data;
    const out = result.data;
    const windowSize = 15;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            
            // Calculate local average
            let sum = 0;
            let count = 0;
            for (let wy = Math.max(0, y - windowSize); wy < Math.min(height, y + windowSize); wy++) {
                for (let wx = Math.max(0, x - windowSize); wx < Math.min(width, x + windowSize); wx++) {
                    const widx = (wy * width + wx) * 4;
                    sum += (data[widx] + data[widx + 1] + data[widx + 2]) / 3;
                    count++;
                }
            }
            const localAvg = sum / count;
            
            const val = gray > localAvg - 10 ? 255 : 0;
            out[idx] = out[idx + 1] = out[idx + 2] = val;
            out[idx + 3] = 255;
        }
    }
    
    return result;
}

/**
 * Load image from URL or Blob
 * @param {string|Blob} source - Image source
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(source) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => resolve(img);
        img.onerror = reject;
        
        if (source instanceof Blob) {
            img.src = URL.createObjectURL(source);
        } else {
            img.src = source;
        }
    });
}

/**
 * Try scanning with jsQR library
 * @param {ImageData} imageData - Image data to scan
 * @returns {string|null} Decoded QR code data or null
 */
function tryJsQR(imageData) {
    try {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });
        return code ? code.data : null;
    } catch (error) {
        console.warn('jsQR scanning failed:', error);
        return null;
    }
}

/**
 * Enhanced QR code scanner with preprocessing and multiple libraries
 * @param {string|Blob} imageSource - Image URL or Blob
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} Decoded QR code data
 */
export async function enhancedQrScan(imageSource, onProgress = null) {
    console.log('🔍 Starting enhanced QR code scan...');
    
    let img;
    let blob = imageSource;
    
    try {
        // Step 1: Handle CORS for remote images
        if (onProgress) onProgress({ step: 1, total: 4, message: 'Loading image...' });
        
        if (typeof imageSource === 'string' && imageSource.startsWith('http')) {
            try {
                const response = await fetch(imageSource);
                if (response.ok) {
                    blob = await response.blob();
                    console.log('✅ Image fetched successfully');
                }
            } catch (e) {
                console.warn('Could not fetch remote image, trying direct scan:', e);
                blob = imageSource;
            }
        }
        
        // Step 2: Try with original qr-scanner library first (fastest)
        if (onProgress) onProgress({ step: 2, total: 4, message: 'Trying quick scan...' });
        
        try {
            const result = await QrScanner.scanImage(blob, { 
                returnDetailedScanResult: true,
                alsoTryWithoutScanRegion: true,
            });
            console.log('✅ QR code detected with qr-scanner (original):', result.data);
            return result.data;
        } catch (error) {
            console.log('⚠️ qr-scanner failed, trying with preprocessing...');
        }
        
        // Step 3: Load and preprocess image
        if (onProgress) onProgress({ step: 3, total: 4, message: 'Preprocessing image...' });
        
        img = await loadImage(blob);
        const imageVariations = preprocessImage(img);
        console.log(`✅ Created ${imageVariations.length} image variations`);
        
        // Step 4: Try jsQR with all variations
        if (onProgress) onProgress({ step: 4, total: 4, message: 'Scanning with enhanced detection...' });
        
        for (let i = 0; i < imageVariations.length; i++) {
            const variation = imageVariations[i];
            
            // Try jsQR
            const jsQrResult = tryJsQR(variation);
            if (jsQrResult) {
                console.log(`✅ QR code detected with jsQR (variation ${i + 1}):`, jsQrResult);
                return jsQrResult;
            }
            
            // Try qr-scanner with preprocessed image
            try {
                const canvas = document.createElement('canvas');
                canvas.width = variation.width;
                canvas.height = variation.height;
                const ctx = canvas.getContext('2d');
                ctx.putImageData(variation, 0, 0);
                
                const blob = await new Promise(resolve => canvas.toBlob(resolve));
                const result = await QrScanner.scanImage(blob, { 
                    returnDetailedScanResult: true,
                    alsoTryWithoutScanRegion: true,
                });
                console.log(`✅ QR code detected with qr-scanner (variation ${i + 1}):`, result.data);
                return result.data;
            } catch (error) {
                // Continue to next variation
            }
        }
        
        throw new Error('Could not detect QR code in image after trying all enhancement methods');
        
    } catch (error) {
        console.error('❌ Enhanced QR scan failed:', error);
        throw error;
    } finally {
        // Cleanup blob URL if created
        if (img && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    }
}

/**
 * Scan QR code with visual progress updates
 * @param {string|Blob} imageSource - Image source
 * @param {Object} callbacks - Callbacks for progress and result
 * @returns {Promise<string>} Decoded QR code data
 */
export async function scanQrCodeWithProgress(imageSource, callbacks = {}) {
    const { onProgress, onSuccess, onError } = callbacks;
    
    try {
        const result = await enhancedQrScan(imageSource, onProgress);
        if (onSuccess) onSuccess(result);
        return result;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
}

export default enhancedQrScan;
