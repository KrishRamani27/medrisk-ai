from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd
import shap

app = FastAPI()

model=pickle.load(open('models/xgb_model.pkl', 'rb'))
preprocessor=pickle.load(open('models/preprocessor.pkl', 'rb'))
explainer=shap.TreeExplainer(model)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    Age: int
    Sex: str
    ChestPainType: str
    RestingBP: float
    Cholesterol: float
    FastingBS: float
    RestingECG: str
    MaxHR: float
    ExerciseAngina: str
    Oldpeak: float
    ST_Slope: str

@app.post("/predict")
def predict(patient: PatientData):
    input_df = pd.DataFrame([patient.model_dump()])
    input_processed = preprocessor.transform(input_df)
    probability = model.predict_proba(input_processed)[0][1]
    prediction = int(probability >= 0.5)
    shap_values = explainer.shap_values(input_processed)
    return {
        "prediction": prediction,
        "probability": round(float(probability), 4),
        "shap_values": shap_values[0].tolist()
    }

@app.get("/")
def root():
    return {"status": "MedRisk AI is running"}