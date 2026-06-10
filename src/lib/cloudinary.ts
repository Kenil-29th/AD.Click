import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000,
});

export default cloudinary;

export type UploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  duration?: number;
  bytes: number;
};

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; resource_type: "image" | "video" }
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve(result as unknown as UploadResult);
        }
      }
    );

    stream.on("error", (err) => reject(err));
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
