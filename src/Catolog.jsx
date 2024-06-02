import React, { Component } from "react";
import Filter from "./section/catalog/filter/Filter";
import ProductList from "./section/catalog/product-list/Product-list";
import UserContext from "./App";

import axios from 'axios';

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      term: '',
      country: '',
    };
  }

  static contextType = UserContext;

  async componentDidMount() {
    await this.allProducts();
  }

  allProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:3000/products/all", {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.status === 200) {
        console.log("Data fetched successfully");
        console.log(response.data.products);
        const data = response.data.products;
        this.setState({ data: data });
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  searchEmp = (items, term) => {
    if (term.length === 0) {
      return items;
    }
    return items.filter(item => {
      return item.title.indexOf(term) > -1;
    });
  }

  buttonSearch = (items, country) => {
    if (!country) {
      return items;
    }
    return items.filter(item => item.country === country);
  }

  onUpdateSearch = (term) => {
    this.setState({ term });
  }

  onUpdateFilter = (country) => {
    this.setState({ country });
  }

  render() {
    const { data, term, country } = this.state;
    const visibleData = this.buttonSearch(this.searchEmp(data, term), country);

    return (
      <div className='App'>
        <Filter onUpdateFilter={this.onUpdateFilter} onUpdateSearch={this.onUpdateSearch} />
        <ProductList data={visibleData} />
      </div>
    );
  }
}

export default Catalog;
