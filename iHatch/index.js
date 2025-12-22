document.addEventListener("DOMContentLoaded", () =>{
    const loadPartial = (selector, file) =>{
        fetch(file)
        .then(response => response.text())
        .then(data =>{
            document.querySelector(selector).innerHTML = data;
        });
    };

    loadPartial("#nav", "/nav.html");
    loadPartial("#footer", "footer.html");
});



