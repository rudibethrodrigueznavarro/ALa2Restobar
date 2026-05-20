import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://minio:9000",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  },
  region: "us-east-1", // Requerido por el SDK, pero ignorado por MinIO
  forcePathStyle: true, // Obligatorio para MinIO (usa path-style: http://endpoint/bucket)
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "ala2-restobar";
