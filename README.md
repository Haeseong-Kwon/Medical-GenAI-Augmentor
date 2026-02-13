# Medical GenAI Augmentor

[![Phase](https://img.shields.io/badge/Phase-4%20Complete-blueviolet?style=for-the-badge)](https://github.com/Haeseong-Kwon/Medical-GenAI-Augmentor)

## Overview
**Medical GenAI Augmentor** is a high-fidelity diagnostic data augmentation framework designed to solve clinical class imbalance. By leveraging **Conditional Diffusion Models** and **ControlNet**, the platform generates anatomically consistent medical imagery (X-rays, MRIs, etc.) that follows strict spatial constraints and radiological structures.

## Core Features
- 🧠 **Advanced Conditioning**: Precise control over disease labels (Normal, Pneumonia, Effusion, etc.) with real-time parameter tuning.
- 📐 **ControlNet Integration**: Structural guidance using Canny Edge and Depth Map reference uploader to maintain anatomical integrity.
- 🧪 **Real-time Feedback**: Interactive denoising previews allow researchers to monitor generation progress at every sampling step.
- 🛡️ **Expert Validation**: In-the-loop clinical review system where experts can rate and validate synthetic samples before inclusion in training sets.
- 📊 **Impact Analytics**: Automated performance evaluation visualizing the accuracy boost and dataset re-balancing delta.
- 📄 **Research Reports**: One-click professional PDF report generation documenting simulation parameters and validation results.

## Technical Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **State/Realtime**: Supabase Realtime & Postgres
- **Visualization**: Recharts, Lucide React
- **Report Engine**: jsPDF, html2canvas
- **AI Backend**: Stable Diffusion + ControlNet (MPS Optimized Inference Logic)

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `.env.local` with your Supabase credentials.
4. Run the development server: `npm run dev`

## Clinical Impact
This framework significantly reduces the "Medical Data Scarcity" problem by providing a secure, validated environment to generate rare pathology cases, ultimately improving the sensitivity and specificity of AI diagnostic models.
