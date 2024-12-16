<template>
  <div class="card-list">
    <div class="author-card">
      <div class="avatar">
        <el-avatar :size="100"
                   :src="authorInfo.avatar"/>
      </div>
      <div class="author-name"><span>{{ authorInfo.username }}</span></div>
      <div class="column-info">
        <div class="column-info-item">
          <div><span>文章</span></div>
          <div class="info-num"><span>{{ totalInfo.article_num }}</span></div>
        </div>
      <!-- todo：将这里的分类数修改为阅读量更好一点       -->
        <div class="column-info-item">
          <div><span>分类</span></div>
          <div class="info-num"><span>{{ totalInfo.classification_num }}</span></div>
        </div>
      </div>
      <a class="fo-github" @click="Subscribe()">
<!--        <SvgIcon name="github" class="icon" color="#fff"/>-->
        Subscribe Me
      </a>
    </div>
    <!--  左下角"分类"卡片   -->
    <!--  TODO:这里虽然有分类，但是点击分类并不会展示对应分类的文章，也就是点击没有效果    -->
    <div class="classification-card">
      <div class="card-title">
        <SvgIcon name="file" class="icon" color="#4C4948"></SvgIcon>
        分类
      </div>
      <!--   自动展开收起来，然后把学习生活放在默认第一位（改数据库）   -->
      <el-tree :data="totalInfo.classification"
               :default-expand-all="false"
               node-key="label"
               highlight-current
               :props="defaultProps"
               :ref="tree"
               @node-click="checkTreeNodes"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

import {getArticleTotalInfo} from '@/apis/contribution';
import {getArticleTotalInfoRes} from '@/types/creation/contribute/contributePage/articleContribution';
import {nextTick, onMounted, reactive, ref, watch} from 'vue';
import {useGlobalStore, useUserStore} from "@/store/main";
import useColumnStore from "@/store/column";
import {useUserInfoMethod, useUserInfoProp} from "@/logic/personal/userInfo/userInfo";
import Swal from "sweetalert2";
import globalScss from "@/assets/styles/global/export.module.scss";


const { form } = useUserInfoProp();
const UserInfoMethod = useUserInfoMethod(form);
const userInfo = useUserStore()
const tree = ref()//收集el-tree选中的node信息

const columnStore = useColumnStore()
const checkTreeNodes = (data: any, node: any, component: any) => {
  // console.log('选中的l-tree的节点信息为', data)//data包含的字段：id:分类id;aid:所属父分类的id;label:标签名；children:子分类
  columnStore.elTreeCheckedClassificationId = data.id
  // console.log('columnStore里的分类id被修改为', columnStore.elTreeCheckedClassificationId)
}

const authorInfo = reactive({
  avatar: userInfo.userInfoData.photo,  //el-avatar的src一般要写请求地址;如果用本地图片也要改成引用形式
  username: userInfo.userInfoData.username,
  social_media: form.social_media,  //数据库没有设计这个字段，就写我自己的算了
})
const totalInfo = reactive(<getArticleTotalInfoRes>{})

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(authorInfo, (newVal, oldVal) => {
  console.log(newVal)
})

const init = async () => {
  const articleTotalInfo = await getArticleTotalInfo()
  console.log('articleTotalInfo返回结果为', articleTotalInfo)
  //这个地方只是为了获取用户的github地址，起初不加await可能因为getUserInfo异步方法还没执行完，没给form赋上值，导致authorInfo的social_media读取到的是null
  await UserInfoMethod.getUserInfo();

  if (!articleTotalInfo.data) return false
  totalInfo.classification = articleTotalInfo.data?.classification
  totalInfo.article_num = articleTotalInfo.data?.article_num
  totalInfo.classification_num = articleTotalInfo.data?.classification_num
}

const Subscribe = () => {
  if(authorInfo.social_media==''){
    Swal.fire({
      title: "该用户没有填写订阅地址",
      heightAuto: false,
      confirmButtonColor: globalScss.colorButtonTheme,
      icon: "error",
    })
    return
  }
  window.open(authorInfo.social_media);
}

onMounted(async () => {
  await init()
  authorInfo.social_media=form.social_media;
  nextTick(() => {
    console.log('初始化得到的分类信息有', totalInfo?.classification)
  })
})
</script>

<style lang="scss" scoped>
@import "./static/style/sideCard.scss";
</style>