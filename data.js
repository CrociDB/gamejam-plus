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
        background: new Vec3(0.0, 0.0, 0.0)
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
        background: new Vec3(0.0, 0.0, 0.0)
    },
    {
        entry: [
            "What are those things?",
            "Should I avoid them?"],
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
        distort: .13,
        background: new Vec3(0.2, 0.0, 0.0)
    },
    {
        entry: [
            "I don't feel so well.",
            "But that's good, right? If I feel therefore I am."],
        death: [
            "NO! I'm being consumed by those spikey thoughts!",
            "Avoid it!"
        ],
        obsDepth: 300,
        obsMinDist: 200,
        obsMul: 400,
        obsMax: 4,
        dist: 500,
        speed: .6,
        distort: .16,
        background: new Vec3(0.3, 0.0, 0.05)
    },
    {
        entry: [
            "But what am I?",
            "I'm pretty sure I'm not a ship."],
        death: [
            "NO! I'm being consumed by those spikey thoughts!",
            "Avoid it!"
        ],
        obsDepth: 250,
        obsMinDist: 150,
        obsMul: 400,
        obsMax: 4,
        dist: 500,
        speed: .6,
        distort: .17,
        background: new Vec3(0.36, 0.0, 0.05)
    }
];