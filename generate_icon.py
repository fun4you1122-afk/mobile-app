#!/usr/bin/env python3
"""Generate UAE flag waving ribbon icon for WeThink app."""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import sys

SIZE = 1024

def make_bezier_points(p0, p1, p2, p3, n=200):
    """Cubic bezier curve."""
    t = np.linspace(0, 1, n)
    t = t[:, None]
    p0, p1, p2, p3 = [np.array(p, dtype=float) for p in [p0, p1, p2, p3]]
    pts = ((1-t)**3 * p0 +
           3*(1-t)**2 * t * p1 +
           3*(1-t)   * t**2 * p2 +
                       t**3 * p3)
    return pts

def offset_curve(pts, width, direction='both'):
    """Offset a curve by given width along normal."""
    # Compute tangents
    tangents = np.diff(pts, axis=0)
    tangents = np.vstack([tangents, tangents[-1]])
    norms = np.linalg.norm(tangents, axis=1, keepdims=True)
    norms = np.where(norms < 1e-8, 1, norms)
    tangents = tangents / norms
    # Normal = rotate tangent 90 degrees
    normals = np.stack([-tangents[:, 1], tangents[:, 0]], axis=1)

    left  = pts + normals * width
    right = pts - normals * width
    return left, right

def band_polygon(left_top, right_top, left_bot, right_bot):
    """Build polygon from two offset curves."""
    top_pts = list(zip(left_top[:, 0].tolist(), left_top[:, 1].tolist()))
    bot_pts = list(zip(right_bot[:, 0].tolist(), right_bot[:, 1].tolist()))
    bot_pts.reverse()
    # left side: right_top to right_bot
    right_side = list(zip(right_top[:, 0].tolist(), right_top[:, 1].tolist()))
    right_side_rev = list(zip(left_bot[:, 0].tolist(), left_bot[:, 1].tolist()))
    right_side_rev.reverse()

    poly = top_pts + right_side_rev + bot_pts + [(right_top[0, 0], right_top[0, 1])]
    return poly

def build_ribbon_band(spine_pts, inner_offset, outer_offset):
    """Build a band polygon between two offsets from spine."""
    tangents = np.diff(spine_pts, axis=0)
    tangents = np.vstack([tangents, tangents[-1]])
    norms = np.linalg.norm(tangents, axis=1, keepdims=True)
    norms = np.where(norms < 1e-8, 1, norms)
    tangents = tangents / norms
    normals = np.stack([-tangents[:, 1], tangents[:, 0]], axis=1)

    inner = spine_pts + normals * inner_offset
    outer = spine_pts + normals * outer_offset

    # polygon: inner forward, then outer reversed
    inner_list = [(p[0], p[1]) for p in inner]
    outer_list = [(p[0], p[1]) for p in outer]
    outer_list.reverse()
    return inner_list + outer_list

