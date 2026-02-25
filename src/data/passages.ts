// Nepali and English typing passages for practice sessions

export const nepaliPassages: string[] = [
    "नेपाल एक सुन्दर देश हो जहाँ हिमाल, पहाड र तराईको भूमि छ। यहाँका मान्छेहरू मिलनसार र परिश्रमी छन्। नेपालको राजधानी काठमाडौं हो।",
    "शिक्षा मानव जीवनको आधार हो। ज्ञान र सीपले मान्छेलाई सफल बनाउँछ। हरेक बालबालिकाले गुणस्तरीय शिक्षा पाउनु पर्छ।",
    "नेपालमा विविध जाति, भाषा र संस्कृतिका मान्छेहरू मिलेर बस्छन्। यो विविधता नै हाम्रो शक्ति हो। एकताले ठूला काम गर्न सकिन्छ।",
    "प्रकृतिको संरक्षण हाम्रो दायित्व हो। हरियाली जंगल, सफा नदी र स्वच्छ वायु हाम्रा अमूल्य सम्पदा हुन्। यिनीहरूलाई जोगाउनु आवश्यक छ।",
    "परिश्रम र लगनशीलताले सफलता प्राप्त हुन्छ। आफ्नो लक्ष्य निर्धारण गरी अगाडि बढ्नु पर्छ। बाधाहरूलाई चुनौतीको रूपमा लिनु पर्छ।",
    "नेपालको इतिहास गौरवशाली छ। पृथ्वीनारायण शाहले नेपाललाई एकीकरण गरे। वीर योद्धाहरूले देशको रक्षा गर्न आफ्नो प्राण अर्पण गरे।",
    "स्वास्थ्य नै सम्पत्ति हो। नियमित व्यायाम, सन्तुलित आहार र पर्याप्त निद्राले स्वस्थ जीवन बाँच्न सकिन्छ। मानसिक स्वास्थ्यलाई पनि महत्त्व दिनु पर्छ।",
    "आधुनिक प्रविधिले संसारलाई साना बनाएको छ। इन्टरनेट र मोबाइलले सूचनाको आदान प्रदान सजिलो भएको छ। डिजिटल साक्षरता आजको आवश्यकता हो।",
    "कृषि नेपालको मुख्य पेशा हो। तराईको उपजाऊ भूमिमा धान, गहुँ र मकैको खेती हुन्छ। आधुनिक तरिकाले खेती गर्दा उत्पादन बढ्छ।",
    "पर्यटन नेपालको महत्त्वपूर्ण उद्योग हो। सगरमाथा, लुम्बिनी र पोखराले विश्वभरका पर्यटकलाई आकर्षित गर्छन्। पर्यटनले रोजगारी सिर्जना गर्छ।",
];

export const englishPassages: string[] = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vague or daft an awful quiz problem. The five boxing wizards jump quickly.",
    "In the beginning, life was simple. People worked together, shared what they had, and cared for one another. The world was smaller then, but the connections were deeper and more meaningful.",
    "Technology has transformed the way we live, work, and communicate. From smartphones to artificial intelligence, innovations continue to reshape our daily routines and push the boundaries of what is possible.",
    "A good programmer writes code that humans can understand. Clean, readable, and well-documented code is the hallmark of a professional developer who values maintainability and collaboration.",
    "The mountains stood tall against the orange sky. Every peak told a story of adventure, perseverance, and the timeless beauty of nature that no photograph could fully capture.",
    "Reading is to the mind what exercise is to the body. Books open windows to worlds we have never visited and introduce us to people we could never meet in ordinary life.",
    "Consistency is the key to mastery. Whether learning a new language, an instrument, or a sport, daily practice compounds over time and produces extraordinary results that seem effortless to observers.",
    "Science is not just a collection of facts but a way of thinking. It teaches us to question assumptions, form hypotheses, gather evidence, and revise our beliefs in light of new information.",
    "The café was full of quiet conversations and the warm aroma of freshly brewed coffee. Students typed on laptops, friends caught up over pastries, and time seemed to slow to a pleasant crawl.",
    "Empathy is the foundation of meaningful relationships. When we truly listen and try to understand another person's perspective, we build trust, reduce conflict, and create stronger human connections.",
];

/**
 * Returns a random passage for the given language mode.
 */
export function getRandomPassage(language: "nepali" | "english"): string {
    const pool = language === "nepali" ? nepaliPassages : englishPassages;
    return pool[Math.floor(Math.random() * pool.length)];
}
