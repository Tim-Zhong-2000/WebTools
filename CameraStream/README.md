# ScreenStream 屏幕视频流
## usage
1. startCapture
``` 
const cameraStream = new CameraStream();
cameraStream.startCapture().then( stream => {
    if(stream) {
        // do something...
    }
})
```
获取成功返回视频与音频流
获取失败返回null

2. stopCapture
```
cameraStream.stopCapture()
```
返回是否正常停止