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
        print(f"Found {len(frames)} frames. Applying variable frame pacing to emphasize Impact Analysis.")
        
        # Keep every 3rd frame to reduce size
        fast_frames = frames[::3]
        
        # Create a duration list to make the start fast and the end slow
        durations = []
        slow_start_idx = int(len(fast_frames) * 0.6) # The first 60% includes setup and generation
        very_slow_idx = int(len(fast_frames) * 0.8) # 60% to 80% is viewing galleries
        
        for i in range(len(fast_frames)):
            if i < slow_start_idx:
                durations.append(40) # 40ms for fast forwarding
            elif i < very_slow_idx:
                durations.append(100) # 100ms for somewhat slow (Gallery)
            else:
                durations.append(350) # 350ms for very slow (Impact Analysis, to emphasize strongly)
        
        fast_frames[0].save(
            gif_path,
            save_all=True,
            append_images=fast_frames[1:],
            loop=0,
            duration=durations, 
            optimize=True
        )
        print("Done!")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

webp_file = "/Users/haeseong/.gemini/antigravity/brain/8ecf5316-5507-4e0b-9501-365467639ffe/medical_augmentor_demo_v3_1771904812094.webp"
gif_file = "/Users/haeseong/Desktop/Developing/medical-genai/medical_augmentor_demo.gif"

convert_webp_to_gif(webp_file, gif_file)
