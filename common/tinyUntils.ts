import * as common from "./common";

const tinify = require("tinify");

export function setUsedKey(key:string) {
    if (!tinify.key) {
        tinify.key = key;
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
                console.log(compressionsThisMonth);
                let num =  500 - Number(compressionsThisMonth);
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
    if (keyListLeng <= 1) {
        console.log('key的数量为'+keyListLeng+',没有可更换的key');
        return false;
    }
    let Ym:string = common.getCurrentDateString(new Date(), 1);
    let UsedPath:string =  config['keyUsed'] + Ym + '.json';
    let nowUsed:any = common.readConfig(UsedPath);
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
 * 压缩图片
 * @param data 
 * @param inputPath 
 * @param outputPath 
 * @param type 
 */
export function compressImages(data:any, inputPath:string, outputPath:string, type:number = 0) {
    if (!data) {
        return false;
    }
    let leng:number = data.length;
    if (leng <= 0) {
        return false;
    }

    let config:any = common.getConfig();
    if (!inputPath) {
        inputPath =  config['imagePath'];
    }

    if (!outputPath) {
        outputPath = config['outputPath'];
    }

    for(let i in data) {
        let info = data[i];
        let source = tinify.fromFile(inputPath + info);
        source.toFile(outputPath + info);
    }
    
}

/**
 * 图片裁剪
 * 
 */
export function  resizedImages() {

}





