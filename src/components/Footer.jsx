const Footer = () => {
  return (
    <footer className="w-full text-center text-gray-500 py-4 bg-white border-t border-gray-200 fixed bottom-0 left-0">
      <p className="text-sm sm:text-base">注意：请确保上传的照片清晰、光线充足，以获得最佳效果</p>
      <p className="text-xs sm:text-sm mt-2">© {new Date().getFullYear()} 证件照背景更换工具</p>
    </footer>
  )
}

export default Footer