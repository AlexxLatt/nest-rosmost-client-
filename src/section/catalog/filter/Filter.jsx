import React, { Component } from 'react';
import './Filter.scss';

class Filter extends Component {
  constructor(props) {
    super(props); // Обязательный вызов для доступа к this.props внутри конструктора
    this.state = {
      term: '',
      country: ''
      
    };
  }

  onUpdateSearch = (e) => {
    const term = e.target.value;
    this.setState({ term });
    this.props.onUpdateSearch(term); 
  }

  onUpdateFilter = (e) => {
    const selectedCountry = e.target.dataset.country;
    this.setState({ country: selectedCountry });
    this.props.onUpdateFilter(selectedCountry); 
  }

  render() {
    return (
      <div className="Filter">
        <div className="container">
          <div className="Filter__mainWrapper">
            <div className="Filter__mainWrapper__inputWrapper">
              <label htmlFor="inputFilter" className='Filter__mainWrapper__inputWrapper__label'>Looking for</label>
              <input onChange={this.onUpdateSearch} type="text" name='inputFilter' className='Filter__mainWrapper__inputWrapper__input' placeholder='start typing here...' />
            </div>
            <div className="Filter__mainWrapper__buttonWrapper">
              <span className='Filter__mainWrapper__buttonWrapper__title'>Or filter</span>
              <button className='Filter__mainWrapper__buttonWrapper__btn' onClick={this.onUpdateFilter} data-country="Brazil">Brazil</button>
              <button className='Filter__mainWrapper__buttonWrapper__btn' onClick={this.onUpdateFilter} data-country="Kenya">Kenya</button>
              <button className='Filter__mainWrapper__buttonWrapper__btn' onClick={this.onUpdateFilter} data-country="Columbia">Columbia</button>
            </div>
             <div className="Filter__mainWrapper__profileWrapper">
                <div className="Filter__mainWrapper__profileWrapper__clickArea">
                <span className='Filter__mainWrapper__profileWrapper__clickArea__name'>Or filter</span>
                <img className='Filter__mainWrapper__profileWrapper__clickArea__img' src="" alt="упс" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
