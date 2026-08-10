import cloudinary
import cloudinary.uploader

from app.core.config import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


class CloudinaryService:

    @staticmethod
    def upload_pdf(
        file_path: str,
        patient_id: str,
        filename: str
    ):

        result = cloudinary.uploader.upload(
            file_path,
            resource_type="image",
            folder=f"caresync/patients/{patient_id}/reports",
            public_id=filename.rsplit(".", 1)[0],
            overwrite=True
        )

        return {
            "public_id": result.get("public_id"),
            "secure_url": result.get("secure_url"),
            "resource_type": result.get("resource_type"),
            "format": result.get("format")
        }