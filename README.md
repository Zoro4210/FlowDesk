# FlowDesk Website 

The official landing page for **FlowDesk**, the minimalist habit tracker for Android. This website serves as a showcase, interactive demo, and delivery platform for the application's APK.

##  Features

- **Interactive Experience:** A fully functional, web-based mock-up of the FlowDesk widget allows users to try the logging experience before downloading.
- **Dynamic Graphics:**
    - **Particle Engine:** A custom HTML5 Canvas particle system that responds to mouse movements.
    - **3D Showcase:** Interactive 3D tilt effects on the app icon showcase.
    - **Micro-Animations:** Pulsing heatmap cells, typing effects, and confetti bursts for user feedback.
- **Smooth Navigation:** Scroll-reveal animations and glassmorphism-based UI for a premium, modern feel.
- **Direct Delivery:** Integrated APK download section for seamless user onboarding.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewing.

## Technology Stack

- **Core:** Vanilla HTML5, CSS3, and JavaScript (ES6+).
- **Visualization:** HTML5 Canvas API for the particle background.
- **Animations:** 
    - Intersection Observer API for scroll-reveal.
    - CSS Keyframes for glassmorphism glows and pulsing effects.
    - Custom JS-driven typing and counter engines.
- **Assets:** Locally hosted APK and optimized JPEG/PNG assets.

##  Structure

```text
website/
├── assets/             # Images, icons, and the release APK
├── app.js              # Core logic: Particles, Demo, Animations
├── index.html          # Semantic HTML5 structure & SEO tags
└── style.css           # Modern design system (Glassmorphism, Dark mode)
```

## Deployment

The website is built using static files and can be hosted on any web server:

1. **Local Preview:**
   - On Windows: `start index.html` (or use VS Code Live Server).
   - Python: `python -m http.server 8000`.
2. **Production:**
   - Simply upload the contents of the `website/` folder to GitHub Pages, Netlify, Vercel, or any S3-style bucket.

##  Design System

- **Primary Color:** `#00b4d8` (Bright Cyan)
- **Background:** `#050505` (Deep Black)
- **Typography:** 
    - **Inter:** For clean interface text.
    - **Outfit:** For bold, premium headings.
- **Philosophy:** Grayscale-focused with vibrant accents to emphasize interaction points.

---
Built for FlowDesk. Focused on consistency.
