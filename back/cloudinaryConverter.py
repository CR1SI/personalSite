#cloudinaryConverter.py

import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name = "dm0xy04yo",
    api_key = "437257768187794",
    api_secret = os.getenv("CLOUD_SECRET"),
    secure = True
)

def url_converter(source):
    try:
        upload_result = cloudinary.uploader.upload(source)
        optimized_url, _ = cloudinary_url(
            upload_result["public_id"],
            fetch_format = "auto",
            quality = "auto:best"
        )
        return [optimized_url, upload_result["public_id"]]
    except Exception as e:
        print(f"Cloudinary Error: {e}")
        return None

def deleteById(id):
    try:
        response = cloudinary.uploader.destroy(id)
        return response
    except Exception as e:
        print(f"Error deleting from Cloudinary: {e}")
        return None