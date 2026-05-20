import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../../../lib/minio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "El parámetro key es requerido" },
        { status: 400 }
      );
    }

    try {
      const response = await s3Client.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        })
      );

      if (!response.Body) {
        return NextResponse.json(
          { error: "Archivo vacío o no disponible" },
          { status: 404 }
        );
      }

      // Convertir el stream de S3 a un ReadableStream web para Next.js
      const webStream = (response.Body as any).transformToWebStream();

      return new Response(webStream, {
        headers: {
          "Content-Type": response.ContentType || "application/octet-stream",
          "Content-Length": response.ContentLength?.toString() || "",
          // Opcional: agregamos cache control simple para evitar recargas constantes en el cliente
          "Cache-Control": "public, max-age=604800, immutable", // 7 días de caché en navegador
        },
      });
    } catch (s3Error: any) {
      // Manejar el caso de que el archivo no exista en MinIO
      if (s3Error.name === "NoSuchKey") {
        return NextResponse.json(
          { error: "El archivo solicitado no existe" },
          { status: 404 }
        );
      }
      throw s3Error;
    }
  } catch (error: any) {
    console.error("Media serving error:", error);
    return NextResponse.json(
      { error: "Error al descargar el archivo" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
