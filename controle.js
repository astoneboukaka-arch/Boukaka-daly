/*=========================================================
    TypeRush
    Partie 1 : Initialisation
=========================================================*/

/*=========================================================
    Récupération des éléments HTML
=========================================================*/

const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");

const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const bestScoreElement = document.getElementById("bestScore");

const difficultySelect = document.getElementById("difficulty");
const newTestButton = document.getElementById("newTest");

const resultPanel = document.getElementById("result");

const resultTime = document.getElementById("resultTime");
const resultWPM = document.getElementById("resultWPM");
const resultAccuracy = document.getElementById("resultAccuracy");

const performance = document.getElementById("performance");

/*=========================================================
    Variables globales
=========================================================*/

let currentText = "";

let timer = null;

let time = 0;

let started = false;

let finished = false;

let correctCharacters = 0;

let wrongCharacters = 0;

let totalTyped = 0;

let currentDifficulty = "easy";

/*=========================================================
    Bibliothèque des textes
=========================================================*/

const texts = {

easy: [

"Le chat dort sur le canapé pendant que le soleil brille dehors et les oiseaux chantent doucement dans le jardin.",

"Chaque matin nous marchons jusqu à l école avec nos amis avant de commencer les cours dans la bonne humeur.",

"Les enfants jouent dans le parc avec un ballon pendant que leurs parents discutent sur un banc voisin.",

"Il fait beau aujourd hui et tout le monde profite du temps agréable pour sortir se promener tranquillement.",

"Mon frère aime lire des livres simples pendant que ma sœur écoute de la musique dans sa chambre."

],

medium: [

"Les nouvelles technologies facilitent notre quotidien mais elles demandent également un apprentissage constant afin de rester compétitif dans le monde professionnel.",

"Chaque étudiant doit organiser son temps efficacement pour réussir ses examens tout en développant ses compétences techniques et personnelles.",

"Les voyages permettent de découvrir différentes cultures d échanger avec des habitants et de vivre des expériences enrichissantes pour toute la vie.",

"Une bonne alimentation associée à une activité physique régulière contribue au maintien d une excellente santé et améliore la qualité de vie.",

"Les entreprises investissent dans la transformation numérique afin d optimiser leurs processus et offrir de meilleurs services à leurs clients."

],

hard: [

"JavaScript permet de manipuler dynamiquement le DOM, d'intercepter les événements utilisateur, de modifier les styles CSS et d'améliorer considérablement l'expérience utilisateur.",

"Le protocole HTTPS chiffre les communications entre le navigateur et le serveur grâce aux certificats SSL/TLS, garantissant ainsi confidentialité, intégrité et authentification.",

"Les développeurs utilisent fréquemment Git afin de gérer efficacement les versions d'un projet, résoudre les conflits et collaborer simultanément sur plusieurs fonctionnalités.",

"Une architecture logicielle bien conçue repose sur des principes comme SOLID, l'encapsulation, la modularité, les tests unitaires et la séparation des responsabilités.",

"Les performances d'une application web dépendent notamment du temps de chargement, de l'optimisation des ressources, du cache navigateur et de la réduction des requêtes HTTP."

]

};

/*=========================================================
    Chargement du meilleur score
=========================================================*/

function loadBestScore(){

const score = localStorage.getItem(
"best_" + currentDifficulty
);

if(score === null){

bestScoreElement.textContent = "0";

}else{

bestScoreElement.textContent = score;

}

}

/*=========================================================
    Choix d'un texte aléatoire
=========================================================*/

function randomText(){

const list = texts[currentDifficulty];

const index = Math.floor(

Math.random() * list.length

);

return list[index];

}

/*=========================================================
    Affichage du texte
=========================================================*/

function displayText(){

textDisplay.innerHTML = "";

currentText = randomText();

currentText.split("").forEach(character=>{

const span = document.createElement("span");

span.innerText = character;

textDisplay.appendChild(span);

});

textDisplay.firstChild.classList.add("current");

}

/*=========================================================
    Réinitialisation
=========================================================*/

