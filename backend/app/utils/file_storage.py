import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10485760))  # 10MB default

# Create upload directories
PAPERS_DIR = Path(UPLOAD_DIR) / "papers"
SOLUTIONS_DIR = Path(UPLOAD_DIR) / "solutions"
FACULTY_IDS_DIR = Path(UPLOAD_DIR) / "faculty_ids"

# Ensure directories exist
for directory in [PAPERS_DIR, SOLUTIONS_DIR, FACULTY_IDS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)


def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename"""
    extension = Path(original_filename).suffix
    unique_name = f"{uuid.uuid4().hex}{extension}"
    return unique_name


def validate_pdf_file(file: UploadFile):
    """Validate PDF file"""
    # Check file extension
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Check content type
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type")


def validate_image_file(file: UploadFile):
    """Validate image file"""
    allowed_extensions = ['.jpg', '.jpeg', '.png']
    allowed_content_types = ['image/jpeg', 'image/png']
    
    extension = Path(file.filename).suffix.lower()
    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")
    
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail="Invalid image type")


async def save_upload_file(file: UploadFile, destination: Path) -> str:
    """Save uploaded file to destination"""
    try:
        # Read file in chunks to handle large files
        async with aiofiles.open(destination, 'wb') as f:
            while chunk := await file.read(8192):  # 8KB chunks
                await f.write(chunk)
        
        return str(destination)
    except Exception as e:
        # Clean up partial file if error occurs
        if destination.exists():
            destination.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


async def upload_paper_pdf(file: UploadFile) -> dict:
    """Upload paper PDF file"""
    validate_pdf_file(file)
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {MAX_FILE_SIZE/1024/1024}MB")
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = PAPERS_DIR / unique_filename
    
    # Save file
    await save_upload_file(file, file_path)
    
    # Return file URL (relative path for serving)
    file_url = f"/uploads/papers/{unique_filename}"
    
    return {
        "success": True,
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": str(file_path),
        "file_url": file_url,
        "file_size": file_size
    }


async def upload_solution_file(file: UploadFile) -> dict:
    """Upload solution PDF or image file"""
    # Validate based on file type
    if file.filename.lower().endswith('.pdf'):
        validate_pdf_file(file)
    else:
        validate_image_file(file)
    
    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {MAX_FILE_SIZE/1024/1024}MB")
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = SOLUTIONS_DIR / unique_filename
    
    # Save file
    await save_upload_file(file, file_path)
    
    # Return file URL
    file_url = f"/uploads/solutions/{unique_filename}"
    
    return {
        "success": True,
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": str(file_path),
        "file_url": file_url,
        "file_size": file_size
    }


async def upload_faculty_id(file: UploadFile) -> dict:
    """Upload faculty ID card image"""
    validate_image_file(file)
    
    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {MAX_FILE_SIZE/1024/1024}MB")
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = FACULTY_IDS_DIR / unique_filename
    
    # Save file
    await save_upload_file(file, file_path)
    
    # Return file URL
    file_url = f"/uploads/faculty_ids/{unique_filename}"
    
    return {
        "success": True,
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": str(file_path),
        "file_url": file_url,
        "file_size": file_size
    }


def delete_file(file_path: str):
    """Delete a file from storage"""
    try:
        path = Path(file_path)
        if path.exists():
            path.unlink()
            return True
        return False
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False
