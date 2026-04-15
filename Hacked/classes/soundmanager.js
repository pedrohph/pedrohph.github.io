const sfx = {
    music: new Howl({
        src: ['assets/sfx/game_music.mp3'],
        volume: 0.3,
        loop: true
    }),
    natureSound: new Howl({
        src:['assets/sfx/placidplace-nature-soundstropicaljunglebirds-108380.mp3'],
        volume: 0.5,
        loop: true
    }),
    lastTaskSound: new Howl({
        src:['assets/sfx/last_task.mp3'],
        volume: 1.75
    }),
    correctPassword: new Howl({
        src:['assets/sfx/password_correct.mp3']
    }),
    incorrectPassword: new Howl({
        src:['assets/sfx/password_incorrect.mp3'],
        loop: true
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
        src:['assets/sfx/aplausesSound.mp3']
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
        src:['assets/sfx/clock.mp3']
    })
    
}

export default sfx;