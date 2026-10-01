import { requireUser, sameOrigin, rateLimit } from "@/lib/auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";

export async function POST(req: Request) {
  try {
    sameOrigin(req);

    const user = await requireUser();

    rateLimit(`upload:${user.id}`, 20);

    const contentLength = Number(
      req.headers.get("content-length") ?? 0,
    );

    if (contentLength > 6 * 1024 * 1024) {
      return Response.json(
        {
          error: "Choose an image under 5 MB.",
        },
        { status: 413 },
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (
      !(file instanceof File) ||
      file.size > 5 * 1024 * 1024
    ) {
      return Response.json(
        {
          error:
            "Choose a JPG, PNG or WebP image under 5 MB.",
        },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(
      await file.arrayBuffer(),
    );

    const ext = bytes
      .subarray(0, 3)
      .equals(
        Buffer.from([255, 216, 255]),
      )
      ? "jpg"
      : bytes
            .subarray(0, 8)
            .equals(
              Buffer.from([
                137, 80, 78, 71,
                13, 10, 26, 10,
              ]),
            )
        ? "png"
        : bytes.toString(
              "ascii",
              0,
              4,
            ) === "RIFF" &&
            bytes.toString(
              "ascii",
              8,
              12,
            ) === "WEBP"
          ? "webp"
          : null;

    if (!ext) {
      return Response.json(
        {
          error:
            "This file is not a supported image. Use JPG, PNG or WebP.",
        },
        { status: 400 },
      );
    }

    const name = `${randomUUID()}.${ext}`;

    /*
     * CLOUDINARY PRODUCTION STORAGE
     */
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const timestamp = String(
        Math.floor(Date.now() / 1000),
      );

      /*
       * Modern Cloudinary accounts normally use
       * Dynamic Folders.
       *
       * asset_folder places the uploaded image
       * inside this folder in the Cloudinary
       * Media Library.
       */
      const assetFolder = "solid-connect";

      /*
       * Every signed upload parameter except:
       * - file
       * - api_key
       * - resource_type
       * - cloud_name
       *
       * must be included in the signature.
       *
       * Parameters must also be alphabetically
       * ordered.
       */
      const stringToSign =
        `asset_folder=${assetFolder}` +
        `&timestamp=${timestamp}` +
        process.env.CLOUDINARY_API_SECRET;

      const signature = createHash("sha1")
        .update(stringToSign)
        .digest("hex");

      const upload = new FormData();

      upload.set("file", file);
      upload.set(
        "api_key",
        process.env.CLOUDINARY_API_KEY,
      );
      upload.set(
        "timestamp",
        timestamp,
      );
      upload.set(
        "asset_folder",
        assetFolder,
      );
      upload.set(
        "signature",
        signature,
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(
          process.env.CLOUDINARY_CLOUD_NAME,
        )}/image/upload`,
        {
          method: "POST",
          body: upload,
        },
      );

      if (!response.ok) {
        /*
         * Cloudinary provides useful information
         * in either the response body or the
         * X-Cld-Error header.
         *
         * Log the provider error on Railway,
         * but don't expose credentials.
         */
        const providerError =
          response.headers.get(
            "x-cld-error",
          );

        let responseMessage = "";

        try {
          const result =
            await response.json();

          responseMessage =
            result?.error?.message ??
            "";
        } catch {
          responseMessage = "";
        }

        console.error(
          "Cloudinary upload failed:",
          providerError ||
            responseMessage ||
            `HTTP ${response.status}`,
        );

        return Response.json(
          {
            error:
              "Image upload failed. Please try again.",
          },
          { status: 502 },
        );
      }

      const result =
        await response.json();

      if (!result.secure_url) {
        console.error(
          "Cloudinary upload succeeded without secure_url.",
        );

        return Response.json(
          {
            error:
              "Image upload did not return a valid image URL.",
          },
          { status: 502 },
        );
      }

      return Response.json({
        url: result.secure_url,
      });
    }

    /*
     * LOCAL DEVELOPMENT STORAGE
     */
    const dir = path.join(
      process.cwd(),
      "public",
      "uploads",
    );

    if (
      process.env.NODE_ENV ===
        "production" &&
      process.env.ALLOW_LOCAL_DEMO !==
        "true"
    ) {
      return Response.json(
        {
          error:
            "Production image storage is not configured. Check the Cloudinary environment variables.",
        },
        { status: 503 },
      );
    }

    await mkdir(dir, {
      recursive: true,
    });

    await writeFile(
      path.join(dir, name),
      bytes,
    );

    return Response.json({
      url: `/uploads/${name}`,
    });
  } catch (error) {
    console.error(
      "Image upload route failed:",
      error instanceof Error
        ? error.message
        : "Unknown error",
    );

    return Response.json(
      {
        error:
          "Sign in and try uploading again.",
      },
      { status: 401 },
    );
  }
}