# Sol's Musical Adventure - Complete Development Prompt

## Project Overview
Build a side-scrolling music game in React where a black dog named Sol runs through 11 themed zones, each with its own song, visual style, and obstacles. The player clicks/taps to make Sol jump over obstacles. The game progresses through increasingly chill vibes, ending with a romantic finale and personal message.

---

## Technical Requirements

### Core Technologies
- **React** (functional components with hooks)
- **HTML5 Canvas** or **CSS animations** for the game
- **Audio API** for seamless music transitions between zones
- **Responsive design** - works on desktop and mobile (landscape orientation optimized)
- **Screen Orientation Lock** - Encourage/force landscape mode on mobile devices

### Game Mechanics
1. **Auto-scrolling**: Sol continuously moves from left to right
2. **Jump Control**: Single click/tap makes Sol jump (simple arc physics)
3. **Collision Detection**: Hitting obstacles = game over with option to restart from current zone
4. **Zone Progression**: Completing a zone automatically transitions to the next
5. **Music Sync**: Each zone plays its unique song, fading smoothly between zones
6. **Score System**: Track successful jumps and zones completed

### File Structure
```
/src
  /components
    - Game.jsx (main game container)
    - SolCharacter.jsx (animated dog sprite)
    - Zone.jsx (zone renderer with obstacles)
    - ObstacleSprite.jsx (individual obstacles)
    - UI.jsx (score, zone name, controls)
    - FinalMessage.jsx (ending screen)
  /zones
    - zoneConfig.js (all zone data)
  /assets
    /audio (11 mp3 files)
    /sprites (if using images)
  /utils
    - physics.js (jump mechanics)
    - collision.js (hit detection)
```

---

## Sol Character Design

### Visual Description
- **Black dog** silhouette (similar to the previous SVG design)
- **Running animation**: 4-frame cycle (legs moving)
- **Jump animation**: Arc with slight rotation
- **Size**: Approximately 80x80px
- **Position**: Fixed horizontally at 20% from left screen, moves vertically when jumping

### Animations
- **Idle/Running**: Tail wagging, legs alternating (continuous loop)
- **Jump**: Ears flop up, slight body stretch, tail extends
- **Landing**: Small squish effect
- **Hit**: Brief red flash + shake before game over

---

## Zone-by-Zone Specifications

### Zone 1: Boys Band 🎤
**Song File**: `קוראים לו שטוקה טוקה boys band.mp3`
**Duration**: Maximum 35 seconds (hard limit for all zones - see note below)
**Theme**: 90s/2000s boy band pop, synchronized dance energy

**⚠️ CRITICAL: 35-SECOND ZONE LIMIT**
Each zone MUST complete within 35 seconds maximum, regardless of song length. This ensures the player experiences all 11 songs in a reasonable timeframe (~6.5 minutes total). Implementation:
- Calculate required scroll speed: `zoneLength / 35 seconds`
- Fade out song at 32 seconds if still playing
- Transition to next zone at 35 seconds maximum
- If song is shorter than 35s, zone can complete earlier

**Visual Style**:
- **Background**: Stage with colored spotlights (rotating)
- **Ground**: Black stage floor with white light strips
- **Color Palette**: Neon colors, disco ball reflections
- **Animated Elements**:
  - Disco ball spinning in background
  - Spotlights sweeping across
  - Silhouette crowd in background jumping

**Obstacles**:
1. **Microphone Stand** (tall, silver)
2. **Dance Step Marker** (floor arrow, glowing)
3. **Fan Poster** ("WE ♥ SOL" with hearts)
4. **Backup Dancer Silhouette** (black figure, frozen in pose)
5. **Boom Box** (retro style, with antenna)

**Speed**: Fast (matches upbeat tempo)
**Obstacle Frequency**: Every 2.5 seconds (to fit within 35-second limit)

---

### Zone 2: Pop Happy 🎀
**Song File**: `קוראים לו שטוקה טוקה פופ.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Bubblegum pop, super cheerful, radio-friendly

**Visual Style**:
- **Background**: Gradient from hot pink to electric blue
- **Ground**: Candy-striped pattern (pink/white)
- **Color Palette**: Hot pink, electric blue, lime green, yellow
- **Animated Elements**:
  - Floating bubbles rising
  - Sparkles appearing randomly
  - Color-shifting background (subtle pulse with beat)

**Obstacles**:
1. **Giant Lollipop** (spiral pattern, pink/white)
2. **Star** (5-pointed, yellow, spinning)
3. **Glitter Bomb** (explosion of sparkles, wide hitbox)
4. **Ribbon** (wavy pink ribbon, vertical)
5. **Heart Balloon** (floating, bobbing)

**Speed**: Fast
**Obstacle Frequency**: Every 2.5 seconds

---

### Zone 3: Cartoon Theme 📺
**Song File**: `שטוקה טוקה - קצבי, תצוגרות.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Classic Saturday morning cartoons with festive brass

**Visual Style**:
- **Background**: Bright blue sky with fluffy white cartoon clouds
- **Ground**: Green grass with exaggerated texture
- **Color Palette**: Primary colors (red, blue, yellow), high saturation
- **Animated Elements**: 
  - Clouds bobbing up and down
  - Sun with animated rays in corner
  - Stars twinkling occasionally

**Obstacles** (Random spawn every 2-4 seconds):
1. **Cartoon Bone** (large, white with shading)
2. **Dog Toy Ball** (red, bouncing)
3. **ACME Box** (brown crate with "ACME" text)
4. **Golden Trumpet** (shiny, vertical)
5. **Music Note** (large eighth note, spinning)

