# CameraStream 屏幕视频流
## usage
1. 导入 import
```
import { CameraStream } from "./CameraStream"
```

2. 启动视频流 startCapture
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

2. 停止视频流 stopCapture
```
cameraStream.stopCapture()
```
返回是否正常停止
