<template>
  <div class="info">
    <el-popover :teleported="false" :width="120" trigger="hover" @show="chatListStore.isShow = false"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;">
      <template #reference>
        <div class="avatar-box">
          <router-link v-if="userInfo.userInfoData.token" to="/personal" class="avatar">
            <el-avatar :size="36" :src="userInfo.userInfoData.photo" />
          </router-link>
        </div>
      </template>
      <template #default>
        <div class="user-selection">
          <div class="selection-item" @click="jump('Personal')" style="cursor: pointer">
            <SvgIcon name="user" class="icon" color="#000"></SvgIcon>用户中心
          </div>
          <div class="selection-item  mt" @click="loginOut" style="cursor: pointer">
            <SvgIcon name="exit" class="icon" color="#000"></SvgIcon>退出登入
          </div>
        </div>
      </template>
    </el-popover>
    <div v-if="!userInfo.userInfoData.token" @click="login()" class="login">
      <span>登入</span>
    </div>


    <!-- iocn -->
    <div class="icon-list">
      <el-popover ref="popover" :teleported="false" :width="400" trigger="hover" @hide="noticePopoverHide()"
        @show="noticePopoverShow()"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;padding: 14px 0px 14px 14px;">
        <template #reference>
<!--          <el-badge is-dot :hidden="userInfo.userInfoData.unreadNotice == 0">-->
          <!--  把这个改成小数字更醒目一点，也可以查看新通知的条数        -->
          <el-badge :value="userInfo.userInfoData.unreadNotice" :max="99" :hidden="userInfo.userInfoData.unreadNotice == 0">
            <div class="icon-item">
              <SvgIcon name="notice" class="icon" :color="iconColor">
                <div class="red-num-message">1</div>
              </SvgIcon>
              <p class="item-text" :style="{ color: iconColor }">消息</p>
            </div>
          </el-badge>
        </template>
        <template #default>
          <NoticeList ref="noticeListRef"></NoticeList>
        </template>
      </el-popover>



      <!-- todo: 光标挪开，私信栏不能自动隐藏    -->
      <el-popover :visible="chatListStore.isShow" :teleported="false" :width="720" trigger="click"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;padding: 14px 0px 14px 14px;">
        <template #reference>
          <el-badge is-dot :hidden="chatUnreadMessage == 0">
            <div class="icon-item" @mouseover="chatListStore.isShow=true">
              <SvgIcon name="message" class="icon" :color="iconColor"></SvgIcon>
              <p class="item-text" :style="{ color: iconColor }">私信</p>
            </div>
          </el-badge>
        </template>
        <template #default>
          <MessageList v-if="chatListStore.isShow"></MessageList>
        </template>
      </el-popover>

      <div class="icon-item" @click="jump('Record')" style="cursor: pointer">
        <SvgIcon name="history" class="icon" :color="iconColor"></SvgIcon>
        <p class="item-text" :style="{ color: iconColor }">观看历史</p>
      </div>

      <div class="icon-item" @click="jump('Contribute')" style="cursor: pointer">
        <SvgIcon name="inspiration" class="icon" :color="iconColor"></SvgIcon>
        <p class="item-text" :style="{ color: iconColor }"> 创作</p>
      </div>

      <!--  写好bug反馈接口  -->
      <div class="icon-item" style="cursor: pointer">
