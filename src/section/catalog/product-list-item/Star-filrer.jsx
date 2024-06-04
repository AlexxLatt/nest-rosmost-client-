import React, { Component } from 'react';
import starActive from "../../../icons/starActive.png";
import starNonActive from "../../../icons/starNoneActive.png";
import './Star-filter.scss'; // Импорт CSS файла
import axios from 'axios';

class StarFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: null, // Для отслеживания индекса наведенной звезды
      selectedIndex: null, // Для отслеживания индекса выбранной звезды
      reviews: []
    };
  }

  handleMouseEnter = (index) => {
    this.setState({ hoverIndex: index });
  };

  handleMouseLeave = () => {
    this.setState({ hoverIndex: null });
  };

  handleClick = async (id, index) => {
    this.setState({ selectedIndex: index });
    await this.findReviewByRating(id, index);
    if (this.props.onRatingSelect) {
      this.props.onRatingSelect(index);
    }
  };

  findReviewByRating = async (id, rating) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/reviews?productId=${id}&rating=${rating}`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (response.status === 200 || response.status === 201) {
        const reviews = response.data.reviews;
        this.setState({ reviews: reviews });
        this.props.onChangeStateRating(reviews);
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  renderStars = () => {
    const { hoverIndex, selectedIndex } = this.state;
    const { id } = this.props;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isActive = (hoverIndex !== null && i <= hoverIndex) || (selectedIndex !== null && i <= selectedIndex);
      stars.push(
        <span 
          key={i}
          className='star-container'
          onMouseEnter={() => this.handleMouseEnter(i)}
          onMouseLeave={this.handleMouseLeave}
          onClick={() => this.handleClick(id, i)}
        >
          <img
            className='star-img'
            src={isActive ? starActive : starNonActive}
            alt="упс..."
          />
        </span>
      );
    }
    return stars;
  };

  render() {
    return <div className="star-filter">{this.renderStars()}</div>;
  }
}

export default StarFilter;