function resetGame(){

clearInterval(timer);

timer = null;

time = 0;

started = false;

finished = false;

correctCharacters = 0;

wrongCharacters = 0;

totalTyped = 0;

timerElement.textContent = "0 s";

wpmElement.textContent = "0";

accuracyElement.textContent = "100%";

textInput.value = "";

resultPanel.classList.add("hidden");

loadBestScore();

displayText();

textInput.focus();

}

/*=========================================================
    Changement de difficulté
=========================================================*/

difficultySelect.addEventListener("change",()=>{

currentDifficulty = difficultySelect.value;

resetGame();

});

/*=========================================================
    Nouveau test
=========================================================*/

newTestButton.addEventListener("click",()=>{

resetGame();

});

/*=========================================================
    Initialisation
=========================================================*/

window.addEventListener("load",()=>{

currentDifficulty = difficultySelect.value;

resetGame();

});
/*=========================================================
    PARTIE 2
    Chronomètre + Saisie + Calculs
=========================================================*/

/*=========================================================
    Démarrage du chronomètre
=========================================================*/

function startTimer() {

    if (started) return;

    started = true;

    timer = setInterval(() => {

        time++;

        timerElement.textContent = time + " s";

        calculateWPM();

    }, 1000);

}

/*=========================================================
    Calcul du WPM
=========================================================*/

function calculateWPM() {

    if (time === 0) {

        wpmElement.textContent = "0";

        return;

    }

    const words = correctCharacters / 5;

    const minutes = time / 60;

    const wpm = Math.round(words / minutes);

    wpmElement.textContent = isFinite(wpm) ? wpm : 0;

}

/*=========================================================
    Calcul de la précision
=========================================================*/

function calculateAccuracy() {

    if (totalTyped === 0) {

        accuracyElement.textContent = "100%";

        return;

    }

    const accuracy = Math.round(

        (correctCharacters / totalTyped) * 100

    );

    accuracyElement.textContent = accuracy + "%";

}

/*=========================================================
    Analyse de la saisie
=========================================================*/

textInput.addEventListener("input", () => {

    if (!started) {

        startTimer();

    }

    if (finished) return;

    const typedCharacters = textInput.value.split("");

    const displayCharacters = textDisplay.querySelectorAll("span");

    correctCharacters = 0;

    wrongCharacters = 0;

    totalTyped = typedCharacters.length;

    displayCharacters.forEach((characterSpan, index) => {

        const typed = typedCharacters[index];

        characterSpan.classList.remove(

            "correct",

            "incorrect",

            "current"

        );

        if (typed == null) {

            characterSpan.classList.add("current");

            return;

        }

        if (typed === characterSpan.innerText) {

            characterSpan.classList.add("correct");

            correctCharacters++;

        } else {

            characterSpan.classList.add("incorrect");

            wrongCharacters++;

        }

    });

    /*=========================================
        Curseur courant
    =========================================*/

    displayCharacters.forEach(span => {

        span.classList.remove("current");

    });

    if (typedCharacters.length < displayCharacters.length) {

        displayCharacters[typedCharacters.length]

            .classList.add("current");

    }

    calculateAccuracy();

    calculateWPM();

    /*=========================================
        Fin du test
    =========================================*/

    if (

        typedCharacters.length === displayCharacters.length

    ) {

        const completed = [...displayCharacters].every(

            span => span.classList.contains("correct")

        );

        if (completed) {

            finished = true;

            clearInterval(timer);

            showResults();

        }

    }

});

/*=========================================================
    Blocage du collage
=========================================================*/

textInput.addEventListener("paste", (event) => {

    event.preventDefault();

});

/*=========================================================
    Gestion des touches spéciales
=========================================================*/

textInput.addEventListener("keydown", (event) => {

    if (finished) {

        event.preventDefault();

        return;

    }

});



/*=========================================================
    Focus automatique
=========================================================*/

window.addEventListener("click", () => {

    textInput.focus();

});

/*=========================================================
    Mise à jour continue
=========================================================*/

setInterval(() => {

    if (!finished && started) {

        calculateWPM();

        calculateAccuracy();

    }

}, 500);


/*=========================================================
    PARTIE 3
    Résultats + LocalStorage + Finalisation
=========================================================*/

