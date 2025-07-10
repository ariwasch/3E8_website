from PIL import Image
import sys

def make_square_with_centered_padding(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size

    if width == height:
        img.save(output_path)
        print(f"Image is already square. Saved as {output_path}")
        return

    new_size = max(width, height)
    new_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
    left = (new_size - width) // 2
    new_img.paste(img, (left, 0))
    new_img.save(output_path)
    print(f"Saved square image as {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python make_square_leftpad.py input.png output.png")
    else:
        make_square_with_centered_padding(sys.argv[1], sys.argv[2])