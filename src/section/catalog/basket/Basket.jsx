import React, { Component } from "react";
import axios from 'axios';
import productImg from '../../../img/placeholder.jpg';
import jcbIcon from '../../../icons/jcb.png';
import mirIcon from '../../../icons/mir.png';
import visaIcon from '../../../icons/visa.png';
import successIcon from '../../../icons/success.png';
import './Basket.scss';

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      totalCost: 0,
      isProductInBasket: true,
      isProfileWindow: false,
      isPurchaseWindow: false,
      isEndWindow: false,
      address: '',
      passportSeries: '',
      passportCode: '',
      user: {}
    };
  }

  componentDidMount() {
    this.findAllProductsInBasket();
    this.fetchCurrentUser();
  }

  toggleProductInBasket = () => {
    this.setState((prevState) => ({
      isProductInBasket: !prevState.isProductInBasket
    }));
    document.body.style.overflow = !this.state.isProductInBasket ? 'hidden' : '';
  };

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
          user, 
          address: user.address || '',
          passportSeries: user.passportSeries || '',
          passportCode: user.passportCode || ''
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
      const { address, passportSeries, passportCode } = this.state;
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Токен не найден в localStorage");
        return;
      }
  
      const response = await axios.put('http://localhost:3000/userWithout', {
        user: {
          address: address,
          passportSeries: passportSeries,
          passportCode: passportCode
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log('Пользователь успешно обновлен');
        this.setState({ 
          user: response.data.user,
          isProfileWindow: false 
        });
        this.togglePurchaseWindow();  // Здесь мы переключаемся на окно покупки
      } else {
        console.log('Неожиданный код статуса:', response.status);
      }
    } catch (error) {
      console.log('Ошибка:', error);
    }
  };
  
  toggleBuyInBasket = () => {
    const { user } = this.state;
    if (!user.passportCode || !user.passportSeries || !user.address) {
      this.setState({ isProfileWindow: true, isProductInBasket: false });
    } else {
      this.togglePurchaseWindow();
    }
  }

  buyProductsOnBasket = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Токен не найден в localStorage");
        return;
      }

      const response = await axios.post(`http://localhost:3000/basket/purchase`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data.products);
        this.setState({ products: [], totalCost: 0 });
        this.toggleEndWindow();
      } else {
        console.log('Неожиданный код статуса:', response.status);
      }
    } catch (error) {
      console.log('Ошибка:', error);
    }
  };

  deleteProductInBasket = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Токен не найден в localStorage");
        return;
      }

      const response = await axios.delete(`http://localhost:3000/basket/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Удаление прошло успешно');
        this.findAllProductsInBasket();
      } else {
        console.log('Неожиданный код статуса:', response.status);
      }
    } catch (error) {
      console.log('Ошибка:', error);
    }
  };

  findAllProductsInBasket = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Токен не найден в localStorage");
        return;
      }

      const response = await axios.get(`http://localhost:3000/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        const products = response.data.products.filter(product => !product.isPurchased);
        const totalCost = this.calculateTotalCost(products);
        this.setState({ products, totalCost });
      } else {
        console.log('Неожиданный код статуса:', response.status);
      }
    } catch (error) {
      console.log('Ошибка:', error);
    }
  };

  calculateTotalCost(products) {
    return products.reduce((total, product) => total + product.cost, 0);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  
  togglePurchaseWindow = () => {
    this.setState((prevState) => ({
      isPurchaseWindow: !prevState.isPurchaseWindow
    }));
    document.body.style.overflow = !this.state.isPurchaseWindow ? 'hidden' : '';
  }

  toggleProfileWindow = () => {
    this.setState((prevState) => ({
      isProfileWindow: !prevState.isProfileWindow
    }));
    document.body.style.overflow = !this.state.isProfileWindow ? 'hidden' : '';
  }

  handleSaveAndProceed = () => {
    this.updateUser();
  };
  
  toggleEndWindow = () => {
    this.setState((prevState) => ({
      isEndWindow: !prevState.isEndWindow
    }));
    this.setState(() => ({
      isPurchaseWindow: false
    }));
    this.setState(() => ({
      isProductInBasket: false
    }));
    document.body.style.overflow = !this.state.isEndWindow ? 'hidden' : '';
  }

  handleByeProduct = () => {
    this.buyProductsOnBasket();
  }

  render() {
    const { products, totalCost, isProductInBasket, isProfileWindow, address, passportSeries, passportCode, isPurchaseWindow, isEndWindow } = this.state;

    return (
      <>
        {isProductInBasket && (
          <div className="basket">
            <div className="basket__window">
              <div onClick={this.toggleProductInBasket} className="basket__window__close">×</div>
              <div className="basket__window__title">Корзина</div>
              <div className="basket__window__wrapper">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="basket__window__wrapper__product">
                      <img src={product.image || productImg} alt="упс..." className="basket__window__wrapper__product__img" />
                      <div className="basket__window__wrapper__product__title">{product.title}</div>
                      <div className="basket__window__wrapper__product__country">Страна: {product.country}</div>
                      <div className="basket__window__wrapper__product__cost">Цена: {product.cost}$</div>
                      <button className="basket__window__wrapper__product__deleteBtn" onClick={() => this.deleteProductInBasket(product.id)}>удалить</button>
                    </div>
                  ))
                ) : (
                  <div className="basket__window__wrapper__empty">В корзине нет товаров</div>
                )}
              </div>
              {products.length > 0 && (
                <>
                  <div className="basket__window__totalCost">Итого: {totalCost}$</div>
                  <div className="basket__window__buy" onClick={this.toggleBuyInBasket}>Купить</div>
                </>
              )}
            </div>
          </div>
        )}

        {isProfileWindow && (
          <div className="profile">
            <div className="profile__window">
              <div onClick={this.toggleProfileWindow} className="profile__window__close">×</div>
              <div className="profile__window__title">Заполните данные перед покупкой</div>
              <div className="profile__window__wrapper">
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
                <div onClick={this.handleSaveAndProceed} className="profile__window__wrapper__btn">Сохранить и перейти к оплате</div>
              </div>
            </div>
          </div>
        )}

        {isPurchaseWindow && (
          <div className="purchase">
            <div className="purchase__window">
              <div onClick={this.togglePurchaseWindow} className="purchase__window__close">×</div>
              <div className="purchase__window__title">Введите данные</div>
              <div className="purchase__window__wrapper">
                <div className="purchase__window__wrapper__icons">
                  <img src={visaIcon} alt="упс..." className="purchase__window__wrapper__icons__icon" />
                  <img src={mirIcon} alt="упс..." className="purchase__window__wrapper__icons__icon" />
                  <img src={jcbIcon} alt="упс..." className="purchase__window__wrapper__icons__icon" />
                </div>

                <input type="text" className="purchase__window__wrapper__inputNomber" placeholder="Номер карты" />
                <label  className="purchase__window__wrapper__labelDate" htmlFor="date">VALID THRU</label>
                <input type="text" id="date" className="purchase__window__wrapper__inputMounth" placeholder="MM" />
                <input type="text" className="purchase__window__wrapper__inputYear" placeholder="ГГ" />
                <label  className="purchase__window__wrapper__labelCvc" htmlFor="cvc">Три цифры с обратной стороны карты</label>
                <input type="text" id="cvc" className="purchase__window__wrapper__inputCvc" placeholder="CVC" />
              </div>
              <div onClick={this.handleByeProduct} className="purchase__window__btn">Купить</div>
            </div>
          </div>
        )}
        
        {isEndWindow &&(
          <div className="endWindow"> 
            <div className="endWindow__window">
              <div className="endWindow__window__wrapper">
                <img src={successIcon} alt="упс..." className="endWindow__window__wrapper__icon" />
                <div className="endWindow__window__wrapper__title">Покупка прошла успешно</div>
                <button onClick={this.toggleEndWindow} className="endWindow__window__wrapper__btn">Ок</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Basket;
