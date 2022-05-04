"use strict";


// Get the whole navbar, the button and the dropdown contents
var nav = document.getElementById('dropdownID');
var dropdown = document.getElementById('dropdowncontID');
var dropbtn = document.getElementById('dropbtnID');

// Initial check
if(window.innerWidth >= 800){
    nav.classList.remove('dropdown');
    dropdown.classList.remove('dropdown-content');
    dropbtn.classList.remove('dropbtn');
    nav.classList.add('navbar');
}
else{
    nav.classList.add('dropdown');
    dropdown.classList.add('dropdown-content');
    dropbtn.classList.add('dropbtn');
    nav.classList.remove('navbar');
}

// Resize event
window.addEventListener('resize', function(){
    if(window.matchMedia("(min-width: 800px)").matches){
        nav.classList.remove('dropdown');
        dropdown.classList.remove('dropdown-content');
        dropbtn.classList.remove('dropbtn');
        nav.classList.add('navbar');
    }
    else{
        nav.classList.add('dropdown');
        dropdown.classList.add('dropdown-content');
        dropbtn.classList.add('dropbtn');
        nav.classList.remove('navbar');
    }
})
