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
        print(f"Found {len(frames)} frames. Trying to speed it up by skipping frames.")
        
        # Keep every 3rd frame to speed up (3x speed)
        fast_frames = frames[::3]
        
        fast_frames[0].save(
            gif_path,
            save_all=True,
            append_images=fast_frames[1:],
            loop=0,
            duration=30, # 30ms per frame to make it play fast
            optimize=True
        )
        print("Done!")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

webp_file = "/Users/haeseong/.gemini/antigravity/brain/8ecf5316-5507-4e0b-9501-365467639ffe/medical_augmentor_demo_v2_1771846388703.webp"
gif_file = "/Users/haeseong/Desktop/Developing/medical-genai/medical_augmentor_demo.gif"

convert_webp_to_gif(webp_file, gif_file)
