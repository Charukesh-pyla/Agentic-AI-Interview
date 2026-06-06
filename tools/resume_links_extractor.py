import pikepdf


def extract_links_from_pdf(pdf_path: str):
    """
    Tool: Extract hyperlinks from resume using PDF annotations.
    No reasoning here.
    """

    pdf = pikepdf.Pdf.open(pdf_path)
    links = []

    for page in pdf.pages:
        if "/Annots" in page:
            for annot in page.Annots:
                if annot.get("/Subtype") == "/Link" and "/A" in annot:
                    uri = annot.A.get("/URI")
                    if uri:
                        links.append(str(uri))

    return links