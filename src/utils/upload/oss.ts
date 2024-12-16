import {gteossSTS} from "@/apis/commonality"
import {useGlobalStore} from "@/store/main"
import {FileUpload, OssSTSInfo} from "@/types/idnex"
import OSS from 'ali-oss'
import {fileHash, fileSuffix} from "./fileManipulation"

//初始化sts
// 获取到的上传到oss的配置信息为 是初始化的时候出错了
export const initOssSTS = async (_interface: string): Promise<OssSTSInfo> => {
    return new Promise((resolve, reject) => {
        // 从本地localstore从获取配置
        const globalStore = useGlobalStore()

        //todo:这个token过期的很快，先不走缓存，需要完善一下过期的逻辑

        // if (conf) {
        //     console.log("获取本地缓存中的ossSts信息为:",conf)
        //     //  配置存在并且距离过期时间还大10分钟则返回此配置
        //     const now = new Date().getTime() / 1000
        //
        //
        //     //expirationTime已经过期啦，走的是下面后台请求的逻辑
        //     if (conf.expirationTime - 600 > now) {
        //         resolve(conf)
        //         return
        //     }
        // }
        // 请求接口返回配置数据
        //  gteossSTS 在这里重新请求和重写了ossSTS的信息
        gteossSTS()
            .then((res) => {
                if (res.code == 200) {
                    if (!res.data) {
                        return false
                    }
                    let info = res.data
                    console.log("获取ossSts的信息为",res.data)

                    //todo:写缓存不能关，不然我们返回的是globalStore里的ossData，不写缓存返回的就是旧数据甚至null了

                    globalStore.setOssInfo(<OssSTSInfo>{
                        region: info.region,
                        accessKeyId: info.access_key_id,
                        accessKeySecret: info.access_key_secret,
                        stsToken: info.sts_token,
                        bucket: info.bucket,
                        expirationTime: info.expiration_time
                    })
                    resolve(globalStore.ossData);
                } else {
                    console.log('请求oss服务器出错')
                    reject(res)
                }
            })
            .catch((err) => {
                console.log("获取ossSts信息和缓存信息过程出错:",err);
                reject(err)
            })
    })
}


/**
 * 往Oss上传文件
 * @param file File对象
 * @returns {Promise<{name:string,host:string}>}
 */
//向aliyun oss putObject的方法在oss.ts里
export const ossUpload = (file: File, uploadConfig: FileUpload, dir: string, fragment: boolean): Promise<{ path: string }> => {
    return new Promise((resolve, reject) => {
        initOssSTS(uploadConfig.interface)
            .then(async (ossSts) => {
                //得到名称及其初始化
                const name = await fileHash(file) + fileSuffix(file.name)
                const key = `${dir}${name}`
                console.log("即将上传到oss的路径为:",dir,"+",name)
                //后台返回的region是sts.cn-guangzhou.aliyuncs.com，不需要.aliyuncs.com后缀，这里简单修改一下
                ossSts.region = 'oss-cn-hangzhou'
                // 初始化阿里云oss客户端
                const client = new OSS({
                    region: ossSts.region,
                    accessKeyId: ossSts.accessKeyId,
                    accessKeySecret: ossSts.accessKeySecret,
                    stsToken: ossSts.stsToken,
                    bucket: ossSts.bucket,
                    // secure:true,//看其他博客里说的要把secure属性写为true，但是好像也不管用
                    //todo：官方建议加上refreshSTSToken方法,但是也不需要，因为initOssSTS的getOssSTS方法已经进行了expiration判断，过期会调用后端请求重新生成StsToken
                });
                // console.log("打印ossSts的全部信息,region:",ossSts.region,";accessKeyId:",ossSts.accessKeyId,";accessKeySecret:",ossSts.accessKeySecret,";expirationTime:",ossSts.expirationTime);

                if (!fragment) {
                    console.log("无文件分片的普通上传")
                    //为了能够显示进度条,也进行了分片上传
                    // 下面这几行是控制上传进度条显示的
                    var checkpoint = getCheckpoint(name);
                    //缓存里面压根没有checkpoint这个item
                    const options = {
                        checkpoint: checkpoint,
                        progress: (p: any, cpt: any) => {
                            // console.log("上传进度", p)
                            uploadConfig.progress = Math.round(p * 100)
                            saveCheckpoint(name, cpt);
                        },
                        mime: "text/plain",
                        // 设置并发上传的分片数量。
                        parallel: 4,
                        // 设置分片大小。默认值为1 MB，最小值为100 KB。
                        partSize: 200 * 1024,
                    };

                    try {
                        const res = await client.multipartUpload(`${dir}${name}`, file, {
                            ...options,
                        });
                        // const res = await client.put(`${dir}${name}`, file)
                        deleteCheckpoint(name);
                        resolve({path: key})
                    } catch (err) {
                        console.log('上传文件到阿里云oss过程中出错', err);
                        deleteCheckpoint(name);
                        reject({msg: '上传失败'})
                    }
                } else {
                    console.log("分片上传")
                    //分片上传加断点续传
                    var checkpoint = getCheckpoint(name);
                    const options = {
                        checkpoint: checkpoint,
                        // 获取分片上传进度、断点和返回值。
                        progress: (p: any, cpt: any) => {
                            saveCheckpoint(name, cpt);
                            console.log(cpt)
                            uploadConfig.progress = Math.round(p * 100)
                        },
                        // 设置并发上传的分片数量。
                        parallel: 4,
                        // 设置分片大小。默认值为1 MB，最小值为100 KB。
                        partSize: 1 * 1024 * 1024,
                        mime: "text/plain",
                    };
                    try {
                        const res = await client.multipartUpload(`${dir}${name}`, file, {
                            ...options,
                        });
                        deleteCheckpoint(name);
                        resolve({path: key})

                        console.log(res)
                    } catch (err) {
                        deleteCheckpoint(name);
                        console.log(err);
                        reject({msg: '上传失败'})
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                reject({msg: '上传失败'})
            })
    })
}

// 保存上传断点
function saveCheckpoint(key: string, checkpoint: any) {
    localStorage.setItem(key, JSON.stringify(checkpoint));
}

// 获取上传断点
function getCheckpoint(key: string,) {
    var checkpoint = localStorage.getItem(key);
    if (checkpoint) {
        return JSON.parse(checkpoint);
    } else {
        return null;
    }
}

// 删除上传断点
function deleteCheckpoint(key: string) {
    localStorage.removeItem(key);
}