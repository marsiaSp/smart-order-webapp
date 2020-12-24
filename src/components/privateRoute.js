import AuthService from './../authService';
import { Route, Redirect } from 'react-router-dom';
import React, { Component } from 'react';

//component το οποίο ελέγχει εάν ο χρήστης είναι συνδεδεμένος 
//και σε περίπτωση που δεν είναι κάνει ανακατεύθυνση στη login
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.isAuthenticated() === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

export default PrivateRoute;