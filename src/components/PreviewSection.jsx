import PropTypes from 'prop-types'

const PreviewSection = ({
  originalImage,
  processedImage,
  selectedColor,
  isProcessing,
  onColorSelect,
  onGenerate,
  onDownload
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-3">原图预览</h3>
          <div className="bg-gray-100 p-2 rounded-lg">
            <img
              src={originalImage}
              alt="原图预览"
              className="max-h-[300px] mx-auto"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-3">处理后预览</h3>
          <div className="bg-gray-100 p-2 rounded-lg min-h-[200px] flex items-center justify-center">
            {processedImage ? (
              <img
                src={processedImage}
                alt="处理后预览"
                className="max-h-[300px] mx-auto"
              />
            ) : (
              <p className="text-gray-500">请选择背景颜色并生成</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="w-full">
          <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">选择背景颜色</h3>
          <div className="flex gap-3 justify-center">
            <button
              className={`
                flex-1 px-4 py-2 rounded transition-colors max-w-xs
                ${selectedColor === 'red'
                  ? 'bg-red-600 text-white ring-2 ring-offset-2 ring-red-600'
                  : 'bg-red-500 text-white hover:bg-red-600'}
              `}
              onClick={() => onColorSelect('red')}
            >
              红色背景
            </button>
            <button
              className={`
                flex-1 px-4 py-2 rounded transition-colors max-w-xs
                ${selectedColor === 'blue'
                  ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}
              `}
              onClick={() => onColorSelect('blue')}
            >
              蓝色背景
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              className={`
                w-full px-6 py-3 rounded font-medium transition-colors max-w-xs mx-auto block
                ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : selectedColor
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              onClick={onGenerate}
              disabled={!selectedColor || isProcessing}
            >
              {isProcessing ? '处理中...' : '生成新背景'}
            </button>
          </div>
        </div>

        {processedImage && (
          <div className="w-full">
            <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">选择照片尺寸下载</h3>
            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                onClick={() => onDownload('1')}
              >
                1寸照 (295×413px)
              </button>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                onClick={() => onDownload('2')}
              >
                2寸照 (413×626px)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

PreviewSection.propTypes = {
  originalImage: PropTypes.string.isRequired,
  processedImage: PropTypes.string,
  selectedColor: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}

export default PreviewSection 