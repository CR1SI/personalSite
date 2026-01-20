#main.py

from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import models
from database import engine, SessionLocal, get_db
from cloudinaryConverter import url_converter

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
async def root():
    return {
        "status": "API is on!"
    }

@app.post("/upload") #remember to update all the links to the final live backend link!
async def create_photo_from_form(
    picture_name: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    metadata: List[str] = Form(...),
    fileToUpload: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    img_url = url_converter(fileToUpload)

    formatted_metadata = {
        "Lens": metadata[0],
        "Focal Length": metadata[1],
        "Aperture": metadata[2],
        "Exposure Time": metadata[3],
        "ISO": metadata[4],
        "Date Taken": metadata[5]
    }

    new_photo = models.Photos(
        title=picture_name,
        location=location,
        description=description,
        category=category,
        img_src=img_url,
        photo_metadata=formatted_metadata
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return {"status": "Success", "id": new_photo.id, "cloudinary_url": img_url}