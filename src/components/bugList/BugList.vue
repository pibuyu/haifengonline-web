<script setup lang="ts">
import {ref} from "vue";
import Swal from "sweetalert2";
import globalScss from "@/assets/styles/global/export.module.scss";
import {submitBugReq} from "@/apis/home";
import {SubmitBugReqStruct} from "@/types/home/home";
const input=ref('')
const phone=ref('')
const submitBug=  async () => {
  //先校验是否输入了内容
  if (!input.value) {
    Swal.fire({
      title: "请输入bug反馈内容！",
      heightAuto: false,
      confirmButtonColor: globalScss.colorButtonTheme,
      icon: "error",
    })
  }
  //手机号不是必须的
  const req:SubmitBugReqStruct={
    content:input.value,
    phone:phone.value||undefined,
  }
  await submitBugReq(req)
  //清除input和phone的内容
  input.value=""
  phone.value=""
  Swal.fire({
    title: "反馈成功",
    heightAuto: false,
    confirmButtonColor: globalScss.colorButtonTheme,
    icon: "success",
  })
}
</script>

<template>
  <div class="bug-box">
    <p class="title">bug反馈</p>
    <el-input v-model="input"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="描述您遇到的问题"
              type="textarea"
              maxlength="200"
              show-word-limit
    class="bug-content"/>
    <el-input v-model="phone" placeholder="留下您的联系方式"  maxlength="20" class="phone"></el-input>
    <el-button round type="primary" class="submitButton" @click="submitBug">提交</el-button>
  </div>
</template>

<style scoped lang="scss">
@import "./static/style/bugList.scss";
</style>