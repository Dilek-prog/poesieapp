let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let cardTemplate = document.querySelector('#poesie-card-template');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(card) {
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

  for(let card of data)
  {
     createCard(card);
  }

}
   
if('indexedDB' in window) {
  readAllData('posts')
      .then( data => {
          if(!networkDataReceived) {
              console.log('From cache ...', data);
              updateUI(data);
          }
      })
}