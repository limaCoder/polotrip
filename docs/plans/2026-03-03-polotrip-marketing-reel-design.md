# Polotrip Marketing Reel Design (9:16) - Approach 1 (Mascot-first)

## Objective
Create a high-energy 9:16 Remotion animation for Reels/TikTok featuring a traveling bear mascot, using real branding/assets from `apps/web/public`, to support Polotrip marketing.

## Creative Direction
- Style: Energetic / fun
- Duration: ~15s at 30fps
- Structure:
  1. Hook (0-2s): bear entrance + strong headline
  2. Feature burst (2-8s): product visuals + rapid transitions
  3. Value stack (8-12s): concise benefit cards
  4. CTA (12-15s): logo + final call to action

## Asset Strategy
Use and repurpose core assets from `apps/web/public`:
- `brand/logo.svg`
- `brand/polotrip-icon.png`
- `pages/dashboard/cancun.jpg`
- `pages/dashboard/paris.jpg`
- `pages/dashboard/tailandia.jpg`
- `pages/album/album-cover.jpg`

Assets are mirrored into the Remotion project's `public/polotrip-assets` for `staticFile()` compliance.

## Technical Approach
- Dedicated Remotion project at `apps/marketing-remotion`
- Composition `PolotripReel` with:
  - 1080x1920, 30fps, 450 frames
  - `TransitionSeries` scene cuts
  - Frame-driven motion via `useCurrentFrame()` + `interpolate()` + `spring()`
- Custom SVG mascot: `TravellerBear` (vector-generated)
- Final render command outputs MP4 to `apps/marketing-remotion/out`

## Success Criteria
- Uses project assets from `apps/web/public`
- Includes animated traveler bear as primary visual element
- Produces a polished 9:16 MP4 suitable for social marketing
