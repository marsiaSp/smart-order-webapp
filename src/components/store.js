import React, { Component } from 'react';
import AuthService from './../authService';
import { Form, FormControl, Button, InputGroup, Table, Row, Col } from 'react-bootstrap';

class Store extends Component {

    constructor(props) {
        super(props);

        this.state = {
            storeId: AuthService.storeId,
            store: {},
            categories: [],
            allCategories: [],
            selectedCategory: null,
            isDirty: false
        };
    }

    //καλεί το backend για να φέρει τα στοιχεία του καταστήματος
    loadData() {
        fetch(window.$baseUrl + '/Store/Info/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    store: {
                        name: data.name,
                        id: data.id,
                        address: data.address,
                        addressNumber: data.addressNumber,
                        tk: data.tk,
                        city: data.city,
                        lat: data.lat,
                        long: data.long
                    }
                });
            })
            .catch(console.log);

        fetch(window.$baseUrl + '/Store/Categories/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ categories: [...data] });
                this.fetchAllCategories();
            })
            .catch(console.log);
    }

    //φέρνει όλες τις κατηγορίες προϊόντων
    fetchAllCategories() {
        fetch(window.$baseUrl + '/Data/Categories')
            .then(res => res.json())
            .then((data) => {
                var notUsedCategories = data.filter(item => this.state.categories.find(c => c.id == item.id) == null);
                this.setState({ allCategories: [...notUsedCategories] });
            })
            .catch(console.log);
    }

    // διαχειρίζεται τις αλλαγές που γίνονται στο UI ενημερώνοντας το μοντέλο
    handleChange(type, event) {
        var newValue = event.target.value;

        if (type === 'name') {
            this.setState({ store: { ...this.state.store, name: newValue } });
        } else if (type === 'address') {
            this.setState({ store: { ...this.state.store, address: newValue } });
        } else if (type === 'lat') {
            this.setState({ store: { ...this.state.store, lat: newValue } });
        } else if (type === 'long') {
            this.setState({ store: { ...this.state.store, long: newValue } });
        } else if (type === 'category') {
            this.setState({ selectedCategory: newValue });
        } else if (type === 'addressNumber') {
            this.setState({ store: { ...this.state.store, addressNumber: newValue } });
        } else if (type === 'tk') {
            this.setState({ store: { ...this.state.store, tk: newValue } });
        } else if (type === 'city') {
            this.setState({ store: { ...this.state.store, city: newValue } });
        }

        this.setState({ isDirty: true });
    }

    //καλεί το backend για να σώσει τα στοιχεία του καταστήματος
    saveName() {
        this.state.store.lat = parseFloat(this.state.store.lat);
        this.state.store.long = parseFloat(this.state.store.long);

        fetch(window.$baseUrl + '/Store/UpdateInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.store)
        })
            .then(res => res.json())
            .then((data) => {
                this.setState({ isDirty: false });
            })
            .catch(console.log);
    }

    addCategory() {
        fetch(window.$baseUrl + '/Store/Categories/Add/' + this.state.selectedCategory + '/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ selectedCategory: null, categories: [...data] });
                this.fetchAllCategories();
            })
            .catch(console.log);
    }

    removeCategory(catId) {
        fetch(window.$baseUrl + '/Store/Categories/Remove/' + catId + '/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ selectedCategory: null, categories: [...data] });
                this.fetchAllCategories();
            })
            .catch(console.log);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <Form>
                <h2>Basic Information</h2>

                <Form.Group controlId="formStoreCategories">
                    <Form.Label>Name</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl value={this.state.store.name} onChange={(event) => this.handleChange('name', event)} />
                    </InputGroup>
                </Form.Group>

                <Row>
                    <Col sm={6}>
                        <Form.Group controlId="formStoreAddress">
                            <Form.Label>Address</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl value={this.state.store.address} onChange={(event) => this.handleChange('address', event)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group controlId="formStoreAddress">
                            <Form.Label>Number</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl value={this.state.store.addressNumber} onChange={(event) => this.handleChange('addressNumber', event)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <Form.Group controlId="formStoreAddress">
                            <Form.Label>City</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl value={this.state.store.city} onChange={(event) => this.handleChange('city', event)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group controlId="formStoreAddress">
                            <Form.Label>TK</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl value={this.state.store.tk} onChange={(event) => this.handleChange('tk', event)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <Form.Group controlId="formStoreAddress">
                            <Form.Label>Latitude</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl value={this.state.store.lat} onChange={(event) => this.handleChange('lat', event)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group controlId="formStoreAddress">
                            <Form.Label>Longtitude</Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl value={this.state.store.long} onChange={(event) => this.handleChange('long', event)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>


                <Row>
                    <Col sm={4}>
                        <Form.Group controlId="formStoreAddress">
                            <InputGroup className="mb-3">
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col sm={4}>
                        <Form.Group controlId="formStoreAddress">
                            <InputGroup className="mb-3">
                                <Button style={{ width: "100%" }} disabled={!this.state.isDirty} onClick={() => this.saveName()} variant="primary">Save</Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col sm={4}>
                        <Form.Group controlId="formStoreAddress">
                            <InputGroup className="mb-3">
                            </InputGroup>
                        </Form.Group>
                    </Col>

                </Row>

                <hr></hr>

                <Form.Group controlId="formStoreCategories">
                <h2>Categories</h2>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th colSpan="2">
                                    <InputGroup className="mb-3">
                                        <FormControl as="select" value={this.state.selectedCategory}
                                            onChange={(event) => this.handleChange('category', event)}>
                                            <option value={null} key={null}>Select a Category to add</option>
                                            {this.state.allCategories.map((cat) => (
                                                <option value={cat.id} key={cat.id}>{cat.name}</option>
                                            ))}
                                        </FormControl>
                                        <InputGroup.Append>
                                            <Button
                                                disabled={this.state.selectedCategory == null}
                                                onClick={() => this.addCategory()} variant="success">
                                                Add
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.categories.map((category) => (
                                <tr>
                                    <td style={{ width: "60px" }}>
                                        <Button variant="danger" onClick={() => this.removeCategory(category.id)}>X</Button>
                                    </td>
                                    <td>
                                        {category.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form.Group>

            </Form>
        );
    }

}

export default Store;