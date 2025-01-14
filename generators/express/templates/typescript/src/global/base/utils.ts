/**
 * @file 辅助函数
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { createHash, randomBytes } from "crypto";
import { exists, readFile, writeFile } from "fs";
import { format, parse } from "url";
import { promisify } from "util";

const NUMBER = "0123456789";
const NUMBERL = NUMBER.length;
const CHARTS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CHARTSL = CHARTS.length;

/**
 * leftPad
 */
export function leftPad(n: any, c: number) {
  let res = String(n);
  while (res.length < c) {
    res = "0" + res;
  }
  return res;
}

/**
 * MD5
 */
export function md5(str: string) {
  return createHash("md5")
    .update(str)
    .digest("hex");
}

/**
 * 获取客户端IP
 *
 * @param {Object} req 请求
 * @returns {String} ip
 */
export function getClientIP(req: any) {
  const ip = req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.ip;
  return ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
}

/**
 * 转换 Unix 时间戳到 MySQL
 * @param {Number} unixtime Unix 时间戳
 * @return {String}
 */
export function unixTime(unixtime: number) {
  const u = new Date(unixtime);
  return (
    u.getUTCFullYear() +
    "-" +
    leftPad(u.getUTCMonth() + 1, 2) +
    "-" +
    leftPad(u.getUTCDate(), 2) +
    " " +
    leftPad(u.getUTCHours(), 2) +
    ":" +
    leftPad(u.getUTCMinutes(), 2) +
    ":" +
    leftPad(u.getUTCSeconds() + 1, 2) +
    "." +
    leftPad((u.getUTCMilliseconds() / 1000).toFixed(3), 3)
  );
}

/**
 * 时间字符串（20180427）
 * @param {Date} date 时间
 * @return {String}
 */
export function dateString(date = new Date()) {
  return getDateString("", date);
}

/**
 * 获取中文字符串（2018年04月27日 16:42）
 */
export function dateTimeChinese(date = new Date()) {
  return (
    date.getFullYear() +
    "年" +
    leftPad(date.getMonth() + 1, 2) +
    "月" +
    leftPad(date.getDate(), 2) +
    "日 " +
    leftPad(date.getHours(), 2) +
    ":" +
    leftPad(date.getMinutes(), 2)
  );
}

/**
 * 生成随机数
 * @param {Number} num 数量
 */
export function randomString(num: number) {
  return randomBytes(num)
    .toString("hex")
    .substr(0, num);
}

/**
 * 返回随机字符串
 */
export function createNonceStr(length: number) {
  const str = [];
  for (let i = 0; i < length; i++) {
    str.push(CHARTS.charAt(Math.floor(Math.random() * CHARTSL)));
  }
  return str.join("");
}

/**
 * 返回随机数字
 */
export function createNonceNum(length: number) {
  const str = [];
  for (let i = 0; i < length; i++) {
    str.push(NUMBER.charAt(Math.floor(Math.random() * NUMBERL)));
  }
  return str.join("");
}

/**
 * 获取 timestamp
 *
 * @param {Number} [after=0] 当前时间之后的秒数
 * @returns {Number}
 */
export function genTimestamp(after = 0) {
  const now = new Date();
  return parseInt(String((now.getTime() + after * 1000) / 1000), 10);
}

/**
 * 获取日期字符串
 */
export function getDateString(pad = "", time = new Date()) {
  return `${time.getFullYear()}${pad}${leftPad(time.getMonth() + 1, 2)}${pad}${leftPad(time.getDate(), 2)}`;
}

/**
 * 获取时间字符串
 */
export function getTimeString(pad = "", time = new Date()) {
  return `${time.getHours()}${pad}${leftPad(time.getMinutes(), 2)}${pad}${leftPad(time.getSeconds(), 2)}`;
}

/**
 * 获取日期时间字符串
 */
