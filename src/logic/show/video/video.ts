import {
    danmakuApi, getLatWatchTime,
    getVideoBarrageList,
    getVideoContributionByID,
    likeVideo,
    sendVideoBarrage, sendWatchTime
} from "@/apis/contribution";
import globalScss from "@/assets/styles/global/export.module.scss";
import {useGlobalStore, useUserStore} from "@/store/main";
import {
    GetLastWatchTime,
    GetVideoBarrageListReq,
    GetVideoContributionByIDReq,
    LikeVideoReq,
    SendVideoBarrageReq, SendWatchTimeReq,
    VideoInfo
} from "@/types/show/video/video";
import DPlayer, {DPlayerDanmakuItem, DPlayerEvents, DPlayerVideoQuality} from "dplayer";
import Swal from 'sweetalert2';
import {Ref, UnwrapNestedRefs, reactive, ref} from "vue";
import {RouteLocationNormalizedLoaded, Router, useRoute, useRouter} from "vue-router";
import {numberOfViewers, responseBarrageNum} from './socketFun';



import * as tf from '@tensorflow/tfjs';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import {
    drawMask,
    MediaPipeSelfieSegmentationMediaPipeModelConfig,
    toBinaryMask
} from "@tensorflow-models/body-segmentation";
import video from "@/router/show/video";


const maskImageUrl=''

export const useVideoProp = () => {
    const route = useRoute()
    const router = useRouter()
    const global = useGlobalStore()
    const userStore = useUserStore()
    const videoRef = ref()
    const videoID = ref<number>(0)
    const videoInfo = reactive(<VideoInfo>{})
    const barrageInput = ref("")
    const barrageListShow = ref(false)
    const videoBarrage = ref(true)
    const liveNumber = ref(0)
    //回复二级评论
    const replyCommentsDialog = reactive({
        show: false,
        commentsID: 0,
    })

    return {
        route,
        router,
        userStore,
        videoRef,
        videoID,
        videoInfo,
        barrageInput,
        barrageListShow,
        liveNumber,
        replyCommentsDialog,
        videoBarrage,
        global
    }
}

export const useSendBarrage = async (text: Ref<string>, dpaler: DPlayer, userStore: any, videoInfo: UnwrapNestedRefs<VideoInfo>, socket: WebSocket) => {
    //结构体对象作为参数：可读性更好，且对参数顺序不敏感，也可以在结构体中方便的定义可选参数
    if(dpaler && dpaler.video){
        const currentTime=dpaler.video.currentTime;
        console.log("currentTime",currentTime)
    }else{
        console.error('dpaler or dpaler.video is undefined');
        return;
    }
    //将弹幕发送到数据库
    const res = await sendVideoBarrage(<SendVideoBarrageReq>{
        author: userStore.userInfoData.username,
        color: 16777215,
        id: videoInfo.videoInfo.id.toString(),
        text: text.value,
        time: dpaler.video.currentTime,
        type: 0,
        token: userStore.userInfoData.token,
    })

    if (res.code != 0) {
        Swal.fire({
            title: "弹幕服务异常",
            heightAuto: false,
            confirmButtonColor: globalScss.colorButtonTheme,
            icon: "error",
        })
        return
    }

    //当前用户视角，渲染弹幕
    const danmaku = <DPlayerDanmakuItem>{
        text: text.value,
        color: '#fff',
        type: 'right',
    };

    dpaler.danmaku.draw(danmaku);

    //清空输入框
    text.value = ""

    let data = JSON.stringify({
        type: "sendBarrage",
        data: ""
    })
    //socket发送弹幕给别人看
    socket.send(data)
}

export const useLikeVideo = async (videoInfo: UnwrapNestedRefs<VideoInfo>) => {
    try {
        //就一个参数：video_id
        await likeVideo(<LikeVideoReq>{
            video_id: videoInfo.videoInfo.id
        })
        videoInfo.videoInfo.is_like = !videoInfo.videoInfo.is_like
    } catch (err) {
        Swal.fire({
            title: "点赞失败",
            heightAuto: false,
            confirmButtonColor: globalScss.colorButtonTheme,
            icon: "error",
        })
    }
}

