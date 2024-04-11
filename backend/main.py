from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_invoice(seller_info, buyer_info, items_info, output_file):
    pdf = canvas.Canvas(output_file, pagesize=letter)

    # Add seller information
    pdf.drawString(100, 750, "Seller Information:")
    pdf.drawString(100, 730, f"Name: {seller_info['name']}")
    pdf.drawString(100, 710, f"Phone: {seller_info['phone']}")
    pdf.drawString(100, 690, f"Address: {seller_info['address']}")

    # Add buyer information
    pdf.drawString(100, 670, "Buyer Information:")
    pdf.drawString(100, 650, f"Name: {buyer_info['name']}")
    pdf.drawString(100, 630, f"Phone: {buyer_info['phone']}")
    pdf.drawString(100, 610, f"Address: {buyer_info['address']}")

    # Add items information
    pdf.drawString(100, 590, "Items Information:")
    y = 570
    for item in items_info:
        pdf.drawString(100, y, f"Item: {item['name']}, Price: ${item['price']}, Quantity: {item['quantity']}, Tax: {item['tax']}")
        y -= 20

    pdf.save()

# Step 3: Implement the FastAPI application

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvoiceData(BaseModel):
    seller_info: dict
    buyer_info: dict
    items_info: list

@app.post("/generate_invoice/")
async def generate_invoice_api(data: InvoiceData):
    try:
        output_file = "invoice.pdf"
        generate_invoice(data.seller_info, data.buyer_info, data.items_info, output_file)
        return {"message": "Invoice generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))