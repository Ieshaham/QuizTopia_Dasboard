
// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Phaser from 'phaser';
// import { fetchQuestionsBySubject } from '../gaming/api';

// class QuizRunnerScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'QuizRunnerScene' });
//     this.questions = [];
//     this.currentQuestionIndex = 0;
//     this.score = 0;
//     this.correctAnswers = 0;
//     this.isAnswered = false;
//     this.startTime = 0;
//     this.playerX = 150;
//     this.obstacles = [];
//   }

//   init(data) {
//     this.questions = data.questions || [];
//     this.onComplete = data.onComplete || (() => {});
//     this.subject = data.subject || 'Quiz';
//     this.startTime = Date.now();
//   }

//   createSounds() {
//     const ctx = this.sound.context;
    
//     this.correctSound = () => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.frequency.setValueAtTime(523.25, ctx.currentTime);
//       osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
//       osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
//       gain.gain.setValueAtTime(0.3, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.4);
//     };
    
//     this.wrongSound = () => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.type = 'sawtooth';
//       osc.frequency.setValueAtTime(200, ctx.currentTime);
//       osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
//       gain.gain.setValueAtTime(0.2, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.2);
//     };
    
//     this.jumpSound = () => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.frequency.setValueAtTime(400, ctx.currentTime);
//       osc.frequency.setValueAtTime(600, ctx.currentTime + 0.15);
//       gain.gain.setValueAtTime(0.25, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.2);
//     };
    
//     this.celebrationSound = () => {
//       const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
//       notes.forEach((freq, index) => {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         const startTime = ctx.currentTime + (index * 0.1);
//         osc.frequency.setValueAtTime(freq, startTime);
//         gain.gain.setValueAtTime(0.2, startTime);
//         gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
//         osc.start(startTime);
//         osc.stop(startTime + 0.3);
//       });
//     };
//   }

//   create() {
//     const { width, height } = this.cameras.main;
//     this.createSounds();

//     // Sky background with gradient
//     const sky = this.add.graphics();
//     sky.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xe0f7ff, 0xe0f7ff, 1);
//     sky.fillRect(0, 0, width, height);

//     // Animated clouds
//     for (let i = 0; i < 6; i++) {
//       const cloud = this.add.ellipse(
//         Phaser.Math.Between(0, width),
//         Phaser.Math.Between(30, 150),
//         Phaser.Math.Between(80, 120),
//         Phaser.Math.Between(40, 60),
//         0xffffff,
//         0.8
//       );
//       this.tweens.add({
//         targets: cloud,
//         x: '+=100',
//         duration: Phaser.Math.Between(20000, 30000),
//         repeat: -1,
//         yoyo: true
//       });
//     }

//     // Ground
//     this.groundY = height - 100;
//     this.add.rectangle(width / 2, this.groundY + 50, width, 100, 0x8b7355);
//     this.add.rectangle(width / 2, this.groundY, width, 30, 0x90ee90);

//     // Finish line
//     this.createFinishLine();

//     // Create player
//     this.createPlayer();

//     // UI
//     this.createUI();

//     // Display question
//     this.displayQuestion();
//   }

//   createPlayer() {
//     const x = this.playerX;
//     const y = this.groundY - 30;
    
//     // Body
//     this.playerBody = this.add.circle(x, y, 28, 0xff6b6b);
    
//     // Eyes
//     this.playerEyeL = this.add.circle(x - 10, y - 8, 6, 0xffffff);
//     this.playerEyeR = this.add.circle(x + 10, y - 8, 6, 0xffffff);
//     this.playerPupilL = this.add.circle(x - 8, y - 8, 3, 0x000000);
//     this.playerPupilR = this.add.circle(x + 12, y - 8, 3, 0x000000);
    
//     // Smile
//     this.playerMouth = this.add.graphics();
//     this.playerMouth.lineStyle(3, 0x000000);
//     this.playerMouth.arc(x, y + 5, 10, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
//     this.playerMouth.strokePath();
    
//     // Arms
//     this.playerArmL = this.add.rectangle(x - 20, y + 5, 8, 25, 0xff6b6b);
//     this.playerArmL.setRotation(-0.3);
//     this.playerArmR = this.add.rectangle(x + 20, y + 5, 8, 25, 0xff6b6b);
//     this.playerArmR.setRotation(0.3);
    
//     // Legs
//     this.playerLegL = this.add.rectangle(x - 12, y + 35, 10, 30, 0xff6b6b);
//     this.playerLegR = this.add.rectangle(x + 12, y + 35, 10, 30, 0xff6b6b);
    
//     this.playerParts = [
//       this.playerBody, this.playerEyeL, this.playerEyeR,
//       this.playerPupilL, this.playerPupilR, this.playerMouth,
//       this.playerArmL, this.playerArmR, this.playerLegL, this.playerLegR
//     ];

//     // Idle animation - bobbing
//     this.idleAnimation();
//   }

//   idleAnimation() {
//     this.playerParts.forEach(part => {
//       if (part !== this.playerMouth) {
//         this.tweens.add({
//           targets: part,
//           y: '-=8',
//           duration: 700,
//           yoyo: true,
//           repeat: -1,
//           ease: 'Sine.easeInOut'
//         });
//       }
//     });
    
//     // Arm swing
//     this.tweens.add({
//       targets: this.playerArmL,
//       rotation: -0.5,
//       duration: 700,
//       yoyo: true,
//       repeat: -1
//     });
//     this.tweens.add({
//       targets: this.playerArmR,
//       rotation: 0.5,
//       duration: 700,
//       yoyo: true,
//       repeat: -1
//     });
//   }

//   stopIdleAnimation() {
//     this.tweens.killTweensOf(this.playerParts);
//   }

//   createFinishLine() {
//     const { width } = this.cameras.main;
//     const x = width - 100;
    
//     this.finishPole = this.add.rectangle(x, this.groundY - 80, 8, 160, 0x8b4513);
    
//     // Checkered flag
//     const flag = this.add.graphics();
//     for (let row = 0; row < 4; row++) {
//       for (let col = 0; col < 5; col++) {
//         const color = (row + col) % 2 === 0 ? 0x000000 : 0xffffff;
//         flag.fillStyle(color, 1);
//         flag.fillRect(x - 5 + col * 12, this.groundY - 160 + row * 12, 12, 12);
//       }
//     }
    
