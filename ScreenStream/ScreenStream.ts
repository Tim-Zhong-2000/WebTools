/**
 * @description ScreenStream类 获取并且处理客户端屏幕视频流，支持共享屏幕，共享应用窗口，共享标签页(chrome)
 */
export class ScreenStream {
  isCapturing = false;
  screenStream = null;

  screencastConstraints = {
    video: true,
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  };

  /**
   * 开始屏幕抓取
   * @returns 获取到的屏幕流，获取失败返回null
   */
  async startCapture(): Promise<MediaStream | null> {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        await navigator.mediaDevices
          .getDisplayMedia(this.screencastConstraints)
          .then((stream: MediaStream) => (this.screenStream = stream));
        // console.log(this.screenStream);
        this.isCapturing = true;
        return this.screenStream;
      } catch (e) {
        console.log(e);
        console.log("屏幕获取失败！请检查权限");
        return null;
      }
    } else {
      console.log("浏览器不支持屏幕录制");
      return null;
    }
  }

  /**
   * 停止视频抓取
   */
  stopCapture(): boolean {
    if (!this.isCapturing) return false;
    this.screenStream.getTracks().forEach((track) => track.stop());
    this.screenStream = null;
    this.isCapturing = false;
    return true;
  }

  /**
   * 获取创建的视频流
   */
  getStream(): MediaStream | null {
    if (this.isCapturing && this.screenStream) return this.screenStream;
    return null;
  }

  /**
   * 获取所有音频轨道
   */
  getAudioTracks(): MediaStreamTrack[] | null {
    if (this.isCapturing && this.screenStream)
      return this.screenStream.getAudioTracks();
    return null;
  }

  /**
   * 获取所有视频轨道
   */
  getVideoTracks(): MediaStreamTrack[] | null {
    if (this.isCapturing && this.screenStream)
      return this.screenStream.getVideoTracks();
    return null;
  }

  /**
   * 添加视频或音频轨道
   * @param {*} track
   */
  addTrack(track: any): boolean {
    if (this.isCapturing && this.screenStream) {
      this.screenStream.addTrack(track);
      return true;
    }
    return false;
  }

  /**
   * 移除一个视频或音频轨道
   * @param {*} track
   */
  removeTrack(track: any): boolean {
    if (this.isCapturing && this.screenStream) {
      this.screenStream.removeTrack(track);
      return true;
    }
    return false;
  }
}
