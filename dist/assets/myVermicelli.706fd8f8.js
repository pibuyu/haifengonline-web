import{d as V,L as w,b2 as x,r as I,o as b,U as A,J as N,c,g as t,F as _,e as z,C as L,D as T,a,b as U,t as d,i as p,u as i,f,w as m,G as v,aG as G,B as h,Y as $,S as y,H as C,l as H}from"./index.0228ac47.js";/* empty css                  *//* empty css                  */import{v as J}from"./personal.ec4b42a6.js";import{v as D}from"./focus.de63bc5a.js";import{c as M}from"./space.754606cd.js";import"./index.f22c08f3.js";const F=n=>(L("data-v-2a3e5457"),n=n(),T(),n),R=F(()=>t("div",{class:"title"},[t("span",null,"\u7C89\u4E1D\u5217\u8868")],-1)),Y={class:"list"},j=F(()=>t("div",{class:"border"},null,-1)),q={class:"avatar"},K={class:"info"},O={class:"username"},P={class:"signature"},Q={class:"function"},W=V({__name:"myVermicelli",setup(n){const g=w(),B=x(),r=I([]),l=async e=>{try{if(g.userInfoData.id==e){y.fire({title:"\u4E0D\u80FD\u5BF9\u81EA\u5DF1\u64CD\u4F5C\u54DF!",heightAuto:!1,confirmButtonColor:C.colorButtonTheme,icon:"error"});return}await J({uid:e}),r.value=r.value.filter(o=>(o.id==e&&(o.is_attention=!o.is_attention),o))}catch{y.fire({title:"\u64CD\u4F5C\u5931\u8D25",heightAuto:!1,confirmButtonColor:C.colorButtonTheme,icon:"error"})}},S=async()=>{try{const e=await M({id:B.spaceInfoData.id});if(!e.data)return!1;r.value=e.data,console.log(e)}catch(e){console.error(e)}};return b(()=>{S()}),(e,o)=>{const k=A,u=N;return a(),c(_,null,[R,t("div",Y,[j,(a(!0),c(_,null,z(r.value,s=>(a(),c("div",{class:"item",key:s.id},[t("div",q,[U(k,{size:52,src:s.photo},null,8,["src"])]),t("div",K,[t("div",O,d(s.name),1),t("div",P,d(s.signature),1)]),t("div",Q,[s.is_attention?h("",!0):p((a(),f(u,{key:0,class:"attention",type:"primary",size:"small",round:"",icon:i(G),onClick:E=>l(s.id)},{default:m(()=>[v("\u5173\u6CE8")]),_:2},1032,["icon","onClick"])),[[i(D)]]),s.is_attention?p((a(),f(u,{key:1,class:"attention",type:"primary",size:"small",round:"",icon:i($),color:"#F1F2F3",onClick:E=>l(s.id)},{default:m(()=>[v("\u5DF2\u5173\u6CE8")]),_:2},1032,["icon","onClick"])),[[i(D)]]):h("",!0)])]))),128))])],64)}}});const ne=H(W,[["__scopeId","data-v-2a3e5457"]]);export{ne as default};
