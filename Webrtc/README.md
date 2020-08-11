# Webrtc 点到点实时多媒体与文件传输

## usage

1. 导入 import

```
import { Webrtc } from "./Webrtc"
```

或者直接在 js 中

```
const peer = new Webrtc(WebrtcConfig)
```

2. `onSendIce` 事件:发送 ICE

```
peer.onSendIce = (iceCandidate)=>{
    // use a signal server to send iceCandidate to peer
}
```

3. `addIceCandidate` 接收到对方 iceCandidate 后的处理

```
// 当收到对方的iceCandidate时，需要添加给当前Webrtc
    peer.addIceCandidate(`接收到的ice`)
```

4. `onSendSdp` 事件:发送 sdp(会话描述/sessionDescription)

```
peer.onSendSdp = (sdp)=>{
    // use a signal server to send iceCandidate to peer
}
```

5. `addRemoteSession` 接收到对方 sdp(会话描述/sessionDescription)后的处理

```
// 当收到对方的iceCandidate时，需要添加给当前Webrtc
    peer.addRemoteSession(`接收到的sdp`)
```

6. `initOffer` 将自己作为发起者，并且与对方建立连接

```
peer.initOffer()
```

然后会触发`onSendSdp`进行 peer 连接

7. `onConnectionStateChange` 事件:连接状态改变

```
peer.onConnectionStateChange = (state) => {
    // do somthing
    // 比如显示当前连接状态
}
```

8. `onStreamLoad` 事件:接收视频流

```
peer.onStreamLoad = (stream) => {
    // do somthing
    // 比如播放这个视频流
}
```

9. `addStream` 添加视频流

```
peer.addStream(mediaStream)
```

10. `removeAllStream` 移除全部视频流

```
peer.removeAllStream()
```

11. `sendFile` 向对方发送文件
    前提条件：已经建立 WebRTC 连接，两端都完成了数据通道的初始化

```
peer.sendFile(file)
```

12. `onDataReceive` 事件:接收到文件

```
peer.onDataReceive = (file) => {
    // do something
    // 比如下载文件
}
```

13. `onDataChannelPercent` 事件:每完成一个分块的上传或者下载

```
// percent is around 0-1
peer.onDataChannelPercent = (percent) => {
    // do something
    // 比如显示上传/下载进度
}
```

14. `onDataChannelStateChange` 事件:数据通道状态改变

```
// state: "closed" | "connecting" | "closing" | "open"
peer.onDataChannelStateChange = (state) => {
    // do something
    // 比如显示数据通道状态
}
```
