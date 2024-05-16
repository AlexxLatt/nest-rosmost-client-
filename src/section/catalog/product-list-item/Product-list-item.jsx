import'./Product-list-item.scss';
import productImg from '../../../img/placeholder.jpg';


function ProductListItem (props){
	const {img,title,country, coust} = props;
	return(
		<div className="productListItem">
			<img className="productListItem__img" src={productImg} alt="упс..." />
			<div className="productListItem__title">{title}</div>
			<div className="productListItem__country">{country}</div>
			<div className="productListItem__coust">{coust}</div>
		</div>
	)


}
export default ProductListItem;