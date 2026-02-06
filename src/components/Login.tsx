import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, UserPlus, User } from 'lucide-react';
import { toast } from "sonner";
import { createClient } from './api';

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerLastname, setRegisterLastname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const { login, user } = useAuth(); // Destructure user from useAuth
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUser = await login(loginEmail, loginPassword);
    if (loggedInUser) {
      toast.success('¡Inicio de sesión exitoso!');
      if (loggedInUser.isAdmin) { // Check the isAdmin flag from the user object returned by login
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      toast.error('Email o contraseña incorrectos');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient({
        name: registerName,
        lastname: registerLastname,
        email: registerEmail,
        password: registerPassword,
      });
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setIsRegistering(false);
    } catch (error) {
      toast.error('Error en el registro. Inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
              <button
                onClick={() => setIsRegistering(false)}
                className={`auth-tab ${!isRegistering ? 'is-active' : ''}`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`auth-tab ${isRegistering ? 'is-active' : ''}`}
              >
                Registrarse
              </button>
          </div>

          {isRegistering ? (
            // Registration Form
            <div>
              <div className="auth-header">
                <div className="auth-icon">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h1>Crear cuenta</h1>
                <p>Registrate para acceder a ofertas y seguimiento de pedidos.</p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="auth-row">
                  <div>
                    <label>Nombre</label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Nombre"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label>Apellido</label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input
                        type="text"
                        value={registerLastname}
                        onChange={(e) => setRegisterLastname(e.target.value)}
                        placeholder="Apellido"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label>Email</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Contraseña</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary">
                  <UserPlus size={18} />
                  Registrarse
                </button>
              </form>
            </div>
          ) : (
            // Login Form
            <div>
              <div className="auth-header">
                <div className="auth-icon">
                  <Lock className="w-7 h-7" />
                </div>
                <h1>Iniciar sesión</h1>
                <p>Accedé a tu cuenta para gestionar tus compras.</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div>
                  <label>Email</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Contraseña</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary">
                  <LogIn size={18} />
                  Iniciar Sesión
                </button>
              </form>
            </div>
          )}
      </div>
    </div>
  );
}
