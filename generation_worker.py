import torch
from diffusers import StableDiffusionPipeline
import supabase
import os
from PIL import Image
import io
import datetime

# 1. Supabase Configuration (UPDATE THESE WITH YOUR ACTUAL CREDENTIALS)
# You can find these in your Supabase project settings -> API
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://phkpdwzhduwtvktapkhr.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s")

if SUPABASE_URL == "https://phkpdwzhduwtvktapkhr.supabase.co" or SUPABASE_KEY == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s":
    print("WARNING: Supabase credentials are not set. Please update SUPABASE_URL and SUPABASE_KEY in generation_worker.py or your environment variables.")
    # Exit or handle this case as appropriate if Supabase is critical for execution
    # For now, we'll allow it to run but Supabase functions will fail.

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. MPS Acceleration Setup (for MacBook Pro)
if torch.backends.mps.is_available():
    device = "mps"
    print("Using Apple Metal Performance Shaders (MPS) for acceleration.")
elif torch.cuda.is_available():
    device = "cuda"
    print("Using NVIDIA CUDA for acceleration.")
else:
    device = "cpu"
    print("Using CPU for inference. Consider installing PyTorch with MPS/CUDA support for better performance.")

# 3. Synthetic Image Generator Shell: Load a Stable Diffusion model
# Note: For actual medical imaging, a model fine-tuned on medical data would be ideal.
# This example uses a general-purpose Stable Diffusion model.
print(f"Loading Stable Diffusion pipeline to device: {device}...")
try:
    pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16 if device == "mps" or device == "cuda" else torch.float32)
    pipe.to(device)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Please ensure you have authenticated with Hugging Face if you encounter access errors.")
    print("You might need to run: `huggingface-cli login` in your terminal.")
    exit()

# 4. Medical Prompt Engineering
def create_medical_prompt(base_prompt: str) -> str:
    """
    Augments a base medical prompt with additional descriptive keywords.
    For more advanced use cases, this could involve:
    - NLP models to parse and expand medical terms
    - Dynamic inclusion of findings (e.g., "pneumonia", "fracture")
    - Negative prompting for clearer images
    """
    medical_augmentations = [
        ", high resolution",
        ", medically accurate",
        ", detailed view",
        ", diagnostic quality",
        ", clear visibility of anatomical structures"
    ]
    augmented_prompt = base_prompt + medical_augmentations[0] # Simple augmentation for now
    print(f"Original prompt: '{base_prompt}'")
    print(f"Augmented prompt: '{augmented_prompt}'")
    return augmented_prompt

def generate_image(prompt: str, num_inference_steps: int = 50) -> Image.Image:
    """Generates an image using the loaded Stable Diffusion pipeline."""
    print(f"Generating image for prompt: '{prompt}'")
    with torch.no_grad():
        image = pipe(prompt, num_inference_steps=num_inference_steps).images[0]
    print("Image generated.")
    return image

# 5. Database Sync
async def upload_to_supabase_storage_and_db(image: Image.Image, prompt: str):
    """
    Uploads the image to Supabase Storage and records its path in the synthetic_samples table.
    """
    if SUPABASE_URL == "https://phkpdwzhduwtvktapkhr.supabase.co" or SUPABASE_KEY == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s":
        print("Supabase credentials not configured. Skipping upload and database sync.")
        return

    # Convert PIL Image to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format="PNG")
    img_byte_arr = img_byte_arr.getvalue()

    # Define storage path
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"synthetic_xray_{timestamp}.png"
    bucket_name = "medical_images" # Ensure this bucket exists in your Supabase Storage
    storage_path = f"public/{file_name}" # Use 'public' for publicly accessible images

    print(f"Uploading image to Supabase Storage bucket '{bucket_name}' at path '{storage_path}'...")
    try:
        response = await supabase_client.storage.from_(bucket_name).upload(
            file=img_byte_arr,
            path=storage_path,
            file_options={"content-type": "image/png"}
        )
        print("Upload response:", response) # Debugging line
        if response.status_code == 200 or response.status_code == 201: # 200 for existing, 201 for new
            print(f"Image uploaded successfully to {storage_path}")
            # Construct the public URL
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{storage_path}"
            print(f"Public URL: {public_url}")

            # Insert into synthetic_samples table
            print(f"Inserting record into 'synthetic_samples' table...")
            data, count = await supabase_client.table("synthetic_samples").insert({
                "prompt": prompt,
                "image_url": public_url,
                "generated_at": datetime.datetime.utcnow().isoformat() + "Z"
            }).execute()
            print("Database insert response:", data)
            if data and not data[1]: # Check if data is returned and is not empty
                print("Record inserted successfully into 'synthetic_samples'.")
            else:
                print("Failed to insert record into 'synthetic_samples'. Data:", data)
                if count: print("Count:", count)

        else:
            print(f"Failed to upload image. Status code: {response.status_code}, Error: {response.json()}")
    except Exception as e:
        print(f"An error occurred during Supabase upload or database insert: {e}")

async def main():
    base_medical_prompt = "Chest X-ray, clear lung structures, no abnormalities"
    
    # Prompt Engineering
    processed_prompt = create_medical_prompt(base_medical_prompt)

    # Image Generation
    generated_image = generate_image(processed_prompt)

    # Save image locally for verification (optional)
    # generated_image.save("generated_medical_image.png")
    # print("Image saved locally as generated_medical_image.png")

    # Supabase Sync
    await upload_to_supabase_storage_and_db(generated_image, processed_prompt)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
