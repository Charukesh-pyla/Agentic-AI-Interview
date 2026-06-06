import fitz  # PyMuPDF

def extract_text_from_resume(pdf_path: str) -> str:
    """
    Extract full text from resume PDF.
    Returns a string (required by GraphState).
    """

    doc = fitz.open(pdf_path)

    text = ""

    for page in doc:
        text += page.get_text()

    return text