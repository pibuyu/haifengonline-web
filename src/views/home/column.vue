<template>
    <div class="mian">
        <div class="head">
            <topNavigation color="#fff" scroll :displaySearch="false"></topNavigation>
        </div>
        <!-- 封面图 -->
        <div class="cover-picture">
            <div class="centre-box">
                <div>让我们开始创作</div>
                <div class="type-box">{{ obj.output }}<span class="cursor">|</span></div>
            </div>
            <div class="bannerWave1"></div>
            <div class="bannerWave2"></div>
<!--            <div class="down"></div>-->
        </div>
        <div class="column-box">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="sideCard">
                        <SideCard></SideCard>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div></div>
                    <Column />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import Column from "@/components/columnBroadcast/column.vue";
import SideCard from "@/components/columnBroadcast/sideCard.vue";
import topNavigation from "@/components/topNavigation/topNavigation.vue";
import EasyTyper from 'easy-typer-js';
import { onMounted, reactive } from 'vue';

components: {
    topNavigation
    Column
    SideCard
}
// 实例化
const obj = reactive({
    output: '',
    isEnd: false,
    speed: 300,
    singleBack: true,
    sleep: 3000,
    type: 'custom',
    backSpeed: 40,
    sentencePause: false
})


onMounted(() => {
    // fetchData()
})
</script>

<style scoped lang="scss">
@import "@/assets/styles/views/home/column.scss";
</style>
