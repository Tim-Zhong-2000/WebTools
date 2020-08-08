/**
 * @description cameraStream类 获取并且处理客户端屏幕视频流，支持共享屏幕，共享应用窗口，共享标签页(chrome)
 */
export class CameraStream {
  isCapturing = false;
  cameraStream = null;

  cameraConstraints = {
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };

  /**
   * 启动摄像头与麦克风获取视频音频流
   * @returns 获取到的流，获取失败返回null
   */
  async startCapture(): Promise<MediaStream | null> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices
          .getUserMedia(this.cameraConstraints)
          .then((stream: MediaStream) => (this.cameraStream = stream));
        // console.log(this.cameraStream);
        this.isCapturing = true;
        return this.cameraStream;
      } catch (e) {
        console.log(e);
        console.log("视频获取失败！请检查录像与录音权限");
        return null;
      }
    } else {
      console.log("浏览器不支持调用多媒体设备");
      return null;
    }
  }

  /**
   * 停止视频抓取
   */
  stopCapture(): boolean {
    if (!this.isCapturing) return false;
    this.cameraStream.getTracks().forEach((track) => track.stop());
    this.cameraStream = null;
    this.isCapturing = false;
    return true;
  }

  /**
   * 获取创建的视频流
   */
  getStream(): MediaStream | null {
    if (this.isCapturing && this.cameraStream) return this.cameraStream;
    return null;
  }

  /**
   * 获取所有音频轨道
   */
  getAudioTracks(): MediaStreamTrack[] | null {
    if (this.isCapturing && this.cameraStream)
      return this.cameraStream.getAudioTracks();
    return null;
  }

  /**
   * 获取所有视频轨道
   */
  getVideoTracks(): MediaStreamTrack[] | null {
    if (this.isCapturing && this.cameraStream)
      return this.cameraStream.getVideoTracks();
    return null;
  }

  /**
   * 添加视频或音频轨道
   * @param {*} track
   */
  addTrack(track: any): boolean {
    if (this.isCapturing && this.cameraStream) {
      this.cameraStream.addTrack(track);
      return true;
    }
    return false;
  }

  /**
   * 移除一个视频或音频轨道
   * @param {*} track
   */
  removeTrack(track: any): boolean {
    if (this.isCapturing && this.cameraStream) {
      this.cameraStream.removeTrack(track);
      return true;
    }
    return false;
  }
}