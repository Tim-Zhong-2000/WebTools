var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Webrtc = /** @class */ (function () {
    function Webrtc(webrtcConfig) {
        this.CONFIG = {
            iceServers: [
                {
                    urls: "stun:stun.ekiga.net:3478"
                },
            ]
        };
        this.isOffer = false; // 当前对象是否是发起者
        this.dataChannel = null;
        this.senders = [];
        this.downloading = false;
        this.downloadedSize = 0;
        this.downloadFileTemp = [];
        if (webrtcConfig) {
            var onSendIce = webrtcConfig.onSendIce, onSendSdp = webrtcConfig.onSendSdp, onConnectionStateChange = webrtcConfig.onConnectionStateChange, onStreamLoad = webrtcConfig.onStreamLoad, onDataReceive = webrtcConfig.onDataReceive, onDataChannelPercent = webrtcConfig.onDataChannelPercent, onDataChannelStateChange = webrtcConfig.onDataChannelStateChange;
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
    Webrtc.prototype.init = function () {
        var _this = this;
        console.log("\u521D\u59CB\u5316");
        this.peer = new RTCPeerConnection(this.CONFIG);
        this.peer.onicecandidate = function (e) {
            return _this.iceCandidateHandler(e);
        };
        this.peer.ontrack = function (e) { return _this.trackHandler(e); };
        this.peer.ondatachannel = function (e) {
            return _this.dataChannelHandler(e);
        };
        var lastState;
        setInterval(function () {
            var nowState = _this.peer.connectionState;
            // 防止无意义刷新
            // if (nowState === lastState) return;
            // lastState === nowState;
            if (nowState === "connected")
                _this.onConnectionStateChange && _this.onConnectionStateChange(nowState);
        }, 500);
    };
    /**
     * 处理ice candidate交换过程
     * 此函数在添加对方ice时触发
     * @param e
     */
    Webrtc.prototype.iceCandidateHandler = function (e) {
        if (e.candidate) {
            console.log("\u53D1\u9001\u81EA\u8EABice");
            // 发送自身ice
            this.onSendIce(e.candidate);
        }
        else {
            console.log("ice\u4FE1\u606F\u4EA4\u6362\u5B8C\u6210");
        }
    };
    /**
     * 处理传入多媒体流
     */
    Webrtc.prototype.trackHandler = function (e) {
        if (e && e.streams) {
            this.onStreamLoad(e.streams);
        }
    };
    /**
     * 初始化本地会话 设定为发起者(offer)并发送sdp
     * 会话描述`sessionDescription`简称`sdp`
     */
    Webrtc.prototype.initOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("initOffer");
                        this.isOffer = true;
                        return [4 /*yield*/, this.peer.createOffer()];
                    case 1:
                        offer = _a.sent();
                        this.peer.setLocalDescription(offer);
                        this.onSendSdp(offer);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 添加远程会话
     * 不是发起者：添加对方`sdp`到`远程会话`中->创建answer`sdp`并发送 (非发起者此时还没有初始化本地session)
     * 发起者：添加对方`sdp`到`远程会话`中 (发起者此时已经创建过本地session)
     * 会话描述`sessionDescription`简称`sdp`
     * @param remoteSessionDescription 对方`sdp`
     */
    Webrtc.prototype.addRemoteSession = function (remoteSessionDescription) {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("addRemoteSession");
                        return [4 /*yield*/, this.peer.setRemoteDescription(remoteSessionDescription)];
                    case 1:
                        _a.sent();
                        if (!!this.isOffer) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.peer.createAnswer()];
                    case 2:
                        answer = _a.sent();
                        return [4 /*yield*/, this.peer.setLocalDescription(answer)];
                    case 3:
                        _a.sent();
                        this.onSendSdp(answer);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 添加ice信息
     * @param ice 对方客户端的ice信息
     */
    Webrtc.prototype.addIceCandidate = function (ice) {
        console.log("addIceCandidate");
        this.peer.addIceCandidate(ice);
    };
    /**
     * 关闭这个连接
     */
    Webrtc.prototype.close = function () {
        this.peer.close();
        this.peer = null;
    };
    /**
     * 向当前会话添加多媒体流
     * @param stream 加入当前会话多媒体流
     */
    Webrtc.prototype.addStream = function (stream) {
        var _this = this;
        stream.getTracks().forEach(function (track) {
            _this.senders.push(_this.peer.addTrack(track, stream));
        });
    };
    /**
     * 移除当前会话所有多媒体流
     */
    Webrtc.prototype.removeAllStream = function () {
        var _this = this;
        this.senders.forEach(function (sender) {
            _this.peer.removeTrack(sender);
        });
    };
    /**test */
    Webrtc.prototype.dataChannelHandler = function (e) {
        var _this = this;
        var receiveChannel = e.channel;
        receiveChannel.onmessage = function (e) {
            if (_this.downloading) {
                _this.processDownload(e.data);
            }
            else {
                _this.initDownload(e.data);
            }
        };
    };
    /**
     * 初始化data channel
     */
    Webrtc.prototype.initDataChannel = function () {
        var _this = this;
        this.dataChannel = this.peer.createDataChannel("channel", null);
        setInterval(function () { _this.onDataChannelStateChange(_this.dataChannel.readyState); }, 500);
    };
    /**
     * 通过dataChannel发送字符串
     * @param data
     */
    Webrtc.prototype.sendString = function (data) {
        try {
            this.sendData(data);
        }
        catch (e) {
            console.log(e);
        }
    };
    /**
     * 发送文件
     * @param file
     * @returns 成功返回true
     */
    Webrtc.prototype.sendFile = function (file) {
        try {
            var fileInfo = {
                name: file.name,
                size: file.size
            };
            this.sendString(JSON.stringify(fileInfo));
            return this.readAndSendFile(file);
        }
        catch (e) {
            // TODO
            console.log(e);
        }
    };
    /**
     * 文件切片后发送
     */
    Webrtc.prototype.readAndSendFile = function (file) {
        var _this = this;
        var offset = 0;
        var bufferSize = 10240;
        var size = file.size;
        var fileReader = new FileReader();
        if (size <= 0)
            throw new Error("empty file is invaild");
        fileReader.onload = function (e) {
            var data = e.target.result;
            _this.sendData(data);
            offset += data.byteLength;
            _this.onDataChannelPercent && _this.onDataChannelPercent(offset / size); // 显示传输进度
            if (offset < size) {
                fileReader.readAsArrayBuffer(file.slice(offset, offset + bufferSize)); // 读取下一个分块
            }
        };
        fileReader.readAsArrayBuffer(file.slice(0, size < bufferSize ? size : bufferSize));
        return true;
    };
    /**
     * dataChannel 底层发送方法
     * @param data
     */
    Webrtc.prototype.sendData = function (data) {
        if (!this.dataChannel && this.dataChannel.readyState !== "open")
            throw new Error("data channel is not ready");
        else
            this.dataChannel.send(data);
    };
    /**初始化下载 加载文件信息 */
    Webrtc.prototype.initDownload = function (info) {
        try {
            this.downloadFileInfo = JSON.parse(info);
            if (this.downloadFileInfo.size)
                this.downloading = true;
            console.log(this.downloadFileInfo);
        }
        catch (_a) {
            this.downloading = false;
            throw new Error("文件信息不合法");
        }
    };
    Webrtc.prototype.processDownload = function (data) {
        if (!this.downloading || !this.downloadFileInfo)
            throw new Error("未收到文件信息，不可进行下载");
        this.downloadedSize += data.byteLength;
        this.downloadFileTemp.push(data);
        this.onDataChannelPercent &&
            this.onDataChannelPercent(this.downloadedSize / this.downloadFileInfo.size); // 显示传输进度
        // console.log(`
        //   进度：
        //   ${((this.downloadedSize / this.downloadFileInfo.size) * 100).toFixed(2)}
        // `);
        if (this.downloadedSize === this.downloadFileInfo.size) {
            console.log(" \u5B8C\u6210\u4E0B\u8F7D");
            var downloadedFile = {
                fileInfo: this.downloadFileInfo,
                file: new Blob(this.downloadFileTemp)
            };
            this.onDataReceive(downloadedFile);
            this.downloading = false;
            this.clearDownloadTemp();
        }
    };
    Webrtc.prototype.clearDownloadTemp = function () {
        this.downloadFileInfo = null;
        this.downloadedSize = 0;
        this.downloadFileTemp = [];
    };
    return Webrtc;
}());
