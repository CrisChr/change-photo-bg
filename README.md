# 证件照背景更换工具

这是一个基于React + Vite + Tailwind CSS的单页应用，可以帮助用户更改证件照的背景颜色。用户可以选择将照片背景更改为红色或蓝色，并下载1寸或2寸规格的照片。

## 功能特点

- 支持上传本地照片
- 支持拖拽上传
- 使用Google Gemini API进行背景更换
- 支持红色和蓝色背景选择
- 提供1寸（295px × 413px）和2寸（413px × 626px）两种规格下载
- 响应式设计，支持各种设备
- Google账号登录

## 技术栈

- React 18
- Vite
- Tailwind CSS
- Google Auth API
- Google Gemini API (申请地址：https://aistudio.google.com/apikey)

## 开发环境设置

```bash
# 克隆项目
git clone <repository-url>
cd photo-background-changer

# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 在项目根目录下创建 .env 或者 .env.development 文件，设置环境变量 APP_GEMINI_API_KEY，将XXX替换成自己申请的key

APP_GEMINI_API_KEY=XXX
```



## 生产环境构建

```bash
# 构建项目
bun run build

# 预览构建结果
bun run preview
```

## 使用说明

1. 打开网页后，使用Google账号登录
2. 点击"选择照片"按钮上传您的照片，或直接拖拽照片到上传区域
3. 选择想要的背景颜色（红色或蓝色）
4. 点击"生成新背景"按钮
5. 等待处理完成后，选择需要的照片尺寸进行下载
