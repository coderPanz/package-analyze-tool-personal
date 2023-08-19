import express from "express";
import * as fs from "fs";
import * as path from "path";
import analyzeDependence from "../analyze-tool";
async function npmAnalyzeView(req: express.Request, res: express.Response) {
  try {
    await analyzeDependence()
    // 写入数据完成后读取数据返回给前端
    const nodesPath = path.resolve(__dirname, "../data/nodes.json")
    const edgesPath = path.resolve(__dirname, "../data/edges.json")

    const nodesStringData = fs.readFileSync(nodesPath, 'utf-8')
    const edgesStringData = fs.readFileSync(edgesPath, 'utf-8')

    const nodesJsonData = JSON.parse(nodesStringData)
    const edgesJsonData = JSON.parse(edgesStringData)

    res.status(200).json({
      data: {
        nodes: nodesJsonData,
        edges: edgesJsonData
      }
    })
  } catch (error) {
    res.json({
      msg: "服务器异常!",
      err: error,
    });
  }
}
export default npmAnalyzeView;
