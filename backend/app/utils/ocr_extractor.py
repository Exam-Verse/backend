import os
import re
import requests
from pathlib import Path
from typing import List, Dict
from PyPDF2 import PdfReader
from dotenv import load_dotenv

load_dotenv()

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY", "")


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF using PyPDF2"""
    try:
        reader = PdfReader(file_path)
        text = ""
        
        for page in reader.pages:
            text += page.extract_text() + "\n\n"
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""


def extract_text_with_ocr(file_path: str) -> str:
    """Extract text from PDF using OCR.space API (for scanned PDFs)"""
    if not OCR_SPACE_API_KEY:
        print("OCR_SPACE_API_KEY not set. Using PyPDF2 only.")
        return extract_text_from_pdf(file_path)
    
    try:
        with open(file_path, 'rb') as f:
            response = requests.post(
                'https://api.ocr.space/parse/image',
                files={'file': f},
                data={
                    'apikey': OCR_SPACE_API_KEY,
                    'language': 'eng',
                    'isOverlayRequired': False,
                    'filetype': 'PDF',
                    'detectOrientation': True,
                    'scale': True,
                    'OCREngine': 2
                },
                timeout=60
            )
        
        result = response.json()
        
        if result.get('IsErroredOnProcessing'):
            print(f"OCR error: {result.get('ErrorMessage')}")
            return extract_text_from_pdf(file_path)
        
        # Combine text from all pages
        text = ""
        if 'ParsedResults' in result:
            for page_result in result['ParsedResults']:
                text += page_result.get('ParsedText', '') + "\n\n"
        
        return text.strip()
    except Exception as e:
        print(f"OCR API error: {e}. Falling back to PyPDF2")
        return extract_text_from_pdf(file_path)


def parse_questions_from_text(text: str) -> List[Dict]:
    """Parse questions from extracted text"""
    questions = []
    
    # Common question patterns
    patterns = [
        r'Q\.?\s*(\d+)[\.\):]?\s*(.*?)(?=Q\.?\s*\d+|$)',  # Q1. or Q.1 or Q1:
        r'Question\s*(\d+)[\.\):]?\s*(.*?)(?=Question\s*\d+|$)',  # Question 1.
        r'(\d+)[\.\)]\s+(.*?)(?=\d+[\.\)]|$)',  # 1. or 1)
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
        for match in matches:
            question_num = match.group(1)
            question_text = match.group(2).strip()
            
            # Skip if question text is too short (likely not a real question)
            if len(question_text) < 10:
                continue
            
            # Clean up the text
            question_text = re.sub(r'\s+', ' ', question_text)  # Remove extra whitespace
            question_text = question_text[:5000]  # Limit length
            
            # Extract marks if present
            marks_match = re.search(r'\[(\d+)\s*marks?\]|\((\d+)\s*marks?\)', question_text, re.IGNORECASE)
            marks = None
            if marks_match:
                marks = int(marks_match.group(1) or marks_match.group(2))
            
            questions.append({
                "question_number": int(question_num),
                "question_text": question_text,
                "marks": marks
            })
        
        # If we found questions with this pattern, use them
        if questions:
            break
    
    # Sort by question number
    questions.sort(key=lambda x: x['question_number'])
    
    # Remove duplicates (same question number)
    seen = set()
    unique_questions = []
    for q in questions:
        if q['question_number'] not in seen:
            seen.add(q['question_number'])
            unique_questions.append(q)
    
    return unique_questions


def extract_metadata_from_text(text: str) -> Dict:
    """Extract metadata like year, subject, etc. from text"""
    metadata = {}
    
    # Try to find year (common patterns)
    year_patterns = [
        r'20\d{2}',  # 2023, 2024, etc.
        r'Year\s*:?\s*(\d{4})',
        r'Session\s*:?\s*.*?(\d{4})'
    ]
    
    for pattern in year_patterns:
        match = re.search(pattern, text[:500])  # Check first 500 chars
        if match:
            year_str = match.group(1) if match.lastindex else match.group(0)
            try:
                metadata['year'] = int(year_str)
                break
            except:
                pass
    
    # Try to find semester
    semester_match = re.search(r'Semester\s*:?\s*(\d+|[IVX]+)', text[:500], re.IGNORECASE)
    if semester_match:
        metadata['semester'] = semester_match.group(1)
    
    # Try to find exam type
    exam_patterns = ['mid-?term', 'end-?term', 'final', 'sessional']
    for pattern in exam_patterns:
        if re.search(pattern, text[:500], re.IGNORECASE):
            metadata['exam_type'] = pattern.replace('-', '')
            break
    
    return metadata


async def process_paper_pdf(file_path: str, use_ocr: bool = True) -> Dict:
    """Process a paper PDF and extract questions"""
    try:
        # Extract text
        if use_ocr and OCR_SPACE_API_KEY:
            text = extract_text_with_ocr(file_path)
        else:
            text = extract_text_from_pdf(file_path)
        
        if not text:
            return {
                "success": False,
                "error": "No text could be extracted from PDF",
                "questions": [],
                "metadata": {}
            }
        
        # Parse questions
        questions = parse_questions_from_text(text)
        
        # Extract metadata
        metadata = extract_metadata_from_text(text)
        
        return {
            "success": True,
            "questions": questions,
            "metadata": metadata,
            "raw_text": text[:1000],  # First 1000 chars for preview
            "total_questions": len(questions)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "questions": [],
            "metadata": {}
        }
