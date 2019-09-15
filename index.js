// Import stylesheets
import './style.css';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

const firebaseConfig = {
  apiKey: "AIzaSyDfzPbClsjdSr80sWCb7AeOvmWypHZMmqI",
  authDomain: "thor-7798b.firebaseapp.com",
  databaseURL: "https://thor-7798b.firebaseio.com",
  projectId: "thor-7798b",
  storageBucket: "thor-7798b.appspot.com",
  messagingSenderId: "536814220584",
  appId: "1:536814220584:web:2ff8b8d8f22ab2e4344c1d"
};

// Initialize Firebase
if (firebaseConfig && firebaseConfig.apiKey) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

const table = document.getElementById('table');
const getButton = document.getElementById('get');
const search = document.getElementById('search');
const body = document.getElementById('body');
const addButton = document.getElementById('add');
const addForm = document.getElementById('addForm');
const clearSearch = document.getElementById('clear');

getButton.addEventListener("click", (e) =>{
  e.preventDefault();
  populateTable();
});

addButton.addEventListener("click", (e) => {
  addForm.style.display = 'block';
});

clearSearch.addEventListener("click", (e)=>{
  console.log('a');
  e.preventDefault();
  search.value="";
  populateTable();
})

addForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const name=document.getElementById('itemName');
  const bestBefore=document.getElementById('bestBefore');
  const location=document.getElementById('location');
  if (name.value && location.value && bestBefore.value){
    firebase.firestore().collection("items").doc(name.value.toLowerCase()).set({   
    item: name.value,
    date: Date.now(),
    location: location.value,
    bestBefore: bestBefore.value
    });
  }
  addForm.style.display = 'none';
})

window.onload = populateTable()

function populateTable(){
  firebase.firestore().collection("items").orderBy("date").onSnapshot((snaps) => {
    body.innerHTML = "";
    snaps.forEach((doc) => {
      const headers = ['item', 'bestBefore', 'location', 'date'] 
      let i;
      const row = document.createElement("tr");
      if (search.value != undefined) {
        search.value = search.value.toLowerCase()
      }
      if (doc.data().item.toLowerCase().includes(search.value)){
        for (i of headers){
            const item = document.createElement("td");
            item.textContent = (doc.data()[i]);
            if (i=="date"){
              let date = Date(doc.data()[i]);
              item.textContent = date.slice(0, 15);
            }
            row.appendChild(item);
        }
        let remove = document.createElement("button");
        remove.innerHTML = "X";
        remove.onclick = function() {removeitem(doc.data().item);}
        row.appendChild(remove);
      }
    
    body.appendChild(row);
    });
 });
}

function removeitem(item){
  firebase.firestore().collection("items").doc(item.toLowerCase()).delete();
  
}