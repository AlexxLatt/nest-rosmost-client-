import { Component } from "react";
import axios from 'axios';
import './Basket.scss';
class Basket extends Component{
	constructor(props){
		super(props)
		this.state = {
			products: []
		}
	}

   findAllProductsInBasket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/products`, {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.status === 200 || response.status === 201) {
        const products = response.data.products;
        console.log(products);
        this.setState({ products: products });
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

	render(){
		const {products} = this.state;
		return(
			<div className="basket">
				<div className="basket__window">
					<div className="basket__window__close">×</div>
					<div className="basket__window__wrapper__title">Корзина</div>
					<div className="basket__window__wrapper">
						
						{products&&products.map((product)=>(
							<div className="basket__window__wrapper__product">

							</div>
						))}

					</div>
				</div>
			</div>
		)
	}
}
export default Basket;