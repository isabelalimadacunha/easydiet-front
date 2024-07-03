import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 3003;
const apiKey = '886fba5b61674926a535fa6e6e51c088';


app.use(cors({
    origin: 'http://localhost:3000'
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/generate-meal-plan', async (req, res) => {
   try {
       const { targetCalories, diet, intolerancias } = req.body;


       // Verificar se os dados recebidos estão corretos
       if (!targetCalories) {
           throw new Error('Dados incompletos.');
       }


       console.log('Dados recebidos:', req.body);


       const exclude = intolerancias ? intolerancias.join(',') : '';


       console.log('Chamando a API da Spoonacular...');


       const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=week&targetCalories=${targetCalories}&diet=${diet}&exclude=${exclude}`);


       const mealPlan = response.data;
       console.log('Dieta gerada:', mealPlan);
       res.json(mealPlan);
   } catch (error) {
       console.error('Erro ao gerar o plano de refeições:', error);
       res.status(500).json({ error: 'Erro ao gerar o plano de refeições' });
   }
});


app.listen(PORT, () => {
   console.log(`Servidor está rodando na porta ${PORT}`);
});