export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}分${remainingSeconds}秒`;
};


export const useInit = async (videoRef: Ref, route: RouteLocationNormalizedLoaded, Router: Router, videoID: Ref<Number>, videoInfo: UnwrapNestedRefs<VideoInfo>, global: any) => {
    try {
        //绑定视频id
        if (!route.params.id) {
            Router.back()
            Swal.fire({
                title: "获取视频失败",
                heightAuto: false,
                confirmButtonColor: globalScss.colorButtonTheme,
                icon: "error",
            })
            Router.back()
            return
        }
        global.globalData.loading.loading = true
        videoID.value = Number(route.params.id)
        //得到视频信息
        const vinfo = await getVideoContributionByID(<GetVideoContributionByIDReq>{
            video_id: videoID.value
        })
        if (!vinfo.data) return false
        videoInfo.videoInfo = vinfo.data.videoInfo
        videoInfo.recommendList = vinfo.data.recommendList

        //得到清晰度列表
        let quality: DPlayerVideoQuality[] = []
        if (videoInfo.videoInfo.video) {
            quality = [...quality, {
                name: "1080P超清",
                url: videoInfo.videoInfo.video
            }]
        }
        if (videoInfo.videoInfo.video_720p) {
            quality = [...quality, {
                name: "720P高清",
                url: videoInfo.videoInfo.video_720p
            }]
        }
        if (videoInfo.videoInfo.video_480p) {
            quality = [...quality, {
                name: "480P标清",
                url: videoInfo.videoInfo.video_480p
            }]
        }
        if (videoInfo.videoInfo.video_360p) {
            quality = [...quality, {
                name: "360P流畅",
                url: videoInfo.videoInfo.video_360p
            }]
        }
        //获取视频弹幕信息
        const barrageList = await getVideoBarrageList(<GetVideoBarrageListReq>{
            id: videoID.value.toString()
        })
        const lastWatchTimeInDatabase=await getLatWatchTime(<GetLastWatchTime>{
            id : videoID.value.toString()
        })


        if (!barrageList.data) return false
        videoInfo.barrageList = barrageList.data
        //获取当前用户信息
        const userStore = useUserStore()


        //初始化播放器
        const dp = new DPlayer({
            container: videoRef.value,
            loop: true, // 循环播放
            lang: "zh-cn", // 语言
            logo: "",
            autoplay: true,//自动播放
            danmaku: {
                id: videoID.value.toString(),//弹幕池id，需要唯一
                api: danmakuApi,
                token: userStore.userInfoData.token,//弹幕后端验证 token
                unlimited: true,
                // bottom:'15%',
            },
            mutex: false, // 互斥，阻止多个播放器同时播放
            video: {
                quality: quality,
                defaultQuality: 0,
                url: "不填",
                pic: videoInfo.videoInfo.cover,
            },
        });
        dp.video.crossOrigin='anonymous'  //解决canvas跨域错误

        let lastUpdateTime = 0;
        let isUpdating = false; // 用于防止并发调用
        // 初始化 WebSocket 连接
        let socket: WebSocket, sendMessage: (message: any) => void;
        ({socket, sendMessage} = useWebSocket(useUserStore(), videoInfo, Router, ref(0)));


        // 每3秒发送一次观看进度
        const videoPlayKey = `lastWatchTime_${videoID.value}`;
        dp.on(<DPlayerEvents>"timeupdate", async () => {
            const playTime = dp.video.currentTime; // 获取播放时间

            localStorage.setItem(videoPlayKey, String(playTime));

            // 获取当前时间
            const currentTime = Date.now();

            // 如果距离上次更新超过 3 秒，且没有正在进行的更新，发送请求
            if (currentTime - lastUpdateTime >= 3000 && !isUpdating) {
                isUpdating = true; // 标记为正在更新
                sendMessage({
                    type:"videoWatchProgress",
                    data:{
                        videoId: videoID.value.toString(),
                        currentTime: currentTime,
                    }
                })
                lastUpdateTime = currentTime; // 更新最后的时间戳

                try {
                    const res = await sendWatchTime(<SendWatchTimeReq>{
                        id: videoID.value.toString(),
                        time: playTime.toString(),
                    });

                    if (res.code !== 200) {
                        console.log("视频观看进度保存失败");
                    } else {
                        lastUpdateTime = currentTime; // 更新最后的时间戳
                    }
                } catch (error) {
                    console.error("发送视频观看进度时发生错误:", error);
                } finally {
                    isUpdating = false; // 无论成功或失败，标记为完成
                }
            }
        });

        let lastWatchedTime = parseFloat(localStorage.getItem(videoPlayKey))||0
        if (lastWatchTimeInDatabase){
            lastWatchedTime = parseFloat(lastWatchTimeInDatabase.data as any);
        }

        //加载上一次的观看进度
        dp.on(<DPlayerEvents>"loadedmetadata", () => {
            if (lastWatchedTime > 0) {
                const roundedTime = Math.floor(lastWatchedTime); // 将时间向下取整为整数
                dp.seek(lastWatchedTime); // 跳转到上次观看的时间点

                // 格式化时间并显示提示信息
                const formattedTime = formatTime(roundedTime);
                dp.notice(`上次观看到 ${formattedTime} ，自动跳转`, 1500,0.5); // 显示提示信息，持续 3 秒
            }
        });

        //初始化segmenter
        //这个是b站技术号教的
        // const model=bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation
        // const segmenterConfig:MediaPipeSelfieSegmentationMediaPipeModelConfig={
        //     runtime: 'mediapipe', // or 'tfjs'
        //     solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
        //     modelType: 'general'
        // }
        // const segmenter=await bodySegmentation.createSegmenter(model,segmenterConfig)
        //
        // // 检测每一帧，绘制图像
        // // @ts-ignore
        // dp.on("timeupdate",async ()=>{
        //
        //     //初始化canvas，设置width和height
        //     const canvas=document.createElement('canvas')
        //     canvas.width=dp.video.videoWidth
        //     canvas.height=dp.video.videoHeight
        //
        //     //1.绘制视频帧到canvas画布
        //     const ctx=canvas.getContext('2d')
        //     ctx.drawImage(dp.video,0,0,canvas.width,canvas.height)
        //     const imageData=ctx.getImageData(0,0,canvas.width,canvas.height)
        //     //2.人物分割
        //     const segmentation =await segmenter.segmentPeople(imageData)
        //     //3.生成二进制掩码
        //     const foregroundColor = { r: 0, g: 0, b: 0, a: 0 }//人物区域
        //     const backgroundColor = { r: 0, g: 0, b: 0, a: 255 }//北京区域
        //     const mask=await toBinaryMask(segmentation,foregroundColor,backgroundColor)
        //     //4.清除画布并绘制掩码
        //     ctx.clearRect(0,0,canvas.width,canvas.height)
        //     ctx.drawImage(await segmentation[0].mask.toCanvasImageSource(),0,0,canvas.width,canvas.height)
        //     //5.设置混合模式
        //     ctx.globalCompositeOperation="source-out";
        //     //6.反向填充黑色
        //     ctx.fillRect(0,0,canvas.width,canvas.height)
        //     //7.保存mask图片
        //     const dataUrl=canvas.toDataURL('image/png',0)
        //     //8.可以选择下载这些png图片
        //     const link=document.createElement('a')
        //     link.href=dataUrl
        //     link.download='mask_image.png'
        //     document.body.appendChild(link)
        //     link.click()
        //     document.body.removeChild(link)
        //     //todo:实现弹幕绘制
        //     const maskData = ctx.getImageData(0, 0, canvas.width, canvas.height);//获取掩码数据（人物区域）
        //     const maskArray=maskData.data//获取当前时间的视频帧区域
        // })
        global.globalData.loading.loading = false
        return dp
    } catch (err) {
        global.globalData.loading.loading = false
        console.log(err)
    }
}

interface WebSocketReturn {
    socket: WebSocket; // WebSocket 实例
    sendMessage: (message: any) => void; // 发送消息的函数
}


export const useWebSocket = (userStore: any, videoInfo: UnwrapNestedRefs<VideoInfo>, Router: Router, liveNumber: Ref<number>):WebSocketReturn  => {
    let socket: WebSocket
    //callback function
    const open = () => {
        console.log("websocket 连接成功 ")
    }
    const error = () => {
        console.error("websocket 连接失败")
    }
    const getMessage = async (msg: any) => {
        let data = JSON.parse(msg.data)
        switch (data.type) {
            //接受后台传过来的观看人数变动以及弹幕数变化
            case "numberOfViewers":
                numberOfViewers(liveNumber, data.data.people)
                break;
            case "responseBarrageNum":
                responseBarrageNum(videoInfo)
                break;
        }
    }

    const sendMessage=(message:any)=>{
        if (socket && socket.readyState==WebSocket.OPEN) {
            console.log("打印一下要发送的消息：",JSON.stringify(message))
            console.log(socket.url)
            socket.send(JSON.stringify(message))
        }else{
            console.error("websocket未连接，无法发送消息")
        }
    }

    if (typeof (WebSocket) === "undefined") {
        Swal.fire({
            title: "您的浏览器不支持socket",
            heightAuto: false,
            confirmButtonColor: globalScss.colorButtonTheme,
            icon: "error",
        })
        Router.back()
        return
    } else {
        // 实例化socket
        socket = new WebSocket(import.meta.env.VITE_SOCKET_URL + "/ws/videoSocket?token=" + userStore.userInfoData.token + "&videoID=" + videoInfo.videoInfo.id)
        // 监听socket连接
        socket.onopen = open
        // 监听socket错误信息
        socket.onerror = error
        // 监听socket消息
        socket.onmessage = getMessage
    }

    return {
        socket,
        sendMessage,
    }
}
