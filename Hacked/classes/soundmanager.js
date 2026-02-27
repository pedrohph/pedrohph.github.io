const sfx = {
    // music: new Howl({
    //     src: ['assets/Music/gone_with_the_wind_-_graciano_choc.wav'],
    //     volume: 0.2,
    //     loop: true,
    //     autoplay: true,
    // }),
    timeOver: new Howl({
        volume: 0.25,
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
    })
    
}

export default sfx;