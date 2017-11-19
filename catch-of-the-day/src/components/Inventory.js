import React from 'react'
import AddFishForm from './AddFishForm'
import PropTypes from 'prop-types'
import base from '../base'

export default class Inventory extends React.Component {

  constructor() {
    super()
    this.renderInventory = this.renderInventory.bind(this)
    this.authenticate = this.authenticate.bind(this)
    this.authHandler = this.authHandler.bind(this)
    this.logout = this.logout.bind(this)

    this.state = {
      uid: null,
      owner: null
    }
  }


  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user })
      }
    })
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key]
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish)
  }

  renderInventory = (key) => {
    const fish = this.props.fishes[key]
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" placeholder="Fish name" value={fish.name} onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="price" placeholder="Fish price" value={fish.price} onChange={(e) => this.handleChange(e, key)}/>

        <select type="text" name="status" placeholder="Fish status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>

        <textarea type="text" name="description" placeholder="Fish description" value={fish.desc} onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="image" placeholder="Fish image" value={fish.image} onChange={(e) => this.handleChange(e, key)}/>

        <button onClick={() => this.props.removeFish(key)}>Remove fish</button>
      </div>
    )
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler)
  }

  authHandler(err, authData) {
    if (err) {
      console.log(err)
    }

    const storeRef = base.database().ref(this.props.storeId)
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {}
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        })
      }
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  }

  logout() {
    base.unauth()
    this.setState({
      uid: null
    })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>{"Sign in to manage your store's inventory"}</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
      </nav>
    )
  }

  render() {
    const logout = (<button onClick={this.logout}>Log out!</button>)

    if (!this.state.uid) {
      return this.renderLogin()
    }
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <span>Sorry, you are not the owner of this store</span>
          {logout}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(key => this.renderInventory(key))}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
  static propTypes = {
    fishes: PropTypes.object.isRequired,
    updateFish: PropTypes.func.isRequired,
    removeFish: PropTypes.func.isRequired,
    addFish: PropTypes.func.isRequired,
    loadSamples: PropTypes.func.isRequired,
    storeId: PropTypes.string.isRequired
  }
}
