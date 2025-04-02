document.getElementById("showFormButton").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "flex";  // Laat overlay zien
});

document.getElementById("closeFormButton").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "none";  // sluit overlay
});
