<template>

  <div class="comments-info">
        <textarea class="comments-textarea"
                  placeholder="写下点什么..."
                  maxlength="1000"
                  v-model="comments.comments">
        </textarea>
  </div>
  <!-- 标签及发布 -->
  <div class="comments-fun">
    <div>
      <SvgIcon name="expression"
               :class="{ 'icon-small': true, 'animate__animated': true, 'animate__tada': emoji.animation  }"
               @click="clickEmoji" @mouseleave="emoji.animation = false" @mouseover="emoji.animation = true">
      </SvgIcon>
    </div>

    <div>
      <el-button type="primary" v-removeFocus round @click="postComment(comments, videoID)">发布</el-button>
    </div>
  </div>
  <div
      :class="{ 'comments-emoji': true, 'animate__animated': true, 'animate__headShake': !emoji.animationBox, 'animate__flipOutX': emoji.animationBox }"
      v-show="emoji.show">
        <span class="emoji-item" v-for="emojiItem in emoji.emoji" :key="emojiItem"
              @click="comments.comments = comments.comments + emojiItem">{{ emojiItem }}</span>
  </div>
</template>
<script lang="ts" setup>
import {getVideoComment, videoPostComment} from '@/apis/contribution';
import globalScss from "@/assets/styles/global/export.module.scss";
import {CommentsInfo} from '@/types/show/article/article';
import {GetVideoCommentReq, VideoPostCommentReq} from '@/types/show/video/video';
import {vRemoveFocus} from "@/utils/customInstruction/focus";
import {ElButton} from 'element-plus';
import Swal from 'sweetalert2';
import {UnwrapNestedRefs, reactive, onMounted} from 'vue';
import {resolve} from "dns/promises";

//对评论进行校验,不能发表空评论，不然会影响页面美观
const validateComment = () => {
  if (!comments.comments.trim()) {
    Swal.fire({
      title: "您还没有写评论",
      heightAuto: false,  //这个地方不要写成true，不然会把屏幕自动滑到页面顶部
      confirmButtonColor: globalScss.colorButtonTheme,
      icon: "error",
    })
    return Promise.reject(new Error('评论不能为空'))
  }
  Promise.resolve()  //正常放行
}

const props = defineProps({
  videoID: {
    type: Number,
    required: true,
    default: 1
  },
  commentsID: {   //被回复的评论的ID
    type: Number,
    required: true,
  }
})
const emit = defineEmits(['updateVideoInfo'])

const emoji = reactive({
  show: false,
  animation: false,
  animationBox: true,
  emoji: [
    "😀", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😚", "🤗", "🤨", "😐", "😑", "😶", "🤐", "😏", "😒", "😮‍💨", "🤥", "😌", "😪", "🤤", "😷", "🤒", "🤕", "🥵", "😵",
    "😕", "🙁", "☹️", "😳", "😞", "😭", "🥱", "😩", "😰", "😲", "😯", "😠", "😩", "😧", "😯", "🥺"
  ]
})

const comments = reactive(<CommentsInfo>{
  comments: "",
})

onMounted(() => {
  console.log('传递给回复评论dialog的commentsID为', props.commentsID)
})
//点击表情触发
const clickEmoji = () => {
  emoji.animationBox = !emoji.animationBox
  if (emoji.show) {
    //收回面板的动画效果
    setTimeout(() => {
      emoji.show = !emoji.show
    }, 200);
  } else {
    emoji.show = !emoji.show
  }
}

//回复评论
const postComment = async (comments: UnwrapNestedRefs<CommentsInfo>, videoID: number) => {
  await validateComment()
  try {
    const requistData = <VideoPostCommentReq>{
      video_id: videoID,
      content: comments.comments,
      content_id: props.commentsID,
    }
    const reponse = await videoPostComment(requistData)
    console.log(reponse)

    //清空输入框
    comments.comments = ""
    //刷新一下评论区
    const commentsList = await getVideoComment(<GetVideoCommentReq>{video_id: videoID})

    if (!commentsList.data) {
      throw ("获取评论信息失败")
    }

    emit('updateVideoInfo', commentsList.data)

    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: '评论成功'
    })

  } catch (err) {
    Swal.fire({
      title: err.message,
      heightAuto: false,
      confirmButtonColor: globalScss.colorButtonTheme,
      icon: "error",
    })
  }
}

</script>

<style scoped lang="scss">
@import "./static/style/videoCommentPosting.scss";
</style>
