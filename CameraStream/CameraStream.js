"use strict";
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
exports.__esModule = true;
exports.CameraStream = void 0;
/**
 * @description cameraStream类 获取并且处理客户端屏幕视频流，支持共享屏幕，共享应用窗口，共享标签页(chrome)
 */
var CameraStream = /** @class */ (function () {
    function CameraStream() {
        this.isCapturing = false;
        this.cameraStream = null;
        this.cameraConstraints = {
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };
    }
    /**
     * 启动摄像头与麦克风获取视频音频流
     * @returns 获取到的流，获取失败返回null
     */
    CameraStream.prototype.startCapture = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.mediaDevices
                                .getUserMedia(this.cameraConstraints)
                                .then(function (stream) { return (_this.cameraStream = stream); })];
                    case 2:
                        _a.sent();
                        // console.log(this.cameraStream);
                        this.isCapturing = true;
                        return [2 /*return*/, this.cameraStream];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        console.log("视频获取失败！请检查录像与录音权限");
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log("浏览器不支持调用多媒体设备");
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 停止视频抓取
     */
    CameraStream.prototype.stopCapture = function () {
        if (!this.isCapturing)
            return false;
        this.cameraStream.getTracks().forEach(function (track) { return track.stop(); });
        this.cameraStream = null;
        this.isCapturing = false;
        return true;
    };
    /**
     * 获取创建的视频流
     */
    CameraStream.prototype.getStream = function () {
        if (this.isCapturing && this.cameraStream)
            return this.cameraStream;
        return null;
    };
    /**
     * 获取所有音频轨道
     */
    CameraStream.prototype.getAudioTracks = function () {
        if (this.isCapturing && this.cameraStream)
            return this.cameraStream.getAudioTracks();
        return null;
    };
    /**
     * 获取所有视频轨道
     */
    CameraStream.prototype.getVideoTracks = function () {
        if (this.isCapturing && this.cameraStream)
            return this.cameraStream.getVideoTracks();
        return null;
    };
    /**
     * 添加视频或音频轨道
     * @param {*} track
     */
    CameraStream.prototype.addTrack = function (track) {
        if (this.isCapturing && this.cameraStream) {
            this.cameraStream.addTrack(track);
            return true;
        }
        return false;
    };
    /**
     * 移除一个视频或音频轨道
     * @param {*} track
     */
    CameraStream.prototype.removeTrack = function (track) {
        if (this.isCapturing && this.cameraStream) {
            this.cameraStream.removeTrack(track);
            return true;
        }
        return false;
    };
    return CameraStream;
}());
exports.CameraStream = CameraStream;
