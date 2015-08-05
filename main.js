/*global FB, console, Phaser*/

(function () {
    // Facebook SDK code
    window.fbAsyncInit = function () {
        FB.init({
            appId      : '749155338564351',
            xfbml      : true,
            version    : 'v2.4'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return; }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    // boot loading state
    var boot, preload, hubRun;
    
    boot = function (game) {
        console.log("%cWelcome to HUB Run!", "font-size:24px;color:white; background:red");
        console.log("%cYou seem to know what you're doing. Have you considered volunteering for The Gateway? You could make cool games like this with other students.", "color:white; background:green");
        console.log("%cGo to http://gtwy.ca/volunteer for more info.", "color:white; background:red");
        console.log("This game created with:");
    };

    boot.prototype = {
        create: function () {
            this.game.scale.maxWidth = 750;
            this.game.scale.maxHeight = 500;

            this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            this.game.scale.setScreenSize();
            this.game.state.start("Preload");
        }
    };
    
    // preload state
    
    preload = function (game) {};

    preload.prototype = {
        preload: function () {
            this.game.load.image('background', 'assets/sprites/hub-mall.png');
            this.game.load.image('logo', 'assets/sprites/hubrun_sign_1.png');
            this.game.load.image('facebook', 'assets/sprites/facebook.png');
            this.game.load.image('twitter', 'assets/sprites/twitter.png');
            this.game.load.spritesheet('player_m', 'assets/sprites/pc_male_spritesheet.png', 144, 170);
            this.game.load.spritesheet('player_f', 'assets/sprites/pc_female_spritesheet.png', 144, 170);
            this.game.load.spritesheet('enemy1', 'assets/sprites/npc_f_b_spritesheet.png', 144, 170);
            this.game.load.spritesheet('enemy2', 'assets/sprites/npc_f_r_spritesheet.png', 144, 170);
            this.game.load.spritesheet('enemy3', 'assets/sprites/npc_f_y_spritesheet.png', 144, 170);
            this.game.load.spritesheet('enemy4', 'assets/sprites/npc_m_b_spritesheet.png', 144, 170);
            this.game.load.spritesheet('enemy5', 'assets/sprites/npc_m_r_spritesheet.png', 144, 170);
            this.game.load.spritesheet('enemy6', 'assets/sprites/npc_m_y_spritesheet.png', 144, 170);
            this.game.load.spritesheet('runner', 'assets/sprites/running_guy_spritesheet.png', 144, 170);

            this.game.load.audio('gamemusic', 'assets/audio/Den Nye Profeten-sieken.mp3');
            this.game.load.audio('menumusic', 'assets/audio/Hoffipolka Chiptune-mpyuri.mp3');

            
        },
        create: function () {
            this.game.state.start("HubRun");
        }
    };
    
    // The game state
    
    hubRun = function (game) {
        var enemyCounter = 0, score,
            logo, player, cursors, background, run,
            playerTexture, bigFont,
            facebookButton, twitterButton,
            playText, scoreText, scoredText, restartText,
            menuMusic, gameMusic,
            downEnemies, upEnemies,
            bottomBoundbox, topBoundbox, boundboxes,
            musicPlaying,
            spawnFactors = [80];
    };

    hubRun.prototype = {
        create: function () {
            var leftBoundbox, rightBoundbox,
                startButton, characterButton, musicButton, creditsButton;
            
            score = 0;
            run = false;
            playerTexture = 'player_m';
            musicPlaying = true;

            bigFont = { font: 'Bold 128px Silkscreen', fill: 'white', stroke: 'black', strokeThickness: '9' };
            smallFont = { font: 'Bold 72px Silkscreen', fill: 'white', stroke: 'black', strokeThickness: '9' };

            background = game.add.tileSprite(0, 0, 1500, 1000, 'background');
            player = game.add.sprite(game.world.width / 2 + 200, game.world.height - 300, playerTexture);
            scoreText = game.add.text(game.world.width / 2 - 60, 16, score + "", bigFont);
            playText = game.add.group();
            restartText = game.add.group();
            boundboxes = game.add.group();
            downEnemies = game.add.group();
            upEnemies = game.add.group();

            logo = game.add.sprite(game.width / 2 - 180, 10, 'logo');

            menuMusic = game.add.audio('menumusic', 1, true);
            gameMusic = game.add.audio('gamemusic', 0.6, true);

            cursors = game.input.keyboard.createCursorKeys();

            playText.add(game.add.text(game.world.width / 2 - 258, 440, 'Space - Start ', smallFont));
            playText.add(game.add.text(game.world.width / 2 - 515, 530, 'Arrow Keys - Move ', smallFont));
            playText.add(game.add.text(270, 670, 'X - Character ', smallFont));
            playText.add(game.add.text(270, 760, 'M - Music ', smallFont));
            playText.add(game.add.text(270, 850, 'C - Credits ', smallFont));

            restartText.add(scoredText = game.add.text(game.world.width / 2 - 300, 440, '', smallFont));
            restartText.add(game.add.text(game.world.width / 2 - 300, 530, 'Space - Restart ', smallFont));
            restartText.add(game.add.text(game.world.width / 2 - 300, 650, 'Share your score! ', smallFont));

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.enable(player);

            leftBoundbox = boundboxes.create(0, 0, null);
            rightBoundbox = boundboxes.create(game.world.width - 200, 0, null);
            topBoundbox = boundboxes.create(0, -220, null);
            bottomBoundbox = boundboxes.create(0, game.world.height + 175, null);

            game.physics.arcade.enable(downEnemies);
            game.physics.arcade.enable(upEnemies);
            game.physics.arcade.enable(boundboxes);

            leftBoundbox.body.setSize(200, 1500, 0, 0);
            rightBoundbox.body.setSize(200, 1500, 0, 0);
            topBoundbox.body.setSize(2000, 50, 0, 0);
            bottomBoundbox.body.setSize(2000, 175, 0, 0);

            boundboxes.setAll('body.moves', false);

            player.animations.add('walk', [0, 1], 8, true);

            downEnemies.enableBody = true;
            upEnemies.enableBody = true;

            startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            characterButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
            musicButton = game.input.keyboard.addKey(Phaser.Keyboard.M);
            creditsButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

            startButton.onDown.add(this.startGame);
            characterButton.onDown.add(this.changeCharacter);
            musicButton.onDown.add(this.toggleMusic);
            creditsButton.onDown.add(this.showCredits);

            twitterButton = game.add.button(game.world.centerX - 95, 850, 'twitter', this.twitterClick, this, 2, 1, 0);

            twitterButton.onInputOver.add(this.buttonOver, this);
            twitterButton.onInputOut.add(this.buttonOut, this);
            twitterButton.anchor.setTo(0.5, 0.5);

            facebookButton = game.add.button(game.world.centerX + 115, 850, 'facebook', this.facebookClick, this, 2, 1, 0);

            facebookButton.onInputOver.add(this.buttonOver, this);
            facebookButton.onInputOut.add(this.buttonOut, this);
            facebookButton.anchor.setTo(0.5, 0.5);

            twitterButton.visible = false;
            facebookButton.visible = false;
            restartText.visible = false;

            if (musicPlaying) {
                menuMusic.play();
            }
        },
        toggleMusic: function () {
            musicPlaying = !musicPlaying;

            if (musicPlaying) {
                if (run) {
                    gameMusic.play();
                } else {
                    menuMusic.play();
                }
            } else {
                menuMusic.stop();
                gameMusic.stop();
            }
        },
        showCredits: function () {

        },
        twitterClick: function () {
            window.open('https://twitter.com/intent/tweet?text=I%20ran%20' + this.calcScore() + '%20steps%20in%20@The_Gateway\'s%20%23HUBRun!%20Try%20to%20beat%20me%20at%20http://gtwy.ca/hubrun.%20%23UAlberta', '_blank');
        },
        facebookClick: function () {
            FB.ui({
                method: 'share',
                href: 'https://thegatewayonline.ca/hubrun',
                description: "I ran " + this.calcScore() + " steps in The Gateway's HUB Run Game! Can you beat me?"
            }, function (response) {});
        },
        buttonOver: function (button) {
            button.scale.setTo(1.1, 1.1);
        },
        buttonOut: function (button) {
            button.scale.setTo(1.0, 1.0);
        },
        startGame: function () {
            if (run) {
                return;
            }

            score = 0;
            spawnFactors = [80];

            player.x = game.world.width / 2 + 200;
            player.y = game.world.height - 300;

            logo.visible = false;
            playText.visible = false;
            restartText.visible = false;
            facebookButton.visible = false;
            twitterButton.visible = false;

            run = true;

            if(musicPlaying) {
                menuMusic.stop();
                gameMusic.play();
            }
        },
        endGame: function () {
            run = false;

            restartText.visible = true;
            logo.visible = true;
            facebookButton.visible = true;
            twitterButton.visible = true;
            scoredText.setText('Score : ' + this.calcScore() + ' ');

            if(musicPlaying) {
                gameMusic.stop();
                menuMusic.play();
            }
        },
        changeCharacter: function () {
            if(playerTexture === 'player_m') {   
                playerTexture = 'player_f';
            } else {
                playerTexture = 'player_m';
            }
            player.loadTexture(playerTexture);
        },
        playerEnemyCollision: function  () {
            player.body.velocity.y = arguments[1].body.velocity.y / 2;
        },
        spawn: function (enemyGroup, x, y, spriteName, speedFactor) {
            if(spriteName === undefined) {
                spriteName = 'enemy' + game.rnd.integerInRange(1, 6);   
            }

            if(speedFactor === undefined) {
                speedFactor = 1;
            }

            var tween, enemy = enemyGroup.create(x, y, spriteName);

            enemy.animations.add('walk', [0, 1], 8, true);
            enemy.animations.getAnimation('walk').delay = 180;
            enemy.play('walk');
            enemy.body.moves = false;

            this.enemyCounter++;

            if (y < 0) {
                // spawned top
                tween = game.add.tween(enemy).to({x:x, y:game.height + 300}, 2000 * speedFactor);
                enemy.anchor.setTo(1, 0.5);
                enemy.scale.y = -1;
            } else {
                // spawned bottom
                tween = game.add.tween(enemy).to({x:x, y: -300}, 5000 * speedFactor);
            }

            tween.onComplete.add(this.removeEnemy);
                tween.start();

            return enemy;
        },
        spawnRunner: function () {
            this.spawn(downEnemies, game.rnd.integerInRange(300, (game.width / 2) - 30), -100, 'runner', 0.85);
        },
        spawnTop: function () {
            this.spawn(downEnemies, game.rnd.integerInRange(300, (game.width / 2) - 30), -100);
        },
        spawnBottom: function () {
            this.spawn(upEnemies, game.rnd.integerInRange((game.width / 2), game.width - 300), game.height + 100);
        },
        spawnTopWrong: function () {
            this.spawn(downEnemies, game.rnd.integerInRange((game.width / 2) + 30, game.width - 300), -100);
        },
        spawnBottomWrong: function () {
            this.spawn(upEnemies, game.rnd.integerInRange(300, (game.width / 2) - 30), game.height + 100);
        },
        shouldSpawn: function (spawnFactors) {
            for(var i = 0; i < spawnFactors.length; i++) {
                if(score % spawnFactors[i] == 0) {
                    return true;
                }
            }
            return false;
        },
        update: function () {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;

            if(!run) {
                return;
            }

            if(score > 0) {
                if(score % 600 === 0) {
                    var newSpawnFactor = 80 - spawnFactors.length * 10;

                    if(newSpawnFactor > 0) {
                        spawnFactors.push(newSpawnFactor);
                    }

                    this.spawnRunner();
                }

                if(score % 200 === 0) {
                    if(game.rnd.integerInRange(0, 1) === 0) {
                        this.spawnTopWrong();
                    } else {
                        this.spawnBottomWrong();
                    }
                }
            }

            if(this.shouldSpawn(spawnFactors)) {
                this.spawnTop();
            }

            if(this.shouldSpawn(spawnFactors.map(function (num) { return num * (5/2); }))) {
                this.spawnBottom();
            }

            player.play('walk');
            background.tilePosition.y += 6.0;

            player.animations.getAnimation('walk').delay = 180;

            if (cursors.left.isDown) {
                player.body.velocity.x = -700;
            } else if (cursors.right.isDown) {
                player.body.velocity.x = 700;
            } 

            if (cursors.up.isDown) {
                player.body.velocity.y = -500;
                player.animations.getAnimation('walk').delay = 80;
            } else if (cursors.down.isDown) {
                player.body.velocity.y = 700;
                player.animations.getAnimation('walk').delay = 350;
            }

            game.physics.arcade.collide(player, downEnemies, null, null, this);
            game.physics.arcade.collide(player, upEnemies, null, null, this);

            game.physics.arcade.collide(topBoundbox, player, this.gameOver, null, this);
            game.physics.arcade.collide(bottomBoundbox, player, this.gameOver, null, this);

            game.physics.arcade.collide(player, boundboxes, null, null, this);

            score += 1;

            if(score % 10 == 0) {
                scoreText.text = this.calcScore();
            }
        },
        calcScore: function () {
            return Math.round(score / 10);
        },
        removeEnemy: function (enemy) {
            enemy.kill();
            this.enemyCounter--;
        },
        gameOver: function (bottomBoundbox, player) {
            this.endGame();
        }
    };

    // Wrapped in a function to make variables private.
    var game = new Phaser.Game(1500, 1000, Phaser.AUTO, "HUB Run");
    
    
    game.state.add("Boot", boot);
    game.state.add("Preload", preload);
    game.state.add("HubRun",hubRun);
    game.state.start("Boot");

    
})();