import React, { Component } from 'react';
import './Purchases.scss';
import axios from 'axios';

class Purchases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchases: [],
      isLoading: true,
      error: null,
      isPurchasesOpen: true,
      isMoreDetailed: false
    };
  }

  togglePurchases = () => {
    this.setState(prevState => ({
      isPurchasesOpen: !prevState.isPurchasesOpen
    }));
    
    document.body.style.overflow = !this.state.isPurchasesOpen ? 'hidden' : '';
  };

  componentDidMount() {
    this.fetchPurchases();
  }

  toggleMoreDetailed= () =>{
    this.setState(prevState => ({
        isMoreDetailed: !prevState.isMoreDetailed
      }));
      
      document.body.style.overflow = !this.state.isMoreDetailed ? 'hidden' : '';
  }

  fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found in localStorage");
        return;
      }

      const response = await axios.get('http://localhost:3000/products/purchased', {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        this.setState({
          purchases: response.data.products,
          isLoading: false,
        });
      } else {
        console.log('Unexpected status code:', response.status);
        this.setState({ isLoading: false, error: 'Failed to load purchases' });
      }
    } catch (error) {
      console.log('Error:', error);
      this.setState({ isLoading: false, error: 'Failed to load purchases' });
    }
  };

  render() {
    const { purchases, isLoading, error, isPurchasesOpen, isMoreDetailed } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <>
        {isPurchasesOpen && (
          <div className="purchases">
            <div className="purchases__window">
              <button onClick={this.togglePurchases} className="purchases__window__close">×</button>
              <h1 className="purchases__window__title">Ваши покупки</h1>
              <div className="purchases__window__list">
                {purchases.map((purchase, index) => (
                  <div key={index} className="purchases__window__list__item">
                    <img src="" alt="упс..." className="purchases__window__list__item__img" />
                    <h2 className="purchases__window__list__item__title">{purchase.title}</h2>
                    <p className="purchases__window__list__item__description">{purchase.description}</p>
                    <p className="purchases__window__list__item__cost">Price: {purchase.cost}$</p>
                    <button onClick={this.toggleMoreDetailed} className="purchases__window__list__item__btn">Подробнее</button>
                    <button className="purchases__window__list__item__btn">Оставить отзыв</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {isMoreDetailed && (
          <div className="moreDetailed">
            <div className="moreDetailed__window">
            <button onClick={this.toggleMoreDetailed} className="moreDetailed__window__close">×</button>
              <div className="moreDetailed__window__title">Заказ №12312312412</div>
              <div className="moreDetailed__window__wrapper">
                <div className="moreDetailed__window__wrapper__deliveryWrapper">

                    <div className="moreDetailed__window__wrapper__deliveryWrapper__item">
                        <img src="" alt="упс..." className="moreDetailed__window__wrapper__deliveryWrapper__item__img" />
                        <div className="moreDetailed__window__wrapper__deliveryWrapper__item__title">1</div>
                    </div>
                    <div className="moreDetailed__window__wrapper__deliveryWrapper__itemSeparator">.....</div>

                    <div className="moreDetailed__window__wrapper__deliveryWrapper__item">
                        <img src="" alt="упс..." className="moreDetailed__window__wrapper__deliveryWrapper__item__img" />
                        <div className="moreDetailed__window__wrapper__deliveryWrapper__item__title">2</div>
                    </div>

                    <div className="moreDetailed__window__wrapper__deliveryWrapper__itemSeparator">.....</div>

                    <div className="moreDetailed__window__wrapper__deliveryWrapper__item">

                        <img src="" alt="упс..." className="moreDetailed__window__wrapper__deliveryWrapper__item__img" />
                        <div className="moreDetailed__window__wrapper__deliveryWrapper__item__title">3</div>
                    </div>

                    <div className="moreDetailed__window__wrapper__deliveryWrapper__itemSeparator">.....</div>
                
                    <div className="moreDetailed__window__wrapper__deliveryWrapper__item">

                        <img src="" alt="упс..." className="moreDetailed__window__wrapper__deliveryWrapper__item__img" />
                        <div className="moreDetailed__window__wrapper__deliveryWrapper__item__title">4</div>
                    </div>

                </div>
              </div>
            </div>    
          </div>
        )}
      </>
    );
  }
}

export default Purchases;
