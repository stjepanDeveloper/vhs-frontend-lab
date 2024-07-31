// src/components/Catalogue.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Catalogue.css';
import { Link } from 'react-router-dom';

const Catalogue = () => {
  /* Inicijalizacija state-ova za komponentu */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');



  /* Dohvacanje podataka sa API-a */

 useEffect(() => {
  setLoading(true);
  axios.get(`http://localhost:3000/api/vhs?page=${currentPage}&limit=${itemsPerPage}`)
    .then(response => {
      console.log('API response:', response.data); // Logiraj response sa API-a
      if (Array.isArray(response.data)) {  // Provjeri da li su podaci u obliku niza
        setItems(response.data);
      } else {
        setItems([]); // Fallback u slucaju da podaci nisu u obliku niza
        console.error('Ocekivani items array u response, primljeno:', response.data);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Neuspjesan fetch VHS kataloga:', error);
      setError('Neuspjesno ucitavanje VHS predmeta.');
      setLoading(false);
    });
}, [currentPage, itemsPerPage]);

  // Izracunaj ukupni broj stranica 
  const pageCount = Array.isArray(items) && items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 0;

  // Listanje stranica 
  const handlePageChange = (newPage) => {
    console.log('Promijeni stranicu:', newPage);
    setCurrentPage(newPage);
  };

  // Funkcija za pretrazivanje postojecih VHS item-a
  const handleSearchChange = (e) => {
  setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchQuery)); // Prodji preko niza VHS predmeta i napravi novi niz koji sadrzi searchQuery u title property

/* Uvjetni check u slucaju da se nemogu vratiti elementi */

if (loading) {
return <p>Loading...</p>; // Ako se stranica ucitava dulje 
}

if (error) {
  return <p>Error: {error}</p>; // Ako naletimo na error vrati error log
}

if (!items) {
  return <p>No items found.</p>; // Ako se naleti na unidentified item
}


  return (
    <div className='catalogue-container'>
      {/* Header */}
      <div className='header'>
        <div className='header-title'>
          VHS Rental
        </div>
        {/* SVG Logo Ikona */}
        <svg width="65" height="39" viewBox="0 0 65 39" fill="none" xmlns="http://www.w3.org/2000/svg" className='svg-logo'>
          <path d="M6.83329 0.25C5.13149 0.25 3.49938 0.926039 2.29602 2.1294C1.09267 3.33276 0.416626 4.96486 0.416626 6.66667V32.3333C0.416626 34.0351 1.09267 35.6672 2.29602 36.8706C3.49938 38.074 5.13149 38.75 6.83329 38.75H58.1666C59.8684 38.75 61.5005 38.074 62.7039 36.8706C63.9073 35.6672 64.5833 34.0351 64.5833 32.3333V6.66667C64.5833 4.96486 63.9073 3.33276 62.7039 2.1294C61.5005 0.926039 59.8684 0.25 58.1666 0.25H6.83329ZM8.56579 13.0833H16.4583V25.9167H8.56579C7.44288 23.9596 6.83329 21.7458 6.83329 19.5C6.83329 17.2542 7.44288 15.0404 8.56579 13.0833ZM22.875 13.0833H42.125V25.9167H22.875V13.0833ZM48.5416 13.0833H56.4341C57.557 15.0404 58.1666 17.2542 58.1666 19.5C58.1666 21.7458 57.557 23.9596 56.4341 25.9167H48.5416V13.0833Z" fill="#00CFFD"/>
        </svg>
        {/* SVG Ikona za pretrazivanje */}
        <div onClick={() => setShowSearch(!showSearch)} className='search-icon' >
          <svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.1826 11.4521L13.3391 13.9307V3.79688L8.58261 20.5225L13.3391 18.3955V29.8477L19.1826 11.4521ZM11.9478 2.95312L11.8348 3.36621L10.513 8.01562C7.0087 9.37793 4.52174 12.8145 4.52174 16.8311C4.52174 21.4277 7.50435 25.2598 11.7739 26.1035V30.8145C5 29.8916 0 23.9414 0 16.8398C0 9.76465 5.2 3.90234 11.9478 2.95312ZM39.0261 42.2578C38.0522 43.2422 37.0174 43.3389 36.5391 43.1807C36.0696 43.0225 34.1826 41.4316 31.287 39.2783C28.3913 37.1162 28.3652 36.1406 27.5478 34.2949C26.7304 32.458 24.9043 30.5508 22.5478 29.6895L21.7043 28.3975C19.5565 29.8828 17.0957 30.7617 14.6348 30.9199L14.8174 30.3398L16.2 25.9893C20.2435 24.9434 23.2348 21.2432 23.2348 16.8311C23.2348 12.041 19.8957 7.85742 14.887 7.41797V2.83887C22.1217 3.28711 27.8261 9.38672 27.8261 16.8398C27.8261 19.793 26.8522 22.5264 25.3043 24.7852L26.5739 25.6289C27.4261 28.0107 29.313 29.8477 31.1304 30.6738C32.9478 31.5 33.9304 31.5264 36.0696 34.4531C38.2087 37.3711 39.7826 39.2783 39.9391 39.7529C40.0957 40.2275 40 41.2734 39.0261 42.2578ZM38.1652 40.6846C38.1652 40.2979 37.8522 39.9814 37.4696 39.9814C37.087 39.9814 36.7739 40.2979 36.7739 40.6846C36.7739 41.0713 37.087 41.3877 37.4696 41.3877C37.8522 41.3877 38.1652 41.0713 38.1652 40.6846Z" fill="#FFEC00"/>
          </svg>
        </div>
        {showSearch && (
        <input 
          type="text"
          placeholder="Search titles..."
          value={searchQuery}
          onChange={handleSearchChange} // Kada se upise nesto u input zapocni pretragu VHS kataloga
          className="search-input"
        />
        )}
        <div className='contact-button'>
            <a href="mailto:example@example.com" className='contact-link'>
              Contact
            </a>
        </div>
      </div>

      
    <div className='console-display'>
    

    {/* Lijevi SVG konzola */}
      <div className='left-pane'>
        <svg width="400" height="500" viewBox="0 0 400 537" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.9133 37.8049C36.1639 15.5494 56.2023 0 79.0689 0H271.196V537H79.9784C56.6923 537 36.4402 520.931 31.4255 498.192C-7.16828 323.184 -13.4718 225.938 30.9133 37.8049Z" fill="white"/>
        <path d="M270.5 139C253.494 139 236.654 142.35 220.943 148.858C205.231 155.366 190.955 164.904 178.93 176.93C166.904 188.955 157.366 203.231 150.858 218.942C144.35 234.654 141 251.494 141 268.5C141 285.506 144.35 302.346 150.858 318.058C157.366 333.769 166.904 348.045 178.93 360.07C190.955 372.096 205.231 381.634 220.943 388.142C236.654 394.65 253.494 398 270.5 398L270.5 268.5V139Z" fill="#201313"/>
        </svg>
      </div>


    {/* Glavni meni */}
    <div className='catalogue-menu-group-centered'>
      
      {/* Ekran element*/}
        <div className='pane-title'>
          Check out our catalogue
        </div>

      {/* Separacijska linija */}
        <div className='separator-line'></div>

      {/* Izlistavanje VHS item-a */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
            <ul className='item-list'>
          {filteredItems.slice(0, itemsPerPage).map(item => ( // Napravi slice niza da samo vrati ItemsPerPage elemente
            <li key={item.id}>
              <Link to={`/vhs/${item.id}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        )}
        <Link to="/new" className='add-vhs-icon'>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_171_123)">
          <path d="M25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0ZM18.7073 9.24683H33.9417V19.4305H31.3813V11.792H20.575V16.3788H15.7532V35.9863H27.9785V38.5315H13.1897V14.5721L18.7073 9.24683ZM30.2429 21.6614H34.9518V27.7405H41.034V32.4524H34.9518V38.5315H30.2429V32.4524H24.1638V27.7405H30.2429V21.6614Z" fill="#39FF14"/>
          </g>
          <defs>
          <clipPath id="clip0_171_123">
          <rect width="50" height="50" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        </Link>
        </div>

        {/* Desni SVG konzola */}

      <div className='right-pane'>
        <svg width="400" height="500" viewBox="0 0 402 537" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M370.282 499.195C365.032 521.451 344.993 537 322.127 537L130 537L130 -0.000128031L321.217 -0.000128031C344.503 -0.000128031 364.756 16.0684 369.77 38.808C408.364 213.816 414.668 311.062 370.282 499.195Z" fill="white"/>
        <path d="M129.5 393C146.506 393 163.346 389.65 179.058 383.142C194.769 376.634 209.045 367.096 221.07 355.07C233.096 343.045 242.634 328.769 249.142 313.058C255.65 297.346 259 280.506 259 263.5C259 246.494 255.65 229.654 249.142 213.942C242.634 198.231 233.096 183.955 221.07 171.93C209.045 159.904 194.769 150.366 179.058 143.858C163.346 137.35 146.506 134 129.5 134V263.5L129.5 393Z" fill="#201313"/>
        </svg>
      </div>
    </div>
  


    {/* Paginacijske kontrole */}  

      <div className='pagination-controls'>
        {/* Lijevo */}
        <svg onClick={() => handlePageChange(currentPage - 1)} 
         className={currentPage === 1 ? 'arrow-disabled' : 'arrow-active'}
         width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}>
          <path d="M27.7778 50H22.2222V47.2222H19.4444V44.4444H16.6667V41.6667H13.8889V38.8889H11.1111V36.1111H8.33333V33.3333H5.55556V30.5556H2.77778V27.7778H0V22.2222H2.77778V19.4444H5.55556V16.6667H8.33333V13.8889H11.1111V11.1111H13.8889V8.33333H16.6667V5.55556H19.4444V2.77778H22.2222V0H27.7778V13.8889H50V36.1111H27.7778V50ZM22.2222 38.8889V30.5556H44.4444V19.4444H22.2222V11.1111H19.4444V13.8889H16.6667V16.6667H13.8889V19.4444H11.1111V22.2222H8.33333V27.7778H11.1111V30.5556H13.8889V33.3333H16.6667V36.1111H19.4444V38.8889H22.2222Z" fill="#FFEC00"/>
        </svg>

        {/* Indikator stranice */}
          <span>Page {currentPage} of {pageCount}</span>

        {/* Desno */}
        <svg onClick={() => handlePageChange(currentPage + 1)} 
         className={currentPage === pageCount ? 'arrow-disabled' : 'arrow-active'}
         width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={{ cursor: currentPage === pageCount ? 'default' : 'pointer' }}>
          <path d="M22.2222 0H27.7778V2.77778H30.5556V5.55556H33.3333V8.33333H36.1111V11.1111H38.8889V13.8889H41.6667V16.6667H44.4444V19.4444H47.2222V22.2222H50V27.7778H47.2222V30.5556H44.4444V33.3333H41.6667V36.1111H38.8889V38.8889H36.1111V41.6667H33.3333V44.4444H30.5556V47.2222H27.7778V50H22.2222V36.1111H0V13.8889H22.2222V0ZM27.7778 11.1111V19.4444H5.55556V30.5556H27.7778V38.8889H30.5556V36.1111H33.3333V33.3333H36.1111V30.5556H38.8889V27.7778H41.6667V22.2222H38.8889V19.4444H36.1111V16.6667H33.3333V13.8889H30.5556V11.1111H27.7778Z" fill="#FFEC00"/>
        </svg>
      </div>

      {/* Cookie Ikona */}
      <div className='cookie-icon'>
        <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.6875 33.5C0.6875 55.2734 15.3828 66.3125 33.5 66.3125C51.6172 66.3125 66.3125 55.2031 66.3125 33.5C66.3125 11.3984 51.6172 0.6875 33.5 0.6875C15.3828 0.6875 0.6875 11.0703 0.6875 33.5Z" fill="#00CFFD"/>
        <path d="M42.6173 15.4999L44.0704 15.5937C44.3867 15.6144 44.7036 15.5673 45.0002 15.4557C45.2968 15.344 45.5661 15.1704 45.7902 14.9463C46.0143 14.7222 46.188 14.4529 46.2996 14.1563C46.4113 13.8597 46.4583 13.5427 46.4376 13.2265L46.3439 11.7968C46.3095 11.2085 46.1325 10.6374 45.8282 10.1327C45.3835 9.42915 44.705 8.90484 43.912 8.65194C43.119 8.39903 42.2623 8.43373 41.4923 8.74992C39.6173 9.54679 38.8204 11.7499 39.7111 13.5546C40.2501 14.7265 41.3986 15.4062 42.6173 15.4999ZM59.0939 30.2421L59.1876 28.789C59.2083 28.4728 59.1613 28.1558 59.0496 27.8592C58.938 27.5626 58.7643 27.2933 58.5402 27.0692C58.3161 26.8451 58.0468 26.6714 57.7502 26.5598C57.4536 26.4482 57.1366 26.4011 56.8204 26.4218L55.3907 26.5155C54.8282 26.539 54.2423 26.7265 53.7267 27.0312C53.0231 27.4759 52.4988 28.1544 52.2459 28.9474C51.993 29.7404 52.0277 30.5972 52.3439 31.3671C53.1407 33.2421 55.3439 34.039 57.1485 33.1484C58.3204 32.6093 59.0001 31.4609 59.0939 30.2421ZM20.8907 53.4687L21.0079 51.664C21.1017 50.164 21.9689 48.7577 23.422 48.0312C23.9538 47.7632 24.5352 47.6076 25.1298 47.5741C25.7245 47.5407 26.3196 47.6301 26.8781 47.8368C27.4367 48.0435 27.9466 48.3631 28.3763 48.7756C28.8059 49.1881 29.1459 49.6846 29.3751 50.2343C30.1954 52.203 29.4689 54.4999 27.6642 55.6249C27.0079 56.0234 26.3048 56.2343 25.6017 56.2812L23.8204 56.3984C22.1564 56.5155 20.7736 55.1327 20.8907 53.4687ZM43.8126 31.6015L43.8829 30.5234C44.1173 26.9843 41.1876 24.0546 37.6251 24.2655L36.5704 24.3359C35.5157 24.3827 34.4611 24.6874 33.4767 25.2734C32.0641 26.1118 30.9988 27.4288 30.4742 28.9855C29.9496 30.5422 30.0004 32.2353 30.6173 33.7577C32.1407 37.4843 36.4767 39.0546 40.0157 37.2968C42.3126 36.1952 43.672 33.9687 43.8126 31.6015ZM13.9298 17.0937L14.0001 18.078C14.1407 20.2109 15.3829 22.2265 17.4454 23.2577C20.6564 24.8515 24.5939 23.4218 25.9767 20.0468C27.1251 17.2109 26.0236 13.8827 23.3751 12.3359C22.5185 11.8339 21.5541 11.5445 20.5626 11.4921L19.6017 11.4218C16.3907 11.2109 13.7423 13.8827 13.9298 17.0937ZM52.8595 49.4843L52.9064 50.328C53.0939 53.0702 50.797 55.3671 48.0548 55.1796L47.2345 55.1327C46.4142 55.0858 45.5939 54.8515 44.8204 54.4062C43.724 53.7552 42.8967 52.7332 42.4883 51.5253C42.0799 50.3173 42.1174 49.003 42.5939 47.8202C42.8718 47.1418 43.2869 46.5281 43.813 46.0175C44.3392 45.5069 44.9651 45.1105 45.6516 44.8531C46.3381 44.5957 47.0703 44.4828 47.8025 44.5215C48.5346 44.5602 49.2509 44.7497 49.9064 45.078C51.6876 45.9218 52.7423 47.6327 52.8595 49.4843ZM9.75792 35.6562L9.85167 37.1093C9.92199 38.328 10.6251 39.4765 11.797 40.0155C13.6017 40.9062 15.8048 40.1093 16.6017 38.2343C17.2579 36.664 16.672 34.8124 15.2189 33.8984C14.7142 33.5941 14.1431 33.4171 13.5548 33.3827L12.1251 33.289C11.8089 33.2683 11.4919 33.3153 11.1953 33.427C10.8987 33.5386 10.6294 33.7123 10.4053 33.9364C10.1812 34.1605 10.0076 34.4298 9.89593 34.7264C9.78428 35.0229 9.73723 35.3399 9.75792 35.6562Z" fill="#FFEC00"/>
        </svg>

      </div>

      {/* Footer */}
      <div className='footer'>
        <div className='footer-content'>
          Made by stjepanDeveloper © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;