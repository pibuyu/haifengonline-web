import{d as V,r as o,M as S,a0 as g,I as w,ah as C,ai as E,c as I,g as n,b as e,w as s,Q as k,k as B,a as N,u as U,ag as b,G as p,aU as K,ab as L,l as M}from"./index.0228ac47.js";/* empty css                     *//* empty css                  *//* empty css                 *//* empty css                */import{t as z}from"./topNavigation.fd811867.js";/* empty css               *//* empty css               *//* empty css                   *//* empty css                                                                      *//* empty css                  */import"./index.f22c08f3.js";/* empty css                   *//* empty css                  */import"./live.facdac17.js";/* empty css                 */import"./personal.ec4b42a6.js";import"./vue-ellipsis-3.es.74e51318.js";import"./focus.de63bc5a.js";import"./el-infinite-scroll.3c533531.js";/* empty css                        */import"./stringConversion.18593f52.js";import"./index.24bc3126.js";const F={class:"main"},R={class:"head"},T={class:"search-box"},G={class:"menu"},P={class:"content"},Q=V({__name:"Layout",setup(j){const a=K(),r=B(),t=o(""),i=o("VideoSearch");o(1),o(10),o(100);const m=()=>{if(!t.value)return!1;r.push({name:"VideoSearch",params:{text:t.value}})},d=()=>{if(!t.value)return!1;r.push({name:"VideoSearch",params:{text:t.value}})},_=(c,u)=>{r.push({name:c})};return S(()=>a.path,async()=>{t.value=a.params.text,a.path.split("/")[a.path.split("/").length-1]=="video"?i.value="VideoSearch":a.path.split("/")[a.path.split("/").length-1]=="user"&&(i.value="UserSearch")},{immediate:!0,deep:!0}),(c,u)=>{const h=g,v=w,l=C,f=E,x=L("router-view");return N(),I("div",F,[n("div",R,[e(z,{color:"#000",displaySearch:!1})]),n("div",T,[e(v,{modelValue:t.value,"onUpdate:modelValue":u[0]||(u[0]=y=>t.value=y),placeholder:"\u627E\u4F60\u60F3\u770B...",size:"large",onKeyup:k(d,["enter","native"])},{suffix:s(()=>[e(h,{onClick:m},{default:s(()=>[e(U(b))]),_:1})]),_:1},8,["modelValue","onKeyup"])]),n("div",G,[e(f,{"default-active":i.value,class:"el-menu-demo",mode:"horizontal",onSelect:_},{default:s(()=>[e(l,{index:"VideoSearch"},{default:s(()=>[p("\u89C6\u9891")]),_:1}),e(l,{index:"UserSearch"},{default:s(()=>[p("\u7528\u6237")]),_:1})]),_:1},8,["default-active"])]),n("div",P,[e(x)])])}}});const me=M(Q,[["__scopeId","data-v-150d7d8d"]]);export{me as default};
