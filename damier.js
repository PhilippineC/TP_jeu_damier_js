function Grille() {
    this.couleur = new Array();
    this.arme = new Array();
    this.div = new Array();
    this.joueur = new Array();

    this.init = function() {
        for (var i=0; i<10; i++) {
            this.couleur[i] = new Array();
            this.arme[i] = new Array();
            this.div[i] = new Array();
            this.joueur[i] = new Array();
            for (var j=0; j<10; j++) {
                //Initialisation de tous les tableaux à null
                this.couleur[i][j] = null;
                this.arme[i][j]= null;
                this.div[i][j] = null;
                this.joueur[i][j] = null;

                var newdiv = document.createElement('div');
                newdiv.id = i + '-' + j;
                newdiv.className = 'damier';
                // Ensuite on colore certaines cases en gris selon un random : environ 3 cases sur 5 sont blanches
                var x = Math.floor((Math.random()*5)+1);
                if ((x==3 ) || (x==1) || (x==2)){//si x=1,2,3 =>white
                    newdiv.style.backgroundColor = 'white';
                    this.couleur[i][j] = 'white';

                }
                else if ((x==4) || (x==5)) {//si
                    newdiv.style.backgroundColor = 'grey';
                    this.couleur[i][j] = 'grey';
                }
                else {
                    alert ('erreur sur l\'aléa');
                }
                //Puis on insère chaque div dans le container
                document.getElementById('container').appendChild(newdiv);
            }
        }
    };
}

function Arme(nom, puissance) {
    this.nom = nom;
    this.position = new Array();
    this.puissance = puissance;

    this.arme_init = function(Grille) {
        var abs = Math.floor(Math.random()*10); //une case entre 0 et 9;
        var ord = Math.floor(Math.random()*10); //une case entre 0 et 9;

        while ((Grille.couleur[ord][abs] === 'grey') || (Grille.arme[ord][abs] != null))  {
            abs = Math.floor(Math.random()*10); //une case entre 0 et 9
            ord = Math.floor(Math.random()*10); //une case entre 0 et 9
        }
        this.position[0] = ord;
        this.position[1] = abs;
        Grille.arme[ord][abs] = this.nom;
        var div = document.getElementById(ord + '-' + abs);
        var paraph = document.createElement('p');
        paraph.id = this.nom;
        Grille.div[ord][abs] = document.createTextNode(this.nom);
        paraph.appendChild(Grille.div[ord][abs]);
        div.appendChild(paraph);
    };
}


