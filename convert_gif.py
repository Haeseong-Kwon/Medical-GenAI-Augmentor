from PIL import Image, ImageSequence
import os

def convert_webp_to_gif(webp_path, gif_path):
    print(f"Converting {webp_path} to {gif_path}...")
    try:
        img = Image.open(webp_path)
        frames = []
        for frame in ImageSequence.Iterator(img):
            frames.append(frame.copy())
        
        if not frames:
            print("No frames found!")
            return False
        
        print(f"Found {len(frames)} frames.")
        frames[0].save(
            gif_path,
            save_all=True,
            append_images=frames[1:],
            loop=0,
            duration=img.info.get('duration', 100),
            optimize=False
        )
        print("Done!")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

webp_file = "/Users/haeseong/.gemini/antigravity/brain/8801b381-6683-43d5-9365-c7be8a67499b/ui_exploration_1771577654274.webp"
gif_file = "/Users/haeseong/Desktop/Developing/medical-genai/medical_genai_augmentor_demo.gif"

convert_webp_to_gif(webp_file, gif_file)