<!--        <SvgIcon name="bug" class="icon" :color="iconColor"></SvgIcon>-->
<!--        <p class="item-text" :static="{ color: iconColor }" > 反馈 </p>-->
        <el-popover trigger="click" :width="300" content="反馈您遇到的问题">
          <template #reference>
            <el-badge>
              <div class="icon-item">
                <SvgIcon name="bug" class="icon" :color="iconColor" title="反馈"></SvgIcon>
                <p class="item-text" :style="{ color: iconColor }">反馈</p>
              </div>
            </el-badge>
          </template>
          <template #default>
            <BugList></BugList>
          </template>
        </el-popover>
      </div>

    </div>

    <el-button type="primary" round @click="startLive()">开始直播</el-button>
    <el-dialog v-model="dialogTableVisible" :lock-scroll="false" class="dialog" center title="Begin to live">
      <el-steps :active="nextIndex">
        <el-step title="准备工作" description="Download tool" />
        <el-step title="设置参数" description="Set the parameters" />
        <el-step title="开始直播" description="Start to live" />
      </el-steps>

      <el-row class="steps">
        <el-col :span="18">
          <div class="steps-left">
            <p v-show="nextIndex == 1">下载 OBS Studio 直播工具, 安装到我的电脑打开</p>
            <div v-show="nextIndex == 2">
              <h4>在"OBS Studio->设置->直播"中，进行以下设置</h4>
              <h4>服     务 : 自定义...</h4>
              <h4>服务器 : {{ userInfo.userInfoData.liveData.address }}</h4>
              <h4>
                <!--    用'*'隐藏起来中间几位推流码 -->
                推流码 : {{ liveKeyDesensitization(userInfo.userInfoData.liveData.key) }}
                <el-button @click="copy(userInfo.userInfoData.liveData.key)" class="copy" color="#626aef" size="small"
                  plain round>
                  copy
                </el-button>
              </h4>
            </div>
            <p v-show="nextIndex == 3">配置完成！点击"开始直播"</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="steps-right">
            <el-button type="primary" @click="nextStep">
              <span v-show="nextIndex < 3">下一步</span>
              <span v-show="nextIndex == 3">完成</span>
              <el-icon class="el-icon--right">
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getLiveRoom } from "@/apis/live";
import globalScss from "@/assets/styles/global/export.module.scss";
import MessageList from "@/components/messageList/messageList.vue";
import NoticeList from "@/components/notice/noticeList.vue";
import { useChatListStore } from "@/store/chat";
import { useUserStore } from "@/store/main";
import { liveKeyDesensitization } from "@/utils/conversion/stringConversion";
import { ArrowRight } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import Swal from "sweetalert2";
import { onMounted, onUnmounted, ref, watch } from "vue";
import useClipboard from "vue-clipboard3";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

components: {
  NoticeList
  MessageList
}
const chatListStore = useChatListStore()
const userInfo = useUserStore();
const router = useRouter()
const dialogTableVisible = ref(false);
let nextIndex = ref(1);

const emit = defineProps({
  iconColor: {
    type: String,
    default: '#18191C',
  }
}
)

const QQ="3531095171"

const submitBug=async ()=>{
  ElNotification({
    title: "联系站长QQ",
    message: "3531095171",
    type: "info",
  });
  await copy(QQ)
}

const nextStep = () => {
  if (nextIndex.value >= 3) {
    dialogTableVisible.value = !dialogTableVisible.value;
    //关窗动画结束后修改
    setTimeout(() => {
      nextIndex.value = 1;
    }, 1000);
  } else {
    nextIndex.value = nextIndex.value + 1;
  }
};

//跳转
const jump = (name: string) => {
  router.push({
    name
  })
}

const getLiveRoomInfo = async () => {
  if (userInfo.userInfoData.token) {
    try {
      const data = await getLiveRoom();
      userInfo.userInfoData.liveData.address = data.data?.address || "";
      userInfo.userInfoData.liveData.key = data.data?.key || "";
    } catch (err) {
      console.log(err);
    }
  }

};

const { toClipboard } = useClipboard();

const startLive = () => {
  if (userInfo.userInfoData.token) {
    dialogTableVisible.value = !dialogTableVisible.value
    getLiveRoomInfo();
  } else {
    router.push({
      name: 'Login'
    })
  }
}

const login = () => {
  router.push({
    name: 'Login'
  })
}

const copy = async (text: string) => {
  try {
    await toClipboard(text); //实现复制
    ElNotification({
      title: "Success",
      message: "复制成功",
      type: "success",
    });
  } catch (e) {
    console.error("复制推流码出错：",e);
  }
};

// //消息通知相关
const noticeListRef = ref()

//todo：show的时候init；init的时候loadData；loadData的时候请求数据库
const noticePopoverShow = () => {
  chatListStore.isShow = false
  noticeListRef.value.init()
}
const noticePopoverHide = () => {
  noticeListRef.value.end()
}

//未读消息数量
const chatUnreadMessage = ref(0)
//监听未读消息
const watchChatUnreadMessage = watch(() => { return chatListStore.chatListData }, (newVal, oldVal) => {
  chatUnreadMessage.value = 0
  newVal.filter((item) => {
    chatUnreadMessage.value += item.unread
  })
}, { immediate: true, deep: true })

//退出登入
const loginOut = () => {
  userInfo.loginOut()
  router.push({
    name: "Login"
  })
}


const notOpen = () => {
  Swal.fire({
    title: "敬请期待",
    heightAuto: false,
    confirmButtonColor: globalScss.colorButtonTheme,
    icon: "info",
  })
}


onMounted(() => {
  //刷新时关闭
  chatListStore.isShow = false
})

onUnmounted(() => {
  //清除监听
  watchChatUnreadMessage()
})

</script>

<style scoped lang="scss">
@import "../static/style/rightSide.scss";
</style>
