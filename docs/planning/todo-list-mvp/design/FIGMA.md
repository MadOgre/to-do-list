# Figma values

The values measured from the Figma file, so they don't need to be read from Figma again. The screenshots in this folder show the look; this file holds the exact sizes. Add to it whenever a new value is read from Figma.

**File:** [todo-app](https://www.figma.com/design/1QnS4AWsX5ZnbxbSh66Erz/todo-app?node-id=82139-237) (file key `1QnS4AWsX5ZnbxbSh66Erz`)

## Frames

| Frame | Node | Size |
| --- | --- | --- |
| Desktop - Dark | `82139:237` | 1440 × 800 |
| Mobile - Light | `82139:335` | 375 × 730 |

## Page

- Background image: 1440 × 300 on desktop, 375 × 200 on mobile.
- Content column: 541px wide on desktop (centered), 327px on mobile (24px side gutters). Starts 48px from the top at every width.
- Header: "TODO" is an image, 162.6 × 30.1px on desktop and 108.1 × 20px on mobile. The theme icon is 26 × 26 on desktop and about 20 × 20 on mobile.
- Header to the new-todo input: 48px on desktop, 40px on mobile.

## Cards

- 5px corners.
- Shadow `0 35px 25px`, `rgba(194, 195, 214, 0.5)` in light and `rgba(0, 0, 0, 0.5)` in dark.
- Light: White. Dark: Navy 900 (`#25273d`).

## Text presets

All Josefin Sans Regular, line height 1 (100%), letter spacing -0.25px.

- Preset 1: 18px. Desktop Todo titles and the input.
- Preset 3: 12px. Mobile Todo titles, the mobile input and the mobile footer.
- The footer and "Drag and drop" hint are 14px tall on desktop.

## New-todo input

| | Desktop | Mobile |
| --- | --- | --- |
| Height | 64px | 48px |
| Side padding | 24px | 24px |
| Circle | 24px | 20px |
| Circle to text | 24px | 16px |
| Gap to the list card | 24px | 16px |

- The circle is a 1px ring: Purple 300 (`#c8cbe7`) in light, Purple 800 (`#393a4b`) in dark.
- Placeholder "Create a new todo…" in Gray 600 (`#9495a5`) in both themes.

## Todo row

| | Desktop | Mobile |
| --- | --- | --- |
| Padding (vertical × horizontal) | 24 × 24px | 16 × 20px |
| Check | 24px | 20px |
| Check to text | 24px | 16px |
| ✕ | 17.7px (18px icon) | 11.8px |
| ✕ to the card's right edge | 24px | 20px |

- Dividers are 1px: Purple 300 in light, Purple 800 in dark.
- An Active Todo's check: the same 1px ring as the input's circle. On hover the ring becomes the check gradient (from the interaction frame, `4.png`; not measured in Figma).
- A Completed Todo's check: filled with gradient `colors/gradient/1`, `hsl(192, 100%, 67%)` (top left) to `hsl(280, 87%, 65%)` (bottom right), with the white tick from `icon-check.svg` (11 × 9).
- Completed title: line-through, Gray 300 (`#d1d2da`) in light, Purple 700 (`#4d5067`) in dark.

## Footer

- Desktop: in the list card, 24px side padding, "N items left" left, filters centered (All, Active, Completed, 16px apart), "Clear Completed" right.
- Mobile: "N items left" and "Clear Completed" in the list card at 20px side padding. The filters sit in their own 48px card 16px below it.
- Desktop footer row: 24px from the last divider and from the card's bottom. Mobile: 16px from each.
- Footer text is 14px on desktop and 12px on mobile ("5 items left", "Clear Completed").
- The filters are 14px text at every width, 16px apart, also in the mobile filter card, where they are centered.
- "Drag and drop to reorder list" is centered, 24px below the list card on desktop and 40px below the filter card on mobile.
