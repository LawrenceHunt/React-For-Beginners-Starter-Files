import React from 'react'
import {formatPrice} from '../helpers'
import PropTypes from 'prop-types'

export default class Fish extends React.Component {

  render() {
    const {details, index} = this.props
    const isAvailable = details.status === 'available'
    const buttonText = isAvailable ? 'Add to order' : 'Sold Out!'

    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name}/>
        <h3 className="fish-name">{details.name}</h3>
        <span className="price">{formatPrice(details.price)}</span>
        <p>{details.desc}</p>
        <button onClick={() => this.props.addToOrder(index)}>{buttonText}</button>
      </li>
    )
  }

}

Fish.propTypes = {
  details: PropTypes.object.isRequired,
  index: PropTypes.string.isRequired,
  addToOrder: PropTypes.func.isRequired
}
