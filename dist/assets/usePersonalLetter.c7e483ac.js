import{v as u,w as a}from"./personal.ec4b42a6.js";import{L as n,S as o,H as r,K as s}from"./index.0228ac47.js";const f=async t=>{try{const e=n();return console.log(e.userInfoData.id,t),e.userInfoData.id==t?(o.fire({title:"\u4E0D\u80FD\u5BF9\u81EA\u5DF1\u64CD\u4F5C\u54DF!",heightAuto:!1,confirmButtonColor:r.colorButtonTheme,icon:"error"}),Promise.reject(!1)):(await u({uid:t}),Promise.resolve(!0))}catch{return o.fire({title:"\u64CD\u4F5C\u5931\u8D25",heightAuto:!1,confirmButtonColor:r.colorButtonTheme,icon:"error"}),Promise.reject(!1)}},h=async t=>{const e=s();try{await a({id:t}),s(),e.tid=t,e.isShow=!0}catch{o.fire({title:"\u79C1\u4FE1\u5931\u8D25",heightAuto:!1,confirmButtonColor:r.colorButtonTheme,icon:"error"})}};export{f as a,h as u};
