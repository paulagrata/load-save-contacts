var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;
var currentContactIndex = 0; 
var first = []; 

function initApplication() {
    console.log('mustang v3 starting meow'); 
}

function setStatus(status) {
    document.getElementById("statusID").innerHTML = status;    
}

function logContacts() {
    console.log("contact array: ");
    console.log(contactArray);
    document.getElementById("logID").innerHTML = "contacts logged to console";
}


function importContacts() {
    console.log("importContacts()");
    loadIndex(); 
}

function saveContactsToServer() {
    console.log("saveContactsToServer()");
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('response: ' + this.responseText);
            setStatus(this.responseText)
        }
    };
    xmlhttp.open("POST", "save-contacts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("contacts=" + JSON.stringify(contactArray));   
}

function loadContactsFromServer() {
    console.log("loadContactsFromServer()");
    contactArray.length = 0;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            contactArray = JSON.parse(this.responseText);
            setStatus("Loaded contacts (" + contactArray.length + ")");
            currentContactIndex = 0;
            viewCurrentContact()
        }
    };
    xmlhttp.open("GET", "load-contacts.php", true);
    xmlhttp.send();   
}

function viewCurrentContact() {
    currentContact = contactArray[currentContactIndex];
    console.log("Current Contact: ");
    console.log(contactArray[currentContactIndex]);
    document.getElementById("nameID").value = currentContact.firstName;   
    document.getElementById("emailID").value = currentContact.email;   
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;  
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contactArray.length;
}

function previous() {
    if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
}

function next() {
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
}

function newContact() {
    console.log('new()');
    document.getElementById("nameID").value = "";   
    document.getElementById("emailID").value = "";   
    document.getElementById("cityID").value = "";   
    document.getElementById("stateID").value = "";
    document.getElementById("zipID").value = ""; 
}

function add() {
    console.log('add()');
    var newContact = {
        firstName : document.getElementById("nameID").value,   
        email : document.getElementById("emailID").value,  
        city : document.getElementById("cityID").value,   
        state : document.getElementById("stateID").value,
        zip : document.getElementById("zipID").value,  
    }
    first.push(newContact.firstName)
    contactArray.push(newContact);
    currentContactIndex = currentContactIndex + 1;
    viewCurrentContact();
    document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);
}

function remove() {
    if(contactArray.length > 1){
        console.log('Contact Is Removed.');
        contactArray.splice(currentContactIndex,1)
        first.splice(currentContactIndex,1)
        if(currentContactIndex>=1){
        currentContactIndex = currentContactIndex - 1;
        }
        viewCurrentContact();
        document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);
    } else {
        document.getElementById("add").innerHTML = "you must Keep one contact in your contact list!!"
    }
}

function getPlace() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if (document.getElementById("cityID").value == "" || document.getElementById("cityID").value == " ")
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

//source: w3
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function lookup(){
    var inputSearch = document.getElementById("myInput").value;
    for(var i = 0; i<contactArray.length;i++){
        if(contactArray[i].firstName == inputSearch){
            document.getElementById("nameID").value = contactArray[i].firstName
            document.getElementById("emailID").value = contactArray[i].email;   
            document.getElementById("cityID").value = contactArray[i].city;   
            document.getElementById("stateID").value = contactArray[i].state;
            document.getElementById("zipID").value = contactArray[i].zip;  
        }
    }
}


async function loadIndex() {
    const response = await fetch("https://mustangversion1.azurewebsites.net/index.json")
    const contactIndex = await response.text()
    console.log(contactIndex);
    document.getElementById("indexID").innerHTML = contactIndex
    const response2 = await fetch("https://mustang-index.azurewebsites.net/index.json")
    const contactIndexJ = await response2.json()
    
    for (i=0; i<contactIndexJ.length; i++) {
        contactURLArray.push(contactIndexJ[i].ContactURL);
    } console.log("contactURL: " + JSON.stringify(contactURLArray));
}


function loadContacts() {
    contactArray.length = 0;
    loadingContact = 0;
    if (contactURLArray.length > loadingContact) {
        loadNextContact(contactURLArray[loadingContact]);
    }
}

async function loadNextContact(URL) {
    const response = await fetch(URL);
    const contactRequest = await response.text();

    var contact;
    contact = JSON.parse(contactRequest);

    var i = (contact.firstName);
    first.push(i);
    autocomplete(document.getElementById("myInput"), first);
   
    contactArray.push(contact);
    document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray,null,2);
    document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;
    loadingContact++;
    if (contactURLArray.length > loadingContact) {
        loadNextContact(contactURLArray[loadingContact]);
    }
    else {
        document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
        viewCurrentContact()
    
    }
    
}
