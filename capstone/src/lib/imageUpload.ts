export interface UploadResult {
  url: string; 
  success: boolean; 
  error?: string; 
}

export async function uploadImage(file: File): Promise<UploadResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      resolve({
        url: dataUrl, 
        success: true,
      });
    };

    reader.onerror = () => {
      resolve({
        url: "",
        success: false,
        error: "Failed to read image file",
      });
    };


    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
 
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image (JPEG, PNG, GIF, or WebP)",
    };
  }

  const maxSize = 5 * 1024 * 1024; 
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 5MB",
    };
  }

  return { valid: true };
}
