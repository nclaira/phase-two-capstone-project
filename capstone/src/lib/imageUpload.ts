// Image Upload Utility Functions
// This file handles image uploads (currently mocked, but ready for real cloud storage)

// Interface for upload result
export interface UploadResult {
  url: string; // The URL of the uploaded image
  success: boolean; // Whether upload was successful
  error?: string; // Error message if upload failed
}

// Function to upload image to cloud storage
// In a real app, this would upload to Cloudinary, AWS S3, or similar
export async function uploadImage(file: File): Promise<UploadResult> {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real app, you would:
  // 1. Create FormData with the file
  // 2. Send POST request to your backend API
  // 3. Backend uploads to cloud storage (Cloudinary, S3, etc.)
  // 4. Backend returns the image URL
  // 5. Return the URL

  // For now, we'll create a mock URL using FileReader
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Create a data URL (base64) - in production, this would be a cloud URL
      const dataUrl = e.target?.result as string;

      resolve({
        url: dataUrl, // In production, this would be: https://cloudinary.com/image.jpg
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

    // Read file as data URL (base64)
    reader.readAsDataURL(file);
  });
}

// Function to validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image (JPEG, PNG, GIF, or WebP)",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 5MB",
    };
  }

  return { valid: true };
}
