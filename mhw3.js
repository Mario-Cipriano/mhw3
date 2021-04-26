function onJson(json) {
    console.log('Json ricevuto')
    console.log(json)

    const eventview = document.querySelector('#event-view');
    eventview.innerHTML = '';
    let num_results = json.page.totalElements;
    // Mostriamone al massimo 20 elementi
    if (num_results > 20)
        num_results = 20;
    for (let i = 0; i < num_results; i++) {
        //scansiono i risultati del json, max 20 elementi

        /*estraggo informazioni*/
        const doc = json._embedded.events[i]
        const title = doc.name;
        const data = doc.dates.start.dateTime;
        const images = doc.images;
        const country = doc.dates.timezone;
        const classification = doc.classifications[0].segment.name
        const cityname = doc._embedded.venues[0].city.name


        //per le immagini ho un vettore quindi per estrarle scansiono e prendo il primo risultato per ognuno ossia ratio'3_2'*/
        let selected_image = null;
        for (image of images) {
            if (image.ratio == '3_2')
                selected_image = image.url
        }

        // Creiamo il div che conterrà immagine e didascalia
        const event = document.createElement('div');
        event.classList.add('evento');
        // Creiamo l'immagine;
        const img = document.createElement('img');
        img.src = selected_image;
        // Creiamo la Descrizione di ogni evento;
        const span = document.createElement('button');
        span.textContent = title;
        span.classList.add('title')
        const data_time = document.createElement('span')
        data_time.classList.add('data')
        data_time.textContent = data;
        const zone = document.createElement('span')
        zone.classList.add('luogo')
        zone.textContent = country;
        const genere = document.createElement('span')
        genere.classList.add('genere')
        genere.textContent = classification;
        const city = document.createElement('span')
        city.classList.add('citta')
        city.textContent = cityname



        // Aggiungiamo immagine e descrizione al div
        event.appendChild(img);
        event.appendChild(span);
        event.appendChild(data_time);
        event.appendChild(zone);
        event.appendChild(genere);
        event.appendChild(city)

        // Aggiungiamo il div alla  sezione eventi
        eventview.appendChild(event);
        const favourite = document.querySelectorAll('#event-view .evento button')
        for (let preferito of favourite) {
            if (preferito.textContent === title) {
                preferito.addEventListener('click', AggiungiPreferiti);
            }
        }
        img.addEventListener('click', ApriModale);

    }
}

const desc = []

function onJsonMusic(json) {
    console.log('json ricevuto')
    console.log(json)
    const music_view = document.querySelector('#event-view');
    music_view.innerHTML = '';
    if (json.length > 10) {
        json.length = 10;
    }

    const img_event = json[0].artist.image_url
    const name_event = json[0].artist.name

    for (let i = 0; i < json.length; i++) {
        const results = json[i];
        const image = img_event
        const name = name_event
        const country = results.venue.country
        const city = results.venue.city
        const luogo = results.venue.name
        const data_time = results.datetime
        const status = results.offers[0].status

        const descrizione = results.description
        desc.textContent = descrizione;

        const artist_event = document.createElement('div')
        artist_event.classList.add('music')
        const img = document.createElement('img')
        img.src = image
        const nome = document.createElement('button')
        nome.classList.add('title')
        nome.textContent = name
        const paese = document.createElement('span')
        paese.classList.add('paese');
        paese.textContent = country
        const citta = document.createElement('span')
        citta.classList.add('citta')
        citta.textContent = city
        const location = document.createElement('span')
        location.classList.add('luogo')
        location.textContent = luogo
        const data = document.createElement('span')
        data.classList.add('data')
        data.textContent = data_time
        const stato = document.createElement('span')
        stato.classList.add('event-status')
        stato.textContent = status;

        music_view.appendChild(artist_event)
        artist_event.appendChild(img)
        artist_event.appendChild(nome)
        artist_event.appendChild(paese)
        artist_event.appendChild(citta)
        artist_event.appendChild(location)
        artist_event.appendChild(data)
        artist_event.appendChild(stato)



        const favourite = document.querySelectorAll('#event-view .music button')
        for (let preferito of favourite) {
            if (preferito.textContent === name) {
                preferito.addEventListener('click', AggiungiConcerti);
            }
        }
        img.addEventListener('click', ApriModale)
    }

}

