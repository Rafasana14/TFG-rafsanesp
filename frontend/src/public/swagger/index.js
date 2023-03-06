import { Component } from "react";

class SwaggerDocs extends Component() {
    constructor(props) {
        super(props);
        this.state = {
            pet: this.emptyItem,
            types: [],
            message: null,
        };
        this.handleChange = this.handleChange.bind(this);
        // this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));

        var pathArray = window.location.pathname.split('/');
        this.petId = pathArray[2];
    }

    async componentDidMount() {

    }

    render() {

    }
}

export default SwaggerDocs;