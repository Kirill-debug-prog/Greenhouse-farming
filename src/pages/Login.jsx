import '../style/Login.css'
import img from '../assets/background-img.png'
import icon from '../assets/opened_eye.svg'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (err) {
    console.error('Ошибка разбора токена:', err)
    return null
  }
}

export default function Login({ onLoginSuccess }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()

  const handleLoginChange = async (e) => {
    e.preventDefault()

    if (!login || !password) {
      setErrorMessage('Пожалуйста, введите логин и пароль.')
      return
    }

    try {
      const response = await fetch('http://localhost:5180/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка авторизации')
      }

      // Можно сохранять в cookie или localStorage, здесь пример localStorage
      localStorage.setItem('token', data.token)
      if (data.expires) {
        localStorage.setItem('tokenExpires', data.expires)
      }

      const payload = parseJwt(data.token)
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

      // Сохраняем роль для App
      localStorage.setItem('userRole', role)

      // Передаём успех наверх, чтобы обновить состояние в App
      if (onLoginSuccess) {
        onLoginSuccess(role)
      }

      // Навигация по роли
      if (role === 'Главный агроном') {
        navigate('/agronom-home')
      } else if (role === 'Технолог') {
        navigate('/technologist-home')
      } else {
        navigate('/')
      }
      console.log(role)
    } catch (error) {
      setErrorMessage(error.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.')
    }
  }

  return (
    <div className="conten-login" style={{ backgroundImage: `url(${img})` }}>
      <div className="form-container">
        <div className="form-wrapper">
          <h1 className="form-title">Вход</h1>
          <form className="form" onSubmit={handleLoginChange}>
            <div className="field">
              <label className="visually-hidden" htmlFor="login">Email</label>
              <input
                className="form-input"
                id="login"
                placeholder="Email"
                type="text"
                name="login"
                required
                minLength="3"
                maxLength="50"
                pattern="^(((8|\+7|7)[\- ]?9\d{2}[\- ]?\d{3}[\- ]?\d{2}[\- ]?\d{2}[ ]?)|([a-zA-Z0-9_.\-]+@[a-zA-Z0-9_.\-]+))$"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <span className="field-errors" data-js-form-field-errors></span>
            </div>

            <div className="password-wrapper field">
              <label className="visually-hidden" htmlFor="password">Пароль</label>
              <input
                className="form-input"
                id="password"
                placeholder="Пароль"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength="8"
                maxLength="100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={icon}
                alt="Показать пароль"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <span className="field-errors" data-js-form-field-errors></span>
            </div>

            {errorMessage && (
              <div className="form-errors">{errorMessage}</div>
            )}

            <div className='bottom'>
              <button className="button-login" type="submit">
                Войти
              </button>
              <div className='checkbox-from no-select'>
                <input
                  id='check'
                  className='checkbox'
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className='checkbox-name' htmlFor='check'>Запомнить меня</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
