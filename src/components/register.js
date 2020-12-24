import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthService from './../authService';

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            storeName: "",
            password: "",
            repeatPassword: "",
            success: false,
            error: null
        };
    }

    handleChange(type, event) {
        var newValue = event.target.value;

        if (type === 'storeName') {
            this.setState({ storeName: newValue });
        } else if (type === 'repeatPassword') {
            this.setState({ repeatPassword: newValue });
        } else if (type === 'password') {
            this.setState({ password: newValue });
        }
    }

    register(event) {
        event.preventDefault();
        AuthService.register({
            storeName: this.state.storeName,
            password: this.state.password,
            repeatPassword: this.state.repeatPassword,
        }, (success, error) => {
            if (success === true) {
                this.setState({ success: true, error: null });
            } else {
                this.setState({ success: false, error: error });
            }
        });
    }

    render() {
        if (this.state.success === true) {
            return <Redirect to='/store' />;
        }

        return (
            <Row className="justify-content-md-center">
                <Col xs lg="6">
                    <Card>
                        <Card.Body>
                            <Card.Title style={{ textAlign: "center" }}>Register</Card.Title>
                            <Card.Text>
                                <Form>
                                    <Form.Group controlId="registerStoreName">
                                        <Form.Label>Store</Form.Label>
                                        <Form.Control type="text" placeholder="Store name"
                                            value={this.state.storeName} onChange={(event) => this.handleChange('storeName', event)} />
                                    </Form.Group>

                                    <Form.Group controlId="registerStorePassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password"
                                            value={this.state.password} onChange={(event) => this.handleChange('password', event)} />
                                    </Form.Group>
                                    
                                    <Form.Group controlId="registerStorePassword">
                                        <Form.Label>Repeat Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password"
                                            value={this.state.repeatPassword} onChange={(event) => this.handleChange('repeatPassword', event)} />
                                    </Form.Group>

                                    {this.state.error != null &&
                                        <Form.Label style={{ color: "red", display: "block" }}>{this.state.error}</Form.Label>
                                    }

                                    <Button onClick={(event) => this.register(event)} variant="outline-primary" type="submit" style={{ float: "right" }} >Register</Button>
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Register;