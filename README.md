# AI for Mine Safety Intelligence - Accident Pattern Detection

---

Project Name: Miner Incident 

## Project Overview

Mining accidents continue to pose major safety and operational risks in the extractive industry.  
This project aims to develop an AI-driven Mine Safety Intelligence System capable of:

- Digitizing historical accident reports (DGMS/Ministry of Mines, India)  
- Extracting structured data from unstructured PDFs and scanned reports  
- Detecting patterns and predicting accident trends  
- Generating factual summaries and safety insights  
- Assisting decision-makers through an intelligent LLM-based safety assistant  

The system leverages Natural Language Processing (NLP), **Machine Learning, and **Large Language Model (LLM) fine-tuning (via LoRA) to build a knowledge base for accident prevention and safety planning.

---

## Dataset Description

Source:
- Directorate General of Mines Safety (DGMS) – Accident Reports (2015–2022)
- Non-Coal and Coal mining accident records compiled from official reports.

Cleaned Dataset:  
A cleaned dataset (Cleaned Dataset w-o code.csv) prepared by the team consolidates accident information extracted from DGMS reports.  
Each row corresponds to a single mining accident record.

---

### Columns and Description

| Column Name     | Description |
|-----------------|-------------|
| Case_No         | Unique identifier for each accident case |
| Date            | Date of the accident (YYYY-MM-DD) |
| Time            | Time of accident (HH:MM) |
| Mine_Name       | Name of the mine where the accident occurred |
| Owner           | Mine owner or operating company |
| District        | District name |
| State           | Indian state |
| Code            | DGMS accident classification code |
| Cause           | Category or cause of accident (e.g., Roof fall, Drowning, Fire) |
| Fatalities      | Number of deaths reported |
| Persons_Killed  | Names, roles, ages, and genders of affected persons |
| Narrative       | Full textual description of how the accident occurred |
| Summary         | Fact-rich, cleaned summary (manually curated or generated using LLM) |

---

## Pipeline Components

### 1. Data Extraction (PDF → CSV)
Tools used:
- pdfplumber, pdf2image, pytesseract for OCR and text extraction  
- regex, spaCy, and sumy for NLP cleaning and extractive summarization  
- transformers (BART / Pegasus / T5) for abstractive summaries  
Output: accidents_best.csv and accidents_best.jsonl  

---

### 2. Data Cleaning & Verification
- Removal of duplicates, OCR noise, and inconsistent date formats  
- Normalization of cause categories and fatalities count  
- Manual curation for summaries and verification of extracted fields  

---

### 3. Pattern Detection & Analytics
- Statistical insights: number of accidents by year/state/cause  
- Clustering: similarity in accident narratives  
- Classification: predicting cause type or severity from text  
Tools: pandas, scikit-learn, matplotlib, plotly  

---

### 4. LLM Fine-Tuning
- Fine-tune models like LLaMA, **Gemma, or **Mistral using LoRA (PEFT)  
- Training data: prompt–completion pairs (JSONL)
