<template>
  <div class="message-box" v-click-outside="clickOutside">
    <!-- 左侧选取私聊对象   -->
    <div class="box-left">
      <div class="title">
        私信列表
      </div>
      <div class="message-list">
        <!--  :key="item.to_id"  依据to_id作为索引   -->
        <div class="message-item" v-for="item in messageList" :key="item.to_id" @click="toChat(item.to_id)">
          <div class="item-left">
            <!--    展示一个带有徽章的头像，徽章是有未读消息的小圆点；:hidden="item.unread == 0"  当未读消息条数为0，圆点隐藏     -->
            <el-badge is-dot :hidden="item.unread == 0" class="item">
              <div class="avatar">
                <el-avatar :size="38" :src="item.photo"/>
              </div>
            </el-badge>

          </div>
          <div class=" item-right">
            <div class="on">
              <div class="name">
                {{ item.username }}
              </div>
              <div class="time">
                {{ dayjs(item.last_at).format("HH:mm") }}
              </div>
            </div>
            <div class="info">
              <VueEllipsis3 class="text" :visibleLine="2" :text="item.last_message">
              </VueEllipsis3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧查看私聊信息   -->
    <!-- 怎么控制chatBox展示的是和哪个对象的聊天内容？       传过去了tid和tMessageList，chatBox取到数据进行展示   -->
    <div class="box-right" v-if="chatListStore.tid">
      <div class="title">
        <div class="title-left">{{ chatListStore.tUsername }}</div>
        <div class="title-right">
          <el-button class="exit" type="primary" size="small" round
                     @click="chatListStore.tid = 0">关闭会话
          </el-button>
          <el-popover :width="100" :teleported="false"
                      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 8px;">
            <template #reference>
              <el-icon :size="18" class="icon">
                <MoreFilled/>
              </el-icon>
            </template>
            <template #default>
              <div class="more-box">
                <div class="more-item" @click="deleteChat">删除聊天</div>
              </div>
            </template>
          </el-popover>

          <!--  叉号，隐藏私聊弹框        -->
          <el-icon :size="18" class="icon" @click="chatListStore.isShow = false">
            <Close/>
          </el-icon>

        </div>
      </div>
      <!--   私聊内容框   -->

      <!-- @ts-ignore     -->
      <ChatBox :tid="chatListStore.tid" :msg-list="tMessageList"
               @click="outputToId_ToMsgList(chatListStore.tid,tMessageList)"></ChatBox>
    </div>
    <!-- 未选择聊天对象时的空展示框   -->
    <div class="empty" v-if="!chatListStore.tid">
      <el-empty :image="emptyImg" description="快选择一位好友聊天叭~"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {deleteChatItem, deleteFavorites} from "@/apis/personal";
import useLoadChatList from "@/hooks/useLoadChatList";
import {useChatListStore} from "@/store/chat";
import {DeleteChatItemReq} from "@/types/personal/chat/chat";
import {Close, MoreFilled} from '@element-plus/icons-vue';
import dayjs from "dayjs";
import {ClickOutside as vClickOutside} from 'element-plus';
import {computed, onMounted} from 'vue';
import {VueEllipsis3} from 'vue-ellipsis-3';
import ChatBox from "./chatBox.vue";
import emptyImg from '@/components/messageList/static/img/unselectedMsg.png'
import {MessageInfo} from "@/types/store/chat";

components: {
  ChatBox
  VueEllipsis3
}

const chatListStore = useChatListStore()

const outputToId_ToMsgList = (tid: number, to_msg_list: Array<MessageInfo>) => {
  // console.log('传递给子组件的tid和to_msg_list为', tid, to_msg_list)
}

const tMessageList = computed(() => {
  if (chatListStore.tid != 0) {
    let tInfo = chatListStore.chatListData.filter((item) => {
      return item.to_id == chatListStore.tid
    })
    if (tInfo[0]) {
      chatListStore.tUsername = tInfo[0]?.username
      return tInfo[0]?.message_list
    }
    return []
  }
})

const messageList = computed(() => {  // 将chatListData里的聊天数据按last_at的倒序排列
  return chatListStore.chatListData.sort(function (a, b) {
    return new Date(b.last_at).getTime() - new Date(a.last_at).getTime()
  });
})


const loadData = async () => {
  useLoadChatList()   //更新chatListStore中的聊天数据,将当前用户的全部聊天信息更新到chatListStore的chatListData
}

const clickOutside = () => {
  chatListStore.isShow = false
}

const deleteChat = async () => {
  try {
    await deleteChatItem(<DeleteChatItemReq>{  //直接将数据库中的聊天数据删除,传递过去的而参数是tid，即在和谁聊天（本人的uid从ctx里取）
      id: chatListStore.tid
    })
    chatListStore.deleteItemByid(chatListStore.tid)  //取chatListData中将当前用户和这个tid对应的用户的聊天记录删除
    chatListStore.tid = 0
  } catch (err) {
    console.log(err)
  }
}

const toChat = (id: number) => {
  chatListStore.tid = id
}


onMounted(() => {
  loadData()
})


</script>

<style lang="scss" scoped>
@import "./static/style/messageList.scss";
</style>