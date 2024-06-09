import React, { Component } from 'react';
import './Filter.scss';
import iconSearch from "../../../icons/InputSearch.png";
import iconUser from "../../../icons/user.png";
import iconBasket from "../../../icons/cart.png";
import iconProfile from "../../../icons/profile.png";
import iconPurshase from "../../../icons/coin.png";
import iconLogout from "../../../icons/logout.png";
import makeAnimated from 'react-select/animated';
import Select from "react-select";
import Basket from '../basket/Basket';
import Profile from '../profile/Profile';
import Purchases from '../purchases/Purchases';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      country: '',
      isDropdownOpen: false,
      isBasketOpen: false,
      isProfileOpen: false,
      isPurchasesOpen: false
    };
  }

  toggleBasket = () => {
    const { isBasketOpen } = this.state;
    this.setState({
      isBasketOpen: !isBasketOpen
    });
    document.body.style.overflow = !isBasketOpen ? 'hidden' : '';
  }

  toggleProfile = () => {
    const { isProfileOpen } = this.state;
    this.setState({
      isProfileOpen: !isProfileOpen
    });
    document.body.style.overflow = !isProfileOpen ? 'hidden' : '';
  }

  togglePurchases = () => {
    const { isPurchasesOpen } = this.state;
    this.setState({
      isPurchasesOpen: !isPurchasesOpen
    });
    document.body.style.overflow = !isPurchasesOpen ? 'hidden' : '';
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (event) => {
    const { isDropdownOpen } = this.state;
    if (isDropdownOpen && this.dropdownRef && !this.dropdownRef.contains(event.target)) {
      this.setState({ isDropdownOpen: false });
    }
  }

  onUpdateSearch = (e) => {
    const term = e.target.value;
    this.setState({ term });
    this.props.onUpdateSearch(term);
  }

  onUpdateFilter = (selectedOption) => {
    const country = selectedOption && selectedOption.label !== 'All' ? selectedOption.label : '';
    this.setState({ country });
    this.props.onUpdateFilter(country);
  }

  exitInCatalog = () => {
    localStorage.clear();
    try {
      window.location.href = "http://localhost:5173";
    } catch (error) {
      console.log('Error:', error);
    }

  }

  toggleDropdown = () => {
    const { isDropdownOpen } = this.state;
    this.setState({
      isDropdownOpen: !isDropdownOpen
    });
    
  }

  render() {
    const { isDropdownOpen, isBasketOpen, isProfileOpen, isPurchasesOpen } = this.state;
    const animatedComponents = makeAnimated();
    const options = [
      { value: 'Australia', label: 'Australia' },
      { value: 'Japan', label: 'Japan' },
      { value: 'South Korea', label: 'South Korea' },
      { value: 'Brazilia', label: 'Brazilia' },
      { value: 'USA', label: 'USA' },
      { value: 'Canada', label: 'Canada' },
      { value: 'All', label: 'All' }
    ];
    let username = localStorage.getItem('username');
    if (username.length > 5) {
      username = username.slice(0, 5) + '...';
    }

    return (
      <div className="Filter">
        <div className="container">
          <div className="Filter__mainWrapper">
            <div className="Filter__mainWrapper__inputWrapper">
              <img src={iconSearch} alt="упс.." className="Filter__mainWrapper__inputWrapper__iconSearch" />
              <input
                onChange={this.onUpdateSearch}
                type="text"
                name='inputFilter'
                className='Filter__mainWrapper__inputWrapper__input'
                placeholder='Поиск по имени'
              />
            </div>
            <div className="Filter__mainWrapper__buttonWrapper">
              <div className="Filter__mainWrapper__buttonWrapper__label">Фильтр:</div>
              <Select
                components={animatedComponents}
                options={options}
                placeholder={'Country'}
                onChange={this.onUpdateFilter}
                className='Filter__mainWrapper__buttonWrapper__item'
              />
            </div>
            <div className="Filter__mainWrapper__profileWrapper">
              <div className="Filter__mainWrapper__profileWrapper__clickArea" onClick={this.toggleDropdown}>
                <span className='Filter__mainWrapper__profileWrapper__clickArea__name'>{username} ⮟ </span>
                <img className='Filter__mainWrapper__profileWrapper__clickArea__img' src={iconUser} alt="упс" />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu" ref={(node) => { this.dropdownRef = node; }}>
                  <ul>
                    <li className="dropdown-menu__item" onClick={this.toggleBasket}><img src={iconBasket} alt="упс..." /><div>Корзина</div></li>
                    <li className="dropdown-menu__item" onClick={this.togglePurchases}> <img src={iconPurshase} alt="упс..." /> <div>Покупки</div></li>
                    <li className="dropdown-menu__item" onClick={this.toggleProfile}><img src={iconProfile} alt="упс..." /><div>Профиль</div></li>
                    <li className="dropdown-menu__item"><img src={iconLogout} onClick={this.exitInCatalog} alt="упс..." /><div>Выход</div></li>
                  </ul>
                </div>
              )}
              {isBasketOpen && <Basket></Basket>}
              {isProfileOpen && <Profile></Profile>}
              {isPurchasesOpen && <Purchases></Purchases>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
