# Order landing typography refinement

## Goal

Make the left content column of `/order` feel smoother and visually consistent with
the site's Satoshi typography. Reduce unnecessary boldness without weakening the
page hierarchy.

## Scope

- Change only the left content column of the landing view.
- Keep the right decorative order card unchanged.
- Keep all text, translations, interactions, and catalog behavior unchanged.

## Visual treatment

- Keep the section label at medium weight (`500`).
- Reduce the main heading from extra-bold to bold (`700`).
- Keep the description at regular weight (`400`) with its existing muted color.
- Keep feature labels at medium weight (`500`).
- Reduce the primary CTA label from bold to semibold (`600`).
- Slightly soften feature-card and CTA radius, shadow, and spacing only where it
  improves the typography-led balance; preserve the current orange/green palette.

## Responsive behavior

The existing centered mobile layout and left-aligned desktop layout remain intact.
No breakpoint or content-flow changes are introduced.

## Verification

- Run lint for the changed page.
- Run the production build.
- Visually check `/order` at desktop and mobile widths.
- Confirm the CTA still opens the catalog and language switching is unaffected.
