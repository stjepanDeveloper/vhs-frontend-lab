// src/components/ItemDetails.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* Povuci podatke o individualno item-u sa API-a */
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/vhs/${id}`)
      .then(response => {
        setItem(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Nije moguce dohvatiti detalje za VHS predmet id: ${id}:`, error);
        setError('Neuspjesno dohvacanje VHS detalja.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    axios.delete(`http://localhost:3000/api/vhs/${id}`)
      .then(() => {
        alert('VHS predmet je uspjesno obrisan!');
        navigate('/');  // Vrati na homepage nakon uspjesnog brisanja item-a
      })
      .catch(error => {
        console.error('Nije moguce obrisati VHS predmet:', error);
        alert('Neuspjesno brisanje VHS predmeta!');
      });
  };

  /* IF blok u slucaju da VHS predmet nije uspjesno povucen sa API-a */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!item) return <p>No item found.</p>;

  return (
    <div className="vhs-form-container">
  <div className="header-bar">
    <div className='header-icon'>
    </div>
    <div className="header-content">VHS Details</div>
  </div>
  <div className='item-details-content'>
    
    {/* Ternarni operator za vracanje detalja o predmetu/itemu; */}
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    {item ? (
      <>
        <h1>{item.title}</h1>
        <img src={item.thumbnail ? `http://localhost:3000/public/images/vhs-thumbnails/${item.thumbnail.split('\\').pop()}` : '/path/to/default-image.jpg'} 
        alt={item.title}
        className="item-thumbnail"/>
        <p>{item.description}</p>
        <p>Genre: {item.genre}</p>
        <p>Duration: {item.duration} minutes</p>
        <p>Released At: {item.releasedAt}</p>
        <p>Rental Price: ${item.rentalPrice}</p>
        <p>Rental Duration: {item.rentalDuration} days</p>
        <p>Quantity: {item.quantity}</p>
        <div className="item-details-actions">
          <Link to={`/edit/${item.id}`}>
            <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" className='edit-button'>
            <path d="M21.5 0C9.62587 0 0 9.62587 0 21.5C0 33.3741 9.62587 43 21.5 43C33.3741 43 43 33.3741 43 21.5C43 9.62587 33.3741 0 21.5 0ZM16.3717 7.91551H30.5073V14.0805L31.3918 13.1987L35.7774 17.5816L25.421 27.9405L18.928 30.0507L21.0355 23.555L28.1321 16.4583V10.2776H18.1039V14.5319H13.6317V32.7224H28.1321V28.8014L30.5073 26.4236V35.0845H11.2539V12.8575L16.3717 7.91551ZM22.1325 24.6494L21.0775 27.8986L24.324 26.8435L22.1325 24.6494Z" fill="#39FF14"/>
            </svg>

          </Link>

          <Link to="/">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className='home-button'>
            <path d="M37.0709 6.67326C33.0938 2.52422 27.5904 0.288471 21.8721 0.374462C16.1537 0.288471 10.6718 2.52422 6.69476 6.67326C2.52422 10.6503 0.288471 16.1537 0.374462 21.8721C0.288471 27.5904 2.52422 33.0723 6.67326 37.0494C10.6503 41.2199 16.1537 43.4557 21.8721 43.3697C27.5904 43.4557 33.0723 41.2199 37.0494 37.0709C41.2199 33.0938 43.4557 27.5904 43.3697 21.8721C43.4557 16.1537 41.2199 10.6503 37.0709 6.67326ZM32.6209 21.8721V34.7706H25.0967V24.0218H18.6474V34.7706H11.1233V21.8721H6.82374L21.8721 6.82374L37.9953 21.8721H32.6209Z" fill="#39FF14"/>
            </svg>

          </Link>

          <button onClick={() => handleDelete(item.id)} className='delete-button'>
             <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.14286 33.7778C2.14286 36.1 4.07143 38 6.42857 38H23.5714C25.9286 38 27.8571 36.1 27.8571 33.7778V8.44444H2.14286V33.7778ZM7.41429 18.7467L10.4357 15.77L15 20.2456L19.5429 15.77L22.5643 18.7467L18.0214 23.2222L22.5643 27.6978L19.5429 30.6744L15 26.1989L10.4571 30.6744L7.43571 27.6978L11.9786 23.2222L7.41429 18.7467ZM22.5 2.11111L20.3571 0L9.64286 0L7.5 2.11111H0L0 6.33333H30V2.11111H22.5Z" fill="#39FF14"/>
            </svg>

          </button>
          
        </div>
      </>
    ) : <p>No item found.</p>}
  </div>
  <div className="footer-bar">
    <div className="footer-content">Made by stjepanDeveloper © {new Date().getFullYear()}</div>
  </div>
</div>
)};


export default ItemDetails;