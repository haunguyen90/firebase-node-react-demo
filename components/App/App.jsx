import React from 'react';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Footer/Footer.js';

class App extends React.Component {
  render() {
    return (
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Navbar history={this.props.history} />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default App;