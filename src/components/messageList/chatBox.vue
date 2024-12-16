<template>
  <div id="chat-box" class="chat-box" ref="boxRef" @scroll="boxScroll">
    <div class="chat-list">
      <div class="msg-list">
        <div v-for="msgItem in processedMsgList" :key="msgItem.id">
          <div class="msg-time" v-if="msgItem.showTime">
            {{ noticeListTimeConversion(msgItem.created_at) }}
          </div>
<!--          todo:两件事情：消息超过两行时应自动缩放；然后空格发送消息后，消息输入框应该清空-->
          <!--  私信聊天左半边是对方发的信息 -->
          <!--  每个msgItem的uid是自己，tid是对方，当uid==userStore.userInfoData.id说明是自己发出的消息        -->
          <div class="msg-left" v-if="userStore.userInfoData.id != msgItem.uid">
            <el-avatar shape="circle" :size="32" :src="msgItem.photo"/>
            <div class="msg-text">
              <span class="msg-span">{{ msgItem.message }}</span>
            </div>
          </div>
          <!--  私信聊天右半边是自己发的信息             -->
          <div class="msg-right" v-if="userStore.userInfoData.id == msgItem.uid">
            <div class="msg-text">
              <span class="msg-span">{{ msgItem.message }}</span>
            </div>
            <el-avatar shape="circle" :size="32" :src="userStore.userInfoData.photo"/>
          </div>
          <div></div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <!-- TODO:按回车键会导致发消息并且换行，但我不需要换行，清空input内容没用     -->
      <el-input v-model="input" resize="none" :input-style="{ width: '400px' }" autosize type="textarea"
                placeholder="聊点啥呢~" @keydown.enter="sendText(input)" @keydown.enter.prevent="sendText(input)" @keydown.space.prevent/>
      <!--   TODO: 先研究一下sendText函数的实现      -->
      <el-button v-removeFocus @click="sendText(input)" class="send" :type="input ? 'primary' : 'info'" :icon="Check" circle/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getChatHistoryMsg} from "@/apis/personal";
import globalScss from "@/assets/styles/global/export.module.scss";
import {useChatListStore} from "@/store/chat";
import {useUserStore} from "@/store/main";
import {ResultDataWs} from "@/types/idnex";
import {GetChatHistoryMsgReq} from "@/types/personal/chat/chat";
import {ChatSendTextMsg} from "@/types/socket/chat";
import {MessageInfo} from '@/types/store/chat';
import {vRemoveFocus} from "@/utils/customInstruction/focus";
import {Check} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import Swal from "sweetalert2";
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import dayjs from "dayjs";
import {formattingSecondTime, noticeListTimeConversion, rFC3339ToTime} from "@/utils/conversion/timeConversion";

//父组件传递过来的 聊天对象的id、与其聊天内容
const props = defineProps({
  tid: {
    type: Number,
    required: true,
  },
  msgList: {
    type: Array as () => Array<MessageInfo> | undefined,
    required: true,
  }
})


var socket: WebSocket | undefined
const input = ref("")
const userStore = useUserStore()
const chatListStore = useChatListStore()
const router = useRouter()
const tid = ref(0)
const boxRef = ref()

const loadSocket = () => {
  //这些都是配置信息，下面的才是实例化WebSocket
  let socket: WebSocket
  //连接websocket成功和失败的回调函数
  const open = () => {
    console.log("用户聊天websocket连接成功 ")
  }
  const error = (err: any) => {
    console.error("用户聊天聊天websocket连接失败，错误信息：",err)
  }
  const getMessage = async (msg: any) => {
    //将消息解析程ResultDataWs类型，包含code、type、message、data?  四个字段
    let data = <ResultDataWs>JSON.parse(msg.data)
    switch (data.type) {
      case "error":
        console.error("用户聊天聊天socket返回错误")
        ElMessage({
          message: data.message,
          type: 'error',
          appendTo: document.getElementById("chat-box") as HTMLElement,
        })
        break;
      case "chatSendTextMsg":  //私聊信息对应这个类型
        data as ResultDataWs<ChatSendTextMsg>
        chatSendTextMsg(data.data)  //将消息保存到chatStore，同时滚动到聊天框底部
        break
    }
  }

  if (typeof (WebSocket) === "undefined") {
    Swal.fire({
      title: "您的浏览器不支持socket",
      heightAuto: false,
      confirmButtonColor: globalScss.colorButtonTheme,
      icon: "error",
    })
    router.back()
    return
  } else {
    // 实例化socket
    socket = new WebSocket(import.meta.env.VITE_SOCKET_URL + "/ws/chatUserSocket?token=" + userStore.userInfoData.token + "&tid=" + tid.value)
    //调用成功连接、连接出错和有消息到来的几个回调函数
    // 监听socket连接
    socket.onopen = open
    // 监听socket错误信息
    socket.onerror = error
    // 监听socket消息
    socket.onmessage = getMessage
  }
  return socket
}

