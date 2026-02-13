import supabase
import os
import datetime
import asyncio
import random
import numpy as np # For statistical simulation
from clean_fid.fid_score import calculate_fid_given_paths # For average FID
import tempfile
import shutil
from PIL import Image

# Assume this is imported from inference_logic or controlnet_inference
# For demonstration purposes, we'll use a dummy image generation function
# In a real scenario, you would import generate_medical_image_with_embeddings
# or generate_controlnet_image from the respective modules.
def dummy_image_generator(prompt: str, seed: int = None, size=(512, 512)) -> Image.Image:
    """A dummy function to simulate image generation."""
    if seed is None:
        seed = random.randint(0, 1000000)
    random.seed(seed)
    # Generate a random colored image as a placeholder
    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    return Image.new('RGB', size, color=color)

# Supabase Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://phkpdwzhduwtvktapkhr.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s")

if SUPABASE_URL == "https://phkpdwzhduwtvktapkhr.supabase.co" or SUPABASE_KEY == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoa3Bkd3poZHV3dHZrdGFwa2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3MTgyNSwiZXhwIjoyMDg2NTQ3ODI1fQ.uKV98CsJtyCoe3AEAS9m9ms4JKGbCFrpNoynf7FUr8s":
    print("WARNING: Supabase credentials are not set. Please update SUPABASE_URL and SUPABASE_KEY in eval_master.py or your environment variables.")

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# 1. Performance Gains Simulator
def simulate_performance_gain(generated_data_quantity: int, average_fid: float) -> float:
    """
    Simulates the expected performance gain in a typical medical image classification model.
    This is a conceptual statistical model. Higher quantity and lower FID are assumed to yield higher gains.
    """
    # Baseline assumption: some initial accuracy without augmentation
    baseline_accuracy = 0.80 # 80% accuracy

    # Simple heuristic model:
    # - More data generally helps, but with diminishing returns (logarithmic)
    # - Better quality (lower FID) also helps
    # - Scale factors are arbitrary for simulation
    
    # Adjust quantity factor (e.g., log scale)
    quantity_factor = np.log1p(generated_data_quantity / 100.0) # normalize by 100 samples
    
    # Adjust quality factor (inverse of FID, clamped to avoid division by zero or huge numbers)
    # Assuming FID range of ~0 to 200+, lower is better. Max realistic FID could be high.
    # We want inverse, so 1 / (FID + epsilon)
    # Let's cap FID effect, maybe lower FID means closer to 1.0 quality factor
    quality_factor = max(0.01, 1.0 / (average_fid + 1e-6)) * 10 # Scale up effect

    # Combine factors, perhaps linearly or with some interaction
    # The gain is added to a theoretical maximum or scales towards it
    # Let's say max possible gain is 0.15 (15%) over baseline
    max_possible_gain = 0.15

    # A simple combined model (conceptual)
    # The actual functional form would be derived from empirical studies
    simulated_gain = max_possible_gain * (quantity_factor * quality_factor / (quantity_factor * quality_factor + 10)) # Sigmoid-like saturation
    
    print(f"Simulated Performance Gain: {simulated_gain:.4f} (over baseline {baseline_accuracy})")
    return simulated_gain

# Function to calculate average FID for a set of generated images (assuming we have their paths)
async def calculate_average_fid_for_generated_data(sample_ids: list, reference_path: str) -> float:
    """
    Calculates the average FID for a list of generated sample IDs against a reference dataset.
    This requires downloading images if not locally available.
    """
    generated_image_paths = []
    
    with tempfile.TemporaryDirectory() as gen_dir:
        for sample_id in sample_ids:
            # In a real scenario, you would fetch image_url from Supabase using sample_id
            # For this simulation, we'll generate a dummy image
            dummy_img = dummy_image_generator(f"dummy prompt for {sample_id}")
            img_path = os.path.join(gen_dir, f"generated_{sample_id}.png")
            dummy_img.save(img_path)
            generated_image_paths.append(img_path)

        if not generated_image_paths:
            return 0.0 # No generated images

        # Calculate FID - currently uses CPU, should be configurable or handle GPU
        # clean-fid expects paths to directories, so we use the temp directory
        print(f"Calculating FID between {gen_dir} and {reference_path}...")
        fid_score = calculate_fid_given_paths([gen_dir, reference_path], batch_size=1, device="cpu", dims=2048)
        return fid_score

# 2. Technical Briefing Generator
def generate_technical_briefing(strategy: str = "Diffusion + ControlNet", benefits: list = None) -> str:
    """
    Generates a technical briefing outlining the benefits of the chosen strategy
    for medical data augmentation.
    """
    if benefits is None:
        benefits = [
            "Enhanced structural consistency in synthetic images via ControlNet, preserving anatomical integrity.",
            "Generation of diverse pathological variations through Diffusion models, crucial for rare disease detection.",
            "Mitigation of patient data privacy concerns by generating synthetic datasets.",
            "Reduction of data imbalance for machine learning model training, leading to improved generalization.",
            "Acceleration of medical AI research and development by providing readily available, high-quality synthetic data."
        ]

    briefing = f"""
## Technical Briefing: Leveraging {strategy} for Advanced Medical Data Augmentation

This report outlines the significant advantages of employing a {strategy} approach for augmenting medical image datasets, a critical factor in advancing AI capabilities in healthcare.

### Strategy Overview
Our methodology integrates state-of-the-art Diffusion models with ControlNet conditioning. Diffusion models excel at generating high-fidelity, diverse images from noise, guided by text prompts. ControlNet, a neural network architecture, provides fine-grained control over the image generation process by incorporating additional input conditions, such as edge maps or segmentation masks.

### Key Advantages for Medical AI
The combined {strategy} offers unparalleled benefits for medical imaging:

1.  **Structural Integrity**: {benefits[0]} This ensures that while new features (e.g., disease pathologies) are introduced, the fundamental anatomical context remains medically plausible.
2.  **Pathological Diversity**: {benefits[1]} This is particularly vital in medical imaging where certain conditions are rare, and real-world data scarcity can hinder model training. Synthetic variations can dramatically improve a model's ability to recognize these conditions.
3.  **Data Privacy & Ethics**: {benefits[2]} By reducing reliance on sensitive patient information, we can foster ethical AI development and accelerate research without compromising individual privacy.
4.  **Addressing Data Imbalance**: {benefits[3]} Synthetic data can effectively balance skewed datasets, leading to more robust and equitable AI diagnostic tools.
5.  **Accelerated R&D**: {benefits[4]} Access to large, diverse, and controlled synthetic datasets allows for faster iteration and validation of new AI models, significantly shortening development cycles in a highly regulated field.

### Conclusion
The {strategy} framework represents a powerful paradigm shift in medical data augmentation. Its ability to generate structurally consistent, diverse, and ethically sourced synthetic images positions it as a cornerstone for future advancements in medical AI diagnostics and treatment planning.
"""
    print("Technical Briefing Generated.")
    return briefing

