// src/components/EditVHSForm.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

function EditVHSForm() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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

  /* Pristupi i popuni polja sa podacima sa DB za speficini VHS predmet preko id-a */

  useEffect(() => {
    axios.get(`http://localhost:3000/api/vhs/${id}`)
      .then(response => {
        const data = response.data;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          genre: data.genre || '',
          duration: data.duration || '',
          releasedAt: data.releasedAt || '',
          rentalPrice: data.rentalPrice || '',
          rentalDuration: data.rentalDuration || '',
          quantity: data.quantity || '',
          thumbnail: data.thumbnail || null,
        });
      })
      .catch(error => {
        console.error('Nije moguce ucitati VHS podatke:', error);
        alert('Neuspjesno ucitavanje VHS detalja!!');
      });
  }, [id]);

  /* Azuriraj state kada korisnik stupi u interakciju sa input poljem */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState, // Kopiraj sva ostala polja 
      [name]: value, // Dinamicni kljuc za promjenu polja koje je korisnik promijenio 
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      thumbnail: e.target.files[0],
    }));
  };

  /* Otvori meni za izbor podatka za thumbnail */
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };


  /* Napravi update forma i promijenjenih polja preko PATCH requesta */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.patch(`http://localhost:3000/api/vhs/${id}`, data);
      alert('Uspjesno azuriran VHS predmet!');
      navigate('/'); // Vrati na homepage nakon uspjesnog edita predmeta
    } catch (error) {
      console.error('Dogodila se greska kod azuriranja VHS predmeta:', error);
      alert('Neuspjesan update VHS predmeta.');
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
            <div className="header-content">Edit your VHS</div>
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
                    onChange={handleFileChange} // Koristi postojecu funckiju za upload thumbnaila
                    />
                    </div>
                </div>
            </div>
        </div>


        <div className='submit-button-container'>
          {/* Submit Button */}
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

export default EditVHSForm;