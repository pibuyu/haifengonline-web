import Swal from 'sweetalert2';
import globalScss from "@/assets/styles/global/export.module.scss"
import {Ref, ref} from 'vue';
import {useSpaceStore} from '@/store/main';
import {getFavoriteVideoList, getCollectListName} from '@/apis/personal';
import {
    GetFavoriteVideoListReq,
    GetFavoriteVideoListRes,
    GetCollectListName
} from '@/types/personal/collect/collectList';
import {RouteLocationNormalizedLoaded, useRoute} from 'vue-router';

export const useCollectListProp = () => {
    const route = useRoute()
    const spaceData = useSpaceStore()
    const releaseInformation = ref(<GetFavoriteVideoListRes>{})
    const isLoading = ref(false)
    const collectListName = ref("")
    return {
        spaceData,
        releaseInformation,
        isLoading,
        route,
        collectListName
    }
}


export const useInit = async (route: RouteLocationNormalizedLoaded, releaseInformation: Ref<GetFavoriteVideoListRes>, isLoading: Ref<boolean>, collectListName?: Ref<string>) => {
    // 修改collectListName
    try {
        let id = parseInt(route.params.id as string)
        const data = await getFavoriteVideoList(<GetFavoriteVideoListReq>{
            favorite_id: id
        })
        // @ts-ignore
        // collectListName.value = await getCollectListName(<GetCollectListName>{
        //     favorite_id: id
        // })
        // console.log("获取到的收藏夹的title为", collectListName.value)
        if (!data.data) return false
        releaseInformation.value.videoList = data.data.videoList
        isLoading.value = true
        console.log(releaseInformation)
    } catch (err) {
        console.log(err)
        Swal.fire({
            title: "获取收藏夹内容失败",
            heightAuto: false,
            confirmButtonColor: globalScss.colorButtonTheme,
            icon: "error",
        })
    }
}