import {defineStore} from "pinia";
import {ref} from "vue";

const useColumnStore = defineStore('comment', {
    state: () => {
        return {
            elTreeCheckedClassificationId: ref(0),
        }
    },
});

export default useColumnStore;