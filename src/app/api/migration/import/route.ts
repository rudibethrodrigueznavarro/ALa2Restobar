import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { verifySession } from "../../../../lib/auth";
import { s3Client, BUCKET_NAME } from "../../../../lib/minio";
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import AdmZip from "adm-zip";

export async function POST(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    let dataJson: any = null;
    
    // Check if MinIO bucket exists, create if not
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    } catch (bucketError: any) {
      if (bucketError.name === "NotFound" || bucketError.$metadata?.httpStatusCode === 404) {
        console.log(`Bucket ${BUCKET_NAME} not found. Creating it...`);
        await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`Bucket ${BUCKET_NAME} created successfully.`);
      } else {
        console.error("Error checking MinIO bucket:", bucketError);
        throw bucketError;
      }
    }

    // Upload files to S3/MinIO
    for (const entry of zipEntries) {
      if (entry.entryName === "data.json") {
        const text = entry.getData().toString("utf8");
        dataJson = JSON.parse(text);
      } else if (!entry.isDirectory) {
        // Upload image
        const contentType = entry.entryName.endsWith(".png") ? "image/png" : 
                            entry.entryName.endsWith(".gif") ? "image/gif" :
                            entry.entryName.endsWith(".webp") ? "image/webp" : "image/jpeg";
                            
        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: entry.entryName,
            Body: entry.getData(),
            ContentType: contentType,
          })
        );
      }
    }

    if (!dataJson) {
      return NextResponse.json({ error: "El archivo ZIP no contiene data.json" }, { status: 400 });
    }

    const { categories, products } = dataJson;

    // Begin DB update
    await query("BEGIN");
    try {
      await query("TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE");

      // Insert categories
      for (const cat of categories || []) {
        await query(
          "INSERT INTO categories (id, name, description, display_order, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
          [cat.id, cat.name, cat.description || "", cat.display_order || 0, cat.created_at, cat.updated_at]
        );
      }
      if (categories && categories.length > 0) {
        await query("SELECT setval(pg_get_serial_sequence('categories', 'id'), coalesce(max(id), 0) + 1, false) FROM categories");
      }

      // Insert products
      for (const prod of products || []) {
        await query(
          "INSERT INTO products (id, name, description, price, image_url, category_id, is_available, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [prod.id, prod.name, prod.description || "", prod.price, prod.image_url || "", prod.category_id || null, prod.is_available, prod.created_at, prod.updated_at]
        );
      }
      if (products && products.length > 0) {
        await query("SELECT setval(pg_get_serial_sequence('products', 'id'), coalesce(max(id), 0) + 1, false) FROM products");
      }

      await query("COMMIT");
    } catch (err) {
      await query("ROLLBACK");
      throw err;
    }

    return NextResponse.json({ success: true, message: "Datos importados correctamente" });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Error al importar los datos", detail: error.message },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
