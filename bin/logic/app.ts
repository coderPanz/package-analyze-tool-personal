import express from 'express'; // 导入 express 模块
import cors from 'cors'; // 导入 cors 中间件
import bodyParser from 'body-parser';
import npmRouter from './router/index';

const app = express(); // 创建应用实例

// 注册全局中间件, 允许跨域请求
app.use(cors());

// 配置解析中间件必须在注册路由之前
// 1. 用于解析 HTTP 请求中的表单数据
app.use(express.urlencoded({ extended: false }));
// 2. 用于解析 HTTP 请求中的 JSON 格式的数据
app.use(bodyParser.json());

// 注册路由
app.use('/api', npmRouter);

// 配置错误级别中间件: 必须注册在所有路由之后
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('服务器发生了错误: ' + err.message); // 服务端提示
  res.send('服务器发生了错误: ' + err.message); // 客户端提示
});

// 监听端口
app.listen(9200, () => {
  console.log('服务启动成功');
});
