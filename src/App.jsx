import React, { Component } from "react";
import axios from 'axios';
import Header from "./section/header/header";
import FirstWindow from "./section/firstWindow/firstWindow";
import PlatformProducts from "./section/platformProducts/platformProducts";
import Rosmost from "./section/rosmost/rosmost";
import Footer from "./section/footer/footer";
import { Routes, Route, Link } from "react-router-dom";
import "../src/sass/style.scss";
import "../src/sass/base/forms.scss";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegistrationForm: false,
      showLoginForm: false,
      email: "",
      password: "",
      username: "",
      token : ""
    };
  }
  
  toggleRegistrationForm = () => {
    this.setState((prevState) => ({
      showRegistrationForm: !prevState.showRegistrationForm
    }));
    document.body.style.overflow = !this.state.showRegistrationForm ? 'hidden' : '';
    document.body.classList.toggle('modal-open');
  };

  toggleLoginForm = () => {
    this.setState((prevState) => ({
      showLoginForm: !prevState.showLoginForm
    }));
    document.body.style.overflow = !this.state.showLoginForm ? 'hidden' : '';
    document.body.classList.toggle('modal-open');
  };

  register = async (email, password, username) => {
    console.log(email, password, username)
    try {
      const response = await axios.post("http://localhost:3000/users", {
      "user": {
        "email": email,
        "password": password,
        "username": username
      }
      });
      if (response.status === 201) {
        console.log(response);
        const token = response.data.user.token; // Получаем токен из ответа
        const username = response.data.user.username;
        localStorage.setItem('token', token); // Сохраняем токен в localStorage
        localStorage.setItem('username', username);
        // Перенаправление на страницу каталога после успешной регистрации
        window.location.href = "/catolog.html";
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  handleSubmit = (event) => {
    event.preventDefault(); // Предотвращение отправки формы по умолчанию
    const { email, password, username } = this.state;
    this.register(email, password, username);
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  renderRegistrationForm = () => {
    const { showRegistrationForm, email, password, username } = this.state;
    if (showRegistrationForm) {
      return (
        <div className="bg show" onClick={this.toggleRegistrationForm}>
          <form className="registerForm" onClick={(e) => e.stopPropagation()} onSubmit={this.handleSubmit}>
            <div onClick={this.toggleRegistrationForm} className="registerForm__close">×</div>
            <div className="registerForm__wrapper">
              <input name="username" value={username} onChange={this.handleChange} className="registerForm__wrapper__Input" type="text" placeholder="  Login" />
              <input name="email" value={email} onChange={this.handleChange} className="registerForm__wrapper__Input" type="email" placeholder="  Email" />
              <input name="password" value={password} onChange={this.handleChange} className="registerForm__wrapper__Input" type="password" placeholder="  Password" />
              <button className="registerForm__wrapper__btn" type="submit">Зарегистрироваться</button>
            </div>
          </form>
        </div>
      );
    }
  };

  handleLogin = (event) => {
  event.preventDefault();
  const { email, password } = this.state;
  this.login(email, password);
  };

  login = async (email, password) => {
    console.log(email, password);
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        "user": {
          "email": email,
          "password": password
        }
      });
      if (response.status === 201 || response.status === 200) {
        console.log(response);
        const username = response.data.user.username;
        const token = response.data.user.token; // Получаем токен из ответа
        localStorage.setItem('token', token); // Сохраняем токен в localStorage
        localStorage.setItem('username', username); 
        window.location.href = "/catolog.html";
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };


 renderLoginForm = () => {
  const { showLoginForm, email, password } = this.state;
  if (showLoginForm) {
    return (
      <div className="bg show" onClick={this.toggleLoginForm}>
        <form className="loginForm" onClick={(e) => e.stopPropagation()} onSubmit={this.handleLogin}>
          <div className="loginForm__wrapper">
            <div onClick={this.toggleLoginForm} className="loginForm__close">×</div>
            <input name="email" value={email} onChange={this.handleChange} className="loginForm__wrapper__Input" type="email" placeholder="  Email" />
            <input name="password" value={password} onChange={this.handleChange} className="loginForm__wrapper__Input" type="password" placeholder="  Password" />
            <button className="loginForm__wrapper__btn" type="submit">Войти</button>
          </div>
        </form>
      </div>
    );
  }
};


  render() {
    const userData = {email : this.state.email, password: this.state.password}
    return (
      <UserContext.Provider value={userData}>
        <div>
          <Header toggleRegistrationForm={this.toggleRegistrationForm} toggleLoginForm={this.toggleLoginForm} />
          <FirstWindow />
          <PlatformProducts />
          <Rosmost />
          {this.renderRegistrationForm()}
          {this.renderLoginForm()}
          <Footer />
        </div>
      </UserContext.Provider>

    );
  }
}

export default App;
export const UserContext = React.createContext();
