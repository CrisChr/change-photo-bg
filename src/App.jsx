import { useState, useEffect } from "react"; // 引入 useEffect
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import PreviewSection from "./components/PreviewSection";
import Footer from "./components/Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Analytics } from "@vercel/analytics/react";

function App() {
	const _langStored = window.localStorage.getItem("lang");
	const [currentLang, setCurrentLnag] = useState(_langStored);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentImage, setCurrentImage] = useState(null);
	const [processedImage, setProcessedImage] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	// 新增：用于存储用户输入的API Key
	const [userApiKey, setUserApiKey] = useState("");

	// 新增：在组件加载时从localStorage读取API Key
	useEffect(() => {
		const storedApiKey = window.localStorage.getItem("userGeminiApiKey");
		if (storedApiKey) {
			setUserApiKey(storedApiKey);
		}
	}, []);

	// 修改：不再在组件顶层初始化genAI
	// const genAI = new GoogleGenerativeAI(import.meta.env.APP_GEMINI_API_KEY);

	// 照片尺寸配置
	const photoSizes = {
		1: { width: 295, height: 413 }, // 1寸照
		2: { width: 413, height: 626 }, // 2寸照
	};

	// Google登录成功处理
	const handleSignIn = (profile) => {
		setIsLoggedIn(true);
		setUserProfile(profile);
	};

	// 退出登录
	const handleSignOut = () => {
		setIsLoggedIn(false);
		setUserProfile(null);
		// 清空图片状态
		setCurrentImage(null);
		setProcessedImage(null);
		setSelectedColor(null);
	};

	// 文件上传处理
	const handleFileUpload = (imageDataUrl) => {
		setCurrentImage(imageDataUrl);
		setProcessedImage(null);
		setSelectedColor(null);
	};

	// 颜色选择处理
	const handleColorSelect = (color) => {
		setSelectedColor(color);
	};

	// 新增：处理用户API Key输入变化的函数
	const handleApiKeyChange = (e) => {
		setUserApiKey(e.target.value);
	};

	// 新增：保存用户API Key到localStorage
	const handleSaveApiKey = () => {
		window.localStorage.setItem("userGeminiApiKey", userApiKey);
		alert("API Key已保存！"); // 提示用户保存成功
	};

	// 生成新背景处理
	const handleGenerate = async () => {
		// 修改：增加API Key检查
		if (!currentImage || !selectedColor) return;
		if (!userApiKey && !import.meta.env.APP_GEMINI_API_KEY) {
			alert("请输入您的Gemini API Key！");
			return;
		}

		try {
			setIsProcessing(true);

			// 调用API生成新图片
			const response = await callGeminiAPI(currentImage, selectedColor);
			setProcessedImage(response);
		} catch (error) {
			console.error("图片处理错误:", error);
			alert(t("图片处理失败，请重试！"));
		} finally {
			setIsProcessing(false);
		}
	};

	// 调用Gemini API
	const callGeminiAPI = async (imageData, backgroundColor) => {
		try {
			// 修改：在这里动态初始化Gemini API
			// 优先使用用户输入的Key，如果为空，则使用环境变量中的Key
			const apiKey = userApiKey || import.meta.env.APP_GEMINI_API_KEY;
			const genAI = new GoogleGenerativeAI(apiKey);

			// 将base64图片数据转换为Blob
			const base64Data = imageData.split(",")[1];

			const contents = [
				{
					text: `将这张照片的背景改为${backgroundColor === "red" ? "红色" : "蓝色"}，保持人物主体不变，确保背景颜色均匀。`,
				},
				{
					inlineData: {
						mimeType: "image/png",
						data: base64Data,
					},
				},
			];

			const model = genAI.getGenerativeModel({
				model: "gemini-2.0-flash-exp-image-generation",
				generationConfig: {
					responseModalities: ["Text", "Image"],
				},
			});

			// 调用Gemini API
			const response = await model.generateContent(contents);
			for (const part of response.response.candidates[0].content.parts) {
				// Based on the part type, either show the text or save the image
				if (part.text) {
					console.log(part.text);
				} else if (part.inlineData) {
					const imageData = part.inlineData.data;
					// 直接使用base64数据，而不是尝试写入文件系统
					console.log("收到图片数据");
					return `data:${part.inlineData.mimeType};base64,${imageData}`;
				}
			}

			// 如果没有找到图片数据，抛出错误
			throw new Error("API响应中没有找到图片数据");
		} catch (error) {
			console.error("Gemini API调用错误:", error);
			throw error;
		}
	};

	// 处理图片下载
	const handleDownload = (size) => {
		if (!processedImage) return;

		const dimensions = photoSizes[size];
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		// 设置画布尺寸
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

		// 创建图片对象
		const img = new Image();
		img.onload = () => {
			// 绘制图片
			ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

			// 创建下载链接
			const link = document.createElement("a");
			link.download = `证件照_${dimensions.width}x${dimensions.height}.jpg`;
			link.href = canvas.toDataURL("image/jpeg", 0.9);
			link.click();
		};
		img.src = processedImage;
	};

	const handleChangeLang = (e) => {
		const lang = e.target.value;
		setCurrentLnag(lang);
		window.localStorage.setItem("lang", lang);
		window.location.reload();
	};

	return (
		<div className="min-h-screen w-full bg-gray-50">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 pb-24">
				<Header
					isLoggedIn={isLoggedIn}
					userProfile={userProfile}
					onSignIn={handleSignIn}
					onSignOut={handleSignOut}
				/>

				{/* 新增：API Key输入区域 */}
				<div className="my-6 p-4 bg-white rounded-lg shadow">
					<label
						htmlFor="apiKey"
						className="block text-sm font-medium text-gray-700"
					>
						{t("请输入您的Gemini API Key：")}
					</label>
					<div className="mt-1 flex rounded-md shadow-sm">
						<input
							type="password" // 使用password类型隐藏Key
							name="apiKey"
							id="apiKey"
							className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 px-3 py-2"
							placeholder="请输入您的Gemini API Key"
							value={userApiKey}
							onChange={handleApiKeyChange}
						/>
						<button
							onClick={handleSaveApiKey}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{t("保存")}
						</button>
					</div>
					<p className="mt-2 text-sm text-gray-500">
						{t("您的API Key将仅保存在您的浏览器中，不会上传至服务器。")}
					</p>
				</div>

				<main className="my-8 w-full">
					<UploadSection
						isLoggedIn={isLoggedIn}
						onFileUpload={handleFileUpload}
						isProcessing={isProcessing}
					/>

					{currentImage && (
						<PreviewSection
							originalImage={currentImage}
							processedImage={processedImage}
							selectedColor={selectedColor}
							isProcessing={isProcessing}
							onColorSelect={handleColorSelect}
							onGenerate={handleGenerate}
							onDownload={handleDownload}
						/>
					)}
				</main>
				<Footer onLangChange={handleChangeLang} currentLang={currentLang} />
			</div>
			<Analytics />
		</div>
	);
}

export default App;
