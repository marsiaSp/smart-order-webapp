import React, { Component } from 'react';
import { FormControl, Button } from 'react-bootstrap';

class Product extends Component {

    constructor(props) {
        super(props);

        this.state = {
            product: props.product,
            categories: props.categories,
            isDirty: false
        };

        this.productDeleted = props.productDeleted;
    }

    handleChange(type, event) {
        var newValue = event.target.value;

        if (type === 'title') {
            this.setState({ product: { ...this.state.product, title: newValue } });
        } else if (type === 'price') {
            this.setState({ product: { ...this.state.product, price: newValue } });
        } else if (type === 'category') {
            this.setState({ product: { ...this.state.product, categoryId: parseInt(newValue) } });
        }

        this.setState({ isDirty: true });
    }

    save() {
        this.state.product.price = parseFloat(this.state.product.price);
        //this.setState({ product: { ...this.state.product, price: parseFloat(this.state.product.price) } });
        var isNew = this.state.product.id <= 0;
        var path = isNew > 0 ? "Add" : "Update";

        fetch(window.$baseUrl + '/Store/Products/' + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.product)
        })
            .then(res => res.text())
            .then((data) => {
                if (isNew) {
                    this.setState({ isDirty: false, product: { ...this.state.product, id: parseInt(data) } });
                } else {
                    this.setState({ isDirty: false });
                }
            })
            .catch(console.log);
    }

    delete() {
        fetch(window.$baseUrl + '/Store/Products/Remove/' + this.state.product.id)
            .then((data) => {
                this.productDeleted(this.state.product.id);
            })
            .catch(console.log);
    }

    render() {

        return (
            <tr>
                <td>
                    <FormControl as="select" value={this.state.product.categoryId}
                        onChange={(event) => this.handleChange('category', event)}>
                        {this.state.categories.map((cat) => (
                            <option value={cat.id} key={cat.id}>{cat.name}</option>
                        ))}
                    </FormControl>
                </td>
                <td>
                    <FormControl value={this.state.product.title} onChange={(event) => this.handleChange('title', event)} />
                </td>
                <td>
                    <FormControl value={this.state.product.price} onChange={(event) => this.handleChange('price', event)} />
                </td>
                <td>
                    <Button style={{width: '48%'}} variant="outline-primary" disabled={!this.state.isDirty} onClick={() => this.save()}>Save</Button>
                    &nbsp;
                    <Button style={{width: '48%'}} variant="outline-danger" onClick={() => this.delete()}>Delete</Button>
                </td>
            </tr>
        );
    }
}

export default Product;