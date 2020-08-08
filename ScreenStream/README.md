# ScreenStream 屏幕视频流
## usage
1. 导入 import
```
import { ScreenStream } from "./ScreenStream"
```

2. 启动屏幕视频流 `startCapture`
``` 
const screenStream = new ScreenStream();
screenStream.startCapture().then( stream => {
    if(stream) {
        // do something...
    }
})
```
获取成功返回视频与音频流
获取失败返回null

3. 停止屏幕视频流 `stopCapture`
```
screenStream.stopCapture()
```
返回是否正常停止