let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let cardTemplate = document.querySelector('#poesie-card-template');
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let locationInput = document.querySelector('#location');
let textInput = document.querySelector('#text');
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let locationButton = document.querySelector('#location-btn'); // Zugriff auf Location Button
let locationLoader = document.querySelector('#location-loader'); // Zugriff auf Location Button
let mapDiv = document.querySelector('.map');
let fetchedLocation;  // Zugriff auf Location Button
let file = null;
let titleValue = '';
let locationValue = '';
let imageURI = '';
let textValue = '';

function initializeMedia() {
  if(!('mediaDevices' in navigator)) {
    navigator.mediaDevices = {};
}

if(!('getUserMedia' in navigator.mediaDevices)) {
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
  setTimeout( () => {
    createPostArea.style.transform = 'translateY(0)';
}, 1);
  initializeMedia();
  initializeLocation();
}

function closeCreatePostModal() {
  createPostArea.style.transform = 'translateY(100vH)';
  imagePickerArea.style.display = 'none'; // Sobald kein Foto gemacht werden möchte, kommt der Zugriff auf den Desktop
  videoPlayer.style.display = 'none';
  canvasElement.style.display = 'none';
  locationButton.style.display = 'inline';
  locationLoader.style.display = 'none';
  if(videoPlayer.srcObject) {
    videoPlayer.srcObject.getVideoTracks().forEach( track => track.stop());
}
  setTimeout( () => {
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
  sharedMomentsArea.appendChild(clone);


}
let networkDataReceived = false;

fetch('http://localhost:3000/posts')
.then((res) => {
    return res.json();
})
.then((data) => {
  networkDataReceived = true;
  console.log('From backend ...', data);
    updateUI(data);
});

function updateUI(data) {
  sharedMomentsArea.innerHTML='';
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

form.addEventListener('submit', event => { //triggert backend an 
event.preventDefault(); // nicht absenden und neu laden

  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') { // nimmt die Leehrzeichen am Ende weg --> prüft die Eingabe, ob etwas frei gelassen wurde 
      alert('Bitte Titel und Location angeben!') // gibt dem User ne Info
      return;
  }

  closeCreatePostModal();
});

function sendDataToBackend() { // Das fertige Formular absenden an an GET 
  const formData = new FormData();
  formData.append('title', titleValue);
  formData.append('location', locationValue);
  formData.append('file', file);
  formData.append('text', textValue);

  console.log('formData', formData)

  fetch('http://localhost:3000/posts', {
      method: 'POST',
      body: formData
  })
  .then( response => {
      console.log('Data sent to backend ...', response);
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


  sendDataToBackend(); // Die Werte werden an das Backend gesendet
});

captureButton.addEventListener('click', event => {
  event.preventDefault(); // nicht absenden und neu laden
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  let context = canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));


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

imagePicker.addEventListener('change', event => {
  file = event.target.files[0];
});


locationButton.addEventListener('click', event => {
  if(!('geolocation' in navigator)) {
      return;
  }

  locationButton.style.display = 'none';
  locationLoader.style.display = 'block';

  navigator.geolocation.getCurrentPosition( position => {
      locationButton.style.display = 'inline';
      locationLoader.style.display = 'none';
      fetchedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      console.log('current position: ', fetchedLocation);

      let nominatimURL = 'https://nominatim.openstreetmap.org/reverse'; 
      nominatimURL += '?format=jsonv2';   // format=[xml|json|jsonv2|geojson|geocodejson]
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

          const map = new ol.Map({ //map erstellen
              target: 'map',
              layers: [
              new ol.layer.Tile({
                  source: new ol.source.OSM()
              })
              ],
              view: new ol.View({
                  center: ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]),
                  zoom: 12
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
  }, err => {
      console.log(err);
      locationButton.style.display = 'inline';
      locationLoader.style.display = 'none';
      alert('Couldn\'t fetch location, please enter manually!');
      fetchedLocation = null;
  }, { timeout: 5000});
});

function initializeLocation() { // hier wird geprüft, ob der Browser Geolacation-API unterstützt 
  if(!('geolocation' in navigator)) {
      locationButton.style.display = 'none';
  }
}