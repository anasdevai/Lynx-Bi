# Settings Page Features

## Overview
The Settings page provides a comprehensive interface for configuring AsmBI's behavior, performance, and appearance.

## Page Structure

### 1. MIPS Analytics Engine Section
**Purpose**: Configure the core MIPS assembly computation engine

**Settings:**
- **Enable MIPS Execution**
  - Toggle MIPS assembly processing on/off
  - When disabled, falls back to JavaScript calculations
  - Default: ON

- **Parallel Execution**
  - Run multiple MIPS procedures simultaneously
  - Improves performance for complex queries
  - Default: ON

- **Cache Results**
  - Store computed results in memory
  - Reduces redundant calculations
  - Default: ON

**Visual Design:**
- Gradient: Indigo to Purple
- Icon: CPU Chip
- Neon shadow: Purple

---

### 2. Performance Section
**Purpose**: Optimize rendering and data refresh behavior

**Settings:**
- **Chart Animations**
  - Enable smooth transitions and effects
  - Disable for better performance on slower devices
  - Default: ON

- **Auto Refresh**
  - Automatically update dashboards
  - Configurable interval when enabled
  - Default: OFF

- **Refresh Interval** (when Auto Refresh is ON)
  - Range: 10 seconds to 5 minutes
  - Slider control with visual feedback
  - Default: 30 seconds

**Visual Design:**
- Gradient: Cyan to Indigo
- Icon: Server
- Neon shadow: Cyan

---

### 3. Appearance Section
**Purpose**: Customize visual theme

**Settings:**
- **Theme Selector**
  - Dark: Full dark mode (current)
  - Light: Light mode (future)
  - Auto: System preference (future)
  - Grid layout with 3 buttons

**Visual Design:**
- Gradient: Purple to Pink
- Icon: Paint Brush
- Neon shadow: Pink

---

### 4. About AsmBI Section
**Purpose**: Display system information

**Information Displayed:**
- **Version**: Current AsmBI version (1.0.0)
- **MIPS Engine**: Status indicator (Active/Inactive)
- **Backend**: Connection status (Connected/Disconnected)

**Visual Design:**
- Gradient: Green to Cyan
- Icon: Cube Transparent
- Neon shadow: Green

---

## Interactive Elements

### Toggle Switches
- Smooth spring animation
- Gradient background when active
- Gray background when inactive
- Animated knob slides left/right
- Haptic-like feedback with scale animation

### Range Slider
- Custom styled for dark theme
- Shows current value prominently
- Min/max labels on sides
- Accent color: Indigo

### Save Button
- Gradient neon button
- Success feedback with checkmark
- 2-second confirmation display
- Scale animation on click

---

## Design Consistency

### Glass Morphism
- All cards use `glass-card` class
- Semi-transparent background
- Backdrop blur effect
- Subtle border (white/10)

### 3D Effects
- `card-3d` class for depth
- Hover lift animation (y: -2px)
- Perspective transforms
- Corner accents on hover

### Color Palette
- Background: `dark-400`
- Text Primary: `white`
- Text Secondary: `surface-400`
- Borders: `white/10`
- Hover: `white/[0.07]`

### Typography
- Headings: Bold, white
- Descriptions: Regular, surface-400
- Labels: Medium weight, surface-300

---

## Responsive Design

### Desktop (lg+)
- Max width: 4xl (896px)
- Centered layout
- Full padding: 8

### Tablet (md)
- Adjusted padding: 6
- Maintained card layout

### Mobile (sm)
- Single column
- Reduced padding
- Touch-friendly toggle sizes

---

## Animations

### Background
- Floating cubes (opacity 20%)
- Particle field
- Animated gradient orbs
- Continuous motion loops

### Cards
- Staggered entrance (0.1s delay each)
- Hover lift effect
- Smooth transitions

### Toggles
- Spring physics (stiffness: 500, damping: 30)
- Smooth color transitions
- Knob slide animation

### Conditional Rendering
- Refresh interval slider fades in/out
- Height animation for smooth expansion

---

## Future Enhancements

1. **Settings Persistence**
   - Save to localStorage
   - Sync with backend
   - User profiles

2. **Advanced Options**
   - Memory limits
   - Thread pool size
   - Cache size limits

3. **Notifications**
   - Email alerts
   - Webhook integrations
   - Slack notifications

4. **Export/Import**
   - Export settings as JSON
   - Import from file
   - Share configurations

5. **Themes**
   - Custom color schemes
   - Light mode implementation
   - High contrast mode

---

## Accessibility

- Semantic HTML structure
- ARIA labels on toggles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

---

## Performance

- Minimal re-renders
- Optimized animations (GPU accelerated)
- Lazy loading of sections
- Debounced slider updates

---

*Last Updated: January 20, 2026*
