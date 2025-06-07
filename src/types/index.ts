/**
 * Represents a media item (image or video) in the application
 */
export interface Media {
  id: string;
  url: string;
  publicId: string;
  caption?: string;
  submitterName?: string;
  createdAt: Date;
  width: number;
  height: number;
  mediaType: "image" | "video";
}

/**
 * Represents the state of a media upload operation
 */
export type UploadState = "idle" | "uploading" | "completed" | "error";

/**
 * Extends File with a preview URL string
 */
export interface FileWithPreview extends File {
  preview: string;
}

/**
 * Media type options for camera capture
 */
export type MediaType = "image" | "video";
