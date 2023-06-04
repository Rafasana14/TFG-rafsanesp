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
    }

    async componentDidMount() {
        const dog = await (await fetch("https://some-random-api.com/animal/dog")).json();
        this.setState({ dog: dog, });
        const cat = await (await fetch("https://some-random-api.com/animal/bird")).json();
        this.setState({ cat: cat, });
        const panda = await (await fetch("https://some-random-api.com/animal/kangaroo")).json();
        this.setState({ panda: panda, });
    }

    render() {
        const { dog, cat, panda } = this.state;
        return (
            <div>
                {/* <AppNavbar/> */}
                <Container fluid style={{ marginTop: "15px" }}>
                    <h1 className='text-center'>PetClinic</h1>
                    <Row>
                        <Col>
                            <div>
                                <img className="home-img" src={dog.image} alt='random dog' />
                                <p>{dog.fact}</p>
                            </div>
                        </Col>
                        <Col>
                            <h2>The best place to care for your pet!!</h2>
                            <h3>We have the best vets in the city ready to help your little friends.</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <img className="home-img" src={cat.image} alt='random cat' />
                                <p>{cat.fact}</p>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <img className="home-img" src={panda.image} alt='random panda' />
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