export function getDateTimeString(pad = "", time = new Date()) {
  return `${getDateString("-", time)} ${getTimeString(":", time)}`;
}

/**
 * 格式化请求中的 Boolean 类型
 *
 * @param {any} query 请求参数
 * @param {Boolean} b 默认值
 * @returns {Boolean}
 */
export function parseQueryBoolean(query: any, b: boolean) {
  const str = String(query);
  if (str === "1" || str === "true" || str === "yes" || str === "on") {
    return true;
  } else if (str === "0" || str === "false" || str === "no" || str === "off") {
    return false;
  }
  return b;
}

/**
 * 删除对象中的 undefined
 */
export function removeUndefined(object: any) {
  Object.keys(object).forEach(key => object[key] === undefined && delete object[key]);
  return object;
}

/**
 * 将对象 object 合并到对象数组 array 元素中
 *
 * @param {Array} array 对象数组
 * @param {Object} object 待合并对象
 * @param {String} k1 array 中对象的key
 * @param {String} k2 对应 object 中的 key
 * @param {String} prefix 合并的前缀
 * @returns {Array}
 */
export function mergeInfo(array: any[], object: Record<string, any>, k1: string, k2: string, prefix: string) {
  array.map(a => {
    if (a[k1] === object[a[k1]][k2]) {
      const obj = object[a[k1]];
      Object.keys(obj).forEach(k => {
        a[prefix + "_" + k] = obj[k];
        if (k === "thumbnail") {
          a[k] = obj[k];
        }
      });
    }
    return a[k1];
  });
  return array;
}

/**
 * 获取 coroutine 中错误堆栈
 * @param {Error} err 错误
 * @param {String} base 默认文件路径
 * @return {Array}
 */
export function getErrorSourceFromCo(err: Error, base = "/src/") {
  const reaseon: string[] = [];
  if (err.stack) {
    for (const line of err.stack.split("\n")) {
      if (line.indexOf(base) !== -1) {
        reaseon.push(line.trim().replace("at ", ""));
      }
    }
  }
  return reaseon;
}

/**
 * 合并URL
 * @param {String} dist 目标URL
 * @param {Object} query 附加 query 对象
 * @param {String} hash hash 参数
 */
export function mergeUrl(dist: string, query: any, hash: string) {
  const distUrl = parse(dist, true);
  delete distUrl.search;
  Object.assign(distUrl.query, query);
  distUrl.hash = hash;
  return format(distUrl);
}

/**
 * 首字母大写
 * @param {String} str 输入字符串
 */
export function firstUpperCase(str: string) {
  return str.replace(/^\S/, s => s.toUpperCase());
}

/**
 * 下划线转驼峰
 * @param {String} str 输入字符串
 */
export function underscore2camelCase(str: string) {
  return str
    .replace(/^[_.\- ]+/, "")
    .toLowerCase()
    .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
}

/**
 * 参数检查
 * @param {Object} data 数据
 * @param {Array} arr 数据key
 */
export function checkParams(data: Record<string, any>, arr: any[]) {
  for (const val of arr) {
    if (data[val] === undefined) {
      return `"${val}" is required`;
    }
  }
  return false;
}

/**
 * 参数提取
 * @param {Record<string, any>} data 数据
 * @param {Array} arr 数据key
 */
export function filterParams(data: Record<string, any>, arr: any[]) {
  const obj: any = {};
  arr.forEach(key => {
    if (data[key] !== undefined) {
      obj[key] = data[key];
    }
  });
  return obj;
}

/**
 * 渲染模版字符串
 *
 * render("{{name}}很厉害，才{{age}}岁", { name: "yourtion", age: "15" })
 *
 * @param {String} template 模版字符串
 * @param {Record<string, any>} context 替换对象
 */
export function render(template: string, context: Record<string, any>) {
  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key]);
}

export const existsAsync = promisify(exists);
export const readFileAsync = promisify(readFile);
export const writeFileAsync = promisify(writeFile);
