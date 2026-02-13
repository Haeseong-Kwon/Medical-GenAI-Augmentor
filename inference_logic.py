import torch
from diffusers import StableDiffusionPipeline
import os
import random
from PIL import Image

# 2. MPS Acceleration Setup (for MacBook Pro)
if torch.backends.mps.is_available():
    device = "mps"
    print("Inference Logic: Using Apple Metal Performance Shaders (MPS) for acceleration.")
elif torch.cuda.is_available():
    device = "cuda"
    print("Inference Logic: Using NVIDIA CUDA for acceleration.")
else:
    device = "cpu"
    print("Inference Logic: Using CPU for inference. Consider installing PyTorch with MPS/CUDA support for better performance.")

# Load a Stable Diffusion model
# Note: For actual medical imaging, a model fine-tuned on medical data would be ideal.
# This example uses a general-purpose Stable Diffusion model.
MODEL_NAME = "runwayml/stable-diffusion-v1-5"
print(f"Inference Logic: Loading Stable Diffusion pipeline '{MODEL_NAME}' to device: {device}...")
try:
    pipe = StableDiffusionPipeline.from_pretrained(MODEL_NAME, torch_dtype=torch.float16 if device == "mps" or device == "cuda" else torch.float32)
    pipe.to(device)
    pipe.enable_attention_slicing() # MPS Optimization
    print("Inference Logic: Model loaded and attention slicing enabled.")
except Exception as e:
    print(f"Inference Logic: Error loading model: {e}")
    print("Inference Logic: Please ensure you have authenticated with Hugging Face if you encounter access errors.")
    print("Inference Logic: You might need to run: `huggingface-cli login` in your terminal.")
    # In a real application, you might want to raise an exception or handle this more gracefully
    pipe = None # Ensure pipe is None if loading fails

def generate_medical_image_with_embeddings(prompt: str, seed: int = None, num_inference_steps: int = 50) -> (Image.Image, int, str):
    """
    Generates an image using the loaded Stable Diffusion pipeline,
    converting the prompt to text embeddings.
    Returns the generated image, the seed used, and the model version.
    """
    if pipe is None:
        print("Inference Logic: Model not loaded. Cannot generate image.")
        return None, None, MODEL_NAME

    if seed is None:
        seed = random.randint(0, 1000000)
    generator = torch.Generator(device=device).manual_seed(seed)

    print(f"Inference Logic: Generating image for prompt: '{prompt}' with seed: {seed}")

    # Convert prompt to text embeddings
    # This simulates using specific medical labels as embeddings
    prompt_embeds = pipe._encode_prompt(
        prompt=prompt,
        device=device,
        num_images_per_prompt=1,
        do_classifier_free_guidance=True,
        negative_prompt=None # Could add negative prompts here
    )

    with torch.no_grad():
        image = pipe(
            prompt_embeds=prompt_embeds[0], # Use the generated embeddings
            num_inference_steps=num_inference_steps,
            generator=generator
        ).images[0]
    print("Inference Logic: Image generated.")
    return image, seed, MODEL_NAME

if __name__ == "__main__":
    # Example usage when run directly
    example_prompt = "High-quality chest X-ray, clear lung structures"
    generated_img, used_seed, model_ver = generate_medical_image_with_embeddings(example_prompt, seed=42)
    if generated_img:
        generated_img.save("generated_image_from_inference_logic.png")
        print(f"Example image saved as generated_image_from_inference_logic.png with seed {used_seed} using model {model_ver}.")
