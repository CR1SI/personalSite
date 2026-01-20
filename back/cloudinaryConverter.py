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

def url_converter(file_object):
    if hasattr(file_object, "file"):
        source = file_object.file
    else:
        source = file_object
    
    try:
        upload_result = cloudinary.uploader.upload(source)

        optimized_url, _ = cloudinary_url(
            upload_result["public_id"],
            fetch_format = "auto",
            quality = "auto"
        )
        return optimized_url
    except Exception as e:
        print(f"Cloudinary Error: {e}")
        return None