def draw_icon(with_bg=True):
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    if with_bg:
        # Dark navy circle background
        draw.ellipse([0, 0, SIZE-1, SIZE-1], fill=(5, 8, 21, 255))

    # --- Load and composite the Wi lettermark from logo.png ---
    logo = Image.open('/home/user/mobile-app/assets/images/logo.png').convert('RGBA')
    # Crop rows 128-370, cols 115-552 (the Wi mark)
    crop = logo.crop((115, 128, 552, 370))  # (left, top, right, bottom)
    crop_w, crop_h = crop.size  # 437 x 242

    # Scale to ~65% of canvas width
    target_w = int(SIZE * 0.65)
    scale = target_w / crop_w
    target_h = int(crop_h * scale)
    crop_scaled = crop.resize((target_w, target_h), Image.LANCZOS)

    # Center it - shifted left to give room for ribbon on right
    cx = (SIZE - target_w) // 2 - 60
    cy = (SIZE - target_h) // 2 + 30  # slight downward offset
    canvas.paste(crop_scaled, (cx, cy), crop_scaled)

    # --- UAE Flag Waving Ribbon ---
    # The ribbon goes from lower-left to upper-right in a waving S-curve
    # Spine of ribbon: S-curve using cubic bezier
    # Start at lower-left area, end at upper-right

    # The ribbon is positioned at top-right, overlapping Wi mark slightly
    # Spine goes from lower-center area to upper-right, S-wave curve

    spine = make_bezier_points(
        (560, 900),   # start: lower-right area
        (800, 600),   # control 1 - pulls right
        (580, 250),   # control 2 - pulls left for S-curve wave
        (1010, 10),   # end: upper-right corner
        n=300
    )

    # Total ribbon width ~35% of icon (narrower to not overwhelm)
    total_half = 110  # half ribbon width = 110px → 220px total

    # Bands from center outward (toward the left normal):
    # We want: red on left edge (hoist), green, white, black from left to right
    # Normal direction: we'll offset positively for "right of travel" side

    # Let's define:
    # offset positions along normal (positive = right of direction of travel)
    # Band edges: -180(left edge=red), -90, 0(center), +90, +180(right=black)
    # Going from left to right: red [-180 to -90], green [-90 to 0], white [0 to 90], black [90 to 180]

    band_edges = [-total_half, -total_half//2, 0, total_half//2, total_half]
    band_colors = [
        (205, 0, 0, 217),      # Red (UAE hoist)
        (0, 115, 47, 217),     # Green
        (255, 255, 255, 217),  # White
        (0, 0, 0, 217),        # Black
    ]

    # Compute normals for the spine
    tangents = np.diff(spine, axis=0)
    tangents = np.vstack([tangents, tangents[-1]])
    norms = np.linalg.norm(tangents, axis=1, keepdims=True)
    norms = np.where(norms < 1e-8, 1, norms)
    tangents = tangents / norms
    normals = np.stack([-tangents[:, 1], tangents[:, 0]], axis=1)

    # Draw bands from back to front
    ribbon_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ribbon_draw = ImageDraw.Draw(ribbon_layer)

    for i, color in enumerate(band_colors):
        inner_off = band_edges[i]
        outer_off = band_edges[i + 1]

        inner_pts = spine + normals * inner_off
        outer_pts = spine + normals * outer_off

        inner_list = [(float(p[0]), float(p[1])) for p in inner_pts]
        outer_list = [(float(p[0]), float(p[1])) for p in outer_pts]
        outer_list.reverse()

        poly = inner_list + outer_list
        ribbon_draw.polygon(poly, fill=color)

    # Add a subtle shadow/glow under the ribbon
    shadow_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)

    # Draw shadow as a wider black ribbon with blur
    inner_pts = spine + normals * (-total_half - 10)
    outer_pts = spine + normals * (total_half + 10)
    inner_list = [(float(p[0]), float(p[1])) for p in inner_pts]
    outer_list = [(float(p[0]), float(p[1])) for p in outer_pts]
    outer_list.reverse()
    shadow_draw.polygon(inner_list + outer_list, fill=(0, 0, 0, 100))
    shadow_blurred = shadow_layer.filter(ImageFilter.GaussianBlur(radius=20))

    # Composite: shadow first, then ribbon
    canvas = Image.alpha_composite(canvas, shadow_blurred)
    canvas = Image.alpha_composite(canvas, ribbon_layer)

    # Add highlight/sheen on ribbon (top half of ribbon is lighter)
    highlight_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight_layer)

    # Highlight on upper portion of ribbon (inner half)
    sheen_inner = spine + normals * (-total_half)
    sheen_outer = spine + normals * (-20)  # middle-ish
    sheen_inner_list = [(float(p[0]), float(p[1])) for p in sheen_inner]
    sheen_outer_list = [(float(p[0]), float(p[1])) for p in sheen_outer]
    sheen_outer_list.reverse()
    highlight_draw.polygon(sheen_inner_list + sheen_outer_list, fill=(255, 255, 255, 35))
    highlight_blurred = highlight_layer.filter(ImageFilter.GaussianBlur(radius=8))
    canvas = Image.alpha_composite(canvas, highlight_blurred)

    return canvas


# Generate icon with background
icon = draw_icon(with_bg=True)
icon.save('/home/user/mobile-app/assets/images/icon.png')
print(f"Saved icon.png ({icon.size})")

# Generate adaptive icon (transparent bg, foreground only)
adaptive = draw_icon(with_bg=False)
adaptive.save('/home/user/mobile-app/assets/images/adaptive-icon.png')
print(f"Saved adaptive-icon.png ({adaptive.size})")

print("Done!")
