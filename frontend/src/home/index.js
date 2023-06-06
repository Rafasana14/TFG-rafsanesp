import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import '../App.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cat: {},
            catImage: {},
            dog: {},
            kangaroo: {},
        };
    }

    async componentDidMount() {
        const dog = await (await fetch("https://some-random-api.com/animal/dog")).json();
        this.setState({ dog: dog, });
        const cat = await (await fetch("https://some-random-api.com/animal/cat")).json();
        this.setState({ cat: cat, });
        const catImage = await (await fetch("https://cataas.com/cat?type=or&json=true")).json();
        this.setState({ catImage: catImage });

        const kangaroo = await (await fetch("https://some-random-api.com/animal/kangaroo")).json();
        this.setState({ kangaroo: kangaroo, });
    }

    render() {
        const { dog, cat, kangaroo, catImage } = this.state;
        return (
            <div>
                <Container fluid style={{ marginTop: "15px" }}>
                    <img className="home-img-title" src={"/titulo.png"} alt='title' />
                    <Row >
                        <Col xs="0" md="6" align='center'>
                            <div>
                                <img className="home-img" src={dog.image} alt='random dog' />
                                <p style={{ fontStyle: "italic" }}>{dog.fact}</p>
                            </div>
                        </Col>
                        <Col xs="12" md="6" align='center' className='my-auto' style={{ fontFamily: "sensei", fontStyle: "bold" }}>
                            <h2 >The best place to care for your pet!!</h2>
                            <h3 >We have the best vets in the city ready to help your little friends.</h3>
                        </Col>
                    </Row>
                    <Row >
                        <Col xs="12" md="6" align='center'>
                            <div>
                                <img className="home-img" src={"https://cataas.com" + catImage.url} alt='random cat' />
                                <p style={{ fontStyle: "italic" }}>{cat.fact}</p>
                            </div>
                        </Col>
                        <Col md="6" align='center'>
                            <div>
                                <img className="home-img" src={kangaroo.image} alt='random panda' />
                                <p style={{ fontStyle: "italic" }}>{kangaroo.fact}</p>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        );
    }
}
export default Home;