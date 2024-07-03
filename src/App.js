import Form from './components/Form.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import './index.css';

function App() {
 

  return (
    <div className="App">
    

    <Header/>
      
      <div id='tela-inicio' className='tela'>
        <div id='tela1-box'>
          <div id='titulo'>EasyDiet</div>
          <p id='texto-inicio'>Sua jornada para uma vida mais saudável começa aqui</p>
        </div>
      </div>

      <div id="tela-sobre" className="tela">
        <h1 id='titulo-sobre'>Bem-vindo ao EasyDiet</h1>
        <div id="texto-sobre">
          <div className='proposito-box'>
            <h2>Qual é o propósito?</h2>
            <br />
            <p>Nosso objetivo é facilitar a transição para uma dieta saudável, oferecendo uma solução personalizada para hábitos alimentares saudáveis. Queremos ajudá-lo a alcançar seus objetivos de saúde e bem-estar de maneira prática e sustentável.</p>
          </div>
          <div className='como-funciona-box'>
            <h2>Como funciona?</h2>
            <br />
            <p>O EasyDiet utiliza a <a href="https://spoonacular.com/food-api" target="_blank" rel="noopener noreferrer" className="link">API Spoonacular</a> para criar uma dieta personalizada com base nos seus objetivos e estilo de vida. Ao responder algumas perguntas simples, nossa aplicação projetará um plano alimentar sob medida para você.</p>
          </div>
          <div className='oque-diferencia-box'>
            <h2>O que nos diferencia?</h2>
            <br />
            <p>Nossos planos alimentares são totalmente adaptados às suas necessidades individuais, levando em consideração suas preferências alimentares, restrições dietéticas e objetivos de saúde. Com o EasyDiet você recebe uma dieta personalizada em instantes após o preenchimento de um formulário.</p>
          </div>
        </div>
      </div>
<Form></Form>
<Footer></Footer>
    </div>
  );
}

export default App;
