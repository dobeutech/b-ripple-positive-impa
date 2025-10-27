# Planning Guide

A social media platform where users share witnessed positive stories about how others have impacted the world, fostering authentic human connection through verified positive content.

**Experience Qualities**:
1. **Uplifting** - Every interaction should leave users feeling inspired and connected to humanity's goodness
2. **Safe** - Privacy controls and verification create a trusted environment where users feel comfortable sharing and being recognized
3. **Effortless** - Posting, discovering, and managing stories should be intuitive with minimal friction

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Requires user authentication with ID verification, granular privacy controls, sophisticated tagging/notification system, feed algorithms, and account matching for anonymous recipients

## Essential Features

### User Registration & Authentication
- **Functionality**: Multi-path registration with email verification and optional ID verification for full accounts; anonymous posting for first-time users
- **Purpose**: Balance accessibility with trust and verification to prevent abuse while lowering barrier to entry
- **Trigger**: User clicks "Share a Story" or "Sign Up"
- **Progression**: Choose account type → Enter details (email/name) → Email verification → Optional ID upload → Account created → Explore feed
- **Success criteria**: Users can create accounts, verify email, and anonymous users can post with just first name

### Post Creation System
- **Functionality**: Rich text story editor with mandatory recipient field, privacy options, and poster anonymity controls
- **Purpose**: Enable meaningful storytelling while protecting privacy of both poster and recipient
- **Trigger**: Click "Share a Story" button from any page
- **Progression**: Click share → Enter recipient (search users or type anonymous name) → Write story describing impact → Select privacy (public/private/recipient-only) → Choose poster visibility (anonymous/first-name/full-profile) → Submit → Confirmation
- **Success criteria**: Posts include recipient, positive content, and respect privacy settings; recipients are notified

### Feed & Discovery
- **Functionality**: Algorithmic main feed with "Top Stories" section, filter by topics/interests, and personal "My Stories" feed for tagged posts
- **Purpose**: Help users discover inspiring content while providing personal space for stories about them
- **Trigger**: User opens app or navigates to feed sections
- **Progression**: Land on main feed → Browse top stories → Filter by interest → Click story → Read full content → Like/share → Return to feed
- **Success criteria**: Feed loads quickly, top stories reflect engagement, filters work accurately, tagged stories appear in personal feed

### Tagging & Notification System
- **Functionality**: Tag recipients (registered users or anonymous names), send notifications, match accounts when anonymous recipients sign up
- **Purpose**: Connect stories to real people and notify them of positive recognition
- **Trigger**: User tagged in post, or signs up matching anonymous tag
- **Progression**: Post created with tag → Notification sent to recipient → Recipient views story → Option to respond or adjust privacy → Story added to personal feed
- **Success criteria**: Notifications delivered reliably, anonymous tags matched to new accounts, recipients can find all stories about them

### Privacy & Sharing Controls
- **Functionality**: Per-post privacy settings, recipient control over tagged story visibility, community sharing options
- **Purpose**: Give users complete control over their digital footprint and how they're portrayed
- **Trigger**: Creating post or managing existing tagged stories
- **Progression**: Set privacy during creation → Post published with restrictions → Recipient adjusts if needed → Privacy enforced in all views
- **Success criteria**: Privacy settings work correctly, recipients can hide/show stories, public posts are discoverable

## Edge Case Handling

- **Duplicate Recipients**: System suggests existing users when typing anonymous names to prevent duplicates
- **Inappropriate Content**: Report button on all posts with moderation queue and community guidelines
- **Account Deletion**: All posts by user become anonymous; tagged posts remain visible per original privacy settings
- **Failed ID Verification**: Users remain in limited mode, can post but not verify others or access certain features
- **Orphaned Anonymous Tags**: When no match found after 30 days, recipient remains anonymous with option to claim
- **Bulk Notifications**: Digest mode for users tagged in multiple posts to prevent notification fatigue
- **Privacy Conflicts**: Recipient privacy settings always override poster settings for tagged content

## Design Direction

The design should feel warm, hopeful, and human - like reading heartfelt letters rather than scrolling endless feeds. It should combine the authenticity of handwritten notes with modern digital convenience. Minimal interface that lets stories shine, with soft edges and generous whitespace creating a calm, reflective experience.

## Color Selection

Custom palette creating a warm, positive, and trustworthy atmosphere

