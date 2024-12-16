import {defineStore} from "pinia";
import {ref} from "vue";

const useCommentStore = defineStore('comment',{
    state:() =>{
        return {
            highLightCommentId:ref(0),
        }
    },
});

export default useCommentStore;