import React, { Component } from 'react';
import miniStarActive from "../../../icons/miniStarActive.png";
class StarRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: props.initialRating || 0
    };
  }


  renderStars = () => {
	const {initialRating} = this.props;
    const stars = [];
    for (let i = 1; i <=initialRating; i++) {
      stars.push(
        <span>
          <img src={miniStarActive} alt="упс..." />
        </span>
      );
    }
    return stars;
  };

  render() {
    return <div className="star-rating">{this.renderStars()}</div>;
  }
}

export default StarRating;