# 3. LaTeX Results Exporter
async def generate_latex_results_table(supabase_client, generated_data_quantity: int, average_fid: float) -> str:
    """
    Generates a LaTeX table summarizing the statistical information of the generated dataset.
    Assumes 'synthetic_samples' table has 'class_label' for class-wise counts.
    """
    latex_output = """
\begin{table}[h!]
\centering
\begin{tabular}{|l|c|}
\hline
	extbf{Metric} & 	extbf{Value} 
\hline
Generated Data Quantity & """ + str(generated_data_quantity) + """ 
Average FID Score & """ + f"{average_fid:.2f}" + """ 
\hline
\end{tabular}
\caption{Summary of Synthetic Medical Data Generation}
\label{tab:synthetic_data_summary}
\end{table}
"""
    
    # Placeholder for class-wise counts - requires 'class_label' column in synthetic_samples
    # For now, we'll just add a note about it.
    latex_output += """
\vspace{1em}

oindent 	extit{Note: Class-wise sample counts can be added if a 'class_label' column is available in the 'synthetic_samples' table.}
"""
    print("LaTeX Results Table Generated.")
    return latex_output

async def main():
    print("Starting evaluation master script...")

    # --- Step 1: Query necessary data (or simulate) ---
    # In a real scenario, you would query your 'synthetic_samples' table
    # to get actual generated data quantity and calculate average FID.
    # For this simulation, we'll use placeholder values.
    
    # For a real FID calculation, you need generated sample IDs and a path to real reference images.
    # Let's assume we generated 500 samples for this evaluation.
    simulated_generated_data_quantity = 500
    
    # --- IMPORTANT ---
    # To calculate a meaningful average_fid_score, you need:
    # 1. Paths to your generated images (from Supabase or local storage).
    # 2. A path to a directory containing a representative set of REAL medical images.
    # For this demonstration, we'll simulate the average FID.
    
    # Example dummy reference path. REPLACE with your actual real medical image dataset path.
    # This path needs to contain images that calculate_fid_given_paths can process.
    dummy_reference_path = "/Users/haeseong/Desktop/Developing/medical-genai/fid_reference_data/"
    if not os.path.exists(dummy_reference_path):
        os.makedirs(dummy_reference_path)
        # Create a dummy reference image for clean-fid to work (not a real reference)
        Image.new('RGB', (512, 512), color = 'blue').save(os.path.join(dummy_reference_path, "ref_0.png"))
        print(f"Created dummy FID reference directory and image at: {dummy_reference_path}")

    # Simulate average FID. In a real scenario, this would be calculated from actual data.
    simulated_average_fid_score = random.uniform(10.0, 50.0) # Random FID for simulation
    print(f"Simulated Average FID Score: {simulated_average_fid_score:.2f}")

    # --- Step 2: Performance Gains Simulator ---
    simulated_accuracy_gain = simulate_performance_gain(simulated_generated_data_quantity, simulated_average_fid_score)

    # --- Step 3: Technical Briefing Generator ---
    briefing_report_text = generate_technical_briefing()
    # print("
--- Technical Briefing ---
", briefing_report_text) # Print for verification

    # --- Step 4: LaTeX Results Exporter ---
    latex_table_output = await generate_latex_results_table(supabase_client, simulated_generated_data_quantity, simulated_average_fid_score)
    # print("
--- LaTeX Table ---
", latex_table_output) # Print for verification

    # --- Step 5: Store results in Supabase 'augmentation_evaluations' table ---
    print("
Storing evaluation results to Supabase 'augmentation_evaluations' table...")
    try:
        data, count = await supabase_client.table("augmentation_evaluations").insert({
            "evaluation_date": datetime.datetime.utcnow().isoformat() + "Z",
            "generated_data_quantity": simulated_generated_data_quantity,
            "average_fid_score": simulated_average_fid_score,
            "simulated_accuracy_gain": simulated_accuracy_gain,
            "briefing_report": briefing_report_text,
            "latex_table_output": latex_table_output
        }).execute()
        print("Database insert response:", data)
        if data and not data[1]:
            print("Evaluation results inserted successfully into 'augmentation_evaluations'.")
        else:
            print("Failed to insert evaluation results. Data:", data)
    except Exception as e:
        print(f"An error occurred during Supabase insert for 'augmentation_evaluations': {e}")

if __name__ == "__main__":
    asyncio.run(main())
