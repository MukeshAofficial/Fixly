import os
import torch
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import T5ForConditionalGeneration, T5TokenizerFast

# --- Configuration ---
# Set the model directory relative to this script
MODEL_DIR = os.path.join(os.path.dirname(__file__), "t5-grammar-correction-model")

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Grammar Correction API",
    description="A FastAPI server to correct grammatical errors using a T5 model.",
    version="1.0.0",
)

# --- Model Loading ---
# This section loads the model and tokenizer once when the app starts.
try:
    print("Loading model and tokenizer...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    tokenizer = T5TokenizerFast.from_pretrained(MODEL_DIR)
    model = T5ForConditionalGeneration.from_pretrained(MODEL_DIR).to(device)
    
    print("Model and tokenizer loaded successfully. ✅")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    tokenizer = None

# --- Pydantic Models for Data Validation ---
class GrammarRequest(BaseModel):
    text: str

class GrammarResponse(BaseModel):
    original_text: str
    corrected_text: str

# --- API Endpoint ---
@app.post("/correct", response_model=GrammarResponse)
def correct_grammar(request: GrammarRequest):
    """
    Accepts a text string and returns its grammatically corrected version.
    """
    if not model or not tokenizer:
        return {"error": "Model is not loaded."}

    input_text = "grammar: " + request.text
    
    # Tokenize the input
    inputs = tokenizer(
        input_text, 
        return_tensors="pt",
        max_length=128,
        padding="max_length",
        truncation=True
    )

    # Move tensors to the correct device
    input_ids = inputs.input_ids.to(device)
    attention_mask = inputs.attention_mask.to(device)

    # Generate the corrected output
    outputs = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        max_length=128,
        num_beams=5,       # Use beam search for better results
        early_stopping=True
    )

    # Decode the output
    corrected_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {
        "original_text": request.text,
        "corrected_text": corrected_text,
    }

@app.get("/", include_in_schema=False)
def root():
    return {"message": "Grammar Correction API is running. Go to /docs for documentation."}