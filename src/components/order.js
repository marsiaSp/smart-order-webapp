import React, { Component } from 'react';
import { Card, Col, Modal, Button, Form } from 'react-bootstrap';
import OrderBody from './../components/orderBody';

class Order extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: props.order,
            pendingModalStatus: false,
            estimatedMinutes: null
        };

        this.statusChanged = props.orderStatusChanged;
    }

    //σηκώνει το Modal
    accept() {
        this.setState({ pendingModalStatus: true, estimatedMinutes: null });
    }
    //κλείνει το μονταλ, κι αν ο χρήστης πάτησε αξεπτ, ενημερώνει μέσω του API οτι έγινε αξεπτ η παραγγελία και θα ναι ετοιμη σε τοσα λεπτά
    handlePendinModalClose(accept) {
        this.setState({ pendingModalStatus: false });
        if (accept === true) {
            fetch(window.$baseUrl + '/Order/Accept/' + this.state.order.id + "/" + this.state.estimatedMinutes)
                .then((data) => {
                    this.statusChanged();
                })
                .catch(console.log);
        }
    }

    setEstinatedMinutes(event) {
        this.setState({ estimatedMinutes: event.target.value });
    }

    render() {
        var isPending = this.state.order.status == 1;

        return (
            <Col sm={4}>
                <Card>
                    <Card.Body>
                        <Card.Title>{this.state.order.user.phone} ({this.state.order.totalPrice}€)</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{this.state.order.user.name}</Card.Subtitle>
                        <OrderBody order={this.state.order}></OrderBody>
                        {isPending
                            ? <Button variant="outline-primary" onClick={() => this.accept()} href="#">Accept</Button>
                            : <Button variant="outline-primary" onClick={() => this.accept()} href="#">Finish</Button>
                        }
                    </Card.Body>
                </Card>
                <br></br>

                <Modal show={this.state.pendingModalStatus} onHide={() => this.handlePendinModalClose(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.order.user.phone} ({this.state.order.totalPrice}€)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="estimatedArrivalTime">
                                <Form.Label>Estimated Arrival time</Form.Label>
                                <Form.Control type="text" placeholder="minutes"
                                    value={this.state.estimatedMinutes} onChange={(event) => this.setEstinatedMinutes(event)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handlePendinModalClose(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.handlePendinModalClose(true)}>
                            Proceed
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Col>
        );
    }
}

export default Order;