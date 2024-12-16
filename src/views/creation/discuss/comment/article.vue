<template>
    <div class="comment-box" v-loading="isLoading" :infinite-scroll-distance="40" v-infinite-scroll="scrollBottom"
        :infinite-scroll-disabled="isTheEnd" :infinite-scroll-immediate="false" ref="scrollRef"
        :style="{ height: scrollHeight + 'px' }">
        <div class="comment-item" v-show="commentList.length >0" v-for="item in commentList" :key="item.id">
            <div class="item-left">
                <div class="avatar"><el-avatar :size="52" :src="item.photo" />
                </div>
                <div class="info">
                    <div class="top">
                        <div class="username"><span>{{ item.username }}</span></div>
                        <div class="time"><span>{{ dayjs(item.created_at).format('YYYY.MM.DD.hh.mm') }}</span></div>
                    </div>
                    <div class="comment-text">
                        <div class="comment-content">评论内容 : </div>
                        <VueEllipsis3 :visibleLine="1" :text="item.comment">
                        </VueEllipsis3>
                    </div>
                </div>
            </div>
            <div class="item-right">
                <div class="video-info">
                    <el-image class="item-img" :src="item.cover" fit="cover" />
                    <div class="title">
                        <VueEllipsis3 :visibleLine="1" :text="item.title">
                        </VueEllipsis3>
                    </div>
                </div>
            </div>
            <!--    用户没有发布视频/专栏时，应显示未发布的样式，而不是报错      -->
            <div class="record-empty" v-show="commentList.length == 0 && isLoading == false">
              <el-empty description="还未发布专栏,快去发布吧~" />
            </div>
        </div>
        <div class="record-empty" v-show="commentList.length == 0 && isLoading == false">
          <el-empty description="还未发布专栏,快去发布吧~" />
        </div>
        <div class="load-more" v-show="commentList.length > 0 && isLoadMore" v-loading="true">
        </div>
        <!-- 撑开底部 -->
        <div class="spread-bottom">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getDiscussArticleList } from '@/apis/contribution';
import globalScss from "@/assets/styles/global/export.module.scss";
import { GetDiscussArticleListReq, GetDiscussArticleListRes } from '@/types/creation/discuss/comment';
import { PageInfo } from '@/types/idnex';
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import { nextTick, onMounted, ref } from 'vue';
import { VueEllipsis3 } from 'vue-ellipsis-3';

components: {
    VueEllipsis3
}

const commentList = ref(<GetDiscussArticleListRes>[])
const pageInfo = ref(<PageInfo>{
    page: 1,
    size: 9,
})
const scrollHeight = ref(0)
const scrollRef = ref()
//是否首次加载
const isLoading = ref(true)
//是否正在加载更多
const isLoadMore = ref(false)
//是否全部加载完成
const isTheEnd = ref(false)


const loadData = async () => {
    try {
        // console.log('请求文章评论信息传递的参数为',pageInfo.value)
        const response = await getDiscussArticleList(<GetDiscussArticleListReq>{
            page_info: pageInfo.value
        })
        console.log('请求文章的评论的返回结果',response)
        if (!response.data) return false
        if (response.data.length == 0) isTheEnd.value = true
        commentList.value = [...commentList.value, ...response.data]
        pageInfo.value.page++

    } catch (err) {
        console.log(err)
        Swal.fire({
            title: "加载数据失败",
            heightAuto: false,
            confirmButtonColor: globalScss.colorButtonTheme,
            icon: "error",
        })
    }
}

//加载底部
const scrollBottom = async () => {
    // //无数据时取消加载更多
    if (isLoading.value == true) return false
    isLoadMore.value = true
    if (commentList.value.length <= 0) return false
    await loadData()
    isLoadMore.value = false

}


onMounted(async () => {
    await loadData()
    isLoading.value = false
    nextTick(() => {
        scrollHeight.value = document.documentElement.clientHeight - scrollRef.value.offsetTop - 20
    })
})


</script>

<style lang="scss" scoped>
@import "@/assets/styles/views/creation/discuss/comment/article.scss";
@import "@/assets/styles/views/creation/manuscript/article.scss";
</style>