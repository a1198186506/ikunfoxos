//使用递归的方式实现数组、对象的深拷贝
export default function deepCopy(obj) {
  if (typeof obj !== "object" || obj === null) return; //obj类型不为对象或为空
  let newObj = obj instanceof Array ? [] : {}; //obj类型为数组还是对象
  for (let key in obj) {
    //遍历对象的所有键名
    if (typeof obj[key] === "object" && obj[key] !== null) {
      //obj[key]是对象且不为空
      //创建一个新的对象
      newObj[key] = deepCopy(obj[key]); //递归 创建的新对象赋给newObj[key]
    } else {
      newObj[key] = obj[key]; //将键值赋给newObj
    }
  }
  return newObj;
}
