import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthService from './../authService';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            loginOk: false,
            error: false
        };
    }

    //διαχειρίζεται την αλλαγή απο το UI και ενημερώνει το state του component
    handleChange(type, event) {
        var newValue = event.target.value;

        if (type === 'username') {
            this.setState({ username: newValue });
        } else if (type === 'password') {
            this.setState({ password: newValue });
        }
    }

    //κάνει Login κι αν δεν τα καταφέρει εμφανίζει κατάλληλο μήνυμα που γράφεται παρακάτω (γραμμές 67-69)
    login(event) {
        event.preventDefault();
        AuthService.authenticate(this.state.username, this.state.password, (success) => {
            if (success === true) {
                this.setState({ loginOk: true, error: false });
            } else {
                this.setState({ loginOk: false, error: true });
            }
        });
    }

    render() {
        if (this.state.loginOk === true) {
            return <Redirect to='/orders' />;
        }

        return (
            <Row className="justify-content-md-center">
                <Col xs lg="6">
                    <Card>
                        <Card.Body>
                            <Card.Title style={{ textAlign: "center" }}>Login</Card.Title>
                            <Card.Text>
                                <Form>
                                    <Form.Group controlId="loginStoreName">
                                        <Form.Label>Store</Form.Label>
                                        <Form.Control type="text" placeholder="Store name"
                                            value={this.state.username} onChange={(event) => this.handleChange('username', event)} />
                                    </Form.Group>

                                    <Form.Group controlId="loginStorePassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password"
                                            value={this.state.password} onChange={(event) => this.handleChange('password', event)} />
                                    </Form.Group>

                                    {this.state.error == true && 
                                        <Form.Label style={{ color: "red", display: "block" }}>Login failed</Form.Label>
                                    }

                                    <Button onClick={(event) => this.login(event)} variant="outline-primary" type="submit" style={{ float: "right" }} >Login</Button>
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Login;