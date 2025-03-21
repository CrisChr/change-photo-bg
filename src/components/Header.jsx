import { useEffect } from 'react'
import { loadGapiInsideDOM } from 'gapi-script';
import PropTypes from 'prop-types'
import GoogleIcon from '../assets/google.svg?react'

const Header = ({ isLoggedIn, userProfile, onSignIn, onSignOut }) => {
  // 初始化Google登录
  useEffect(() => {
    // 加载Google平台API
    const loadGoogleAPI = async () => {
      await loadGapiInsideDOM();
      initGoogleAuth();
    }

    // 初始化Google认证
    const initGoogleAuth = () => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            client_id: '1010964728504-ciuheuoq0p2aqvjrqfrg4k1kc30s4cpu.apps.googleusercontent.com',
            scope: 'profile email',
            cookie_policy: 'single_host_origin'
          })

          // 检查是否已登录
          const auth2 = window.gapi.auth2.getAuthInstance()
          if (auth2.isSignedIn.get()) {
            const googleUser = auth2.currentUser.get()
            handleAuthSuccess(googleUser)
          }

          // 添加登录状态变化监听
          auth2.isSignedIn.listen((isSignedIn) => {
            if (isSignedIn) {
              const googleUser = auth2.currentUser.get()
              handleAuthSuccess(googleUser)
            }
          })
        } catch (error) {
          console.error('Google API初始化失败:', error)
        }
      })
    }

    loadGoogleAPI()
  }, [])

  // 处理登录成功
  const handleAuthSuccess = (googleUser) => {
    const profile = googleUser.getBasicProfile()
    onSignIn({
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    })
  }

  // 处理登录点击
  const handleLoginClick = () => {
    if (window.gapi && window.gapi.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signIn().catch(error => {
        console.error('登录失败:', error)
        alert('登录失败，请重试！')
      })
    } else {
      console.error('Google API未加载')
      alert('登录服务未加载，请刷新页面重试！')
    }
  }

  // 处理登出点击
  const handleLogoutClick = () => {
    if (window.gapi && window.gapi.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signOut().then(() => {
        onSignOut()
      })
    }
  }

  return (
    <header className="w-full text-center mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">证件照背景更换工具</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-4">上传您的照片，轻松更换背景颜色</p>

      <div className="flex justify-center items-center mt-4">
        {!isLoggedIn ? (
          <button
            onClick={handleLoginClick}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <GoogleIcon width="20" height="20" />
            使用 Google 账号登录
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-gray-100 p-2 rounded">
            {userProfile?.imageUrl && (
              <img
                src={userProfile.imageUrl}
                alt="用户头像"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">{userProfile?.name}</span>
            <button
              onClick={handleLogoutClick}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    imageUrl: PropTypes.string
  }),
  onSignIn: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
}

export default Header