const sfx = {
     music: new Howl({
        src: ['assets/sfx/game_music.mp3'],
        loop: true
    }),
    introSound: new Howl({
        src:['assets/sfx/intro-sound.mp3'],
        volume: 0.5,
        loop: true
    }),
    lastTaskSound: new Howl({
        src:['assets/sfx/last_task.mp3'],
        volume: 1.75
    }),
   correctPassword: new Howl({
        src:['assets/sfx/password_correct.mp3'],
        volume: 1.25
    }),
    incorrectPassword: new Howl({
        src:['assets/sfx/password_incorrect.mp3'],
        loop: true,
        volume: 1.25
    }),
    reachPulseLevel: new Howl({
        src:['assets/sfx/reach_pulse_level.mp3']
    }),
    quickPulse: new Howl({
        src:['assets/sfx/shidenbeatsmusic-heartbeat-sound-effect-111218.mp3'],
        rate: 1.5,
        loop: true

    }),
    slowPulse: new Howl({
        src:['assets/sfx/shidenbeatsmusic-heartbeat-sound-effect-111218.mp3'],
        loop: true

    }),
    aplauseSound: new Howl({
        src:['assets/sfx/aplausesSound.mp3'],
        loop: true,
        volume: 0.85
    }),
    tigerSound: new Howl({
        src:['assets/sfx/sherimfal-tiger-light-roar-t-293716.mp3'],
        volume: 0.25,
        loop: true
    }),
    alarmSound: new Howl({
        src:['assets/sfx/alarm.ogg'],
        loop: true
    }),
    clockSound: new Howl({
        src:['assets/sfx/countdownbothversionsofhacked.mp3'],
        rate: 1.1
    }),
    alarm5930: new Howl({
        src:['assets/sfx/alarm-59-30.mp3'],
    }),
    alarm5600: new Howl({
        src:['assets/sfx/alarm-56.mp3'],
    }),
    endMusic: new Howl({
        src:['assets/sfx/end-music.mp3']
    }),
    confettiSound: new Howl({
        src:['assets/sfx/confetti_sound.mp3'],
        volume: 1.75
    })
    
}

export default sfx;