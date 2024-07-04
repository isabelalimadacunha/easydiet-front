import jsPDF from 'jspdf';
import React, { useState, useEffect, useCallback } from 'react';

import logo from '../easyDietLogo.png';

import '../form.css';

//Função para calcular as calorias do usuário
function calcularCalorias({ peso, altura, idade, sexo, nivelAtivFisica, objetivo }) {
  const tmbHomem = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
  const tmbMulher = 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
  const tmb = sexo === 'masculino' ? tmbHomem : tmbMulher;
  
  // Define o fator de atividade baseado no nível de atividade física
  let fatorAtividade;
  switch(nivelAtivFisica) {
    case 'sedentario':
      fatorAtividade = 1.2;
      break;
    case 'levementeAtivo':
      fatorAtividade = 1.375;
      break;
    case 'moderamenteAtivo':
      fatorAtividade = 1.55;
      break;
    case 'muitoAtivo':
      fatorAtividade = 1.725;
      break;
    case 'extremamenteAtivo':
      fatorAtividade = 1.9;
      break;
    default:
      fatorAtividade = 1.2;
  }
  
  // Calcula as calorias diárias com base no objetivo
  const caloriasManterPeso = tmb * fatorAtividade;
  let caloriasDiarias;
  if (objetivo === 'perderPeso') {
    caloriasDiarias = caloriasManterPeso - 500; 
  } else if (objetivo === 'ganharPeso') {
    caloriasDiarias = caloriasManterPeso + 500; 
  } else {
    caloriasDiarias = caloriasManterPeso;
  }

  return Math.round(caloriasDiarias);
}

//Tradução dos dias da semana
const dayNames = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

//Função para calcular o IMC do usuário
function calcularIMC({ peso, altura }) {
  const alturaMetros = altura / 100;
  const indiceMC = peso / (alturaMetros ** 2);

  let faixaIMC;

  if (indiceMC < 18.5) {
    faixaIMC = 'Baixo peso';
  } else if (indiceMC >= 18.5 && indiceMC <= 24.9) {
    faixaIMC = 'Peso adequado';
  } else if (indiceMC >= 25 && indiceMC <= 29.9) {
    faixaIMC = 'Sobrepeso';
  } else if (indiceMC >= 30 && indiceMC <= 34.9) {
    faixaIMC = 'Obesidade grau I';
  } else if (indiceMC >= 35 && indiceMC <= 39.9) {
    faixaIMC = 'Obesidade grau II';
  } else {
    faixaIMC = 'Obesidade grau III';
  }

  return { indiceMC: indiceMC.toFixed(2), faixaIMC }; // Retorna o IMC e sua faixa
}

// Rradução para os tipos de dieta
const dietTranslations = {
  ovoVegetarian: 'Ovo-Vegetariana',
  vegetarian: 'Vegetariana',
  lactoVegetarian: 'Lacto-Vegetariana',
  pescetarian: 'Pescetariana',
  paleo: 'Paleo',
  primal: 'Primal',
  lowFODMAP: 'Low FODMAP',
  whole30: 'Whole30',
  ketogenic: 'Cetogênica'
};

// Tradução para as intolerâncias
const intoleranceTranslations = {
  dairy: 'Laticínios',
  egg: 'Ovo',
  gluten: 'Glúten',
  peanut: 'Amendoim',
  sesame: 'Gergelim',
  soy: 'Soja',
  grain: 'Grãos',
  seafood: 'Frutos do Mar',
  shellfish: 'Frutos do Mar com Carapaça',
  sulfite: 'Sulfito',
  treeNut: 'Frutos Secos',
  wheat: 'Trigo'
};

