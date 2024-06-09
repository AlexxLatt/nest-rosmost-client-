import React, { Component } from 'react';
import starActive from "../../../icons/starActive.png";
import starNonActive from "../../../icons/starNoneActive.png";
import './Profile.scss'; // Импорт CSS файла
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      address: '',
      passportSeries: '',
      passportCode: '',
      img: '',
      isProfileWindow: false,
      profileDataWindow: true
    };
  }

  componentDidMount() {
    this.fetchCurrentUser();
  }

  toggleProfileWindow = () => {
    this.setState((prevState) => ({
      isProfileWindow: !prevState.isProfileWindow
    }));
    document.body.style.overflow = !this.state.isProfileWindow ? 'hidden' : '';
  }

  toggleProfileDataWindow = () => {
    this.setState((prevState) => ({
      profileDataWindow: !prevState.profileDataWindow
    }));
    document.body.style.overflow = !this.state.profileDataWindow ? 'hidden' : '';
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  saveAndChenge = () => {
    this.toggleProfileWindow();
    this.updateUser();
  }

  fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Токен не найден в localStorage");
        return;
      }

      const response = await axios.get(`http://localhost:3000/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;
        this.setState({
          username: user.username || '',
          email: user.email || '',
          address: user.address || '',
          passportSeries: user.passportSeries || '',
          passportCode: user.passportCode || '',
          img: user.img || ''
        });
      } else {
        console.log('Неожиданный код статуса:', response.status);
      }
    } catch (error) {
      console.log('Ошибка:', error);
    }
  };

  updateUser = async () => {
    try {
      const { address, passportSeries, passportCode, username, email } = this.state;
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Токен не найден в localStorage");
        return;
      }

      const response = await axios.put('http://localhost:3000/userWithout', {
        user: {
          address: address,
          passportSeries: passportSeries,
          passportCode: passportCode,
          username: username,
          email: email
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Пользователь успешно обновлен');
        this.setState({
          isProfileWindow: false
        });
      } else {
        console.log('Неожиданный код статуса:', response.status);
      }
    } catch (error) {
      console.log('Ошибка:', error);
    }
  };

  render() {
    const { address, email, username, passportCode, passportSeries, img, isProfileWindow, profileDataWindow } = this.state;
    return (
      <>
        {profileDataWindow && (
          <div className="profile">
            <div className="profile__window">
              <div onClick={this.toggleProfileDataWindow} className="profile__window__close">×</div>
              <div className="profile__window__title">Ваш профиль</div>
              <div className="profile__window__wrapper">
                <img src={img || ''} alt="Profile" className="profile__window__wrapper__img" />
                <button className="profile__window__wrapper__chengeImg">Поменять Фото</button>
                <div className="profile__window__wrapper__username label">Имя: {username}</div>
                <div className="profile__window__wrapper__email label">Email: {email}</div>
                <div className="profile__window__wrapper__address label">Адрес: {address}</div>
                <div className="profile__window__wrapper__passportSeries label">Серия паспорта: {passportSeries}</div>
                <div className="profile__window__wrapper__passportCode label">Код паспорта: {passportCode}</div>
                <button onClick={this.toggleProfileWindow} className="profile__window__wrapper__chengeData">Поменять и обновить данные</button>
              </div>
            </div>
          </div>
        )}
        {isProfileWindow && (
          <div className="profile">
            <div className="profile__window">
              <div onClick={this.toggleProfileWindow} className="profile__window__close">×</div>
              <div className="profile__window__title">Заполните данные</div>
              <div className="profile__window__wrapper">
                <label htmlFor="username">Имя</label>
                <input
                  id="username"
                  name="username"
                  className="profile__window__wrapper__input"
                  value={username}
                  onChange={this.handleChange}
                />
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  className="profile__window__wrapper__input"
                  value={email}
                  onChange={this.handleChange}
                />
                <label htmlFor="address">Адрес</label>
                <input
                  id="address"
                  name="address"
                  className="profile__window__wrapper__input"
                  value={address}
                  onChange={this.handleChange}
                />
                <label htmlFor="passportSeries">Серия паспорта</label>
                <input
                  id="passportSeries"
                  name="passportSeries"
                  className="profile__window__wrapper__input"
                  value={passportSeries}
                  onChange={this.handleChange}
                />
                <label htmlFor="passportCode">Код подразделения</label>
                <input
                  id="passportCode"
                  name="passportCode"
                  className="profile__window__wrapper__input"
                  value={passportCode}
                  onChange={this.handleChange}
                />
                <div onClick={this.saveAndChenge} className="profile__window__wrapper__btn">Сохранить</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Profile;
