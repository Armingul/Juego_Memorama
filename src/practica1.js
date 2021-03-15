
var EnumEstadoCartas = {
    "bocaArriba": 1,
    "bocaAbajo": 2,
    "encontrado": 3
};

/**
 * La constructora recibe como parámetro el servidor gráfico,
usado posteriormente para dibujar.
 */
var MemoryGame = MemoryGame || {};



MemoryGame = function(gs){

    this.parejaCartasAcertadas = 0;
    this.primeraCarta = -1;
    this.timer;
    this.espera = false;
    this.cartas = [];
    this.finJuego = true;
    this.mensaje = "Juego Memoria Spectrum";
    this.graphics = gs;

   
    
    /**
     *  initGame(): Inicializa el juego creando las cartas (recuerda que son 2 de cada
        tipo de carta), desordenándolas y comenzando el bucle de juego.
     */

        this.initGame = function() { 
            //Obtenemos las claves de los sprites
            var nombresSprites = Object.keys(this.graphics.maps);
    
            var j = 0;
            var duplico = true;
            for(var i = 0; i < 16; i++) {
                var carta = new MemoryGameCard(nombresSprites[j]);
                this.cartas.push(carta);
                if(!duplico){
                    j++;
                    //Nos saltamos el sprite "back"
                    if(nombresSprites[j]=="back")j++;
                    duplico = true;
                } else {             
                    duplico = false;
                }
            }
            this.barajearCartas(this.cartas);
            this.loop();
    
        };

    /**
     * draw(): Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual del
       juego y (2) pide a cada una de las cartas del tablero que se dibujen
     */

       this.draw = function() {
        this.graphics.drawMessage(this.mensaje);
        //Dibujo el tablero
        for (var i = 0; i < 16; i++) {
            this.cartas[i].draw(this.graphics, i);
        }
        if (this.haAcabado()) {
            this.mensaje = "¡Has ganado!";
            this.graphics.drawMessage(this.mensaje);
            clearInterval(this.timer);
        }
    };

     /**
      *  loop(): Es el bucle del juego. En este caso es muy sencillo: llamamos al método
         draw cada 16ms (equivalente a unos 60fps). Esto se realizará con la función
         setInterval de Javascript.
      * 
      */

         this.loop = function() {
            var that = this;
            this.timer = setInterval(function() {
                 that.draw(); 
                }, 16);
        };

      /**
       * onClick(cardId): Este método se llama cada vez que el jugador pulsa sobre
         alguna de las cartas (identificada por el número que ocupan en el array de cartas
         del juego). Es el responsable de voltear la carta y, si hay dos volteadas, comprobar
         si son la misma (en cuyo caso las marcará como encontradas). En caso de no ser
         la misma las volverá a poner boca abajo
       * 
       */
         
         this.onClick = function(idCard) {
             if (!this.espera) {
                 if (this.cartas[idCard] !== undefined && this.cartas[idCard].estado === EnumEstadoCartas.bocaAbajo) {
                     this.cartas[idCard].flip(); // La ponemos boca arriba siempre
     
                     if (this.primeraCarta === -1) { // Es la primera carta en pulsar  
                         this.primeraCarta = idCard;
                     } else { // Es la segunda carta en pinchar y la anterior clickada se guarda en primeraCarta
                         this.espera = true;
     
                         if (this.cartas[idCard].compareTo(this.cartas[this.primeraCarta])) { //Comprueba si ambas cartas son pareja
                             this.mensaje = "¡Pareja encontrada!";
                             this.cartas[this.primeraCarta].found();
                             this.cartas[idCard].found();
                             this.parejaCartasAcertadas++;
                             this.espera = false;
                         } else { // Las dos cartas no son la misma pareja
                             this.mensaje = "Intentalo de nuevo";
                             var dat = this;
     
                             var primeraCartaAux = dat.primeraCarta;
                             setTimeout(function() {
                                 dat.cartas[primeraCartaAux].flip();
                                 dat.cartas[idCard].flip();
                                 dat.espera = false;
                             }, 500);
                         }
                         this.primeraCarta = -1;
                     }
                 }
             }
     
         };

         //FUNCIONES AUXILIARES
          /**
     * Compruebo si el juego ha acabado
     */

     this.haAcabado = function() {
        return this.parejaCartasAcertadas * 2 === this.cartas.length;
    }

    /**
     * Desordena las cartas (funcion de internet)
     */

     this.barajearCartas = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
     };


     MemoryGameCard = function(id) {
        //Atributos
        this.sprite = id;
        this.estado = EnumEstadoCartas.bocaAbajo;
    
    /**
     * flip(): Da la vuelta a la carta, cambiando el estado de la misma.
     */

     this.flip = function() {
        if (this.estado === EnumEstadoCartas.bocaAbajo) {
            this.estado = EnumEstadoCartas.bocaArriba;
        } else {
            this.estado = EnumEstadoCartas.bocaAbajo;
        }
    };

     /**
      * found(): Marca una carta como encontrada, cambiando el estado de la misma.
      */

      this.found = function() {
        this.estado = EnumEstadoCartas.encontrado;
    };

      /**
       * compareTo(otherCard): Compara dos cartas, devolviendo true si ambas representan la misma carta.
       */

       this.compareTo = function(otherCard) {
        return this.sprite === otherCard.sprite;
    };


       /**
        * draw(gs, pos): Dibuja la carta de acuerdo al estado en el que se encuentra.
          Recibe como parámetros el servidor gráfico y la posición en la que se encuentra en
          el array de cartas del juego (necesario para dibujar una carta).
        */

    this.draw = function(gs, pos) {
        if (this.estado === EnumEstadoCartas.bocaAbajo) {
            gs.draw("back", pos);
        } else {
            gs.draw(this.sprite, pos);
        }
    };
};



