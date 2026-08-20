export async function resizeImage(
  file: File,
  maxWidth = 1200
): Promise<Blob> {
  // Use createImageBitmap when available (better memory handling on mobile)
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      throw new Error("Could not get canvas context");
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (blob) resolve(blob);
          else reject(new Error("Could not create blob"));
        },
        "image/jpeg",
        0.85
      );
    });
  }

  // Fallback for browsers without createImageBitmap
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (blob) resolve(blob);
          else reject(new Error("Could not create blob"));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image"));
    };
    img.src = objectUrl;
  });
}
