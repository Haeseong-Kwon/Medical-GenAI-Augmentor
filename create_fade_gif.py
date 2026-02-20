from PIL import Image, ImageOps


def create_crossfade_gif(image_paths, output_path, duration=100, transition_frames=10):
    images = [Image.open(p).convert('RGB') for p in image_paths]
    
    # Target size: 85% width in README usually looks good around 1080p
    target_width = 1200
    resized_images = []
    for img in images:
        w_percent = (target_width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        resized_images.append(img.resize((target_width, h_size), Image.Resampling.LANCZOS))
    
    final_frames = []
    
    for i in range(len(resized_images)):
        img1 = resized_images[i]
        img2 = resized_images[(i + 1) % len(resized_images)]
        
        # Add main state frame
        for _ in range(15): # Hold each state for 1.5s (15 * 100ms)
            final_frames.append(img1)
            
        # Create crossfade transition
        for j in range(transition_frames):
            alpha = j / transition_frames
            blended = Image.blend(img1, img2, alpha)
            final_frames.append(blended)
            
    final_frames[0].save(
        output_path,
        save_all=True,
        append_images=final_frames[1:],
        loop=0,
        duration=duration,
        optimize=True
    )
    print(f"GIF saved to {output_path}")

paths = [
    "/Users/haeseong/.gemini/antigravity/brain/8801b381-6683-43d5-9365-c7be8a67499b/state0_prompt_1771578934349.png",
    "/Users/haeseong/.gemini/antigravity/brain/8801b381-6683-43d5-9365-c7be8a67499b/state25_noise_1771578951820.png",
    "/Users/haeseong/.gemini/antigravity/brain/8801b381-6683-43d5-9365-c7be8a67499b/state25_noise_1771579002599.png",
    "/Users/haeseong/.gemini/antigravity/brain/8801b381-6683-43d5-9365-c7be8a67499b/state100_final_1771579044367.png",
    "/Users/haeseong/.gemini/antigravity/brain/8801b381-6683-43d5-9365-c7be8a67499b/state_impact_1771579073452.png"
]

create_crossfade_gif(paths, "/Users/haeseong/Desktop/Developing/medical-genai/medical_genai_augmentor_demo.gif")
