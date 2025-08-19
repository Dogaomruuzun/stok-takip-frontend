import { useState, useRef, useEffect } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  
  const loginBoxRef = useRef(null);

  // Model Viewer script'ini yükle
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onLogin) {
      onLogin(formData.username, formData.password);
    } else {
      // Test için
      if (formData.username === "admin" && formData.password === "1234") {
        alert("Giriş başarılı!");
      } else {
        alert("Hatalı kullanıcı adı veya şifre!");
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!loginBoxRef.current) return;
    
    const rect = loginBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    loginBoxRef.current.style.transform = 
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  };

  const handleMouseLeave = () => {
    if (!loginBoxRef.current) return;
    loginBoxRef.current.style.transform = 
      'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  };

  return (
    <div className="login-container">
      {/* Sol taraf - 3D Model */}
      <div className="animated-side">
        {/* Model Viewer Container */}
        <div className="model-container">
          <model-viewer
            src="/ayakkabi.glb"
            alt="3D Shoe Model"
            auto-rotate
            auto-rotate-delay="1000"
            rotation-per-second="30deg"
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
            }}
          ></model-viewer>

          {/* Fallback için loading mesajı */}
          <div className="model-loading">
            <div className="loading-spinner"></div>
            <p>3D Model Yükleniyor...</p>
          </div>
        </div>

        {/* Dalgalanan katmanlar */}
        <div className="wave1"></div>
        <div className="wave2"></div>
        <div className="wave3"></div>
        <div className="wave4"></div>

        {/* ✅ Arka plandaki kocaman yazı */}
        <h1 className="background-text">AIR PRO</h1>
      </div>

      {/* Sağ taraf - Glassmorphism Login Form */}
      <div className="login-form-side">
        <div 
          className="login-box"
          ref={loginBoxRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <h2>Welcome back</h2>
          <p>Please enter your details.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-options">
              <div className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot your password?</a>
            </div>
            
            <button type="submit" className="login-button">
              Log in
            </button>
          </form>
          
          <div className="register-link">
            <span>Don't have an account?</span>
            <a href="#">Register here</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;