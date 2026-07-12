// Expanded food database with 35 diverse menus.
// Each maps to an available WebP image in eat/images/<name_ko>.webp
const menuData = [
    // --- 한식 (Korean) ---
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "김치찌개",
        name_en: "Kimchi Stew",
        description_ko: "잘 익어 새콤한 신김치와 야들야들한 돼지고기를 듬뿍 넣고 달달 볶다가, 칼칼한 고춧가루 육수를 부어 보글보글 끓여낸 찌개입니다. 보들보들한 두부와 대파를 송송 얹어 한 입 떠먹으면 깊고 진한 얼큰함이 입안 가득 감돌며 밥 한 그릇을 부르는 소울푸드입니다.",
        description_en: "Sour, well-fermented kimchi and succulent pork belly strips sizzled together, then slow-simmered in a fiery, rich broth with silky tofu and fresh green onions. Every spoonful delivers a comforting, deeply savory embrace that demands a bowl of warm rice."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "된장찌개",
        name_en: "Soybean Paste Stew",
        description_ko: "구수하고 깊은 맛의 전통 된장을 풀고 달큰한 애호박, 쫄깃한 버섯, 부드러운 두부를 듬뿍 넣어 보글보글 끓여낸 찌개입니다. 뚝배기에서 피어오르는 구수한 내음과 뜨끈하고 짭조름한 국물 한 숟가락이 마음까지 따뜻하게 채워주는 정겨운 밥상의 주인공입니다.",
        description_en: "A comforting earthenware pot bubbling with deep, savory fermented soybean broth, loaded with sweet zucchini, chewy mushrooms, and tender tofu cubes. The rustic, earthy aroma and rich, salty-savory warmth bring pure satisfaction to your table."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "비빔밥",
        name_en: "Bibimbap",
        description_ko: "고슬고슬하게 지은 따뜻한 밥 위에 알록달록 고소하게 볶아낸 나물들과 야들야들한 소고기, 고소한 참기름과 매콤달콤한 비법 약고추장을 더해 슥슥 비벼 먹는 요리입니다. 한 입 가득 아삭하고 다채로운 식감과 환상적인 조화가 퍼지는 건강하고 화려한 한 그릇입니다.",
        description_en: "A gorgeous, colorful bouquet of fresh, seasoned mountain vegetables, savory minced beef, and a golden fried egg set over warm rice. Drizzled with fragrant toasted sesame oil and sweet-spicy gochujang, it creates a texture-rich symphony in every spoonful."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "불고기",
        name_en: "Bulgogi",
        description_ko: "얇게 저민 부드러운 소고기를 달콤 짭짤한 특제 간장 양념과 향긋한 마늘, 배즙에 재워 자작하게 볶아낸 요리입니다. 달콤한 육즙이 고기 사이사이에 가득 배어 있어 씹을 때마다 입안 가득 풍부한 풍미와 부드러움이 녹아내리는 온 가족의 사랑을 받는 반찬입니다.",
        description_en: "Velvety-thin slices of beef marinated in a sweet, savory soy glaze infused with garlic, pear juice, and sesame oil, grilled to caramelized perfection. Tender, juicy, and bursting with rich umami flavor that melts in your mouth."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "잡채",
        name_en: "Japchae",
        description_ko: "탱글탱글하고 쫄깃한 당면에 달큰하게 볶은 시금치, 아삭한 당근, 향긋한 표고버섯과 쇠고기를 더해 달콤 짭짤한 간장 소스로 버무려낸 잔치 요리입니다. 윤기가 자르르 흐르는 면발과 아삭한 채소들의 다채로운 식감이 씹을수록 깊은 고소함을 선사합니다.",
        description_en: "Springy sweet potato glass noodles wok-tossed to a glossy finish with colorful julienned vegetables, tender beef, and woody forest mushrooms, seasoned in a sweet soy-sesame glaze. Every bite is a delightful balance of chewy, crunchy, and savory."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "삼겹살",
        name_en: "Grilled Pork Belly",
        description_ko: "두툼한 돼지 삼겹살을 뜨거운 불판 위에 올려 노릇노릇하고 바삭하게 구워내 겉은 바삭하고 속은 고소한 육즙으로 꽉 찬 구이 요리입니다. 구운 마늘과 잘 익은 김치, 매콤달콤한 쌈장을 상추에 싸 한 입 가득 먹으면 터지는 기름진 고소함이 일품입니다.",
        description_en: "Thick, premium pork belly strips seared on a sizzling tabletop grill until golden and crispy on the outside, while remaining tender and dripping with rich, buttery juices inside. Wrapped in crisp lettuce with charred garlic and savory ssamjang."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "제육볶음",
        name_en: "Spicy Stir-fried Pork",
        description_ko: "야들야들한 돼지고기를 매콤칼칼한 고추장 특제 양념에 재워 강한 불에서 불맛이 나도록 빠르게 볶아낸 요리입니다. 매콤하고 달짝지근한 감칠맛 양념이 고기에 쏙 배어들어, 뜨끈한 흰쌀밥 위에 얹어 크게 한 입 먹으면 숟가락을 멈출 수 없는 중독성을 자랑합니다.",
        description_en: "Tender pork shoulder sliced thin and stir-fried in a roaring hot wok with a sweet, fiery gochujang sauce. Infused with a smoky char, caramelized onions, and scallions, this dish is a spicy flavor explosion that pairs perfectly with rice."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "갈비탕",
        name_en: "Short Rib Soup",
        description_ko: "큼직하고 살코기가 두툼하게 붙은 소갈비를 무, 파, 마늘과 함께 오랜 시간 은은하게 푹 고아내 맑고 깊은 국물이 일품인 보양식입니다. 뼈에서 부드럽게 쏙 빠지는 야들야들한 갈빗살을 소스에 찍어 먹고, 뜨끈하고 진한 고기 육수에 밥을 말아 깍두기를 얹어 먹는 맛이 최고입니다.",
        description_en: "Meaty beef short ribs slow-simmered for hours with sweet Korean radish and garlic to yield a crystal-clear, intensely beefy broth. The meat is fall-off-the-bone tender, and the piping hot soup warms you from the inside out."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "떡볶이",
        name_en: "Tteokbokki",
        description_ko: "말랑말랑하고 쫄깃쫄깃한 쌀떡과 감칠맛 가득한 어묵을 매콤하고 달콤한 고추장 소스에 자작하게 졸여낸 요리입니다. 새빨갛고 꾸덕꾸덕한 소스가 떡에 착 달라붙어 한 입 씹을 때마다 쫄깃한 식감과 매콤달콤함이 입안 가득 행복하게 퍼집니다.",
        description_en: "Chewy, cylindrical rice cakes and savory fish cakes bathed in a thick, glossy, bright red sauce that is the perfect blend of sweet and spicy. A comforting, highly addictive snack that represents the heart of Korean street food."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "김밥",
        name_en: "Gimbap",
        description_ko: "참기름과 깨로 고소하게 양념한 밥 위에 짭조름한 우엉, 달달한 계란지단, 아삭한 오이와 단무지, 햄을 넣고 김으로 단단하게 말아 썰어낸 요리입니다. 알록달록한 단면만큼이나 다채로운 속 재료들이 한 입에 쏙 들어가 아삭하고 고소하게 어우러지는 맛입니다.",
        description_en: "Fragrant rice seasoned with sesame oil, rolled in toasted seaweed sheets with a colorful filling of sweet egg omelet, savory ham, crunchy pickled radish, carrots, and spinach. Slice into perfect wheels for a clean, delicious harmony."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "감자탕",
        name_en: "Pork Backbone Stew",
        description_ko: "살코기가 듬뿍 붙은 돼지 등뼈와 포슬포슬한 감자, 구수한 우거지를 넣고 들깨가루를 듬뿍 뿌려 얼큰하고 진하게 끓여낸 탕 요리입니다. 뼈 사이사이 숨어있는 부드러운 고기를 발라먹는 재미와 칼칼하면서도 고소하고 깊은 국물 맛이 땀을 쏙 빼게 만듭니다.",
        description_en: "A massive, bubbling hot pot of tender pork backbones, soft potatoes, and earthy dried cabbage greens in a rich, spicy broth heavily dusted with wild sesame powder. Deep, rustic flavor with fall-apart tender meat."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "닭갈비",
        name_en: "Spicy Stir-fried Chicken",
        description_ko: "두툼한 닭고기를 매콤달콤한 비법 양념장에 버무려 포슬한 고구마, 향긋한 깻잎, 아삭한 양배추와 함께 철판 위에서 지글지글 볶아내는 요리입니다. 뜨거운 양념이 고기와 채소에 자작하게 배어들어 깻잎 쌈에 싸 먹으면 매콤한 풍미가 가득 펼쳐집니다.",
        description_en: "Chunks of boneless chicken marinated in sweet-spicy gochujang sauce, stir-fried on a huge iron plate with sweet potato slices, cabbage, and fragrant perilla leaves. Rich, spicy, and perfect with melted mozzarella cheese!"
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "부대찌개",
        name_en: "Army Base Stew",
        description_ko: "짭조름한 스팸과 소시지, 간 쇠고기에 새콤하게 잘 익은 김치와 칼칼한 양념장 육수를 붓고 라면 사리와 치즈를 얹어 즉석에서 보글보글 끓여 먹는 퓨전 찌개입니다. 햄에서 우러난 진하고 기름진 고소함과 얼큰한 국물이 환상의 조화를 이루며 끝없이 들어갑니다.",
        description_en: "A hearty fusion hot pot packed with American processed meats like Spam and hot dogs, spicy Korean kimchi, and baked beans, all simmered in a savory chili broth. Topped with instant ramen noodles and a slice of melted cheese."
    },

    // --- 중식 (Chinese) ---
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "짜장면",
        name_en: "Jajangmyeon",
        description_ko: "달콤하고 짭조름하며 고소한 검은 춘장에 큼직한 양파와 돼지고기를 넣고 센 불에 볶아 쫄깃한 면발 위에 듬뿍 얹어 비벼 먹는 국민 면 요리입니다. 면발을 입안 가득 후루룩 넘길 때 감도는 불향과 달큰한 소스의 풍미가 가히 독보적인 행복을 줍니다.",
        description_en: "Fresh, chewy noodles smothered in a thick, glossy dark sauce of sweet fermented black bean paste stir-fried with heaps of sweet onions and diced pork. Rich, deeply savory, and comforting with a signature wok aroma."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "짬뽕",
        name_en: "Jjamppong",
        description_ko: "오징어, 홍합 등 싱싱한 해산물과 아삭한 채소를 센 불에서 볶아 불향을 가득 입힌 후, 고추기름 육수를 부어 칼칼하고 뜨겁게 끓여낸 면 요리입니다. 땀이 송골송골 맺히는 얼큰하고 깊은 국물 한 모금이 답답한 속을 시원하게 풀어주는 해장의 명수입니다.",
        description_en: "A fiery Chinese-Korean noodle soup packed with fresh squid, mussels, and vegetables seared in a hot wok. The reddish, chili-infused seafood broth packs a smoky punch that is intensely spicy and refreshing."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "탕수육",
        name_en: "Sweet and Sour Pork",
        description_ko: "감자전분 옷을 입혀 겉은 바삭하고 속은 쫄깃하게 튀겨낸 돼지고기에 레몬과 오이, 당근을 넣은 새콤달콤하고 걸쭉한 소스를 곁들여 먹는 요리입니다. 바삭한 고기튀김의 틈새로 소스의 새콤함이 스며들어 입맛을 돋우는 영원한 인기 메뉴입니다.",
        description_en: "Strips of pork double-fried to an airy, crispy golden brown, accompanied by a translucent, glossy sweet-and-sour sauce loaded with pineapples and cucumbers. A delightful crunch followed by a burst of tangy-sweet glaze."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "마파두부",
        name_en: "Mapo Tofu",
        description_ko: "부드럽고 몽글몽글한 두부와 고소하게 볶은 다진 돼지고기를 붉은 두반장 소스에 졸여 알싸한 초피 가루를 얹어낸 사천 요리입니다. 혀끝이 짜릿해지는 화끈한 매운맛과 알싸한 풍미가 갓 지은 밥 위에 얹어 덮밥으로 슥슥 비벼 먹기에 최고입니다.",
        description_en: "Soft, silky cubes of tofu and seasoned minced pork bathed in a bright red, numbing Sichuan chili oil and broad bean paste sauce. Heavily spiced with Sichuan peppercorns, this dish is fiery, earthy, and aromatic."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "꿔바로우",
        name_en: "Guobaorou",
        description_ko: "넓적하게 저민 돼지고기에 쫀득한 찹쌀 반죽을 입혀 바삭하게 튀겨낸 후, 새콤하고 달콤한 특제 간장 소스를 얇게 코팅한 동북식 탕수육입니다. 한 입 베어 물면 바삭! 하고 터지는 소리와 함께 쫀득한 찹쌀떡 같은 식감, 그리고 톡 쏘는 새콤함이 예술입니다.",
        description_en: "Flat pork cutlets coated in a sticky potato starch batter, fried to a crisp, and tossed in a sweet vinegar sauce. Every bite starts with a loud crunch, transitions into a chewy, mochi-like texture, and ends with a sweet and sour kick."
    },

    // --- 일식 (Japanese) ---
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "돈까스",
        name_en: "Tonkatsu",
        description_ko: "두툼하고 육즙이 살아있는 돼지고기 등심에 거친 빵가루를 묻혀 깨끗한 기름에 바삭하게 튀겨낸 정통 일식 커틀릿입니다. 바삭바삭한 소리와 함께 씹는 순간 부드러운 살코기 사이로 고소한 육즙이 입안 가득 터지며, 달큰한 특제 브라운 소스와 환상의 케미를 이룹니다.",
        description_en: "A thick, succulent pork cutlet breaded in airy panko crumbs and fried to a deep golden crisp. Tender, juicy meat on the inside, exceptionally crunchy on the outside, served with a tangy, spiced brown sauce."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "라멘",
        name_en: "Japanese Ramen",
        description_ko: "진하게 우려낸 뽀얗고 깊은 돼지 사골 육수에 구수한 소스를 더하고, 쫄깃한 생면과 불향을 입혀 입안에서 살살 녹는 차슈, 반숙 계란을 얹어낸 면 요리입니다. 뜨끈하고 진득한 국물 한 모금이 입안을 부드럽게 감싸며 깊은 감칠맛을 남깁니다.",
        description_en: "Fresh noodles swimming in a rich, milky pork bone broth (tonkotsu) simmered for over 12 hours, topped with tender char siu pork belly, a soft-boiled egg, and bamboo shoots. A warm, velvety bowl of deep, comforting flavor."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "초밥",
        name_en: "Sushi",
        description_ko: "단맛과 신맛이 조화로운 초밥 밥 위에 신선하게 갓 뜬 선홍빛 연어, 참치, 광어 등 제철 활어회를 얹고 고추냉이를 곁들여 먹는 명품 요리입니다. 밥알 사이사이의 부드러움과 신선한 생선살의 깃깃하고 쫀득함이 혀끝에서 기분 좋게 사르르 녹아내립니다.",
        description_en: "Elegant bite-sized blocks of seasoned, vinegared rice topped with pristine slices of fresh raw fish (salmon, tuna, snapper). The delicate, melt-in-your-mouth texture of the fish combines with a trace of spicy wasabi."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "규동",
        name_en: "Gyudon",
        description_ko: "얇게 저민 소고기와 부드러운 양파를 달콤하고 짭조름한 가쓰오부시 특제 소스에 조려 따뜻한 밥 위에 듬뿍 얹어낸 덮밥입니다. 촉촉하게 적셔진 밥알과 달콤하고 부드러운 소고기가 혼연일체를 이루어, 계란 노른자를 터뜨려 비벼 먹으면 극상의 고소함을 느낄 수 있습니다.",
        description_en: "A popular Japanese comfort bowl featuring thinly sliced beef and sweet onions simmered in a sweet soy-dashi broth, served over steamed rice. Topped with a raw egg yolk that creates a rich, velvety glaze."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "우동",
        name_en: "Udon",
        description_ko: "오동통하고 쫄깃쫄깃한 굵은 밀가루 면발을 가쓰오부시와 다시마로 우려낸 맑고 짭조름한 육수에 끓여낸 면 요리입니다. 국물을 듬뿍 머금은 바삭한 튀김 옷과 쫄깃한 면발을 호로록 빨아들이면, 가슴 깊은 곳까지 뜨끈한 가쓰오의 감칠맛이 전해집니다.",
        description_en: "Plump, chewy wheat noodles served in a hot, clear dashi broth seasoned with sweet soy sauce and mirin. Topped with crispy tempura bits and scallions, it offers a warm, satisfying slurp."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "타코야키",
        name_en: "Takoyaki",
        description_ko: "동글동글한 반죽 속 쫄깃한 문어를 넣어 겉은 바삭하고 속은 촉촉하게 구워낸 길거리 영양 간식입니다. 달콤짭조름한 데리야끼 소스와 마요네즈를 뿌리고, 가쓰오부시를 얹어 뜨거운 열기에 춤추는 춤사위를 감상하며 한 입에 넣으면 사르르 녹아내리는 매력적인 맛입니다.",
        description_en: "Golden, spherical batter cakes filled with chewy pieces of octopus, cooked crispy on the outside and creamy inside. Drizzled with sweet takoyaki sauce, japanese mayo, and dynamic, dancing bonito flakes."
    },

    // --- 양식 (Western) ---
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "파스타",
        name_en: "Pasta",
        description_ko: "오동통한 새우와 베이컨을 넣고 마늘 향이 은은한 올리브 오일이나 크리미하고 고소한 치즈 크림 소스에 면을 볶아낸 요리입니다. 포크로 면발을 돌돌 말아 입에 넣으면 면에 밀착된 꾸덕꾸덕하고 진한 소스의 고소함이 풍부하게 퍼져나갑니다.",
        description_en: "Perfectly al dente pasta noodles tossed with garlic, wild mushrooms, and pan-seared bacon in your choice of a rich, velvety parmesan cream or a clean, garlic-chili infused olive oil. Simply sensational."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "피자",
        name_en: "Pizza",
        description_ko: "발효시켜 쫄깃한 수제 도우 위에 토마토 소스를 펴 바르고 페퍼로니와 모짜렐라 치즈를 듬뿍 얹어 화덕에 노릇노릇하게 구워낸 요리입니다. 치즈가 쭉 늘어나며 풍기는 짭조름한 향과 불맛이 입혀진 도우의 쫀득함이 끊임없이 식욕을 자극합니다.",
        description_en: "A bubbly, charred crust straight from the stone oven, topped with rich marinara sauce, spicy pepperoni discs, and mountains of melted mozzarella. The pull of hot, gooey cheese makes it irresistible."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "스테이크",
        name_en: "Steak",
        description_ko: "두툼한 최고급 소고기 등심을 뜨겁게 달군 팬에 시어링 하여 겉은 바삭한 마이야르 반응을 일으키고 속은 선홍빛 육즙으로 가득 채운 스테이크입니다. 칼로 부드럽게 썰어 한 입 넣는 순간 사르르 녹아내리며 터져 나오는 깊은 소고기 기름의 풍미가 예술입니다.",
        description_en: "A premium cut of beef thick-sliced and seared to a perfect brown crust to lock in all the natural, rich juices. Soft and buttery texture that releases an explosion of beefy flavor with every bite."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "햄버거",
        name_en: "Hamburger",
        description_ko: "매일 아침 구워낸 부드러운 번 사이에 그릴에서 불향 가득 구운 소고기 패티, 녹아내린 체다 치즈, 싱싱하고 아삭한 토마토와 양상추를 층층이 쌓아 올린 미국식 수제 버거입니다. 베어 물 때 흘러내리는 쇠고기 육즙과 소스의 하모니가 한 입 가득 만족감을 줍니다.",
        description_en: "A thick, fire-grilled beef patty layered with melted cheddar cheese, crisp lettuce, ripe tomatoes, and special sauce in a toasted brioche bun. Juicy, messy, and packed with savory, smoky goodness."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "리조또",
        name_en: "Risotto",
        description_ko: "고소한 화이트 와인과 닭 육수를 부어가며 정성껏 저어 쌀알을 알맞게 익힌 후, 진한 버섯 크림과 트러플 오일, 치즈를 듬뿍 넣어 부드럽게 끓여낸 요리입니다. 크리미하고 꾸덕꾸덕하며 부드러운 식감이 입안을 포근하게 감싸며 깊은 숲 향을 느끼게 해 줍니다.",
        description_en: "Creamy arborio rice simmered slow in a fragrant chicken stock and white wine, finished with earthy wild mushrooms, grated parmesan, and a drizzle of rich truffle oil. A comforting, velvety indulgence."
    },

    // --- 아시안 (Asian) ---
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "쌀국수",
        name_en: "Vietnamese Pho",
        description_ko: "양지머리를 넣고 오랜 시간 푹 우려내어 맑고 깊고 향긋한 소고기 육수에 보들보들한 쌀 면을 더해 즐기는 베트남 국수입니다. 얇게 썬 소고기 편육과 아삭한 숙주, 레몬즙과 매콤한 칠리 소스를 곁들여 후루룩 들이켜면 이국적이고 시원한 맛이 온몸을 개운하게 해 줍니다.",
        description_en: "A fragrant, clean beef broth infused with star anise and cinnamon, poured over soft rice noodles and topped with raw, paper-thin beef slices that cook gently in the bowl. Served with fresh basil and lime."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "팟타이",
        name_en: "Pad Thai",
        description_ko: "새콤달콤 짭조름한 특제 타마린드 소스에 쌀국수 면과 싱싱한 대하 새우, 두부, 아삭한 숙주를 계란과 함께 뜨거운 웍에서 빠르게 볶아낸 태국 대표 국수 요리입니다. 고소하게 다진 땅콩가루와 상큼한 라임즙을 섞어 먹으면 다채로운 이국적 맛이 입안을 가득 채웁니다.",
        description_en: "Stir-fried flat rice noodles in a sweet, savory, and tangy tamarind glaze, packed with fresh prawns, scrambled egg, and crunchy beansprouts. Garnished with crushed peanuts and a squeeze of fresh lime."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "나시고랭",
        name_en: "Nasi Goreng",
        description_ko: "인도네시아 전통 단맛 간장 소스인 케찹 마니스의 풍미를 극대화해 해산물, 닭고기, 야채를 밥과 함께 불맛 나게 볶아낸 요리입니다. 고소한 계란후라이의 노른자를 톡 터뜨려 매콤한 알새우칩인 크루푹 위에 볶음밥을 얹어 먹는 맛이 환상적입니다.",
        description_en: "A fragrant Indonesian fried rice stir-fried with shrimp and chicken in a caramelized sweet soy sauce (kecap manis), infused with aromatic chili paste. Topped with a crispy fried egg and served with prawn crackers."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "분짜",
        name_en: "Bun Cha",
        description_ko: "불에 직접 구워 은은한 숯불 향이 가득한 돼지고기 석쇠구이와 바삭한 완자를, 새콤달콤하고 따뜻한 피시 소스(느억맘)에 쌀국수 면, 싱싱한 야채와 함께 적셔 먹는 요리입니다. 기름진 고기의 고소함과 느억맘 소스의 새콤달콤함이 폭풍 흡입을 부르는 중독성 강한 맛입니다.",
        description_en: "Charcoal-grilled caramelized pork patties and fresh rice vermicelli noodles dipped in a warm, tangy, sweet fish sauce broth (nuoc cham). Served with fresh lettuce, mint, and crispy fried spring rolls."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "반미",
        name_en: "Banh Mi",
        description_ko: "겉은 바삭하고 속은 쫄깃하게 갓 구운 베트남식 바게트 빵을 가르고, 매콤달콤하게 구운 돼지고기와 짭조름한 파테, 아삭하고 새콤한 야채 절임, 그리고 향긋한 고수를 듬뿍 채운 샌드위치입니다. 한 입 물면 바삭! 하는 쾌감과 소스의 조화가 기막힙니다.",
        description_en: "A warm, super-crisp baguette smeared with savory paté and mayonnaise, stuffed with sweet, flame-grilled pork, pickled daikon radish, carrots, fresh cucumber, and aromatic cilantro. A texture and flavor masterpiece."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "똠양꿍",
        name_en: "Tom Yum Goong",
        description_ko: "오동통한 타이거 새우에 레몬그라스, 라임 잎, 갈랑갈 등 향신료를 넣고 끓여내어 시큼하고 매콤하며 달큰하고 짭조름한 4가지 맛이 오묘하고 깊게 어우러지는 태국의 국보급 수프 요리입니다. 한 숟가락 들이켜면 뇌리에 꽂히는 이국적인 감칠맛에 중독되어 헤어나올 수 없습니다.",
        description_en: "The legendary Thai hot and sour soup loaded with plump prawns and mushrooms in a fiery broth flavored with lemongrass, kaffir lime leaves, and galangal. An exotic blend of sour, spicy, sweet, and salty flavors."
    }
];