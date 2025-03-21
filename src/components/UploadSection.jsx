import { useRef, useState } from 'react'
import PropTypes from 'prop-types'

const UploadSection = ({ isLoggedIn, onFileUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // 处理上传按钮点击
  const handleUploadClick = () => {
    if (!isLoggedIn) {
      alert('请先登录后再使用此功能！')
      return
    }
    fileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件！')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('图片大小不能超过10MB！')
      return
    }

    try {
      const imageDataUrl = await readFileAsDataURL(file)
      onFileUpload(imageDataUrl)
    } catch (error) {
      console.error('文件处理错误:', error)
      alert('文件处理失败，请重试！')
    }
  }

  // 将文件读取为Data URL
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 处理拖拽事件
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (!isLoggedIn) {
      alert('请先登录后再使用此功能！')
      return
    }

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        alert('图片大小不能超过10MB！')
        return
      }

      try {
        const imageDataUrl = await readFileAsDataURL(file)
        onFileUpload(imageDataUrl)
      } catch (error) {
        console.error('文件处理错误:', error)
        alert('文件处理失败，请重试！')
      }
    }
  }

  return (
    <div className="w-full mb-8">
      <div
        className={`
          w-full border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-10 text-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${!isLoggedIn || isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>

          <p className="text-gray-600">点击或拖拽照片到这里</p>
          <p className="text-gray-500 text-xs">支持jpg、png等格式，大小不超过10MB</p>

          <button
            className={`
              px-4 py-2 rounded transition-colors
              ${isProcessing 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'}
            `}
            disabled={!isLoggedIn || isProcessing}
          >
            {isProcessing ? '处理中...' : '选择照片'}
          </button>
        </div>
      </div>

      {!isLoggedIn && (
        <p className="text-center text-amber-600 mt-3 w-full">请先登录后再使用上传功能</p>
      )}
    </div>
  )
}

UploadSection.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired
}

export default UploadSection 