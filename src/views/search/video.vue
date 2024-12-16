<template>
    <div class="main">
        <div class="middle">
            <div class="video-card" v-for="(videoInfo, index) in videoList.length ? videoList : quickCreationArr(11)"
                :key="videoInfo.id" v-if="isLoading && videoList.length">
                <el-skeleton style="width: 100%; height: 9.4rem;" class="video-card" :loading="!videoInfo.id" animated>
                    <template #template>
                        <el-skeleton-item variant="text" style="  width: 100%;height: 100%;" />
                        <div style="text-align: start; margin-top: 0.6rem;">
                            <el-skeleton-item variant="h3" style="width: 100%" />
                            <div>
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <el-skeleton-item variant="h3" style="width: 60%" />
                            </div>
                        </div>
                    </template>
                    <template #default>
                        <Card :id="videoInfo.id" :title="videoInfo.title" :username="videoInfo.username"
                            :video_duration="videoInfo.video_duration" v-bind:barrage-number="videoInfo.barrageNumber"
                            :heat="videoInfo.heat" :cover="videoInfo.cover" :created_at="videoInfo.created_at"></Card>
                    </template>
                </el-skeleton>
            </div>
        </div>
        <div>
            <!-- 空状态 -->
            <div class="empty" v-show="isLoading && !videoList.length">
                <el-empty description="这里空空如也" />
            </div>
        </div>
    </div>


  <div class="pagination">
    <el-pagination :background="true"
                   :page-sizes="[1,10,15,20,30]"
                   layout="prev, pager, next,->,sizes,total"
                   :total="total"
                   @change="loadData"
    />
  </div>
</template>

<script  lang="ts" setup>
import { search } from "@/apis/commonality";
import Card from "@/components/videoSearchCard/card.vue";
import { SearchReq, SearchRes } from "@/types/commonality/commonality";
import { VideoInfo } from "@/types/home/home";
import { computed, reactive, Ref, ref, UnwrapNestedRefs, watch } from "vue";
import { useRoute } from "vue-router";

components: {
    Card
}


const isLoading = ref(false)
const route = useRoute()
const currentPage=ref(1)
const pageSize=ref(10)
const total=ref<number>()
const pageInfo = reactive(<SearchReq>{
    //待完成分页功能
    page_info: {
        page: currentPage.value,
        size: pageSize.value,
        keyword: route.params.text
    },
    type: "video"
})

let searchInfo = ref<SearchRes>([])


const videoList = computed(() => {
    let list = [] as Array<VideoInfo>
    //判断当前页面数量 为第二页
    if (pageInfo.page_info.page == 2) {
        if (searchInfo.value.length % 11 == 0) {
            list = [...list, ...searchInfo.value, ...quickCreationArr(15)]
            //并且加载数据
            loadData(searchInfo, pageInfo)
        } else {
            list = [...searchInfo.value]
        }
    } else if (pageInfo.page_info.page > 2) {
        if (searchInfo.value.length - 11 % pageInfo.page_info.size == 0) {
            list = [...list, ...searchInfo.value, ...quickCreationArr(15)]
        } else {
            list = [...searchInfo.value]
        }
    } else {
        list = [...searchInfo.value]
    }

    return list
})


//生成占位骨架屏
const quickCreationArr = (num: number): Array<VideoInfo> => {
    let arr = []
    for (let i = 0; i < num; i++) {
        arr.push(<VideoInfo>{
        })
    }
    return arr
}

const loadData = async (searchInfo: Ref<SearchRes>, pageInfo: UnwrapNestedRefs<SearchReq>) => {
    pageInfo.page_info.page
    const response = await search(pageInfo)
    console.log('搜索页面的返回结果',response)
    if (!response.data) return
    total.value=response.data.length
    searchInfo.value = [...searchInfo.value, ...response.data]
    //请求成功后下次分页+1
    pageInfo.page_info.page = pageInfo.page_info.page + 1
    isLoading.value = true
}

let timer: NodeJS.Timeout | null = null


watch(() => route.path, async () => {
    pageInfo.page_info.page = 1
    pageInfo.page_info.keyword = route.params.text as string
    searchInfo.value = []
    isLoading.value = false
    loadData(searchInfo, pageInfo)
    console.log(route)
}, { immediate: true, deep: true })

</script>


<style lang="scss" scoped>
@import "@/assets/styles/views/search/video.scss";
.pagination{
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1000px; /* 可根据需要调整 */
  margin: 0 auto;
  z-index: 1000; /* 确保分页器在最上层 */
}
</style>