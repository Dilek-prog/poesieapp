let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let cardTemplate = document.querySelector('#poesie-card-template'); // Create Tamplet
let form = document.querySelector('form'); // Eingabe im Create-Post für Bild
let titleInput = document.querySelector('#title');// Eingabe im Create-Post für Title
let locationInput = document.querySelector('#location');// Eingabe im Create-Post für Location 
let textInput = document.querySelector('#text'); // Eingabe im Create-Post für Text
let videoPlayer = document.querySelector('#player'); // Kammera Zugriff
let canvasElement = document.querySelector('#canvas'); // Kammera Zugriff
let captureButton = document.querySelector('#capture-btn'); // Kammera Zugriff
let imagePicker = document.querySelector('#image-picker'); // Kammera Zugriff
let imagePickerArea = document.querySelector('#pick-image'); // Kammera Zugriff
let locationButton = document.querySelector('#location-btn'); // Zugriff auf Location Button
let locationLoader = document.querySelector('#location-loader'); // Zugriff auf Location Button
let mapDiv = document.querySelector('.map'); // Für die Map
let fetchedLocation;  // Zugriff auf Location Button
let file = null; // Erhalten wir erst nach dem wir die Kamera aktiviert haben
let titleValue = '';
let locationValue = '';
let imageURI = ''; // Erhalten wir erst nach dem wir die Kamera aktiviert haben
let textValue = '';

function initializeMedia() { // Abfrage, ob ein  MediaDevices-API unterstützt wird
  if(!('mediaDevices' in navigator)) {
    navigator.mediaDevices = {};
}

if(!('getUserMedia' in navigator.mediaDevices)) { // falls MediaDevices-API nicht unterstützt wird, mit dieser Funktion ein eigenes erstellem
    navigator.mediaDevices.getUserMedia = function(constraints) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if(!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented'));
        }

        return new Promise( (resolve, reject) => {
            getUserMedia.call(navigator, constraints, resolve, reject);
        })
    }
}

navigator.mediaDevices.getUserMedia({video: true}) //Kamera Zugriff
.then( stream => {
    videoPlayer.srcObject = stream;
    videoPlayer.style.display = 'block';
})
.catch( err => {
    imagePickerArea.style.display = 'block';
});
}

function openCreatePostModal() {
  document.querySelector("#text").value = "";
  document.querySelector("#title").value = "";
  document.querySelector("#location").value = "";
  document.querySelector("#image-picker").value = "";
  setTimeout( () => { // Schließen des Post fließend
    createPostArea.style.transform = 'translateY(0)';
}, 1);
  initializeMedia(); // Abfrage für die Kamera 
  initializeLocation(); // Abfrage für den Standort 
}

function closeCreatePostModal() { // für die Kamera 
  createPostArea.style.transform = 'translateY(100vH)';
  imagePickerArea.style.display = 'none'; // Sobald kein Foto gemacht werden möchte, kommt der Zugriff auf das Desktop
  videoPlayer.style.display = 'none';
  canvasElement.style.display = 'none';
  locationButton.style.display = 'inline';
  locationLoader.style.display = 'none';
  if(videoPlayer.srcObject) {
    videoPlayer.srcObject.getVideoTracks().forEach( track => track.stop());
}
  setTimeout( () => { // Schließen des Post fließend
    createPostArea.style.transform = 'translateY(100vH)';
}, 1);
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(card) { // Komplettes Tamplett erichtet für die Posts
  let clone = cardTemplate.content.cloneNode(true);
  clone.querySelector('.template-title').textContent=card.title;
  clone.querySelector('.template-location').textContent=card.location;
  clone.querySelector('.template-text').textContent=card.text;
  let image = new Image();
  image.src = card.image_id;
  clone.querySelector('.template-title-wrapper').style.backgroundImage='url('+ image.src +')';
  clone.querySelector('.card-delete-icon').onclick = function () { 
    console.log("Delte Event triggered");
    delete_button_clicked(card._id) // Löschen anhand der jeweiligen ID
  };
  componentHandler.upgradeElement(clone.querySelector('.mdl-card'));
  clone.querySelector(".card-center-wrapper").id = "card-"+card._id;
  
  oldcard = sharedMomentsArea.querySelector("#card-"+card._id);
  if (oldcard) {
    oldcard.remove();
  }

  sharedMomentsArea.appendChild(clone);
}

let networkDataReceived = false;

fetch('/api/posts')
.then((res) => {
    return res.json();
})
.then((data) => {
  networkDataReceived = true;
  console.log('From backend ...', data);
    updateUI(data);
});

function updateUI(data) {
  console.log("Update UI ...");
  console.log(data);
  // sharedMomentsArea.innerHTML='';
  for(let card of data)
  {
     createCard(card);
  }

}

if('indexedDB' in window) {
  readAllData('posts')
      .then( data => {
        console.log(networkDataReceived);
          if(!networkDataReceived) {
              console.log('From cache ...', data);
              updateUI(data);
          }
      })
}

form.addEventListener('submit', event => { //triggert backend an um einen Post zu senden
event.preventDefault(); // nicht absenden und neu laden

  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') { // nimmt die Leehrzeichen am Ende weg --> prüft die Eingabe, ob etwas frei gelassen wurde 
      alert('Bitte Titel und Location angeben!') // gibt dem User ne Info
      return;
  }

  closeCreatePostModal(); // Schließt Create-Post 
});

