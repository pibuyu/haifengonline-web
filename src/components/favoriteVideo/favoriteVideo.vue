<template>
  <div class="favorite-video">
    <div class="checkbox" v-loading="isLoading">
      <div class="check-item" v-for="item in favoritesList" :key="item.id">
        <!-- 每次点开，里面数据的展示是根据item.choose决定的，但是这容易导致数据和显示不一致       -->
        <el-checkbox v-model="item.choose" size="large">
          <div class="title">{{ item.title }}</div>
          <div class="num"> {{ item.present }}/{{ item.max }}</div>
        </el-checkbox>
      </div>
    </div>
    <div class="create">
      <el-input v-model="createInput" placeholder="创建收藏夹" :prefix-icon="Plus">
        <template #append>
          <el-button type="primary" round @click="createFavorite()" :disabled="createInput==''">创建</el-button>
        </template>
      </el-input>
    </div>
    <div class="function">
      <el-button type="primary" v-removeFocus round @click="confirmedCollection">确认</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {createFavorites, favoriteVideo, getFavoritesListByFavoriteVideo} from '@/apis/personal';
import globalScss from "@/assets/styles/global/export.module.scss";
import {createFavoritesReq} from '@/types/personal/collect/createFavorites';
import {
  FavoriteVideoReq,
  GetFavoritesListByFavoriteVideoItem,
  GetFavoritesListByFavoriteVideoReq,
  getFavoritesListByFavoriteVideoRes,
  GetFavoritesListRes
} from '@/types/personal/collect/favorites';
import {vRemoveFocus} from "@/utils/customInstruction/focus";
import {Plus} from '@element-plus/icons-vue';
import Swal from 'sweetalert2';
import {onMounted, Ref, ref} from 'vue';


//父组件传递过来的属性：id：视频id
const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
})


//父组件传递过来的回调函数：shutDown：关闭收藏视频对话框；success：收藏成功，使收藏图标高亮
const emits = defineEmits(["shutDown", "success","cancelCollect"])

const createInput = ref("")
const favoritesList = ref(<getFavoritesListByFavoriteVideoRes>{})
const isLoading = ref(true)
const isChoneIds = ref(<Array<number>>[])  //记录loadData完成时，视频就位于的收藏夹的ids

const loadData = async (favoritesList: Ref<GetFavoritesListRes>, isLoading: Ref<boolean>) => {
  try {
    //获取收藏夹列表
    isLoading.value = true
    const response = await getFavoritesListByFavoriteVideo(<GetFavoritesListByFavoriteVideoReq>{
      video_id: props.id
    });
    if (!response.data) return false
    response.data = response.data.filter((item: GetFavoritesListByFavoriteVideoItem) => {
      if (item.selected) {//只做逻辑操作
        isChoneIds.value.push(item.id)
        item.choose = true  //控制每个收藏夹是否收藏了当前视频的高亮行为
      } else {
        item.choose = false
      }
      return true//最后还是全都返回，不能丢弃
    })
    favoritesList.value = response.data
    console.log('获取用户的收藏夹信息返回结果为', response)
    isLoading.value = false
  } catch (err) {
    console.log(err)
  }
}

//创建收藏夹
const createFavorite = async () => {
  try {
    await createFavorites(<createFavoritesReq>{
      title: createInput.value
    })
    loadData(favoritesList, isLoading)
    createInput.value = ""
  } catch (err: any) {
    Swal.fire({
      title: "创建失败",
      confirmButtonColor: globalScss.colorButtonTheme,
      heightAuto: false,
      icon: "error",
    })
  }
}

//确认收藏
const confirmedCollection = async () => {
  try {
    //得到确认收藏的收藏夹
    let ids: Array<number> = []
    favoritesList.value.filter((item) => {
      if (item.choose) ids.push(item.id);
    })
    //判断loadData完毕selected的收藏夹和现在choose的收藏夹是否一致，如果一致，就说明没有改动
    console.log("原本的收藏夹为",isChoneIds.value,"新选择的收藏夹id为",ids)
    if (JSON.stringify(isChoneIds.value) === JSON.stringify(ids)) {
      Swal.fire({
        title: "未更改",
        heightAuto: false,
        confirmButtonColor: globalScss.colorButtonTheme,
        icon: "warning",
      })
    }
    await favoriteVideo(<FavoriteVideoReq>{
      ids,
      video_id: props.id
    })
    //如果是取消了收藏，发送一个cancelCollect信号回去，让收藏按钮的高亮消失；顺序放在success的后面，取消这个高亮行为
    emits("success")
    if(ids.length == 0){
      emits("cancelCollect")
    }
    emits("shutDown")
    Swal.fire({
      title: "操作成功",
      confirmButtonColor: globalScss.colorButtonTheme,
      heightAuto: false,
      icon: "success",
    })
    loadData(favoritesList, isLoading)
  } catch (err: any) {
    emits("shutDown")
    Swal.fire({
      title: err.message,
      confirmButtonColor: globalScss.colorButtonTheme,
      heightAuto: false,
      icon: "error",
    })
  }
}

onMounted(() => {
  loadData(favoritesList, isLoading)
})

</script>

<style lang="scss" scoped>
@import "./static/style/favoriteVideo.scss";
</style>