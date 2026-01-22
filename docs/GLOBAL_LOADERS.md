# Global 3D Loaders System

## Overview

AsmBI features a comprehensive global loading system with three unique 3D loader variants designed specifically for the MIPS-powered analytics platform. The system provides both global full-screen loaders and local component loaders.

## Loader Variants

### 1. MIPS Loader (`variant="mips"`)
**Best for:** MIPS engine operations, data processing, system operations

**Features:**
- Rotating hexagonal frame with 3D depth
- Animated MIPS chip core with gradient
- Radiating data streams
- Orbiting particles
- Pulsing glow effects

**Use cases:**
- MIPS assembly execution
- Backend processing
- System initialization

### 2. Data Loader (`variant="data"`)
**Best for:** Data uploads, file processing, dataset operations

**Features:**
- Animated 3D bar chart
- Dynamic height animations
- Rotating perspective
- Pulsing base effects
- Central glow

**Use cases:**
- File uploads
- Data parsing
- Dataset analysis

### 3. Analytics Loader (`variant="analytics"`)
**Best for:** Analytics calculations, report generation, dashboard updates

**Features:**
- Three rotating rings with 3D transforms
- Pulsing gradient center
- Orbiting data points
- Multi-axis rotation
- Smooth animations

**Use cases:**
- Running analytics
- Generating reports
- Dashboard calculations

## Usage

### Global Full-Screen Loader

Use the `useLoading` hook for full-screen loading overlays:

```tsx
import { useLoading } from '@/components';

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleUpload = async () => {
    // Show loader
    showLoading('Uploading file...', 'data');
    
    try {
      await uploadFile();
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  return <button onClick={handleUpload}>Upload</button>;
}
```

### Local Component Loader

Use the `GlobalLoader` component for inline loading states:

```tsx
import { GlobalLoader } from '@/components';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <GlobalLoader 
          variant="analytics" 
          size="md" 
          text="Calculating..." 
        />
      </div>
    );
  }

  return <div>Content</div>;
}
```

## API Reference

### `useLoading()` Hook

Returns an object with:

- `showLoading(text?: string, variant?: 'mips' | 'data' | 'analytics')` - Shows the global loader
- `hideLoading()` - Hides the global loader
- `isLoading: boolean` - Current loading state

### `GlobalLoader` Component

Props:

- `variant?: 'mips' | 'data' | 'analytics'` - Loader style (default: 'mips')
- `size?: 'sm' | 'md' | 'lg'` - Loader size (default: 'md')
- `text?: string` - Loading text (default: 'Loading...')

Size dimensions:
- `sm`: 24x24 (96px)
- `md`: 32x32 (128px)
- `lg`: 48x48 (192px)

## Integration

The global loading system is automatically integrated into the app through the `LoadingProvider` in `providers.tsx`. No additional setup is required.

## Demo Page

Visit `/loader-demo` to see all loader variants in action with interactive controls.

## Best Practices

1. **Choose the right variant:**
   - Use `mips` for backend/system operations
   - Use `data` for file/dataset operations
   - Use `analytics` for calculations/reports

2. **Provide meaningful text:**
   - Be specific: "Uploading sales_data.csv..." instead of "Loading..."
   - Keep it concise and action-oriented

3. **Always hide loaders:**
   - Use try/finally blocks to ensure loaders are hidden
   - Set timeouts for operations that might hang

4. **Use local loaders for small areas:**
   - Use `GlobalLoader` component for cards or sections
   - Use `useLoading` hook for full-screen operations

## Examples

### File Upload
```tsx
showLoading('Uploading and analyzing file...', 'data');
```

### MIPS Execution
```tsx
showLoading('Executing MIPS assembly...', 'mips');
```

### Analytics Calculation
```tsx
showLoading('Calculating advanced metrics...', 'analytics');
```

### Dashboard Update
```tsx
showLoading('Refreshing dashboard...', 'analytics');
```

## Technical Details

- Built with Framer Motion for smooth animations
- Uses CSS 3D transforms with `perspective` and `preserve-3d`
- Fully responsive and accessible
- Optimized performance with GPU acceleration
- Dark theme compatible with glass morphism design
