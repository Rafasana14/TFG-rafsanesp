import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import '../App.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bird: {},
            cat: {},
            dog: {},
            panda: {},
        };
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
    }

    async componentDidMount() {
        const bird = await (await fetch("https://some-random-api.ml/animal/bird")).json();
        this.setState({ bird: bird, });
        const dog = await (await fetch("https://some-random-api.ml/animal/dog")).json();
        this.setState({ dog: dog, });
        const cat = await (await fetch("https://some-random-api.ml/animal/cat")).json();
        this.setState({ cat: cat, });
        const panda = await (await fetch("https://some-random-api.ml/animal/red_panda")).json();
        this.setState({ panda: panda, });
    }

    render() {
        const { bird, dog, cat, panda } = this.state;
        return (
            <div>
                {/* <AppNavbar/> */}
                <Container fluid style={{ marginTop: "15px" }}>
                    <h1 className='text-center'>PetClinic</h1>
                    <Row>
                        <Col>
                            <div>
                                <img style={{ maxHeight: "300px" }} src={dog.image} alt='random dog' />
                                <p>{dog.fact}</p>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <img style={{ maxHeight: "300px" }} src={bird.image} alt='random dog' />
                                <p>{bird.fact}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <img style={{ maxHeight: "300px" }} src={cat.image} alt='random dog' />
                                <p>{cat.fact}</p>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <img style={{ maxHeight: "300px" }} src={panda.image} alt='random dog' />
                                <p>{panda.fact}</p>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        );
    }
}
export default Home;