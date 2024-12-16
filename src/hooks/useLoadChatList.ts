import {getChatList} from "@/apis/personal";
import {useChatListStore} from "@/store/chat";


//这里加载聊天数据是更新ChatListStore里的聊天数据
export default async () => {
    const chatListStore = useChatListStore()
    try {
        let response = await getChatList()
        // console.log('获取消息列表的返回结果为', response)
        if (!response.data) return false
        const chatList = response.data.filter((item) => {
            item.message_list = item.message_list.reverse()
            return item
        })
        chatListStore.chatListData = chatList
    } catch (err: any) {
        console.error(err)
    }
}