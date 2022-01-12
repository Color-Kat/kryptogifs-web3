import React, { useState } from "react";
import { NavBar, Welcome, Footer, Services, Transactions} from './components';

const App = () => {

  return (
    <div className="App min-h-screen">
      <div className="gradient-bg-welcome">
        <NavBar />
        <Welcome/>
      </div>

      <Services />
      <Transactions />
      
      <Footer/>
    </div>
  );
}

export default App;
