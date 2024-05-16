import { Component } from "react";
import Filter from "./section/catalog/filter/Filter"
import ProductList from "./section/catalog/product-list/Product-list"
import UserContext from "./App"
class Catolog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { img: 'Hello', title: 'AROMISTICO Coffee 1 kg', country: 'Brazil', coust :'6.99$', id: 1 },
        { img: 'Hello', title: 'AROMISTICO Coffee 2 kg', country: 'Kenya', coust :'7.99$', id: 2 },
        { img: 'Hello', title: 'AROMISTICO Coffee 3 kg', country: 'Columbia', coust :'8.99$', id: 3 },
        { img: 'Hello', title: 'AROMISTICO Coffee 4 kg', country: 'Brazil', coust :'6.99$', id: 4 },
        { img: 'Hello', title: 'AROMISTICO Coffee 5 kg', country: 'Brazil', coust :'10.99$', id: 5 },
      ],
      term:'',
      country:''
      
    };
  }
   static contextType = UserContext;

  searchEmp = (items,term)=>{
		if (term.length===0){
			return items;
		}
		return items.filter(item=>{
			return item.title.indexOf(term) > -1  // indexOf находит кусочки имени которое мы вписали (> - 1 тут прикол в том что -1 озночает что мы ничего не нашли поэтому ишем больше чем -1 )
		});
	}
  buttonSearch =(item , country)=>{
    switch(country){
      case 'Brazil' :
        return item.filter(item => item.country.indexOf(country)> -1);
      case 'Kenya' : 
        return item.filter(item => item.country.indexOf(country)> -1);
      
      case 'Columbia' : 
        return item.filter(item => item.country.indexOf(country)> -1);    
        default :
        return item; 
    }   
  }

  onUpdateSearch = (term)=>{
    this.setState({term});
  }

  onUpdateFilter = (country)=>{
    this.setState({country});
  }


  render() {
    const { data , term, country} = this.state;
    const visibleData = this.buttonSearch(this.searchEmp(data, term), country)
    return (
      <div className='App'>
        <Filter onUpdateFilter={this.onUpdateFilter}  onUpdateSearch={this.onUpdateSearch}/>
        <ProductList data={visibleData} />
      </div>
    );
  }
}

export default Catolog;