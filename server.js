// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express, { json } from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

const apiEndpoint = "https://fdnd-agency.directus.app/items/dropandheal_"
const apiTask = "task"
const apiExercise = "exercise"

const taskResponse = await fetch(`${apiEndpoint}${apiTask}`)
const exerciseResponse = await fetch(`${apiEndpoint}${apiExercise}`)

const taskResponseJSON = await taskResponse.json()
const exerciseResponseJSON = await exerciseResponse.json()

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)


//get route voor index is in de root als / 
app.get('/', async function (request, response){
  const taskResponse = await fetch('https://fdnd-agency.directus.app/items/dropandheal_task/?filter={"id":1}')
  const exerciseResponse = await fetch('https://fdnd-agency.directus.app/items/dropandheal_exercise/?filter={"task":1}')
  const taskResponseJSON = await taskResponse.json()
  const exerciseResponseJSON = await exerciseResponse.json()

  response.render('index.liquid', {
    tasks: taskResponseJSON.data,
    exercise: exerciseResponseJSON.data})
})


//get route voor community chat is in de root als /chat
app.get('/chat', async function (request, response){
const chatResponse = await fetch('https://fdnd-agency.directus.app/items/dropandheal_messages')
const chatResponseJson = await chatResponse.json();

response.render('chat.liquid', {
chat: chatResponseJson.data,
  })
})

// post request
app.post('/chat', async (request, response) => {
  const { from, text } = request.body;

  await fetch('https://fdnd-agency.directus.app/items/dropandheal_messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }, 
    body: JSON.stringify({ from, text }) 
  });

  response.redirect(303, '/chat'); 
});

// delete 
app.post('/chat/delete/:id', async (request, response) => {
  const { id } = request.params;  

  const apiResponse = await fetch(`https://fdnd-agency.directus.app/items/dropandheal_messages/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  });

  if (apiResponse.ok) {
    response.redirect(303, '/chat');
  } else {
    response.status(500).send('Er is iets misgegaan met het verwijderen van het bericht.');
  }
});















/*

// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})
