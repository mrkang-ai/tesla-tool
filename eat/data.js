// Expanded food database with 35 diverse menus.
// Each maps to an available WebP image in eat/images/<name_ko>.webp
const menuData = [
    // --- 한식 (Korean) ---
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "김치찌개",
        name_en: "Kimchi Stew",
        description_ko: "신김치와 돼지고기, 두부 등을 넣고 매콤하게 끓여낸 한국인의 대표적인 소울푸드입니다.",
        description_en: "A representative Korean soul food made by boiling sour kimchi, pork, tofu, and onions in a spicy broth."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "된장찌개",
        name_en: "Soybean Paste Stew",
        description_ko: "구수한 된장을 주재료로 하여 두부, 채소, 버섯 등을 넣고 보글보글 끓인 전통 찌개입니다.",
        description_en: "A traditional Korean stew boiled with savory fermented soybean paste, tofu, and various vegetables."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "비빔밥",
        name_en: "Bibimbap",
        description_ko: "따뜻한 밥 위에 알록달록한 나물, 볶은 고기, 약고추장, 계란후라이를 얹어 비벼 먹는 웰빙 식사입니다.",
        description_en: "A healthy bowl of warm rice topped with seasoned vegetables, beef, a fried egg, and spicy red pepper paste."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "불고기",
        name_en: "Bulgogi",
        description_ko: "얇게 썬 소고기를 간장, 설탕, 배즙 등으로 만든 달콤 짭짤한 양념에 재워 구워 먹는 전통 요리입니다.",
        description_en: "Thinly sliced beef marinated in a sweet and savory soy sauce mixture, grilled or stir-fried."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "잡채",
        name_en: "Japchae",
        description_ko: "쫄깃한 당면과 각종 채소, 고기를 간장 소스에 볶아 잔칫날이나 특별한 날 즐겨 먹는 음식입니다.",
        description_en: "Sweet potato glass noodles stir-fried with colorful vegetables, mushrooms, and beef in a savory soy sauce."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "삼겹살",
        name_en: "Grilled Pork Belly",
        description_ko: "고소한 돼지고기 삼겹살을 불판에 노릇하게 구워 쌈장, 마늘과 함께 쌈을 싸 먹는 최고의 한국 외식 메뉴입니다.",
        description_en: "Rich and savory pork belly strips grilled at the table and wrapped in fresh lettuce leaves with garlic and ssamjang."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "제육볶음",
        name_en: "Spicy Stir-fried Pork",
        description_ko: "돼지고기를 매콤한 고추장 양념에 각종 채소와 함께 불맛이 나도록 볶아낸 밥도둑 반찬입니다.",
        description_en: "Pork slices stir-fried in a fiery, sweet-and-spicy gochujang sauce with onions and scallions."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "갈비탕",
        name_en: "Short Rib Soup",
        description_ko: "큼직한 소갈비를 오랜 시간 푹 고아 맑고 진한 국물에 당면과 파를 띄워 먹는 든든한 보양식입니다.",
        description_en: "A rich and comforting soup made by simmering beef short ribs for hours, served with glass noodles and green onions."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "떡볶이",
        name_en: "Tteokbokki",
        description_ko: "말랑한 떡과 어묵을 매콤달콤한 고추장 양념에 졸여낸 국민 길거리 음식입니다.",
        description_en: "Chewy cylinder-shaped rice cakes and fish cakes simmered in a sweet and spicy chili sauce."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "김밥",
        name_en: "Gimbap",
        description_ko: "김 위에 밥과 야채, 햄, 단무지, 계란 등 다양한 재료를 얹어 동그랗게 말아 썰어 낸 피크닉 대표 메뉴입니다.",
        description_en: "Steamed rice and various fillings wrapped in dried seaweed sheet and sliced into bite-sized wheels."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "감자탕",
        name_en: "Pork Backbone Stew",
        description_ko: "돼지 등뼈에 감자, 시래기, 들깨가루를 듬뿍 넣고 끓여내 국물이 얼큰하고 고기가 듬뿍 붙어 있는 찌개입니다.",
        description_en: "A hearty and spicy soup made with pork backbones, potatoes, dried radish greens, and wild sesame powder."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "닭갈비",
        name_en: "Spicy Stir-fried Chicken",
        description_ko: "토막 낸 닭고기를 고구마, 양배추와 함께 매콤한 양념에 철판으로 볶아 먹는 춘천 대표 음식입니다.",
        description_en: "Diced chicken marinated in a spicy gochujang sauce and stir-fried with sweet potato and cabbage on a hot iron plate."
    },
    {
        category_ko: "한식",
        category_en: "Korean",
        name_ko: "부대찌개",
        name_en: "Army Base Stew",
        description_ko: "햄, 소시지, 베이크드 빈스에 얼큰한 김치 육수와 라면 사리를 넣어 끓인 퓨전 찌개 요리입니다.",
        description_en: "A fusion hot pot combining American processed meats like ham and hot dogs with spicy Korean kimchi broth and ramen."
    },

    // --- 중식 (Chinese) ---
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "짜장면",
        name_en: "Jajangmyeon",
        description_ko: "달콤하고 고소한 검은 춘장 소스에 양파와 고기를 볶아 수타 면에 비벼 먹는 국민 중화요리입니다.",
        description_en: "Noodles topped with a thick, dark sauce made of fried black bean paste, diced pork, and sweet onions."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "짬뽕",
        name_en: "Jjamppong",
        description_ko: "오징어, 홍합 등 신선한 해산물과 각종 채소를 기름에 볶아 얼큰하고 칼칼한 불맛 육수로 끓인 면 요리입니다.",
        description_en: "A fiery Chinese-Korean noodle soup loaded with fresh seafood, vegetables, and a spicy chili-infused broth."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "탕수육",
        name_en: "Sweet and Sour Pork",
        description_ko: "바삭하게 튀겨낸 돼지고기에 달콤하고 새콤한 소스를 부어 먹거나 찍어 먹는 인기 요리입니다.",
        description_en: "Crispy deep-fried pieces of pork coated in or served with a glossy sweet, sour, and tangy glaze."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "마파두부",
        name_en: "Mapo Tofu",
        description_ko: "부드러운 두부와 다진 돼지고기를 매콤하고 알싸한 사천식 두반장 소스에 조려낸 요리입니다.",
        description_en: "Soft tofu cubes and minced pork simmered in a spicy, numbing Sichuan-style chili and broad bean paste sauce."
    },
    {
        category_ko: "중식",
        category_en: "Chinese",
        name_ko: "꿔바로우",
        name_en: "Guobaorou",
        description_ko: "납작하게 썬 돼지고기에 찹쌀가루를 입혀 튀겨내 겉은 쫄깃바삭하고 속은 부드러운 북경식 탕수육입니다.",
        description_en: "Flat pork cutlets coated in potato/tapioca starch, double-fried for an incredibly crispy and chewy texture in sweet vinegar sauce."
    },

    // --- 일식 (Japanese) ---
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "돈까스",
        name_en: "Tonkatsu",
        description_ko: "두툼한 돼지고기 등심에 빵가루를 묻혀 바삭하게 튀겨낸 일본식 커틀릿 요리입니다.",
        description_en: "A thick, juicy pork cutlet breaded with flaky panko crumbs and deep-fried to a perfect golden crisp."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "라멘",
        name_en: "Japanese Ramen",
        description_ko: "진하게 우려낸 돼지뼈 또는 닭 육수에 쫄깃한 면발과 차슈, 아지타마고를 얹어 먹는 면 요리입니다.",
        description_en: "Fresh noodles served in a rich broth (such as pork bone tonkotsu or soy sauce shoyu), topped with tender braised pork belly."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "초밥",
        name_en: "Sushi",
        description_ko: "식초로 양념한 밥 위에 신선한 광어, 연어, 참치, 새우 등 다양한 생선과 해산물을 올려 먹는 대표 일식입니다.",
        description_en: "Bite-sized vinegared rice blocks topped with premium, fresh slices of raw fish, shrimp, or egg."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "규동",
        name_en: "Gyudon",
        description_ko: "얇게 썬 소고기와 양파를 달콤한 쯔유 소스에 조려 밥 위에 얹어 먹는 덮밥입니다.",
        description_en: "A popular Japanese rice bowl topped with thinly sliced beef and sweet onions simmered in a savory dashi-soy sauce."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "우동",
        name_en: "Udon",
        description_ko: "탱글하고 두툼한 밀가루 면발을 가쓰오부시 국물에 끓여 어묵, 튀김 등을 얹어 먹는 면 요리입니다.",
        description_en: "Thick wheat noodles served hot in a clean, soy-infused dashi broth, garnished with scallions and fish cakes."
    },
    {
        category_ko: "일식",
        category_en: "Japanese",
        name_ko: "타코야키",
        name_en: "Takoyaki",
        description_ko: "밀가루 반죽 안에 문어를 넣고 구워 데리야끼 소스, 마요네즈, 가쓰오부시를 얹은 간식입니다.",
        description_en: "Ball-shaped Japanese snacks made of wheat batter and filled with minced octopus, drizzled with savory sauces and bonito flakes."
    },

    // --- 양식 (Western) ---
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "파스타",
        name_en: "Pasta",
        description_ko: "크림, 토마토, 올리브 오일 등 취향에 맞는 소스에 다양한 파스타 면과 재료를 볶아낸 이탈리아 요리입니다.",
        description_en: "Noodles cooked al dente and tossed in a variety of delicious sauces like rich cream, fresh tomato marinara, or garlic olive oil."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "피자",
        name_en: "Pizza",
        description_ko: "넓게 편 도우 위에 토마토 소스, 치즈, 페퍼로니, 채소 등을 얹어 오븐에 구워낸 요리입니다.",
        description_en: "Baked flatbread topped with rich marinara sauce, melted mozzarella cheese, pepperoni, and a variety of delicious toppings."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "스테이크",
        name_en: "Steak",
        description_ko: "소고기 등심 또는 안심을 원하는 굽기로 구워 육즙이 가득하고 풍미가 훌륭한 서양식 요리입니다.",
        description_en: "A thick, premium cut of beef seared on a hot grill to lock in rich juices and served with savory reduction sauces."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "햄버거",
        name_en: "Hamburger",
        description_ko: "부드러운 번 사이에 소고기 패티, 치즈, 양상추, 토마토를 듬뿍 넣어 한 입에 즐기는 아메리칸 요리입니다.",
        description_en: "A juicy flame-grilled beef patty, melted cheddar cheese, fresh lettuce, and tomato slices sandwiched inside a soft toasted bun."
    },
    {
        category_ko: "양식",
        category_en: "Western",
        name_ko: "리조또",
        name_en: "Risotto",
        description_ko: "쌀을 육수에 천천히 저으며 끓여 크림이나 토마토 소스, 치즈로 깊은 맛을 낸 이탈리아식 밥 요리입니다.",
        description_en: "A creamy Italian rice dish cooked slow with broth, white wine, butter, and parmesan cheese for a rich and comforting meal."
    },

    // --- 아시안 (Asian) ---
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "쌀국수",
        name_en: "Vietnamese Pho",
        description_ko: "맑은 소고기 육수에 납작한 쌀 면을 넣고 소고기 슬라이스와 숙주, 고수를 곁들여 먹는 베트남 전통 국수입니다.",
        description_en: "A fragrant Vietnamese rice noodle soup served in a clear beef broth, topped with tender beef cuts, beansprouts, and fresh herbs."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "팟타이",
        name_en: "Pad Thai",
        description_ko: "새콤달콤한 타마린드 소스에 쌀국수, 새우, 두부, 숙주 등을 넣고 볶아 땅콩가루를 뿌려 먹는 태국식 볶음면입니다.",
        description_en: "A classic Thai stir-fried rice noodle dish featuring fresh shrimp, tofu, scrambled eggs, bean sprouts, and crushed peanuts."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "나시고랭",
        name_en: "Nasi Goreng",
        description_ko: "달콤짭짤한 인도네시아 소스에 해산물과 밥을 볶고 계란후라이와 알새우칩을 곁들여 먹는 볶음밥입니다.",
        description_en: "An Indonesian stir-fried rice dish loaded with shrimp and chicken in a sweet soy sauce glaze, topped with a sunny-side-up egg."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "분짜",
        name_en: "Bun Cha",
        description_ko: "숯불에 구운 돼지고기와 완자, 야채, 쌀면을 새콤달콤하고 따뜻한 피시 소스에 적셔 먹는 베트남 요리입니다.",
        description_en: "A Vietnamese dish consisting of cold rice vermicelli, fresh herbs, and charcoal-grilled pork patties dipped in warm fish sauce."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "반미",
        name_en: "Banh Mi",
        description_ko: "바삭한 바게트 사이에 숯불고기, 야채 절임, 마요네즈, 고수를 듬뿍 넣어 먹는 샌드위치입니다.",
        description_en: "A crispy Vietnamese baguette sandwich stuffed with savory roasted pork, pickled vegetables, fresh cucumber, and cilantro."
    },
    {
        category_ko: "아시안",
        category_en: "Asian",
        name_ko: "똠양꿍",
        name_en: "Tom Yum Goong",
        description_ko: "새우에 레몬그라스, 라임, 고추 등을 넣고 끓여 매콤, 새콤, 달콤, 짭짤한 맛이 조화로운 태국의 대표 수프 요리입니다.",
        description_en: "A world-famous Thai hot and sour soup loaded with juicy shrimp, lemongrass, lime leaves, galangal, and red chili peppers."
    }
];