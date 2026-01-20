#main.py

from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import models
from database import engine, SessionLocal, get_db
from cloudinaryConverter import url_converter, deleteById

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://cphotos.netlify.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "API is on!"
    }

@app.get("/photos")
async def getPictures(db: Session = Depends(get_db)):
    pictures = db.query(models.Photos).all()
    return pictures

@app.get("/photos/{id}")
async def getPictureById(id: int, db:Session = Depends(get_db)):
    picture = db.query(models.Photos).filter(models.Photos.id == id).first()

    if not picture:
        raise HTTPException(status_code=404, detail="Picture not found in db")
    
    return picture

@app.delete("/photos/{id}")
async def deletePicture(id: int, db: Session = Depends(get_db)):
    picture = db.query(models.Photos).filter(models.Photos.id == id).first()

    if not picture:
        raise HTTPException(status_code=404, detail="Picture not found in db")
    
    deleteById(picture.cloudinary_id)
    db.delete(picture)
    db.commit()
    return {"status": "Picture Deleted", "id": id}

@app.patch("/photos/{id}/favorite")
async def toggle_favorite(id: int, db:Session = Depends(get_db)):
    photo = db.query(models.Photos).filter(models.Photos.id == id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    photo.favorite = not photo.favorite # type: ignore
    db.commit()
    db.refresh(photo)
    return {"id": id, "is_favorite": photo.favorite}


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
    
    file_bytes = await fileToUpload.read()
    file_size_mb = f"{len(file_bytes) / (1024 * 1024):.2f} MB"

    img = Image.open(io.BytesIO(file_bytes))
    width, height = img.size
    dimensions = f"{width}x{height}"

    img_url = url_converter(file_bytes)
    src = img_url[0] # type: ignore
    public_id = img_url[1] # type: ignore

    formatted_metadata = {
        "Lens": metadata[0],
        "Focal Length": metadata[1],
        "Aperture": metadata[2],
        "Exposure Time": metadata[3],
        "ISO": metadata[4],
        "Date Taken": metadata[5],
        "Camera": "Canon Rebel T7",
        "Author": "Cristian Padleski",
        "File Size": file_size_mb,
        "Dimensions": dimensions
    }

    new_photo = models.Photos(
        title=picture_name,
        location=location,
        description=description,
        category=category,
        img_src=src,
        photo_metadata=formatted_metadata,
        cloudinary_id=public_id
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return {"status": "Success", "id": new_photo.id, "cloudinary_url": img_url}