//     this.trophy = this.add.text(x, this.groundY - 180, '🏆', {
//       fontSize: '36px'
//     }).setOrigin(0.5);
    
//     this.tweens.add({
//       targets: [flag, this.trophy],
//       x: '+=5',
//       duration: 400,
//       yoyo: true,
//       repeat: -1
//     });
//   }

//   createUI() {
//     const { width } = this.cameras.main;

//     // Score
//     this.scoreText = this.add.text(width - 20, 20, `⭐ ${this.score}`, {
//       fontSize: '32px',
//       fontFamily: 'Arial',
//       color: '#fbbf24',
//       fontStyle: 'bold',
//       stroke: '#92400e',
//       strokeThickness: 4
//     }).setOrigin(1, 0);

//     // Question counter
//     this.questionCounter = this.add.text(20, 20, '', {
//       fontSize: '24px',
//       fontFamily: 'Arial',
//       color: '#ffffff',
//       fontStyle: 'bold',
//       backgroundColor: '#8b5cf6',
//       padding: { x: 16, y: 10 }
//     });

//     // Progress bar
//     this.progressBg = this.add.rectangle(width / 2, 70, width * 0.7, 35, 0x4b5563, 0.7);
//     this.progressBg.setStrokeStyle(3, 0xffffff);
//     this.progressFill = this.add.rectangle(
//       width / 2 - (width * 0.7) / 2,
//       70,
//       0,
//       35,
//       0x10b981
//     ).setOrigin(0, 0.5);
//   }

//   updateProgress() {
//     const { width } = this.cameras.main;
//     const progress = (this.currentQuestionIndex + 1) / this.questions.length;
//     const maxWidth = width * 0.7;
    
//     this.tweens.add({
//       targets: this.progressFill,
//       width: maxWidth * progress,
//       duration: 500,
//       ease: 'Power2'
//     });
//   }

//   displayQuestion() {
//     // Clean up
//     if (this.answerButtons) {
//       this.answerButtons.forEach(btn => btn.container?.destroy());
//     }
//     this.answerButtons = [];
//     this.isAnswered = false;

//     [this.questionBg, this.questionText, this.explanationBox, 
//      this.explanationText, this.nextButton].forEach(e => e?.destroy());

//     // Remove old obstacles
//     this.obstacles.forEach(obs => {
//       obs.forEach(part => part?.destroy());
//     });
//     this.obstacles = [];

//     const { width, height } = this.cameras.main;
//     const question = this.questions[this.currentQuestionIndex];

//     this.questionCounter.setText(`Question ${this.currentQuestionIndex + 1}/${this.questions.length}`);
//     this.updateProgress();

//     // Create obstacle for this question
//     this.createObstacle();

//     // Question panel
//     this.questionBg = this.add.rectangle(width / 2, 140, width * 0.88, 90, 0xffffff, 0.95);
//     this.questionBg.setStrokeStyle(4, 0x8b5cf6);
    
//     this.questionText = this.add.text(width / 2, 140, question.question, {
//       fontSize: '22px',
//       fontFamily: 'Arial',
//       color: '#1f2937',
//       fontStyle: 'bold',
//       align: 'center',
//       wordWrap: { width: width * 0.82 }
//     }).setOrigin(0.5);

//     // Answer buttons
//     const startY = 245;
//     const spacing = 70;

//     question.options.forEach((option, index) => {
//       const y = startY + (index * spacing);
//       const btnWidth = width * 0.78;
//       const btnHeight = 58;

//       const button = this.add.rectangle(width / 2, y, btnWidth, btnHeight, 0xffffff, 0.95)
//         .setStrokeStyle(3, 0x8b5cf6)
//         .setInteractive({ useHandCursor: true });

//       const text = this.add.text(width / 2, y, option, {
//         fontSize: '19px',
//         fontFamily: 'Arial',
//         color: '#1f2937',
//         fontStyle: 'bold',
//         align: 'center',
//         wordWrap: { width: btnWidth - 70 }
//       }).setOrigin(0.5);

//       const label = this.add.text(width / 2 - btnWidth / 2 + 22, y, String.fromCharCode(65 + index), {
//         fontSize: '21px',
//         fontFamily: 'Arial',
//         color: '#8b5cf6',
//         fontStyle: 'bold'
//       }).setOrigin(0.5);

//       const container = this.add.container(0, 0, [button, text, label]);

//       button.on('pointerover', () => {
//         if (!this.isAnswered) {
//           button.setFillStyle(0xddd6fe, 1);
//           this.tweens.add({
//             targets: container,
//             scale: 1.03,
//             duration: 150
//           });
//         }
//       });

//       button.on('pointerout', () => {
//         if (!this.isAnswered) {
//           button.setFillStyle(0xffffff, 0.95);
//           this.tweens.add({
//             targets: container,
//             scale: 1,
//             duration: 150
//           });
//         }
//       });

//       button.on('pointerdown', () => {
//         if (!this.isAnswered) {
//           this.handleAnswer(option, button, text, label);
//         }
//       });

//       this.answerButtons.push({ button, text, container, option, label });
//     });
//   }

//   createObstacle() {
//     const obstacleX = this.playerX + 200;
//     const obstacleY = this.groundY - 40;
    
//     // Rock obstacle
//     const rock1 = this.add.circle(obstacleX, obstacleY, 25, 0x808080);
//     const rock2 = this.add.circle(obstacleX - 15, obstacleY - 10, 18, 0x696969);
//     const rock3 = this.add.circle(obstacleX + 15, obstacleY - 5, 15, 0x757575);
    
//     this.obstacles.push([rock1, rock2, rock3]);
//   }

//   handleAnswer(option, button, text, label) {
//     this.isAnswered = true;
//     this.stopIdleAnimation();

//     const question = this.questions[this.currentQuestionIndex];
//     const isCorrect = option === question.correct_answer;

//     if (isCorrect) {
//       this.score += 10;
//       this.correctAnswers += 1;
//       this.correctSound();
      