// Função para criar o PDF
const createPDF = (data, nome, diet, logo, imcResultado, intolerancias) => {
  const doc = new jsPDF();
  
  // Configurações para o posicionamento do logo
  const logoWidth = 50;
  const logoHeight = 40;
  const marginRight = 10;
  const marginTop = 0;
  doc.addImage(logo, 'PNG', doc.internal.pageSize.getWidth() - logoWidth - marginRight, marginTop, logoWidth, logoHeight);

  // Configurações de fonte e tamanho para o conteúdo do PDF
  doc.setFont('helvetica');
  doc.setFontSize(13);

  // Primeira página: informações do usuário e texto explicativo
  doc.text(`Dieta para Semana do(a): ${nome}`, 10, 20);
  doc.text(`Tipo de Dieta: ${dietTranslations[diet] ? dietTranslations[diet] : 'Não especificado'}`, 10, 30);
  if (imcResultado) {
    doc.text(`Seu IMC é: ${imcResultado.indiceMC}`, 10, 40);
    doc.text(`Faixa do IMC: ${imcResultado.faixaIMC}`, 10, 50);
  }


if (intolerancias.length > 0) {
    const intoleranciasText = `Intolerâncias: ${intolerancias.map(intolerancia => intoleranceTranslations[intolerancia]).join(', ')}`;
    doc.text(intoleranciasText, 10, 60);
}

// Texto explicativo sobre a dieta
const textoExplicativo = "Obrigado por escolher o EasyDiet! Preparamos uma dieta personalizada para a sua semana, com café da manhã, almoço e jantar inclusos. Cada receita foi cuidadosamente selecionada da API Spoonacular, garantindo não apenas sabor, mas também equilíbrio nutricional. Baseada nos seus objetivos individuais, nossa dieta é adaptada para atender às suas necessidades diárias de calorias. Estamos aqui para ajudá-lo a alcançar seus objetivos de forma saudável e deliciosa.";
const margins = {
    top: 70 + (intolerancias.length > 0 ? 20 : 0), 
    bottom: 20, 
    left: 10, 
    width: doc.internal.pageSize.getWidth() - 20 
};
doc.text(textoExplicativo, margins.left, margins.top, { align: 'justify', maxWidth: margins.width });
 
  // Adiciona uma nova página para começar a dieta
  doc.addPage();

  const days = Object.keys(data.week);

  // Itera pelos dias da semana no plano de refeições
  days.forEach((day, index) => {
    const centerX = doc.internal.pageSize.getWidth() / 2; 
    const yPosition = 20; 
    doc.text(dayNames[day], centerX, yPosition, { align: 'center' });

    const meals = data.week[day].meals;
    let y = yPosition + 10; 
    
    // Itera pelas refeições do dia
    meals.forEach((meal) => {
      if (y > 250) { 
        doc.addPage();
        y = 20; 
      }

      // Adiciona informações da refeição no PDF
      doc.text(`${meal.title}`, 20, y);
      y += 10;
      doc.text(`Tempo de preparo: ${meal.readyInMinutes} minutos`, 20, y);
      y += 10;
      doc.text(`Porções: ${meal.servings}`, 20, y);
      y += 10;
      doc.text(`Receita: ${meal.sourceUrl}`, 20, y);
      y += 20;
    });
    
    // Adiciona uma nova página entre os dias, se não for o último
    if (index < days.length - 1) {
      doc.addPage();
    }
  });

  doc.save('dieta_gerada.pdf');
};




