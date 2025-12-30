document.addEventListener("DOMContentLoaded", () =>{
    const load = (selector, file) =>{
        fetch(file)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        });
    };

    load("#nav", "nav.html");
    load("#footer", "footer.html");
});