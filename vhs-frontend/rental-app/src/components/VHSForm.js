// src/components/VHSForm.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/VHSForm.css';
import {Link, useNavigate} from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL;




function VHSForm() {

  /* Postavljanje state-ova za polja iz zadatka */

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    releasedAt: '',
    rentalPrice: '',
    rentalDuration: '',
    quantity: '',
    thumbnail: null,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate(); 
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let adjustedValue = value;

    const numericFields = ['movieDuration', 'rentalPrice', 'rentalDuration', 'quantity', 'releasedAt'];

    if (numericFields.includes(name) && value.trim() === '') {
      adjustedValue = null;  // Postavlja se na null u slucaju da vrati prazni string da nebi doslo do greske u DB
    }

    console.log(`Primjeni handleChange za ${name}: `, adjustedValue); // Logiraj vrijednost

    setFormData({
      ...formData,
      [name]: adjustedValue,
    });
  };

  const handleFileChange = (e) => {
    console.log("Saljem VHS predmet: ", e.target.files[0]); // Logiraj file koji se upload-a
    setFormData({
      ...formData,
      thumbnail: e.target.files[0],
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logiraj form podatke prije slanja
    console.log("Form podaci na submit: ", formData);

    const requiredFields = ['title', 'description', 'genre', 'duration', 'releasedAt', 'rentalPrice', 'rentalDuration', 'quantity'];
    let isValid = true;

    for (let field of requiredFields) {
      if (!formData[field] || formData[field] === '') {
        setError(`Molimo popunite polje : ${field}.`); // Azuriranje error state-a da se pokaze relevantni error message
        console.log(`Greska: ${field} je potrebno!`); // Logiraj koje polje fali
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      console.log("Predaja forma je zaustavljena zbog gresaka u validaciji.");
      return; // Prekini slanje form-a i izadji iz funkcije u slucaju da validacija ima greske
    }

    /* Popuni podatke u DB */
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(`${API_URL}/vhs`, data);
      console.log("Server response: ", response); // Logiraj response sa servera
      if (window.confirm('VHS predmet je uspjesno kreiran! Da li se zelite vratiti na HomePage?')) {
        navigate('/');  // Nakon sto se uspjesno napravi form odvedi korisnika na homepage
      }
      setError(''); // Ocisti sve prosle error-e
    } catch (error) {
      console.error('Dogodila se greska kod kreiranja VHS predmeta!', error);
      setError('Nije moguce kreirati VHS predmet. Molimo pokusajte ponovo.');
    }
  };

  return (

      <div className="vhs-form-container">
        <div className="header-bar">
            <div className='header-icon'>
              <Link to="/">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5813 1.20006C22.5511 0.42387 23.7563 0.000976563 24.9984 0.000976562C26.2406 0.000976563 27.4458 0.42387 28.4156 1.20006L44.8219 14.3251C46.1188 15.3626 46.875 16.9344 46.875 18.5969V40.5313C46.875 41.9817 46.2988 43.3727 45.2732 44.3983C44.2477 45.4239 42.8567 46.0001 41.4062 46.0001H33.5938C32.9721 46.0001 32.376 45.7531 31.9365 45.3136C31.4969 44.874 31.25 44.2779 31.25 43.6563V27.2501H18.75V43.6563C18.75 44.2779 18.5031 44.874 18.0635 45.3136C17.624 45.7531 17.0279 46.0001 16.4062 46.0001H8.59375C7.14335 46.0001 5.75235 45.4239 4.72676 44.3983C3.70117 43.3727 3.125 41.9817 3.125 40.5313V18.5938C3.125 16.9344 3.88125 15.3626 5.17812 14.3251L21.5813 1.20006Z" fill="#00CFFD"/>
                </svg>
              </Link>
            </div>
            <div className="header-content">Make your VHS</div>
        </div>
        <div className='columns-container'>
            <div className="column column-left">
                <div className="input-group">
                    <div className="label movie-title-label">Movie Title</div>
                    <div className="input-area movie-title">
                        <input
                        type="text"
                        className="input-area"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        placeholder="Type here..."
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label movie-genre-label">Movie Genre</div>
                    <div className="input-area movie-genre">
                        <input
                          type="text"
                          className="input-area"
                          name="genre"
                          value={formData.genre || ''}
                          onChange={handleChange}
                          placeholder="Type here..."
                      />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label description-label">Description</div>
                    <div className="input-area description">
                        <textarea
                          className="input-area"
                          type="text"
                          name="description"
                          value={formData.description || ''}
                          onChange={handleChange}
                          placeholder="Type here..."
                      />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label movie-duration-label">Movie duration (minutes)</div>
                    <div className="input-field movie-duration">
                        <input
                          type="number"
                          className="input-field"
                          name="duration"
                          value={formData.duration || ''}
                          onChange={handleChange}
                          placeholder="e.g., 26"
                      />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label year-of-release-label">Year of release</div>
                    <div className="input-area year-of-release">
                        <input
                          type="number"
                          className="input-area"
                          name="releasedAt"
                          value={formData.releasedAt || ''}
                          onChange={handleChange}
                          placeholder="YYYY"
                          min="1900" 
                          max="2099"
                      />
                    </div>
                </div>
            </div>
            <div className="column column-right">
                <div className="input-group">
                    <div className="label rental-price-label">Rental price</div>
                    <div className="input-field rental-price">
                        <input
                          type="number"
                          className="input-field"
                          name="rentalPrice"
                          value={formData.rentalPrice || ''}
                          onChange={handleChange}
                          placeholder="e.g., 26"
                      />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label rental-duration-label">Rental duration</div>
                    <div className="input-field rental-duration">
                        <input
                          type="number"
                          className="input-field"
                          name="rentalDuration"
                          value={formData.rentalDuration || ''}
                          onChange={handleChange}
                          placeholder="e.g., 26"
                      />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label quantity-label">Quantity</div>
                    <div className="input-field quantity">
                        <input
                          type="number"
                          className="input-field"
                          name="quantity"
                          value={formData.quantity || ''}
                          onChange={handleChange}
                          placeholder="e.g., 26"
                      />
                    </div>
                </div>
                <div className="input-group">
                    <div className="label upload-thumbnail-label">Upload a thumbnail
                    <svg onClick={triggerFileSelect} className="upload-icon" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1V24H23V4.11743H8.54778L6.45481 1H1ZM1 8.77027H23Z" fill="#FF00A6"/>
                    <path d="M1 8.77027H23M1 1V24H23V4.11743H8.54778L6.45481 1H1Z" stroke="#FFEC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange} // koristi handleFileChange funkciju nakon selekcije thumbnaila 
                    />
                    </div>
                </div>
            </div>
        </div>


        <div className='submit-button-container'>
          {/* Submit Gumb */}
          <div className="submit-button" onClick={handleSubmit}>
            <div style={{
              width: 106, 
              height: 40, 
              padding: '8px 20px', 
              background: '#00CFFD', 
              borderRadius: 8, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              color: '#FFEC00', 
              fontSize: 20, 
              fontFamily: 'ArcadeClassic', 
              fontWeight: '400'
            }}>
              Submit
            </div>
          </div>
        </div>
        


        <div className="footer-bar">
            <div className="footer-content">Made by stjepanDeveloper © {new Date().getFullYear()}</div>
        </div>
    </div>
  );
}

export default VHSForm;