//       this.tweens.add({
//         targets: this.scoreText,
//         scale: 1.3,
//         duration: 200,
//         yoyo: true,
//         onUpdate: () => {
//           this.scoreText.setText(`⭐ ${this.score}`);
//         }
//       });

//       this.jumpOverObstacle();
//     } else {
//       this.wrongSound();
//       this.moveBackward();
//     }

//     // Button feedback
//     this.answerButtons.forEach(({ button: btn, text: txt, label: lbl, option: opt }) => {
//       const correct = opt === question.correct_answer;
//       const selected = opt === option;

//       if (correct) {
//         btn.setFillStyle(0x22c55e, 1);
//         btn.setStrokeStyle(4, 0x16a34a);
//         txt.setColor('#ffffff');
//         lbl.setColor('#ffffff');
//       } else if (selected) {
//         btn.setFillStyle(0xef4444, 1);
//         btn.setStrokeStyle(4, 0xdc2626);
//         txt.setColor('#ffffff');
//         lbl.setColor('#ffffff');
//       } else {
//         btn.setAlpha(0.4);
//         txt.setAlpha(0.4);
//         lbl.setAlpha(0.4);
//       }
//     });
//   }

//   jumpOverObstacle() {
//     this.jumpSound();
    
//     // Running leg animation
//     this.tweens.add({
//       targets: this.playerLegL,
//       y: '-=15',
//       duration: 100,
//       yoyo: true,
//       repeat: 2
//     });
//     this.tweens.add({
//       targets: this.playerLegR,
//       y: '-=15',
//       duration: 100,
//       yoyo: true,
//       repeat: 2,
//       delay: 50
//     });

//     // Jump arc
//     this.playerParts.forEach(part => {
//       this.tweens.add({
//         targets: part,
//         y: '-=120',
//         duration: 500,
//         ease: 'Quad.easeOut',
//         onComplete: () => {
//           this.tweens.add({
//             targets: part,
//             y: '+=120',
//             duration: 500,
//             ease: 'Quad.easeIn'
//           });
//         }
//       });

//       // Move forward
//       this.tweens.add({
//         targets: part,
//         x: '+=180',
//         duration: 1000,
//         ease: 'Linear',
//         onComplete: () => {
//           if (part === this.playerBody) {
//             this.playerX += 180;
//             this.showExplanation(true);
//           }
//         }
//       });
//     });

//     // Happy face
//     this.playerMouth.clear();
//     this.playerMouth.lineStyle(3, 0x000000);
//     this.playerMouth.arc(this.playerBody.x, this.playerBody.y + 5, 12, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0), true);
//     this.playerMouth.strokePath();

//     // Remove obstacle
//     this.time.delayedCall(500, () => {
//       this.obstacles.forEach(obs => {
//         obs.forEach(part => {
//           this.tweens.add({
//             targets: part,
//             alpha: 0,
//             scale: 0,
//             duration: 300,
//             onComplete: () => part.destroy()
//           });
//         });
//       });
//     });

//     // Celebration particles
//     for (let i = 0; i < 20; i++) {
//       const particle = this.add.circle(
//         this.playerX,
//         this.groundY - 30,
//         5,
//         Phaser.Display.Color.RandomRGB().color
//       );
      
//       this.tweens.add({
//         targets: particle,
//         x: this.playerX + Phaser.Math.Between(-60, 60),
//         y: this.groundY - Phaser.Math.Between(100, 180),
//         alpha: 0,
//         duration: 1200,
//         ease: 'Cubic.easeOut',
//         onComplete: () => particle.destroy()
//       });
//     }
//   }

//   moveBackward() {
//     // Sad face
//     this.playerMouth.clear();
//     this.playerMouth.lineStyle(3, 0x000000);
//     this.playerMouth.arc(this.playerBody.x, this.playerBody.y + 15, 10, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
//     this.playerMouth.strokePath();

//     // Stumble backward
//     this.playerParts.forEach(part => {
//       this.tweens.add({
//         targets: part,
//         x: '-=80',
//         duration: 500,
//         ease: 'Back.easeOut',
//         onComplete: () => {
//           if (part === this.playerBody) {
//             this.playerX -= 80;
//             this.showExplanation(false);
//           }
//         }
//       });
//     });

//     // Shake
//     this.tweens.add({
//       targets: this.playerBody,
//       angle: -15,
//       duration: 100,
//       yoyo: true,
//       repeat: 3,
//       onComplete: () => {
//         this.playerBody.angle = 0;
//       }
//     });
//   }

//   showExplanation(isCorrect) {
//     const { width, height } = this.cameras.main;
//     const question = this.questions[this.currentQuestionIndex];

//     const boxColor = isCorrect ? 0x10b981 : 0xef4444;
//     const icon = isCorrect ? '✓' : '✗';
//     const message = isCorrect ? 'Awesome! Keep going!' : 'Oops! Try again next time!';

//     this.explanationBox = this.add.rectangle(
//       width / 2,
//       height - 100,
//       width * 0.85,
//       100,
//       boxColor,
//       0.95
//     ).setStrokeStyle(4, 0xffffff);

//     const content = question.explanation 
//       ? `${icon} ${message}\n${question.explanation}`
//       : `${icon} ${message}\nCorrect: ${question.correct_answer}`;

//     this.explanationText = this.add.text(
//       width / 2,
//       height - 125,
//       content,
//       {
//         fontSize: '17px',
//         fontFamily: 'Arial',
//         color: '#ffffff',
//         fontStyle: 'bold',
//         align: 'center',
//         wordWrap: { width: width * 0.75 }
//       }
//     ).setOrigin(0.5);

//     // Next button
//     const isLast = this.currentQuestionIndex >= this.questions.length - 1;
//     const btnText = isLast ? 'Finish Race! 🏁' : 'Next Question ➜';
    
//     const nextBtn = this.add.rectangle(
//       width / 2,
//       height - 35,
//       200,
//       48,
//       0xfbbf24,
//       1
//     ).setStrokeStyle(3, 0xffffff).setInteractive({ useHandCursor: true });

//     const nextText = this.add.text(
//       width / 2,
//       height - 35,
//       btnText,
//       {
//         fontSize: '19px',
//         fontFamily: 'Arial',
//         color: '#1f2937',
//         fontStyle: 'bold'
//       }
//     ).setOrigin(0.5);

