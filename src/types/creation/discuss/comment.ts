import { PageInfo } from "@/types/idnex";

export interface GetDiscussVideoListReq {
    page_info: PageInfo
}

export interface GetDiscussVideoListItem {
    id: number
    username: string
    photo: string
    comment: string
    cover: string
    title: string
    created_at: string
    videoId:number
    comment_id:number
    comment_user_id:number
}
export type GetDiscussVideoListRes = Array<GetDiscussVideoListItem>


export interface GetDiscussArticleListReq {
    page_info: PageInfo
}

export interface GetDiscussArticleListItem {
    id: number
    username: string
    photo: string
    comment: string
    cover: string
    title: string
    created_at: string
}
export type GetDiscussArticleListRes = Array<GetDiscussArticleListItem>