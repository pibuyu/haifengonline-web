import {PageInfo} from "@/types/idnex"

export interface GetVideoContributionByIDReq {
    video_id: number
}

export interface GetVideoContributionByIDRes {
    videoInfo: VInfo
    recommendList: RecommendList
}

interface creatorInfo {
    id: number
    username: string
    avatar: string
    signature: string
    is_attention: boolean
}

export interface VideoInfo {
    videoInfo: VInfo
    recommendList: RecommendList
    barrageList: GetVideoBarrageListRes
}

export interface VInfo {
    id: number
    uid: number
    title: string
    video: string
    video_720p: string
    video_480p: string
    video_360p: string
    cover: string
    video_duration: number
    label: Array<string>
    introduce: string
    heat: number
    barrageNumber: number
    comments: commentsList
    comments_number: number
    is_like: boolean,
    is_collect: boolean,
    creatorInfo: creatorInfo
    created_at: string
    like_num: number
    collect_num: number
}

export interface RecommendViodeInfo {
    id: number
    uid: number
    title: string
    video: string
    cover: string
    video_duration: number
    label: Array<string>
    introduce: string
    heat: number
    barrageNumber: number
    username: string
    created_at: string
}

export type RecommendList = Array<RecommendViodeInfo>


export interface GetVideoBarrageListReq {
    id: string
}

export interface SendWatchTimeReq{
    id:string
    time:string
}

export interface GetLastWatchTime{
    id:string
}

export interface GetVideoCommentCountByIdReq {
    id: string
}

export interface GetVideoBarrageListRes {
    time: number
    text: string
    sendTime: string
}

export interface GetVideoCommentCountById {
    count: number
}


export interface SendVideoBarrageReq {
    author: string
    color: number
    id: string
    text: string
    time: number
    type: number
    token: string
}


export interface VideoPostCommentReq {
    video_id: number
    content: string
    content_id: number
}

export interface GetVideoCommentReq {
    pageInfo: PageInfo
    video_id: number
}

export interface Comments {
    id: number     //唯一标识
    comment_id: number    //被评论的那条评论的id
    created_at: string
    context: string
    comment_user_id: number  //我评论的这条评论是谁发出的
    comment_user_name: string //应该是被评论者的名字
    uid: number   // 我是谁（发出这条评论的人的id）
    username: string  //应该是我的名字
    photo: string
    lowerComments: any  //子评论
}


export type commentsList = Array<Comments>

export interface GetVideoCommentRes {
    id: number
    comments: commentsList
    comments_number: number
}

export interface LikeVideoReq {
    video_id: number
}