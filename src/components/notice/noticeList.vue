<template>
  <div class="notice-box">
    <div class="title">

      <div class="text">消息通知</div>
      <div class="select">
        <el-dropdown :hide-on-click="false" :teleported="false">
          <span class="ropdown-link" style="cursor: pointer">
            {{ messageTypeText }} <SvgIcon name="rightArrow" class="icon" color="#61666D"></SvgIcon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="switchMessageType('all')" style="cursor: pointer">全部消息</el-dropdown-item>
              <el-dropdown-item @click="switchMessageType('comment')" style="cursor: pointer">评论消息</el-dropdown-item>
              <el-dropdown-item @click="switchMessageType('like')" style="cursor: pointer">点赞消息</el-dropdown-item>
              <el-dropdown-item @click="switchMessageType('system')" style="cursor: pointer">系统通知</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="message-list" v-loading="isLoading" :infinite-scroll-delay="1000" :infinite-scroll-distance="40"
         v-infinite-scroll="scrollBottom" :infinite-scroll-disabled="isTheEnd" :infinite-scroll-immediate="false">
      <div class="message-item" v-for="item in noticeList" :key="item.id" @click="jump(item.type, item.to_id)"
           style="cursor: pointer">
        <div class="item-left">
          <div class="avatar">
          <!--    打印一下noticeList的信息，看看哪个是发起消息的userId        -->
            <el-avatar :size="38" :src="item.photo" @click="jumpToUserSpace(item.cid)"/>
          </div>
          <div class="content">
            <div>{{ item.username }}</div>
            <div>
              <VueEllipsis3 :visibleLine="2" :text="item.comment">
              </VueEllipsis3>
            </div>
            <div class="time">
            <!--    这个是在别人发出评论时，给item.type_rompt赋值之后，显示的提示内容，也就是"评论了您的视频"          -->
              <span v-if="item.type_rompt">{{ item.type_rompt }}  </span>
              <span> {{ timestampFormat(item.created_at) }}</span>
            </div>
          </div>
        </div>
        <div class="item-right">
          <div class="content-info">
            <el-image class="item-img" :src="item.cover" v-if="item.cover!=''"  fit="cover"/>
            <div class="title">
              <VueEllipsis3 :visibleLine="1" :text="item.title">
              </VueEllipsis3>
            </div>
          </div>
        </div>
      </div>
      <div class="load-more" v-show="noticeList.length > 0 && isLoadMore" v-loading="true">
      </div>

      <div class="record-empty" v-show="noticeList.length == 0 && isLoading == false">
        <el-empty description="还没有通知~"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {getNoticeList} from '@/apis/personal';
import {useUserStore} from '@/store/main';
import {PageInfo} from '@/types/idnex';
import {GetNoticeListReq, GetNoticeListRes} from '@/types/personal/notice/notice';
import {timestampFormat} from "@/utils/conversion/timeConversion";
import {ref} from 'vue';
import {VueEllipsis3} from 'vue-ellipsis-3';
import {useRouter} from 'vue-router';

components: {
  VueEllipsis3
}
const userStore = useUserStore()
const router = useRouter()
const messageType = ref("")
const messageTypeText = ref("全部消息")
const noticeList = ref(<GetNoticeListRes>[])

const pageInfo = ref(<PageInfo>{
  page: 1,
  size: 9,
})
//是否首次加载
const isLoading = ref(true)
//是否正在加载更多
const isLoadMore = ref(false)
//是否全部加载完成
const isTheEnd = ref(false)
//跳转到用户个人空间
const jumpToUserSpace = (id: number) => {
  if(id==0) return
  router.push({ name: "SpaceIndividual", params: { "id": id } })
}

//加载底部
const scrollBottom = async () => {
  if (isTheEnd.value) return
  if (isLoadMore.value) return
  isLoadMore.value = true
  await loadData()
  isLoading.value = false
  isLoadMore.value = false
}

const loadData = async () => {
  try {
    const response = await getNoticeList(<GetNoticeListReq>{
      type: messageType.value,
      page_info: pageInfo.value
    })
    // console.log("请求noticelist的返回值：",response)
    console.log('通知列表的返回结果为',response)
    if (!response.data) return false;
    if (response.data.length == 0) isTheEnd.value = true

    response.data = response.data.filter((item) => {
      //todo:在这里处理系统的头像和cover，cover已经处理过了，需要设置一个系统默认头像来通知系统消息
      if(item.username==""){
        item.username="SYSTEM"
      }
      if(item.photo==""){
        item.photo="https://easy-video-net-hangzhou.oss-cn-hangzhou.aliyuncs.com/system_photo.jpg"
      }
      switch (item.type) {
        case "videoComment":
          item.type_rompt = "评论了你的视频"
          break
        case "videoLike":
          item.type_rompt = ""//这个已经写过了提示消息，所以这里空白
          break
        case "articleComment":
          item.type_rompt = "评论了你的专栏"
          break
        case "articleLike":
          item.type_rompt = ""
          break
        case "userLogin"://欢迎消息的提示部分应该也是空串
          item.type_rompt=""
      }

      return item
    })

    noticeList.value = [...noticeList.value, ...response.data]
    // console.log("处理后的noticeList值",noticeList.value)
    pageInfo.value.page++

    //清除消息提示
    userStore.setUnreadNotice(0)

  } catch (err) {
    console.log(err)
  }
}


const switchMessageType = (type: string) => {
  if (type == "comment") {
    messageTypeText.value = "评论消息"
  } else if (type == "like") {
    messageTypeText.value = "点赞消息"
  } else if(type=="all") {
    messageTypeText.value = "全部消息"
  }else if(type=="system") {
    messageTypeText.value="系统通知"
  }
  messageType.value = type
  end()
  init()
}

const jump = (type: string, id: number) => {
  switch (type) {
    case "videoComment":
      router.push({name: "VideoShow", params: {id}})
      break
    case "videoLike":
      router.push({name: "VideoShow", params: {id}})
      break
    case "articleComment":
      router.push({name: "ArticleShow", params: {id}})
      break
    case "articleLike":
      router.push({name: "ArticleShow", params: {id}})
      break
  }
}


const init = async () => {
  await scrollBottom()
}

const end = () => {
  //清空显示的消息，准备重新加载
  isTheEnd.value = false
  isLoading.value = true
  pageInfo.value.page = 1
  noticeList.value = []
}

defineExpose({
  init,
  end
})

</script>
<style lang="scss" scoped>
@import "./static/style/noticeList.scss";
</style>