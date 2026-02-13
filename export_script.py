import supabase
import os
import zipfile
import json
import io
import requests
import datetime

# Supabase Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://phkpdwzhduwtvktapkhr.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s")

if SUPABASE_URL == "https://phkpdwzhduwtvktapkhr.supabase.co" or SUPABASE_KEY == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s":
    print("WARNING: Supabase credentials are not set. Please update SUPABASE_URL and SUPABASE_KEY in export_script.py or your environment variables.")
    # Exit or handle this case as appropriate if Supabase is critical for execution

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

async def export_synthetic_data_to_zip(zip_filename: str = "synthetic_medical_data.zip", only_validated: bool = False):
    """
    Queries data from the 'synthetic_samples' table, downloads images,
    and packages them with their metadata into a ZIP file.
    """
    print(f"Starting data export to {zip_filename}...")

    query = supabase_client.table("synthetic_samples").select("*")
    if only_validated:
        # Assuming a boolean column 'is_validated' in your synthetic_samples table
        query = query.eq("is_validated", True)
        print("Exporting only validated samples.")
    else:
        print("Exporting all samples.")

    try:
        response = await query.execute()
        samples = response.data
        
        if not samples:
            print("No samples found to export.")
            return

        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zf:
            for i, sample in enumerate(samples):
                image_url = sample.get("image_url")
                if not image_url:
                    print(f"Skipping sample {sample.get('id', i)}: No image_url found.")
                    continue

                try:
                    # Download image
                    img_response = requests.get(image_url)
                    img_response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
                    img_bytes = img_response.content

                    # Determine image file extension from URL or content type if possible
                    # For simplicity, assume PNG as previously used for generation
                    img_filename = f"image_{sample.get('id', i)}.png"
                    zf.writestr(f"images/{img_filename}", img_bytes)

                    # Prepare metadata
                    metadata = {
                        "id": sample.get("id"),
                        "prompt": sample.get("prompt"),
                        "seed": sample.get("seed"),
                        "model_version_sd": sample.get("model_version_sd"),
                        "model_version_controlnet": sample.get("model_version_controlnet"),
                        "fid_score": sample.get("fid_score"),
                        "generated_at": sample.get("generated_at"),
                        # Add other relevant metadata fields as needed
                    }
                    metadata_filename = f"metadata/metadata_{sample.get('id', i)}.json"
                    zf.writestr(metadata_filename, json.dumps(metadata, indent=2))
                    print(f"Added {img_filename} and metadata to zip.")

                except requests.exceptions.RequestException as e:
                    print(f"Error downloading image from {image_url}: {e}")
                except Exception as e:
                    print(f"An error occurred processing sample {sample.get('id', i)}: {e}")
        
        print(f"Export complete. Data saved to {zip_filename}")

    except Exception as e:
        print(f"An error occurred during Supabase query or ZIP creation: {e}")

async def main():
    # Example usage: export all data
    await export_synthetic_data_to_zip(zip_filename="all_medical_samples.zip", only_validated=False)

    # Example usage: export only validated data (assuming 'is_validated' column exists and is true)
    # await export_synthetic_data_to_zip(zip_filename="validated_medical_samples.zip", only_validated=True)

if __name__ == "__main__":
    asyncio.run(main())
