/**
 * @description WebRTC PeerConnection封装
 * 1. 封装`sessionDescription`交换过程,提供SendSdp事件
 * 2. 封装`iceCandidate`交换过程,提供SendIce事件
 * 3. 封装`dataChannel`,提供文件发送函数
 * 4. 封装多媒体流部分,提供添加移除流函数
 * @author Tim-Zhong-2000
 */
interface WebrtcConfig {
  onSendIce: (this: Webrtc, iceCandidate: RTCIceCandidate) => any;
  onSendSdp: (this: Webrtc, sdp: RTCSessionDescriptionInit) => any;
  onConnectionStateChange: (this: Webrtc, state: RTCPeerConnectionState) => any;
  onStreamLoad: (this: Webrtc, streams: readonly MediaStream[]) => any;
  onDataReceive: (this: Webrtc, dataEvent: any) => any;
  onDataChannelPercent: (this: Webrtc, percentage: number) => any; // 发送或接收的百分比
  onDataChannelStateChange: (
    this: Webrtc,
    state: RTCDataChannelState
  ) => any;
}
interface FileInfo {
  name: string;
  size: number;
}

class Webrtc {
  private peer!: RTCPeerConnection;
  private CONFIG: RTCConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.ekiga.net:3478",
      },
    ],
  };
  private isOffer: boolean = false; // 当前对象是否是发起者
  private dataChannel: RTCDataChannel = null;

  onSendIce: (this: Webrtc, e: RTCIceCandidate) => any;
  onSendSdp: (this: Webrtc, sdp: RTCSessionDescriptionInit) => any;
  onConnectionStateChange: (this: Webrtc, state: RTCPeerConnectionState) => any;
  onStreamLoad: (this: Webrtc, streams: readonly MediaStream[]) => any;
  onDataReceive: (this: Webrtc, dataEvent: any) => any;
  onDataChannelPercent: (this: Webrtc, percentage: number) => any;
  onDataChannelStateChange: (
    this: Webrtc,
    state: RTCDataChannelState
  ) => any;

  constructor(webrtcConfig?: WebrtcConfig) {
    if (webrtcConfig) {
      const {
        onSendIce,
        onSendSdp,
        onConnectionStateChange,
        onStreamLoad,
        onDataReceive,
        onDataChannelPercent,
        onDataChannelStateChange,
      } = webrtcConfig;
      this.onSendIce = onSendIce;
      this.onSendSdp = onSendSdp;
      this.onConnectionStateChange = onConnectionStateChange;
      this.onStreamLoad = onStreamLoad;
      this.onDataReceive = onDataReceive;
      this.onDataChannelPercent = onDataChannelPercent;
      this.onDataChannelStateChange = onDataChannelStateChange;
    }
    this.init();
    this.initDataChannel();
  }

  /**
   * 初始化RTC
   */
  private init() {
    console.log(`初始化`);
    this.peer = new RTCPeerConnection(this.CONFIG);
    this.peer.onicecandidate = (e: RTCPeerConnectionIceEvent) =>
      this.iceCandidateHandler(e);
    this.peer.ontrack = (e: RTCTrackEvent) => this.trackHandler(e);
    this.peer.ondatachannel = (e: RTCDataChannelEvent) =>
      this.dataChannelHandler(e);

    let lastState: RTCPeerConnectionState;
    setInterval(() => {
      const nowState = this.peer.connectionState;
      // 防止无意义刷新
      // if (nowState === lastState) return;
      // lastState === nowState;
      if (nowState === "connected")
        this.onConnectionStateChange && this.onConnectionStateChange(nowState);
    }, 500);
  }

  /**
   * 处理ice candidate交换过程
   * 此函数在添加对方ice时触发
   * @param e
   */
  private iceCandidateHandler(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      console.log(`发送自身ice`);
      // 发送自身ice
      this.onSendIce(e.candidate);
    } else {
      console.log(`ice信息交换完成`);
    }
  }

  /**
   * 处理传入多媒体流
   */
  private trackHandler(e: RTCTrackEvent) {
    if (e && e.streams) {
      this.onStreamLoad(e.streams);
    }
  }

  /**
   * 初始化本地会话 设定为发起者(offer)并发送sdp
   * 会话描述`sessionDescription`简称`sdp`
   */
  async initOffer() {
    console.log(`initOffer`);
    this.isOffer = true;
    const offer = await this.peer.createOffer();
    this.peer.setLocalDescription(offer);
    this.onSendSdp(offer);
  }

  /**
   * 添加远程会话
   * 不是发起者：添加对方`sdp`到`远程会话`中->创建answer`sdp`并发送 (非发起者此时还没有初始化本地session)
   * 发起者：添加对方`sdp`到`远程会话`中 (发起者此时已经创建过本地session)
   * 会话描述`sessionDescription`简称`sdp`
   * @param remoteSessionDescription 对方`sdp`
   */
  async addRemoteSession(remoteSessionDescription: RTCSessionDescriptionInit) {
    console.log(`addRemoteSession`);
    await this.peer.setRemoteDescription(remoteSessionDescription);
    if (!this.isOffer) {
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      this.onSendSdp(answer);
    }
  }

  /**
   * 添加ice信息
   * @param ice 对方客户端的ice信息
   */
  addIceCandidate(ice: RTCIceCandidate) {
    console.log(`addIceCandidate`);
    this.peer.addIceCandidate(ice);
  }

  /**
   * 关闭这个连接
   */
  close() {
    this.peer.close();
    this.peer = null;
  }

  senders: RTCRtpSender[] = [];
  /**
   * 向当前会话添加多媒体流
   * @param stream 加入当前会话多媒体流
   */
  addStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.senders.push(this.peer.addTrack(track, stream));
    });
  }

  /**
   * 移除当前会话所有多媒体流
   */
  removeAllStream() {
    this.senders.forEach((sender) => {
      this.peer.removeTrack(sender);
    });
  }

  /**test */
  private dataChannelHandler(e: RTCDataChannelEvent) {
    const receiveChannel = e.channel;
    receiveChannel.onmessage = (e) => {
      if (this.downloading) {
        this.processDownload(e.data);
      } else {
        this.initDownload(e.data);
      }
    };
  }

  /**
   * 初始化data channel
   */
  private initDataChannel() {
    this.dataChannel = this.peer.createDataChannel("channel", null);
    setInterval(()=>{this.onDataChannelStateChange(this.dataChannel.readyState)},500)
  }

  /**
   * 通过dataChannel发送字符串
   * @param data
   */
  sendString(data: string) {
    try {
      this.sendData(data);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 发送文件
   * @param file
   * @returns 成功返回true
   */
  sendFile(file: File) {
    try {
      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
      };
      this.sendString(JSON.stringify(fileInfo));
      return this.readAndSendFile(file);
    } catch (e) {
      // TODO
      console.log(e);
    }
  }

  /**
   * 文件切片后发送
   */
  private readAndSendFile(file: File) {
    let offset = 0;
    const bufferSize = 10240;
    const size = file.size;
    const fileReader = new FileReader();
    if (size <= 0) throw new Error("empty file is invaild");

    fileReader.onload = (e) => {
      const data = e.target.result as ArrayBuffer;
      this.sendData(data);
      offset += data.byteLength;
      this.onDataChannelPercent && this.onDataChannelPercent(offset / size); // 显示传输进度
      if (offset < size) {
        fileReader.readAsArrayBuffer(file.slice(offset, offset + bufferSize)); // 读取下一个分块
      }
    };
    fileReader.readAsArrayBuffer(
      file.slice(0, size < bufferSize ? size : bufferSize)
    );
    return true;
  }

  /**
   * dataChannel 底层发送方法
   * @param data
   */
  private sendData(data: string | Blob | ArrayBuffer | ArrayBufferView) {
    if (!this.dataChannel && this.dataChannel.readyState !== "open")
      throw new Error("data channel is not ready");
    else this.dataChannel.send(data);
  }

  downloadFileInfo: FileInfo;
  downloading = false;
  downloadedSize = 0;
  downloadFileTemp = [];

  /**初始化下载 加载文件信息 */
  initDownload(info: string) {
    try {
      this.downloadFileInfo = JSON.parse(info);
      if (this.downloadFileInfo.size) this.downloading = true;
      console.log(this.downloadFileInfo);
    } catch {
      this.downloading = false;
      throw new Error("文件信息不合法");
    }
  }

  processDownload(data) {
    if (!this.downloading || !this.downloadFileInfo)
      throw new Error("未收到文件信息，不可进行下载");
    this.downloadedSize += data.byteLength;
    this.downloadFileTemp.push(data);
    
    this.onDataChannelPercent &&
    this.onDataChannelPercent(
      this.downloadedSize / this.downloadFileInfo.size
    ); // 显示传输进度

    if (this.downloadedSize === this.downloadFileInfo.size) {
      console.log(` 完成下载`);
      const downloadedFile = {
        fileInfo: this.downloadFileInfo,
        file: new Blob(this.downloadFileTemp),
      };
      this.onDataReceive(downloadedFile);
      this.downloading = false;
      this.clearDownloadTemp();
    }
  }

  private clearDownloadTemp() {
    this.downloadFileInfo = null;
    this.downloadedSize = 0;
    this.downloadFileTemp = [];
  }
}
