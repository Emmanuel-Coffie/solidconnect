import { requireUser, sameOrigin, rateLimit } from "@/lib/auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await requireUser();
    rateLimit(`upload:${user.id}`, 20);
    if (Number(req.headers.get("content-length")) > 6 * 1024 * 1024)
      return Response.json(
        { error: "Choose an image under 5 MB." },
        { status: 413 },
      );
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024)
      return Response.json(
        { error: "Choose a JPG, PNG or WebP image under 5 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
      ? "jpg"
      : bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        ? "png"
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          ? "webp"
          : null;
    if (!ext)
      return Response.json(
        { error: "This file is not a supported image." },
        { status: 400 },
      );
    const name = `${randomUUID()}.${ext}`;
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const timestamp = String(Math.floor(Date.now() / 1000));
      const folder = "solid-connect";
      const signature = createHash("sha1")
        .update(
          `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`,
        )
        .digest("hex");
      const upload = new FormData();
      upload.set("file", file);
      upload.set("api_key", process.env.CLOUDINARY_API_KEY);
      upload.set("timestamp", timestamp);
      upload.set("folder", folder);
      upload.set("signature", signature);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(process.env.CLOUDINARY_CLOUD_NAME)}/image/upload`,
        { method: "POST", body: upload },
      );
      if (!response.ok)
        return Response.json(
          { error: "Image storage is unavailable. Please try again." },
          { status: 502 },
        );
      const result = await response.json();
      return Response.json({ url: result.secure_url });
    }
    const dir = path.join(process.cwd(), "public", "uploads");
    if (
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_LOCAL_DEMO !== "true"
    )
      return Response.json(
        {
          error:
            "Production image storage must be configured before uploading.",
        },
        { status: 503 },
      );
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    return Response.json({ url: `/uploads/${name}` });
  } catch {
    return Response.json(
      { error: "Sign in and try uploading again." },
      { status: 401 },
    );
  }
}
