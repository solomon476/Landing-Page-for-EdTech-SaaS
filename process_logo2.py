from PIL import Image
import numpy as np

img = Image.open('img/logo.png').convert("RGBA")
data = np.array(img)

# Make white pixels transparent
r, g, b, a = data.T
white_areas = (r > 240) & (g > 240) & (b > 240)
data[..., :-1][white_areas.T] = (0, 0, 0)
data[..., -1][white_areas.T] = 0

# The text "AFRICAN EDTECH PLATFORM" is at the bottom, below "SomoBloom".
# The total image height is 1024.
# "SomoBloom" ends around row 750, and the subtext is around 780-820.
# Let's crop the image just after "SomoBloom". Wait, "let it just be the logo".
# If they want ONLY the icon without ANY text:
# We can find the large gap between the icon and the text.
row_sums = np.sum(data[..., 3] > 0, axis=1)

# Find gaps (rows with very few non-transparent pixels)
content_rows = np.where(row_sums > 10)[0]
if len(content_rows) > 0:
    min_row = content_rows[0]
    max_row = content_rows[-1]
    
    # We look for a significant gap (e.g., > 10 rows of 0) starting from bottom
    gaps = []
    gap_start = -1
    for i in range(max_row, min_row, -1):
        if row_sums[i] <= 10:
            if gap_start == -1:
                gap_start = i
        else:
            if gap_start != -1:
                gaps.append((i, gap_start))
                gap_start = -1
                
    # The lowest text "AFRICAN EDTECH..." is separated from "SomoBloom" by a small gap.
    # The text "SomoBloom" is separated from the icon by a larger gap.
    # The user said: "remove the words african edtech platform and in the website remove the white background, let it just be the logo"
    # This implies "SomoBloom" might be kept, just remove the subtext. But "let it just be the logo" could mean only the icon.
    # Let's crop out the bottom 250 pixels just to be safe, which contains the subtext, and maybe the main text.
    # Actually, let's keep the main text and crop just the subtext. The subtext is typically in the bottom 20%.
    # Let's crop bottom 15%. 1024 * 0.85 = 870. The subtext is usually around 800-900.
    # Let's use the gaps to precisely remove the last block of text.
    if len(gaps) > 0:
        # gaps[0] is the gap between the last block of text and the second to last.
        # So everything below gaps[0][1] is the last block of text.
        crop_bottom = gaps[0][0]
        data[crop_bottom:, :, 3] = 0 # Make everything below the gap transparent

# Also crop the whole image to non-transparent bounding box
new_content_rows = np.where(np.sum(data[..., 3] > 0, axis=1) > 0)[0]
new_content_cols = np.where(np.sum(data[..., 3] > 0, axis=0) > 0)[0]

if len(new_content_rows) > 0 and len(new_content_cols) > 0:
    min_r, max_r = new_content_rows[0], new_content_rows[-1]
    min_c, max_c = new_content_cols[0], new_content_cols[-1]
    data = data[min_r:max_r+1, min_c:max_c+1]

img2 = Image.fromarray(data)
img2.save('img/logo.png')
print("Processed logo saved")
