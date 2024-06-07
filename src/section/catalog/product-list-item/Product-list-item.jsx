import React, { Component } from 'react';
import './Product-list-item.scss';
import productImg from '../../../img/placeholder.jpg';
import likeNoneActive from "../../../icons/likeNoneActive.png";
import success from "../../../icons/success.png";
import axios from 'axios';
import StarRating from './Star-rating'; // Импорт компонента StarRating
import StarFilter from './Star-filrer'; // Импорт компонента StarFilter
import Basket from '../basket/Basket';
class ProductListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProductOpen: false,
      isProductInBasket: false, 
      currentProduct: {},
      selectedRating: null, // Добавлено состояние для хранения выбранного рейтинга
      reviews: [], // Правильное написание 'reviews'
      basket: {},
      isBasketOpen: false
    };
  }

  handleClick = () => {
    const { id } = this.props;
    this.toggleOpenProduct();
    this.findOneProduct(id);
  };

toggleOpenProduct = () => {
    document.body.style.overflow = !this.state.isProductOpen ? 'hidden' : '';
    this.setState((prevState) => ({
        isProductOpen: !prevState.isProductOpen // исправлено isProductInBasket на isProductOpen
    }));
};


  toggleProductInBasket = ()=>{
    document.body.style.overflow = !this.state.isProductOpen ? 'hidden' : '';
    this.setState((prevState) => ({
      isProductInBasket: !prevState.isProductInBasket
    }));
  }

  findOneProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/products/${id}`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.status === 200 || response.status === 201) {
        const { product } = response.data;
        const { reviews } = response.data.product;
        this.setState({ currentProduct: product, reviews: reviews });
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  handleRatingSelect = (rating) => {
    this.setState({ selectedRating: rating });
  };

  handleStateRating = (data) => {
    this.setState({ reviews: data });
  };

  likeReview = async (slug) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/reviews/${slug}/favorite`, {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.status === 200 || response.status === 201) {
        const updatedReview = response.data.review;
        this.setState((prevState) => ({
          reviews: prevState.reviews.map((review) =>
            review.slug === updatedReview.slug ? updatedReview : review
          )
        }));
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products');
    if (response.status === 200 || response.status === 201) {
      const products = response.data.products;
      // Обновите состояние вашего компонента с новым списком продуктов
      // this.setState({ products: products });
    } else {
      console.log('Unexpected status code:', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};


// В вашем методе addProductToBasket добавьте вызов метода для обновления списка всех продуктов
addProductToBasket = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:3000/basket/${id}`, {}, {
      headers: {
        Authorization: `Token ${token}`  // Changed from `Token` to `Bearer`
      }
    });
    if (response.status === 200 || response.status === 201) {
      const basket = response.data.basket;
      console.log(basket);
      this.setState({ basket: basket });
      this.toggleOpenProduct();
      this.toggleProductInBasket();

      // После успешного добавления продукта в корзину, обновите список всех продуктов
      await this.findAllProductsInBasket(); // Загрузите список всех продуктов снова
    } else {
      console.log('Unexpected status code:', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};




  toggleBasket = () =>{

    this.setState((prevState)=>({
      isBasketOpen : !prevState.isBasketOpen
    }));

  } 
  handleBasket = ()=>{
    this.toggleBasket();
    this.toggleProductInBasket();
  }

  render() {
    const { isProductOpen, currentProduct, reviews, isProductInBasket, isBasketOpen } = this.state;
    const { img, title, country, cost } = this.props;

    return (
      <div className="productListItem">
        <div className="productListItem__wrapper">
          <img className="productListItem__wrapper__img" src={img || productImg} alt="упс..." />
          <div className="productListItem__wrapper__title">{title}</div>
          <div className="productListItem__wrapper__country">{country}</div>
          <div className="productListItem__wrapper__cost">{cost}$</div>
          <button className="productListItem__wrapper__btn" onClick={this.handleClick}>
            Подробнее
          </button>
        </div>

        {isProductOpen && (
          <div className={`productMenuBackground`} onClick={this.toggleOpenProduct}>
            <div className="productMenu" onClick={(e) => e.stopPropagation()}>
              <div onClick={this.toggleOpenProduct} className="productMenu__close">
                ×
              </div>
              <div className="productMenu__textWrapper">
                <div className="productMenu__textWrapper__title">{currentProduct.title}</div>
                <div className="productMenu__textWrapper__tags">
                  Перевозка: [{currentProduct.tags && currentProduct.tags[0]}, {currentProduct.tags && currentProduct.tags[1]}]
                </div>
                <div className="productMenu__textWrapper__cost">{currentProduct.cost}$</div>
                <button onClick={() => this.addProductToBasket(currentProduct.id)} className="productMenu__textWrapper__btn">
                  Добавить в корзину
                </button>
              </div>
              <div className="productMenu__imgWrapper">
                <img className="productMenu__imgWrapper__img" src={img || productImg} alt="упс..." />
              </div>
              <div className="productMenu__descr">{currentProduct.description}</div>
              <div className="productMenu__reviews">
                <h3>Отзывы: 
                  <StarFilter id={this.props.id} onRatingSelect={this.handleRatingSelect} onChangeStateRating={this.handleStateRating} />
                </h3>
                <div className="productMenu__reviews__list">
                  {reviews &&
                    reviews.map((review) => (
                      <div key={review.id} className="productMenu__reviews__item">
                        <div className="productMenu__reviews__item__author">{review.author.username}</div>
                        <div className="productMenu__reviews__item__rating">
                          <StarRating initialRating={review.rating} />
                        </div>
                        <div className="productMenu__reviews__item__title">{review.title}</div>
                        <div className="productMenu__reviews__item__text">{review.description}</div>
                        <div className="productMenu__reviews__item__likeWrapper">
                          <img 
                            className='productMenu__reviews__item__likeWrapper__btn' 
                            onClick={() => this.likeReview(review.slug)} 
                            src={likeNoneActive} 
                            alt="упс" 
                          />
                          <div className="productMenu__reviews__item__likeWrapper__like">{review.favoritesCount}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {isProductInBasket&&(
          <div className="noticeBasketInProduct">
            <div className="noticeBasketInProduct__window">
                <div onClick={this.toggleProductInBasket} className="noticeBasketInProduct__window__close">×</div>
                <img className="noticeBasketInProduct__window__icon" src={success} alt="упс" />
                <div className="noticeBasketInProduct__window__text">Продукт добавлен в вашу корзину</div>
                <button onClick={this.handleBasket} className="noticeBasketInProduct__window__btn">Перейти в корзину</button>
            </div>
          </div>
        )}
        {isBasketOpen&&<Basket></Basket>}

      </div>
    );
  }
} 

export default ProductListItem;
