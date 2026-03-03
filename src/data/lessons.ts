export interface Lesson {
    id: string;
    title: string;
    description: string;
    content: string;
    keysFocus: string[];
}

export interface Unit {
    id: string;
    title: string;
    lessons: Lesson[];
}

export const ENGLISH_LESSONS: Unit[] = [
    {
        id: "en-unit-1",
        title: "Unit 1: The Home Row",
        lessons: [
            {
                id: "en-u1-l1",
                title: "Lesson 1: Index Fingers (F and J)",
                description: "Focus on F and J keys using your index fingers.",
                content: "f f f j j j fj fj ff jj fjfj jfjf",
                keysFocus: ["f", "j"],
            },
            {
                id: "en-u1-l2",
                title: "Lesson 2: Adding D and K",
                description: "Introduce D and K keys using middle fingers.",
                content: "d d d k k k dk dk dd kk dfjk kjfd",
                keysFocus: ["d", "k"],
            },
            {
                id: "en-u1-l3",
                title: "Lesson 3: Adding S and L",
                description: "Introduce S and L keys using ring fingers.",
                content: "s s s l l l sl sl ss ll asdf jkl; lksd",
                keysFocus: ["s", "l"],
            },
            {
                id: "en-u1-l4",
                title: "Lesson 4: Adding A and ;",
                description: "Complete the home row with A and semicolon.",
                content: "a a a ; ; ; a; a; aa ;; asdf jkl; fads jalk",
                keysFocus: ["a", ";"],
            },
            {
                id: "en-u1-l5",
                title: "Lesson 5: Home Row Review",
                description: "Mixed practice for all home row keys.",
                content: "asdf jkl; fdsa jkl; salads flasks falls dads lads",
                keysFocus: ["a", "s", "d", "f", "j", "k", "l", ";"],
            },
            {
                id: "en-u1-mastery",
                title: "Unit 1 Mastery",
                description: "Master the home row keys with full words.",
                content: "asdf jkl; dada jalk flasks salads dads lads falls",
                keysFocus: ["home-row"],
            },
        ],
    },
    {
        id: "en-unit-2",
        title: "Unit 2: Top Row - Part 1",
        lessons: [
            {
                id: "en-u2-l1",
                title: "Lesson 1: E and I",
                description: "Focus on E and I keys.",
                content: "e e e i i i ei ei ee ii die kid led lid side",
                keysFocus: ["e", "i"],
            },
            {
                id: "en-u2-l2",
                title: "Lesson 2: R and U",
                description: "Focus on R and U keys.",
                content: "r r r u u u ru ru rr uu rude sure true lure rude",
                keysFocus: ["r", "u"],
            },
            {
                id: "en-u2-l3",
                title: "Lesson 3: T and Y",
                description: "Focus on T and Y keys.",
                content: "t t t y y y ty ty tt yy they yet try toy city",
                keysFocus: ["t", "y"],
            },
            {
                id: "en-u2-l4",
                title: "Lesson 4: Q, W, O, P",
                description: "Complete the top row.",
                content: "q w o p qw op qp wo power water queue open",
                keysFocus: ["q", "w", "o", "p"],
            },
            {
                id: "en-u2-mastery",
                title: "Unit 2 Mastery",
                description: "Combine home row and top row keys.",
                content: "The power of water is clear in the open sea. Quiet water flows deep and true.",
                keysFocus: ["top-row"],
            },
        ],
    },
    {
        id: "en-unit-3",
        title: "Unit 3: Bottom Row",
        lessons: [
            {
                id: "en-u3-l1",
                title: "Lesson 1: V and M",
                description: "Focus on V and M keys.",
                content: "v v v m m m vm vm vv mm move view valve mimic",
                keysFocus: ["v", "m"],
            },
            {
                id: "en-u3-l2",
                title: "Lesson 2: C and ,",
                description: "Focus on C and comma keys.",
                content: "c c c , , , c, c, cc ,, ice, cake, cold, mica,",
                keysFocus: ["c", ","],
            },
            {
                id: "en-u3-l3",
                title: "Lesson 3: X, Z and /",
                description: "Focus on tricky bottom row keys.",
                content: "x x x z z z / / / xz zx mix size zero taxi/cab",
                keysFocus: ["x", "z", "/"],
            },
            {
                id: "en-u3-mastery",
                title: "Unit 3 Mastery",
                description: "Full keyboard proficiency test.",
                content: "The quick brown fox jumps over a lazy dog. Pack my box with five dozen liquor jugs.",
                keysFocus: ["all-rows"],
            },
        ],
    },
];

