# Mascot Assets

This directory contains the mascot character images for the Nutrio app.

## Required Images

Please save your peeking blob character images as:

### 1. Right-Peeking Mascot (Scrolling Down)
- **Filename**: `peeking-blob-right.png`
- **Format**: PNG with transparent background
- **Recommended size**: 512x512px or similar (will be displayed at ~180x180px)
- **Content**: The blob character peeking from the RIGHT side (your second image)

### 2. Left-Peeking Mascot (Scrolling Up)
- **Filename**: `peeking-blob-left.png`
- **Format**: PNG with transparent background
- **Recommended size**: 512x512px or similar (will be displayed at ~180x180px)
- **Content**: The blob character peeking from the LEFT side (your first image)

**Note:** You don't need to crop the images! The transparent background will be respected automatically.

## Current Usage

- **Paywall Page**: The peeking mascot appears ONLY while actively scrolling
  - **Scroll DOWN** → Right-peeking mascot appears on the RIGHT side
  - **Scroll UP** → Left-peeking mascot appears on the LEFT side
  - **Stop scrolling** → Mascot hides after 150ms
  - **Random positioning**: Appears in 3 different vertical spots (top, middle, bottom)
  - Animation: Slides in/out with spring animation
  - Hover: Peeks more and scales up
  - Includes subtle floating/bobbing animation
  - Green glow effect matches app theme

## Behavior Details

- Direction detection: Tracks scroll direction in real-time
- Position randomization: 20% chance to change vertical position on each scroll
- Vertical zones:
  - **Top**: 64px from top of screen
  - **Middle**: Center of screen
  - **Bottom**: 32px from bottom of screen

## Future Mascot Variations

You can add more character states here:
- `idle.png` - Default neutral/happy look
- `celebrating.png` - Arms up, excited
- `encouraging.png` - Supportive pose
- `thinking.png` - Contemplative
- `excited.png` - Extra happy
- `sleeping.png` - Tired/resting
- `waving.png` - Greeting gesture
