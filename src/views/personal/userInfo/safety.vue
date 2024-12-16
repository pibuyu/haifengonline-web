<template>
    <div class="overall">
        <pageHeader title="用户安全" icon-nmae="security"></pageHeader>
        <div class="form-box personal-layout animate__animated animate__slideInRight ">
            <el-form :model="form" :rules="changePasswor" label-width="120px" ref="formRef">
                <el-form-item label="邮箱验证码" prop="username">
                    <el-input class="input-name" v-model="form.verificationCode" clearable> <template #append>
                            <el-button type="primary" size="small" round @click="sendVerificationCode(sendVerificationCodeInfo)">{{ sendVerificationCodeInfo.btnText }}</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input class="input-name" v-model="form.password" clearable />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_password">
                    <el-input class="input-name" v-model="form.confirm_password" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button v-removeFocus type="primary" round @click="onSubmit">
                        修改密码</el-button>
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
    useSafetyProp,
    useSafetyMethod,
    useRules,
} from "@/logic/personal/userInfo/safety";
import pageHeader from "@/components/personalNavigation/pageHeader.vue";
import { vRemoveFocus } from "@/utils/customInstruction/focus"
import {onMounted, reactive, ref, watch} from "vue";


components: {
    pageHeader;
}

const { form ,sendVerificationCodeInfo} = useSafetyProp();
const { sendVerificationCode, onSubmit } = useSafetyMethod(form);
const { changePasswor } = useRules();

// const validatorPassword=(value:any,rule:any,callback:any)=>{
//   if(value==''){
//     callback(new Error('请输入密码'))
//   }else if(value.length<6){
//     callback(new Error('密码长度至少为6位'))
//   }
//   callback()
// }
// const validatorConfirmPassword=(value:any,rule:any,callback:any)=>{
//   if(value==''||value.length<6){
//     callback(new Error('密码长度至少为6位'))
//   }else if(value!=form.password){
//     callback(new Error('两次输入的密码要一致'))
//   }
//   callback()
// }
// const rules={
//   password:[{required:true,trigger:"blur",validator:validatorPassword}],
//   confirm_password:[{required:true,trigger:"blur",validator:validatorConfirmPassword}]
// }


onMounted(() => {

})


</script>
<style scoped lang="scss">
@import "@/assets/styles/views/personal/userInfo/safety.scss";
@import "@/assets/styles/global/el-style.scss";
</style>
