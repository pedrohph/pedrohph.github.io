const sfx = {
    music: new Howl({
        src: ['Assets/Audio/game_music.mp3'],
        volume: 0.75,
        loop: true
    }),
    correctAnswer: new Howl({
        src:['Assets/Audio/correct_answer.mp3']
    }),
    incorrectAnswer: new Howl({
        src:['Assets/Audio/wrong_answer.mp3']
        // rate: 1.1
    }),
    confettiSound: new Howl({
        src:['Assets/Audio/confetti_sound.mp3'],
        volume: 1.75
    }),
}

export default sfx;