**Obstacle Height Variations**: 
- Ground level (requires normal jump)
- Medium height (requires timed jump)
- Low floating (can run under)

**Speed**: Medium-fast
**Obstacle Frequency**: Every 2.5-3 seconds

---

### Zone 4: Israeli Rock Energy 🎸🇮🇱
**Song File**: `בוקר הוא קופץ עלי - רוק מזרחי ישראלי.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Mediterranean rock party, energetic Israeli street vibes

**Visual Style**:
- **Background**: Jerusalem stone wall with string lights
- **Ground**: Cobblestone street pattern
- **Color Palette**: Warm golds, terracotta reds, deep blues, Middle Eastern patterns
- **Animated Elements**:
  - String lights twinkling
  - Heat wave shimmer effect
  - Decorative tiles in background

**Obstacles**:
1. **Darbuka** (goblet drum, decorated)
2. **Tambourine** (circular, spinning)
3. **String Lights** (hung low, must jump under or over)
4. **Za'atar Container** (traditional spice jar)
5. **Hookah** (water pipe, tall)

**Speed**: Fast
**Obstacle Frequency**: Every 2.5 seconds

---

### Zone 5: Heavy Rock 🎸⚡
**Song File**: `קוראים לו שטוקה טוקה - רוק כבד.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Rock concert, headbanging energy, dramatic

**Visual Style**:
- **Background**: Dark stage with lightning bolts
- **Ground**: Black stage with electric purple edge glow
- **Color Palette**: Dark grays, electric purple, red spotlights, black
- **Animated Elements**:
  - Lightning strikes in background (synced to beat)
  - Smoke/fog rolling across ground
  - Strobe light effects (subtle)
  - Crowd silhouettes headbanging

**Obstacles**:
1. **Electric Guitar** (standing, red or black)
2. **Amplifier** (Marshall-style stack, large)
3. **Drum Set** (kick drum visible)
4. **Microphone Stand** (with cord)
5. **Pyro Burst** (flame effect, dangerous looking)

**Speed**: Very fast
**Obstacle Frequency**: Every 2 seconds

---

### Zone 6: Ending Song 💕
**Song File**: `קוראים לו שטוקה טוקה - שיר סיום.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Sweet, emotional celebration, slower tempo

**Visual Style**:
- **Background**: Soft gradient (pink to lavender to white)
- **Ground**: White with scattered rose petals
- **Color Palette**: Soft pinks, lavenders, white, gold sparkles
- **Animated Elements**:
  - Hearts floating upward (various sizes)
  - Gold sparkles appearing randomly
  - Soft glow around entire scene
  - Stars twinkling gently

**Obstacles** (Collectibles, not harmful!):
1. **Floating Hearts** (collect for bonus points)
2. **Rose Flowers** (red roses, collect)
3. **Love Notes** (paper with heart, collect)
4. **Gift Box** (with ribbon, collect)
5. **Cupid Arrow** (with heart tip, harmless, collect)

**Speed**: Slow (romantic, gentle pace)
**Collectible Frequency**: Every 2-3 seconds

**Special**: Cannot lose in this zone - all obstacles are collectibles

---

### Zone 7: Hawaiian Paradise 🌺
**Song File**: `שטוקה טוקה - הוואי מלא.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Tropical beach, ukulele vibes, relaxed island feeling

**Visual Style**:
- **Background**: Turquoise ocean with waves, palm trees swaying
- **Ground**: Sandy beach with shells
- **Color Palette**: Turquoise, green palms, sunset orange/pink, white sand
- **Animated Elements**:
  - Waves rolling in background
  - Palm trees swaying gently
  - Seagulls flying across
  - Sun setting on horizon

**Obstacles**:
1. **Pineapple** (yellow, with green top)
2. **Lei Flower Garland** (pink/white, hanging)
3. **Surfboard** (standing vertical, colorful)
4. **Coconut** (brown, round)
5. **Tiki Torch** (flaming, tall)

**Speed**: Medium
**Obstacle Frequency**: Every 3 seconds

---

### Zone 8: Reggae Chill 🎵
**Song File**: `שטוקה טוקה- רגאי.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Jamaican vibes, one love, feel-good relaxation

**Visual Style**:
- **Background**: Beach sunset with palm trees, purple/orange sky
- **Ground**: Sand with reggae color stripes (red, yellow, green)
- **Color Palette**: Red, yellow, green (Rasta colors), warm sunset tones
- **Animated Elements**:
  - Palm trees swaying slowly
  - Peaceful waves in background
  - Peace sign symbols floating
  - Sunset gradient shifting

**Obstacles**:
1. **Bongo Drums** (brown, paired)
2. **Peace Sign** (large, tie-dye pattern)
3. **Beach Chair** (striped, reclining)
4. **Tropical Drink** (with umbrella and straw)
5. **Rasta Hat** (with dreads, colorful)

**Speed**: Slow-medium
**Obstacle Frequency**: Every 3-3.5 seconds

---

### Zone 9: Hawaiian Acoustic 🎸
**Song File**: `שטוקה טוקה - הוואי.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Intimate acoustic, romantic island sunset

**Visual Style**:
- **Background**: Beautiful sunset (orange, purple, pink gradient)
- **Ground**: Dark silhouette of beach with gentle waves
- **Color Palette**: Warm sunset oranges, deep purples, silhouettes
- **Animated Elements**:
  - Gentle wave movement
  - Fireflies/sparkles appearing
  - Subtle color shift in sunset
  - Peaceful, romantic atmosphere

**Obstacles**:
1. **Ukulele** (small guitar, wooden)
2. **Seashell** (conch or spiral shell)
3. **Flip-flops** (beach sandals, pair)
4. **Beach Torch** (bamboo with flame)
5. **Starfish** (orange/pink, five-pointed)

