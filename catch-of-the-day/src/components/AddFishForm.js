import React from 'react'

export default class AddFishForm extends React.Component {

  constructor(){
    super()
    this.createFish = this.createFish.bind(this)
  }

  createFish(e) {
    e.preventDefault()
    const fish = {
      name: this.name.value,
      price: this.price.value,
      status: this.status.value,
      description: this.description.value,
      image: this.image.value
    }
    this.props.addFish(fish)
    this.form.reset()
  }

  render() {
    return(
      <form className="fish-edit" ref={(input) => {this.fishForm = input}} onSubmit={this.createFish}>
        <input ref={(input) => {this.name = input}} type="text" placeholder="Fish name" />
        <input ref={(input) => {this.price = input}} type="text" placeholder="Fish price" />
        <select ref={(input) => {this.status = input}}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea ref={(input) => {this.description = input}} placeholder="Fish description" />
        <input ref={(input) => {this.image = input}} type="text" placeholder="Fish image" />
        <button type="submit">Add Item</button>
      </form>
    )
  }
}
