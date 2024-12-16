<template>
  <div class="overall">
    <pageHeader title="编辑信息" icon-nmae="userData"></pageHeader>
    <div class="form-box personal-layout animate__animated animate__slideInRight ">
      <el-form :model="form" :rules="userInfoRules" label-width="120px">
        <el-form-item label="昵称" prop="username">
          <el-input class="input-name" v-model="form.username" clearable />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择您的性别">
            <el-option label="男生" :value="0" />
            <el-option label="女生" :value="1" />
            <el-option label="薛定谔的猫" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-col :span="11">
            <el-date-picker
              v-model="form.birth_date"
              type="date"
              placeholder="请选出生年月日"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="他人可见">
          <el-switch class="switch-btn" v-model="form.is_visible" />
        </el-form-item>
        <el-form-item label="我的邮箱">
          <el-input style="width: 30%" v-model="form.email" readonly />
        </el-form-item>
        <el-form-item label="社交媒体">
          <el-input style="width: 30%" v-model="form.social_media" placeholder="展示社媒地址，可以获得更多关注"></el-input>
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            class="input-hobby"
            v-model="form.signature"
            type="textarea"
            resize="none"
            rows="3"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-removeFocus type="primary" round @click="UserInfoMethod.onSubmit">
            修改资料</el-button
          >
        </el-form-item>
        <el-form-item label="每日签到">
          <el-button type="primary" round @click="UserInfoMethod.userCheckIn()">
          点击签到
          </el-button>
        </el-form-item>
        <el-form-item label="我的积分">
<!--          <el-input :readonly="true" class="input-integral" v-model="form.user_integral"></el-input>-->
          {{form.user_integral}}
        </el-form-item>
      </el-form>

      <div class="figure-box">
        <div class="figure"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useUserInfoProp,
  useUserInfoMethod,
  useRules,
} from "@/logic/personal/userInfo/userInfo";
import pageHeader from "@/components/personalNavigation/pageHeader.vue";
import {vRemoveFocus} from "@/utils/customInstruction/focus"
import {onMounted, reactive} from "vue";
import {checkIn} from "@/apis/personal";


components: {
  pageHeader;
}
const obj=reactive({
  integral:10,
})
const { form } = useUserInfoProp();
const UserInfoMethod = useUserInfoMethod(form);
const { userInfoRules } = useRules();
// const userIntegral=UserInfoMethod.getUserIntegral();

onMounted(() => {
  UserInfoMethod.getUserInfo();
  UserInfoMethod.getUserIntegral();
})

// const checkInMethod=async ()=>{
//   await checkIn()
// }


</script>
<style scoped lang="scss">
@import "@/assets/styles/views/personal/userInfo/userInfo.scss";
@import "@/assets/styles/global/el-style.scss";
</style>
