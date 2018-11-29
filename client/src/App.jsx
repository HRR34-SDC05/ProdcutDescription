import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import normalizePort from 'normalize-port';

import Features from './components/Features.jsx';
import TechSpecs from './components/TechSpecs.jsx';
import config from '../../config.json'

const environment = config.currentEnvironment;
const host = config[environment].svc_host;
const port = normalizePort(process.env.PORT || '8081');


class Productdescriptions extends React.Component {
  constructor() {
    super();
    this.state = {
      view: "Features",
      descriptions: [],
      product: []
    }
  }

  componentDidMount(){
    let id = window.location.pathname.replace(/\/product\//,'');
    let instance = axios.create({baseURL:`http://${host}:${port}`})
    instance
      .get(`/product/data/` + id)
      .then(productData => {
        this.setState({ product: productData.data[0] })
      })
      .catch(err => { console.log("Error with server side fetch request",err); })
  }
  changeView(){
    if(this.state.view === "Features"){
      this.setState({
        view:"TechSpecs"
      })
    } else{
      this.setState({
        view:"Features"
      })
    }
  }

  renderView() {
    const {view} = this.state;
    if(view === "Features") {
      return <Features features={this.state.product.features}/>
    }else if (view === "TechSpecs") {
      return <TechSpecs techSpecs={this.state.product.tech_specs}/>
    }
  }
  render() {
    return(
      <div>
      <p className="nittyGritty"><strong>The nitty gritty</strong></p>
      <div className="tabs">
      <button id="switchState"
        onClick={() => this.changeView()}>
        {this.state.view}
      </button>
      {this.renderView()}
      </div>
      </div>
    );
  }
}



//ReactDOM.render(< Productdescriptions />, document.getElementById('productDescriptions'));

export default Productdescriptions;
