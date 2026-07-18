
export interface LabValues {
  [key: string]: string | number;
}

export interface PatientDetails {
  age: string | number;
  gender: string;
  weight: string | number;
  height: string | number;
  lifestyle: string;
  sleepHours: string | number;
  stressLevel: string;
  activityLevel: string;
}

const translations: any = {
  English: {
    earlyMorning: "Early Morning",
    breakfast: "Breakfast",
    midMorning: "Mid-Morning",
    lunch: "Lunch",
    eveningSnack: "Evening Snack",
    dinner: "Dinner",
    bedtime: "Bedtime",
    warmWaterLemon: "Warm water with lemon",
    oatsPorridge: "Oats porridge or Ragi Malt",
    seasonalFruit: "Seasonal fruit (Apple/Papaya)",
    brownRiceDal: "Brown rice, Dal, and Green vegetables",
    roastedMakhana: "Roasted Makhana or Nuts",
    vegSoupPhulka: "Vegetable soup and 2 Phulka",
    turmericMilk: "Turmeric Milk",
    detoxReason: "Detoxification and metabolism boost",
    energyReason: "Sustained energy and fiber",
    vitaminReason: "Vitamins and antioxidants",
    balancedReason: "Balanced protein and complex carbs",
    healthyFatReason: "Healthy fats and minerals",
    lightDigestReason: "Light and easy to digest",
    antiInflammatoryReason: "Anti-inflammatory and better sleep",
    lowHbAdvice: "Your hemoglobin is low. Focus on iron-rich foods like Spinach, Beetroot, and Pomegranate.",
    highSugarAdvice: "Your blood sugar levels are elevated. Avoid refined sugar and high-GI foods.",
    highCholesterolAdvice: "Cholesterol is on the higher side. Avoid fried foods and include more fiber.",
    sedentaryAdvice: "Since you have a sedentary lifestyle, aim for 30 minutes of brisk walking daily.",
    sleepAdvice: "Ensure at least 7-8 hours of quality sleep for better recovery.",
    ragiPorridge: "Ragi Porridge with Jaggery",
    ironReason: "High in iron to improve Hb levels.",
    milletKhichdi: "Millet Khichdi with lots of vegetables",
    sugarReason: "Low glycemic index to manage sugar.",
    cinnamonWater: "Cinnamon Water",
    sugarRegulateReason: "Helps in regulating blood sugar.",
    walnutsFlaxseeds: "Walnuts and Flaxseeds",
    heartHealthReason: "Omega-3 fatty acids for heart health.",
    preparationBoilLemon: "Boil water, add lemon",
    preparationCookMilk: "Cook with milk/water",
    preparationWashSlice: "Wash and slice",
    preparationSteamSaute: "Steam/Sauté",
    preparationDryRoast: "Dry roast",
    preparationBoilCook: "Boil/Cook on flame",
    preparationBoilTurmeric: "Boil with turmeric",
    // New Variety Options
    poha: "Poha with vegetables",
    quinoaUpma: "Quinoa Upma",
    sproutsSalad: "Sprouts Salad",
    milletCurdRice: "Millet Curd Rice",
    multigrainRoti: "Multigrain Roti with Sabzi",
    boiledChana: "Boiled Chana",
    fruitSalad: "Mixed Fruit Salad",
    grilledPaneer: "Grilled Paneer/Tofu with Veggies",
    moongDalSoup: "Moong Dal Soup",
    greenTea: "Green Tea",
    chiaSeedWater: "Chia Seed Water",
    idliSambar: "Idli with Sambar",
    dosaChutney: "Dosa with Mint Chutney"
  },
  Tamil: {
    earlyMorning: "அதிகாலை",
    breakfast: "காலை உணவு",
    midMorning: "மதியத்திற்கு முந்தைய உணவு",
    lunch: "மதிய உணவு",
    eveningSnack: "மாலை சிற்றுண்டி",
    dinner: "இரவு உணவு",
    bedtime: "தூங்கும் முன்",
    warmWaterLemon: "எலுமிச்சையுடன் வெதுவெதுப்பான நீர்",
    oatsPorridge: "ஓட்ஸ் கஞ்சி அல்லது ராகி மால்ட்",
    seasonalFruit: "பருவகால பழம் (ஆப்பிள்/பப்பாளி)",
    brownRiceDal: "பழுப்பு அரிசி, பருப்பு மற்றும் பச்சை காய்கறிகள்",
    roastedMakhana: "வறுத்த மக்கானா அல்லது கொட்டைகள்",
    vegSoupPhulka: "காயய்கறி சூப் மற்றும் 2 புல்கா",
    turmericMilk: "மஞ்சள் பால்",
    detoxReason: "நச்சு நீக்கம் மற்றும் வளர்சிதை மாற்ற ஊக்கம்",
    energyReason: "நிலையான ஆற்றல் மற்றும் நார்ச்சத்து",
    vitaminReason: "வைட்டமின்கள் மற்றும் ஆன்டிஆக்ஸிடன்ட்கள்",
    balancedReason: "சீரான புரதம் மற்றும் சிக்கலான கார்போஹைட்ரேட்டுகள்",
    healthyFatReason: "ஆரோக்கியமான கொழுப்புகள் மற்றும் தாதுக்கள்",
    lightDigestReason: "லேசானது மற்றும் ஜீரணிக்க எளிதானது",
    antiInflammatoryReason: "அழற்சி எதிர்ப்பு மற்றும் சிறந்த தூக்கம்",
    lowHbAdvice: "உங்கள் ஹீமோகுளோபின் குறைவாக உள்ளது. கீரை, பீட்ரூட் மற்றும் மாதுளை போன்ற இரும்புச்சத்து நிறைந்த உணவுகளில் கவனம் செலுத்துங்கள்.",
    highSugarAdvice: "உங்கள் இரத்த சர்க்கரை அளவு அதிகமாக உள்ளது. சுத்திகரிக்கப்பட்ட சர்க்கரை மற்றும் அதிக கிளைசெமிக் உணவுகளைத் தவிர்க்கவும்.",
    highCholesterolAdvice: "கொலஸ்ட்ரால் அதிகமாக உள்ளது. வறுத்த உணவுகளைத் தவிர்த்து, அதிக நார்ச்சத்துள்ள உணவுகளைச் சேர்க்கவும்.",
    sedentaryAdvice: "உங்களுக்கு உட்கார்ந்தே இருக்கும் வாழ்க்கை முறை இருப்பதால், தினமும் 30 நிமிடங்கள் விறுவிறுப்பாக நடக்க முயற்சிக்கவும்.",
    sleepAdvice: "சிறந்த மீட்சிக்கு குறைந்தபட்சம் 7-8 மணிநேர தரமான தூக்கத்தை உறுதி செய்யவும்.",
    ragiPorridge: "வெல்லத்துடன் ராகி கஞ்சி",
    ironReason: "ஹீமோகுளோபின் அளவை மேம்படுத்த இரும்புச்சத்து அதிகம்.",
    milletKhichdi: "நிறைய காயறிகளுடன் தினை கிச்சடி",
    sugarReason: "சர்க்கரையை நிர்வகிக்க குறைந்த கிளைசெமிக் குறியீடு.",
    cinnamonWater: "இலவங்கப்பட்டை தண்ணீர்",
    sugarRegulateReason: "இரத்த சர்க்கரையை சீராக்க உதவுகிறது.",
    walnutsFlaxseeds: "அக்ரூட் பருப்புகள் மற்றும் ஆளி விதைகள்",
    heartHealthReason: "இதய ஆரோக்கியத்திற்கான ஒமேகா-3 கொழுப்பு அமிலங்கள்.",
    preparationBoilLemon: "தண்ணீரை கொதிக்க வைத்து, எலுமிச்சை சேர்க்கவும்",
    preparationCookMilk: "பால்/தண்ணீருடன் சமைக்கவும்",
    preparationWashSlice: "கழுவி நறுக்கவும்",
    preparationSteamSaute: "ஆவியில் வேகவைக்கவும்/வதக்கவும்",
    preparationDryRoast: "வெறுமனே வறுக்கவும்",
    preparationBoilCook: "கொதிக்க வைக்கவும்/நெருப்பில் சமைக்கவும்",
    preparationBoilTurmeric: "மஞ்சள் சேர்த்து கொதிக்க வைக்கவும்",
    poha: "காய்கறிகளுடன் அவல் (போஹா)",
    quinoaUpma: "குயினோவா உப்புமா",
    sproutsSalad: "முளைகட்டிய பயறு சாலட்",
    milletCurdRice: "தினை தயிர் சாதம்",
    multigrainRoti: "மல்டிகிரைன் ரொட்டி மற்றும் காய்கறி",
    boiledChana: "வேகவைத்த சுண்டல்",
    fruitSalad: "கலப்பு பழ சாலட்",
    grilledPaneer: "கிரில்டு பன்னீர்/டோஃபு மற்றும் காய்கறிகள்",
    moongDalSoup: "பாசிப்பருப்பு சூப்",
    greenTea: "கிரீன் டீ",
    chiaSeedWater: "சியா விதை தண்ணீர்",
    idliSambar: "இட்லி மற்றும் சாம்பார்",
    dosaChutney: "தோசை மற்றும் புதினா சட்னி"
  },
  Hindi: {
    earlyMorning: "सुबह जल्दी",
    breakfast: "नाश्ता",
    midMorning: "दोपहर का नाश्ता",
    lunch: "दोपहर का भोजन",
    eveningSnack: "शाम का नाश्ता",
    dinner: "रात का भोजन",
    bedtime: "सोने का समय",
    warmWaterLemon: "नींबू के साथ गर्म पानी",
    oatsPorridge: "ओट्स दलिया या रागी माल्ट",
    seasonalFruit: "मौसमी फल (सेब/पपीता)",
    brownRiceDal: "ब्राउन राइस, दाल और हरी सब्जियां",
    roastedMakhana: "भुना हुआ मखाना या मेवे",
    vegSoupPhulka: "सब्जी का सूप और 2 फुल्का",
    turmericMilk: "हल्दी वाला दूध",
    detoxReason: "विषहरण और चयापचय को बढ़ावा",
    energyReason: "निरंतर ऊर्जा और फाइबर",
    vitaminReason: "विटामिन और एंटीऑक्सीडेंट",
    balancedReason: "संतुलित प्रोटीन और जटिल कार्ब्स",
    healthyFatReason: "स्वस्थ वसा और खनिज",
    lightDigestReason: "हल्का और पचाने में आसान",
    antiInflammatoryReason: "सूजन रोधी और बेहतर नींद",
    lowHbAdvice: "आपका हीमोग्लोबिन कम है। पालक, चुकंदर और अनार जैसे आयरन से भरपूर खाद्य पदार्थों पर ध्यान दें।",
    highSugarAdvice: "आपका ब्लड शुगर लेवल बढ़ा हुआ है। रिफाइंड शुगर और हाई-जीआई खाद्य पदार्थों से बचें।",
    highCholesterolAdvice: "कोलेस्ट्रॉल अधिक है। तले हुए खाद्य पदार्थों से बचें और अधिक फाइबर शामिल करें।",
    sedentaryAdvice: "चूंकि आपकी जीवनशैली गतिहीन है, इसलिए रोजाना 30 मिनट तेज चलने का लक्ष्य रखें।",
    sleepAdvice: "बेहतर रिकवरी के लिए कम से कम 7-8 घंटे की गुणवत्तापूर्ण नींद सुनिश्चित करें।",
    ragiPorridge: "गुड़ के साथ रागी का दलिया",
    ironReason: "हीमोग्लोबिन के स्तर को सुधारने के लिए आयरन से भरपूर।",
    milletKhichdi: "ढेर सारी सब्जियों के साथ बाजरे की खिचड़ी",
    sugarReason: "चीनी को प्रबंधित करने के लिए कम ग्लाइसेमिक इंडेक्स।",
    cinnamonWater: "दालचीनी का पानी",
    sugarRegulateReason: "ब्लड शुगर को नियंत्रित करने में मदद करता है।",
    walnutsFlaxseeds: "अखरोट और अलसी के बीज",
    heartHealthReason: "हृदय स्वास्थ्य के लिए ओमेगा-3 फैटी एसिड।",
    preparationBoilLemon: "पानी उबालें, नींबू डालें",
    preparationCookMilk: "दूध/पानी के साथ पकाएं",
    preparationWashSlice: "धोकर काट लें",
    preparationSteamSaute: "भाप में पकाएं/भूनें",
    preparationDryRoast: "सूखा भूनें",
    preparationBoilCook: "उबालें/आंच पर पकाएं",
    preparationBoilTurmeric: "हल्दी के साथ उबालें",
    poha: "सब्जियों के साथ पोहा",
    quinoaUpma: "क्विनोआ उपमा",
    sproutsSalad: "स्प्राउट्स सलाद",
    milletCurdRice: "मिलेट कर्ड राइस",
    multigrainRoti: "सब्जी के साथ मल्टीग्रेन रोटी",
    boiledChana: "उबला हुआ चना",
    fruitSalad: "मिश्रित फल सलाद",
    grilledPaneer: "ग्रिल्ड पनीर/टोफू सब्जियों के साथ",
    moongDalSoup: "मूंग दाल सूप",
    greenTea: "ग्रीन टी",
    chiaSeedWater: "चिया बीज का पानी",
    idliSambar: "सांभर के साथ इडली",
    dosaChutney: "पुदीने की चटनी के साथ डोसा"
  },
  Telugu: {
    earlyMorning: "వేకువజామున",
    breakfast: "అల్పాహారం",
    midMorning: "మధ్యాహ్నానికి ముందు",
    lunch: "మధ్యాహ్న భోజనం",
    eveningSnack: "సాయంత్రం స్నాక్",
    dinner: "రాత్రి భోజనం",
    bedtime: "పడుకునే ముందు",
    warmWaterLemon: "నిమ్మకాయతో గోరువెచ్చని నీరు",
    oatsPorridge: "ఓట్స్ గంజి లేదా రాగి మాల్ట్",
    seasonalFruit: "కాలానుగుణ పండు (ఆపిల్/బొప్పాయి)",
    brownRiceDal: "బ్రౌన్ రైస్, పప్పు మరియు ఆకుకూరలు",
    roastedMakhana: "వేయించిన మఖానా లేదా గింజలు",
    vegSoupPhulka: "వెజిటబుల్ సూప్ మరియు 2 పుల్కా",
    turmericMilk: "పసుపు పాలు",
    detoxReason: "విషహరణ మరియు జీవక్రియ పెంపు",
    energyReason: "నిరంతర శక్తి మరియు ఫైబర్",
    vitaminReason: "విటమిన్లు మరియు యాంటీఆక్సిడెంట్లు",
    balancedReason: "సమతుల్య ప్రోటీన్ మరియు కాంప్లెక్స్ కార్బ్స్",
    healthyFatReason: "ఆరోగ్యకరమైన కొవ్వులు మరియు ఖనిజాలు",
    lightDigestReason: "తేలికగా మరియు జీర్ణం కావడానికి సులభంగా ఉంటుంది",
    antiInflammatoryReason: "శోథ నిరోధక మరియు మెరుగైన నిద్ర",
    lowHbAdvice: "మీ హిమోగ్లోబిన్ తక్కువగా ఉంది. పాలకూర, బీట్‌రూట్ మరియు దానిమ్మ వంటి ఇనుము అధికంగా ఉండే ఆహారాలపై దృష్టి పెట్టండి.",
    highSugarAdvice: "మీ రక్తంలో చక్కెర స్థాయిలు ఎక్కువగా ఉన్నాయి. శుద్ధి చేసిన చక్కెర మరియు అధిక-GI ఆహారాలను నివారించండి.",
    highCholesterolAdvice: "కొలెస్ట్రాల్ ఎక్కువగా ఉంది. వేయించిన ఆహారాలను నివారించండి మరియు ఎక్కువ ఫైబర్‌ను చేర్చుకోండి.",
    sedentaryAdvice: "మీకు నిశ్చల జీవనశైలి ఉన్నందున, ప్రతిరోజూ 30 నిమిషాల వేగవంతమైన నడకను లక్ష్యంగా పెట్టుకోండి.",
    sleepAdvice: "మెరుగైన కోలుకోవడం కోసం కనీసం 7-8 గంటల నాణ్యమైన నిద్రను నిర్ధారించుకోండి.",
    ragiPorridge: "బెల్లంతో రాగి గంజి",
    ironReason: "Hb స్థాయిలను మెరుగుపరచడానికి ఇనుము అధికంగా ఉంటుంది.",
    milletKhichdi: "చాలా కూరగాయలతో చిరుధాన్యాల కిచిడీ",
    sugarReason: "చక్కెరను నిర్వహించడానికి తక్కువ గ్లైసెమిక్ సూచిక.",
    cinnamonWater: "దాల్చినచెక్క నీరు",
    sugarRegulateReason: "రక్తంలో చక్కెరను నియంత్రించడంలో సహాయపడుతుంది.",
    walnutsFlaxseeds: "అక్రోట్లు మరియు అవిసె గింజలు",
    heartHealthReason: "గుండె ఆరోగ్యం కోసం ఒమేగా-3 ఫ్యాటీ యాసిడ్స్.",
    preparationBoilLemon: "నీటిని మరిగించి, నిమ్మకాయను జోడించండి",
    preparationCookMilk: "పాలు/నీటితో ఉడికించాలి",
    preparationWashSlice: "కడిగి ముక్కలు చేయండి",
    preparationSteamSaute: "ఆవిరి మీద ఉడికించాలి/వేయించాలి",
    preparationDryRoast: "డ్రై రోస్ట్",
    preparationBoilCook: "మరిగించాలి/మంట మీద ఉడికించాలి",
    preparationBoilTurmeric: "పసుపుతో మరిగించాలి",
    poha: "కూరగాయలతో పోహా",
    quinoaUpma: "క్వినోవా ఉప్మా",
    sproutsSalad: "మొలకల సలాడ్",
    milletCurdRice: "మిల్లెట్ పెరుగు అన్నం",
    multigrainRoti: "సబ్జీతో మల్టీగ్రెయిన్ రోటీ",
    boiledChana: "ఉడికించిన శనగలు",
    fruitSalad: "మిశ్రమ పండ్ల సలాడ్",
    grilledPaneer: "కూరగాయలతో గ్రిల్డ్ పనీర్/టోఫు",
    moongDalSoup: "పెసరపప్పు సూప్",
    greenTea: "గ్రీన్ టీ",
    chiaSeedWater: "చియా విత్తనాల నీరు",
    idliSambar: "సాంబార్‌తో ఇడ్లీ",
    dosaChutney: "పుదీనా చట్నీతో దోస"
  },
  Kannada: {
    earlyMorning: "ಮುಂಜಾನೆ",
    breakfast: "ಬೆಳಗಿನ ಉಪಾಹಾರ",
    midMorning: "ಮಧ್ಯಾಹ್ನದ ಮುನ್ನ",
    lunch: "ಮಧ್ಯಾಹ್ನದ ಊಟ",
    eveningSnack: "ಸಂಜೆಯ ಉಪಾಹಾರ",
    dinner: "ರಾತ್ರಿಯ ಊಟ",
    bedtime: "ಮಲಗುವ ಮುನ್ನ",
    warmWaterLemon: "ನಿಂಬೆಯೊಂದಿಗೆ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರು",
    oatsPorridge: "ಓಟ್ಸ್ ಗಂಜಿ ಅಥವಾ ರಾಗಿ ಮಾಲ್ಟ್",
    seasonalFruit: "ಋತುಮಾನದ ಹಣ್ಣು (ಸೇಬು/ಪಪ್ಪಾಯಿ)",
    brownRiceDal: "ಕಂದು ಅಕ್ಕಿ, ಬೇಳೆ ಮತ್ತು ಹಸಿರು ತರಕಾರಿಗಳು",
    roastedMakhana: "ಹುರಿದ ಮಖಾನಾ ಅಥವಾ ಬೀಜಗಳು",
    vegSoupPhulka: "ತರಕಾರಿ ಸೂಪ್ ಮತ್ತು 2 ಫುಲ್ಕಾ",
    turmericMilk: "ಅರಿಶಿನ ಹಾಲು",
    detoxReason: "ವಿಷಹರಣ ಮತ್ತು ಚಯಾಪಚಯ ವೃದ್ಧಿ",
    energyReason: "ನಿರಂತರ ಶಕ್ತಿ ಮತ್ತು ನಾರಿನಂಶ",
    vitaminReason: "ವಿಟಮಿನ್ ಮತ್ತು ಆಂಟಿಆಕ್ಸಿಡೆಂಟ್",
    balancedReason: "ಸಮತೋಲಿತ ಪ್ರೋಟೀನ್ ಮತ್ತು ಸಂಕೀರ್ಣ ಕಾರ್ಬ್ಸ್",
    healthyFatReason: "ಆರೋಗ್ಯಕರ ಕೊಬ್ಬು ಮತ್ತು ಖನಿಜಗಳು",
    lightDigestReason: "ಹಗುರ ಮತ್ತು ಜೀರ್ಣಿಸಿಕೊಳ್ಳಲು ಸುಲಭ",
    antiInflammatoryReason: "ಉರಿಯೂತ ನಿರೋಧಕ ಮತ್ತು ಉತ್ತಮ ನಿದ್ರೆ",
    lowHbAdvice: "ನಿಮ್ಮ ಹಿಮೋಗ್ಲೋಬಿನ್ ಕಡಿಮೆಯಿದೆ. ಪಾಲಕ್, ಬೀಟ್ರೂಟ್ ಮತ್ತು ದಾಳಿಂಬೆಯಂತಹ ಕಬ್ಬಿಣಾಂಶ ಭರಿತ ಆಹಾರಗಳ ಮೇಲೆ ಗಮನ ಹರಿಸಿ.",
    highSugarAdvice: "ನಿಮ್ಮ ರಕ್ತದ ಸಕ್ಕರೆಯ ಮಟ್ಟ ಹೆಚ್ಚಾಗಿದೆ. ಸಂಸ್ಕರಿಸಿದ ಸಕ್ಕರೆ ಮತ್ತು ಹೆಚ್ಚು-GI ಆಹಾರಗಳನ್ನು ತಪ್ಪಿಸಿ.",
    highCholesterolAdvice: "ಕೊಲೆಸ್ಟ್ರಾಲ್ ಹೆಚ್ಚಾಗಿದೆ. ಹುರಿದ ಆಹಾರಗಳನ್ನು ತಪ್ಪಿಸಿ ಮತ್ತು ಹೆಚ್ಚು ನಾರಿನಂಶವನ್ನು ಸೇರಿಸಿ.",
    sedentaryAdvice: "ನಿಮ್ಮದು ಕುಳಿತೇ ಇರುವ ಜೀವನಶೈಲಿಯಾಗಿರುವುದರಿಂದ, ಪ್ರತಿದಿನ 30 ನಿಮಿಷಗಳ ವೇಗದ ನಡಿಗೆಯ ಗುರಿ ಹೊಂದಿರಿ.",
    sleepAdvice: "ಉತ್ತಮ ಚೇತರಿಕೆಗಾಗಿ ಕನಿಷ್ಠ 7-8 ಗಂಟೆಗಳ ಗುಣಮಟ್ಟದ ನಿದ್ರೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    ragiPorridge: "ಬೆಲ್ಲದೊಂದಿಗೆ ರಾಗಿ ಗಂಜಿ",
    ironReason: "Hb ಮಟ್ಟವನ್ನು ಸುಧಾರಿಸಲು ಕಬ್ಬಿಣಾಂಶ ಹೆಚ್ಚಿದೆ.",
    milletKhichdi: "ಸಾಕಷ್ಟು ತರಕಾರಿಗಳೊಂದಿಗೆ ಸಿರಿಧಾನ್ಯದ ಕಿಚಡಿ",
    sugarReason: "ಸಕ್ಕರೆಯನ್ನು ನಿರ್ವಹಿಸಲು ಕಡಿಮೆ ಗ್ಲೈಸೆಮಿಕ್ ಸೂಚ್ಯಂಕ.",
    cinnamonWater: "ದಾಲ್ಚಿನ್ನಿ ನೀರು",
    sugarRegulateReason: "ರಕ್ತದ ಸಕ್ಕರೆಯನ್ನು ನಿಯಂತ್ರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    walnutsFlaxseeds: "ಅಕ್ರೋಟ್ ಮತ್ತು ಅಗಸೆ ಬೀಜಗಳು",
    heartHealthReason: "ಹೃದಯದ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಒಮೆಗา-3 ಕೊಬ್ಬಿನಾಮ್ಲಗಳು.",
    preparationBoilLemon: "ನೀರನ್ನು ಕುದಿಸಿ, ನಿಂಬೆ ಸೇರಿಸಿ",
    preparationCookMilk: "ಹಾಲು/ನೀರಿನೊಂದಿಗೆ ಬೇಯಿಸಿ",
    preparationWashSlice: "ತೊಳೆದು ಕತ್ತರಿಸಿ",
    preparationSteamSaute: "ಹಬೆಯಲ್ಲಿ ಬೇಯಿಸಿ/ಹುರಿಯಿರಿ",
    preparationDryRoast: "ಒಣ ಹುರಿಯಿರಿ",
    preparationBoilCook: "ಕುದಿಸಿ/ಬೆಂಕಿಯಲ್ಲಿ ಬೇಯಿಸಿ",
    preparationBoilTurmeric: "ಅರಿಶಿನದೊಂದಿಗೆ ಕುದಿಸಿ",
    poha: "ತರಕಾರಿಗಳೊಂದಿಗೆ ಅವಲಕ್ಕಿ (ಪೋಹಾ)",
    quinoaUpma: "ಕ್ವಿನೋವಾ ಉಪ್ಮಾ",
    sproutsSalad: "ಮೊಳಕೆ ಭರಿತ ಸಲಾಡ್",
    milletCurdRice: "ಸಿರಿಧಾನ್ಯದ ಮೊಸರು ಅನ್ನ",
    multigrainRoti: "ಸಬ್ಜಿಯೊಂದಿಗೆ ಮಲ್ಟಿಗ್ರೇನ್ ರೊಟ್ಟಿ",
    boiledChana: "ಬೇಯಿಸಿದ ಕಡಲೆ",
    fruitSalad: "ಮಿಶ್ರ ಹಣ್ಣಿನ ಸಲಾಡ್",
    grilledPaneer: "ತರಕಾರಿಗಳೊಂದಿಗೆ ಗ್ರಿಲ್ಡ್ ಪನೀರ್/ಟೋಫು",
    moongDalSoup: "ಹೆಸರು ಬೇಳೆ ಸೂಪ್",
    greenTea: "ಗ್ರೀನ್ ಟೀ",
    chiaSeedWater: "ಚिया ಬೀಜದ ನೀರು",
    idliSambar: "ಸಾಂಬಾರ್ ಜೊತೆ ಇಡ್ಲಿ",
    dosaChutney: "ಪುದೀನಾ ಚಟ್ನಿ ಜೊತೆ ದೋಸೆ"
  },
  Malayalam: {
    earlyMorning: "അതിരാവിലെ",
    breakfast: "പ്രാതൽ",
    midMorning: "ഉച്ചയ്ക്ക് മുമ്പ്",
    lunch: "ഉച്ചഭക്ഷണം",
    eveningSnack: "വൈകുന്നേരത്തെ ലഘുഭക്ഷണം",
    dinner: "രാത്രിഭക്ഷണം",
    bedtime: "ഉറങ്ങുന്നതിന് മുമ്പ്",
    warmWaterLemon: "നാരങ്ങ ചേർത്ത ചെറുചൂടുവെള്ളം",
    oatsPorridge: "ഓട്സ് കഞ്ഞി അല്ലെങ്കിൽ റാഗി മാൾട്ട്",
    seasonalFruit: "സീസണൽ പഴം (ആപ്പിൾ/പപ്പായ)",
    brownRiceDal: "തവിട്ട് അരി, പരിപ്പ്, പച്ചക്കറികൾ",
    roastedMakhana: "വറുത്ത മഖാന അല്ലെങ്കിൽ അണ്ടിപ്പരിപ്പ്",
    vegSoupPhulka: "വെജിറ്റബിൾ സൂപ്പും 2 ഫുൽക്കയും",
    turmericMilk: "മഞ്ഞൾ പാൽ",
    detoxReason: "വിഷാംശം നീക്കം ചെയ്യലും മെറ്റബോളിസം വർദ്ധിപ്പിക്കലും",
    energyReason: "സ്ഥിരമായ ഊർജ്ജവും നാരുകളും",
    vitaminReason: "വിറ്റാമിനുകളും ആന്റിഓക്‌സിഡന്റുകളും",
    balancedReason: "സമീകൃത പ്രോട്ടീനും കോംപ്ലക്സ് കാർബ്സും",
    healthyFatReason: "ആരോഗ്യകരമായ കൊഴുപ്പുകളും ധാതുക്കളും",
    lightDigestReason: "ലഘുവായതും ദഹിക്കാൻ എളുപ്പമുള്ളതും",
    antiInflammatoryReason: "വീക്കം തടയുന്നതും മികച്ച ഉറക്കവും",
    lowHbAdvice: "നിങ്ങളുടെ ഹീമോഗ്ലോബിൻ കുറവാണ്. ചീര, ബീറ്റ്‌റൂട്ട്, മാതളനാരങ്ങ തുടങ്ങിയ ഇരുമ്പ് അടങ്ങിയ ഭക്ഷണങ്ങളിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക.",
    highSugarAdvice: "നിങ്ങളുടെ രക്തത്തിലെ പഞ്ചസാരയുടെ അളവ് കൂടുതലാണ്. ശുദ്ധീകരിച്ച പഞ്ചസാരയും ഉയർന്ന ജിഐ ഭക്ഷണങ്ങളും ഒഴിവാക്കുക.",
    highCholesterolAdvice: "കൊളസ്ട്രോൾ കൂടുതലാണ്. വറുത്ത ഭക്ഷണങ്ങൾ ഒഴിവാക്കി കൂടുതൽ നാരുകൾ ഉൾപ്പെടുത്തുക.",
    sedentaryAdvice: "നിങ്ങൾക്ക് ഉദാസീനമായ ജീവിതശൈലി ഉള്ളതിനാൽ, ദിവസവും 30 മിനിറ്റ് വേഗത്തിലുള്ള നടത്തം ലക്ഷ്യമിടുക.",
    sleepAdvice: "മികച്ച വീണ്ടെടുക്കലിനായി കുറഞ്ഞത് 7-8 മണിക്കൂർ ഗുണനിലവാരമുള്ള ഉറക്കം ഉറപ്പാക്കുക.",
    ragiPorridge: "ശർക്കര ചേർത്ത റാഗി കഞ്ഞി",
    ironReason: "Hb അളവ് മെച്ചപ്പെടുത്താൻ ഇരുമ്പ് ധാരാളമായി അടങ്ങിയിരിക്കുന്നു.",
    milletKhichdi: "ധാരാളം പച്ചക്കറികൾ ചേർത്ത മില്ലറ്റ് കിച്ചടി",
    sugarReason: "പഞ്ചസാര നിയന്ത്രിക്കാൻ കുറഞ്ഞ ഗ്ലൈസമിക് സൂചിക.",
    cinnamonWater: "കറുവപ്പട്ട വെള്ളം",
    sugarRegulateReason: "രക്തത്തിലെ പഞ്ചസാര നിയന്ത്രിക്കാൻ സഹായിക്കുന്നു.",
    walnutsFlaxseeds: "വാൽനട്ട്, ഫ്ളാക്സ് സീഡുകൾ",
    heartHealthReason: "ഹൃദയാരോഗ്യത്തിന് ഒമേഗ-3 ഫാറ്റി ఆസിഡുകൾ.",
    preparationBoilLemon: "വെള്ളം തിളപ്പിക്കുക, നാരങ്ങ ചേർക്കുക",
    preparationCookMilk: "പാലിലോ വെള്ളത്തിലോ പാകം ചെയ്യുക",
    preparationWashSlice: "കഴുകി മുറിക്കുക",
    preparationSteamSaute: "ആവിയിൽ വേവിക്കുക/വഴറ്റുക",
    preparationDryRoast: "വറുത്തെടുക്കുക",
    preparationBoilCook: "തിളപ്പിക്കുക/തീയിൽ പാകം ചെയ്യുക",
    preparationBoilTurmeric: "മഞ്ഞൾ ചേർത്ത് തിളപ്പിക്കുക",
    poha: "പച്ചക്കറികൾ ചേർത്ത അവൽ (പോഹ)",
    quinoaUpma: "ക്വിനോവ ഉപ്പുമാവ്",
    sproutsSalad: "മുളപ്പിച്ച പയർ സാലഡ്",
    milletCurdRice: "മില്ലറ്റ് തൈര് സാദം",
    multigrainRoti: "സബ്ജിക്കൊപ്പം മൾട്ടിഗ്രെയിൻ റൊട്ടി",
    boiledChana: "പുഴുങ്ങിയ കടല",
    fruitSalad: "മിക്സഡ് ഫ്രൂട്ട് സാലഡ്",
    grilledPaneer: "പച്ചക്കറികൾക്കൊപ്പം ഗ്രിൽഡ് പനീർ/ടോഫു",
    moongDalSoup: "ചെറുപയർ പരിപ്പ് സൂപ്പ്",
    greenTea: "ഗ്രീൻ టీ",
    chiaSeedWater: "ചിയ വിത്ത് വെള്ളം",
    idliSambar: "സാമ്പാറിനൊപ്പം ഇഡ്ഡലി",
    dosaChutney: "പുതിന ചട്ണിക്കൊപ്പം ദോശ"
  }
};