function Form() {

    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [sexo, setSexo] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [nivelAtivFisica, setNivelAtivFisica] = useState('');
    const [diet, setDiet] = useState('');
    const [intolerancias, setIntolerancias] = useState([]);
    const [imcResultado, setImcResultado] = useState(null);
    const [calculateIMC, setCalcularIMC] = useState(false);

  // Calcula o IMC se a variável calculateIMC é verdadeira
    const handleIMC = useCallback(() => {
      if (calculateIMC) {
        const imcData = calcularIMC({ peso, altura });
        setImcResultado(imcData);
      }
    }, [calculateIMC, peso, altura]);

  //Chama o handleIMC sempre que há uma mudança
    useEffect(() => {
      handleIMC();
    }, [handleIMC]);

  //Função handleSubmit é executada quando o formulário é submetido
    const handleSubmit = async (e) => {
      e.preventDefault();
     
      handleIMC();
      const targetCalories = calcularCalorias({ peso, altura, idade, sexo, nivelAtivFisica, objetivo });
    
      try {
        console.log('Sending request to server with the following data:', {
          timeFrame: 'week',
          targetCalories,
          diet,
          intolerancias
        });

        // Faz uma requisição POST para o servidor com os dados da dieta
        const response = await fetch('https://easydiet-be.vercel.app/api/generate-meal-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetCalories,
            diet,
            intolerancias,
            timeFrame: 'week' 
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Converte a resposta em formato JSON
        const data = await response.json();
        console.log('Dieta gerada:', data);
        console.log(targetCalories);
        
       // Cria um PDF com os dados recebidos do servidor
       createPDF(data, nome, diet, logo, calculateIMC ? imcResultado : null, intolerancias);
            } catch (error) {
        console.error('Erro ao gerar a dieta:', error);
      }
    };
    
   const handleKeyDown = (event) => {
      const charCode = event.charCode || event.keyCode;
      if (charCode !== 0 && (charCode < 48 || charCode > 57) && charCode !== 8) {
        event.preventDefault();
      }
    };

    return (
        <div id='tela-formulario' className='tela'>
          <div id='tela3-box'>
            <h1 id='titulo-formulario'>Formulário</h1>
            <div id='texto-formulario'>
              <p>O formulário levará apenas alguns minutos para ser preenchido, precisamos de algumas informações para montar sua dieta personalizada.</p>
            </div>
          </div>

          <div id='tela3-box-forms'>
            <form onSubmit={handleSubmit}>
              <h3>Nome Completo: </h3>
              <input type="text" id='nome' required value={nome} onChange={(e) => setNome(e.target.value)} />
              <h3 htmlFor="idade">Idade:</h3>
              <input
                type="number"
                id="idade"
                name="idade"
                min="1"
                step="1"
                required
                value={idade}
                onChange={(e) => setIdade(e.target.value)} onKeyDown={handleKeyDown}
              />
              <h3 htmlFor="sexo">Sexo:</h3>
              <select id="sexo" name="sexo" type="select" required value={sexo} onChange={(e) => setSexo(e.target.value)}>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
              <h3 htmlFor="peso">Peso (kg):</h3>
              <input type="number" id="peso" name="peso" min="1" step="0.1" required  value={peso} onChange={(e) => setPeso(e.target.value)} onKeyDown={handleKeyDown} />
              <h3 htmlFor="altura">Altura (cm):</h3>
              <input type="number" id="altura" name="altura" min="10" step="0.1" required value={altura} onChange={(e) => setAltura(e.target.value)} onKeyDown={handleKeyDown} />
              
              <div id='objetivos'>
                <h3>Objetivos:</h3>
                <label>
                  <input
                    type="radio"
                    name="objetivo"
                    value="perderPeso"
                    required
                    checked={objetivo === 'perderPeso'}
                    onChange={(e) => setObjetivo(e.target.value)}
                  />
                  Perder peso
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="objetivo"
                    value="ganharPeso"
                    required
                    checked={objetivo === 'ganharPeso'}
                    onChange={(e) => setObjetivo(e.target.value)}
                  />
                  Ganhar peso
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="objetivo"
                    value="manterPeso"
                    required
                    checked={objetivo === 'manterPeso'}
                    onChange={(e) => setObjetivo(e.target.value)}
                  />
                  Manter peso
                </label>
                <br />
                <h3 htmlFor="nivelAtivFisica">Nível de Atividade Física:</h3>
                <select id="nivelAtivFisica" name="nivelAtivFisica" required value={nivelAtivFisica} onChange={(e) => setNivelAtivFisica(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                  <option value="levementeAtivo">Levemente ativo (exercício leve, 1-3 dias/semana)</option>
                  <option value="moderamenteAtivo">Moderadamente ativo (exercício moderado, 3-5 dias/semana)</option>
                  <option value="muitoAtivo">Muito ativo (exercício pesado, 6-7 dias/semana)</option>
                  <option value="extremamenteAtivo">Extremamente ativo (exercício muito pesado ou trabalho físico intenso)</option>
                </select>
                <br />


                <h3 htmlFor="diet">Tipo de Dieta:</h3>
                <select id="diet" name="diet"  value={diet} onChange={(e) => setDiet(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="ovoVegetarian">Ovo-Vegetarian</option>               
                  <option value="vegetarian">Vegetariana</option>
                  <option value="lactoVegetarian">Lacto-Vegetariana</option>
                  <option value="pescetarian">Pescetarian</option>
                  <option value="paleo">Paleo</option>
                  <option value="primal">Primal</option>
                  <option value="lowFODMAP">Low FODMAP</option>
                  <option value="whole30">Whole30</option>
                  <option value="ketogenic">Ketogênica</option>
                </select>
                <br />
                <small>
                  {diet === "ovoVegetarian" && "Todos os ingredientes devem ser vegetarianos e nenhum deles pode conter ou ser derivado de laticínios."}
                  {diet === "vegetarian" && "Nenhum ingrediente pode conter carne ou derivados de carne, como ossos ou gelatina."}
                  {diet === "lactoVegetarian" && "Todos os ingredientes devem ser vegetarianos e nenhum deles pode conter ou ser derivado de ovos."}
                  {diet === "pescetarian" && "Tudo é permitido, exceto carne e seus derivados - alguns pescetarianos consomem ovos e laticínios, outros não."}
                  {diet === "paleo" && "Ingredientes permitidos incluem carne (especialmente de animais criados em pastagens), peixe, ovos, vegetais, alguns óleos (como óleo de coco e azeite), e em quantidades menores, frutas, nozes e batatas-doces. Também permitimos mel e xarope de bordo (populares em sobremesas paleo, mas seguidores estritos da paleo podem discordar). Ingredientes não permitidos incluem legumes (como feijões e lentilhas), grãos, laticínios, açúcar refinado e alimentos processados."}
                  {diet === "primal" && "Muito semelhante ao paleo, exceto que os laticínios são permitidos - pense em leite cru e integral, manteiga, ghee, etc."}
                  {diet === "lowFODMAP" && "FODMAP significa 'fermentable oligo-, di-, mono-saccharides and polyols'. Nossa ontologia sabe quais alimentos são considerados ricos nesses tipos de carboidratos (por exemplo, leguminosas, trigo e produtos lácteos)."}
                  {diet === "whole30" && "Ingredientes permitidos incluem carne, peixe/frutos do mar, ovos, vegetais, frutas frescas, óleo de coco, azeite, pequenas quantidades de frutas secas e nozes/sementes. Ingredientes não permitidos incluem adoçantes adicionados (naturais e artificiais, exceto pequenas quantidades de suco de frutas), laticínios (exceto manteiga clarificada ou ghee), álcool, grãos, leguminosas (exceto feijão verde, ervilha-de-açúcar e ervilha-torta) e aditivos alimentares, como carragenina, MSG e sulfitos."}
                  {diet === "ketogenic" && "A dieta cetogênica é baseada mais na proporção de gordura, proteína e carboidratos na dieta do que em ingredientes específicos. De maneira geral, alimentos ricos em gorduras e proteínas são aceitáveis e alimentos ricos em carboidratos não são. A fórmula que usamos é 55-80% de conteúdo de gordura, 15-35% de conteúdo de proteína e menos de 10% de carboidratos."}
                  
                </small>
                <br />
               
                <div id='intolerancias'>
  <h3>Intolerâncias:</h3><br />
  <div style={{ display: 'flex' }}>
    <div style={{ flex: 1 }}>
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="dairy"
          checked={intolerancias.includes('dairy')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Laticínios
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="egg"
          checked={intolerancias.includes('egg')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Ovo
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="gluten"
          checked={intolerancias.includes('gluten')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Glúten
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="peanut"
          checked={intolerancias.includes('peanut')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Amendoim
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="sesame"
          checked={intolerancias.includes('sesame')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Gergelim
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="soy"
          checked={intolerancias.includes('soy')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Soja
      </label><br />
    </div>
    <div style={{ flex: 1 }}>
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="grain"
          checked={intolerancias.includes('grain')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Grãos
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="seafood"
          checked={intolerancias.includes('seafood')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Frutos do Mar
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="shellfish"
          checked={intolerancias.includes('shellfish')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Frutos do Mar com Carapaça
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="sulfite"
          checked={intolerancias.includes('sulfite')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Sulfito
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="treeNut"
          checked={intolerancias.includes('treeNut')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Frutos Secos
      </label><br />
      <label>
        <input
          type="checkbox"
          name="intolerancia"
          value="wheat"
          checked={intolerancias.includes('wheat')}
          onChange={(e) => {
            const value = e.target.value;
            setIntolerancias(prevState => {
              if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
              } else {
                return [...prevState, value];
              }
            });
          }}
        /> Trigo
      </label>
      </div>
      </div>
      <br />
      
      <div className='indiceMC'>
      <h3>Deseja calcular o IMC?</h3>
          <label>
            <input type="checkbox" checked={calculateIMC} onChange={(e) => setCalcularIMC(e.target.checked)} />
            Calcular IMC
          </label>
    </div>
  

       </div>
       </div>         
              <button id='form-btn' type="submit">Criar Dieta</button>
    
            </form>
          </div>
        </div>
    );
}


export default Form;
