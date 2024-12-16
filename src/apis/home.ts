import {GetHomeInfoReq, GetHomeInfoRes, SubmitBugReqStruct} from "@/types/home/home";
import httpRequest from "@/utils/requst"

//获取主页信息
export const getHomeInfo = (params: GetHomeInfoReq) => {
    return httpRequest.post<GetHomeInfoRes>('/home/getHomeInfo',params);
}

export const submitBugReq=(params:SubmitBugReqStruct)=>{
    return httpRequest.post<SubmitBugReqStruct>('/home/submitBug',params);
}