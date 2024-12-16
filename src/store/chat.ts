import {ChatList, MessageInfo} from "@/types/store/chat"
import {timetoRFC3339} from "@/utils/conversion/timeConversion"
import {defineStore} from "pinia"
import {ref} from "vue"

export const useChatListStore = defineStore("caht", () => {
    const isShow = ref(false)
    const chatListData = ref(<ChatList>[])
    const tid = ref(0)
    const tUsername = ref("")

    const setChatListData = (info: ChatList) => {
        chatListData.value = info
    }

    //删除记录
    const deleteItemByid = (tid: number) => {
        chatListData.value = chatListData.value.filter((item) => {
            return item.to_id != tid    //因为chatListData里放的是当前用户的全部聊天信息，所以传递过来tid，将这一项删除掉就行，其余的仍然保留
        })
    }

    //清空未读消息
    const clearUnread = (tid: number) => {
        chatListData.value = chatListData.value.filter((item) => {
            if (item.to_id == tid) {
                item.unread = 0
            }
            return item
        })
    }
    //添加消息
    const addMessage = (tid: number, info: MessageInfo) => {
        chatListData.value = chatListData.value.filter((item) => {
            if (item.to_id == tid) {
                //更换最后一条记录 
                item.last_message = info.message
                item.last_at = timetoRFC3339(new Date())
                item.message_list = [...item.message_list, info]
            }
            return item
        })
    }


    return {
        isShow,
        chatListData,
        setChatListData,
        tid,
        tUsername,
        deleteItemByid,
        clearUnread,
        addMessage
    }
}, {
    //只持久化聊天相关数据
    persist: [
        {
            paths: ['chatListData'],
            storage: localStorage,
        }
    ]
})