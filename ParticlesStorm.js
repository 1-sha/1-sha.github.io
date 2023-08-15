//###############################################
//	ParticlesStorm.js
//	contient le moteur de ParticlesStorm
//	Fichier par Peshmelba, votre cher et tendre
//###############################################


/*
TO DO :
- ressources
- sons et musique
- dans la page rajouter un encart pour dire les controles
*/

//Ne lance le script qu'une fois la page totalement chargée
window.onload = function(){

//### coin objet du jeu
	//les ennemis
function Ennemis(posX, posY, angle, vitesse, id) {
	//propriétés
    this.posX = posX;
    this.posY  = posY;
    this.angle  = angle;
    this.vitesse = vitesse;
	this.id = id;
	this.canvas;
	this.ctx

	//methodes
    this.Spawn = function(){
		
		gameWindow.insertBefore(CreateCanvas(this.id, this.posX, this.posY), mouse.nextSibling);
		this.canvas = document.getElementById('enn' + this.id.toString());
		
		this.ctx = this.canvas.getContext('2d');
		this.ctx.translate(this.canvas.height/2, this.canvas.width/2);
		this.ctx.rotate(this.angle * (Math.PI/180));
		this.ctx.translate(-this.canvas.height/2, -this.canvas.width/2);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(ennemisImgBuffer,0,0);
	};
	
	this.Die = function(){
		gameWindow.removeChild(this.canvas);
	};
	
	this.Move = function(){
		//angle *(Math.PI/180) -> angle en radiants
		this.posX += (Math.cos((this.angle*(Math.PI/180))) * this.vitesse);
		this.posY += (Math.sin((this.angle*(Math.PI/180))) * this.vitesse);
		
		this.canvas.style.left = ((Math.round(this.posX)) - this.canvas.width/2).toString() +'px';
		this.canvas.style.top = ((Math.round(this.posY)) - this.canvas.height/2).toString() +'px';
	};
}


//### coin fonction
/*
	INDEX DES FONCTIONS
===========================

AddEnnemis()		> Ajoute un ennemis dans le jeu. Appelée dans [InitNewGame, InitNewGamePlus, InitPesh]().setInterval(AddEnnemis, frqc)
CreateCanvas(id, _posX, _posY)		> Créer un canvas ennemis avec un ID, une position en X et en Y. Appelée dans Ennemis.Spawn()
DisplayAngle(angle)		> Affiche l'angle de l'ennemis spawné. Appelée dans AddEnnemis()
DisplayFramerate()		> Calcule les fps. Appelée dans DisplayFramerateInit().setInterval(DisplayFramerate, 1000)
DisplayFramerateInit()		> Initialise l'interval du calcul des FPS à un rafraichissement par seconde. Appelée dans le moteur
DisplayMouseCoord(e)		> Affiche les coordonnées de la souris (virtuelle) dans la fenêtre de jeu. Appelée dans SetPosOnMouse()
DisplayNukes()		> Affiche le nombre de bonus Nuke restants. Appelée dans [InitNewGame, InitNewGamePlus, InitPesh](), NukeFXOn(), Stop()
DisplayScore()		> Affiche le Score, le Highscore, et traite le système de points. Appelée dans AddEnnemis(), [InitNewGame, InitNewGamePlus, InitPesh](), Main()
Distance(elem)		> Renvoie la distance entre la souris et l'element (Ennemis) en paramètre. Appelée dans Main()
GetTargetAngle()		> Renvoie l'angle en ° (180 à -180) correspondant à la trajectoire de l'ennemis vers la cible (0° = droite). Appelée dans AddEnnemis()
Hotkey(e)		> Gère les contrôles claviers, évênement passé en paramètre. Appelée dans le moteur de jeu .addEventListener("keypress", Hotkey(e))
InitNewGame()		> Nettoie l'état du jeu et lance le jeu normal. Appelée dans Hotkey(e), MouseClickCaptureInit()
InitNewGamePlus()		> "" le new game +. 
InitPesh()		> "" l'easter egg. Appelé dans MouseClickCaptureInit(), new Konami(InitPesh)
Main()		> Déplacement Ennemis, collisions, fin du jeu. Appelé dans [InitNewGame, InitNewGamePlus, InitPesh]().setInterval(Main, 10), StopGameIntervals().clearInterval(mainInterval)
MouseClickCaptureInit()		> Initialise la gestion de clics souris. Appelée dans le moteur principal
Nuke()		> Supprime tous les ennemis en jeu. Appelée dans NukeFXOn(), Stop()
NukeFXFadeOut()		> Initialise l'annimation des bonus Nuke. Appelée dans le moteur principal .setInterval(NukeFXFadeOut, 20)
NukeFXOn()		> Gère l'utilisation du bonus Nuke. Appelée dans MouseClickCaptureInit()
RainbowBackground()		> Déclanche l'animation de fond pendant l'easter egg. Appelée dans InitPesh().setInterval(RainbowBackground, 20)
RandomSpawn()		> Donne des coordonnées de spawn d'ennemis aléatoires. Appelée dans AddEnnemis()
RgbToHex()		> Convertit 3 valeurs RGB en une chaine Hexa. Appelée dans RainbowBackground()
SetPosOnMouse(e)		> Gère les déplacements de la souris et les collisions. Appelée dans le moteur principale .addEventListener(mousemove, SetPosOnMouse(e))
Stop()		> Nettoie et arrête le moteur de jeu. Appelée dans [InitNewGame, InitNewGamePlus, InitPesh](), MouseClickCaptureInit()
StopGameIntervals()		> Arrête les intervals du moteur de jeu. Appelée dans Stop(), Main()
TrueFalse(prob)		> Renvoie Vrai ou Faux, probabilité d'avoir Vrai en paramètre (optionel). Appelée dans AddEnnemis(), RandomSpawn()
UnlockNGP()		> Débloque le new game +. Appelée dans DisplayScore(), InitPesh()

*/

function AddEnnemis()
{
	var current;

	nEnn += 1;
	buffer = RandomSpawn();
	
	//si on est en easter egg
	if (gameStatus == "pesh")
	{
		peshHighscore += 1;
		DisplayScore();
	
		if (TrueFalse(0.05))
		{
			vitesse = Math.floor((Math.random() * 8) + 1);
									//rappel (posX, posY, angle, vitesse, id)
			current = ennemis.push(new Ennemis(buffer.x, buffer.y, GetTargetAngle(), vitesse, nEnn)) - 1;
			ennemis[current].Spawn();
		}
	}
	//si on est en jeu normal ou ng+
	else
	{
							//rappel (posX, posY, angle, vitesse, id)
		current = ennemis.push(new Ennemis(buffer.x, buffer.y, GetTargetAngle(), vitesse, nEnn)) - 1;
		ennemis[current].Spawn();
	}
	
	//DisplayAngle(ennemis[current].angle);
}

function CreateCanvas(id, _posX, _posY)
{
	var canvas = document.createElement('canvas');
    canvas.id = 'enn' + id.toString();
    canvas.width = bufferSizeEnn;
    canvas.height = bufferSizeEnn;
    canvas.style.position = "absolute";
    canvas.style.left = Math.round(_posX).toString() + 'px';
    canvas.style.top = Math.round(_posY).toString() + 'px';
	
	return canvas;
}

function DisplayAngle(angle)
{
	var hudAngle = document.getElementById('hudAngle');
	hudAngle.innerHTML = "Angle : " + angle.toString() + '°';
}

function DisplayFramerate()
{
	var framerate = document.getElementById('framerate');
	framerate.innerHTML = "Framerate : " + frame.toString() + "fps";
	frame = 0;
}

function DisplayFramerateInit()
{
	setInterval(DisplayFramerate, 1000);
}

function DisplayMouseCoord()
{
	var mc = document.getElementById('mouseCoord');
	mc.innerHTML = "Mouse : X = " + (mouse.left).toString() + 
					" ; Y = " + (mouse.top).toString();
}

function DisplayNukes()
{
	var bonus = document.getElementById('bonus');
	
	bonus.innerHTML = '<span>' + nukeName + ' : </span>';
	
	if(gameStatus!="pesh")
	{
		for (var nb = 0 ; nb < nuke ; nb++){
			bonus.innerHTML += '<img src="' + res_imgNuke + '" style="width:16px;height:16px">';
		}
	} 
	else
	{
		var nbMax = Math.floor((Math.random() * 10) + 1);
		for (var nb = 0 ; nb < nbMax ; nb++){
			bonus.innerHTML += '<img src="' + res_imgNuke_PESH + '" style="width:16px;height:16px">';
		}
	}
	
	if(nuke == 0){
		bonus.innerHTML ='&nbsp;';
	}
}

function DisplayScore()
{
	var points = document.getElementById('points');
	var mpoints = document.getElementById('mpoints');
	
	if (gameStatus == "ng")
	{
		if (ngHighscore < score){
			ngHighscore = score;}
			
		highscore = ngHighscore;
	} 
	else if (gameStatus == "ngp")
	{
		if (ngpHighscore < score){
			ngpHighscore = score;}
			
		highscore = ngpHighscore;
	}
	else if (gameStatus == "pesh")
	{
		if (peshHighscore < score){
			peshHighscore = score;}
	
		highscore = peshHighscore;
	}
	
	if (highscore > 30){
		UnlockNGP();
	}
	
	points.innerHTML = "Score : " + score.toString();
	mpoints.innerHTML = "Highscore : " + highscore.toString();
}
	
function Distance(elem)
{
	var distX = Math.abs(elem.posX - posX);
	var distY = Math.abs(elem.posY - posY);
	
	
	//distance entre deux pts : √( distX ² + distY ² )
	return (Math.sqrt( Math.pow(distX,2) + Math.pow(distY,2) ));
}
	
function GetTargetAngle()
{

	var laterale;
	var horizontale;
	var angle;
	
	if (gameStatus != "pesh")
	{
		laterale = posY - buffer.y;
		horizontale = posX - buffer.x;
		angle = Math.atan(laterale/horizontale) / (Math.PI/180);
	} else 
	{
		//distance du spawn à la moitié de l'écran
		laterale = ((bounding.bottom - bounding.top)/2) - buffer.y;
		horizontale = ((bounding.right - bounding.left)/2) - buffer.x;
		angle = (Math.atan(laterale/horizontale) / (Math.PI/180)) + Math.floor((Math.random() * 90) - 45);
	}
	//lorsque la souris est en bas et à droite
	if (horizontale >= 0 && laterale >= 0){
		angle = angle;
	}
	//lorsque la souris est en haut et à droite
	if (horizontale >= 0 && laterale < 0){
		angle = angle;
	}
	//lorsque la souris est en bas et à gauche
	if (horizontale < 0 && laterale >= 0){
		angle = angle + 180;
	}
	//lorsque la souris est en haut et à gauche
	if (horizontale < 0 && laterale < 0){
		angle = angle - 180;
	}
	
	
	return angle;
}
	
function Hotkey(e)
{
		// "N"
	if (e.keyCode === 110){
		InitNewGame();
	}
		// ","
	if (e.keyCode === 44){
		if(!lockNGP){
			InitNewGamePlus();}
	}
}

function InitNewGame()
{
	Stop();
	
	gameStatus = "ng";
	
	vitesse = 2;
	nEnn = 0;
	score = 0;
	frame = 0;
	nuke = 3;
	frqc = 250;
	
	bufferSizeEnn = sizeEnn;
	
	//hitbox = taille des ennemis /2 + taille de la souris /2 - calibrage
	hitbox = (sizeEnn/2) + (mouse.height/2) - 10;

	mouseImgBuffer.onload = function(){ 
		mouseContext.clearRect(0, 0, mouse.width, mouse.height);
		mouseContext.drawImage(mouseImgBuffer, 0, 0); 
	};
	mouseImgBuffer.src = res_imgMouse;
	ennemisImgBuffer.src = res_imgEnnemis;
	
	DisplayScore();
	
	DisplayNukes();
	
	mainInterval = setInterval(Main, 10);
	spawnInterval = setInterval(AddEnnemis, frqc);
	
	switchGameText.innerHTML = "Start a new game +";
	
	startGame.style.display = "none";
	endGame.style.display = "none";
	mouse.style.display = "block";
	gameWindow.style.cursor = "none";
}

function InitNewGamePlus()
{

	Stop();
	
	gameStatus = "ngp";
	
	vitesse = 4;
	nEnn = 0;
	score = 0;
	frame = 0;
	nuke = 0;
	frqc = 125;
	
	bufferSizeEnn = sizeEnnNGP;
	
	hitbox = (sizeEnnNGP/2) + (mouse.height/2) - 10;
	
	mouseImgBuffer.onload = function(){ 
		mouseContext.clearRect(0, 0, mouse.width, mouse.height);
		mouseContext.drawImage(mouseImgBuffer, 0, 0); 
	};
	mouseImgBuffer.src = res_imgMouse_NGP;
	ennemisImgBuffer.src = res_imgEnnemis_NGP;
	
	DisplayScore();
	
	DisplayNukes();
	
	mainInterval = setInterval(Main, 10);
	spawnInterval = setInterval(AddEnnemis, frqc);
	
	switchGameText.innerHTML = "Start a new game";
	
	startGame.style.display = "none";
	endGame.style.display = "none";
	mouse.style.display = "block";
	gameWindow.style.cursor = "none";
}

function InitPesh()
{
	//s'assure que le jeu a bien été arrêté
	Stop();
	
	//si c'est la première fois que l'easter-egg est lancé.
	if (document.getElementById('music') === null){
		//lance la musique, le background arc-en-ciel, et débloque les modes de jeu
		document.head.innerHTML += '<audio id="music" autoplay loop autobuffer><source src="' + res_musique_PESH + '" type="audio/mpeg" /></audio>';
		setInterval(RainbowBackground, 20);
		UnlockNGP();
		
		var konami = document.getElementById('konami');
		konami.innerHTML = "<p><a href=\"http://www.google.fr/search?q=darude%20sandstorm\" target=\"_blank\">What's the music please ?</a></p>";
		konami.innerHTML += "<p><a href=\"Ressources/lyrics.txt\" target=\"_blank\">Lyrics</a></p>";
		konami.style.fontSize = "16px";
		
		gameWindow.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
		gameHead.style.backgroundColor = "rgba(175, 162, 129, 0.5)";
	}
	
	gameStatus = "pesh";
	
	vitesse = 0;
	nEnn = 0;
	score = 100;
	peshHighscore = 0;
	frame = 0;
	nuke = 1;
	frqc = 1;
	
	bufferSizeEnn = sizeEnnPesh;
	
	hitbox = (sizeEnnPesh/2) + (mouse.height/2) + 15;
	
	mouseImgBuffer.onload = function(){ 
		mouseContext.clearRect(0, 0, mouse.width, mouse.height);
		mouseContext.drawImage(mouseImgBuffer, 0, 0); 
	};
	mouseImgBuffer.src = res_imgMouse_PESH;
	ennemisImgBuffer.src = res_imgEnnemis_PESH;
	
	DisplayScore();
	
	DisplayNukes();
	
	mainInterval = setInterval(Main, 10);
	spawnInterval = setInterval(AddEnnemis, frqc);
	
	// /!\ si le noeud n'existe pas, génère une erreur
	endGame.removeChild(switchGame);
	playAgainText.style.marginTop = "25px";
	
	
	startGame.style.display = "none";
	endGame.style.display = "none";
	mouse.style.display = "block";
	gameWindow.style.cursor = "none";
}

function Main()
{
	frame +=1;
	
	var touched = false;
	
	for (var ind = ennemis.length -1 ; ind >= 0 ; ind--){
				
		//déplace l'ennemis
		ennemis[ind].Move();
		
		//Si l'ennemis sort du cadre de jeu, le faire disparaître
		if (	(ennemis[ind].posX < 0)
				|| (ennemis[ind].posX > (bounding.right - bounding.left))
				|| (ennemis[ind].posY < 0)
				|| (ennemis[ind].posY > (bounding.bottom - bounding.top))
			)
		{
			if (gameStatus != "pesh")
			{
				//si on est en jeu classique
				ennemis[ind].Die();
				ennemis.splice(ind, 1);
				score += 1;
				DisplayScore();
			}
			else
			{
				//si on est en easter egg
				ennemis[ind].Die();
				ennemis.splice(ind, 1);
				score -= 1;
				if (score < 0){
					score = 0;
				}
				
				DisplayScore();
			}
		} else
			//Sinon si l'ennemis touche le joueur
		if ((Distance(ennemis[ind]) - hitbox) <= 0 )
		{
			if (gameStatus != "pesh")
			{
				touched = true;
			}
			else
			{
				ennemis[ind].Die();
				ennemis.splice(ind, 1);
				
				if (score <= 0)
				{
					touched = true;
				}
			}
		}
		
	}
	
	if (touched){
	
		gameWindow.style.cursor = "default";
		
		gameOver = true;
		endGame.style.display = "block";
		if (score >= highscore){
			finalScore.innerHTML = "~ New Highscore : " + score.toString() + " pts ~";
		}
		else{
			finalScore.innerHTML = "You made : " + score.toString() + " points";
		}
	
		StopGameIntervals();
		
		nuke = 0;
	}
}

function MouseClickCaptureInit()
{
	document.addEventListener('mouseup', function(e){
											if (e.button == "0")
											{
												if((gameStatus != "none") && (nuke > 0))
												{
													NukeFXOn();
												}
												
												if(gameStatus == "none")
												{
													if(onNewGame)
													{
														InitNewGame();
													}
													else if(onNewGamePlus)
													{
														InitNewGamePlus();
													}
												}
												
												if(gameOver)
												{
													if(onPlayAgain)
													{
														if(gameStatus == "ng"){
															InitNewGame();
														}
														if(gameStatus == "ngp"){
															InitNewGamePlus();
														}
														if(gameStatus == "pesh"){
															InitPesh();
														}
													}
													if(onSwitchGame)
													{
														if(gameStatus == "ng"){
															InitNewGamePlus();
														}
														else if(gameStatus == "ngp"){
															InitNewGame();
														}
													}
												}
											}
										}
	);
}

function Nuke()
{
	for (var ind = ennemis.length -1 ; ind >= 0 ; ind--){
		ennemis[ind].Die();
		ennemis.splice(ind, 1);
	}
	
	ennemis = [];
}

function NukeFXFadeOut()
{
	if (nukefx.style.display != "none"){
		nukefx.style.opacity -= 0.04;
		if (nukefx.style.opacity <= 0){
			nukefx.style.display = "none";
		}
	}
}

function NukeFXOn()
{
	nukefx.style.display = "block";
	nukefx.style.opacity = 1;
	Nuke();
	if (gameStatus !="pesh"){
		nuke -= 1;
	}
	
	DisplayNukes();
}

function RainbowBackground()
{
	var rainbowCanvas;
	var rainbowImg;
	var rainbowData;
	
	if (RainbowBackground.px == undefined){
		RainbowBackground.px = 1;
	
		rainbowCanvas = document.createElement('canvas');
		rainbowCanvas.width = 256;
		rainbowCanvas.height = 1;
	
		RainbowBackground.rainbowContext = rainbowCanvas.getContext('2d');	
	
		rainbowImg = new Image();
		rainbowImg.crossOrigin = "Anonymous";
		
		rainbowImg.onload = function(){
			RainbowBackground.rainbowContext.drawImage(rainbowImg, 0, 0);
		};
		rainbowImg.src = 'Ressources/rainbow.png';
	}
							//(début x, début y, fin x, fin y)
	rainbowData = RainbowBackground.rainbowContext.getImageData((RainbowBackground.px)-1, 0, (RainbowBackground.px), 1);
	
	document.body.style.backgroundColor = RgbToHex(rainbowData.data[0], rainbowData.data[1], rainbowData.data[2]);
	gameName.style.color = RgbToHex(rainbowData.data[0], rainbowData.data[1], rainbowData.data[2]);
	
	RainbowBackground.px += 1;
	if (RainbowBackground.px >= 256){
		RainbowBackground.px = 1;
	}
}

function RandomSpawn()
{
	var x,y;
	
	if(TrueFalse()){ //sur les horizontales
		if(TrueFalse()){ //en haut
			x = Math.floor(Math.random() * (bounding.right - bounding.left));
			y = 0;
		}else	{	//en bas
			x = Math.floor(Math.random() * (bounding.right - bounding.left));
			y = (bounding.bottom - bounding.top);
		}
	}else	{ //sur les verticales
		if(TrueFalse()){ //à gauche
			x = 0;
			y = Math.floor(Math.random() * (bounding.bottom - bounding.top));
		}else	{ //à droite
			x = (bounding.right - bounding.left);
			y = Math.floor(Math.random() * (bounding.bottom - bounding.top));
		}
	}
	
	return {
		x: x,
		y: y
	};
}

function RgbToHex(red , green, blue)
{
	//convertie en hexa
	var redHex = red.toString(16).toUpperCase();
	var greenHex = green.toString(16).toUpperCase();
	var blueHex = blue.toString(16).toUpperCase();
	
	//rajout des 0 manquants
	if(redHex.length == 1){
		redHex = "0" + redHex;
	}
	if(greenHex.length == 1){
		greenHex = "0" + greenHex;
	}
	if(blueHex.length == 1){
		blueHex = "0" + blueHex;
	}
	
	//renvoit la chaine html
	return ("#" + redHex + greenHex + blueHex);
}

function SetPosOnMouse(e)
{
	if(!gameOver)
	{
		//positions de la souris sur la page
		posX = e.clientX;
		posY = e.clientY;
		
		//positions sur la page en comptant le scrolling
		posX += window.pageXOffset;
		posY += window.pageYOffset;
		
		//positions de la souris, relativement à la fenêtre du jeu
		posX -= bounding.left;
		posY -= bounding.top;
		
		//collisions
		if (posX < 0){
			posX = 0;}
		if (posX > (bounding.right - bounding.left)){
			posX = bounding.right - bounding.left;}
		
		if (posY < 0){
			posY = 0;}
		if (posY > (bounding.bottom - bounding.top)){
			posY = bounding.bottom - bounding.top;}
		
		//place le centre de l'image de la souris sur la souris
		mouse.style.top = (posY - (mouse.height/2)).toString() + 'px';
		mouse.style.left = (posX - (mouse.width/2)).toString() + 'px';
		
		//mise à jour des coordonnées de la souris.
		//DisplayMouseCoord();
	}
}

function Stop()
{
	StopGameIntervals();

	Nuke();
	
	endGame.style.display = "none";
	startGame.style.display = "none";
	
	gameStatus = "none";
	gameOver = false;
	
	nuke = 0;
	
	DisplayNukes();
	
	gameWindow.style.cursor = "default";
	
}

function StopGameIntervals()
{
	clearInterval(mainInterval);
	clearInterval(spawnInterval);
}

function TrueFalse(prob)
{
	var bool = true;
	
	if (prob === undefined){
		prob = 0.5;
	}
	
	if (Math.random() < prob){
		bool = true;
	}else	{
		bool = false;
	}
	
	return bool;
}

function CreateHTMLElements()
{
		//création bouton NewGamePlus
		newGamePlus = document.createElement('div');
		
		newGamePlus.id = "newGamePlus";
		newGamePlus.style.backgroundColor = "rgba(50,50,50,0.2)";
		
		newGamePlus.onmouseover = function(){
									this.style.color='#FF8000';
									this.style.backgroundColor="rgba(50,50,50,0.5)"
									onNewGamePlus = true;
								};
		newGamePlus.onmouseout = function(){
									this.style.color='#FFB500';
									this.style.backgroundColor="rgba(50,50,50,0.2)";
									onNewGamePlus = false;
								};
								
		newGamePlusText = document.createElement('h2');
		newGamePlusText.id = "newGamePlusText";
		newGamePlusText.style.paddingTop = "10px";
		newGamePlusText.style.paddingBottom = "10px";
		newGamePlusText.innerHTML = "Start a new game +";
		
		newGamePlus.appendChild(newGamePlusText);
		
		
		// #################
		
		//ajoute un bouton pour changer de mode dans le menu de fin
		
		switchGame = document.createElement('div');
		
		switchGame.id = "switchGame";
		
		switchGame.style.backgroundColor = "rgba(50,50,50,0.2)";
		
		switchGame.onmouseover = function(){
									this.style.color='#FF8000';
									this.style.backgroundColor="rgba(50,50,50,0.5)"
									onSwitchGame = true;
								};
		switchGame.onmouseout = function(){
									this.style.color='#FFB500';
									this.style.backgroundColor="rgba(50,50,50,0.2)";
									onSwitchGame = false;
								};
		
		switchGameText = document.createElement('h2');
		switchGameText.id = "switchGameText";
		switchGameText.style.paddingTop = "10px";
		switchGameText.style.paddingBottom = "10px";
		switchGameText.innerHTML = "Start a new game +";
		
		switchGame.appendChild(switchGameText);
}

function UnlockNGP()
{
	if (lockNGP)
	{
		//ajoute le bouton "Start a new game +" dans le menu d'acceuil
		//correspond à insertAfter
		startGame.insertBefore(newGamePlus, newGame.nextSibling);
		newGameText.style.marginTop = "5px";
		newGamePlusText.style.marginTop = "5px";
		
		
		//correspond à insertAfter
		endGame.insertBefore(switchGame, playAgain.nextSibling);
		playAgainText.style.marginTop = "5px";
		switchGameText.style.marginTop = "5px";
	}
	
	lockNGP = false;
}



//### coin variables
	//ressources du jeu
		//l'image des ennemis
var res_imgEnnemis = "Ressources/ennemis.png";
		//l'image de la souris
var res_imgMouse = "Ressources/mouse.png";
		//l'image du bonus
var res_imgNuke = "Ressources/nuke.png";
		//l'image affichée pendant le bonus
var res_imgNukeEffect = "Ressources/nukeEffect.png";
		//l'image des ennemis en New Game Plus
var res_imgEnnemis_NGP = "Ressources/ennemisNGP.png";
		//l'image de la souris en New Game Plus
var res_imgMouse_NGP = "Ressources/mouseNGP.png";
		//l'image des ennemis en easter egg
var res_imgEnnemis_PESH = "Ressources/ennemisPESH.png";
		//l'image de la souris en easter egg
var res_imgMouse_PESH = "Ressources/mousePESH.png";
		//l'image du bonus en easter egg
var res_imgNuke_PESH = "Ressources/nukePESH.png";
		//l'image affichée pendant le bonus en easter egg
var res_imgNukeEffect = "Ressources/nukeEffectPESH.png";
		//la musique en easter egg
var res_musique_PESH = "Ressources/music.mp3";


	//éléments HTML
var mouse = document.getElementById('mouse');
	var mouseContext = mouse.getContext('2d');
var gameWindow = document.getElementById('gameWindow');
var gameHead = document.getElementById('gameHead');
var gameName = document.getElementById('gameName');
var gameAuthor = document.getElementById('gameAuthor');
//var ngbutton = document.getElementById('ngbutton');
//var ngpbutton = document.getElementById('ngpbutton');
var hud = document.getElementById('hud');
var nukefx = document.getElementById('nukefx');
	nukefx.innerHTML = "<img src=\"" + res_imgNukeEffect + "\" draggable=\"false\">";
var startGame = document.getElementById('startGame');
var newGame = document.getElementById('newGame');
	newGame.onmouseover = function(){
								this.style.color='#FF8000';
								this.style.backgroundColor="rgba(50,50,50,0.5)"
								onNewGame = true;
							};
	newGame.onmouseout = function(){
								this.style.color='#FFB500';
								this.style.backgroundColor="rgba(50,50,50,0.2)";
								onNewGame = false;
							};
var newGameText = document.getElementById('newGameText');
var newGamePlus;
var newGamePlusText;
var endGame = document.getElementById('endGame');
var finalScore = document.getElementById('finalScore');
var playAgain = document.getElementById('playAgain');
	playAgain.onmouseover = function(){
								this.style.color='#FF8000';
								this.style.backgroundColor="rgba(50,50,50,0.5)"
								onPlayAgain = true;
							};
	playAgain.onmouseout = function(){
								this.style.color='#FFB500';
								this.style.backgroundColor="rgba(50,50,50,0.2)";
								onPlayAgain = false;
							};
var playAgainText = document.getElementById('playAgainText');
var switchGame;
var switchGameText;
							
var mouseImgBuffer = new Image();
	mouseImgBuffer.crossOrigin = "Anonymous";
	
var ennemisImgBuffer = new Image();
	ennemisImgBuffer.crossOrigin = "Anonymous";

	
	//éléments du moteur
		//interval du moteur
var mainInterval;
		//interval du spawn
var spawnInterval;
		//nombre de frames
var frame = 0;
		//fréquence de spawn en ms
var frqc = 250;
		//taille de la hitbox
var hitbox = 0;
		//état du jeu courrant (ng, ngp, pesh)
var gameStatus = "none";
		//vrai si la souris est sur le bouton "play again ?"
var onPlayAgain = false;

var onSwitchGame = false;

var onNewGame = false;

var onNewGamePlus = false;
		//vrai si le joueur vient de perdre
var gameOver = true;
	
	//éléments de traçage
		//positions absolues de la fenêtre du jeu sur la page (haut bas droite gauche)	
var bounding = gameWindow.getBoundingClientRect();
		//positions de la souris, relatif à la fenêtre du jeu
var posX = (bounding.right - bounding.left)/2;
var posY = (bounding.bottom - bounding.top)/2;
	
	//éléments de création des ennemis
		//choix d'un spawn aléatoire
var buffer = RandomSpawn();
		//vitesse des ennemis
var vitesse = 2;
		//collection d'ennemis
var ennemis = [];
		//le nombre d'ennemis apparus (sert d'identifiant)
var nEnn = 0;
		//la taille d'un ennemis
var sizeEnn = 50;
		//la taille d'un ennemis en New Game Plus
var sizeEnnNGP = 50;
		//la taille des ennemis en easter egg
var sizeEnnPesh = 50;
		//tampon de la taille des ennemis
var bufferSizeEnn = 0;

	//éléments du jeu
		//le score
var score = 0;
		//meilleur score affiché
var highscore = 0;
		//meilleur score jeu normal
var ngHighscore = 0;
		//meilleur score ngp
var ngpHighscore = 0;
		//meilleur score
var peshHighscore = 0;
		//bonus
var nuke = 0;
		//nom du bonus
var nukeName = "bonus";
		//new game plus locké ou non
var lockNGP = true;
		// chargement d'un easter egg à la con
var pesh_easter_egg = new Konami(function(){
									//affiche un message lorsque le konami-code est entré
									alert('ERMAHGERD KERNERMI CERD');
									InitPesh();
								});

		// ############


//### coin moteur du jeu	

	mouse.style.display = "none";
	mouseImgBuffer.onload = function(){ 
		mouseContext.clearRect(0, 0, mouse.width, mouse.height);
		mouseContext.drawImage(mouseImgBuffer, 0, 0); 
	};
	mouseImgBuffer.src = res_imgMouse;
	ennemisImgBuffer.src = res_imgEnnemis;
	
	


	//placement de l'image de la souris au centre de la fenêtre de jeu
mouse.style.top = ((bounding.bottom - bounding.top)/2 - (mouse.height/2)).toString() + 'px';
mouse.style.left = ((bounding.right - bounding.left)/2 - (mouse.width/2)).toString() + 'px';

	//lance la fonction de mouvement de l'image de la souris à chaque déplacement de la souris
document.addEventListener('mousemove',function(e)
										{
											SetPosOnMouse(e);
										}
);

	//recalcule les boundary quand la fenêtre change de dimensions.
window.addEventListener('resize', function()
								{
									bounding = gameWindow.getBoundingClientRect();
								}
);

document.addEventListener('keypress', function(e)
									{
										Hotkey(e);
									}
);

CreateHTMLElements();
DisplayFramerateInit();
MouseClickCaptureInit();
setInterval(NukeFXFadeOut, 20);
//UnlockNGP();

}