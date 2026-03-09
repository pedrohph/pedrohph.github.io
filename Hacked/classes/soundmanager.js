const sfx = {
    // music: new Howl({
    //     src: ['assets/Music/gone_with_the_wind_-_graciano_choc.wav'],
    //     volume: 0.2,
    //     loop: true,
    //     autoplay: true,
    // }),
    natureSound: new Howl({
        src:['assets/sfx/placidplace-nature-soundstropicaljunglebirds-108380.mp3'],
        volume: 0.5,
        loop: true
    }),
    lastTaskSound: new Howl({
        src:['assets/sfx/last_task.mp3']
    }),
    correctPassword: new Howl({
        src:['assets/sfx/password_correct.mp3']
    }),
    incorrectPassword: new Howl({
        src:['assets/sfx/password_incorrect.mp3']
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
    })
    
}

export default sfx;