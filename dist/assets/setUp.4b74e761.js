import{L as R,r as S,s as v,S as p,H as m,d as T,o as k,a0 as x,aI as L,I,av as V,J as q,aw as M,c as B,b as i,g as f,w as d,u as t,i as z,f as y,C as H,D as N,a as _,aG as j,G as h,t as U,l as G}from"./index.0228ac47.js";/* empty css                     *//* empty css                  *//* empty css                 */import"./aliyun-oss-sdk.c5af02fd.js";/* empty css                */import{_ as $}from"./pageHeader.3132b316.js";import{v as J}from"./focus.de63bc5a.js";import{g as K}from"./commonality.2a0df1e0.js";import{m as O,n as Q}from"./personal.ec4b42a6.js";import{g as W,l as X}from"./stringConversion.18593f52.js";import{u as Y}from"./upload.8470b696.js";import{i as Z}from"./validate.c9820062.js";import{u as P}from"./index.24bc3126.js";import"./index.f22c08f3.js";const ee=()=>{const e=R(),a=S(),o=v({FileUrl:"",uploadUrl:"",interface:"liveCover",title:"",uploadType:"",action:"#",progress:0}),s=v({title:"",img:""});return{userStore:e,liveInformationForm:o,saveDateFormRef:a,rawData:s}},oe=e=>({handleFileSuccess:(l,u)=>{e.FileUrl=URL.createObjectURL(u.raw)},beforeFileUpload:async l=>await new Promise((u,F)=>{l.size/1024/1024>2&&(p.fire({title:"\u5C01\u9762\u5927\u5C0F\u4E0D\u80FD\u5927\u4E8E2M",heightAuto:!1,icon:"error"}),F(!1));let r=new FileReader;r.readAsDataURL(l),r.onload=()=>{let c=new Image;c.src=r.result,c.onload=()=>{console.log(c.width),console.log(c.height),c.width<960||c.height<600?(p.fire({title:"\u8BF7\u4E0A\u4F20 960*600 \u5C3A\u5BF8\u4EE5\u4E0A\u56FE\u7247",heightAuto:!1,confirmButtonColor:m.colorButtonTheme,icon:"error"}),F(!1)):u(!0)}}}),handleFileError:l=>{console.log("\u4E0A\u4F20\u5931\u8D25"),p.fire({title:"\u4E0A\u4F20\u5931\u8D25",heightAuto:!1,confirmButtonColor:m.colorButtonTheme,icon:"error"}),console.log(l)},RedefineUploadFile:async l=>{try{const u=await Y(e,l.file);e.uploadUrl=u.path,console.log(u)}catch(u){console.log(u),p.fire({title:"\u83B7\u53D6\u4E0A\u4F20\u8282\u70B9\u5931\u8D25",heightAuto:!1,confirmButtonColor:m.colorButtonTheme,icon:"error"})}}}),te=async(e,a,o)=>{!a||await a.validate(async(s,n)=>{if(s)try{if(e.uploadUrl==o.img&&e.title==o.title)throw"\u672A\u4FEE\u6539\u4FE1\u606F";if(!e.uploadUrl)throw"\u8BF7\u5148\u4E0A\u4F20\u56FE\u7247";const l={type:e.uploadType,imgUrl:e.uploadUrl,title:e.title},u=await O(l);console.log(u),p.fire({title:"\u4FEE\u6539\u6210\u529F",confirmButtonColor:m.colorButtonTheme,heightAuto:!1,icon:"success"}),console.log("\u4E0A\u4F20\u6210\u529F")}catch(l){console.log(l),p.fire({title:"\u672A\u4FEE\u6539\u76F4\u64AD\u95F4\u4FE1\u606F",confirmButtonColor:m.colorButtonTheme,heightAuto:!1,icon:"warning"})}else console.log("error submit!",n)})},le=async(e,a)=>{try{const o=(await Q()).data;e.FileUrl=o.img;const s=W(o.img);if(s!=null&&s.pathname){let l=s==null?void 0:s.pathname.slice(1);e.uploadUrl=l,a.img=l}a.title=o.title,e.title=o.title;const n=(await K({method:e.interface})).data;e.uploadType=n.type,console.log(n)}catch(o){console.log(o),p.fire({title:"\u83B7\u53D6\u4E0A\u4F20\u65B9\u6CD5\u5931\u8D25",heightAuto:!1,confirmButtonColor:m.colorButtonTheme,icon:"error"})}},ae=async e=>{try{const{toClipboard:a}=P();await a(e),p.fire({title:"\u590D\u5236\u6210\u529F",confirmButtonColor:m.colorButtonTheme,heightAuto:!1,icon:"success"})}catch(a){console.error(a)}},se=()=>({liveInformationRules:v({title:[{validator:Z,trigger:"change"}]})}),ue=e=>(H("data-v-b46d163a"),e=e(),N(),e),re={class:"overall"},ie={class:"principal personal-layout animate__animated animate__slideInRight"},ne={class:"form-box"},ce=["src"],de={class:"form-show"},pe={class:"bottom-box"},fe=ue(()=>f("span",{class:"text"}," \u8BF7\u8BBE\u7F6E\u60A8\u7684\u76F4\u64AD\u5C01\u9762\u548C\u6807\u9898,\u4EE5\u4FBF\u66F4\u597D\u5438\u5F15\u89C2\u4F17",-1)),me={class:"button"},_e=T({__name:"setUp",setup(e){const{userStore:a,liveInformationForm:o,saveDateFormRef:s,rawData:n}=ee(),l=oe(o),{liveInformationRules:u}=se();return k(()=>{le(o,n)}),(F,r)=>{const c=$,A=x,b=L,w=I,g=V,D=q,C=M;return _(),B("div",re,[i(c,{title:"\u76F4\u64AD\u8BBE\u7F6E","icon-nmae":"live"}),f("div",ie,[f("div",ne,[i(b,{class:"cover-uploader",action:t(o).action,"show-file-list":!1,"on-success":t(l).handleFileSuccess,"on-error":t(l).handleFileError,"before-upload":t(l).beforeFileUpload,"auto-upload":!0,"http-request":t(l).RedefineUploadFile,accept:".png,.jpg,.jpeg"},{default:d(()=>[t(o).FileUrl?(_(),B("img",{key:0,src:t(o).FileUrl,class:"cover"},null,8,ce)):(_(),y(A,{key:1,class:"cover-uploader-icon"},{default:d(()=>[i(t(j))]),_:1}))]),_:1},8,["action","on-success","on-error","before-upload","http-request"]),f("div",null,[f("div",de,[i(C,{model:t(o),ref_key:"saveDateFormRef",ref:s,rules:t(u),"label-position":"left","label-width":"5rem"},{default:d(()=>[i(g,{label:"\u76F4\u64AD\u6807\u9898",prop:"title"},{default:d(()=>[i(w,{modelValue:t(o).title,"onUpdate:modelValue":r[0]||(r[0]=E=>t(o).title=E)},null,8,["modelValue"])]),_:1}),i(g,{label:"Adders"},{default:d(()=>[h(U(t(a).userInfoData.liveData.address),1)]),_:1}),i(g,{label:"key"},{default:d(()=>[h(U(t(X)(t(a).userInfoData.liveData.key))+" ",1),i(D,{onClick:r[1]||(r[1]=E=>t(ae)(t(a).userInfoData.liveData.key)),class:"copy",color:"#626aef",size:"small",plain:"",round:""},{default:d(()=>[h(" copy ")]),_:1})]),_:1})]),_:1},8,["model","rules"])])])]),f("div",pe,[fe,f("div",me,[z((_(),y(D,{onClick:r[2]||(r[2]=E=>t(te)(t(o),t(s),t(n))),type:"primary",round:""},{default:d(()=>[h("\u4FDD\u5B58\u8D44\u6599 ")]),_:1})),[[t(J)]])])])])])}}});const Te=G(_e,[["__scopeId","data-v-b46d163a"]]);export{Te as default};
