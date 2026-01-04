export class VideoService {
  static async generateThumbnail(videoBuffer) {
    // Por enquanto retorna null - implementar FFmpeg depois
    return null;
  }

  static async getVideoMetadata(videoBuffer) {
    return {};
  }

  static async validateVideo(videoBuffer) {
    return true; // Por enquanto aceita todos
  }
}
