/* Funkce přihlášování do Netlify CMS */
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

/* Google Maps */
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 48.973911, lng: 14.47502 },
    zoom: 8
  });
}

/* Vlastní funkce */
function zvetsiText() {
  document.getElementById("brandChange").style.fontSize = "x-large";
}
function zmensiText(element) {
  document.getElementById("brandChange").style.fontSize = "";
}

/* Particles.js */
particlesJS.load(
  "particles-js",
  "/assets/js/particlesjs-config.json",
  function() {
    console.log("particlesjs-config.json loaded...");
  }
);