const article1 = document.querySelector('.article1-preferiti')


function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function onError(error) {
    console.log('Error:' + error);
}




function search(event) {
    //con preventDefault default impedisco che la pagina venga ricaricata
    event.preventDefault();
    const content = document.querySelector('#event').value;
    if (content) {
        const text = encodeURIComponent(content)
        console.log('Eseguo ricerca elementi riguardanti: ' + text);
        const tipo = document.querySelector('#tipo').value;
        console.log('Ricerco elementi di tipo: ' + tipo);
        if (tipo === 'evento') {

            console.log('Eseguo ricerca: ' + content);
            const api_key = 'VAijFBNfbGZNn47m8uXqGVAbZY9g8PEx';
            rest_url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + content + '&apikey=' + api_key;
            console.log('URL: ' + rest_url);
            // Esegui fetch
            fetch(rest_url).then(onResponse).then(onJson);
        } else if (tipo === 'music') {
            console.log('Eseguo ricerca: ' + content)
            rest_url = 'https://rest.bandsintown.com/artists/' + content + '/events?app_id=foo';
            console.log('Url: ' + rest_url);
            fetch(rest_url).then(onResponse).then(onJsonMusic)
        }

    } else {
        alert("Inserisci il testo per cui effettuare la ricerca");
    }
    /*
    const evento = document.querySelector('#event');
    const event_value = encodeURIComponent(evento.value);
    console.log('Eseguo ricerca: ' + event_value);
    const api_key = 'VAijFBNfbGZNn47m8uXqGVAbZY9g8PEx';
    rest_url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + event_value + '&apikey=' + api_key;
    console.log('URL: ' + rest_url);
    // Esegui fetch
    fetch(rest_url).then(onResponse).then(onJson);*/
}

let cont = 0;
let count = 0;

function RimuoviPreferiti(event) {
    //conto elementi
    cont--
    if (cont === 0 && count == 0) {
        article1.classList.add('hidden')
    }
    const rimuovi = event.target
    rimuovi.parentNode.parentNode.classList.add('hidden')

    const title_section = document.querySelectorAll('.title');

    for (let titolo of title_section) {
        titolo.addEventListener('click', AggiungiPreferiti);
    }
}


function RimuoviConcerti(event) {
    //conto elementi
    count--
    if (count === 0 && cont == 0) {
        article1.classList.add('hidden')
    }
    const rimuovi = event.target
    rimuovi.parentNode.parentNode.classList.add('hidden')

    const title_section = document.querySelectorAll('.title');

    for (let titolo of title_section) {
        titolo.addEventListener('click', AggiungiConcerti);
    }
}




const selector_preferiti = document.querySelectorAll('.div-title img')

function AggiungiPreferiti(event) {
    //conto elementi
    cont++
    //creo elementi preferiti
    event.target.removeEventListener('click', AggiungiPreferiti)
    const sectionpreferiti = document.querySelector('.section-preferiti')
    const divcontent = document.createElement('div')
    const image = document.createElement('img')
    const div = document.createElement('div')
    const h1 = document.createElement('h1')
    const preferito = document.createElement('img')
    const luogo = document.createElement('span')
    const event_date = document.createElement('span')
    const genere = document.createElement('span')
    const cityname = document.createElement('span')

    //aggiungo elementi alla sezione preferiti
    sectionpreferiti.appendChild(divcontent)
    divcontent.appendChild(image)
    divcontent.appendChild(div)
    div.appendChild(h1)
    div.appendChild(preferito)
    divcontent.appendChild(luogo)
    divcontent.appendChild(event_date)
    divcontent.appendChild(genere)
    divcontent.appendChild(cityname)


    //aggiungo qualche classe
    divcontent.classList.add('div-content')
    div.classList.add('div-title')

    //descrivo gli eventi in preferiti
    image.src = event.target.parentNode.querySelector('img').src
    h1.textContent = event.target.textContent
    luogo.textContent = event.target.parentNode.querySelector('.luogo').textContent
    event_date.textContent = event.target.parentNode.querySelector('.data').textContent
    genere.textContent = event.target.parentNode.querySelector('.genere').textContent
    cityname.textContent = event.target.parentNode.querySelector('.citta').textContent

    const icon_remove = document.querySelectorAll('.div-title img')
    for (let icon of icon_remove) {
        icon.src = 'icon-remove.png'
    }
    article1.classList.remove('hidden')
    const pref = document.querySelectorAll('.div-title img')
    for (let fav of pref) {
        fav.addEventListener('click', RimuoviPreferiti)
    }
    //modale per img

    image.addEventListener('click', ApriModale);
}



