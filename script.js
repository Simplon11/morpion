$(function() {
  //Parametres de la partie
  var partie = {
  joueur1: "",
  joueur2: "",
  score1: 0,
  score2: 0,
  nbPartie: 2,
  curPartie: 1,
  curPlayer: 1
  };

  //Case sur laquelle l'utilisateur a cliqué
  var curElement;
  //Utilisé pour signifier que la partie est terminée
  var nextStep=false;

  //Objet qui contient les combinaisons gagnantes pour une cellule donnée
  var tabVerif = {
      11: [[11, 12, 13], [11, 22, 33], [11, 21, 31]],
      12: [[12, 22, 32], [11, 12, 13]],
      13: [[13, 23, 33], [13, 22, 31], [11, 12, 13]],
      21: [[21, 22, 23], [11, 21, 31]],
      22: [[21, 22, 23], [12, 22, 32], [11, 22, 33], [13, 22, 31]],
      23: [[21, 22, 23], [13, 23, 33]],
      31: [[31, 32, 33], [11, 21, 31], [13, 22, 31]],
      32: [[31, 32, 33], [12, 22, 32]],
      33: [[31, 32, 33], [13, 23, 33], [11, 22, 33]]
    };

  //Test si l'utilisateur courrant a gagné
  function testGagnant() {
    var total = 0, lignesGagnantes = tabVerif[curElement.attr("id")];
    for( var i = 0; i < lignesGagnantes.length; i++) {
      for( var j = 0, total = 0; j < 3; j++) {
        if( $("#" + lignesGagnantes[i][j]).data("player") == partie.curPlayer ) {
          total++;
        }
      }
      if( 3 == total ) { //L'utilisateur courrant a gagné!
        for( var j = 0, total = 0; j < 3; j++) { //Entoure la combinaison gagnante
          $("#" + lignesGagnantes[i][j]).addClass("winLine");
        }
        return true;
      }
    }
  }

  //Rafraichir les statistiques: Num partie courante et scores
  function refreshStat() {
    $("#bilan").html( "Partie " + partie.curPartie + "/" + partie.nbPartie + "<br>" + partie.joueur1 + ": " + partie.score1 + "<br>" + partie.joueur2 + ": " + partie.score2);
  }

  //Reinitialiser le jeu
  function refreshPlay() {
    $(".col-md-4").data("player",0)
                  .removeClass("player1")
                  .removeClass("player2")
                  .removeClass("winLine");
  }

  //Clic pour démarage nouvelle partie
  $("#start-game").click( function() {

    $("#transition-egalite").addClass("hide");
    $("#transition-vainqueur").addClass("hide");
  });

  //Clic de sauvegarde des parametres d'une partie
  $("#save-params").click( function() {
    partie.joueur1 = $("#joueur1").val();
    partie.joueur2 = $("#joueur2").val();
    partie.nbPartie = $("#nbparties").val();
    $("#player").text( partie["joueur" + partie.curPlayer] );
    refreshPlay();
    refreshStat();
    $("#morpion").removeClass("hide");
    $("#bilan").removeClass("hide");

    return true;
  });

  //Clic sur une case du morpion
  $("#morpion").click( function( e ) {
    if( true == nextStep ) {
      //On réinitialise la grille
      nextStep = false;
      refreshPlay();
      if( partie.curPartie < partie.nbPartie ) {
        //On passe à la partie suivante
        partie.curPartie++;
        refreshStat();
      } else {
        //Finalisation de la partie
        $("#morpion").addClass("hide");
        if( partie.score1 == partie.score2 ) {
          //Egalité
          $("#player").text( "Vous êtes à égaglité!" );
          $("#transition-egalite").removeClass("hide");
          $("#transition-egalite .col-xs-12").addClass("player1");
        } else if( partie.score1 > partie.score2) {
          //Player 1 vainqueur
          $("#transition-vainqueur").removeClass("hide");
          $("#transition-vainqueur .col-xs-12").addClass("player1");
          $("#player").text( partie["joueur" + partie.curPlayer] + " Président!" );
        } else {
          //Player 2 vainqueur
          $("#transition-vainqueur").removeClass("hide");
          $("#transition-vainqueur .col-xs-12").addClass("player2");
          $("#player").text( partie["joueur" + partie.curPlayer] + " Président!" );
        }
      }

      return;
    }
    curElement = $("#" + e.target.id);
    if(  curElement.data("player") == 0 ) {
      curElement.data("player", partie.curPlayer);
      curElement.addClass("player" + partie.curPlayer);
      console.log( testGagnant());
      if( testGagnant() ) {
        partie["score" + partie.curPlayer]++;
        refreshStat();
        nextStep = true;
        return;
      }
      partie.curPlayer = (partie.curPlayer % 2) + 1;
      $("#player").text( partie["joueur" + partie.curPlayer] );
    }
  });

  //Clic sur la zone de transition
  $("#transition-egalite, #transition-vainqueur").click(function() {
    location.reload(true);
  })
});
