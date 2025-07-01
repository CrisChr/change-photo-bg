import { useState } from 'react'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import PreviewSection from './components/PreviewSection'
import Footer from './components/Footer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Analytics } from '@vercel/analytics/react';

function App() {
  const _langStored = window.localStorage.getItem('lang');
  const [currentLang, setCurrentLnag] = useState(_langStored);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const genAI = new GoogleGenerativeAI(import.meta.env.APP_GEMINI_API_KEY);

  // 照片尺寸配置
  const photoSizes = {
    1: { width: 295, height: 413 }, // 1寸照
    2: { width: 413, height: 626 }  // 2寸照
  }

  // Google登录成功处理
  const handleSignIn = (profile) => {
    setIsLoggedIn(true)
    setUserProfile(profile)
  }

  // 退出登录
  const handleSignOut = () => {
    setIsLoggedIn(false)
    setUserProfile(null)
    // 清空图片状态
    setCurrentImage(null)
    setProcessedImage(null)
    setSelectedColor(null)
  }

  // 文件上传处理
  const handleFileUpload = (imageDataUrl) => {
    setCurrentImage(imageDataUrl)
    setProcessedImage(null)
    setSelectedColor(null)
  }

  // 颜色选择处理
  const handleColorSelect = (color) => {
    setSelectedColor(color)
  }

  // 生成新背景处理
  const handleGenerate = async () => {
    if (!currentImage || !selectedColor) return

    try {
      setIsProcessing(true)

      // 调用API生成新图片
      const response = await callGeminiAPI(currentImage, selectedColor)
      setProcessedImage(response)
    } catch (error) {
      console.error('图片处理错误:', error)
      alert(t('图片处理失败，请重试！'))
    } finally {
      setIsProcessing(false)
    }
  }

  // 调用Gemini API
  const callGeminiAPI = async (imageData, backgroundColor) => {
    try {
      // 将base64图片数据转换为Blob
      const base64Data = imageData.split(',')[1]

      const contents = [
        { text: `将这张照片的背景改为${backgroundColor === 'red' ? '红色' : '蓝色'}，保持人物主体不变，确保背景颜色均匀。` },
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data
          }
        }
      ];

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ['Text', 'Image']
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
          console.log('收到图片数据');
          return `data:${part.inlineData.mimeType};base64,${imageData}`;
        }
      }

      // 如果没有找到图片数据，抛出错误
      throw new Error('API响应中没有找到图片数据');
    } catch (error) {
      console.error('Gemini API调用错误:', error)
      throw error
    }
  }

  // 处理图片下载
  const handleDownload = (size) => {
    if (!processedImage) return

    const dimensions = photoSizes[size]
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 设置画布尺寸
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // 创建图片对象
    const img = new Image()
    img.onload = () => {
      // 绘制图片
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height)

      // 创建下载链接
      const link = document.createElement('a')
      link.download = `证件照_${dimensions.width}x${dimensions.height}.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.9)
      link.click()
    }
    img.src = processedImage
  }

  const handleChangeLang = (e) => {
    const lang = e.target.value;
    setCurrentLnag(lang)
    window.localStorage.setItem('lang', lang)
    window.location.reload()
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 pb-24">
        <Header
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />

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
        <Footer onLangChange={handleChangeLang} currentLang={currentLang}/>
      </div>
      <Analytics />
    </div>
  )
}

export default App
