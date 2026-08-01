import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function getConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function isR2Configured(): boolean {
  return getConfig() !== null;
}

let client: S3Client | null = null;

function getClient(accountId: string, accessKeyId: string, secretAccessKey: string) {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function uploadProductImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const config = getConfig();
  if (!config) {
    return {
      error:
        "Image uploads aren't configured yet — R2 credentials are missing.",
    };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Please upload a JPEG, PNG, WebP, or AVIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image is too large (max 8MB)." };
  }

  const ext = file.type.split("/")[1];
  const key = `products/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const s3 = getClient(config.accountId, config.accessKeyId, config.secretAccessKey);
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );
  } catch (err) {
    console.error("R2 upload failed:", err);
    const name = err instanceof Error ? err.name : "";
    if (name === "NoSuchBucket") {
      return {
        error: `R2 bucket "${config.bucket}" doesn't exist — check R2_BUCKET_NAME.`,
      };
    }
    return { error: "Upload failed. Please check R2 configuration and try again." };
  }

  return { url: `${config.publicUrl.replace(/\/$/, "")}/${key}` };
}

export async function deleteProductImage(url: string): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const prefix = `${config.publicUrl.replace(/\/$/, "")}/`;
  if (!url.startsWith(prefix)) return; // not an R2-hosted image, nothing to clean up

  const key = url.slice(prefix.length);
  const s3 = getClient(config.accountId, config.accessKeyId, config.secretAccessKey);
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
  } catch (err) {
    console.error("R2 delete failed:", err);
  }
}