//     this.nextButton = this.add.container(0, 0, [nextBtn, nextText]);

//     nextBtn.on('pointerover', () => {
//       nextBtn.setFillStyle(0xfcd34d, 1);
//       this.tweens.add({ targets: this.nextButton, scale: 1.05, duration: 150 });
//     });

//     nextBtn.on('pointerout', () => {
//       nextBtn.setFillStyle(0xfbbf24, 1);
//       this.tweens.add({ targets: this.nextButton, scale: 1, duration: 150 });
//     });

//     nextBtn.on('pointerdown', () => {
//       if (this.currentQuestionIndex < this.questions.length - 1) {
//         this.currentQuestionIndex++;
        
//         // Reset face
//         this.playerMouth.clear();
//         this.playerMouth.lineStyle(3, 0x000000);
//         this.playerMouth.arc(this.playerBody.x, this.playerBody.y + 5, 10, 0, Math.PI, false);
//         this.playerMouth.strokePath();
        
//         this.idleAnimation();
//         this.displayQuestion();
//       } else {
//         this.celebrationSound();
//         const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
//         this.onComplete({
//           score: this.score,
//           correctAnswers: this.correctAnswers,
//           totalQuestions: this.questions.length,
//           timeSpent
//         });
//       }
//     });
//   }
// }

// const PhaserQuizGame = () => {
//   const gameRef = useRef(null);
//   const phaserGameRef = useRef(null);
//   const navigate = useNavigate();
//   const { subject } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [gameComplete, setGameComplete] = useState(false);
//   const [results, setResults] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   const subjects = [
//     { name: 'Math', value: 'math', icon: '🔢', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
//     { name: 'Science', value: 'science', icon: '🔬', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
//     { name: 'Reading', value: 'reading', icon: '📚', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
//     { name: 'Government', value: 'government', icon: '🏛️', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' }
//   ];

//   const startQuiz = async (subjectValue) => {
//     setSelectedSubject(subjectValue);
//     setLoading(true);
//     setError(null);

//     try {
//       const questions = await fetchQuestionsBySubject(subjectValue);

//       if (questions.length === 0) {
//         setError(`No questions found for "${subjectValue}"`);
//         setLoading(false);
//         setSelectedSubject(null);
//         return;
//       }

//       setLoading(false);

//       setTimeout(() => {
//         if (!gameRef.current) return;

//         const config = {
//           type: Phaser.AUTO,
//           parent: gameRef.current,
//           width: 900,
//           height: 700,
//           backgroundColor: '#87ceeb',
//           scene: QuizRunnerScene,
//           scale: {
//             mode: Phaser.Scale.FIT,
//             autoCenter: Phaser.Scale.CENTER_BOTH
//           }
//         };

//         phaserGameRef.current = new Phaser.Game(config);
//         phaserGameRef.current.scene.start('QuizRunnerScene', {
//           questions,
//           subject: subjectValue,
//           onComplete: (res) => {
//             setResults(res);
//             setGameComplete(true);
//           }
//         });
//       }, 100);
//     } catch (err) {
//       setError(`Failed to load questions: ${err.message}`);
//       setLoading(false);
//       setSelectedSubject(null);
//     }
//   };

//   useEffect(() => {
//     if (subject) startQuiz(subject);
//     return () => {
//       if (phaserGameRef.current) {
//         phaserGameRef.current.destroy(true);
//         phaserGameRef.current = null;
//       }
//     };
//   }, [subject]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (!subject && !selectedSubject && !loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-6">
//         <div className="max-w-4xl w-full">
//           <div className="text-center mb-12">
//             <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
//               Quiz Runner 🏃‍♂️
//             </h1>
//             <p className="text-2xl text-purple-100">Jump over obstacles by answering correctly!</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             {subjects.map((sub) => (
//               <button
//                 key={sub.value}
//                 onClick={() => startQuiz(sub.value)}
//                 className={`${sub.bgColor} p-10 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-white/50 hover:border-white`}
//               >
//                 <div className="text-7xl mb-4">{sub.icon}</div>
//                 <h2 className={`text-3xl font-bold bg-gradient-to-r ${sub.color} bg-clip-text text-transparent mb-2`}>
//                   {sub.name}
//                 </h2>
//                 <p className="text-gray-600 text-lg">Start Race →</p>
//               </button>
//             ))}
//           </div>

//           <div className="text-center">
//             <button
//               onClick={() => navigate('/')}
//               className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm border-2 border-white/30 transition-all"
//             >
//               ← Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//           <p className="text-3xl font-bold text-white mb-2">Loading {selectedSubject || subject} Race...</p>
//           <p className="text-xl text-purple-100">Get ready to run!</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-6">
//         <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
//           <div className="text-7xl mb-6">😞</div>
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
//           <p className="text-lg text-gray-600 mb-8">{error}</p>
//           <div className="space-y-3">
//             <button
//               onClick={() => {
//                 setError(null);
//                 setSelectedSubject(null);
//               }}
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
//             >
//               Choose Another Subject
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="w-full bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (gameComplete && results) {
//     const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
//     let performanceEmoji = '🎉';
//     let performanceMessage = 'Amazing!';
    
//     if (percentage >= 90) {
//       performanceEmoji = '🏆';
//       performanceMessage = 'Champion Runner!';
//     } else if (percentage >= 70) {
//       performanceEmoji = '⭐';
//       performanceMessage = 'Great Race!';
//     } else if (percentage >= 50) {
//       performanceEmoji = '👍';
//       performanceMessage = 'Good Effort!';
//     } else {
//       performanceEmoji = '💪';
//       performanceMessage = 'Keep Training!';
//     }
    
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-6">
//         <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
//           <div className="text-9xl mb-6 animate-bounce">{performanceEmoji}</div>
//           <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
//             {performanceMessage}
//           </h1>
//           <p className="text-2xl text-gray-600 mb-10">Race Complete!</p>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
//             <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl">
//               <div className="text-5xl font-bold text-purple-600 mb-2">{results.score}</div>
//               <div className="text-sm text-gray-700 font-semibold">Points</div>
//             </div>