function AggiungiConcerti(event) {
    //conto elementi
    cont++
    //creo elementi preferiti
    event.target.removeEventListener('click', AggiungiConcerti)
    const sectionpreferiti = document.querySelector('.section-preferiti')
    const divcontent = document.createElement('div')
    const image = document.createElement('img')
    const div = document.createElement('div')
    const h1 = document.createElement('h1')
    const preferito = document.createElement('img')
    const country = document.createElement('span')
    const city = document.createElement('span')
    const luogo = document.createElement('span')
    const data_time = document.createElement('span')
    const descrizione = document.createElement('button')
    descrizione.textContent = 'descrizione';
    const status = document.createElement('span')
    status.classList.add('event-status');

    //aggiungo elementi alla sezione preferiti
    sectionpreferiti.appendChild(divcontent)
    divcontent.appendChild(image)
    divcontent.appendChild(div)
    div.appendChild(h1)
    div.appendChild(preferito)
    divcontent.appendChild(country)
    divcontent.appendChild(city)
    divcontent.appendChild(luogo)
    divcontent.appendChild(data_time)
    divcontent.appendChild(descrizione)
    divcontent.appendChild(status)


    //aggiungo qualche classe
    divcontent.classList.add('div-content')
    div.classList.add('div-title')

    //descrivo gli eventi in preferiti
    image.src = event.target.parentNode.querySelector('img').src
    h1.textContent = event.target.textContent
    country.textContent = event.target.parentNode.querySelector('.paese').textContent
    city.textContent = event.target.parentNode.querySelector('.citta').textContent
    luogo.textContent = event.target.parentNode.querySelector('.luogo').textContent
    data_time.textContent = event.target.parentNode.querySelector('.data').textContent
    status.textContent = event.target.parentNode.querySelector('.event-status').textContent

    const icon_remove = document.querySelectorAll('.div-title img')
    for (let icon of icon_remove) {
        icon.src = 'icon-remove.png'
    }
    article1.classList.remove('hidden')
    const pref = document.querySelectorAll('.div-title img')
    for (let fav of pref) {
        fav.addEventListener('click', RimuoviConcerti)
    }
    //modale per img
    //image.addEventListener('click', ApriModale);
    descrizione.addEventListener('click', ApriDescrizione);


}

const modale = document.querySelector('#modale')

//funzione che al click apre immagine 

function ApriModale(event) {
    const immagine = document.createElement('img')
    immagine.src = event.target.src
    modale.appendChild(immagine);
    modale.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}




function ApriDescrizione() {
    const descrizione = document.createElement('span')

    descrizione.textContent = desc.textContent
    modale.appendChild(descrizione);
    modale.classList.remove('hidden');
    document.body.classList.add('no-scroll');

}

function RimuoviDescrizione() {

    modale.classList.add('hidden')
    modale.querySelector('span').remove();
    document.body.classList.remove('no-scroll');
}

//funzione per chiudere modale tramite click
function ChiudiModale() {
    modale.classList.add('hidden')
    modale.querySelector('img').remove();
    document.body.classList.remove('no-scroll');
}

/*event listener barra ricerca */
const form = document.querySelector('form');
form.addEventListener('submit', search)

/*event listener modale img*/

//const modale_img = document.querySelector('#modale')
//modale_img.addEventListener('click', ChiudiModale);

/*event listener modale descrizione*/
const modale_span = document.querySelector('#modale')
modale_span.addEventListener('click', RimuoviDescrizione);