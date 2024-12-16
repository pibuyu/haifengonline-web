import{u as C,b as O,U as P,c as M,d as $,e as K}from"./commonality.2a0df1e0.js";import{C as J,c as I,O as N}from"./aliyun-oss-sdk.c5af02fd.js";import{r as D,M as R,af as q}from"./index.0228ac47.js";var H=function(e){return new Promise(function(a,n){const t=new FileReader;t.onerror=function(o){n(o.target.error)},t.onload=function(o){a(o.target.result)},t.readAsArrayBuffer(e)})};const w=s=>{const e=s.lastIndexOf(".");let a="";return e!==-1&&(a=s.substring(e)),a},W=s=>{const e=new Uint8Array(s),a=[];for(let n=0;n<e.length;n+=4)a.push(e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3]);return I.exports.lib.WordArray.create(a,e.length)},E=async s=>{const e=await H(s);return I.exports.SHA256(W(e)).toString()},G=async(s,e)=>new Promise((a,n)=>{new J(s,{quality:e,success(t){a(t)},error(t){n(t)}})}),L=s=>s&&["image/gif","image/jpeg","image/png","image/svg+xml"].includes(s.type),Q=async(s,e=1,a)=>{const n=1048576*e,t=s.size,u=s.name;let o=0,r=1,l=o+n;const c=[];for(;o<t;){const h=Math.min(l,t),g=s.slice(o,h),d=await E(g);c.push({file:g,size:t,index:r,fileSizeInByte:t,name:u,fileName:u,hash:d,sliceSizeInByte:g.size,progress:0,fileKey:a}),o=h,l=o+n,r+=1}return c},V=async(s,e,a,n)=>new Promise(async(t,u)=>{if(n){const o=async()=>{var S,k,x;const l=await E(s)+w(s.name);let c=await Q(s,1,l),h=D([]);c.filter(i=>{h.value.push({index:i.index,hash:i.hash})});const g=await O({file_md5:l,interface:e.interface,slice_list:c});if((S=g.data)!=null&&S.is_upload)return e.progress=100,t({path:(k=g.data)==null?void 0:k.path});let d=[];(x=g.data)==null||x.list.filter(i=>{d.push(i.index)});const p=c.filter(i=>d.includes(i.index));c=c.filter(i=>(d.includes(i.index)||(i.progress=100),i)),console.log("\u6240\u4EE5\u9700\u8981\u4E0A\u4F20\u7684\u5207\u7247",c),console.log("\u672A\u4E0A\u4F20\u7684\u5207\u7247",p);let f=[];for(let i=0;i<p.length;i++){const m=new FormData;m.append("interface",e.interface),m.append("name",p[i].hash),m.append("file",p[i].file);const b=new Promise(async(T,_)=>{const F=D({index:i,progress:0,size:p[i].size});let v=R(()=>{F.value.progress},()=>{if(c.filter((y,U,Z)=>(y.index===p[i].index&&(c[U].progress=F.value.progress,r(c,e)),y)),F.value.progress===100){v(),T();return}},{deep:!0});await P(m,F.value).catch(y=>{_(y)})});f.push(b)}try{await Promise.all(f),console.log("\u6240\u6709\u5206\u7247\u4E0A\u4F20\u5B8C\u6210");const i=await M({file_name:l,interface:e.interface,slice_list:c});return e.progress=100,t({path:i.data})}catch{console.log("\u5B58\u5728\u672A\u4E0A\u4F20\u5206\u7247"),o()}},r=(l,c)=>{const h=s.size;let g=0;l.filter(p=>{g+=p.sliceSizeInByte*p.progress/100});let d=Math.round(g/h*100);c.progress=d};return o()}else{const o=await E(s)+w(s.name),r=new FormData;r.append("interface",e.interface),r.append("name",o),r.append("file",s);try{const l=await C(r,e);t({path:l.data}),console.log(l)}catch(l){console.log(l),u({msg:"\u4E0A\u4F20\u5931\u8D25"})}}}),X=async s=>new Promise((e,a)=>{const n=q();$().then(t=>{if(t.code==200){if(!t.data)return!1;let u=t.data;console.log("\u83B7\u53D6ossSts\u7684\u4FE1\u606F\u4E3A",t.data),n.setOssInfo({region:u.region,accessKeyId:u.access_key_id,accessKeySecret:u.access_key_secret,stsToken:u.sts_token,bucket:u.bucket,expirationTime:u.expiration_time}),e(n.ossData)}else console.log("\u8BF7\u6C42oss\u670D\u52A1\u5668\u51FA\u9519"),a(t)}).catch(t=>{console.log("\u83B7\u53D6ossSts\u4FE1\u606F\u548C\u7F13\u5B58\u4FE1\u606F\u8FC7\u7A0B\u51FA\u9519:",t),a(t)})}),Y=(s,e,a,n)=>new Promise((t,u)=>{X(e.interface).then(async o=>{const r=await E(s)+w(s.name),l=`${a}${r}`;console.log("\u5373\u5C06\u4E0A\u4F20\u5230oss\u7684\u8DEF\u5F84\u4E3A:",a,"+",r),o.region="oss-cn-hangzhou";const c=new N({region:o.region,accessKeyId:o.accessKeyId,accessKeySecret:o.accessKeySecret,stsToken:o.stsToken,bucket:o.bucket});if(n){console.log("\u5206\u7247\u4E0A\u4F20");var h=z(r);const d={checkpoint:h,progress:(p,f)=>{B(r,f),console.log(f),e.progress=Math.round(p*100)},parallel:4,partSize:1*1024*1024,mime:"text/plain"};try{const p=await c.multipartUpload(`${a}${r}`,s,{...d});A(r),t({path:l}),console.log(p)}catch(p){A(r),console.log(p),u({msg:"\u4E0A\u4F20\u5931\u8D25"})}}else{console.log("\u65E0\u6587\u4EF6\u5206\u7247\u7684\u666E\u901A\u4E0A\u4F20");var h=z(r);const g={checkpoint:h,progress:(d,p)=>{e.progress=Math.round(d*100),B(r,p)},mime:"text/plain",parallel:4,partSize:200*1024};try{const d=await c.multipartUpload(`${a}${r}`,s,{...g});A(r),t({path:l})}catch(d){console.log("\u4E0A\u4F20\u6587\u4EF6\u5230\u963F\u91CC\u4E91oss\u8FC7\u7A0B\u4E2D\u51FA\u9519",d),A(r),u({msg:"\u4E0A\u4F20\u5931\u8D25"})}}}).catch(o=>{console.log(o),u({msg:"\u4E0A\u4F20\u5931\u8D25"})})});function B(s,e){localStorage.setItem(s,JSON.stringify(e))}function z(s){var e=localStorage.getItem(s);return e?JSON.parse(e):null}function A(s){localStorage.removeItem(s)}const te=async(s,e,a)=>{var r,l;let n;a==null&&(a=!1);const t=await K({interface:s.interface});let u=(r=t.data)==null?void 0:r.path;console.log("\u5373\u5C06\u4E0A\u4F20\u5230oss\u7684\u8DEF\u5F84\u4E3A:",u);let o=(l=t.data)==null?void 0:l.quality;if(L(e))try{e=await G(e,o)}catch(c){console.log("\u538B\u7F29\u5931\u8D25\uFF01",c)}switch(s.uploadType){case"aliyunOss":n=Y(e,s,u,a);break;case"local":n=V(e,s,u,a);break}return n};export{te as u};
