import { Component } from "react";
import axios from 'axios';
import productImg from '../../../img/placeholder.jpg';
import './Basket.scss';

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      totalCost: 0,
      isProductInBasket: true
    };
  }

  componentDidMount() {
    this.findAllProductsInBasket();
  }

  toggleProductInBasket = () => {
    this.setState((prevState) => ({
      isProductInBasket: !prevState.isProductInBasket
    }));
	document.body.style.overflow = !this.state.isProductInBasket ? 'hidden' : '';

  };

   buyProductsOnBasket  = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found in localStorage");
        return;
      }
      console.log("Token:", token);

      const response = await axios.post(`http://localhost:3000/basket/purchase`, {
        headers: {
          Authorization: `Token ${token}`  // Changed from `Token` to `Bearer`
        }
      });

      if (response.status === 200 || response.status === 201) {
        const products = response.data.products;
        console.log(products);
        const totalCost = this.calculateTotalCost(products);
        this.setState({ products: [], totalCost: 0 });
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };



  deleteProductInBasket = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found in localStorage");
        return;
      }
      console.log("Token:", token);

      const response = await axios.delete(`http://localhost:3000/basket/${id}`, {
        headers: {
          Authorization: `Token ${token}`  // Changed from `Token` to `Bearer`
        }
      });

      if (response.status === 200 || response.status === 201) {
		console.log('удаление прошло успешно')
		this.findAllProductsInBasket();
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };


  findAllProductsInBasket = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token not found in localStorage");
        return;
      }
      console.log("Token:", token);

      const response = await axios.get(`http://localhost:3000/products`, {
        headers: {
          Authorization: `Bearer ${token}`  // Changed from `Token` to `Bearer`
        }
      });

      if (response.status === 200 || response.status === 201) {
        const products = response.data.products;
        console.log(products);
        const totalCost = this.calculateTotalCost(products);
        this.setState({ products: products, totalCost: totalCost });
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  calculateTotalCost(products) {
    return products.reduce((total, product) => total + product.cost, 0);
  }

  render() {
    const { products, totalCost, isProductInBasket } = this.state;

    return (
	(isProductInBasket&&
		<div className="basket">
        <div className="basket__window">
          <div onClick={this.toggleProductInBasket} className="basket__window__close">×</div>
          <div className="basket__window__title">Корзина</div>
          <div className="basket__window__wrapper">
            {products && products.map((product) => (
              <div key={product.id} className="basket__window__wrapper__product">
                <img src={product.image || productImg} alt="упс..." className="basket__window__wrapper__product__img" />
                <div className="basket__window__wrapper__product__title">{product.title}</div>
                <div className="basket__window__wrapper__product__country">Страна: {product.country}</div>
                <div className="basket__window__wrapper__product__cost">Цена: {product.cost}$</div>
                <button className="basket__window__wrapper__product__deleteBtn" onClick={(e)=>this.deleteProductInBasket(product.id)}>удалить</button>
              </div>
            ))}
          </div>
          <div className="basket__window__totalCost">Итого: {totalCost}$</div>
          <div className="basket__window__buy">Купить</div>
        </div>
      </div>
	)
      
    );
  }
}

export default Basket;