**Speed**: Slow
**Obstacle Frequency**: Every 3.5 seconds

---

### Zone 10: Eastern Vibes 🪘
**Song File**: `בוקר הוא קופץ עלי - חוסי מזרחי.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Middle Eastern bazaar, mizrahi groove, soulful and warm

**Visual Style**:
- **Background**: Middle Eastern marketplace with arches, lanterns
- **Ground**: Ornate tile mosaic pattern
- **Color Palette**: Rich purples, golds, deep blues, ornate geometric patterns
- **Animated Elements**:
  - Lanterns swaying gently
  - Decorative fabrics waving
  - Shimmer effects on gold elements
  - Incense smoke wisps

**Obstacles**:
1. **Hookah/Nargila** (ornate water pipe, tall)
2. **Tea Glass** (in ornate holder, steaming)
3. **Moroccan Lamp** (hanging, ornate metal)
4. **Floor Cushion** (colorful, with tassels)
5. **Ornate Plate** (decorative, standing)

**Speed**: Medium
**Obstacle Frequency**: Every 3 seconds

---

### Zone 11: GRAND FINALE 🎺❤️
**Song File**: `קוראים לו שטוקה טוקה תצוגרות.mp3`
**Duration**: Maximum 35 seconds
**Theme**: Grand celebration with trumpet fanfare, triumphant ending

**Visual Style**:
- **Background**: White/gold gradient with rainbow accents
- **Ground**: Golden path with sparkles
- **Color Palette**: Gold, white, pink, ALL previous zone colors appearing
- **Animated Elements**:
  - MASSIVE confetti explosion (continuous)
  - Fireworks bursting
  - All previous zone elements appearing as happy memories
  - Rainbow trails
  - Hearts everywhere

**Obstacles** (ALL COLLECTIBLES):
1. **Golden Hearts** (large, spinning, +100 points each)
2. **Flowers** (bouquet, colorful)
3. **Golden Stars** (+50 points)
4. **Love Letters** (with seal)
5. **Trophy** (golden cup, "Best Dog Mom")

**Speed**: Medium (celebratory, not rushed)
**Collectible Frequency**: Every 2 seconds

**Special Features**:
- Zone gets brighter as Sol progresses
- At 60% completion (21 seconds): Background becomes pure white with gold
- At 85% completion (30 seconds): Giant heart appears in distance
- At 100% (35 seconds): Sol reaches the heart, game pauses

**Ending Sequence** (after 35-second zone completion):
1. Music fades to gentle instrumental (2 seconds)
2. Screen zooms into the giant heart (2 seconds)
3. **MASSIVE CONFETTI EXPLOSION** - confetti rains down continuously (all colors from all zones)
4. Heart opens and entire screen becomes the message area (1 second)
5. **Final Message Screen** (center of screen):

```
┌─────────────────────────────────────────────────┐
│                                                 │
│        [CONFETTI FALLING CONTINUOUSLY]          │
│                                                 │
│   ┌───────────────────────────────────────┐   │
│   │                                       │   │
│   │     [CUSTOMIZABLE PERSONAL MESSAGE]   │   │
│   │                                       │   │
│   │     [You'll write this later]         │   │
│   │                                       │   │
│   │     ❤️ 🐕 ❤️                         │   │
│   │                                       │   │
│   └───────────────────────────────────────┘   │
│                                                 │
│      🎵 הורידו את האלבום בחינם כאן! 🎵        │
│   ┌──────────────────────────────────────┐    │
│   │  📥 Download the Album Free Here 📥  │    │
│   └──────────────────────────────────────┘    │
│                                                 │
│              🔁 שחקו שוב / Play Again           │
│                                                 │
│        [Song selector - replay any zone]        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Visual Details**:
- **Confetti**: Continuous rainbow confetti falling from top (never stops)
- **Message Box**: White/translucent card in center with soft shadow
- **Message Text**: Large, readable Hebrew/English text (you'll customize later)
- **Album Download Button**: 
  - Large, prominent button below message
  - Hebrew: "הורידו את האלבום בחינם כאן!" 
  - English: "Download the Album Free Here"
  - Color: Gradient gold/pink to match finale theme
  - Icon: Download icon (📥) or music note
  - **Action**: Downloads ZIP file with all 11 MP3 songs
- **Play Again Button**: Below album button, simpler style
- **Song Selector**: Grid or list of all 11 zones for individual replay

**Implementation Notes for Album Download**:
```javascript
// Create downloadable ZIP with all songs
const downloadAlbum = () => {
  // Option 1: Direct link to pre-made ZIP file
  window.location.href = '/assets/sol-complete-album.zip';
  
  // Option 2: Dynamic ZIP creation (requires JSZip library)
  const zip = new JSZip();
  
  // Add all 11 songs to ZIP
  songs.forEach(song => {
    zip.file(song.filename, song.audioData);
  });
  
  // Generate and download
  zip.generateAsync({type: 'blob'}).then(content => {
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'שטוקה-טוקה-אלבום-מלא.zip';
    a.click();
  });
};
```

**Confetti Animation**:
- Particles of all zone colors (pink, gold, blue, green, red, purple, etc.)
- Fall from top of screen continuously
- Randomized sizes, rotation, and falling speeds
- Some particles drift left/right as they fall
- Never stops until user closes screen
- Makes the ending feel truly celebratory! 🎊

---

## Zone Timing & Duration Management

### Critical Rule: 35-Second Maximum Per Zone
Every zone MUST complete within 35 seconds to ensure the entire game (11 zones) takes approximately **6.5 minutes**.

**Implementation Details**:

```javascript
const ZONE_MAX_DURATION = 35; // seconds
const ZONE_WARNING_TIME = 32; // start fading song
const ZONE_LENGTH_PIXELS = 5000; // total horizontal distance

// Calculate scroll speed dynamically
const scrollSpeed = ZONE_LENGTH_PIXELS / ZONE_MAX_DURATION; // pixels per second

// In game loop
zoneTimer += deltaTime;

if (zoneTimer >= ZONE_WARNING_TIME) {
  fadeOutCurrentSong(); // Fade over 3 seconds
}

if (zoneTimer >= ZONE_MAX_DURATION || playerReachedEnd) {
  completeZone();
  transitionToNextZone();
}
```

**Song Handling**:
- If song is **shorter than 35s**: Zone completes when song ends (natural finish)
- If song is **longer than 35s**: 
  - Fade out at 32 seconds
  - Hard cut at 35 seconds
  - Transition to next zone
- Crossfade to next song starts at 33 seconds

**Total Game Duration**:
- 11 zones × 35 seconds = **385 seconds = 6 minutes 25 seconds**
- Plus transitions (1s each × 11) = **~6 minutes 36 seconds total**
- Perfect for a complete musical experience!

**Player Death Handling**:
- If player dies, zone timer RESETS for that zone
- Player can retry same zone unlimited times
- Only successful completion advances to next zone

---

## UI Components

### Game Header (Top of Screen)
```
┌─────────────────────────────────────────┐
│ 🐕 Zone: [Zone Name]                   │
│ Score: [0000]    Lives: ❤️❤️❤️         │
└─────────────────────────────────────────┘
```

### Mobile Controls
- **Tap anywhere** on screen = Jump
- **Long press** = Higher jump (optional advanced feature)

### Desktop Controls
- **Spacebar** = Jump
- **Click anywhere** = Jump
- **P** = Pause

### Pause Menu
```
┌───────────────────┐
│   GAME PAUSED     │
│                   │
│  ▶ Resume         │
│  🔁 Restart Zone  │
│  🏠 Main Menu     │
│  🔊 Volume: [==] │
└───────────────────┘
```

### Game Over Screen
```
┌───────────────────────────┐
│     אוי לא! 🥺           │
│   סול פגע במשהו!          │
│                           │
│  Final Score: [0000]      │
│  Zone Reached: [X/11]     │
│                           │
│  🔁 Try Again             │
│  🏠 Main Menu             │
└───────────────────────────┘
```

---

## Audio Implementation

### Requirements
1. **Preload all 11 songs** on game start
2. **Crossfade** between zones (1 second overlap)
3. **Loop songs** until zone completes
4. **Volume control** (0-100%)
5. **Mute button** available at all times

### Zone Transitions
- Song fades out over last 10% of zone
- Next song fades in during transition animation
- 1-2 second visual transition (zone theme elements morphing)

---

## Difficulty Scaling

### Progressive Challenge
All zones are 35 seconds maximum. Difficulty is controlled by obstacle frequency and speed:

- **Zone 1 (Boys Band)**: Medium - obstacles every 2.5 seconds
- **Zone 2 (Pop)**: Medium - obstacles every 2.5 seconds  
- **Zone 3 (Cartoon)**: Medium-Easy - obstacles every 2.5-3 seconds
- **Zone 4 (Israeli Rock)**: Medium-Hard - obstacles every 2.5 seconds
- **Zone 5 (Heavy Rock)**: Hard - obstacles every 2 seconds, fast scroll
- **Zone 6 (Ending Song)**: Easy - collectibles only, no death
- **Zone 7 (Hawaiian)**: Medium - obstacles every 3 seconds
- **Zone 8 (Reggae)**: Easy-Medium - obstacles every 3-3.5 seconds
- **Zone 9 (Hawaiian Acoustic)**: Easy - obstacles every 3.5 seconds
- **Zone 10 (Eastern)**: Medium - obstacles every 3 seconds
- **Zone 11 (Finale)**: Easy - collectibles only, celebration!

### Lives System
- Start with **3 lives** (hearts)
- Lose 1 life per collision
- Gain 1 life when completing a zone (max 3)
- Zones 6 and 11 cannot lose lives (safe zones)

### Zone Completion Timing
- Each zone: **35 seconds maximum**
- Song fades out at: **32 seconds** (if still playing)
- Transition to next zone: **1 second**
- Total game: **~6 minutes 36 seconds** (including all transitions)

---

## Performance Optimization

1. **Sprite Pooling**: Reuse obstacle objects instead of creating new ones
2. **Canvas Optimization**: Clear only dirty regions when possible
3. **Audio Buffering**: Preload and cache all audio files
4. **Lazy Load**: Load zone assets as needed (not all at once)
5. **Mobile**: Reduce particle effects on mobile devices

---

## Responsive Design & Mobile Support

### Desktop (1920x1080 and above)
- Full visual effects
- Larger canvas area (1600x900px game area)
- More detailed backgrounds
- Keyboard controls (Spacebar) + Mouse clicks
- Particle effects at full density

### Tablet Landscape (1024px - 1920px width)
- Slightly simplified effects
- Adjust canvas proportions (1280x720px game area)
- Touch-optimized controls
- Medium particle density

### Mobile Landscape (667px - 1024px width) **PRIMARY TARGET**
This is the main mobile experience - horizontal/landscape orientation

**Screen Orientation Handling**:
1. **Detection**: Check if device is mobile on load
2. **Orientation Prompt**: If device is in portrait mode, show full-screen overlay:
   ```
   ┌─────────────────────────────────┐
   │                                 │
   │         🔄                      │
   │   Please rotate your device     │
   │   לחוויה הטובה ביותר,          │
   │   סובבו את המכשיר לרוחב         │
   │                                 │
   │   [Rotating phone icon]         │
   │                                 │
   └─────────────────────────────────┘
   ```
3. **Lock Landscape**: Use Screen Orientation API when available:
   ```javascript
   screen.orientation.lock('landscape').catch(() => {
     // Fallback: Show rotation message
   });
   ```
4. **Continue Anyway** button for users who prefer portrait (suboptimal experience)

**Mobile Landscape Optimizations**:
- **Canvas Size**: 100vw x 100vh (fullscreen)
- **Game Area**: Full width minus UI margins
- **Sol Size**: 15% larger than desktop (easier to see)
- **Obstacles**: 20% larger with bigger hitboxes (easier gameplay)
- **Touch Target**: Entire screen is touch-enabled (tap anywhere to jump)
- **UI Position**:
  - Score & Zone Name: Top-left corner (safe zone)
  - Lives: Top-right corner (safe zone)
  - Pause button: Top-right (hamburger menu icon)
- **Simplified Effects**:
  - Reduce particle count by 50%
  - Simplified background animations
  - Lower quality shadows (performance)
  - Disable non-essential visual flourishes

**Touch Controls for Mobile**:
- **Single Tap**: Normal jump
- **Double Tap** (optional): Higher jump for advanced players
- **Tap & Hold** (0.5s): Pause game
- **Swipe Down**: Pause menu (alternative to hold)
- **No accidental touches**: Ignore rapid-fire taps (debounce 200ms)

**Performance Optimizations for Mobile**:
- **60 FPS Target**: Lock to 60fps, reduce quality if drops below
- **Battery Saving**: Reduce frame rate to 30fps after 5 minutes of continuous play
- **Heat Management**: Monitor performance, reduce effects if device is throttling
- **Audio**: Use Web Audio API with proper mobile unlocking (require user gesture)
- **Memory**: Clear unused assets between zones
- **Lazy Loading**: Load next zone assets during current zone (predictive loading)

**Mobile-Specific Features**:
- **Haptic Feedback**: Vibrate on jump, collision, zone complete (if supported)
  - Jump: 10ms light vibration
  - Collision: 50ms medium vibration
  - Zone complete: Pattern vibration (100ms, 50ms, 100ms)
- **Auto-Save**: Save progress to localStorage every zone completion
- **Resume Game**: If user closes browser, can resume from last zone
- **Offline Support**: Game works without internet after initial load (PWA optional)

**Landscape Layout** (Mobile Horizontal):
```
┌────────────────────────────────────────────────────────────────────┐
│ Zone: Cartoon Theme    Score: 00150                    ❤️❤️❤️  ☰ │
│                                                                    │
│                                                                    │
│              [Cloud]         [Cloud]                               │
│                                                                    │
│                                       [Obstacle]    [Obstacle]     │
│                                                                    │
│                    🐕                                              │
│                   Sol                                              │
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬│
│                                                                    │
│                 [TAP ANYWHERE TO JUMP]                             │
└────────────────────────────────────────────────────────────────────┘
```

**Aspect Ratio Handling**:
- **16:9** (most phones): Perfect fit, full canvas
- **18:9 / 19:9** (modern phones): Slight letterboxing, centered
- **21:9** (ultra-wide): Full width utilized, amazing experience
- Always maintain game proportions, never stretch

### Mobile Portrait (< 667px width) **NOT RECOMMENDED**
- Show orientation prompt immediately
- If user chooses to continue:
  - Vertical scrolling game (Sol runs upward instead)
  - Simplified graphics
  - Touch-only controls
  - Reduced zone length (50% shorter)
  - Clear warning: "Landscape mode recommended for best experience"

### Safe Zone & Notch Handling
Modern phones (iPhone X+, etc.) have notches and rounded corners:
- **Use CSS safe-area-inset**: 
  ```css
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  ```
- **UI Margins**: Keep all interactive elements 20px from screen edges
- **Critical Info**: Score, lives, pause button within safe zone
- **Game Canvas**: Can extend to edges (non-interactive)

### Browser Compatibility (Mobile)
- **Safari iOS 13+**: Primary target (most iPhones)
- **Chrome Android**: Primary target
- **Samsung Internet**: Test and support
- **Firefox Mobile**: Test and support
- **Audio Autoplay**: Handle iOS restrictions (require user tap to start audio)

### Loading Screen (Mobile)
While assets load, show:
```
┌─────────────────────────────────┐
│                                 │
│    🐕 שטוקה טוקה מתכונן...     │
│                                 │
│    [▓▓▓▓▓▓▓░░░░░] 65%          │
│                                 │
│    Loading music and graphics   │
│                                 │
└─────────────────────────────────┘
```

### Network Handling
- **Offline Detection**: Show message if connection lost mid-game
- **Preload All Assets**: Load all 11 songs before game starts (show progress)
- **Fallback**: If songs fail to load, show error with retry button
- **Size Warning**: "This game will download ~50MB of audio. Continue?"

---

## Bonus Features (Optional Enhancements)

1. **Screenshot Button**: Capture and download final message screen
2. **Share Button**: Share score on social media
3. **Song Gallery**: Listen to all songs after completing game
4. **Developer Mode**: Skip to any zone for testing
5. **High Score**: Store best score in localStorage
6. **Easter Eggs**: Hidden collectibles in certain zones

---

## Development Phases

### Phase 1: Core Mechanics (Week 1)
- Sol character with jump physics
- Basic collision detection
- Single test zone with obstacles
- Audio playback
- **Desktop controls implementation**

### Phase 2: All Zones (Week 2)
- Implement all 11 zone configurations
- Zone-specific obstacles
- Visual themes for each zone
- Music integration
- Zone transitions

### Phase 3: Mobile Optimization (Week 3)
- **Landscape orientation detection and prompt**
- **Touch controls for mobile**
- **Performance optimization for 60fps**
- **Haptic feedback integration**
- **Safe zone & notch handling**
- **Battery and heat management**
- **Responsive canvas sizing**
- Testing on actual devices (iPhone, Android)

### Phase 4: Polish & UI (Week 4)
- Smooth transitions
- UI/UX refinement
- **Final message screen with confetti animation**
- **Album download button implementation**
- **Create ZIP file with all 11 songs**
- Loading screens
- Error handling
- Auto-save functionality
- Message placeholder (customizable later)

### Phase 5: Testing & Deploy
- Cross-browser testing (Safari iOS, Chrome Android priority)
- Cross-device testing (various phone models)
- Performance optimization
- Bug fixes
- PWA setup (optional)
- Deployment

---

## Asset Requirements

### Audio Files (Provided by Client)
All 11 MP3 files listed in zone configurations:
1. `קוראים לו שטוקה טוקה boys band.mp3`
2. `קוראים לו שטוקה טוקה פופ.mp3`
3. `שטוקה טוקה - קצבי, תצוגרות.mp3`
4. `בוקר הוא קופץ עלי - רוק מזרחי ישראלי.mp3`
5. `קוראים לו שטוקה טוקה - רוק כבד.mp3`
6. `קוראים לו שטוקה טוקה - שיר סיום.mp3`
7. `שטוקה טוקה - הוואי מלא.mp3`
8. `שטוקה טוקה- רגאי.mp3`
9. `שטוקה טוקה - הוואי.mp3`
10. `בוקר הוא קופץ עלי - חוסי מזרחי.mp3`
11. `קוראים לו שטוקה טוקה תצוגרות.mp3`

**PLUS**: Pre-packaged ZIP file containing all 11 songs for the download button:
- Filename: `שטוקה-טוקה-אלבום-מלא.zip` or `Sol-Complete-Album.zip`
- Total size: ~40-60MB
- Include album artwork (optional): Photo of Sol or cute dog illustration
- Include track listing text file with song names

### Graphics (To Create)
- Sol sprite sheets (running, jumping, hit)
- Obstacle sprites for each zone
- Background elements
- UI elements (buttons, hearts, etc.)
- **Confetti particles** (rainbow colors: pink, gold, blue, green, red, purple, orange, yellow)
  - Can be generated programmatically or use sprite sheet
  - Various shapes: circles, squares, stars, hearts
- **Download icon** (📥) for album button
- **Message card background**: 
  - White/translucent card with soft shadow
  - Rounded corners
  - Subtle glow effect
  - Should accommodate 5-10 lines of text (Hebrew + English)

### Fonts
- **Hebrew Support**: Alef, Heebo, or Rubik
- **English**: Rounded, friendly font (Quicksand, Nunito)

---

## Color Reference

### Zone Color Palettes (Hex Values)

**Zone 1 - Cartoon**:
- Sky: `#87CEEB`
- Grass: `#90EE90`
- Accents: `#FF0000`, `#FFFF00`, `#0000FF`

**Zone 2 - Pop**:
- Background: `linear-gradient(#FF1493, #00BFFF)`
- Ground: `#FFB6C1` with `#FFFFFF` stripes
- Accents: `#00FF00`, `#FFFF00`

**Zone 3 - Boys Band**:
- Background: `#1a1a1a`
- Stage: `#0a0a0a` with `#FFFFFF` lines
- Lights: `#FF00FF`, `#00FFFF`, `#FFFF00`

**Zone 4 - Israeli Rock**:
- Wall: `#D4AF7A` (Jerusalem stone)
- Ground: `#8B7355`
- Accents: `#FFD700`, `#DC143C`, `#4169E1`

**Zone 5 - Heavy Rock**:
- Background: `#1a1a1a`
- Stage: `#000000` with `#9B59B6` glow
- Lightning: `#FFFFFF`, `#9B59B6`

**Zone 6 - Ending Song**:
- Background: `linear-gradient(#FFB6C1, #E6E6FA, #FFFFFF)`
- Ground: `#FFFFFF`
- Accents: `#FFD700`, `#FF69B4`

**Zone 7 - Hawaiian**:
- Ocean: `#40E0D0`
- Sand: `#F4A460`
- Sky: `linear-gradient(#FF6347, #FFA500)`

**Zone 8 - Reggae**:
- Background: `linear-gradient(#800080, #FF8C00)`
- Ground: Stripes of `#FF0000`, `#FFFF00`, `#008000`

**Zone 9 - Hawaiian Acoustic**:
- Sunset: `linear-gradient(#FF4500, #9370DB)`
- Silhouettes: `#1a1a1a`

**Zone 10 - Eastern**:
- Background: `#4B0082` with `#FFD700` patterns
- Ground: Mosaic of `#4169E1`, `#FFD700`, `#FFFFFF`

**Zone 11 - Finale**:
- Background: `linear-gradient(#FFFFFF, #FFD700)`
- ALL previous zone colors as confetti

---

---

## Mobile Implementation Code Examples

### Orientation Detection & Lock
```javascript
// Detect if mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Check current orientation
const isLandscape = window.innerWidth > window.innerHeight;

// Show rotation prompt if portrait
if (isMobile && !isLandscape) {
  showRotationPrompt();
}

// Try to lock to landscape (modern browsers)
const lockOrientation = async () => {
  try {
    await screen.orientation.lock('landscape');
  } catch (err) {
    console.log('Orientation lock not supported');
    // Fallback: just show the rotation message
  }
};

// Listen for orientation changes
window.addEventListener('orientationchange', () => {
  const isNowLandscape = window.innerWidth > window.innerHeight;
  if (!isNowLandscape && isMobile) {
    showRotationPrompt();
  } else {
    hideRotationPrompt();
  }
});
```

### Touch Controls
```javascript
// Touch anywhere to jump
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent scrolling, zooming
  
  // Debounce rapid taps
  const now = Date.now();
  if (now - lastTapTime < 200) return; // Ignore if within 200ms
  lastTapTime = now;
  
  // Make Sol jump
  jump();
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(10); // 10ms light vibration
  }
}, { passive: false });

// Prevent default touch behaviors
canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
```

### Haptic Feedback
```javascript
const haptic = {
  jump: () => {
    if (navigator.vibrate) navigator.vibrate(10);
  },
  collision: () => {
    if (navigator.vibrate) navigator.vibrate(50);
  },
  zoneComplete: () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }
};

// Use throughout game
// haptic.jump() when Sol jumps
// haptic.collision() when hitting obstacle
// haptic.zoneComplete() when finishing a zone
```

### Audio Unlock for iOS
```javascript
// iOS requires user interaction before playing audio
let audioUnlocked = false;

const unlockAudio = () => {
  if (audioUnlocked) return;
  
  // Create and play a silent sound
  const silentAudio = new Audio();
  silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUHAAAAAAAAAOGfPiZDAAA=';
  
  silentAudio.play().then(() => {
    audioUnlocked = true;
    console.log('Audio unlocked for iOS');
  }).catch(err => {
    console.log('Audio unlock failed:', err);
  });
};

// Call on first user interaction (tap to start game)
startButton.addEventListener('click', () => {
  unlockAudio();
  startGame();
});
```

### Safe Area Handling (CSS)
```css
/* Handle iPhone notches and rounded corners */
.game-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Keep UI elements in safe zone */
.game-header {
  position: fixed;
  top: max(10px, env(safe-area-inset-top));
  left: max(10px, env(safe-area-inset-left));
  right: max(10px, env(safe-area-inset-right));
}

/* Full screen canvas */
.game-canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
```

### Performance Monitoring
```javascript
let frameCount = 0;
let lastFpsCheck = Date.now();
let currentFps = 60;

const monitorPerformance = () => {
  frameCount++;
  
  const now = Date.now();
  if (now - lastFpsCheck >= 1000) {
    currentFps = frameCount;
    frameCount = 0;
    lastFpsCheck = now;
    
    // If FPS drops below 45, reduce quality
    if (currentFps < 45) {
      reduceGraphicsQuality();
    }
    
    // If battery is low, reduce frame rate
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2 && !battery.charging) {
          targetFps = 30; // Reduce to 30fps for battery saving
        }
      });
    }
  }
};

// Call in game loop
requestAnimationFrame(monitorPerformance);
```

### Auto-Save Progress
```javascript
// Save progress after each zone
const saveProgress = (zoneNumber, score, lives) => {
  const gameState = {
    currentZone: zoneNumber,
    score: score,
    lives: lives,
    timestamp: Date.now()
  };
  localStorage.setItem('sol-game-progress', JSON.stringify(gameState));
};

// Load progress on game start
const loadProgress = () => {
  const saved = localStorage.getItem('sol-game-progress');
  if (!saved) return null;
  
  const gameState = JSON.parse(saved);
  
  // Check if save is less than 24 hours old
  const hoursSinceLastPlay = (Date.now() - gameState.timestamp) / 1000 / 60 / 60;
  if (hoursSinceLastPlay > 24) {
    // Expired, start fresh
    return null;
  }
  
  return gameState;
};

// Show resume option
const savedGame = loadProgress();
if (savedGame) {
  showResumeButton(savedGame.currentZone);
}
```

### Viewport Meta Tag (HTML)
```html
<!-- Critical for mobile! -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">

<!-- Prevent mobile Safari UI from showing -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- Theme color for mobile browser UI -->
<meta name="theme-color" content="#667eea">
```

### PWA Manifest (Optional - for offline support)
```json
{
  "name": "Sol's Musical Adventure - שטוקה טוקה",
  "short_name": "Sol Game",
  "description": "A musical love letter to Sol",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Confetti Animation Implementation
```javascript
// Confetti particle system for finale
class Confetti {
  constructor() {
    this.particles = [];
    this.colors = [
      '#FF1493', // Hot pink (Pop zone)
      '#FFD700', // Gold (Finale)
      '#87CEEB', // Sky blue (Cartoon)
      '#00FF00', // Lime (Pop)
      '#FF0000', // Red (Rock)
      '#9B59B6', // Purple (Heavy Rock)
      '#FF8C00', // Orange (Sunset)
      '#FFFF00', // Yellow (Cartoon)
      '#40E0D0', // Turquoise (Hawaiian)
      '#FF69B4', // Pink (Love)
    ];
  }

  createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      size: Math.random() * 10 + 5,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      shape: ['circle', 'square', 'star', 'heart'][Math.floor(Math.random() * 4)]
    };
  }

  init() {
    // Create initial burst of 100 particles
    for (let i = 0; i < 100; i++) {
      this.particles.push(this.createParticle());
    }
  }

  update() {
    this.particles.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      // Remove if off screen
      if (p.y > window.innerHeight) {
        this.particles.splice(index, 1);
        // Add new particle at top to keep it going
        this.particles.push(this.createParticle());
      }
    });
  }

  draw(ctx) {
    this.particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;

      switch(p.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
          break;
        case 'star':
          this.drawStar(ctx, 0, 0, 5, p.size, p.size/2);
          break;
        case 'heart':
          this.drawHeart(ctx, 0, 0, p.size);
          break;
      }
      ctx.restore();
    });
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
    ctx.bezierCurveTo(x - size/2, y + size/2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size/2, y + size/2, x + size/2, y + size/4);
    ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
    ctx.closePath();
    ctx.fill();
  }
}

