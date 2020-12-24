import React, { Component } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

class OrderBody extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: props.order
        };
    }

    //στρογγυλοποιεί (στα δύο δεκαδικά) τη τιμή
    roundNumber(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    render() {

        return (
            <Card.Text style={{ height: '160px', overflowY: 'auto' }}>
                {this.state.order.orderItems.map((oi) => (
                    <div key={oi.id}>
                        <span>{oi.quantity} {oi.menuitem.title}
                            <span style={{ float: 'right' }}>{this.roundNumber(oi.menuitem.price * oi.quantity)}€</span>
                        </span>
                    </div>
                ))}
            </Card.Text>
        );
    }
}

export default OrderBody;