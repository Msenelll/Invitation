Product Requirements Document (PRD) & AI Agent Prompt
This document provides a complete blueprint to recreate a high-performance, single-page interactive digital wedding/engagement invitation with a luxurious neoclassical 3D plaster stucco relief aesthetic from scratch.

Part 1: Product Requirements Document (PRD)
1. Project Overview
Product Name: Pure Plaster - Modern Interactive Digital Invitation
Description: A premium, mobile-first, single-page web invitation showcasing a tactile, three-dimensional Baroque White Plaster Stucco Relief framing. It features smooth micro-animations, a timezone-aware countdown, direct navigation links, and seamless calendar integrations.
Goal: Deliver a breathtaking visual first-impression ("WOW" effect) with high legibility, robust local timezone computations, and near-zero loading times on mobile devices.
2. Technical Stack
Frontend Core: Semantic HTML5 & Vanilla ES6 JavaScript (No bulky frameworks like React/Vue to maintain sub-second page loads).
Styling: Modern CSS3 utilizing Custom CSS Properties (Variables), Flexbox, CSS Grid, and GPU hardware-accelerated keyframe transforms.
Fonts: Google Fonts (Cinzel, Montserrat, Great Vibes) loaded asynchronously.
Media: Optimized WebP/PNG textures under 200KB for high-density mobile screens.
3. Detailed Feature Specifications
3.1. Visual & Aesthetic Architecture
Stucco Plaster Card Frame: The core container is styled as an elevated plaster plaque utilizing a high-definition 3D border-relief texture (plaster_bg.png). Deep padding keeps all content inside the smooth, clean, center passpartout region.
Symmetrical Rotating Wreath: An optimized, ultra-thin inline SVG olive/laurel circular branch rotates slowly (80s-90s per cycle) behind the couple's names. Stems and leaf veins are styled with a brushed gold gradient (yaldız) over alabaster plaster gradients with soft drop-shadow filters.
Passepartout Gold Detail: A thin, dashed golden-foil yaldız border frames the interior content area for a classical neoclassical print look.
Soft Neoclassical Typography: High-contrast dark charcoal-taupe (#5C554E) cursive and serif lettering with subtle dropshadows replicating traditional physical steel-plate letterpress engraving.
3.2. Dynamic Timing Engine (JavaScript)
Timezone-Aware Countdown: Calculates and displays remaining days, hours, minutes, and seconds until the target date (represented in absolute ISO 8601 UTC+3 offset).
Graceful Expiry: When the target date is reached, the countdown safely caps at 00:00:00:00 without throwing console errors or causing layout shifts.
3.3. Add to Calendar Integration
Google Calendar URL Generator: Generates a dynamic link parsing event title, location, description, and absolute UTC start/end times.
Apple & iCal Download: Synthesizes and downloads a raw .ics calendar payload dynamically via a JavaScript blob object:
text

BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Sinem & Mehmet Nişan Töreni
...
END:VEVENT
END:VCALENDAR
3.4. Navigation & Maps Deep Linking
Maps Button: A neomorphic soft cream button featuring brushed gold outlines and a location pin emoji (📍). Triggers a direct mobile deep link to Google Maps (e.g. to the Helen Garden Eskişehir coordinates).
4. Performance & Responsive Constraints
GPU hardware-acceleration: Any rotation must bind to will-change: transform and use CSS transform: rotate() to run on the GPU, avoiding paint/layout thrashing.
Fluid Scales: Utilize CSS clamp() and vw units for all typography to ensure layout fits inside the plaster borders on screens from 320px up to 1440px width.
Part 2: AI Agent Prompt (System Instructions)
You can copy and paste the system prompt below into any advanced LLM/coding agent to build this exact project from scratch:

text

You are a senior frontend developer specializing in high-end, luxury micro-sites. Your task is to build a premium, mobile-first, single-page interactive digital invitation website from scratch.
### 1. Aesthetic Guidelines (Baroque White Plaster & Gold Yaldız)
- Tone: Extremely elegant, soft, spacious, and neoclassical. Avoid modern flat minimalism; utilize tactile neomorphism.
- Colors:
  - Base backdrop: Soft warm alabaster (#F4F3ED)
  - Card body: Off-white plaster plaque (#FAF9F6)
  - Typography: Soft charcoal-taupe (#5C554E) for primary readability, muted gray-brown (#8F877F) for details.
  - Accent: Brushed gold yaldız foil (#C5A059) used strictly for fine hairline highlights.
- Typography: Replicate steel-plate letterpress engraving with subtle white/gold shadows. Use 'Cinzel' (serif) for wide headers, 'Montserrat' (sans) for details, and 'Great Vibes' (cursive) for calligraphic flows.
### 2. Markup Architecture (index.html)
- Clean, semantic HTML5 structure wrapped inside an `.app-container` and `.invitation-card`.
- Center ornament: Recreate a high-fidelity inline SVG circular olive/laurel wreath. Path stems must be ultra-thin (stroke-width: 0.85px) with tiny, cream-plaster leaves spaced evenly.
- Static Names Overlay: Absolute dead-center names (Sinem & Mehmet) wrapped inside a single, SEO-friendly H1 tag.
- welcoming text: "Nişanımıza Davetlisiniz..." in calligraphy style.
- Date container: Simple cursive lines displaying "21 Haziran 2026" and "Pazar 15.00".
- Venue block: Elegant right-aligned cursive block for "Helen Garden" and its full Eskişehir address positioned in the bottom-right quadrant.
- Interactive controls: Map navigation button and two calendar action buttons.
### 3. Stylesheet Specifications (style.css)
- Implement modern CSS Custom Properties for all design tokens.
- Apply card background-image using "img/plaster_bg.png". Ensure deep padding (85px 45px) to inset all content cleanly inside the smooth center passpartout area.
- Add an inner dashed gold passepartout line using absolute positioned pseudo-elements (::after).
- Animate the circular SVG branch to rotate extremely slowly (80s duration) on the GPU using CSS keyframes, transform: rotate(), and will-change: transform.
- Style maps/calendar buttons with soft cream backgrounds, hairline gold frames, and soft shadow raises on hover.
- Make the countdown units completely borderless and flat, letting numbers float elegantly.
- Use fluid typography (clamp()) to prevent any visual text overflow or clipping on small devices (320px–360px).
### 4. Dynamic Scripting (main.js)
- Maintain absolute vanilla JS with no external frameworks or libraries.
- Set target time: "2026-06-21T15:00:00+03:00" (Turkey Time, UTC+3).
- Implement a timezone-aware local countdown parsing remaining days, hours, minutes, and seconds. Handle target expiration gracefully.
- Recreate Google Calendar dynamic link mapping.
- Recreate Apple/iCal dynamic .ics calendar blob download generator using vanilla JavaScript File API.
Produce clean, beautifully commented, and fully production-ready code blocks. Ensure zero console errors, zero layout shifts, and pixel-perfect design alignment.