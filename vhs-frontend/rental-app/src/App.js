//App.js

/* Import komponenti za rad aplikacije */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalogue from './components/Catalogue';
import ItemDetails from './components/ItemDetails';
import VHSForm from './components/VHSForm';
import EditVHSForm from './components/EditVHSForm';

function App() {
  return (
    /*Postavljanje i povezivanje React rutera i ruta sa komponentama */
    <Router>
      <div>
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/vhs/:id" element={<ItemDetails />} />
            <Route path="/new" element={<VHSForm />} />
            <Route path="/edit/:id" element={<EditVHSForm />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