export const NEPALI_LESSONS: Unit[] = [
    {
        id: "ne-unit-1",
        title: "Unit 1: Home Row (Unicode Romanized)",
        lessons: [
            {
                id: "ne-u1-l1",
                title: "Lesson 1: क र ज (K and J keys)",
                description: "क र ज को अभ्यास गर्नुहोस्।",
                content: "क क क ज ज ज कज कज कक जज कजकज जकजक",
                keysFocus: ["क", "ज"],
            },
            {
                id: "ne-u1-l2",
                title: "Lesson 2: द र ह (D and H keys)",
                description: "द र ह को अभ्यास गर्नुहोस्।",
                content: "द द द ह ह ह दह दह दद हह दहदह हदहद",
                keysFocus: ["द", "ह"],
            },
            {
                id: "ne-u1-l3",
                title: "Lesson 3: स र ल (S and L keys)",
                description: "स र ल को अभ्यास गर्नुहोस्।",
                content: "स स स ल ल ल सल सल सस लल सलसल लसलस",
                keysFocus: ["स", "ल"],
            },
            {
                id: "ne-u1-l4",
                title: "Lesson 4: ा र अ (A and H keys)",
                description: "ा (आकार) र अ को अभ्यास गर्नुहोस्।",
                content: "ा ा ा अ अ अ ाअ ाअ ाा अअ आकाश आमा",
                keysFocus: ["ा", "अ"],
            },
            {
                id: "ne-u1-l5",
                title: "Lesson 5: Home Row Review",
                description: "होम रो को सबै कुञ्जीहरूको अभ्यास।",
                content: "क ज द ह स ल ा अ कसजदहल आमा काका साला",
                keysFocus: ["क", "ज", "द", "ह", "स", "ल", "ा", "अ"],
            },
            {
                id: "ne-u1-mastery",
                title: "Unit 1 Mastery",
                description: "होम रो को सबै कुञ्जीहरू प्रयोग गरी शब्दहरूको अभ्यास।",
                content: "आमा काका साला कलम सडक महल हल जड दस",
                keysFocus: ["home-row"],
            },
        ],
    },
    {
        id: "ne-unit-2",
        title: "Unit 2: Top Row - Part 1",
        lessons: [
            {
                id: "ne-u2-l1",
                title: "Lesson 1: म र न (M and N keys)",
                description: "म र न को अभ्यास गर्नुहोस्।",
                content: "म म म न न न मन मन मम नन मनमन नमम",
                keysFocus: ["म", "न"],
            },
            {
                id: "ne-u2-l2",
                title: "Lesson 2: र र त (R and T keys)",
                description: "र र त को अभ्यास गर्नुहोस्।",
                content: "र र र त त त रत रत रर तत रतरत तरतर",
                keysFocus: ["र", "त"],
            },
        ],
    },
    {
        id: "ne-unit-3",
        title: "Unit 3: Top Row - Part 2",
        lessons: [
            {
                id: "ne-u3-l1",
                title: "Lesson 1: इ र उ (E and U keys)",
                description: "इ र उ को अभ्यास गर्नुहोस्।",
                content: "इ इ इ उ उ उ इउ इउ इइ उउ इमान उकालो",
                keysFocus: ["इ", "उ"],
            },
            {
                id: "ne-u3-l2",
                title: "Lesson 2: प र च (P and C keys)",
                description: "प र च को अभ्यास गर्नुहोस्।",
                content: "प प प च च च पच पच पप चच पाच पाच",
                keysFocus: ["प", "च"],
            },
        ],
    },
];
