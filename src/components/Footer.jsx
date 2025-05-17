const Footer = ({onLangChange, currentLang}) => {

  return (
    <footer className="w-full text-gray-500 py-4 bg-white border-t border-gray-200 fixed bottom-0 left-0">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div>
          <p className="text-sm sm:text-base">{t('注意：请确保上传的照片清晰、光线充足，以获得最佳效果')}</p>
          <p className="text-xs sm:text-sm mt-2">© {new Date().getFullYear()} {t('证件照背景更换工具')}</p>
        </div>
        <div className="flex items-center">
          <label htmlFor="language-select" className="sr-only">{t('选择语言')}</label>
          <select id="language-select" className="text-sm sm:text-base border rounded-md py-1 px-2" value={currentLang} onChange={onLangChange}>
            <option value="zhcn">🇨🇳 {t('简体中文')}</option>
            <option value="ja">🇯🇵 {t('日语')}</option>
            <option value="fr">🇫🇷 {t('法语')}</option>
            <option value="en">🇬🇧 {t('英语')}</option>
          </select>
        </div>
      </div>
    </footer>
  )
}

export default Footer