- **Primary Color**: Warm coral/orange (oklch(0.72 0.15 35)) - Communicates warmth, human connection, and positive energy without being overly cheerful
- **Secondary Colors**: Soft sage green (oklch(0.75 0.08 140)) for success states and growth metaphors; warm cream (oklch(0.96 0.02 85)) for cards and elevated surfaces creating a paper-like feel
- **Accent Color**: Vibrant golden orange (oklch(0.75 0.18 55)) for CTAs, likes, and top stories - draws attention while maintaining warmth
- **Foreground/Background Pairings**:
  - Background (Warm White oklch(0.98 0.01 85)): Dark charcoal text (oklch(0.25 0.01 85)) - Ratio 13.2:1 ✓
  - Card (Soft Cream oklch(0.96 0.02 85)): Dark charcoal text (oklch(0.25 0.01 85)) - Ratio 12.1:1 ✓
  - Primary (Warm Coral oklch(0.72 0.15 35)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Secondary (Sage Green oklch(0.75 0.08 140)): Dark charcoal text (oklch(0.25 0.01 85)) - Ratio 6.8:1 ✓
  - Accent (Golden Orange oklch(0.75 0.18 55)): Dark charcoal text (oklch(0.25 0.01 85)) - Ratio 6.3:1 ✓
  - Muted (Light Sage oklch(0.92 0.03 140)): Medium gray text (oklch(0.50 0.01 85)) - Ratio 4.8:1 ✓

## Font Selection

Typography should feel approachable yet refined, combining readability with personality. Use Inter for clean UI elements and Crimson Pro (serif) for story content to create a literary, timeless feel that emphasizes the importance of each story.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold/32px/tight letter spacing (-0.02em)/line height 1.2
  - H2 (Section Headers): Inter SemiBold/24px/tight letter spacing (-0.01em)/line height 1.3
  - H3 (Story Titles): Crimson Pro SemiBold/20px/normal letter spacing/line height 1.4
  - Body (Story Content): Crimson Pro Regular/18px/normal letter spacing/line height 1.7
  - UI Text (Buttons, Labels): Inter Medium/16px/normal letter spacing/line height 1.5
  - Meta Text (Timestamps, Tags): Inter Regular/14px/slight letter spacing (0.01em)/line height 1.4
  - Captions: Inter Regular/13px/slight letter spacing (0.01em)/line height 1.3

## Animations

Animations should feel gentle and purposeful, reinforcing positive emotions without drawing unnecessary attention. Use subtle, organic movements that guide users through flows and celebrate meaningful moments like posting stories or receiving notifications.

- **Purposeful Meaning**: Emphasize warmth through soft easing (ease-in-out) and generous timing; celebrate positive moments (likes, posts) with gentle scale/fade combinations
- **Hierarchy of Movement**: Story card appearance on feed (fade + slight upward drift), notification badges (gentle pulse), like button (scale + color shift), post submission (success animation with confetti-like particles), privacy toggle (smooth slide)

## Component Selection

- **Components**: 
  - **Card** - Primary container for story posts with hover elevation change, soft shadows
  - **Dialog** - Post creation modal with multi-step form, full-screen on mobile
  - **Avatar** - User profiles with verified badge overlay for ID-verified accounts
  - **Badge** - Topic tags, recipient tags, privacy indicators with subtle backgrounds
  - **Button** - Primary (warm coral filled), Secondary (outlined), Ghost (for inline actions) with rounded-full for floating action button
  - **Input/Textarea** - Form fields with floating labels, character counters for stories
  - **Select** - Privacy dropdowns, topic filters with custom styling
  - **Tabs** - Feed navigation (Main, Top Stories, My Stories)
  - **Sheet** - Mobile drawer for filters and settings
  - **Tooltip** - Privacy icon explanations, feature hints
  - **Alert** - Inline notifications for verification status, post visibility
  - **Separator** - Subtle dividers between feed sections
  - **ScrollArea** - Feed container with infinite scroll capability

- **Customizations**: 
  - **Story Card Component** - Custom card with avatar, story content excerpt, recipient chip, engagement metrics, privacy indicator, and contextual actions
  - **Recipient Selector** - Combo box with user search and anonymous option, visual distinction between user types
  - **Privacy Selector** - Custom dropdown with icon + text explaining each privacy level
  - **Top Story Highlight** - Featured card variant with golden accent border and trophy icon
  - **Floating Action Button** - Fixed position "Share Story" button with pencil icon

- **States**: 
  - **Buttons**: Default (solid with shadow), Hover (slightly elevated, darker), Active (pressed down), Focus (ring in accent color), Disabled (muted with opacity)
  - **Story Cards**: Default (subtle shadow), Hover (elevated shadow, slight scale), Selected (accent border), Loading (skeleton with pulse)
  - **Inputs**: Empty (placeholder text), Focused (accent border, label floats up), Filled (label stays up), Error (destructive border with message), Disabled (muted background)

- **Icon Selection**: Phosphor icons throughout
  - PencilSimple - Create story
  - Heart/HeartFill - Like/unlike
  - UserCircle - Profile
  - Tag - Recipient tags
  - Eye/EyeSlash - Privacy visibility
  - Bell - Notifications
  - MagnifyingGlass - Search
  - Funnel - Filters
  - Share - Share story
  - ShieldCheck - Verified badge
  - Sparkle - Top stories

- **Spacing**: 
  - Container padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
  - Component gaps: gap-4 for form fields, gap-6 for sections, gap-3 for inline elements
  - Card padding: p-6
  - Vertical rhythm: space-y-8 for major sections, space-y-4 for related groups

- **Mobile**: 
  - Feed cards full-width with reduced padding
  - Floating action button for quick story creation
  - Bottom navigation bar for main sections (Feed, Create, Notifications, Profile)
  - Sheet overlays instead of dropdowns for filters
  - Story content optimized for vertical reading
  - Touch targets minimum 44px
  - Swipe gestures for card actions (like, share)
