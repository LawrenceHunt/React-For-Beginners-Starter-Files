import React from 'react'
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import sampleFishes from '../sample-fishes'
import Fish from './Fish'
import base from '../base'
import PropTypes from 'prop-types'



export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentWillMount() {
    // Sync fishes with FireBase database
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
    {
      context: this,
      state: 'fishes'
    })
    // Set order in local storage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)
    if(localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref)
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
  }

  addFish = (fish) => {
    const fishes = {...this.state.fishes}
    const timestamp = Date.now()
    fishes[`fish-${timestamp}`] = fish
    this.setState({fishes})
  }

  removeFish = (key) => {
    const fishes = {...this.state.fishes}
    fishes[key] = null
    this.setState({fishes})
  }

  updateFish = (key, updatedFish) => {
    const fishes = {...this.state.fishes}
    fishes[key] = updatedFish
    this.setState({fishes})
  }

  loadSamples = () => {
    this.setState({
      fishes: sampleFishes
    })
  }

  addToOrder = (key) => {
    const order = {...this.state.order}
    order[key] = order[key] + 1 || 1
    this.setState({order})
  }

  removeFromOrder = (key) => {
    const order = {...this.state.order}
    delete order[key]
    this.setState({order})
  }

  render() {
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => {
                  return (
                    <Fish
                      key={key}
                      index={key}
                      details={this.state.fishes[key]}
                      addToOrder={this.addToOrder}
                    />
                  )
                })
            }
          </ul>
        </div>

        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />

        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          fishes={this.state.fishes}
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }
  
  static propTypes = {
    params: PropTypes.object.isRequired
  }
}
