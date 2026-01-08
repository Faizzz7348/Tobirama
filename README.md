# Table Grid Demo

React table component with PrimeReact DataTable featuring flexible scrolling, dialog display, image lightbox, drag-and-drop, power toggle controls, and **image upload functionality**.

## Features

### Main Table
- 📊 Interactive DataTable with Route, Shift, Warehouse columns
- ✏️ Editable cells (Edit Mode)
- ➕ Add New Row button (Edit Mode)
- 🗑️ Delete Row per row (Edit Mode)
- 👁️ Show/Edit buttons to open dialog

### Dialog Table (Flex Scroll)
- **No** - Sequential row number
- **Code** - Editable code field with duplicate validation
- **Location** - Editable location name
- **Delivery** - Delivery frequency
- **Action Column**:
  - 🖼️ **Image Thumbnails** - Click to open lightbox gallery with zoom & thumbnails
  - 📤 **Image Upload** - Upload images directly to external hosting (Edit Mode only)
  - ℹ️ **Info Button** - View detailed row information
  - ⚡ **Power Toggle** - ON/OFF switch (Edit Mode only)
  - 🔀 **Draggable Rows** - Reorder by dragging (Edit Mode only)

### Image Upload Features
- 📤 **Image Upload** - Upload images directly to ImgBB hosting service
- �️ **Image Management** - Add, edit, or delete image URLs
- ✅ **Image Display** - View images in lightbox gallery with zoom & thumbnails
- 💾 **Auto-Save** - Images automatically saved to database after upload

### QR Code Features (NEW! 🎉)
- 📱 **QR Code Upload** - Upload QR code images for each location
- 🔗 **Destination URL** - Set URL that QR code points to
- 👁️ **View Mode** - Auto-scan functionality (click to go to destination)
- ✏️ **Edit Mode** - Manage QR code image and destination URL
- 🚀 **Smart Display** - Button only shows when QR code exists (view mode)

### Validation Features
- 🚫 **Duplicate Prevention** - Automatic detection and prevention of duplicate values
  - Real-time validation while editing
  - Visual indicators (red border, warning icon)
  - Toast notification on save attempt
  - Shake animation for invalid input
- ✅ **Unique Code Validation** - Ensures all codes in the table are unique
- 🔒 **Route Name Validation** - Prevents duplicate route names

### Theme & Mode Controls
- 🌙 **Dark/Light Mode** - Toggle theme colors
- ✏️ **Edit Mode** - Enable/disable all editing features
  - When ON: Edit cells, toggle power, drag rows, add/delete, upload images
  - When OFF: View-only mode

## Technologies
- React 18.2.0
- PrimeReact 10.5.1 (DataTable, Dialog, InputSwitch, Image with built-in preview)
- Vite 5.1.0
- Leaflet & React-Leaflet (Map component)
- LightGallery (Image lightbox)
- QR Scanner (QR code scanning)
- Framer Motion (Animations)

## Installation

Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the project root:

```env
# ImgBB API Configuration (Required for image upload)
# Get your API key from: https://api.imgbb.com/
VITE_IMGBB_API_KEY=your_imgbb_api_key_here
```

See [.env.example](.env.example) for reference.

## Database Setup

This application uses Neon PostgreSQL database. Set up your database:

```bash
# Run database setup script
npm run setup-db
```

**Configure database connection:**
Add your database connection string in `.env`:
```env
DATABASE_URL=your_postgres_connection_string
```

See [.env.example](.env.example) for reference.

## Running the Project

Start the Vite development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

## Deployment

### Vercel Deployment (Recommended)

**Quick Deploy:**
```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Deploy
vercel --prod
```

**Environment Variables:**
Add these in Vercel Dashboard:
- `VITE_IMGBB_API_KEY` - Your ImgBB API key
- `DATABASE_URL` - Your Neon PostgreSQL connection string

## Project Structure

```
src/
├── FlexibleScrollDemo.jsx   # Main component with table
├── components/
│   ├── ImageLightbox.jsx    # Image lightbox component
│   ├── AnimatedModal.jsx    # Animated modal component
│   ├── MiniMap.jsx          # Map component (Leaflet)
│   ├── MarkerColorPicker.jsx # Color picker for map markers
│   ├── TableRowModal.jsx    # Row details modal
│   └── EditableDescriptionList.jsx # Editable descriptions
├── service/
│   ├── CustomerService.js   # Data service (Neon PostgreSQL)
│   └── ImageUploadService.js # ImgBB upload service
├── config/
│   └── database.js          # Database configuration
├── hooks/
│   ├── useDeviceDetect.js   # Device detection hook
│   └── usePWAInstall.js     # PWA installation hook
├── main.jsx                 # Entry point
└── index-clean.css         # Global styles
```

## Component Overview

The `FlexibleScrollDemo` component displays a button that opens a dialog containing a scrollable data table with customer information including:
- Name
- Country
- Representative
- Company

## Technologies Used

- React 18
- PrimeReact 10
- Vite 5