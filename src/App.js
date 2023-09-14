import React from 'react';
import './App.css';
import ImageToPDFConverter from './Components/ImageToPDFConverter'

function App() {
  return (
    <div className="App">
      <div className="containerApp">
        <h1 className="headlineImage">PDF Converter</h1>
      <ImageToPDFConverter />
      </div>
    </div>
  );
}

export default App;
