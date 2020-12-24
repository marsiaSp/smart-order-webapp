import React, { Component } from 'react';
import Order from './order';
import { Row } from 'react-bootstrap';
import AuthService from '../authService';
import ReactNotifications from 'react-browser-notifications';

class Orders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            storeId: AuthService.storeId,
            pendingOrders: [],
            inProgressOrders: []
        };
    }

    //φέρνει απο τα APIs τις παραγγελίες και τις βάζει στο state του component
    getOrders() {
        fetch(window.$baseUrl + '/Order/Pending/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ pendingOrders: [...data] });
                this.startTimer();
            })
            .catch(console.log);

        fetch(window.$baseUrl + '/Order/InProgress/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ inProgressOrders: [...data] });
            })
            .catch(console.log);
    }

    //εκκινεί έναν timer για να ελέγχει αν υπάρχουν νέες παραγγελίες
    startTimer() {
        this.intervalId = setTimeout(() => {
            this.checkForNew();
        }, 2000);
    }

    //συνάρτηση που ρωτάει το API αν υπάρχει νέα παραγγελία
    //αν υπάρχει δείχνει notification και ξαναζητάει τις παραγγελίες
    //αν δεν εχει έρθει παραγγελία, ενεργοποιεί ξανά τον timer
    checkForNew() {
        fetch(window.$baseUrl + '/Order/HasNew/' + this.state.storeId + "/" + this.state.pendingOrders.length)
            .then(res => res.json())
            .then((data) => {
                if (data === true) {
                    this.n.show();
                    this.getOrders();
                } else {
                    this.startTimer();
                }
            })
            .catch(console.log);
    }
    //η συνάσρτηση καλείται απο το react μόλις το component ετοιμαστεί 
    componentDidMount() {
        this.getOrders();
    }
    //αντιστοιχα οταν καταστρέφει το component (πχ αλλαγή σελίδας)
    //καθαρίζει το timeout λωστε να μη γινει trigger μετά τον "θάνατο" toy component
    componentWillUnmount(){
        clearTimeout(this.intervalId);
    }

    handleNotificationClick() {

    }

    //έχει φτιαχτεί ένα component για την παραγγελία 
    //για κάθε pending order φτιάξε μου ένα component 
    //TO DO DELETE ROW
    render() {
        return [
            <Row><h3>Pending [{this.state.pendingOrders.length}]</h3></Row>,
            <Row>
                {this.state.pendingOrders.map((order) => (
                    <Order key={order.id} order={order}  orderStatusChanged={() => this.getOrders()}></Order>
                ))}
            </Row>,
            <br></br>,
            <hr></hr>,
            <br></br>,
            <Row><h3>In progress [{this.state.inProgressOrders.length}]</h3></Row>,
            <Row>
                {this.state.inProgressOrders.map((order) => (
                    <Order key={order.id} order={order} orderStatusChanged={() => this.getOrders()}></Order>
                ))}
            </Row>,

            <br></br>,
            <br></br>,

            <ReactNotifications
                onRef={ref => (this.n = ref)} // Required
                title="Hey There!" // Required
                body="New order arrived!"
                icon="icon.png"
                tag="abcdef"
                timeout="5000"
                onClick={event => this.handleNotificationClick(event)}
            />
        ];
    }
}


export default Orders;