function Joueur(nom, arme) {
    this.nom = nom;
    this.position = new Array();
    this.arme = new Arme(arme, armes[arme]);
    this.pts_vie = 100;

    this.init = function(Grille) {
        abs = Math.floor(Math.random()*10); //une case entre 0 et 9;
        ord = Math.floor(Math.random()*10); //une case entre 0 et 9;
        //On gère les cas où les cases +1 et -1 n'existent pas mais c'est pas très propre !
        if (ord == 0) {
            Grille.joueur[-1] = new Array();
        }
        if (ord == 9) {
            Grille.joueur[10] = new Array();
        }
        while ((Grille.couleur[ord][abs] === 'grey') || (Grille.joueur[ord][abs] != null) || (Grille.joueur[(ord+1)][(abs)] != null) || (Grille.joueur[(ord-1)][(abs)] != null) || (Grille.joueur[ord][(abs+1)] != null) || (Grille.joueur[ord][(abs-1)] != null) || (Grille.arme[ord][abs] != null))  {
            abs = Math.floor(Math.random()*10); //une case entre 0 et 9
            ord = Math.floor(Math.random()*10); //une case entre 0 et 9
            if (ord == 0) {
                Grille.joueur[-1] = new Array();
            }
            if (ord == 9) {
                Grille.joueur[10] = new Array();
            }
        }
        this.position[0] = ord;
        this.position[1] = abs;
        Grille.joueur[ord][abs] = this.nom;
        // S'il y a une arme sur sa case de départ, le joueur la prend
        if (Grille.arme[ord][abs] != null) {
            this.arme = Grille.arme[ord][abs];
        }
        // Paragraphe du joueur
        var div = document.getElementById(ord + '-' + abs);
        var paraph = document.createElement('p');
        paraph.id = this.nom;
        var divText = document.createTextNode(this.nom);
        paraph.appendChild(divText);
        div.appendChild(paraph);
        Grille.div += divText;

        //Paragraphe de l'arme
        var paraph_arme = document.createElement('p');
        paraph_arme.id = this.arme.nom;
        divText = document.createTextNode(this.arme.nom);
        paraph_arme.appendChild(divText);
        div.appendChild(paraph_arme);
    };

    this.seDeplacer = function (Grille) {
        var message;
        var new_position = new Array();
        var inputs = document.querySelectorAll('input[type=radio]:checked');
        if (inputs.length != 2) {
            message = '\nVous n\'avez pas coché toutes les cases requises.';
            return message;
        }
        var dir = inputs[0].value;
        var dist = parseInt(inputs[1].value);
        //Gestion des cas où le déplacement est impossible
        if (((dir == 'haut') && ((this.position[0] - dist) < 0)) ||
            ((dir == 'bas') && ((this.position[0] + dist) > 9)) ||
            ((dir == 'gauche') && ((this.position[1] - dist) < 0)) ||
            ((dir == 'droite') && ((this.position[1] + dist) > 9))) {
            message = 'Observez bien la grille !! La distance spécifiée est impossible à parcourir : votre déplacement sort de la grille ! Vous grillez votre tour.';
            return message;
        }
        switch (dir) {
            case 'haut':
                new_position = [(this.position[0]-dist) , this.position[1]];
                break;
            case 'bas':
                new_position = [(this.position[0]+dist) , this.position[1]];
                break;
            case 'gauche':
                new_position = [this.position[0] , (this.position[1]-dist)];
                break;
            case 'droite':
                new_position = [this.position[0] , (this.position[1]+dist)];
                break;
        }

        if ((Grille.couleur[new_position[0]][new_position[1]]) == 'grey') {
            message = 'Observez bien la grille !! Déplacement interdit : vous avez atteint une case inaccesible. Vous grillez votre tour.';
            return message;
        }
        //on efface l'ancienne position du joueur et l'ancienne position de l'arme s'il en avait une
        Grille.joueur[this.position[0]][this.position[1]] = null;
        Grille.arme[this.position[0]][this.position[1]] = null;


        this.position[0] = new_position[0];
        this.position[1] = new_position[1];
        Grille.joueur[this.position[0]][this.position[1]] = this.nom;

        //On déplace le joueur avec son arme s'il en a une
        var divjoueur = document.getElementById(this.nom);

        var oldpositionjoueur = divjoueur.parentNode.removeChild(divjoueur);
        var newdiv = document.getElementById(this.position[0] + '-' + this.position[1]);
        newdiv.appendChild(oldpositionjoueur);
        if (this.arme != null) {
            var divarme = document.getElementById(this.arme.nom);
            var oldpositionarme = divarme.parentNode.removeChild(divarme);
            newdiv.appendChild(oldpositionarme);
        }

        message = this.nom + ' s\'est déplacé de ' + dist + ' case(s) vers le/la ' + dir + '.'
        return message;

    };

    this.ramasser_arme = function (Grille) {
        var message;
        if (Grille.arme[this.position[0]][this.position[1]] == null)  {
            message = this.nom + ' est armé d\'un(e) ' + this.arme.nom + ' et n\'a pas ramassé d\'arme.';
        }
        //Si il y a une arme, le joueur la prend
        if (Grille.arme[this.position[0]][this.position[1]] != null) {
            message = this.nom + ' ramasse un(e) ' + Grille.arme[this.position[0]][this.position[1]] + '.';
            var old_arme = this.arme.nom;
            this.arme = new Arme(Grille.arme[this.position[0]][this.position[1]], armes[Grille.arme[this.position[0]][this.position[1]]]);
            Grille.arme[this.position[0]][this.position[1]] = old_arme;
        }
        return message;
     };

    this.combat = function (Grille) {
        if ((this.position[0]) == 0) {
            Grille.joueur[(this.position[0])-1] = new Array();
        }
        if ((this.position[0]) == 9) {
            Grille.joueur[(this.position[0])+1] = new Array();
        }

        if ((Grille.joueur[(this.position[0])+1][this.position[1]] != null) ||
            (Grille.joueur[(this.position[0])-1][this.position[1]] != null) ||
            (Grille.joueur[this.position[0]][(this.position[1])+1] != null) ||
            (Grille.joueur[this.position[0]][(this.position[1])-1] != null)) {
            return true;
        }
        else {return false;}
    };

    this.attaque_a_mort = function (Joueur) {
        var message = '';
        if ((Joueur.pts_vie > 0) && (this.pts_vie > 0)) {
            message = '\n' + this.nom + ' attaque ' + Joueur.nom + ' avec un(e) ' + this.arme.nom + '.';
            Joueur.pts_vie -= this.arme.puissance;
            message += '\n' + Joueur.nom + ' perd ' + this.arme.puissance + ' points. Il lui reste ' + Joueur.pts_vie + ' points de vie.';

            message += '\n' + Joueur.nom + ' attaque ' + this.nom + ' avec un(e) ' + Joueur.arme.nom + '.';
            this.pts_vie -= Joueur.arme.puissance;
            message += '\n' + this.nom + ' perd ' + Joueur.arme.puissance + ' points. Il lui reste ' + this.pts_vie + ' points de vie.';

            if ((Joueur.pts_vie > 0) && (this.pts_vie > 0)) {
                message += '\nPour le prochain coup, ' + Joueur.nom + ' attaque ou se défend ?';
             }
            else {
                message += '\nLe combat est terminé.';
                if (Joueur.pts_vie <= 0) {
                    message += '\n' + Joueur.nom + ' a perdu.'
                }
                if (this.pts_vie <= 0) {
                    message += '\n' + this.nom + ' a perdu.'
                }
            }
        }
        return message;
    }

    this.defendre_de = function (Joueur) {
        var message = '';
        if ((Joueur.pts_vie > 0) && (this.pts_vie > 0)) {
            message = '\n' + this.nom + ' se défend de l\'attaque de ' + Joueur.nom + '.';
            this.pts_vie -= (Joueur.arme.puissance/2);
            message += '\n' + this.nom + ' perd ' + (Joueur.arme.puissance/2) + ' points. Il lui reste ' + this.pts_vie + ' points de vie.';

            message += '\n' + Joueur.nom + ' attaque ' + this.nom + '.';
            Joueur.pts_vie -= this.arme.puissance;
            message += '\n' + Joueur.nom + ' perd ' + this.arme.puissance + ' points. Il lui reste ' + Joueur.pts_vie + ' points de vie.';


            if ((Joueur.pts_vie > 0) && (this.pts_vie > 0)) {
                message += '\nPour le prochain coup, ' + this.nom + ' attaque ou se défend ?';
            }
            else {
                message += '\n!!!!!!  Le combat est terminé. !!!!!!';
                if (Joueur.pts_vie <= 0) {
                    message += '\n----' + Joueur.nom + ' a perdu.-----'
                }
                if (this.pts_vie <= 0) {
                    message += '\n' + this.nom + ' a perdu.-------'
                }
            }
        }
        return message;
    }


}