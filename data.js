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
        dist: 250,
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
            "Yes. Definitely.",
            "It hurts me."
        ],
        obsDepth: 100,
        obsMinDist: 200,
        obsMul: 5,
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
        obsDepth: 100,
        obsMinDist: 200,
        obsMul: 4,
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
            "I'm not a ship. But these spikey things still not good.",
            "Avoid it!"
        ],
        obsDepth: 80,
        obsMinDist: 100,
        obsMul: 3,
        obsMax: 4,
        dist: 500,
        speed: .6,
        distort: .17,
        background: new Vec3(0.36, 0.0, 0.05)
    },
    {
        entry: [
            "Why do these bad thoughts keep coming?",
            "It's getting harder to dodge."],
        death: [
            "These are the bad thoughts!",
            "DO NOT TOUCH IT!"
        ],
        obsDepth: 100,
        obsMinDist: 100,
        obsMul: 3,
        obsMax: 5,
        dist: 550,
        speed: .6,
        distort: .17,
        background: new Vec3(0.36, 0.0, 0.05)
    },
    {
        entry: [
            "Maybe it's just a dream.",
            "But I still can't remember who I am."],
        death: [
            "Bad thoughts again."
        ],
        obsDepth: 100,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 5,
        dist: 600,
        speed: .7,
        distort: .17,
        background: new Vec3(0.36, 0.0, 0.05)
    },
    {
        entry: [
            "Nah, if I'm a person, I should dream of people",
            "So either I'm actually a ship, or it's not a dream"],
        death: [
            "Bad thoughts again. RUN FROM IT!"
        ],
        obsDepth: 70,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 6,
        dist: 650,
        speed: .75,
        distort: .17,
        background: new Vec3(0.3, 0.1, 0.1)
    },
    {
        entry: [
            "Actually...",
            "I can't be a ship.",
            "Ships are made by humans"],
        death: [
            "That ain't no good."
        ],
        obsDepth: 80,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 7,
        dist: 750,
        speed: .8,
        distort: .18,
        background: new Vec3(0.25, 0.1, 0.15)
    },
    {
        entry: [
            "So I might have made this ship",
            "... in my mind, at least.",
            "YES! In my mind. I have a mind."],
        death: [
            "Not that again..."
        ],
        obsDepth: 80,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 7,
        dist: 850,
        speed: .85,
        distort: .19,
        background: new Vec3(0.2, 0.12, 0.25)
    },
    {
        entry: [
            "That's only me."],
        death: [
            "Shit."
        ],
        obsDepth: 80,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 8,
        dist: 850,
        speed: .9,
        distort: .23,
        background: new Vec3(0.1, 0.2, 0.35)
    },
    {
        entry: [
            "I'm recovering"],
        death: [
            "Shit."
        ],
        obsDepth: 60,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 8,
        dist: 750,
        speed: .9,
        distort: .1,
        background: new Vec3(0.1, 0.25, 0.45)
    },
    {
        entry: [
            "Yes. I'm better, now."],
        death: [
            "Crap."
        ],
        obsDepth: 60,
        obsMinDist: 70,
        obsMul: 3,
        obsMax: 9,
        dist: 750,
        speed: .95,
        distort: .05,
        background: new Vec3(0.1, 0.28, 0.45)
    },
    {
        entry: [
            "I'm fine."],
        obsDepth: 500,
        obsMinDist: 150,
        obsMul: 400,
        obsMax: 1,
        dist: 550,
        speed: .95,
        distort: .05,
        background: new Vec3(0.2, 0.3, 0.45)
    },
    {
        entry: [
            "That was it.",
            "Thank you for playing.",
            "A game by Bruno 'CrociDB' Croci."],
        obsDepth: 250,
        obsMinDist: 150,
        obsMul: 400,
        obsMax: 0,
        dist: 500,
        speed: 0.9,
        distort: .2,
        background: new Vec3(0.2, 0.3, 0.5)
    }
];

const SOUNDS = {
    dialog_text: jsfxr([2,,0.1157,,0.0642,0.22,,-0.64,-0.78,,,-0.6599,,0.5267,,,,,0.64,,,,,0.65]),
    dialog_open: jsfxr([2,,0.1918,,0.24,0.21,,0.1799,-0.06,,,0.1399,,0.2896,,,,,0.9524,,,0.1366,,0.90]),
    dialog_close: jsfxr([2,,0.1918,,0.24,0.19,,-0.3,-0.06,,,0.1399,,0.2896,,,,,0.9524,,,0.1366,,0.90]),
    dialog_confirm: jsfxr([2,0.05,0.12,0.23,0.18,0.2,0.18,-0.04,0.3,0.27,0.28,0.1,,,,,,,1,,0.56,0.1,,0.69]),
    ship_moveA: jsfxr([3,0.29,0.0432,0.35,0.27,0.39,,0.2199,-0.14,,,0.4199,,,,,,,0.81,-0.4399,0.05,,0.4599,0.31]),
    ship_moveB: jsfxr([3,0.29,0.0432,0.35,0.27,0.42,,0.2199,-0.14,,,0.4199,,,,,,,0.81,-0.36,0.05,,0.4599,0.31]),
    ship_moveC: jsfxr([3,0.29,0.0432,0.35,0.32,0.27,,0.24,-0.14,,,0.4199,,,,,,,0.81,-0.36,0.05,,0.4599,0.31]),
    die: jsfxr([3,0.11,0.13,0.08,0.34,0.12,,-0.2579,,0.24,0.28,0.04,,,,0.37,,0.3799,0.6,0.04,,,,0.33]),
};