//             <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl">
//               <div className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</div>
//               <div className="text-sm text-gray-700 font-semibold">Accuracy</div>
//             </div>

//             <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-6 rounded-2xl">
//               <div className="text-5xl font-bold text-cyan-600 mb-2">{results.correctAnswers}/{results.totalQuestions}</div>
//               <div className="text-sm text-gray-700 font-semibold">Correct</div>
//             </div>

//             <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl">
//               <div className="text-5xl font-bold text-yellow-600 mb-2">{formatTime(results.timeSpent)}</div>
//               <div className="text-sm text-gray-700 font-semibold">Time</div>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={() => {
//                 setGameComplete(false);
//                 setResults(null);
//                 setSelectedSubject(null);
//                 if (phaserGameRef.current) {
//                   phaserGameRef.current.destroy(true);
//                   phaserGameRef.current = null;
//                 }
//               }}
//               className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-5 rounded-xl hover:shadow-lg transition-all font-bold text-xl"
//             >
//               🔄 Race Again
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="flex-1 bg-white text-gray-700 border-4 border-gray-300 px-8 py-5 rounded-xl hover:bg-gray-50 transition-all font-bold text-xl"
//             >
//               🏠 Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex flex-col items-center justify-center p-6">
//       <div className="mb-6">
//         <button
//           onClick={() => {
//             if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
//               setSelectedSubject(null);
//               if (phaserGameRef.current) {
//                 phaserGameRef.current.destroy(true);
//                 phaserGameRef.current = null;
//               }
//             }
//           }}
//           className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold text-lg backdrop-blur-sm border-2 border-white/30 transition-all"
//         >
//           ← Back to Subjects
//         </button>
//       </div>
//       <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//         <div ref={gameRef} className="game-container" />
//       </div>
//     </div>
//   );
// };

// export default PhaserQuizGame;




import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Phaser from 'phaser';
import { fetchQuestionsBySubject } from '../gaming/api';
import { supabase } from '../supabaseClient';

// ============================================
// DATABASE INTEGRATION - FIXED FOR RLS
// ============================================

/**
 * Save game progress - uses existing lessons, doesn't create new ones
 */