export const generateRuleBasedPlan = (details: PatientDetails, labValues: LabValues, language: string) => {
  const t = translations[language] || translations.English;
  const dietChart: any[] = [];
  const advice: string[] = [];
  
  // Helper to get a random item from an array
  const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  // Variety Pools with matching details
  const earlyMorningPool = [
    { food: t.warmWaterLemon, prep: t.preparationBoilLemon, reason: t.detoxReason },
    { food: t.greenTea, prep: t.preparationBoilTurmeric, reason: t.detoxReason },
    { food: t.chiaSeedWater, prep: t.preparationBoilLemon, reason: t.detoxReason }
  ];

  const breakfastPool = [
    { food: t.oatsPorridge, prep: t.preparationCookMilk, reason: t.energyReason },
    { food: t.poha, prep: t.preparationSteamSaute, reason: t.energyReason },
    { food: t.quinoaUpma, prep: t.preparationSteamSaute, reason: t.energyReason },
    { food: t.idliSambar, prep: t.preparationBoilCook, reason: t.energyReason },
    { food: t.dosaChutney, prep: t.preparationBoilCook, reason: t.energyReason }
  ];

  const lunchPool = [
    { food: t.brownRiceDal, prep: t.preparationSteamSaute, reason: t.balancedReason },
    { food: t.milletCurdRice, prep: t.preparationBoilCook, reason: t.balancedReason },
    { food: t.multigrainRoti, prep: t.preparationBoilCook, reason: t.balancedReason }
  ];

  const snackPool = [
    { food: t.roastedMakhana, prep: t.preparationDryRoast, reason: t.healthyFatReason },
    { food: t.boiledChana, prep: t.preparationBoilCook, reason: t.healthyFatReason },
    { food: t.fruitSalad, prep: t.preparationWashSlice, reason: t.vitaminReason },
    { food: t.sproutsSalad, prep: t.preparationWashSlice, reason: t.vitaminReason }
  ];

  const dinnerPool = [
    { food: t.vegSoupPhulka, prep: t.preparationBoilCook, reason: t.lightDigestReason },
    { food: t.grilledPaneer, prep: t.preparationSteamSaute, reason: t.lightDigestReason },
    { food: t.moongDalSoup, prep: t.preparationBoilCook, reason: t.lightDigestReason }
  ];

  const selectedEarly = getRandom(earlyMorningPool);
  const selectedBreakfast = getRandom(breakfastPool);
  const selectedLunch = getRandom(lunchPool);
  const selectedSnack = getRandom(snackPool);
  const selectedDinner = getRandom(dinnerPool);

  // Basic Diet Template with Variety
  const baseMeals = [
    { time: "7:00 AM", meal: t.earlyMorning, food: selectedEarly.food, quantity: "1 glass", preparation: selectedEarly.prep, reason: selectedEarly.reason },
    { time: "8:30 AM", meal: t.breakfast, food: selectedBreakfast.food, quantity: "1 bowl/plate", preparation: selectedBreakfast.prep, reason: selectedBreakfast.reason },
    { time: "11:00 AM", meal: t.midMorning, food: t.seasonalFruit, quantity: "1 medium", preparation: t.preparationWashSlice, reason: t.vitaminReason },
    { time: "1:30 PM", meal: t.lunch, food: selectedLunch.food, quantity: "1 cup each", preparation: selectedLunch.prep, reason: selectedLunch.reason },
    { time: "4:30 PM", meal: t.eveningSnack, food: selectedSnack.food, quantity: "1 handful/bowl", preparation: selectedSnack.prep, reason: selectedSnack.reason },
    { time: "8:00 PM", meal: t.dinner, food: selectedDinner.food, quantity: "1 bowl + 2", preparation: selectedDinner.prep, reason: selectedDinner.reason },
    { time: "9:30 PM", meal: t.bedtime, food: t.turmericMilk, quantity: "1 glass", preparation: t.preparationBoilTurmeric, reason: t.antiInflammatoryReason }
  ];

  // Adjust based on Lab Values
  const hb = parseFloat(String(labValues.Hemoglobin || labValues.Hb || "14"));
  const sugar = parseFloat(String(labValues["Blood Sugar"] || labValues.Glucose || "100"));
  const cholesterol = parseFloat(String(labValues.Cholesterol || "180"));

  if (hb < 12) {
    advice.push(t.lowHbAdvice);
    // Ensure iron rich option if Hb is low
    baseMeals[1].food = t.ragiPorridge;
    baseMeals[1].reason += ` - ${t.ironReason}`;
  }

  if (sugar > 140) {
    advice.push(t.highSugarAdvice);
    // Ensure low GI option if sugar is high
    baseMeals[3].food = t.milletKhichdi;
    baseMeals[3].reason += ` - ${t.sugarReason}`;
    baseMeals[6].food = t.cinnamonWater;
    baseMeals[6].reason = t.sugarRegulateReason;
  }

  if (cholesterol > 200) {
    advice.push(t.highCholesterolAdvice);
    baseMeals[4].food = t.walnutsFlaxseeds;
    baseMeals[4].reason += ` - ${t.heartHealthReason}`;
  }

  // Lifestyle adjustments
  if (details.lifestyle === "Sedentary") {
    advice.push(t.sedentaryAdvice);
  }

  if (parseInt(String(details.sleepHours)) < 7) {
    advice.push(t.sleepAdvice);
  }
  
  return {
    dietChart: baseMeals,
    generalAdvice: advice.join(" "),
    summary: `Plan: ${hb < 12 ? 'Low Hb' : 'Normal Hb'}, ${sugar > 140 ? 'High Sugar' : 'Normal Sugar'}`
  };
};
