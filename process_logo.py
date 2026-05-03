from PIL import Image
import numpy as np

# Load image
img = Image.open('img/logo.png').convert("RGBA")
data = np.array(img)

# Make white pixels transparent (R>240, G>240, B>240)
r, g, b, a = data.T
white_areas = (r > 240) & (g > 240) & (b > 240)
data[..., :-1][white_areas.T] = (0, 0, 0)
data[..., -1][white_areas.T] = 0

# The image is 1024x1024.
# Let's see the non-transparent pixels to find where the text is.
non_empty_rows = np.where(np.any(data[..., 3] > 0, axis=1))[0]
if len(non_empty_rows) > 0:
    min_row = non_empty_rows[0]
    max_row = non_empty_rows[-1]
    print(f"Content from row {min_row} to {max_row}")

    # Calculate row sums to find gaps between lines of text
    row_sums = np.sum(data[..., 3] > 0, axis=1)
    
    # Print the last few blocks of content
    for i in range(max_row - 200, max_row + 1):
        if i % 20 == 0:
            print(f"Row {i} pixels: {row_sums[i]}")

img2 = Image.fromarray(data)
img2.save('img/logo_transparent.png')
print("Saved transparent version")
