const five = require("johnny-five");
const placa = new five.Board({ port: "COM4" });

placa.on("ready", encender);

function encender() {
  //Pines de conexión
  const ledAzul = new five.Led(9);
  const ledRojo = new five.Led(10);
  const ledAmarillo = new five.Led(11);
  const ledVerde = new five.Led(6);
  const botonIniciar = new five.Button(7);
  const botonAzul = new five.Button(2);
  const botonRojo = new five.Button(3);
  const botonAmarillo = new five.Button(4);
  const botonVerde = new five.Button(5);

  //varios
  const repeticiones = []; //<--donde se guardardará la secuencia aleatoria
  const cantidadDeLeds = 4; //<-- son la cantidad de numeros aleatorios que dará Match.random
  var ultimoBotonPulsado = 5; //<--variable para saber último botón pulsado
  var subnivel = 0; //<-- variable del subnivel del juego para elegir el numero del array repeticiones

  //Opciones del Juego
  const ultimoNivel = 10; //<-- ultimo nivel para la victoria
  var nivel = 1; //<-- nivel en el que empieza el juego
  const velocidadDelJuego = 600; //<-- velocidad del encendido de luces del juego

  //eventos
  botonIniciar.on("down", iniciar);

  function agregarEventos() {
    botonAzul.on("down", encenderAzul);
    botonAzul.on("up", apagarAzul);
    botonRojo.on("down", encenderRojo);
    botonRojo.on("up", apagarRojo);
    botonAmarillo.on("down", encenderAmarillo);
    botonAmarillo.on("up", apagarAmarillo);
    botonVerde.on("down", encenderVerde);
    botonVerde.on("up", apagarVerde);
  }

  function removerEventos() {
    botonAzul.off("down", encenderAzul);
    botonAzul.off("up", apagarAzul);
    botonRojo.off("down", encenderRojo);
    botonRojo.off("up", apagarRojo);
    botonAmarillo.off("down", encenderAmarillo);
    botonAmarillo.off("up", apagarAmarillo);
    botonVerde.off("down", encenderVerde);
    botonVerde.off("up", apagarVerde);
  }

  //funciones encender leds
  function encenderAzul() {
    ledAzul.on();
    ultimoBotonPulsado = 0;
  }
  function encenderRojo() {
    ledRojo.on();
    ultimoBotonPulsado = 1;
  }
  function encenderAmarillo() {
    ledAmarillo.on();
    ultimoBotonPulsado = 2;
  }
  function encenderVerde() {
    ledVerde.on();
    ultimoBotonPulsado = 3;
  }

  //funciones apagar leds
  function apagarAzul() {
    ledAzul.off();
    jugador();
  }
  function apagarRojo() {
    ledRojo.off();
    jugador();
  }
  function apagarAmarillo() {
    ledAmarillo.off();
    jugador();
  }
  function apagarVerde() {
    ledVerde.off();
    jugador();
  }

  //Crear secuencia aleatoria
  function secuenciaAleatoria() {
    for (let i = 0; i < ultimoNivel; i++) {
      repeticiones[i] = Math.floor(Math.random() * cantidadDeLeds);
    }
  }

  //Traducir numeros de la secuencia aleatoria a leds
  function traducirNumeroALed(numero) {
    switch (numero) {
      case 0:
        return ledAzul;
      case 1:
        return ledRojo;
      case 2:
        return ledAmarillo;
      case 3:
        return ledVerde;
    }
  }

  //Iluminar los colores de la secuencia
  function iluminarColor(color) {
    color.on();
    setTimeout(() => color.off(), velocidadDelJuego - 300);
  }

  //Iluminar secuencia
  function iluminarSecuencia() {
    for (let i = 0; i < nivel; i++) {
      const color = traducirNumeroALed(repeticiones[i]);
      setTimeout(() => iluminarColor(color), velocidadDelJuego * i);
    }
  }

  //Opciones del jugador, acertar o fallar
  function jugador() {
    var eleccion = repeticiones[subnivel];
    if (eleccion === ultimoBotonPulsado) {
      subnivel++;
      if (subnivel === nivel) {
        nivel++;
        if (nivel === ultimoNivel + 1) {
          removerEventos();
          console.log("Ganaste!!");
          ledAzul.blink(500);
          ledRojo.blink(500);
          ledAmarillo.blink(500);
          ledVerde.blink(500);
        } else {
          subnivel = 0;
          removerEventos();
          setTimeout(() => {
            iluminarSecuencia();
            setTimeout(() => {
              agregarEventos();
            }, velocidadDelJuego * nivel);
          }, 1000);
        }
      }
    } else {
      removerEventos();
      console.log("Perdiste!!");
      ledAzul.on();
      ledRojo.on();
      ledAmarillo.on();
      ledVerde.on();
    }
  }

  //Iniciar juego
  function iniciar() {
    nivel = 1;
    subnivel = 0;
    ledAzul.fadeOut();
    ledRojo.fadeOut();
    ledAmarillo.fadeOut();
    ledVerde.fadeOut();
    ledAzul.off();
    ledRojo.off();
    ledAmarillo.off();
    ledVerde.off();
    secuenciaAleatoria();
    console.log(repeticiones);
    setTimeout(() => {
      iluminarSecuencia();
      setTimeout(() => {
        agregarEventos();
      }, velocidadDelJuego * nivel);
    }, 1500);
  }

  //Animación Inicial del juego
  function animacionInicial() {
    ledAzul.fade({
      easing: "linear",
      duration: 5000,
      cuePoints: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      keyFrames: [0, 250, 0, 0, 0, 0, 0, 250, 0, 250, 0],
      loop: true,
    });
    ledRojo.fade({
      easing: "linear",
      duration: 5000,
      cuePoints: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      keyFrames: [0, 0, 250, 0, 0, 0, 250, 0, 0, 250, 0],
      loop: true,
    });
    ledAmarillo.fade({
      easing: "linear",
      duration: 5000,
      cuePoints: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      keyFrames: [0, 0, 0, 250, 0, 250, 0, 0, 0, 250, 0],
      loop: true,
    });
    ledVerde.fade({
      easing: "linear",
      duration: 5000,
      cuePoints: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      keyFrames: [0, 0, 0, 0, 250, 0, 0, 0, 0, 250, 0],
      loop: true,
    });
  }

  animacionInicial();
}
