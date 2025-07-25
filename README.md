# Fixly ✨

An open-source, AI-powered grammar checker that puts your privacy first. Built for the "Build Real ML Web Apps" Hackathon.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python Version](https://img.shields.io/badge/python-3.11+-blue.svg)
![Status](https://img.shields.io/badge/status-deployed-success.svg)

---

## Overview

Fixly is an open-source grammar correction tool built from the ground up. This project features a custom-trained T5 language model served via a FastAPI backend, which communicates with a user-friendly Chrome Extension.

Unlike other services, Fixly doesn't rely on black-box APIs. It's a demonstration of a real, end-to-end machine learning application that you can run yourself, ensuring your data stays private. Instantly catch grammatical errors, improve sentence structure, and enhance your writing on any website.


---

## 🚀 Features

* **Real-Time Suggestions**: Analyzes text as you type and provides clickable corrections.
* **Privacy-Focused**: Your text is processed by a self-hosted model, not sent to third-party companies.
* **Works Everywhere**: Corrects your writing in text fields on any website.
* **Easy to Use**: A clean, non-intrusive UI with simple click-to-accept functionality.
* **Fully Open Source**: The entire codebase, from the model training to the extension, is available for you to inspect and modify.

---

## 🛠️ Tech Stack

* **AI Model**: Fine-tuned `T5-small` model from Hugging Face Transformers, trained on the C4_200M grammar correction dataset.
* **Backend**: Python, FastAPI, PyTorch, Gunicorn.
* **Frontend**: Chrome Extension built with vanilla JavaScript, HTML5, and CSS3.
* **Deployment**: Backend hosted on hugging face; Model files managed with Git LFS.

---

## ⚙️ Installation and Setup

To get Fixly running on your local machine, follow these steps.


### 1. Backend Setup

First, set up the API server that runs the AI model.

```bash
# Clone the repository
git clone [https://github.com/MukeshAofficial/Fixly.git](https://github.com/MukeshAofficial/Fixly.git)

# Navigate to the project directory
cd Fixly

# Create and activate a virtual environment
# On Windows
python -m venv venv
.\venv\Scripts\activate
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Run the local server
uvicorn main:app --reload

Your API backend should now be running at http://12.0.0.1:8000.

2. Frontend (Chrome Extension) Setup
Next, load the extension into your Chrome browser.

Open Google Chrome and navigate to chrome://extensions.

Enable "Developer mode" using the toggle switch in the top-right corner.

Click the "Load unpacked" button.

Select the grammar-extension folder from the project directory.

The "Fixly" extension should now appear in your list and be active!
