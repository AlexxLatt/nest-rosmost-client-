import React, { Component } from 'react';
import './Product-list-item.scss';
import productImg from '../../../img/placeholder.jpg';
import likeNoneActive from "../../../icons/likeNoneActive.png";
import axios from 'axios';
import StarRating from './Star-rating'; // Импорт компонента StarRating
import StarFilter from './Star-filrer'; // Импорт компонента StarFilter

class ProductListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProductOpen: false,
      currentProduct: {},
      selectedRating: null, // Добавлено состояние для хранения выбранного рейтинга
      reviews: [] // Правильное написание 'reviews'
    };
  }

  handleClick = () => {
    const { id } = this.props;
    this.openProduct();
    this.findOneProduct(id);
  };

  openProduct = () => {
    document.body.style.overflow = !this.state.isProductOpen ? 'hidden' : '';
    this.setState((prevState) => ({
      isProductOpen: !prevState.isProductOpen
    }));
  };

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


  addProductToBasket = async()=>{

     

  }
  render() {
    const { isProductOpen, currentProduct, reviews } = this.state;
    const { img, title, country, cost } = this.props;

    return (
      <div className="productListItem">
        <div className="productListItem__wrapper">
          <img className="productListItem__wrapper__img" src={productImg} alt="упс..." />
          <div className="productListItem__wrapper__title">{title}</div>
          <div className="productListItem__wrapper__country">{country}</div>
          <div className="productListItem__wrapper__cost">{cost}$</div>
          <button className="productListItem__wrapper__btn" onClick={this.handleClick}>
            Подробнее
          </button>
        </div>

        {isProductOpen && (
          <div className={`productMenuBackground`} onClick={this.openProduct}>
            <div className="productMenu" onClick={(e) => e.stopPropagation()}>
              <div onClick={this.openProduct} className="productMenu__close">
                ×
              </div>
              <div className="productMenu__textWrapper">
                <div className="productMenu__textWrapper__title">{currentProduct.title}</div>
                <div className="productMenu__textWrapper__tags">
                  Перевозка: [{currentProduct.tags && currentProduct.tags[0]}, {currentProduct.tags && currentProduct.tags[1]}]
                </div>
                <div className="productMenu__textWrapper__cost">{currentProduct.cost}$</div>
                <button onClick={this.addProductToBasket} className="productMenu__textWrapper__btn">Добавить в корзину</button>
              </div>
              <div className="productMenu__imgWrapper">
                <img className="productMenu__imgWrapper__img" src="" alt="упс..." />
              </div>
              <div className="productMenu__descr">{currentProduct.desc}</div>
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
                        {/* <div className="productMenu__reviews__item__likeWrapper">
                          <img 
                            className='productMenu__reviews__item__likeWrapper__btn' 
                            onClick={() => this.likeReview(review.slug)} 
                            src={likeNoneActive} 
                            alt="упс" 
                          />
                          <div className="productMenu__reviews__item__likeWrapper__like">{review.favoritesCount}</div>
                        </div> */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ProductListItem;
