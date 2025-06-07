// Cloudinary configuration
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

/**
 * Resource types in Cloudinary
 */
export enum ResourceType {
  Image = "image",
  Video = "video",
}

/**
 * Result from Cloudinary upload operation
 */
interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  resource_type?: ResourceType;
  context?: {
    caption?: string;
    submitter_name?: string;
  };
}

/**
 * Standard format for a Cloudinary resource
 */
export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  created_at: string;
  width: number;
  height: number;
  resource_type?: ResourceType;
  tags?: string[];
  context?: {
    custom?: {
      caption?: string;
      submitter_name?: string;
    };
  };
}

/**
 * Response format from Cloudinary API
 */
export interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

// Define a type for the Cloudinary list item
interface CloudinaryListItem {
  public_id: string;
  version?: number;
  format?: string;
  width?: number;
  height?: number;
  created_at?: string;
  resource_type?: ResourceType;
  context?: {
    custom?: {
      caption?: string;
      submitter_name?: string;
    };
  };
}

/**
 * Uploads media (image or video) to Cloudinary
 */
export const uploadMedia = async (
  file: File,
  onProgress?: (progress: number) => void,
  caption?: string,
  submitterName?: string
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("tags", "wedding");

  // Build context string from available metadata
  if (caption || submitterName) {
    const contextParts = [];
    if (caption) contextParts.push(`caption=${caption}`);
    if (submitterName) contextParts.push(`submitter_name=${submitterName}`);
    formData.append("context", contextParts.join("|"));
  }

  // Determine resource type based on file MIME type
  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`
  );

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable && onProgress) {
      onProgress(Math.round((event.loaded / event.total) * 100));
    }
  };

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          public_id: response.public_id,
          secure_url: response.secure_url,
          width: response.width,
          height: response.height,
          resource_type: response.resource_type || "image",
        });
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
};

/**
 * Fetches resources of a specific type with the "wedding" tag from Cloudinary
 */
const fetchWeddingResourcesByType = async (
  resourceType: ResourceType
): Promise<CloudinaryResource[]> => {
  try {
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/list/wedding.json`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Failed to fetch ${resourceType}s from Cloudinary`);
      return [];
    }

    const data = await response.json();

    return data.resources.map((item: CloudinaryListItem) => ({
      public_id: item.public_id,
      secure_url: `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${item.public_id}`,
      created_at: item.created_at || new Date().toISOString(),
      width: item.width || 800,
      height: item.height || 600,
      resource_type: resourceType,
      tags: ["wedding"],
      context: item.context || { custom: {} },
    }));
  } catch (error) {
    console.error(`Error fetching ${resourceType}s from Cloudinary:`, error);
    return [];
  }
};

/**
 * Fetches both photos and videos with the "wedding" tag from Cloudinary
 * @throws Error if there's an issue fetching data from Cloudinary
 */
export const fetchWeddingMedia = async (): Promise<CloudinaryResource[]> => {
  try {
    const [photos, videos] = await Promise.all([
      fetchWeddingResourcesByType(ResourceType.Image),
      fetchWeddingResourcesByType(ResourceType.Video),
    ]);

    const allMedia = [...photos, ...videos];

    if (allMedia.length > 0) {
      return allMedia;
    }

    console.warn("No media found, returning empty array");
    return [];
  } catch (error) {
    console.error("Error fetching media from Cloudinary:", error);
    throw new Error(
      `Failed to fetch media: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Update uploadMediaToCloudinary to utilize onProgress parameter
export async function uploadMediaToCloudinary(
  file: File,
  submitterName: string,
  caption: string,
  onProgress: (progress: number) => void
): Promise<{
  id: string;
  publicId: string;
  url: string;
  caption: string;
  submitterName: string;
  createdAt: Date;
  width: number;
  height: number;
}> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append(
    "context",
    `caption=${caption}|submitter_name=${submitterName}`
  );

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    }
  };

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        resolve({
          id: result.public_id,
          publicId: result.public_id,
          url: result.secure_url,
          caption,
          submitterName,
          createdAt: new Date(),
          width: result.width,
          height: result.height,
        });
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.send(formData);
  });
}