const send = (type: string, msg: string) => {
  let data = JSON.stringify({
    type,
    "data": msg,
  })
  socket?.send(data)
}

const sendText = (msg: string) => {
  if (msg.trim() == "") return false
  input.value = ''
  send("sendChatMsgText", msg)
  //添加记录
  input.value = ""
  chatListStore.addMessage(tid.value, <MessageInfo>{
    uid: userStore.userInfoData.id,
    username: userStore.userInfoData.username,
    photo: userStore.userInfoData.photo,
    tid: tid.value,
    message: msg,
    type: "text",
    created_at: Date().toString()
  })
  //滚动到底部
  nextTick(() => {
    rollingBottom()
  })

}

const chatSendTextMsg = (data: ChatSendTextMsg) => {
  chatListStore.addMessage(data.uid, data)
  nextTick(() => {
    rollingBottom()
  })

}


// TODO: 滚动到底部  看看是怎么实现的
const rollingBottom = () => {
  if (props.msgList) {
    nextTick(() => {
      if (boxRef?.value?.scrollHeight) {
        boxRef.value.scrollTop = boxRef?.value?.scrollHeight  // 将滚动条位置设置为容器的最大高度
      }
    })
  }
}

const boxScroll = async () => {
  console.log("触碰顶部")

  if (boxRef.value.scrollTop == 0) {
    //触碰顶加载更多‘
    const h = boxRef.value.scrollHeight
    try {
      let mixTime: number | string = new Date().getTime() //最小值默认当前时间
      chatListStore.chatListData.filter((item) => {
        if (item.to_id == chatListStore.tid) {
          item.message_list.filter((ml) => {
            console.log(new Date(ml.created_at).getTime() - new Date(mixTime).getTime())
            if (new Date(ml.created_at).getTime() - new Date(mixTime).getTime() < 0) {
              mixTime = ml.created_at
            }
          })
        }
      })
      console.log("最小值", mixTime)
      const response = await getChatHistoryMsg(<GetChatHistoryMsgReq>{
        tid: props.tid,
        last_time: mixTime,
      })
      if (!response.data) return false
      const chatList = response.data.reverse()
      chatListStore.chatListData = chatListStore.chatListData.filter((item) => {
        if (item.to_id == chatListStore.tid) {
          item.message_list = [...chatList, ...item.message_list]
        }
        return item
      })
      nextTick(() => {
        boxRef.value.scrollTop = boxRef.value.scrollHeight - h
      })
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }
}

const watchTid = watch(() => {
  return chatListStore.tid
}, (newVal, oldVal) => {
  socket?.close()
  if (newVal != oldVal) {
    tid.value = newVal
    chatListStore.clearUnread(tid.value)
    socket = loadSocket()
    rollingBottom()
  }
}, {immediate: true})


/*
* 想要实现两条消息的时间间隔小于1分钟:
* 首先要将父组件传递过来的msgList处理，加上showTime属性控制消息时间是否展示，存储在processedMsgList中（因为props.msgList是只读的，所以要）
* 监听props.msgList，一旦发生变化，立马更新processedMsgList
* 最后在展示时间处加上v-if='showTime'即可
* */

// 定义一个本地的响应式变量
const processedMsgList = ref([]);
// 计算属性：处理传入的消息列表并添加 showTime 属性
const processMessages = (messages: any) => {
  return messages.map((msg: any, index: any) => {
    //首条消息一定展示
    if (index === 0) {
      return {...msg, showTime: true};  //!!!!这里就是在原本的msg item末尾添加上showTime字段作为新的item返回
    } else {
      //计算当前tem和上一个索引的item之间的created_at之差，因为返回的是毫秒，所以要用秒数乘以1000，当差值小于5分钟时，showTime=false
      const prevMsg = messages[index - 1];
      const currentTime = new Date(msg.created_at).getTime();
      const prevTime = new Date(prevMsg.created_at).getTime();
      const timeDiff = currentTime - prevTime;

      const showTime = timeDiff > 300000;
      return {...msg, showTime};
    }
  });
};
// 监听 props.msgList 的变化并更新 processedMsgList
watch(
    () => props.msgList,
    (newMsgList) => {
      processedMsgList.value = processMessages(newMsgList);
    },
    {immediate: true}
);
onMounted(async () => {
  await nextTick()
  //处理一下msgList，添加是否应该显示消息时间的标志：当两条消息的时间差小于1分钟时，不予显示
  // console.log('处理过后的msgList为', processedMsgList.value)
})

//关闭时结束监听和socket
onUnmounted(() => {
  watchTid()
  socket?.close()
})

</script>

<style lang="scss" scoped>
@import "./static/style/chatBox.scss";
</style>