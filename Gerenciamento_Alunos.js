// Array com os estudantes cadastrados
var REGISTERED_STUDENTS = ["Luana", "Miguel", "Matheus", "Maria", "Ana", "Cavalcante", "Roberta",
  "Beatriz", "Josivan", "Rafaela", "Fellipe"];

var stream = null;
var cameraOn = false;

var video = document.getElementById("video");
var btnCamera = document.getElementById("btn-camera");
var cameraOffEl = document.getElementById("camera-off");
var scanOverlay = document.getElementById("scan-overlay");
var verifySection = document.getElementById("verify-section");
var inputName = document.getElementById("input-name");
var hintEl = document.getElementById("hint");
var statusEl = document.getElementById("status");

hintEl.textContent = "Alunos cadastrados: " + REGISTERED_STUDENTS.join(", ");

// Liga a câmera
async function toggleCamera() {
  try {
    if (cameraOn) {
      stopCamera();
      updateUI(false);
      return;
    }

    stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Abre a camera no elemento <video>

    video.srcObject = stream;
    cameraOn = true;

    updateUI(true);
  } catch (error) {
    alert("Não foi possível acessar a câmera.");
    console.error(error);
  }

  
  // Te escuta para verifacar acesso
  var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "pt-BR"; // idioma português
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function (event) {
    var nomeFalado = event.results[0][0].transcript.trim().toLowerCase();
    console.log("Você disse:", nomeFalado);

    // Verifica se o nome está na lista
    var posicao = REGISTERED_STUDENTS.findIndex(
      aluno => aluno.toLowerCase() === nomeFalado
    );

    if (posicao !== -1) {
      statusEl.className = "status granted";
      statusEl.innerHTML = `<strong>Acesso Liberado!</strong> Bem-vindo(a), ${REGISTERED_STUDENTS[posicao]}`;
    } else {
      statusEl.className = "status denied";
      statusEl.innerHTML = `<strong>Acesso Negado!</strong> "${nomeFalado}" não está cadastrado(a).`;
    }
  };

  // Inicia a escuta
  recognition.start();
}


//Desliga a câmera
function stopCamera() {

  // encerra a captura da câmera, limpa os recursos e atualiza a interface para refletir 
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  video.srcObject = null;
  cameraOn = false;
}

// Altera o front-end
function updateUI(isOn) {
  video.classList.toggle("active", isOn);
  cameraOffEl.classList.toggle("hidden", isOn);
  scanOverlay.classList.toggle("hidden", !isOn);
  verifySection.classList.toggle("hidden", !isOn);
  statusEl.classList.add("hidden");

  btnCamera.classList.toggle("btn-danger", isOn);
  btnCamera.classList.toggle("btn-primary", !isOn);
  btnCamera.textContent = isOn
    ? "📷 Desligar Câmera"
    : "📷 Ligar Câmera";
}

function verifyAccess() {
  var name = inputName.value.trim(); // Tiramos os espaços: trim();
  if (!name) return; // Vê se é uma string vazia

  inputName.value = "";
  statusEl.classList.remove("hidden", "granted", "denied");

  // Forçar reflow para reiniciar a animação
  void statusEl.offsetWidth;

  var posicao = REGISTERED_STUDENTS.findIndex(verifyName => verifyName === name) // Acho a posição do "name". Ex: 0, 1, 2, 3, 4,

  if ((posicao) !== -1) {
    statusEl.className = "status granted";
    statusEl.innerHTML =
      '<span class="status-icon">🛡️</span>' +
      '<div class="status-text"><strong>Acesso Liberado!</strong>' +
      "<span>Bem-vindo(a), " + name + ". Porta aberta.</span></div>";
    scanOverlay.classList.add("hidden");
  } else {
    console.log(name, posicao);
    statusEl.className = "status denied";
    statusEl.innerHTML =
      '<span class="status-icon">🚫</span>' +
      '<div class="status-text"><strong>Acesso Negado!</strong>' +
      '<span>"' + name + '" não está cadastrado(a) nesta turma.</span></div>';
  }

}


