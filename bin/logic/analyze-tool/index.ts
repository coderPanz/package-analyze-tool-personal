#!/usr/bin/env node
import { Command } from "commander";
const program = new Command();

import * as fs from "fs";
import * as path from "path";

// 从child_process模块中导入exec方法, 利用exec方法执行特定的Shell命令来打开网页
import { exec } from "child_process";

async function analyzeDependence() {
  console.log('first')
  // 1. 当前目录下的 package.json 文件路径
  const packageJsonPath = path.resolve(__dirname, "../../../", "package.json");
  // 2. 获取当前目录的 node_modules文件
  const nodeModulesPath = path.resolve(__dirname, "../../../", "node_modules");

  // 读取package.json文件
  /**
   * @param packageJsonPath npm-package路径
   * @returns 返回package的所需依赖组成的数组, 依赖对象dependencies, 整个package包
   */
  function readPackageJson(packageJsonPath: string) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJsonData = JSON.parse(packageJsonContent);
    // 若生产依赖存在才继续遍历查找, 否则return
    if (packageJsonData.dependencies) {
      // 获取package.json文件中的生产依赖对象并保存到对应新数组中
      let dependenciesArr: string[] = [];
      const dependenciesObj = packageJsonData.dependencies;
      for (const key in dependenciesObj) {
        dependenciesArr.push(key);
      }
      return { dependenciesArr, dependenciesObj, packageJsonData };
    } else {
      const dependenciesArr: string[] = [];
      const dependenciesObj: any = null;
      return { dependenciesArr, dependenciesObj, packageJsonData };
    }
  }

  // 深度优先搜索: 读取 node_modules文件夹并进行相关操作
  /**
   * @param nodeModulesPath node_modules路径
   * @param packageJsonPath npm-package路径
   * @param depth package的深度
   * @param dependenceNodesArr echarts所需的nodes数据
   * @param dependenceEdgesArr echarts所需的edges数据
   * @returns 返回echarts所需的数据
   */
  function readNodeModules(nodeModulesPath: string, packageJsonPath: string, depth: number, dependenceNodesArr: any[], dependenceEdgesArr: any[]): any {
    const { 
      dependenciesArr, 
      dependenciesObj,
      packageJsonData
    } = readPackageJson(packageJsonPath);
    if (depth > 10) {
      return; // 添加一个终止条件，当深度大于10时停止递归调用
    }
    dependenciesArr.forEach(item => {
      // nodes
      const dependenceNodes = {
        name: item,
        value: dependenciesObj[item],
        id: item,
        size: 12,
        depth: depth,
        color: generateRandomHexColor()
      }
      // edges
      const dependenceEdges = {
        sourceID: packageJsonData.name,
        targetID: item
      }
      dependenceNodesArr.push(dependenceNodes)
      dependenceEdgesArr.push(dependenceEdges)

      // 构建package.json的路径
      const newPackageJsonPath = path.join(nodeModulesPath, item, "package.json");
      // 读取新的package.json文件
      readNodeModules(nodeModulesPath, newPackageJsonPath, depth + 1, dependenceNodesArr, dependenceEdgesArr);
    })
    return { dependenceNodesArr, dependenceEdgesArr }
  }

  // 随机生成十六进制的颜色代码
  function generateRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // 开始分析依赖
  const { dependenceNodesArr, dependenceEdgesArr } = readNodeModules(nodeModulesPath, packageJsonPath, 1, [], []);
  // 数组去重
  const removeDuplicates = (arr: any) => {
    return arr.reduce((acc: any, obj: any) => {
      if (!acc.some((item: any) => item.name === obj.name)) {
        acc.push(obj);
      }
      return acc;
    }, []);
  };
  const newDependenceNodesArr = removeDuplicates(dependenceNodesArr)

  // 异步保存依赖
  //  JSON.stringify方法用于将JavaScript对象转换为JSON字符串。null作为第二个参数表示不包含换行符，2表示缩进为2个空格。
  const jsonNodes = JSON.stringify(newDependenceNodesArr, null, 2);
  const jsonEdges = JSON.stringify(dependenceEdgesArr, null, 2)
  const nodesPath = path.resolve(__dirname, '../data/', 'nodes.json')
  const edgesPath = path.resolve(__dirname, '../data/', 'edges.json')

  function writeFileAsync(filePath: string, data: string) {
    // 创建一个Promise对象
    return new Promise((resolve, reject) => {
    // 使用fs模块的writeFile方法将文件写入指定路径
    fs.writeFile(filePath, data, (err) => {
    // 如果出现错误，则拒绝Promise对象
    if (err) {
      reject(err);
    } else {
      // 否则，将Promise对象的resolve方法调用
      resolve('文件写入成功!');
    }
    });
    });
  }
  const nodesPromise = await writeFileAsync(nodesPath, jsonNodes)
  const edgesPromise = await writeFileAsync(edgesPath, jsonEdges)

  return { nodesPromise, edgesPromise }
}
export default analyzeDependence

