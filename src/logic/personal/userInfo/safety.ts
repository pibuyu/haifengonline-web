import { changePassword, sendEmailVerificationCodeByChangePassword } from "@/apis/personal";
import globalScss from "@/assets/styles/global/export.module.scss";
import { useGlobalStore } from "@/store/main";
import { changePasswordReq, sendEmailInfo } from '@/types/personal/userInfo/security';
import { validatePassword, validateVarCode } from '@/utils/validate/validate';
import Swal from 'sweetalert2';
import { reactive } from "vue";


const loading = useGlobalStore().globalData.loading


export const useSafetyProp = () => {
    const form = reactive<changePasswordReq>({
        verificationCode: "",
        password: "",
        confirm_password: "",
    });

    const sendVerificationCodeInfo = reactive<sendEmailInfo>({
        btnText: "发送",
        isPleaseClick: true
    })

    return {
        form,
        sendVerificationCodeInfo
    }
}

export const useSafetyMethod = (form: changePasswordReq) => {
    const onSubmit = () => {
        setUserInfo()
    };

    const sendVerificationCode = async (sendVerificationCodeInfo: sendEmailInfo) => {
        if (sendVerificationCodeInfo.isPleaseClick == false) return
        try {
            loading.loading = true
            const result = await sendEmailVerificationCodeByChangePassword()

            sendVerificationCodeInfo.isPleaseClick = false
            loading.loading = false

            Swal.fire({
                title: "验证码已发送！",
                heightAuto: false,
                icon: "success",
                confirmButtonColor: globalScss.colorButtonTheme,
            })
            sendVerificationCodeInfo.btnText = "60"
            //每秒轮询一次sendVerificationCodeInfo.btnText内容，如果是倒计时的数字，则数字-1；如果倒计时完毕，将按钮文字置为“发送”并设置按钮为可点击状态
            const interval = setInterval(() => {   //setInterval方法返回一个计时器对象，在回调函数里调用clearInterval可以销毁这个计时器
                if (Number(sendVerificationCodeInfo.btnText) <= 0) {
                    sendVerificationCodeInfo.btnText = "发送"
                    sendVerificationCodeInfo.isPleaseClick = true
                    clearInterval(interval)
                } else {
                    sendVerificationCodeInfo.btnText = String(Number(sendVerificationCodeInfo.btnText) - 1)
                }
            }, 1000)

        } catch (err) {
            loading.loading = false
            console.log(err)

        }
    }

    const setUserInfo = async () => {
        try {
            loading.loading = true
            let res = await changePassword(form)
            Swal.fire({
                title: "修改成功",
                heightAuto: false,
                icon: "success",
                confirmButtonColor: globalScss.colorButtonTheme,
            })
            form.confirm_password = ""
            form.verificationCode = ""
            form.password = ""
            loading.loading = false
        } catch (err: any) {
            loading.loading = false
            Swal.fire({
                title: (err as Error).message,
                confirmButtonColor: globalScss.colorButtonTheme,
                heightAuto: false,
                icon: "warning",

            })
        }
    }

    return {
        sendVerificationCode,
        setUserInfo,
        onSubmit
    }
}


//表单验证
export const useRules = () => {
    const changePasswor = reactive({
        verificationCode: [{ validator: validateVarCode, trigger: 'change' }],
        confirm_password: [{ validator: validatePassword, trigger: 'change' }],
        password: [{ validator: validatePassword, trigger: 'change' }],
    });
    return {
        changePasswor,
    };
}; 