/*=========================================================
    Affichage des résultats
=========================================================*/

function showResults() {

    clearInterval(timer);

    calculateWPM();
    calculateAccuracy();

    const finalWPM = parseInt(wpmElement.textContent);
    const finalAccuracy = parseInt(accuracyElement.textContent);

    resultTime.textContent = time + " secondes";
    resultWPM.textContent = finalWPM + " WPM";
    resultAccuracy.textContent = finalAccuracy + "%";

    resultPanel.classList.remove("hidden");

    updateBestScore(finalWPM);

    performance.textContent = getPerformanceMessage(
        finalWPM,
        finalAccuracy
    );

}

/*=========================================================
    Sauvegarde du meilleur score
=========================================================*/

function updateBestScore(score){

    const key = "best_" + currentDifficulty;

    const saved = Number(localStorage.getItem(key)) || 0;

    if(score > saved){

        localStorage.setItem(key, score);

        bestScoreElement.textContent = score;

    }else{

        bestScoreElement.textContent = saved;

    }

}

/*=========================================================
    Message de performance
=========================================================*/

function getPerformanceMessage(wpm, accuracy){

    if(accuracy < 70){

        return "⚠️ Beaucoup d'erreurs. Concentrez-vous davantage.";

    }

    if(wpm < 20){

        return "🐢 Débutant : continuez à vous entraîner.";

    }

    if(wpm < 40){

        return "🙂 Bon travail ! Vous progressez.";

    }

    if(wpm < 60){

        return "🚀 Très bonne vitesse !";

    }

    if(wpm < 80){

        return "🔥 Excellent ! Vous tapez très rapidement.";

    }

    return "🏆 Niveau expert ! Impressionnant.";

}

/*=========================================================
    Réinitialisation complète
=========================================================*/

function clearStatistics(){

    correctCharacters = 0;

    wrongCharacters = 0;

    totalTyped = 0;

    time = 0;

    started = false;

    finished = false;

    clearInterval(timer);

    timer = null;

    timerElement.textContent = "0 s";

    wpmElement.textContent = "0";

    accuracyElement.textContent = "100%";

}

/*=========================================================
    Fonction de redémarrage
=========================================================*/

function restartGame(){

    clearStatistics();

    textInput.value = "";

    resultPanel.classList.add("hidden");

    displayText();

    loadBestScore();

    textInput.focus();

}

/*=========================================================
    Bouton Nouveau Test
=========================================================*/

newTestButton.addEventListener("click", restartGame);

/*=========================================================
    Changement de niveau
=========================================================*/

difficultySelect.addEventListener("change", () => {

    currentDifficulty = difficultySelect.value;

    restartGame();

});

/*=========================================================
    Empêcher la soumission avec Entrée
=========================================================*/

textInput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        event.preventDefault();

    }

});

/*=========================================================
    Focus automatique
=========================================================*/

window.addEventListener("load", function(){

    textInput.focus();

});

/*=========================================================
    Raccourci clavier F2
=========================================================*/

document.addEventListener("keydown", function(event){

    if(event.key === "F2"){

        event.preventDefault();

        restartGame();

    }

});

/*=========================================================
    Désactiver le menu contextuel (optionnel)
=========================================================*/

textInput.addEventListener("contextmenu", function(event){

    event.preventDefault();

});

/*=========================================================
    Vérification finale
=========================================================*/

function verifyCompletion(){

    const spans = textDisplay.querySelectorAll("span");

    let valid = true;

    spans.forEach(span=>{

        if(!span.classList.contains("correct")){

            valid = false;

        }

    });

    if(valid && !finished){

        finished = true;

        showResults();

    }

}

/*=========================================================
    Mise à jour régulière
=========================================================*/

setInterval(function(){

    if(started && !finished){

        verifyCompletion();

    }

},200);

/*=========================================================
    Fin du script
=========================================================*/

console.log("======================================");

console.log("TypeRush initialisé avec succès");

console.log("Projet HTML CSS JavaScript Vanilla");

console.log("Compatible Chrome / Firefox");

console.log("======================================");