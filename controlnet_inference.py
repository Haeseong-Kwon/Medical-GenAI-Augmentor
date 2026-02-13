import torch
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler
from controlnet_aux import CannyDetector
import cv2
import numpy as np
from PIL import Image
import os
import random

# 2. MPS Acceleration Setup (for MacBook Pro)
if torch.backends.mps.is_available():
    device = "mps"
    print("ControlNet Inference: Using Apple Metal Performance Shaders (MPS) for acceleration.")
elif torch.cuda.is_available():
    device = "cuda"
    print("ControlNet Inference: Using NVIDIA CUDA for acceleration.")
else:
    device = "cpu"
    print("ControlNet Inference: Using CPU for inference. Consider installing PyTorch with MPS/CUDA support for better performance.")

# Load Canny Edge Detector
canny_detector = CannyDetector()

# Load ControlNet Model
CONTROLNET_MODEL_NAME = "lllyasviel/sd-controlnet-canny"
SD_MODEL_NAME = "runwayml/stable-diffusion-v1-5"

print(f"ControlNet Inference: Loading ControlNet model '{CONTROLNET_MODEL_NAME}'...")
try:
    controlnet = ControlNetModel.from_pretrained(CONTROLNET_MODEL_NAME, torch_dtype=torch.float16 if device == "mps" or device == "cuda" else torch.float32)
    pipe = StableDiffusionControlNetPipeline.from_pretrained(
        SD_MODEL_NAME,
        controlnet=controlnet,
        torch_dtype=torch.float16 if device == "mps" or device == "cuda" else torch.float32
    )
    pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
    pipe.to(device)
    pipe.enable_attention_slicing() # VRAM Optimization
    print("ControlNet Inference: Models loaded and attention slicing enabled.")
except Exception as e:
    print(f"ControlNet Inference: Error loading ControlNet models: {e}")
    print("ControlNet Inference: Please ensure you have authenticated with Hugging Face if you encounter access errors.")
    print("ControlNet Inference: You might need to run: `huggingface-cli login` in your terminal.")
    controlnet = None
    pipe = None

def apply_canny_edge(image: Image.Image, low_threshold: int = 100, high_threshold: int = 200) -> Image.Image:
    """
    Applies Canny Edge detection to a PIL Image and returns the edge map.
    """
    image_np = np.array(image)
    image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    
    edges = cv2.Canny(image_np, low_threshold, high_threshold)
    
    # Convert back to PIL Image
    control_image = Image.fromarray(edges)
    return control_image

def generate_controlnet_image(reference_image_path: str, prompt: str, seed: int = None, num_inference_steps: int = 30) -> (Image.Image, int, str, str):
    """
    Generates an image using the ControlNet pipeline guided by Canny edges from a reference image.
    Returns the generated image, the seed used, the ControlNet model version, and the Stable Diffusion model version.
    """
    if pipe is None or controlnet is None:
        print("ControlNet Inference: Models not loaded. Cannot generate image.")
        return None, None, CONTROLNET_MODEL_NAME, SD_MODEL_NAME

    if seed is None:
        seed = random.randint(0, 1000000)
    generator = torch.Generator(device=device).manual_seed(seed)

    print(f"ControlNet Inference: Generating image for prompt: '{prompt}' with seed: {seed} using reference: {reference_image_path}")

    # Load and process reference image
    reference_image = Image.open(reference_image_path).convert("RGB")
    control_image = apply_canny_edge(reference_image)

    with torch.no_grad():
        image = pipe(
            prompt,
            control_image,
            num_inference_steps=num_inference_steps,
            generator=generator
        ).images[0]
    print("ControlNet Inference: Image generated.")
    return image, seed, CONTROLNET_MODEL_NAME, SD_MODEL_NAME

if __name__ == "__main__":
    # Example usage when run directly
    # You would need an actual reference image for this to work
    # For demonstration, let's create a dummy image if no file exists
    dummy_image_path = "dummy_reference_image.png"
    if not os.path.exists(dummy_image_path):
        dummy_image = Image.new('RGB', (512, 512), color = 'red')
        dummy_image.save(dummy_image_path)
        print(f"Created dummy reference image: {dummy_image_path}")

    example_prompt = "High-quality chest X-ray, clear lung structures, showing pneumonia"
    generated_img, used_seed, controlnet_ver, sd_ver = generate_controlnet_image(dummy_image_path, example_prompt, seed=42)
    if generated_img:
        generated_img.save("generated_controlnet_image.png")
        print(f"Example ControlNet image saved as generated_controlnet_image.png with seed {used_seed}.")
        print(f"ControlNet Model: {controlnet_ver}, SD Model: {sd_ver}")
