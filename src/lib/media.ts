export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'other';

export interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  media_type: MediaType;
  file_size: number;
  width?: number | null;
  height?: number | null;
  title?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  tags?: string[];
  uploaded_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaStats {
  totalCount: number;
  totalBytes: number;
  imageCount: number;
  videoCount: number;
  documentCount: number;
  audioCount: number;
  otherCount: number;
}

export function formatBytes(bytes: number | string | undefined | null, decimals = 1): string {
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : Number(bytes);
  if (!num || isNaN(num) || num <= 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(num) / Math.log(k));
  const sizeIdx = Math.min(i, sizes.length - 1);
  return `${parseFloat((num / Math.pow(k, sizeIdx)).toFixed(dm))} ${sizes[sizeIdx]}`;
}

export function getMediaTypeFromMime(mimeType: string, filename = ''): MediaType {
  const lowerMime = (mimeType || '').toLowerCase();
  const lowerExt = filename.toLowerCase().split('.').pop() || '';

  if (
    lowerMime.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif', 'bmp', 'ico', 'tiff'].includes(lowerExt)
  ) {
    return 'image';
  }

  if (
    lowerMime.startsWith('video/') ||
    ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(lowerExt)
  ) {
    return 'video';
  }

  if (
    lowerMime.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(lowerExt)
  ) {
    return 'audio';
  }

  if (
    lowerMime.includes('pdf') ||
    lowerMime.includes('word') ||
    lowerMime.includes('document') ||
    lowerMime.includes('sheet') ||
    lowerMime.includes('presentation') ||
    lowerMime.includes('text/') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'md'].includes(lowerExt)
  ) {
    return 'document';
  }

  return 'other';
}

export function inferMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  const map: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    avif: 'image/avif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
  };
  return map[ext] || 'application/octet-stream';
}
