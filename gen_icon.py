#!/usr/bin/env python3
"""Generate UAE waving ribbon icon for WeThink app."""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os

SIZE = 1024
NAVY = (5, 8, 21, 255)

def make_icon(with_bg=True):
    # Create canvas
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if with_bg:
        # Dark navy circle background
        circle_mask = Image.new('L', (SIZE, SIZE), 0)
        cmask_draw = ImageDraw.Draw(circle_mask)
        cmask_draw.ellipse([0, 0, SIZE, SIZE], fill=255)
        bg = Image.new('RGBA', (SIZE, SIZE), NAVY[:3] + (255,))
        img.paste(bg, mask=circle_mask)

    # --- Wi lettermark from logo.png ---
    logo_path = os.path.join(os.path.dirname(__file__), 'assets', 'images', 'logo.png')
    logo = Image.open(logo_path).convert('RGBA')
    lw, lh = logo.size  # ~630x630

    # Crop rows 128-370, cols 115-552  (the Wi mark)
    crop_box = (115, 128, 552, 370)
    wi = logo.crop(crop_box)
    wi_w, wi_h = wi.size  # ~437 x 242

    # Scale to ~65% of canvas width
    target_w = int(SIZE * 0.65)
    scale_factor = target_w / wi_w
    target_h = int(wi_h * scale_factor)
    wi = wi.resize((target_w, target_h), Image.LANCZOS)

    # Center on canvas
    paste_x = (SIZE - target_w) // 2
    paste_y = (SIZE - target_h) // 2
    img.paste(wi, (paste_x, paste_y), wi)

    # --- UAE Waving Ribbon ---
    # Ribbon goes from lower-left to upper-right, curving like a wave/flame
    # Position: top-right area, about 35% of icon width wide
    # UAE colors: red (hoist left), then green, white, black stripes

    ribbon_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    rdraw = ImageDraw.Draw(ribbon_layer)

    # Define the ribbon as a diagonal band going upper-right
    # Center line of ribbon: from (400, 800) curving up to (900, 100)
    # We parameterize with bezier curves for the wave effect

    def bezier(p0, p1, p2, p3, t):
        """Cubic bezier curve."""
        return (
            (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0],
            (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1],
        )

    def bezier_deriv(p0, p1, p2, p3, t):
        """Derivative of cubic bezier."""
        return (
            3*(1-t)**2*(p1[0]-p0[0]) + 6*(1-t)*t*(p2[0]-p1[0]) + 3*t**2*(p3[0]-p2[0]),
            3*(1-t)**2*(p1[1]-p0[1]) + 6*(1-t)*t*(p2[1]-p1[1]) + 3*t**2*(p3[1]-p2[1]),
        )

    # Main spine of ribbon: S-curve / flame shape, positioned top-right
    # The ribbon is a diagonal waving band in the top-right corner
    # overlapping the Wi mark slightly, with a nice S-wave curve
    # Spine goes from bottom center-right up to upper-right corner
    sp0 = (620, 750)    # lower anchor
    sp1 = (820, 500)    # control point 1 - bows left (creating S)
    sp2 = (680, 220)    # control point 2 - bows right
    sp3 = (980, 30)     # upper-right terminus

    N = 200
    ts = np.linspace(0, 1, N)

    # Sample spine points and normals
    spine = []
    normals = []
    for t in ts:
        pt = bezier(sp0, sp1, sp2, sp3, t)
        d = bezier_deriv(sp0, sp1, sp2, sp3, t)
        mag = (d[0]**2 + d[1]**2) ** 0.5
        if mag < 1e-6:
            mag = 1
        # Normal (perpendicular to tangent)
        nx = -d[1] / mag
        ny = d[0] / mag
        spine.append(pt)
        normals.append((nx, ny))

    # Ribbon total half-width - about 35% of icon width / 2 = ~180px half
    ribbon_half = 90  # total width ~180px

    # UAE flag stripes (proportional widths): red=25%, green=25%, white=25%, black=25%
    # Actually UAE: red hoist band (1/4 width), then equal green/white/black
    # red=1/4, green=1/4, white=1/4, black=1/4 of total ribbon width
    stripe_colors = [
        (206, 17, 38, 218),    # red (hoist) - leftmost when going lower-left to upper-right
        (0, 115, 47, 218),     # green
        (255, 255, 255, 218),  # white
        (0, 0, 0, 218),        # black
    ]
    stripe_fractions = [0.25, 0.25, 0.25, 0.25]

    # Build offset values for each stripe boundary
    # The hoist (red) is on the "left" side as we go up-right
    # left side = negative normal direction
    offsets = []
    acc = -ribbon_half
    offsets.append(acc)
    for frac in stripe_fractions:
        acc += frac * 2 * ribbon_half
        offsets.append(acc)

    def offset_curve(spine, normals, d):
        return [(spine[i][0] + normals[i][0]*d, spine[i][1] + normals[i][1]*d) for i in range(len(spine))]

    # Draw each stripe as a filled polygon
    for si, color in enumerate(stripe_colors):
        d_near = offsets[si]
        d_far = offsets[si + 1]
        near_pts = offset_curve(spine, normals, d_near)
        far_pts = offset_curve(spine, normals, d_far)

        # Build polygon: near edge forward + far edge backward
        poly = near_pts + list(reversed(far_pts))
        poly_int = [(int(x), int(y)) for x, y in poly]
        rdraw.polygon(poly_int, fill=color)

    # Add a subtle highlight on the ribbon edge (wave sheen)
    # Draw a thin bright line along the top edge
    highlight_pts = offset_curve(spine, normals, -ribbon_half)
    hi_int = [(int(x), int(y)) for x, y in highlight_pts]
    for i in range(len(hi_int)-1):
        rdraw.line([hi_int[i], hi_int[i+1]], fill=(255, 255, 255, 60), width=3)

    # Soft blur for anti-aliasing the ribbon edges
    ribbon_layer = ribbon_layer.filter(ImageFilter.GaussianBlur(1.5))

    # If with_bg, clip ribbon to circle
    if with_bg:
        circle_mask2 = Image.new('L', (SIZE, SIZE), 0)
        cm2 = ImageDraw.Draw(circle_mask2)
        cm2.ellipse([0, 0, SIZE, SIZE], fill=255)
        # Apply circle mask to ribbon alpha
        ribbon_arr = np.array(ribbon_layer)
        mask_arr = np.array(circle_mask2)
        ribbon_arr[:, :, 3] = (ribbon_arr[:, :, 3].astype(np.float32) * mask_arr / 255).astype(np.uint8)
        ribbon_layer = Image.fromarray(ribbon_arr)

    img = Image.alpha_composite(img, ribbon_layer)
    return img

# Generate icon with navy background
icon_img = make_icon(with_bg=True)
icon_path = os.path.join(os.path.dirname(__file__), 'assets', 'images', 'icon.png')
icon_img.save(icon_path, 'PNG')
print(f"Saved icon.png ({icon_img.size})")

# Generate adaptive icon (transparent bg, foreground only)
adaptive_img = make_icon(with_bg=False)
adaptive_path = os.path.join(os.path.dirname(__file__), 'assets', 'images', 'adaptive-icon.png')
adaptive_img.save(adaptive_path, 'PNG')
print(f"Saved adaptive-icon.png ({adaptive_img.size})")

print("Done!")