function sendDataToBackend() { // Das fertige Formular absenden an an GET 
  const formData = new FormData();
  formData.append('title', titleValue);
  formData.append('location', locationValue);
  formData.append('file', file);
  formData.append('text', textValue);

  console.log('formData', formData)

  fetch('/api/posts', {
      method: 'POST',
      body: formData
  })
  .then( response => {
      console.log('Data sent to backend ...', response);
      console.log("Attempting to update ui ...");
      return response.json();
  })
  .then( data => {
      console.log('data ...', data);
      const newPost = {
          title: data.title,
          location: data.location,
          image_id: imageURI,
          text: data.text
      }
      updateUI([newPost]);
  });
}

form.addEventListener('submit', event => { // Funktion für den Speicherbutton 
  event.preventDefault(); // nicht absenden und neu laden

  if (file == null) {
      alert('Erst Foto aufnehmen!')
      return;
  }
  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
      alert('Bitte Titel, Text und Location angeben!')
      return;
  }

  closeCreatePostModal(); // Der Button kann geschlossen werden und hängt mit der Funktion CloseCreatePostModal zusammen

  titleValue = titleInput.value; 
  locationValue = locationInput.value;
  textValue = textInput.value;
  console.log('titleInput', titleValue)
  console.log('locationInput', locationValue)
  console.log('textInput', textValue)
  console.log('file', file)

  if('serviceWorker' in navigator && 'SyncManager' in window) { // Unterstützung vo Service Worker und co? Window ist das Fenster, das ein DOM Dokument (also eine Webanwendung) enthält. Eine Eigenschaft von window ist navigator
    navigator.serviceWorker.ready
        .then( sw => {
            let post = {
                id: new Date().toISOString(), // Id wurde hinzugefügt,um einen eindeutigen Identifier für den post in der IndexedDB zu haben (Zeitstempel)
                title: titleValue,
                location: locationValue,
                text: textValue,
                image_id: file // Foto belegt 
            };

            writeData('sync-posts', post)
                .then( () => {
                    return sw.sync.register('sync-new-post'); //registrieren vom neuen Post 
                })
                .then( () => { // Slide Hintergrundsynchronisation
                    console.log("creating confirmation toast ...");
                    let snackbarContainer = new MaterialSnackbar(document.querySelector('#confirmation-toast'));
                    let data = { message: 'Eingaben zum Synchronisieren gespeichert!', timeout: 2000};
                    snackbarContainer.showSnackbar(data);
                    delayedUpdate();

                });
        });
    } else {
        sendDataToBackend(); // die Ereignisse an das Backend schicken
    }
});

function delete_button_clicked(id){
  console.log("Delete Button Clicked id:", id);
  document.querySelector("#card-"+id)?.remove()
  fetch('/api/posts/' + id, {
      method: 'Delete',
  })
  .then( response => {
    console.log('response to delete request : ', response);
  })
  
}

