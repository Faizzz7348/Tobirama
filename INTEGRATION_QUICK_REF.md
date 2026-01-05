# 🔗 INTEGRATION - QUICK REFERENCE

**Mau integrate image upload? Pilih path Anda:**

---

## 🏃 PATH 1: Paling Cepat (5 menit)

### Untuk yang mau langsung copy-paste:

**Baca:** [COPY_PASTE_CODE.md](./COPY_PASTE_CODE.md) - CODE 1

**Kurang lebih:**
```jsx
import useImageUpload from '../hooks/useImageUpload';

const { uploadImage, isLoading, progress } = useImageUpload();
const result = await uploadImage(file, locationId);
```

**Done!** ✅

---

## 🎯 PATH 2: Praktis (15 menit)

### Untuk yang mau siap-pakai component:

**Baca:** [COPY_PASTE_CODE.md](./COPY_PASTE_CODE.md) - CODE 4

**Copy-paste 1 component** → Use anywhere

```jsx
<ImageUploadSection locationId={123} />
```

**Done!** ✅

---

## 🏢 PATH 3: Comprehensive (30 menit)

### Untuk yang mau integrate ke existing component:

**Baca:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

**Pilih lokasi:**
- Modal: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - CONTOH 1
- Table: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - CONTOH 2
- Custom: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - CONTOH 3

**Follow step-by-step**

**Done!** ✅

---

## 📚 PILIHAN BERDASARKAN KEBUTUHAN

| Kebutuhan | Path | Time | Complexity |
|-----------|------|------|-----------|
| Mau langsung pakai | PATH 1 | 5 min | Easy |
| Perlu component siap | PATH 2 | 15 min | Medium |
| Integrate ke existing | PATH 3 | 30 min | Medium |
| Understand semua | [Docs folder](./docs) | 1 hour | High |

---

## 🎬 QUICK START (Pick 1)

### OPTION A: Super Simple
```jsx
// File: MyComponent.jsx
import useImageUpload from '../hooks/useImageUpload';

function MyComponent() {
    const { uploadImage } = useImageUpload();
    
    const handleUpload = async (file) => {
        const result = await uploadImage(file, 123); // 123 = locationId
        if (result.success) alert('Done: ' + result.url);
    };
    
    return (
        <input type="file" onChange={e => handleUpload(e.target.files[0])} />
    );
}
```

### OPTION B: With Display
```jsx
// File: MyComponent.jsx
import useImageUpload from '../hooks/useImageUpload';
import { ImageLightbox } from './ImageLightbox';

function MyComponent() {
    const [images, setImages] = useState([]);
    const { uploadImage } = useImageUpload();
    
    const handleUpload = async (file) => {
        const result = await uploadImage(file, 123);
        if (result.success) setImages([...images, result.url]);
    };
    
    return (
        <>
            <input type="file" onChange={e => handleUpload(e.target.files[0])} />
            <ImageLightbox images={images} rowId={123} />
        </>
    );
}
```

### OPTION C: Pre-built Component
```jsx
// File: MyComponent.jsx
import ImageUploadSection from '../components/ImageUploadSection';

function MyComponent() {
    return <ImageUploadSection locationId={123} />;
}
```

---

## 📋 CHECKLIST

- [ ] Pick your path (1, 2, or 3)
- [ ] Read the corresponding guide
- [ ] Copy the code (or follow steps)
- [ ] Test upload
- [ ] Test display
- [ ] Test remove

---

## 🆘 STUCK?

### "I don't know which path to choose"
→ Start with PATH 1 (5 min, copy 5 lines of code)

### "I want to understand first"
→ Read [docs/QUICK_START_IMAGE_UPLOAD.md](./docs/QUICK_START_IMAGE_UPLOAD.md)

### "I want working code now"
→ Copy from [COPY_PASTE_CODE.md](./COPY_PASTE_CODE.md) - CODE 4

### "I want to integrate to existing component"
→ Follow [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

## 🎯 FILES TO READ (By Path)

**PATH 1:** [COPY_PASTE_CODE.md](./COPY_PASTE_CODE.md#code-1-hook-usage-simplest)

**PATH 2:** [COPY_PASTE_CODE.md](./COPY_PASTE_CODE.md#code-4-full-featured-component-copy-paste-ready)

**PATH 3:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

**Just pick one and start coding! 🚀**
