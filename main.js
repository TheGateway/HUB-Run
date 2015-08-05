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
    var boot, preload, hubRun, mainMenu, gameOverMenu,
        game, settings, smallFont;
    
    game = new Phaser.Game(1500, 1000, Phaser.AUTO, "HUB Run");
    smallFont = { font: 'Bold 72px Silkscreen', fill: 'white', stroke: 'black', strokeThickness: '9' };
    
    settings = {
        musicPlaying: true,
        playerTexture: 'player_m'
    };
    
    // Calculates the score.
    function calcScore(score) {
        return Math.round(score / 10);
    }
    
    // Sets up music and player texture toggling for states.
    function toggleControls (music, player) {
        var startButton, characterButton;
        
        characterButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
        musicButton = game.input.keyboard.addKey(Phaser.Keyboard.M);
        
        function changeMusic() {
             settings.musicPlaying = !settings.musicPlaying;

            if (settings.musicPlaying) {
                music.play();
            } else {
                music.stop();
            }
        }
        
        function changeTexture() {
            if(!player) {
                return;
            }
            
            if(settings.playerTexture === 'player_m') {   
                settings.playerTexture = 'player_f';
            } else {
                settings.playerTexture = 'player_m';
            }   
            
            if(player)
                player.loadTexture(settings.playerTexture);
        };
        
        characterButton.onDown.add(changeTexture);
        musicButton.onDown.add(changeMusic);
        
        if(player) {
            player.loadTexture(settings.playerTexture);
        }
        
        if (settings.musicPlaying) {
            music.play();
        } else {
            music.stop();
        }
    };
    
    // Initial boot state
    
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
    
    // Preload state
    
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
            this.game.state.start("MainMenu");
        }
    };
    
    // Main Menu state
    
    mainMenu = function (game) {
        var playText, menuMusic;
    }
    
    mainMenu.prototype = {
        create: function() {
            var musicButton, creditsButton, 
                player, logo, background;

            background = game.add.tileSprite(0, 0, 1500, 1000, 'background');
            playText = game.add.group();
            logo = game.add.sprite(game.width / 2 - 180, 10, 'logo');
            player = game.add.sprite(game.world.width / 2 + 200, game.world.height - 300, null);
            
            startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            creditsButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
            
            menuMusic = game.add.audio('menumusic', 1, true);

            startButton.onDown.add(this.startGame);
            creditsButton.onDown.add(this.showCredits);
            
            toggleControls(menuMusic, player);
            
            playText.add(game.add.text(game.world.width / 2 - 258, 440, 'Space - Start ', smallFont));
            playText.add(game.add.text(game.world.width / 2 - 515, 530, 'Arrow Keys - Move ', smallFont));
            playText.add(game.add.text(270, 670, 'X - Character ', smallFont));
            playText.add(game.add.text(270, 760, 'M - Music ', smallFont));
            playText.add(game.add.text(270, 850, 'C - Credits ', smallFont));
        },
        showCredits: function () {
            // TODO
        }, 
        startGame: function () {  
            menuMusic.stop();
            game.state.start("HubRun");
        }
    }
    
    // Game Over state
    
    gameOverMenu = function (game) {
        var facebookButton, twitterButton,
            scoredText, restartText,
            menuMusic;
    }
    
    gameOverMenu.prototype = {
        create: function() {
            
            var logo, background, 
                twitterButton, facebookButton, startButton;
            
            background = game.add.tileSprite(0, 0, 1500, 1000, 'background');
            logo = game.add.sprite(game.width / 2 - 180, 10, 'logo');
            restartText = game.add.group();
            
            menuMusic = game.add.audio('menumusic', 1, true);

            toggleControls(menuMusic);
            
            restartText.add(game.add.text(game.world.width / 2 - 300, 440, 'Score : ' + calcScore(score) + ' ', smallFont));
            restartText.add(game.add.text(game.world.width / 2 - 300, 530, 'Space - Restart ', smallFont));
            restartText.add(game.add.text(game.world.width / 2 - 300, 650, 'Share your score! ', smallFont));
            
            twitterButton = game.add.button(game.world.centerX - 95, 850, 'twitter', this.twitterClick, this, 2, 1, 0);

            twitterButton.onInputOver.add(this.buttonOver, this);
            twitterButton.onInputOut.add(this.buttonOut, this);
            twitterButton.anchor.setTo(0.5, 0.5);

            facebookButton = game.add.button(game.world.centerX + 115, 850, 'facebook', this.facebookClick, this, 2, 1, 0);

            facebookButton.onInputOver.add(this.buttonOver, this);
            facebookButton.onInputOut.add(this.buttonOut, this);
            facebookButton.anchor.setTo(0.5, 0.5);
            
            startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            startButton.onDown.add(this.startGame);
        }, 
        startGame: function () {  
            menuMusic.stop();
            game.state.start("HubRun");
        },
        twitterClick: function () {
            window.open('https://twitter.com/intent/tweet?text=I%20ran%20' + calcScore(score) + '%20steps%20in%20@The_Gateway\'s%20%23HUBRun!%20Try%20to%20beat%20me%20at%20http://gtwy.ca/hubrun.%20%23UAlberta', '_blank');
        },
        facebookClick: function () {
            FB.ui({
                method: 'share',
                href: 'https://thegatewayonline.ca/hubrun',
                description: "I ran " + calcScore(score) + " steps in The Gateway's HUB Run Game! Can you beat me?"
            }, function (response) {});
        },
        buttonOver: function (button) {
            button.scale.setTo(1.1, 1.1);
        },
        buttonOut: function (button) {
            button.scale.setTo(1.0, 1.0);
        }
    }
    
    // Gameplay state
    
    hubRun = function (game) {
        var enemyCounter = 0, score,
            player, cursors, background,
            bigFont,
            scoreText,
            gameMusic,
            downEnemies, upEnemies,
            bottomBoundbox, topBoundbox, boundboxes;
        
    };

    hubRun.prototype = {
        create: function () {
            var leftBoundbox, rightBoundbox;
            this.spawnFactors = [80];
            score = 0;

            bigFont = { font: 'Bold 128px Silkscreen', fill: 'white', stroke: 'black', strokeThickness: '9' };

            background = game.add.tileSprite(0, 0, 1500, 1000, 'background');
            player = game.add.sprite(game.world.width / 2 + 200, game.world.height - 300, null);
            scoreText = game.add.text(game.world.width / 2 - 60, 16, score + "", bigFont);
            boundboxes = game.add.group();
            downEnemies = game.add.group();
            upEnemies = game.add.group();

            gameMusic = game.add.audio('gamemusic', 0.6, true);
            
            cursors = game.input.keyboard.createCursorKeys();

            toggleControls(gameMusic, player);

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

            if(score > 0) {
                if(score % 600 === 0) {
                    var newSpawnFactor = 80 - this.spawnFactors.length * 10;

                    if(newSpawnFactor > 0) {
                        this.spawnFactors.push(newSpawnFactor);
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

            if(this.shouldSpawn(this.spawnFactors)) {
                this.spawnTop();
            }

            if(this.shouldSpawn(this.spawnFactors.map(function (num) { return num * (5/2); }))) {
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
                scoreText.text = calcScore(score);
            }
        },
        removeEnemy: function (enemy) {
            enemy.kill();
            this.enemyCounter--;
        },
        gameOver: function () {
            gameMusic.stop();
            game.state.start("GameOver");
        }
    };

    game.state.add("Boot", boot);
    game.state.add("Preload", preload);
    game.state.add("MainMenu",mainMenu);
    game.state.add("HubRun",hubRun);
    game.state.add("GameOver", gameOverMenu);
    game.state.start("Boot");
})();