import os
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Configure Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def is_gemini_configured() -> bool:
    """Check if Gemini API is configured"""
    return bool(GEMINI_API_KEY)


async def generate_ai_solution(question_text: str, context: Optional[dict] = None) -> dict:
    """
    Generate AI solution for a question using Google Gemini
    
    Args:
        question_text: The question to solve
        context: Optional context including subject, marks, etc.
    
    Returns:
        dict with success status, solution, and explanation
    """
    if not GEMINI_API_KEY:
        return {
            "success": False,
            "error": "Gemini API key not configured"
        }
    
    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Build prompt with context
        prompt = f"""You are an expert academic tutor helping students understand exam questions.

Question: {question_text}
"""
        
        if context:
            if context.get("subject"):
                prompt += f"\nSubject: {context['subject']}"
            if context.get("marks"):
                prompt += f"\nMarks: {context['marks']}"
            if context.get("course"):
                prompt += f"\nCourse: {context['course']}"
        
        prompt += """

Please provide:
1. A clear, step-by-step solution
2. Key concepts involved
3. Common mistakes to avoid
4. Tips for exam preparation

Format your response in a clear, structured manner suitable for students."""
        
        # Generate response
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            return {
                "success": False,
                "error": "No response generated from AI"
            }
        
        return {
            "success": True,
            "solution": response.text,
            "model": "gemini-pro",
            "metadata": {
                "prompt_length": len(prompt),
                "response_length": len(response.text)
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"AI generation failed: {str(e)}"
        }


async def generate_solution_with_image(question_text: str, image_path: str, context: Optional[dict] = None) -> dict:
    """
    Generate AI solution for a question with an image using Gemini Pro Vision
    
    Args:
        question_text: The question text
        image_path: Path to the image file
        context: Optional context
    
    Returns:
        dict with success status, solution, and explanation
    """
    if not GEMINI_API_KEY:
        return {
            "success": False,
            "error": "Gemini API key not configured"
        }
    
    try:
        from PIL import Image
        
        # Initialize the vision model
        model = genai.GenerativeModel('gemini-pro-vision')
        
        # Load image
        img = Image.open(image_path)
        
        # Build prompt
        prompt = f"""You are an expert academic tutor. Analyze this image and the question below:

Question: {question_text}

Please provide:
1. Analysis of any diagrams, graphs, or visual elements in the image
2. A clear, step-by-step solution
3. Key concepts involved
4. Common mistakes to avoid

Format your response clearly for students."""
        
        # Generate response with image
        response = model.generate_content([prompt, img])
        
        if not response or not response.text:
            return {
                "success": False,
                "error": "No response generated from AI"
            }
        
        return {
            "success": True,
            "solution": response.text,
            "model": "gemini-pro-vision",
            "has_image_analysis": True
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"AI generation with image failed: {str(e)}"
        }


async def summarize_paper(paper_text: str, metadata: dict) -> dict:
    """
    Generate a summary of the paper including difficulty, topics covered, etc.
    
    Args:
        paper_text: Extracted text from the paper
        metadata: Paper metadata (subject, year, etc.)
    
    Returns:
        dict with summary information
    """
    if not GEMINI_API_KEY:
        return {
            "success": False,
            "error": "Gemini API key not configured"
        }
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Analyze this exam paper and provide a brief summary:

Subject: {metadata.get('subject', 'Unknown')}
Year: {metadata.get('year', 'Unknown')}

Paper Content (first 2000 characters):
{paper_text[:2000]}

Please provide:
1. Main topics covered (bullet points)
2. Estimated difficulty level (Easy/Medium/Hard)
3. Key areas of focus
4. Study recommendations

Keep it concise (200-300 words)."""
        
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            return {
                "success": False,
                "error": "No response generated"
            }
        
        return {
            "success": True,
            "summary": response.text,
            "model": "gemini-pro"
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Summary generation failed: {str(e)}"
        }


async def explain_concept(concept: str, subject: str, level: str = "undergraduate") -> dict:
    """
    Generate explanation for a specific concept
    
    Args:
        concept: The concept to explain
        subject: Subject area
        level: Educational level (school/undergraduate/postgraduate)
    
    Returns:
        dict with explanation
    """
    if not GEMINI_API_KEY:
        return {
            "success": False,
            "error": "Gemini API key not configured"
        }
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Explain the following concept for {level} {subject} students:

Concept: {concept}

Please provide:
1. Clear definition
2. Real-world examples
3. Common applications
4. Related concepts
5. Practice tips

Use simple language and analogies where helpful."""
        
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            return {
                "success": False,
                "error": "No response generated"
            }
        
        return {
            "success": True,
            "explanation": response.text,
            "concept": concept,
            "subject": subject
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Concept explanation failed: {str(e)}"
        }
