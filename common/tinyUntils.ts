import * as common from "./common";
import * as fs from "fs";

const tinify = require("tinify");
let nowUsedkey = '';

export function setUsedKey(key:string) {
    if (!tinify.key) {
        nowUsedkey = key;
        tinify.key = key;
        console.log(nowUsedkey);
    }
}

/**
 * 检查校验
 */
export function checkVerify() {
    return new Promise(function (reslove,reject) {
        tinify.validate(function(err) {
            if (err) {
                reject(err);
            }else {
                reslove(true);
            }
          })
    }); 
}

/**
 * 获取待使用数量
 */
export function getTotalUsage() {
    return new Promise(function (reslove,reject) {
        tinify.validate(function(err) {
            if (err) {
                reject(err);
            }else {
                let compressionsThisMonth = tinify.compressionCount;
                console.log('已使用数量：' + compressionsThisMonth);
                let num:number =  500 - Number(compressionsThisMonth);
                reslove(num);
            }
          })
    }); 
}

/**
 * 更换使用的key
 */
export function changeUsedKey() {
    let config:any = common.getConfig();
    let keyList:any = common.getTinyConf();
    let keyListLeng:number = keyList.length;
    let index:number = 0;
    if (keyListLeng <= 0) {
        console.log('key的数量为:'+keyListLeng+',没有可更换的key');
        return false;
    }
    let Ym:string = common.getCurrentDateString(new Date(), 1);
    let UsedPath:string =  config['dirPath']['keyUsed'] + Ym + '.csv';
    let nowUsed:any = common.getCsvData(UsedPath);
    if (nowUsed) {
        let nowUsedLeng:number = nowUsed.length;
        let remainder:number = keyListLeng - nowUsedLeng;
        if (remainder > 0) {
            index = nowUsedLeng;
            let key:string = keyList[index]['key'];
            setUsedKey(key);
            return true;
        }else {
            console.log('key的数量为'+keyListLeng+',没有可更换的key');
            return false;
        }

    }else {
        let key:string = keyList[index]['key'];
        setUsedKey(key);
        return true;
    }
}

/**
 * 自动更换key
 * @param list 
 */
export async function automaticChangeKey(list:Array<string>) {
    let leng:number = list.length;
    if (leng <= 0) {
        console.log("待处理列表为空！");
        return false;
    }
    
    let flag = changeUsedKey();
    if (!flag) {
        console.log("没有可以使用的key");
        return false;
    }
    
    let total = await getTotalUsage();
    
    if (typeof(total) == "number" && total > 0) {

        for (let i = 0; i < leng; i++) {
            if (i == total) {
                let config:any = common.getConfig();
                let Ym:string = common.getCurrentDateString(new Date(), 1);
                //已使用完毕的key写入文件
                common.writeStringToFile(nowUsedkey, config['dirPath']['keyUsed'], Ym);
                //更换key
                let flag = changeUsedKey();
                if (!flag) {
                    break;
                }
            }
            compressImages(list[i]);
        }
    }
}

/**
 * 压缩图片
 * @param data  图片文件名
 * @param inputPath 待处理图片目录地址
 * @param outputPath 图片输出目录地址
 * @param type  0 单个图片 1 图片列表
 * @param mode 0 图片路径 1 buffer 2 图片网址
 */
export function compressImages(data:any, inputPath:string = '', outputPath:string = '', type:number = 0, mode:number = 0) {
    if (!data) {
        return false;
    }
    let config:any = common.getConfig();
    if (!inputPath) {
        inputPath =  config['dirPath']['imagePath'];
    }

    if (!outputPath) {
        outputPath = config['dirPath']['outputPath'];
    }

    if (type == 1) {
        let leng:number = data.length;
        if (leng <= 0) {
            return false;
        }
        for(let i in data) {
            let info = data[i];
            let source = tinify.fromFile(inputPath + info);
            source.toFile(outputPath + info);
        }
    }else {
        let source = tinify.fromFile(inputPath + data);
        source.toFile(outputPath + data);
    }
}

/**
 * 压缩本地图片
 * @param info 
 * @param inputPath 
 * @param outputPath 
 */
export function compressImagesfromFile(info:string, inputPath:string = '', outputPath:string = '') {
    return tinify.fromFile(inputPath + info).toFile(outputPath + info, function (err){
        if (err instanceof tinify.AccountError) {
            console.log("The error message is: " + err.message);
            // Verify your API key and account limit.
          } else if (err instanceof tinify.ClientError) {
            // Check your source image and request options.
          } else if (err instanceof tinify.ServerError) {
            // Temporary issue with the Tinify API.
          } else if (err instanceof tinify.ConnectionError) {
            // A network connection error occurred.
          } else {
            // Something else went wrong, unrelated to the Tinify API.
          }
    });
}

/**
 * 压缩远程图片
 * @param info 
 * @param url 
 * @param outputPath 
 */
export function compressImagesfromUrl(info:string, url:string, outputPath:string = '') {
    return tinify.fromUrl(url).toFile(outputPath + info, function (err){
        if (err instanceof tinify.AccountError) {
            console.log("The error message is: " + err.message);
            // Verify your API key and account limit.
          } else if (err instanceof tinify.ClientError) {
            // Check your source image and request options.
          } else if (err instanceof tinify.ServerError) {
            // Temporary issue with the Tinify API.
          } else if (err instanceof tinify.ConnectionError) {
            // A network connection error occurred.
          } else {
            // Something else went wrong, unrelated to the Tinify API.
          }
    });

}

/**
 * 读取图片buffer写入文件
 * @param info 
 * @param inputPath 
 * @param outputPath 
 */
export function compressImagesfrombuffer(info:string, inputPath:string = '', outputPath:string = '') {
    fs.readFile(inputPath + info, function(err, sourceData) {
        if (err) throw err;
        tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
          if (err) throw err;
          fs.writeFileSync(outputPath + info, resultData);
        });
      });
}


/**
 * 图片裁剪
 * 
 */
export function  resizedImages() {

}





