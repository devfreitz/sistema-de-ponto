const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbwIs-zjiJTvaaOGjnvYKXnzzEZQwpeoRBzxe8bYgd4TmZUnDkHjwy5NNi9_Yt-TL7_K0Q/exec";
const NOME_FIXO = "Davi Caller";

// ===============================
// 🌅 SAUDAÇÃO AUTOMÁTICA
// ===============================
function atualizarSaudacao(){
  const hora = new Date().getHours();
  let mensagem = "";

  if(hora < 12){
    mensagem = "🌅 Bom dia! Vamos pra cima 💼";
  } else if(hora < 18){
    mensagem = "☀️ Boa tarde! Foco no trabalho 🚀";
  } else {
    mensagem = "🌙 Boa noite! Finalizando o dia 💪";
  }

  document.getElementById("saudacao").innerText = mensagem;
}
atualizarSaudacao();

// ===============================
// 🔒 CONTROLE ANTI DUPLICAÇÃO
// ===============================
const hoje = new Date().toLocaleDateString("pt-BR");

function jaRegistrado(tipo){
  return localStorage.getItem(tipo) === hoje;
}

function marcarRegistrado(tipo){
  localStorage.setItem(tipo, hoje);
}

// Reset automático ao virar o dia
function verificarVirada(){
  const controle = localStorage.getItem("dataControle");
  if(controle !== hoje){
    localStorage.clear();
    localStorage.setItem("dataControle", hoje);
  }
}
verificarVirada();

// ===============================
// 🚀 REGISTRAR PONTO
// ===============================
function registrar(tipo){

  if(jaRegistrado(tipo)){
    mostrarNotificacao("⚠️ Já registrado hoje!", "fa-triangle-exclamation");
    return;
  }

  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR");
  const horario = agora.toLocaleTimeString("pt-BR");

  fetch(URL_SCRIPT,{
    method:"POST",
    body: JSON.stringify({
      nome: NOME_FIXO,
      data: data,
      tipo: tipo,
      horario: horario
    })
  })
  .then(res=>res.json())
  .then(()=>{
    marcarRegistrado(tipo);
    desativarBotao(tipo);

    let mensagemPersonalizada = "";
    let icone = "";

    if(tipo === "Entrada"){
      mensagemPersonalizada = "Entrada registrada! 💼 Bom trabalho!";
      icone = "fa-door-open";
    }

    if(tipo === "Inicio Intervalo"){
      mensagemPersonalizada = "Intervalo iniciado ☕ Bom descanso!";
      icone = "fa-mug-hot";
    }

    if(tipo === "Fim Intervalo"){
      mensagemPersonalizada = "Fim do intervalo 🔥 Partiu trabalhar!";
      icone = "fa-rotate-left";
    }

    if(tipo === "Saida"){
      mensagemPersonalizada = "Saída registrada 🌙 Bom descanso até amanhã!";
      icone = "fa-right-from-bracket";
    }

    mostrarNotificacao(mensagemPersonalizada, icone);

  })
  .catch(()=>{
    mostrarNotificacao("❌ Erro ao registrar", "fa-xmark");
  });
}

// ===============================
// 🔒 DESATIVAR BOTÃO
// ===============================
function desativarBotao(tipo){
  const botoes = document.querySelectorAll("button");

  botoes.forEach(btn=>{
    if(btn.innerText.includes(tipo)){
      btn.disabled = true;
    }
  });
}

// Bloqueia ao carregar se já registrado
window.onload = function(){
  ["Entrada","Inicio Intervalo","Fim Intervalo","Saida"].forEach(tipo=>{
    if(jaRegistrado(tipo)){
      desativarBotao(tipo);
    }
  });
};

// ===============================
// 🔔 NOTIFICAÇÃO TOPO PROFISSIONAL
// ===============================
function mostrarNotificacao(msg, icone){

  const notif = document.getElementById("notificacao");

  notif.innerHTML = `<i class="fa-solid ${icone}"></i> ${msg}`;
  notif.classList.add("mostrar");

  setTimeout(()=>{
    notif.classList.remove("mostrar");
  },3000);
}