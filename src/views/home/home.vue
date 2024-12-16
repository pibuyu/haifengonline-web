<template>
  <div class="mian">
    <div class="head">
      <topNavigation color="#18191C" scroll :displaySearch="true"></topNavigation>
    </div>
    <!-- 封面图 -->
    <div class="cover-picture">
    </div>
    <!-- 顶部通道 热门分类 -->
<!--    <homeHeaderChannel @click="notOpen()"></homeHeaderChannel>-->
    <!-- 主体 -->
    <div class="middle" :infinite-scroll-distance="770" v-infinite-scroll="scrollBottom" :record-empty="40"
         :infinite-scroll-delay="1000" :infinite-scroll-immediate="false">

      <!-- 轮播图架屏 -->
      <div class="rotograph-skeleton">
        <el-skeleton style="width: 100%; height: 70%;" class="video-card" :loading="!homeInfo.rotograph.length"
                     animated>
          <template #template>
            <el-skeleton-item variant="text" style="  width: 100%;height: 100%;"/>
            <div style="text-align: start; margin-top: 0.3rem;">
              <el-skeleton-item variant="text" style="width: 100% ;height: 5rem;"/>
            </div>
          </template>
          <template #default>
            <!-- 轮播图 -->
            <homeRotograph :rotograph="homeInfo?.rotograph"></homeRotograph>
          </template>
        </el-skeleton>
      </div>

      <!-- 视频 -->
      <!-- 视频骨架屏 -->
      <div class="video-card" v-for="(videoInfo, index) in videoList.length ? videoList : quickCreationArr(11)"
           :key="videoInfo.id">
        <el-skeleton style="width: 100%; height: 13rem;" class="video-card" :loading="!videoInfo.id" animated>
          <template #template>
            <el-skeleton-item variant="text" style="width: 100%;height: 100%;"/>
            <div style="text-align: start; margin-top: 0.6rem;">
              <el-skeleton-item variant="h3" style="width: 100%"/>
              <div>
                <el-skeleton-item variant="h3" style="width: 80%"/>
                <el-skeleton-item variant="h3" style="width: 60%"/>
              </div>
            </div>
          </template>
          <template #default>
            <Card :id="videoInfo.id" :title="videoInfo.title" :username="videoInfo.username" :uid="videoInfo.uid"
                  :video_duration="videoInfo.video_duration" v-bind:barrage-number="videoInfo.barrageNumber"
                  :heat="videoInfo.heat" :cover="videoInfo.cover" :created_at="videoInfo.created_at"></Card>
          </template>
        </el-skeleton>
      </div>
      <div v-if="isLoading" class="loading-indicator">正在加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getHomeInfo} from "@/apis/home";
import globalScss from "@/assets/styles/global/export.module.scss";
import homeHeaderChannel from "@/components/homeHeaderChannel/homeHeaderChannel.vue";
import homeRotograph from "@/components/homeRotograph/homeRotograph.vue";
import Card from "@/components/homeVideoList/card.vue";
import topNavigation from "@/components/topNavigation/topNavigation.vue";
import {GetHomeInfoReq, GetHomeInfoRes, VideoInfo} from "@/types/home/home";
import Swal from "sweetalert2";
import {Ref, UnwrapNestedRefs, computed, onMounted, reactive, ref} from "vue";
import {useGlobalStore} from "@/store/main";

components: {
  homeRotograph
  Card
  homeHeaderChannel
  topNavigation
}
const isLoading = ref(false)

const global = useGlobalStore();

const pageInfo = reactive(<GetHomeInfoReq>{
  page_info: {
    page: 1,
    size: 15,
  }
})


let homeInfo = ref<GetHomeInfoRes>({
  rotograph: [],
  videoList: []
})

const videoList = computed(() => {
  let list = [] as Array<VideoInfo>
  //判断当前页面数量 为第二页
  if (pageInfo.page_info.page == 2) {
    if (homeInfo.value.videoList.length % 11 == 0) {
      list = [...list, ...homeInfo.value.videoList, ...quickCreationArr(15)]
      //并且加载数据
      loadData(homeInfo, pageInfo)
    } else {
      list = [...homeInfo.value.videoList]
    }
  } else if (pageInfo.page_info.page > 2) {
    if ((homeInfo.value.videoList.length - 11) % pageInfo.page_info.size == 0) {
      list = [...list, ...homeInfo.value.videoList, ...quickCreationArr(15)]
    } else {
      list = [...homeInfo.value.videoList]
    }
  } else {
    list = [...homeInfo.value.videoList]
  }

  return list
})


//生成占位骨架屏
const quickCreationArr = (num: number): Array<VideoInfo> => {
  let arr = []
  for (let i = 0; i < num; i++) {
    arr.push(<VideoInfo>{})
  }
  return arr
}

const loadData = async (homeInfo: Ref<GetHomeInfoRes>, pageInfo: UnwrapNestedRefs<GetHomeInfoReq>) => {
  const response = await getHomeInfo(pageInfo)
  if (!response.data) return
  homeInfo.value.rotograph = response.data.rotograph//更新数据
  // 处理视频列表，避免重复
  const newVideoList = response.data.videoList;
  const existingVideoIds = new Set(homeInfo.value.videoList.map(video => video.id));
  const filteredNewVideoList = newVideoList.filter(video => !existingVideoIds.has(video.id));

  // 合并新的视频列表
  homeInfo.value.videoList = [...homeInfo.value.videoList, ...filteredNewVideoList];

  homeInfo.value.videoList.sort((a, b) => {//重排序，heat高的优先展示，其次barrageNum高的优先展示
    if (a.heat != b.heat) {
      return b.heat - a.heat
    }
    return b.barrageNumber - a.barrageNumber
  })


  //请求成功后下次分页+1
  pageInfo.page_info.page = pageInfo.page_info.page + 1
  //打印用
  return response
}

let timer: NodeJS.Timeout | null = null

//加载底部
const scrollBottom = async () => {
  isLoading.value = true
  console.log("触底")
  //无数据时取消加载更多
  if (homeInfo.value.videoList.length <= 0) {
    isLoading.value = false
    return false
  }
  await loadData(homeInfo, pageInfo)
  isLoading.value = false
}

const notOpen = () => {
  Swal.fire({
    title: "敬请期待",
    heightAuto: false,
    confirmButtonColor: globalScss.colorButtonTheme,
    icon: "info",
  })
}

onMounted(async () => {
  let result = await loadData(homeInfo, pageInfo)
})

</script>

<style scoped lang="scss">
@import "@/assets/styles/views/home/home.scss";

.loading-indicator {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: #007bff; /* 天蓝色 */
  width: 100%; /* Optional: Make it full width */
}
</style>
