import React, { Component } from 'react';
import Product from './../components/product';
import { Table, Button, Row } from 'react-bootstrap';
import AuthService from './../authService';

class Products extends Component {

    constructor(props) {
        super(props);

        this.state = {
            storeId: AuthService.storeId,
            products: [],
            categories: [],
            ready: false
        };
    }

    getProducts() {
        fetch(window.$baseUrl + '/Store/Products/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ products: [...data] });
            })
            .catch(console.log);
    }

    loadData() {
        fetch(window.$baseUrl + '/Store/Categories/' + this.state.storeId)
            .then(res => res.json())
            .then((data) => {
                this.setState({ categories: [...data], ready: true });
            })
            .catch(console.log);
    }

    productDeleted(pId) {
        var index = this.state.products.findIndex(p => p.id == pId);
        if (index !== -1) {
            var newProducts = [...this.state.products];   
            newProducts.splice(index, 1);
            this.setState({ products: newProducts });
        }
    }

    componentDidMount() {
        this.loadData();
        this.getProducts();
    }

    add() {
        this.setState({ products: [{ id: 0, storeId: this.state.storeId, categoryId: this.state.categories[0].id  }, ...this.state.products] });
    }

    render() {
        return (
            <Row>
                <h2>Products</h2>
                <Table bordered>
                    <thead>
                        <tr>
                            <th style={{textAlign: 'center', fontSize: 'large'}}>Category</th>
                            <th style={{textAlign: 'center', fontSize: 'large'}}>Product</th>
                            <th style={{textAlign: 'center', fontSize: 'large'}}>Price</th>
                            <th><Button style={{width: '100%'}} variant="outline-success" onClick={() => this.add()}>Add</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.ready == true && this.state.products.map((product) => (
                            <Product key={product.id} product={product} 
                                categories={this.state.categories}
                                productDeleted={(pId) => this.productDeleted(pId)}></Product>
                        ))}
                    </tbody>
                </Table>
            </Row>
        );
    }
}

export default Products;