export interface UploadResult {
  url: string; 
  success: boolean; 
  error?: string; 
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    return {
      url: data.url,
      success: data.success,
      error: data.error,
    };
  } catch (error) {
    return {
      url: "",
      success: false,
      error: "Failed to upload image",
    };
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image (JPEG, PNG, GIF, or WebP)",
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB for cloud storage
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 10MB",
    };
  }

  return { valid: true };
}
