import React from 'react';
import github from '../image.png';
import spoonLogo from '../logo-simple-framed-green-gradient.svg';

function Footer() {
  return (
    <footer className="footer-box">
      <div className="container">
        <div className="footer-content">
          <form action="#" method="post" className="newsletter-form">
            <div className="newsletter-title">
              <h3>NEWSLETTER</h3>
            </div>
            <div className="newsletter-text">
              <p>Inscreva-se na nossa newsletter para receber as últimas atualizações:</p>
            </div>
            <div className="newsletter-input">
              <input type="email" name="email" placeholder="Digite seu e-mail" />
              <button type="submit">Inscrever</button>
            </div>
          </form>
          <div className="social-icons">
            <a href="https://github.com/isabelalimadacunha/easydiet" className="social-icon">
              <img src={github} alt="github" />
            </a>
            <a href="https://spoonacular.com/food-api" className="social-icon">
              <img src={spoonLogo} alt="spoonacular" />
            </a>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2024 EasyDiet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
