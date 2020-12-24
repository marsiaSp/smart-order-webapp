// src/App.js

import React, { Component } from 'react';
import Products from './components/products';
import Orders from './components/orders';
import Store from './components/store';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import PrivateRoute from './components/privateRoute';
import AuthService from './authService';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

//το URL του backend
window.$baseUrl = "https://localhost:5001";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      store: null,
      categories: [],
      isAuthenticated: false
    };

    AuthService.onLogin((storeId) => {
      this.getStoreInfo(storeId);
      this.state.isAuthenticated = true;
      this.setState({ isAuthenticated: true });
    });

    AuthService.autoLogin();
  }

  //φέρνει τα στοιχεία του καταστήματος απο το backend(από το API)
  getStoreInfo(storeId) {
    fetch(window.$baseUrl + '/Store/Info/' + storeId)
      .then(res => res.json())
      .then((data) => {
        this.setState({ store: data });
      })
      .catch(console.log);
  }
/*
  handleChange(event) {
    this.setState({ store: { ...this.store, name: event.target.value } });
  }
*/
  logout() {
    AuthService.logout();
    this.setState({ isAuthenticated: false });
  }

  //επιστρέφει το HTML του συγκεκριμένου component
  //ζωγραφίζει ένα μενού και στο container κάνει render ένα component με βάση το Url του browser 
  render() {
    return (
      <div>
        <Router>
          <Navbar bg="dark" variant="dark" style={{ 'margin-bottom': "20px", fontSize:"large" }}>
            <Link className="navbar-brand" to="/">
              <img
                alt="" src="/logo192.png" width="30" height="30" className="d-inline-block align-top"
              />{' '}
              {this.state.isAuthenticated === true ? 'Smart Order: ' + this.state.store?.name : 'Smart Order'}
            </Link>
            {this.getMenu()}
          </Navbar>

          <Container>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute path="/store" component={Store} />
            <PrivateRoute path="/products" component={Products} />
            <PrivateRoute path="/orders" component={Orders} />
          </Container>
        </Router>
      </div >
    );
  }

  //συνάρτηση που φτιάχνει το μενού (ανάλογα με το αν εισαι logged in)
  getMenu() {
    if (this.state.isAuthenticated === true) {
      return [
        <Nav className="mr-auto">
          <Link className="nav-link" to="/orders">Orders</Link>
          <Link className="nav-link" to="/products">Pricelist</Link>
        </Nav>,
        <Nav className="pull-right">
          <Link className="nav-link" to="/store">Settings</Link>
          <Link className="nav-link" onClick={() => this.logout()}>Logout</Link>
        </Nav>
      ];
    } else {
      return (
        <Nav className="mr-auto">
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/register">Register</Link>
        </Nav>
      );
    }
  }

}

export default App;