const saveGameProgress = async (gameData, subjectValue, userId) => {
  try {
    const { questionResults, correctAnswers, totalQuestions, timeSpent } = gameData;
    
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) {
      console.log('No authenticated user, skipping save');
      return { success: false, error: 'No authenticated user' };
    }

    // Find existing lessons for this subject
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('subject', subjectValue)
      .eq('is_active', true)
      .limit(1);

    if (lessonError || !lessons || lessons.length === 0) {
      console.log('No lesson found for subject:', subjectValue);
      return { success: false, error: 'No lesson found' };
    }

    const lessonId = lessons[0].id;

    // Calculate concentration score
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const avgTimePerQuestion = timeSpent / totalQuestions;
    const speedScore = Math.max(0, 100 - (avgTimePerQuestion * 2));
    const concentrationScore = Math.round((accuracy * 0.7) + (speedScore * 0.3));

    // Create progress records from question results
    const progressRecords = questionResults.map(result => ({
      user_id: currentUserId,
      lesson_id: lessonId,
      question_id: result.questionId,
      is_correct: result.isCorrect,
      time_spent_seconds: result.timeSpent,
      concentration_score: concentrationScore,
      completed_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progressRecords, { 
        onConflict: 'user_id,lesson_id,question_id'
      });

    if (error) throw error;

    console.log('✅ Game progress saved successfully!');
    return { success: true, data };

  } catch (error) {
    console.error('❌ Error saving game progress:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// PHASER GAME SCENE
// ============================================

class QuizRunnerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QuizRunnerScene' });
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.isAnswered = false;
    this.startTime = 0;
    this.playerX = 150;
    this.obstacles = [];
    this.questionResults = []; // Track individual results
    this.questionStartTime = 0; // Track time per question
  }

  init(data) {
    this.questions = data.questions || [];
    this.onComplete = data.onComplete || (() => {});
    this.subject = data.subject || 'Quiz';
    this.startTime = Date.now();
  }

  createSounds() {
    const ctx = this.sound.context;
    
    this.correctSound = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    };
    
    this.wrongSound = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    };
    
    this.jumpSound = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    };
    
    this.celebrationSound = () => {
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + (index * 0.1);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    };
  }

  create() {
    const { width, height } = this.cameras.main;
    this.createSounds();

    // Sky background with gradient
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xe0f7ff, 0xe0f7ff, 1);
    sky.fillRect(0, 0, width, height);

    // Animated clouds
    for (let i = 0; i < 6; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(30, 150),
        Phaser.Math.Between(80, 120),
        Phaser.Math.Between(40, 60),
        0xffffff,
        0.8
      );
      this.tweens.add({
        targets: cloud,
        x: '+=100',
        duration: Phaser.Math.Between(20000, 30000),
        repeat: -1,
        yoyo: true
      });
    }

    // Ground
    this.groundY = height - 100;
    this.add.rectangle(width / 2, this.groundY + 50, width, 100, 0x8b7355);
    this.add.rectangle(width / 2, this.groundY, width, 30, 0x90ee90);

    // Finish line
    this.createFinishLine();

    // Create player
    this.createPlayer();

    // UI
    this.createUI();

    // Display question
    this.displayQuestion();
  }

  createPlayer() {
    const x = this.playerX;
    const y = this.groundY - 30;
    
    // Body
    this.playerBody = this.add.circle(x, y, 28, 0xff6b6b);
    
    // Eyes
    this.playerEyeL = this.add.circle(x - 10, y - 8, 6, 0xffffff);
    this.playerEyeR = this.add.circle(x + 10, y - 8, 6, 0xffffff);
    this.playerPupilL = this.add.circle(x - 8, y - 8, 3, 0x000000);
    this.playerPupilR = this.add.circle(x + 12, y - 8, 3, 0x000000);
    
    // Smile
    this.playerMouth = this.add.graphics();
    this.playerMouth.lineStyle(3, 0x000000);
    this.playerMouth.arc(x, y + 5, 10, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
    this.playerMouth.strokePath();
    
    // Arms
    this.playerArmL = this.add.rectangle(x - 20, y + 5, 8, 25, 0xff6b6b);
    this.playerArmL.setRotation(-0.3);
    this.playerArmR = this.add.rectangle(x + 20, y + 5, 8, 25, 0xff6b6b);
    this.playerArmR.setRotation(0.3);
    
    // Legs
    this.playerLegL = this.add.rectangle(x - 12, y + 35, 10, 30, 0xff6b6b);
    this.playerLegR = this.add.rectangle(x + 12, y + 35, 10, 30, 0xff6b6b);
    
    this.playerParts = [
      this.playerBody, this.playerEyeL, this.playerEyeR,
      this.playerPupilL, this.playerPupilR, this.playerMouth,
      this.playerArmL, this.playerArmR, this.playerLegL, this.playerLegR
    ];

    // Idle animation - bobbing
    this.idleAnimation();
  }

  idleAnimation() {
    this.playerParts.forEach(part => {
      if (part !== this.playerMouth) {
        this.tweens.add({
          targets: part,
          y: '-=8',
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
    
    // Arm swing
    this.tweens.add({
      targets: this.playerArmL,
      rotation: -0.5,
      duration: 700,
      yoyo: true,
      repeat: -1
    });
    this.tweens.add({
      targets: this.playerArmR,
      rotation: 0.5,
      duration: 700,
      yoyo: true,
      repeat: -1
    });
  }

  stopIdleAnimation() {
    this.tweens.killTweensOf(this.playerParts);
  }

  createFinishLine() {
    const { width } = this.cameras.main;
    const x = width - 100;
    
    this.finishPole = this.add.rectangle(x, this.groundY - 80, 8, 160, 0x8b4513);
    
    // Checkered flag
    const flag = this.add.graphics();
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const color = (row + col) % 2 === 0 ? 0x000000 : 0xffffff;
        flag.fillStyle(color, 1);
        flag.fillRect(x - 5 + col * 12, this.groundY - 160 + row * 12, 12, 12);
      }
    }
    
    this.trophy = this.add.text(x, this.groundY - 180, '🏆', {
      fontSize: '36px'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: [flag, this.trophy],
      x: '+=5',
      duration: 400,
      yoyo: true,
      repeat: -1
    });
  }

  createUI() {
    const { width } = this.cameras.main;

    // Score
    this.scoreText = this.add.text(width - 20, 20, `⭐ ${this.score}`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#fbbf24',
      fontStyle: 'bold',
      stroke: '#92400e',
      strokeThickness: 4
    }).setOrigin(1, 0);

    // Question counter
    this.questionCounter = this.add.text(20, 20, '', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#8b5cf6',
      padding: { x: 16, y: 10 }
    });

    // Progress bar
    this.progressBg = this.add.rectangle(width / 2, 70, width * 0.7, 35, 0x4b5563, 0.7);
    this.progressBg.setStrokeStyle(3, 0xffffff);
    this.progressFill = this.add.rectangle(
      width / 2 - (width * 0.7) / 2,
      70,
      0,
      35,
      0x10b981
    ).setOrigin(0, 0.5);
  }

  updateProgress() {
    const { width } = this.cameras.main;
    const progress = (this.currentQuestionIndex + 1) / this.questions.length;
    const maxWidth = width * 0.7;
    
    this.tweens.add({
      targets: this.progressFill,
      width: maxWidth * progress,
      duration: 500,
      ease: 'Power2'
    });
  }

  displayQuestion() {
    // Record when question starts
    this.questionStartTime = Date.now();

    // Clean up
    if (this.answerButtons) {
      this.answerButtons.forEach(btn => btn.container?.destroy());
    }
    this.answerButtons = [];
    this.isAnswered = false;

    [this.questionBg, this.questionText, this.explanationBox, 
     this.explanationText, this.nextButton].forEach(e => e?.destroy());

    // Remove old obstacles
    this.obstacles.forEach(obs => {
      obs.forEach(part => part?.destroy());
    });
    this.obstacles = [];

    const { width } = this.cameras.main;
    const question = this.questions[this.currentQuestionIndex];

    this.questionCounter.setText(`Question ${this.currentQuestionIndex + 1}/${this.questions.length}`);
    this.updateProgress();

    // Create obstacle for this question
    this.createObstacle();

    // Question panel
    this.questionBg = this.add.rectangle(width / 2, 140, width * 0.88, 90, 0xffffff, 0.95);
    this.questionBg.setStrokeStyle(4, 0x8b5cf6);
    
    this.questionText = this.add.text(width / 2, 140, question.question, {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#1f2937',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: width * 0.82 }
    }).setOrigin(0.5);

    // Answer buttons
    const startY = 245;
    const spacing = 70;

    question.options.forEach((option, index) => {
      const y = startY + (index * spacing);
      const btnWidth = width * 0.78;
      const btnHeight = 58;

      const button = this.add.rectangle(width / 2, y, btnWidth, btnHeight, 0xffffff, 0.95)
        .setStrokeStyle(3, 0x8b5cf6)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(width / 2, y, option, {
        fontSize: '19px',
        fontFamily: 'Arial',
        color: '#1f2937',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: btnWidth - 70 }
      }).setOrigin(0.5);

      const label = this.add.text(width / 2 - btnWidth / 2 + 22, y, String.fromCharCode(65 + index), {
        fontSize: '21px',
        fontFamily: 'Arial',
        color: '#8b5cf6',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const container = this.add.container(0, 0, [button, text, label]);

      button.on('pointerover', () => {
        if (!this.isAnswered) {
          button.setFillStyle(0xddd6fe, 1);
          this.tweens.add({
            targets: container,
            scale: 1.03,
            duration: 150
          });
        }
      });

      button.on('pointerout', () => {
        if (!this.isAnswered) {
          button.setFillStyle(0xffffff, 0.95);
          this.tweens.add({
            targets: container,
            scale: 1,
            duration: 150
          });
        }
      });

      button.on('pointerdown', () => {
        if (!this.isAnswered) {
          this.handleAnswer(option, button, text, label);
        }
      });

      this.answerButtons.push({ button, text, container, option, label });
    });
  }

  createObstacle() {
    const obstacleX = this.playerX + 200;
    const obstacleY = this.groundY - 40;
    
    // Rock obstacle
    const rock1 = this.add.circle(obstacleX, obstacleY, 25, 0x808080);
    const rock2 = this.add.circle(obstacleX - 15, obstacleY - 10, 18, 0x696969);
    const rock3 = this.add.circle(obstacleX + 15, obstacleY - 5, 15, 0x757575);
    
    this.obstacles.push([rock1, rock2, rock3]);
  }

  handleAnswer(option, button, text, label) {
    this.isAnswered = true;
    this.stopIdleAnimation();

    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = option === question.correct_answer;
    const timeSpent = Math.floor((Date.now() - this.questionStartTime) / 1000);

    // ✅ TRACK THIS QUESTION'S RESULT
    this.questionResults.push({
      questionId: question.id,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
      selectedAnswer: option
    });

    if (isCorrect) {
      this.score += 10;
      this.correctAnswers += 1;
      this.correctSound();
      
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.3,
        duration: 200,
        yoyo: true,
        onUpdate: () => {
          this.scoreText.setText(`⭐ ${this.score}`);
        }
      });

      this.jumpOverObstacle();
    } else {
      this.wrongSound();
      this.moveBackward();
    }

    // Button feedback
    this.answerButtons.forEach(({ button: btn, text: txt, label: lbl, option: opt }) => {
      const correct = opt === question.correct_answer;
      const selected = opt === option;

      if (correct) {
        btn.setFillStyle(0x22c55e, 1);
        btn.setStrokeStyle(4, 0x16a34a);
        txt.setColor('#ffffff');
        lbl.setColor('#ffffff');
      } else if (selected) {
        btn.setFillStyle(0xef4444, 1);
        btn.setStrokeStyle(4, 0xdc2626);
        txt.setColor('#ffffff');
        lbl.setColor('#ffffff');
      } else {
        btn.setAlpha(0.4);
        txt.setAlpha(0.4);
        lbl.setAlpha(0.4);
      }
    });
  }

  jumpOverObstacle() {
    this.jumpSound();
    
    // Running leg animation
    this.tweens.add({
      targets: this.playerLegL,
      y: '-=15',
      duration: 100,
      yoyo: true,
      repeat: 2
    });
    this.tweens.add({
      targets: this.playerLegR,
      y: '-=15',
      duration: 100,
      yoyo: true,
      repeat: 2,
      delay: 50
    });

    // Jump arc
    this.playerParts.forEach(part => {
      this.tweens.add({
        targets: part,
        y: '-=120',
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: part,
            y: '+=120',
            duration: 500,
            ease: 'Quad.easeIn'
          });
        }
      });

      // Move forward
      this.tweens.add({
        targets: part,
        x: '+=180',
        duration: 1000,
        ease: 'Linear',
        onComplete: () => {
          if (part === this.playerBody) {
            this.playerX += 180;
            this.showExplanation(true);
          }
        }
      });
    });

    // Happy face
    this.playerMouth.clear();
    this.playerMouth.lineStyle(3, 0x000000);
    this.playerMouth.arc(this.playerBody.x, this.playerBody.y + 5, 12, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0), true);
    this.playerMouth.strokePath();

    // Remove obstacle
    this.time.delayedCall(500, () => {
      this.obstacles.forEach(obs => {
        obs.forEach(part => {
          this.tweens.add({
            targets: part,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => part.destroy()
          });
        });
      });
    });

    // Celebration particles
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        this.playerX,
        this.groundY - 30,
        5,
        Phaser.Display.Color.RandomRGB().color
      );
      
      this.tweens.add({
        targets: particle,
        x: this.playerX + Phaser.Math.Between(-60, 60),
        y: this.groundY - Phaser.Math.Between(100, 180),
        alpha: 0,
        duration: 1200,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  moveBackward() {
    // Sad face
    this.playerMouth.clear();
    this.playerMouth.lineStyle(3, 0x000000);
    this.playerMouth.arc(this.playerBody.x, this.playerBody.y + 15, 10, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
    this.playerMouth.strokePath();

    // Stumble backward
    this.playerParts.forEach(part => {
      this.tweens.add({
        targets: part,
        x: '-=80',
        duration: 500,
        ease: 'Back.easeOut',
        onComplete: () => {
          if (part === this.playerBody) {
            this.playerX -= 80;
            this.showExplanation(false);
          }
        }
      });
    });

    // Shake
    this.tweens.add({
      targets: this.playerBody,
      angle: -15,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.playerBody.angle = 0;
      }
    });
  }

  showExplanation(isCorrect) {
    const { width, height } = this.cameras.main;
    const question = this.questions[this.currentQuestionIndex];

    const boxColor = isCorrect ? 0x10b981 : 0xef4444;
    const icon = isCorrect ? '✓' : '✗';
    const message = isCorrect ? 'Awesome! Keep going!' : 'Oops! Try again next time!';

    this.explanationBox = this.add.rectangle(
      width / 2,
      height - 100,
      width * 0.85,
      100,
      boxColor,
      0.95
    ).setStrokeStyle(4, 0xffffff);

    const content = question.explanation 
      ? `${icon} ${message}\n${question.explanation}`
      : `${icon} ${message}\nCorrect: ${question.correct_answer}`;

    this.explanationText = this.add.text(
      width / 2,
      height - 125,
      content,
      {
        fontSize: '17px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: width * 0.75 }
      }
    ).setOrigin(0.5);

    // Next button
    const isLast = this.currentQuestionIndex >= this.questions.length - 1;
    const btnText = isLast ? 'Finish Race! 🏁' : 'Next Question ➜';
    
    const nextBtn = this.add.rectangle(
      width / 2,
      height - 35,
      200,
      48,
      0xfbbf24,
      1
    ).setStrokeStyle(3, 0xffffff).setInteractive({ useHandCursor: true });

    const nextText = this.add.text(
      width / 2,
      height - 35,
      btnText,
      {
        fontSize: '19px',
        fontFamily: 'Arial',
        color: '#1f2937',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.nextButton = this.add.container(0, 0, [nextBtn, nextText]);

    nextBtn.on('pointerover', () => {
      nextBtn.setFillStyle(0xfcd34d, 1);
      this.tweens.add({ targets: this.nextButton, scale: 1.05, duration: 150 });
    });

    nextBtn.on('pointerout', () => {
      nextBtn.setFillStyle(0xfbbf24, 1);
      this.tweens.add({ targets: this.nextButton, scale: 1, duration: 150 });
    });

    nextBtn.on('pointerdown', () => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        
        // Reset face
        this.playerMouth.clear();
        this.playerMouth.lineStyle(3, 0x000000);
        this.playerMouth.arc(this.playerBody.x, this.playerBody.y + 5, 10, 0, Math.PI, false);
        this.playerMouth.strokePath();
        
        this.idleAnimation();
        this.displayQuestion();
      } else {
        this.celebrationSound();
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        
        // ✅ PASS questionResults TO onComplete
        this.onComplete({
          score: this.score,
          correctAnswers: this.correctAnswers,
          totalQuestions: this.questions.length,
          timeSpent: timeSpent,
          questionResults: this.questionResults
        });
      }
    });
  }
}

// ============================================
// REACT COMPONENT
// ============================================

const PhaserQuizGame = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const navigate = useNavigate();
  const { subject } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    { name: 'Math', value: 'math', icon: '🔢', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
    { name: 'Science', value: 'science', icon: '🔬', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
    { name: 'Reading', value: 'reading', icon: '📚', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
    { name: 'Government', value: 'government', icon: '🏛️', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' }
  ];

  const startQuiz = async (subjectValue) => {
    setSelectedSubject(subjectValue);
    setLoading(true);
    setError(null);

    try {
      const questions = await fetchQuestionsBySubject(subjectValue);

      if (questions.length === 0) {
        setError(`No questions found for "${subjectValue}"`);
        setLoading(false);
        setSelectedSubject(null);
        return;
      }

      setLoading(false);

      setTimeout(() => {
        if (!gameRef.current) return;

        const config = {
          type: Phaser.AUTO,
          parent: gameRef.current,
          width: 900,
          height: 700,
          backgroundColor: '#87ceeb',
          scene: QuizRunnerScene,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
          }
        };

        phaserGameRef.current = new Phaser.Game(config);
        phaserGameRef.current.scene.start('QuizRunnerScene', {
          questions,
          subject: subjectValue,
          onComplete: async (gameResults) => {
            // ✅ SAVE TO DATABASE
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              const result = await saveGameProgress(
                gameResults, 
                subjectValue, 
                user.id
              );
              
              if (result.success) {
                console.log('✅ Progress saved! Will appear on dashboard.');
              } else {
                console.warn('⚠️ Could not save progress:', result.error);
              }
            }

            // Show results screen
            setResults(gameResults);
            setGameComplete(true);
          }
        });
      }, 100);
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
      setLoading(false);
      setSelectedSubject(null);
    }
  };

  useEffect(() => {
    if (subject) startQuiz(subject);
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [subject]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!subject && !selectedSubject && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Quiz Runner 🏃‍♂️
            </h1>
            <p className="text-2xl text-purple-100">Jump over obstacles by answering correctly!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {subjects.map((sub) => (
              <button
                key={sub.value}
                onClick={() => startQuiz(sub.value)}
                className={`${sub.bgColor} p-10 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-white/50 hover:border-white`}
              >
                <div className="text-7xl mb-4">{sub.icon}</div>
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${sub.color} bg-clip-text text-transparent mb-2`}>
                  {sub.name}
                </h2>
                <p className="text-gray-600 text-lg">Start Race →</p>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm border-2 border-white/30 transition-all"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-3xl font-bold text-white mb-2">Loading {selectedSubject || subject} Race...</p>
          <p className="text-xl text-purple-100">Get ready to run!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="text-7xl mb-6">😞</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-lg text-gray-600 mb-8">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                setSelectedSubject(null);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
            >
              Choose Another Subject
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete && results) {
    const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
    let performanceEmoji = '🎉';
    let performanceMessage = 'Amazing!';
    
    if (percentage >= 90) {
      performanceEmoji = '🏆';
      performanceMessage = 'Champion Runner!';
    } else if (percentage >= 70) {
      performanceEmoji = '⭐';
      performanceMessage = 'Great Race!';
    } else if (percentage >= 50) {
      performanceEmoji = '👍';
      performanceMessage = 'Good Effort!';
    } else {
      performanceEmoji = '💪';
      performanceMessage = 'Keep Training!';
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="text-9xl mb-6 animate-bounce">{performanceEmoji}</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            {performanceMessage}
          </h1>
          <p className="text-2xl text-gray-600 mb-10">Race Complete!</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl">
              <div className="text-5xl font-bold text-purple-600 mb-2">{results.score}</div>
              <div className="text-sm text-gray-700 font-semibold">Points</div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl">
              <div className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</div>
              <div className="text-sm text-gray-700 font-semibold">Accuracy</div>
            </div>

            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-6 rounded-2xl">
              <div className="text-5xl font-bold text-cyan-600 mb-2">{results.correctAnswers}/{results.totalQuestions}</div>
              <div className="text-sm text-gray-700 font-semibold">Correct</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl">
              <div className="text-5xl font-bold text-yellow-600 mb-2">{formatTime(results.timeSpent)}</div>
              <div className="text-sm text-gray-700 font-semibold">Time</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setGameComplete(false);
                setResults(null);
                setSelectedSubject(null);
                if (phaserGameRef.current) {
                  phaserGameRef.current.destroy(true);
                  phaserGameRef.current = null;
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-5 rounded-xl hover:shadow-lg transition-all font-bold text-xl"
            >
              🔄 Race Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-white text-gray-700 border-4 border-gray-300 px-8 py-5 rounded-xl hover:bg-gray-50 transition-all font-bold text-xl"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex flex-col items-center justify-center p-6">
      <div className="mb-6">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
              setSelectedSubject(null);
              if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true);
                phaserGameRef.current = null;
              }
            }
          }}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold text-lg backdrop-blur-sm border-2 border-white/30 transition-all"
        >
          ← Back to Subjects
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div ref={gameRef} className="game-container" />
      </div>
    </div>
  );
};

export default PhaserQuizGame