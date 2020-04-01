import * as fs from "fs";
import * as path from "path";



/**
 * 判断目录/文件是否存在
 * @param filePath 
 */
export function isExistsSync(filePath:string) {
    let flag:boolean = fs.existsSync(filePath);
    return flag;
} 

/**
 * 获取文件扩展名
 * @param filePath 
 */
export function getFileExtName(filePath:string) {
    let extName = path.extname(filePath);
    return extName;
}


/**
 * 读取配置
 * @param filePath 文件地址
 */
export function readConfig(filePath:string) {
    try {
        let buffer = fs.readFileSync(filePath).toString();
        let cfg = JSON.parse(buffer);
        return cfg;
    } catch (error) {
        console.error(`read ${filePath} error ==> ${error}`);
    }
    return null;
} 

/**
 * 获取tinyPng key
 */
export function getTinyConf() {
    let tinyPath:string = path.resolve('.', '../withtinyPng/config/tinifyKey.json');
    let keyList:any = readConfig(tinyPath);
    return keyList;
}

/**
 *  获取公共配置
 */
export function getConfig() {
    let cfgPath:string = path.resolve('.', '../withtinyPng/config/config.json');
    let cfgList:any = readConfig(cfgPath);
    return cfgList;
}

/**
 * 获取指定目录下文件列表
 * @param dirpath 
 * @param type
 */
export function getOneDirList(dirpath:string = '', type:number = 0) {
    let list:any = [];
    if (dirpath) {
        list = fs.readdirSync(dirpath);
    }else {
        let config = getConfig();
        dirpath = config['dirPath']['imagePath'];
        list = fs.readdirSync(dirpath);
    }
    if (list.length <= 0) {
        return list;
    }
    if (type == 1) {
        for (let i in list) {
            list[i] = dirpath + list[i];
        }
    }
    return list;
}

/**
 * 字符串写入文件
 * @param string 
 * @param putPath 
 * @param expire 
 * @param extname 
 */
export function writeStringToFile(string: string ,putPath: string, expire: string = '', extname: string = 'csv') {
    let fileName:string = putPath + expire +'.csv';
    let writeData:string = string + '\r\n';
    try {
        fs.appendFileSync(fileName, writeData);
    }catch (error) {
        console.error(error);
    }
}

/**
 * 一维数组写入文件
 * @param data 
 * @param putPath 
 * @param expire 
 * @param extname 
 */
export function writeOneArrayToFile(data: any ,putPath: string, expire: string = '', extname: string = 'csv') {
    let  fileName:string = putPath + expire +'.csv';
    if (!Array.isArray(data) || data.length <= 0) {
        console.log('数据应为数组！');
        return;
    }
    let writeData:string = '';
    writeData = data.join(",");
    writeData = writeData + '\r\n';
    try {
        fs.appendFileSync(fileName, writeData);
    }catch (error) {
        console.error(error);
    }
    
}

/**
 * 多维数组写入文件
 * @param data 
 * @param putPath 
 * @param expire 
 * @param extname 
 */
export function writeMultiArrayTOFile(data: any, putPath: string, expire: string = '', extname: string = 'csv') {
    let  fileName:string = putPath + expire + '.csv';
    if (!Array.isArray(data) || data.length <= 0) {
        console.log('数据应为数组！');
        return;
    }
    let writeData:string = '';
    for (let i in data) {
        writeData = writeData + data[i].join(",") + '\r\n';
    }
    try {
        fs.appendFileSync(fileName, writeData);
    }catch (error) {
        console.error(error);
    }
}

/**
 * 获取csv数据
 * @param filepath 
 */
export function getCsvData(filepath) {
    let data:any = [];
    let flag:boolean =  isExistsSync(filepath);
    if (!flag) {
        return data;
    }
    let list:string = fs.readFileSync(filepath, 'utf8');
    let rows:any = list.split("\r\n");
    for (let i in rows) {
        if (rows[i]) {
            let info = rows[i].replace(/\"/g, "").replace(/[\\]/g,"").split(",");
            data.push(info);
        }
    }
    return data;
}


/**
 * 获取年月日
 * @param date 默认当前时间
 * @param type 默认格式 0 Y-m-d、1 Y-m、2 m-d
 * @param format 默认格式 Ymd、- Y-m-d、/ Y/m/d 
 */
export function getCurrentDateString( date : Date = new Date(), type : number = 0, format : string = '') : string  {
    let year =  date.getFullYear().toString();
    let month = (date.getMonth()+1).toString().padStart(2,'0');
    let day = date.getDate().toString().padStart(2,'0');
    let result:string = '';
    switch (type){
        case 0:
            result = `${year}${format}${month}${format}${day}`;
            break;
        case 1:
            result = `${year}${format}${month}`;
            break;
        case 2:
            result = `${month}${format}${day}`;
            break;
        default:
            result = `${year}${format}${month}${format}${day}`;
            break;
    }

    return result;
}

/**
 *  获取当前时间戳 毫秒级
 */
export function getCurrentTimeMilliseconds():number {
    return new Date().getTime();
}


/**
 * 获取当前时间戳 秒级
 */
export function getNowTimestamp() {
    return Math.ceil(new Date().getTime() / 1000);
}


