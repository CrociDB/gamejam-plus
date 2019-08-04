const LEVELS = [
    {
        obsDepth: 200,
        obsMinDist: 100,
        obsMul: 400,
        obsMax: 0,
        dist: 140,
        speed: .5,
        distort: .1,
        background: new Vec3(0.0, 0.0, 0.0)
    },
    {
        entry: [
            "What's going on?",
            "I feel like my head is a ship, and inside controlling it",
            "But nothing is responsive"
        ],
        obsDepth: 200,
        obsMinDist: 100,
        obsMul: 400,
        obsMax: 0,
        dist: 140,
        speed: .5,
        distort: .1,
        background: new Vec3(0.0, 0.0, 0.0)
    },
    {
        entry: [
            "I can't move. Can I?",
            "But I can blink. Once or twice.",
            "My eyes ar the only interface with this world."],
        obsDepth: 200,
        obsMinDist: 100,
        obsMul: 400,
        obsMax: 0,
        dist: 350,
        speed: .5,
        distort: .1,
        background: new Vec3(0.1, 0.3, 0.4)
    },
    {
        entry: [
            "Which world is this I'm in?",
            "I am... Am I?"],
        obsDepth: 200,
        obsMinDist: 100,
        obsMul: 400,
        obsMax: 0,
        dist: 100,
        speed: .5,
        distort: .1,
        background: new Vec3(0.2, 0.5, 0.6)
    },
    {
        entry: [
            "What are those things?",
            "Should I avoid it?"],
        death: [
            "NO! I'm being consumed by those spikey thoughts!",
            "Avoid it!"
        ],
        obsDepth: 300,
        obsMinDist: 200,
        obsMul: 400,
        obsMax: 3,
        dist: 500,
        speed: .5,
        distort: .1,
        background: new Vec3(0.2, 0.5, 0.6)
    },
];