import React from 'react';
import image from '../img/GitHub-Mark-32px.png'

const Footer = () => {
  return(
    <footer className='footer fixed-bottom'>
      <p className='footer-text'>Created by Melissa Kepler 
        <a href='https://github.com/Missarachnid'>
          <img className='github' src={image} alt='The Octocat logo of GitHub'/>
      </a>
      </p>
    </footer>
  );
}

export default Footer;