function delayedUpdate(){
  setTimeout( () => {
    fetch('/api/posts')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      //networkDataReceived = true;
      console.log('From backend ...', data);
        updateUI(data);
    });
  }, 2000);
}

// Klick Ereignis von Foto-Button
captureButton.addEventListener('click', event => {
  event.preventDefault(); // nicht absenden und neu laden
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  let context = canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)); // Das Bild, Koordinate von linken oberen Punktes, breites des bildes, Höhe des Bildes 
  videoPlayer.srcObject.getVideoTracks().forEach( track => {
    track.stop();
})
  imageURI = canvas.toDataURL("image/jpg");
  // console.log('imageURI', imageURI)       // base64-String des Bildes

  fetch(imageURI)
  .then(res => {
      return res.blob()
  })
  .then(blob => {
      file = new File([blob], "myFile.jpg", { type: "image/jpg" })
      console.log('file', file)
  })
});

imagePicker.addEventListener('change', event => { //Hochladen einer Bilddatei
  file = event.target.files[0]; 
});


locationButton.addEventListener('click', event => { // Abfrage des Klick Ereignis für location 
  if(!('geolocation' in navigator)) {
      return;
  }

  locationButton.style.display = 'none'; // Wenn der Button aktzeptiert wurde, dann soll er unsichtbar sein 
  locationLoader.style.display = 'block'; // Sichtbarkeit des Loader

  navigator.geolocation.getCurrentPosition( position => { // eigentiches Aufrufen der GEO-API
      locationButton.style.display = 'inline'; // Wenn die aktuelle Position ausgerufen wird, dann wird der Button wieder sichtbar 
      locationLoader.style.display = 'none'; // Der Loader, dann wieder auf unsichtbar 
      fetchedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      console.log('current position: ', fetchedLocation);

      let nominatimURL = 'https://nominatim.openstreetmap.org/reverse'; 
      nominatimURL += '?format=jsonv2';   // format=[xml|json|jsonv2|geojson|geocodejson] Hier wird die URL ermittelt 
      nominatimURL += '&lat=' + fetchedLocation.latitude;
      nominatimURL += '&lon=' + fetchedLocation.longitude;

      fetch(nominatimURL)
      .then((res) => {
          console.log('nominatim res ...', res);
          return res.json();
      })
      .then((data) => {
          console.log('nominatim res.json() ...', data);
          locationInput.value = data.display_name;
          return data;
      })
      .then( d => {
          locationButton.style.display = 'none';
          locationLoader.style.display = 'none';
          mapDiv.style.display = 'block';

          const map = new ol.Map({ // neue map erstellen
              target: 'map',
              layers: [
              new ol.layer.Tile({
                  source: new ol.source.OSM()
              })
              ],
              view: new ol.View({ // eigentliche Karten Ansicht 
              center: ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]),
              zoom: 12 // Je höher das zoom-Level, je höher wird hineingezoomt. Zoom-Level 0 zeigt die Welt.
              })
          });

          const layer = new ol.layer.Vector({
              source: new ol.source.Vector({
                  features: [
                      new ol.Feature({
                          geometry: new ol.geom.Point(ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]))
                      })
                  ]
              })
          });

          map.addLayer(layer);

          console.log('map', map)
      })
      .catch( (err) => {
          console.error('err', err)
          locationInput.value = 'In Berlin';
      });

      document.querySelector('#manual-location').classList.add('is-focused');

  }, err => { // falls ein Error entsteht, wie zum Beispiel, dass der Nutzer den Standort nicht zu lässt. Oder das die Position nicht schnell genug ermittelt wurde
      console.log(err);
      locationButton.style.display = 'inline';
      locationLoader.style.display = 'none';
      alert('Couldn\'t fetch location, please enter manually!');
      fetchedLocation = null;
  }, { timeout: 5000});
});

function initializeLocation() { // hier wird geprüft, ob der Browser Geolacation-API unterstützt, wenn nicht wird der Button versteckt 
  if(!('geolocation' in navigator)) {
      locationButton.style.display = 'none';
  }
}