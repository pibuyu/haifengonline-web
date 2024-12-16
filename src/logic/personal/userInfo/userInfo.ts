import { UserInfoRes } from '@/types/personal/userInfo/userInfo';
import { reactive } from "vue";
import {checkIn, getIntegral, getUserInfoRequist, setUserInfoRequist} from "@/apis/personal"
import { validateRepeatName } from '@/utils/validate/validate';
import globalScss from "@/assets/styles/global/export.module.scss"
import Swal from 'sweetalert2';

export const useUserInfoProp = () => {
    const form = reactive<UserInfoRes>({
        username: "",
        gender: 0,
        birth_date: "",
        is_visible: true,
        signature: "",
        email:'',
        user_integral:0,
        social_media:'',
    });

    return {
        form
    }
}

export const useUserInfoMethod = (form: UserInfoRes) => {
    const onSubmit = () => {
        setUserInfo()
    };

    const getUserInfo = async () => {
        try {
            let data = await getUserInfoRequist()
            // console.log('获取用户信息的返回结果',data)
            data.data = <UserInfoRes>data.data
            form.username = data.data.username
            form.gender = data.data.gender
            form.birth_date = data.data.birth_date
            form.is_visible = data.data.is_visible
            form.signature = data.data.signature
            form.email=data.data?.email
            form.social_media=data.data?.social_media
            // console.log("获取到的用户github为",form.social_media)
        } catch (err) {
            console.log(err)
        }
    }

    const setUserInfo = async () => {
        // console.log("更新后的个人信息：",form)
        try {
            let data = await setUserInfoRequist(form)
            Swal.fire({
                title: "修改成功",
                heightAuto: false,
                icon: "success",
                confirmButtonColor: globalScss.colorButtonTheme,
            })
            // console.log(data)
        } catch (err) {
            Swal.fire({
                title: err.message,
                heightAuto: false,
                icon: "warning",
                confirmButtonColor: globalScss.colorButtonTheme,
            })
            console.log(err)
        }
    }

    const userCheckIn=async () => {
        try {
            let result=await checkIn()
            // console.log("签到返回结果为"+result.message)
            // console.log(result.data)
            if (result.code==200){
                Swal.fire({
                    title:result.data,
                    heightAuto:false,
                    confirmButtonColor:globalScss.colorButtonTheme,
                })
            }else{
                Swal.fire({
                    title:result.data,
                    heightAuto:false,
                    confirmButtonColor:globalScss.colorButtonTheme,
                })
            }
        }catch (err){
            console.log(err)
        }
    }

    const getUserIntegral=async ()=>{
        try {
            let result=await getIntegral()
            console.log("获取用户积分结果为:"+result.data)
            form.user_integral=result.data as number
        }catch (err){
            console.log(err)
        }

    }

    return {
        getUserInfo,
        setUserInfo,
        onSubmit,
        userCheckIn,
        getUserIntegral,
    }
}


//表单验证
export const useRules = () => {
    const userInfoRules = reactive({
        username: [{ validator: validateRepeatName, trigger: 'change' }],
    });
    return {
        userInfoRules,
    };
}; 