// Usage in finale screen
const confetti = new Confetti();
confetti.init();

function animateFinale() {
  confetti.update();
  confetti.draw(canvasContext);
  requestAnimationFrame(animateFinale);
}
```

---

## Testing Checklist

### Core Gameplay
- [ ] Sol jumps correctly with smooth arc
- [ ] Collisions detected accurately
- [ ] All 11 songs play and transition smoothly
- [ ] All zones render with correct theme
- [ ] Game over/restart works properly
- [ ] Final message displays correctly

### Desktop Controls
- [ ] Desktop keyboard controls work (Spacebar)
- [ ] Mouse click to jump works
- [ ] Pause menu accessible

### Mobile Landscape (Priority Testing)
- [ ] Orientation detection works on load
- [ ] Rotation prompt displays correctly in portrait
- [ ] Screen orientation lock works (when supported)
- [ ] Touch controls work (tap anywhere to jump)
- [ ] Haptic feedback works on compatible devices
- [ ] No accidental touches/double jumps
- [ ] Performance stays at 60fps for 5+ minutes
- [ ] Battery usage is reasonable
- [ ] Game fits properly on 16:9, 18:9, 19:9, 21:9 screens
- [ ] Safe zone properly handles notches/rounded corners
- [ ] UI elements don't get cut off
- [ ] Audio unlocks properly on iOS (requires user gesture)
- [ ] Audio plays smoothly without stuttering
- [ ] Auto-save works (close and reopen browser)
- [ ] Resume game from last zone works
- [ ] All 11 songs preload before game starts
- [ ] Loading progress bar displays correctly
- [ ] Offline mode works after initial load
- [ ] No memory leaks during long play sessions

### Device-Specific Testing
- [ ] iPhone SE (small screen) - landscape
- [ ] iPhone 14/15 (standard) - landscape  
- [ ] iPhone 14/15 Pro Max (large, notch) - landscape
- [ ] Samsung Galaxy S23 - landscape
- [ ] Google Pixel 7 - landscape
- [ ] iPad in landscape (tablet experience)

### Browser Compatibility
- [ ] Safari iOS 13+ (primary target)
- [ ] Chrome Android (primary target)
- [ ] Samsung Internet
- [ ] Firefox Mobile
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Edge Desktop

### Audio & Performance
- [ ] Audio mute/volume works
- [ ] No audio lag or sync issues
- [ ] Songs loop seamlessly
- [ ] Crossfade transitions smooth
- [ ] No performance degradation after multiple zones
- [ ] Frame rate stays stable

### UI/UX
- [ ] Hebrew text renders correctly (right-to-left)
- [ ] All buttons are touch-friendly (min 44x44px)
- [ ] Pause menu accessible and functional
- [ ] Loading screen shows progress accurately
- [ ] Error messages display properly
- [ ] Final message screen is readable and beautiful
- [ ] Confetti animation runs smoothly on finale screen
- [ ] Message placeholder is centered and properly sized
- [ ] Album download button is prominent and clear
- [ ] Album download works (ZIP file downloads correctly)
- [ ] ZIP file contains all 11 MP3 files
- [ ] Play Again button works from finale screen
- [ ] Song selector allows replaying individual zones

### Edge Cases
- [ ] Game handles low battery mode gracefully
- [ ] Game handles network loss (if offline mode enabled)
- [ ] Game handles phone calls/interruptions (pause game)
- [ ] Game handles browser minimize/background
- [ ] Game handles rapid orientation changes
- [ ] Game recovers from audio playback errors

---

## Final Notes

This is a **love letter game** - prioritize:
1. **Emotional impact** of the ending
2. **Smooth, enjoyable** gameplay (not too hard!)
3. **Beautiful presentation** of each zone
4. **Seamless music experience**
5. **Perfect mobile landscape experience** - this is likely where she'll play it!

The goal is to make his wife smile, feel loved, and enjoy the creative variations of "her song" for Sol. 

**Mobile is the primary platform** - she'll likely play this on her phone while relaxing, so the horizontal experience must be flawless, smooth, and delightful.

Make it magical! ✨🐕❤️

---

## Quick Start Guide for Developer

1. **Set up React project** with Vite or Create React App
2. **Add the 11 MP3 files** to `/public/audio/` directory
3. **Implement orientation detection** first (critical for mobile UX)
4. **Build one test zone** with Sol running and jumping
5. **Add collision detection** 
6. **Integrate audio system** with iOS unlock
7. **Build all 11 zones** one by one
8. **Polish transitions** and final message
9. **Test on real devices** (borrow friends' phones!)
10. **Deploy** and surprise her! 💕

### Recommended Libraries
- **react-spring** - for smooth animations
- **use-sound** - for easy audio management
- **react-canvas** or plain Canvas API
- **@react-three/fiber** - if you want 3D effects (advanced, optional)

### File Size Estimate
- 11 MP3 files: ~40-60MB (depends on quality)
- Code + Assets: ~5-10MB
- Total: ~50-70MB download

Good luck! This is going to be an amazing gift! 🎮🐕❤️
