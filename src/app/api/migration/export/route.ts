import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { verifySession } from "../../../../lib/auth";
import { s3Client, BUCKET_NAME } from "../../../../lib/minio";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import AdmZip from "adm-zip";

export async function GET(req: NextRequest) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const zip = new AdmZip();

    // 1. Fetch categories
    const categoriesRes = await query("SELECT * FROM categories ORDER BY id ASC");
    const categories = categoriesRes.rows;

    // 2. Fetch products
    const productsRes = await query("SELECT * FROM products ORDER BY id ASC");
    const products = productsRes.rows;

    // 3. Process images
    for (const product of products) {
      if (product.image_url) {
        // Extract key from URL, usually format is: /api/media?key=uploads/...
        const match = product.image_url.match(/key=([^&]+)/);
        if (match && match[1]) {
          const key = decodeURIComponent(match[1]);
          try {
            const data = await s3Client.send(
              new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key })
            );
            
            if (data.Body) {
              const buffer = Buffer.from(await data.Body.transformToByteArray());
              zip.addFile(key, buffer); // Put image in the ZIP under its key path
            }
          } catch (imgError) {
            console.error(`Could not download image ${key}:`, imgError);
          }
        }
      }
    }

    // 4. Add data.json
    const dataObj = { categories, products };
    zip.addFile("data.json", Buffer.from(JSON.stringify(dataObj, null, 2)));

    // 5. Generate zip buffer
    const zipBuffer = zip.toBuffer();

    // 6. Return response
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="migracion-datos.zip"',
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Error al exportar los datos" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
