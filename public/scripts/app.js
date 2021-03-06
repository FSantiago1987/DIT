// IIFE 
(function(){
    function Start()
    {
        console.log("App Started...");

        let deleteButtons = document.querySelectorAll('.cancel');
        let logoutButtons = document.querySelectorAll('.logout');

        for (button of deleteButtons) {
            button.addEventListener('click', (event) =>{
              let blockDelete = false;
              if(!blockDelete)
              {
                  blockDelete = true;
                  if(!confirm("Are you sure you want to delete this item?"))
                  {
                    event.preventDefault();
                    //window.location.assign('/radial-list');
                  }
              }
            });

          }

            for (button of logoutButtons) {
              button.addEventListener('click', (event) =>{
                let blockDelete = false;
                if(!blockDelete)
                {
                    blockDelete = true;
                    if(!confirm("Are you sure you want to logout?"))
                    {
                      event.preventDefault();
                      //window.location.assign('/radial-list');
                    }
                }
              });
          }
        }

    window.addEventListener("load", Start);
})();

// Search autocomplete list
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  
  }

  // Display found radials
  function findTitle() {
    let searchingWord = document.getElementById("searchTitle").value;
    let menusDiv = document.getElementById("menusDiv");

    let cardDiv = menusDiv.getElementsByClassName("col-md-4");

    let menusDivClass = menusDiv.getElementsByClassName("card-text");
    
    for(let i = 0; i < menusDivClass.length; i++) {
      cardDiv[i].style.display = "block";
    }
    
    for(let i = 0; i < menusDivClass.length; i++) {
      if(searchingWord != menusDivClass[i].innerHTML) {
        cardDiv[i].style.display = "none";
      }
    }
  }

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.2)";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}

// display list page six field only
$(function(){
  if($("div").is('#menusDiv')){
    let tables = document.getElementsByClassName('table-borderless');
    for(let i = 0; i < tables.length; i++) {
      let innerTr = tables[i].getElementsByTagName("TR");
      for(let a = 6; a < innerTr.length; a++) {
        innerTr[a].style.display = "none";
      }
    }
  }
});

/*
function next_click(clicked_id) {
  let nonFields = 0;
  let tFields = 0;
  let nonFieldsCount = 0
  let table = document.getElementById("table" + clicked_id.substr(4));
  let innerTr = table.getElementsByTagName("TR");
  for(let i = 0; i < innerTr.length; i++ ) {
    if(innerTr[i].style.display != "none" && (innerTr.length - nonFieldsCount > 6)) {
      nonFields += 1;
      innerTr[i].style.display = "none";
    }
    else if(nonFields > 5) {
      tFields += 1;
      if(tFields <= 6) {
        innerTr[i].style.display = "table-row";
      }
    }
    else {
      nonFieldsCount += 1;
    }
  }
}

function previous_click(clicked_id) {
  let nonFields = 0;
  let tFields = 0;
  let nonFieldsCount = 0
  let table = document.getElementById("table" + clicked_id.substr(8));
  let innerTr = table.getElementsByTagName("TR");
  for(let i = innerTr.length; i--;){
    if(innerTr[i].style.display != "none" && (innerTr.length - nonFieldsCount > 6)) {
      nonFields += 1;
      innerTr[i].style.display = "none";
    }
    else if(nonFields >= 1) {
      tFields += 1;
      if(tFields <= 6) {
        innerTr[i].style.display = "table-row";
      }
    }
    else {
      nonFieldsCount += 1;
    }
  }
}
*/

function addElements() {
  let form = document.getElementById("addForm");
  let submitBtn = document.querySelector("#submitBtn");
  let innerTitle = document.getElementsByClassName("inputsTitle");
  let innerField = document.getElementsByClassName("inputsField");

  let titleDiv = document.createElement("div");
  titleDiv.classList.add("form-group", "fonticonUpdate");
  form.appendChild(titleDiv);

  let fieldDiv = document.createElement("div");
  fieldDiv.classList.add("form-group", "fonticon");
  form.appendChild(fieldDiv);

  submitBtn.before(titleDiv);
  submitBtn.before(fieldDiv);


  let iTitle = document.createElement("i");
  iTitle.classList.add("fas", "fa-list", "fa-lg");
  titleDiv.appendChild(iTitle);

  let iField = document.createElement("i");
  iField.classList.add("fas", "fa-comment", "fa-lg");
  fieldDiv.appendChild(iField);


  let label = document.createElement("label");
  label.classList.add("labelList");
  label.innerHTML = stringifyNumber(innerTitle.length + 1) +" Text Field";
  titleDiv.appendChild(label);

  let inputTitle = document.createElement("input");
  inputTitle.classList.add("form-control", "inputsTitle");
  inputTitle.name = "field";
  inputTitle.placeholder = "Enter the title " + stringifyNumber(innerTitle.length + 1)  + " Text Field";
  titleDiv.appendChild(inputTitle);

  let inputField = document.createElement("input");
  inputField.classList.add("form-control", "inputsField");
  inputField.name = "field";
  inputField.placeholder = "Enter the " + stringifyNumber(innerField.length + 1)  + " Text Field";
  fieldDiv.appendChild(inputField);
}

var special = ['zeroth','First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'];
var deca = ['Twent', 'Thirt', 'Fort', 'Fift', 'Sixt', 'Sevent', 'Eight', 'Ninet'];

function stringifyNumber(n) {
if (n < 20) return special[n];
if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
}

function sendId(clicked) {
  let shareLink = document.getElementById("share-link");
  shareLink.href = "/radial-list/share/" + clicked;
}

function getEmail() {
  let email = document.getElementById("recipient-email").value;
  let shareLink = document.getElementById("share-link");
  shareLink.href = shareLink.href + "/" + email;
}

function getCategory() {
  let category = document.getElementById("addCategory").value;
  if(category == "") {
    alert("Please enter category name first");
    return;
  }
  let href = "/radial-list/add-category/" + category
  window.location=href;
}

function getContactValue(objButton) {
  let contact = objButton.value;
  let emailInput = document.getElementById("recipient-email");
  emailInput.value = contact;
}

function checkCategory() {
  alert(window.location.href);
}

function forgotPassword() {
  let forgotDiv = document.getElementById("forgotDiv");
  forgotDiv.innerHTML = "Please contact us via e-mail: <span class='white-color'>info@gnomontalk.com</span>"
}
