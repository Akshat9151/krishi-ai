import json
from sqlalchemy.orm import Session
from backend.models_store import StoreProduct, ProductCategory, FertilizerRecommendation
from backend.models import MandiPrice

CATALOG_IMAGE_URLS = {
    "seeds": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    "rice-seeds": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    "maize-seeds": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
    "mustard-seeds": "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=600&auto=format&fit=crop&q=80",
    "fertilizer": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
    "crop-protection": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
    "tools": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
    "irrigation": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
    "organic": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
}

CATEGORIES = [
    {
        "name": "vegetable-seeds",
        "display_name": "सब्जी बीज (Vegetable Seeds)",
        "icon": "fas fa-seedling",
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "description": "उच्च गुणवत्ता वाले प्रमाणित सब्जी बीज",
        "sort_order": 1
    },
    {
        "name": "organic-fertilizers",
        "display_name": "जैविक खाद व उर्वरक (Fertilizers)",
        "icon": "fas fa-flask",
        "image": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "description": "शुद्ध जैविक खाद एवं संतुलित NPK उर्वरक",
        "sort_order": 2
    },
    {
        "name": "farming-tools",
        "display_name": "कृषि उपकरण (Farming Tools)",
        "icon": "fas fa-tools",
        "image": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "description": "मजबूत और आधुनिक कृषि औजार",
        "sort_order": 3
    },
    {
        "name": "crop-protection",
        "display_name": "फसल सुरक्षा (Crop Protection)",
        "icon": "fas fa-shield-alt",
        "image": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "description": "जैविक कीटनाशक एवं फफूंदनाशक",
        "sort_order": 4
    },
    {
        "name": "irrigation",
        "display_name": "सिंचाई प्रणाली (Irrigation)",
        "icon": "fas fa-tint",
        "image": "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "description": "ड्रिप किट एवं पानी की बचत उपकरण",
        "sort_order": 5
    },
    {
        "name": "organic-bio",
        "display_name": "à¤œà¥ˆà¤µà¤¿à¤• à¤‰à¤¤à¥à¤ªà¤¾à¤¦ (Organic & Bio)",
        "icon": "fas fa-leaf",
        "image": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "description": "Organic soil conditioners and biological crop-care products.",
        "sort_order": 6
    }
]

PRODUCTS = [
    {
        "name": "हाइब्रिड टमाटर बीज (Hybrid Tomato Seeds)",
        "category": "vegetable-seeds",
        "subcategory": "seeds",
        "description": "उच्च उत्पादन और रोग प्रतिरोधी हाइब्रिड टमाटर के बीज। 10 ग्राम पैक।",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 199.0,
        "original_price": 249.0,
        "discount_percentage": 20.0,
        "rating": 4.5,
        "reviews_count": 128,
        "badge": "बेस्ट सेलर",
        "fertilizer_type": None,
        "suitable_crops": json.dumps(["tomato", "vegetables"]),
        "brand": "Krishi Gold",
        "weight": "10g",
        "unit": "pack",
        "sku": "KRISHI-TOM-001",
        "product_url": "product.html?id=1"
    },
    {
        "name": "जैविक वर्मीकम्पोस्ट (Organic Vermicompost 5kg)",
        "category": "organic-fertilizers",
        "subcategory": "compost",
        "description": "100% शुद्ध केंचुआ खाद। मिट्टी की जलधारण क्षमता और पोषक तत्वों को बढ़ाता है।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 399.0,
        "original_price": 499.0,
        "discount_percentage": 20.0,
        "rating": 4.7,
        "reviews_count": 89,
        "badge": "ऑर्गेनिक",
        "fertilizer_type": "organic",
        "suitable_crops": json.dumps(["wheat", "rice", "maize", "cotton", "mustard", "groundnut", "potato", "sugarcane"]),
        "brand": "Krishi Bio",
        "weight": "5kg",
        "unit": "bag",
        "sku": "KRISHI-VERMI-002",
        "product_url": "product.html?id=2"
    },
    {
        "name": "स्टील खुरपी (Heavy Duty Hand Weeder)",
        "category": "farming-tools",
        "subcategory": "hand-tools",
        "description": "मजबूत फोर्ज्ड स्टील ब्लेड और लकड़ी की ग्रिप वाली प्रीमियम खुरपी।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 299.0,
        "original_price": 349.0,
        "discount_percentage": 14.0,
        "rating": 4.3,
        "reviews_count": 56,
        "badge": "नया",
        "fertilizer_type": None,
        "suitable_crops": json.dumps([]),
        "brand": "AgriCraft",
        "weight": "450g",
        "unit": "piece",
        "sku": "KRISHI-KHURPI-003",
        "product_url": "product.html?id=3"
    },
    {
        "name": "ड्रिप इरिगेशन किट 100 वर्ग मीटर (Drip Irrigation Kit)",
        "category": "irrigation",
        "subcategory": "drip",
        "description": "100 वर्ग मीटर के लिए संपूर्ण ड्रिप किट। 70% तक पानी की बचत।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 1299.0,
        "original_price": 1599.0,
        "discount_percentage": 18.0,
        "rating": 4.8,
        "reviews_count": 42,
        "badge": "20% ऑफ",
        "fertilizer_type": None,
        "suitable_crops": json.dumps(["vegetables", "fruits"]),
        "brand": "DropWise",
        "weight": "2.5kg",
        "unit": "kit",
        "sku": "KRISHI-DRIP-004",
        "product_url": "product.html?id=4"
    },
    {
        "name": "संतुलित NPK 20-20-20 बायो फर्टिलाइजर (Balanced NPK 1L)",
        "category": "organic-fertilizers",
        "subcategory": "liquid-fertilizer",
        "description": "फसलों के सम्पूर्ण विकास, जड़ वृद्धि और तने की मजबूती के लिए तरल NPK 20-20-20।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 349.0,
        "original_price": 420.0,
        "discount_percentage": 17.0,
        "rating": 4.8,
        "reviews_count": 112,
        "badge": "प्रीमियम",
        "fertilizer_type": "NPK",
        "suitable_crops": json.dumps(["rice", "wheat", "maize", "cotton", "sugarcane"]),
        "brand": "Krishi Bio",
        "weight": "1L",
        "unit": "bottle",
        "sku": "KRISHI-NPK-005",
        "product_url": "product.html?id=5"
    },
    {
        "name": "नेचुरल नीम तेल स्प्रे (Pure Neem Oil Bio-Pesticide 500ml)",
        "category": "crop-protection",
        "subcategory": "bio-pesticide",
        "description": "कोल्ड-प्रेस्ड शुद्ध नीम तेल। रस चूसक कीटों, सफेद मक्खी और फंगस से 100% जैविक सुरक्षा।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 249.0,
        "original_price": 299.0,
        "discount_percentage": 16.0,
        "rating": 4.4,
        "reviews_count": 78,
        "badge": "सुरक्षित",
        "fertilizer_type": None,
        "suitable_crops": json.dumps(["cotton", "wheat", "rice", "mustard"]),
        "brand": "BioShield",
        "weight": "500ml",
        "unit": "bottle",
        "sku": "KRISHI-NEEM-006",
        "product_url": "product.html?id=6"
    },
    {
        "name": "डीएपी एवं यूरिया बूस्टर कॉम्बो (DAP & Urea Growth Booster 5kg)",
        "category": "organic-fertilizers",
        "subcategory": "chemical-fertilizer",
        "description": "गेहूं, सरसों व धान की शुरुआती बढ़वार के लिए आवश्यक नाइट्रोजन और फॉस्फेट युक्त मिश्रण।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 499.0,
        "original_price": 599.0,
        "discount_percentage": 16.0,
        "rating": 4.6,
        "reviews_count": 95,
        "badge": "बेस्ट सेलर",
        "fertilizer_type": "Urea + DAP",
        "suitable_crops": json.dumps(["wheat", "rice", "mustard", "potato"]),
        "brand": "IFFCO Partner",
        "weight": "5kg",
        "unit": "bag",
        "sku": "KRISHI-DAP-007",
        "product_url": "product.html?id=7"
    },
    {
        "name": "मैनुअल स्प्रे पंप (5L Garden & Field Sprayer)",
        "category": "farming-tools",
        "subcategory": "spray-pump",
        "description": "ब्रास नोजल और प्रेशर रिलीज वाल्व के साथ टिकाऊ 5 लीटर छिड़काव पंप।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 599.0,
        "original_price": 749.0,
        "discount_percentage": 20.0,
        "rating": 4.5,
        "reviews_count": 140,
        "badge": "पॉपुलर",
        "fertilizer_type": None,
        "suitable_crops": json.dumps([]),
        "brand": "AgriTech",
        "weight": "1.2kg",
        "unit": "piece",
        "sku": "KRISHI-SPRAY-008",
        "product_url": "product.html?id=8"
    },
    {
        "name": "गेहूं रस्ट केयर फंगीसाइड (Wheat Rust Care Spray 250g)",
        "category": "crop-protection",
        "subcategory": "fungicide",
        "description": "गेहूं में पीला व भूरा रतुआ (Yellow & Brown Rust) रोग से बचाव के लिए विशेष फंगीसाइड।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 320.0,
        "original_price": 380.0,
        "discount_percentage": 15.0,
        "rating": 4.7,
        "reviews_count": 64,
        "badge": "रोग रक्षक",
        "fertilizer_type": "fungicide",
        "suitable_crops": json.dumps(["wheat"]),
        "brand": "Krishi Care",
        "weight": "250g",
        "unit": "pack",
        "sku": "KRISHI-WHEATRUST-009",
        "product_url": "product.html?id=9"
    },
    {
        "name": "धान ब्लास्ट नियंत्रण किट (Rice Blast Protection Kit 500g)",
        "category": "crop-protection",
        "subcategory": "fungicide",
        "description": "धान की फसल में झुलसा/ब्लास्ट रोग के नियंत्रण के लिए प्रभावी समाधान।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 380.0,
        "original_price": 450.0,
        "discount_percentage": 15.0,
        "rating": 4.6,
        "reviews_count": 51,
        "badge": "प्रमाणित",
        "fertilizer_type": "fungicide",
        "suitable_crops": json.dumps(["rice"]),
        "brand": "Krishi Care",
        "weight": "500g",
        "unit": "pack",
        "sku": "KRISHI-RICEBLAST-010",
        "product_url": "product.html?id=10"
    },
    {
        "name": "कपास लीफ कर्ल डिफेंस (Cotton Leaf Curl Care 250ml)",
        "category": "crop-protection",
        "subcategory": "bio-control",
        "description": "कपास में पत्ती मरोड़ रोग एवं सफेद मक्खी के रोकथाम के लिए जैविक कीटनाशक।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 350.0,
        "original_price": 420.0,
        "discount_percentage": 16.0,
        "rating": 4.5,
        "reviews_count": 43,
        "badge": "बायो शील्ड",
        "fertilizer_type": "bio-control",
        "suitable_crops": json.dumps(["cotton"]),
        "brand": "Krishi Care",
        "weight": "250ml",
        "unit": "bottle",
        "sku": "KRISHI-COTTONCURL-011",
        "product_url": "product.html?id=11"
    },
    {
        "name": "राइजोबियम कल्चर एवं पोटाश बूस्टर (Rhizobium & Potash Blend 1kg)",
        "category": "organic-fertilizers",
        "subcategory": "bio-fertilizer",
        "description": "मूंगफली, सरसों व आलू में नाइट्रोजन स्थिरीकरण और दानों/कंदों के आकार वृद्धि हेतु।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "price": 279.0,
        "original_price": 330.0,
        "discount_percentage": 15.0,
        "rating": 4.5,
        "reviews_count": 54,
        "badge": "विशेषज्ञ चयन",
        "fertilizer_type": "potash",
        "suitable_crops": json.dumps(["groundnut", "mustard", "potato"]),
        "brand": "Krishi Bio",
        "weight": "1kg",
        "unit": "pack",
        "sku": "KRISHI-RHIZO-012",
        "product_url": "product.html?id=12"
    }
]

DEMO_PRODUCTS = [
    {"name": "Urea 46% Nitrogen", "category": "organic-fertilizers", "subcategory": "nitrogen-fertilizer", "description": "High-analysis nitrogen fertilizer for wheat, rice, maize and vegetables.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 1325.0, "original_price": 1450.0, "discount_percentage": 9.0, "rating": 4.7, "reviews_count": 86, "badge": "Farm Essential", "fertilizer_type": "urea", "suitable_crops": json.dumps(["wheat", "rice", "maize"]), "brand": "IFFCO", "weight": "50kg", "unit": "bag", "sku": "DEMO-UREA-50KG", "product_url": "product.html?sku=DEMO-UREA-50KG"},
    {"name": "DAP Di-Ammonium Phosphate 18:46:0", "category": "organic-fertilizers", "subcategory": "phosphate-fertilizer", "description": "Balanced starter fertilizer supplying nitrogen and phosphorus for strong roots.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 1350.0, "original_price": 1500.0, "discount_percentage": 10.0, "rating": 4.8, "reviews_count": 124, "badge": "Bestseller", "fertilizer_type": "DAP", "suitable_crops": json.dumps(["wheat", "rice", "mustard", "maize"]), "brand": "IFFCO", "weight": "50kg", "unit": "bag", "sku": "DEMO-DAP-50KG", "product_url": "product.html?sku=DEMO-DAP-50KG"},
    {"name": "MOP Muriate of Potash 60%", "category": "organic-fertilizers", "subcategory": "potash-fertilizer", "description": "Potassium fertilizer for improved crop strength, quality and stress tolerance.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 1650.0, "original_price": 1800.0, "discount_percentage": 8.0, "rating": 4.6, "reviews_count": 58, "badge": "Popular", "fertilizer_type": "potash", "suitable_crops": json.dumps(["potato", "sugarcane", "cotton"]), "brand": "IPL", "weight": "50kg", "unit": "bag", "sku": "DEMO-MOP-50KG", "product_url": "product.html?sku=DEMO-MOP-50KG"},
    {"name": "NPK 10:26:26 Granular Fertilizer", "category": "organic-fertilizers", "subcategory": "npk-fertilizer", "description": "Granular NPK blend for flowering, fruiting and balanced crop nutrition.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 1475.0, "original_price": 1600.0, "discount_percentage": 8.0, "rating": 4.7, "reviews_count": 73, "badge": "Balanced Nutrition", "fertilizer_type": "NPK", "suitable_crops": json.dumps(["wheat", "rice", "maize", "vegetables"]), "brand": "Coromandel", "weight": "50kg", "unit": "bag", "sku": "DEMO-NPK-102626-50KG", "product_url": "product.html?sku=DEMO-NPK-102626-50KG"},
    {"name": "Single Super Phosphate SSP", "category": "organic-fertilizers", "subcategory": "phosphate-fertilizer", "description": "Phosphorus, sulphur and calcium fertilizer for root development and oilseeds.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 520.0, "original_price": 600.0, "discount_percentage": 13.0, "rating": 4.5, "reviews_count": 41, "badge": "Value Pack", "fertilizer_type": "SSP", "suitable_crops": json.dumps(["mustard", "wheat", "groundnut"]), "brand": "Rashtriya Chemicals", "weight": "50kg", "unit": "bag", "sku": "DEMO-SSP-50KG", "product_url": "product.html?sku=DEMO-SSP-50KG"},
    {"name": "Zinc Sulphate 21% Micronutrient", "category": "organic-fertilizers", "subcategory": "micronutrient", "description": "Fast-acting zinc supplement for correcting zinc deficiency in field crops.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 185.0, "original_price": 220.0, "discount_percentage": 16.0, "rating": 4.6, "reviews_count": 39, "badge": "Micronutrient", "fertilizer_type": "micronutrient", "suitable_crops": json.dumps(["rice", "wheat", "maize"]), "brand": "KhetiCare", "weight": "1kg", "unit": "pack", "sku": "DEMO-ZINC-1KG", "product_url": "product.html?sku=DEMO-ZINC-1KG"},
    {"name": "Organic Vermicompost Enriched", "category": "organic-fertilizers", "subcategory": "compost", "description": "Well-decomposed organic vermicompost to improve soil structure and microbial activity.", "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500", "price": 425.0, "original_price": 500.0, "discount_percentage": 15.0, "rating": 4.8, "reviews_count": 92, "badge": "Organic", "fertilizer_type": "organic", "suitable_crops": json.dumps(["vegetables", "wheat", "rice"]), "brand": "Krishi Bio", "weight": "25kg", "unit": "bag", "sku": "DEMO-VERMICOMPOST-25KG", "product_url": "product.html?sku=DEMO-VERMICOMPOST-25KG"},
    {"name": "Certified Wheat Seeds HD-2967", "category": "vegetable-seeds", "subcategory": "cereal-seeds", "description": "Popular HD-2967 wheat variety with reliable germination and strong yield potential.", "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500", "price": 1480.0, "original_price": 1650.0, "discount_percentage": 10.0, "rating": 4.8, "reviews_count": 113, "badge": "Certified Seed", "fertilizer_type": None, "suitable_crops": json.dumps(["wheat"]), "brand": "National Seeds Corp", "weight": "40kg", "unit": "bag", "sku": "DEMO-WHEAT-HD2967", "product_url": "product.html?sku=DEMO-WHEAT-HD2967"},
    {"name": "Pusa Basmati 1121 Paddy Seeds", "category": "vegetable-seeds", "subcategory": "rice-seeds", "description": "Premium aromatic basmati rice seed for suitable irrigated regions.", "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", "price": 780.0, "original_price": 900.0, "discount_percentage": 13.0, "rating": 4.7, "reviews_count": 67, "badge": "Basmati", "fertilizer_type": None, "suitable_crops": json.dumps(["rice", "paddy"]), "brand": "Pusa IARI", "weight": "5kg", "unit": "pack", "sku": "DEMO-PADDY-BASMATI-5KG", "product_url": "product.html?sku=DEMO-PADDY-BASMATI-5KG"},
    {"name": "PR-126 Non-Basmati Paddy Seeds", "category": "vegetable-seeds", "subcategory": "rice-seeds", "description": "Early-duration non-basmati paddy seed suited to water-saving cultivation.", "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", "price": 620.0, "original_price": 720.0, "discount_percentage": 14.0, "rating": 4.6, "reviews_count": 54, "badge": "Early Variety", "fertilizer_type": None, "suitable_crops": json.dumps(["rice", "paddy"]), "brand": "PAU Certified", "weight": "10kg", "unit": "pack", "sku": "DEMO-PADDY-PR126-10KG", "product_url": "product.html?sku=DEMO-PADDY-PR126-10KG"},
    {"name": "Hybrid Maize Seeds", "category": "vegetable-seeds", "subcategory": "cereal-seeds", "description": "High-vigor hybrid maize seed for uniform crop establishment and cob size.", "image_url": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500", "price": 390.0, "original_price": 450.0, "discount_percentage": 13.0, "rating": 4.5, "reviews_count": 48, "badge": "Hybrid", "fertilizer_type": None, "suitable_crops": json.dumps(["maize"]), "brand": "Kheti Gold", "weight": "1kg", "unit": "pack", "sku": "DEMO-MAIZE-HYBRID-1KG", "product_url": "product.html?sku=DEMO-MAIZE-HYBRID-1KG"},
    {"name": "Certified Mustard Seeds Pusa Jai Kisan", "category": "vegetable-seeds", "subcategory": "oilseed-seeds", "description": "Reliable mustard variety for strong branching and oil-rich seed production.", "image_url": "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=500", "price": 260.0, "original_price": 300.0, "discount_percentage": 13.0, "rating": 4.6, "reviews_count": 37, "badge": "Rabi Seed", "fertilizer_type": None, "suitable_crops": json.dumps(["mustard"]), "brand": "Pusa IARI", "weight": "2kg", "unit": "pack", "sku": "DEMO-MUSTARD-2KG", "product_url": "product.html?sku=DEMO-MUSTARD-2KG"},
    {"name": "Vegetable Seed Combo Tomato Onion Chili", "category": "vegetable-seeds", "subcategory": "vegetable-seeds", "description": "Three practical retail seed packets for kitchen gardens and small farms.", "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500", "price": 149.0, "original_price": 180.0, "discount_percentage": 17.0, "rating": 4.4, "reviews_count": 29, "badge": "Combo Pack", "fertilizer_type": None, "suitable_crops": json.dumps(["tomato", "onion", "chili"]), "brand": "Krishi Gold", "weight": "3 packets", "unit": "pack", "sku": "DEMO-VEG-COMBO-3PK", "product_url": "product.html?sku=DEMO-VEG-COMBO-3PK"},
    {"name": "Chlorpyrifos 20% EC Insecticide", "category": "crop-protection", "subcategory": "insecticide", "description": "Agricultural insecticide for labelled crop pests; use only as permitted on the product label.", "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=500", "price": 420.0, "original_price": 480.0, "discount_percentage": 13.0, "rating": 4.4, "reviews_count": 31, "badge": "Crop Protection", "fertilizer_type": "insecticide", "suitable_crops": json.dumps(["rice", "cotton", "vegetables"]), "brand": "KhetiCare", "weight": "1L", "unit": "bottle", "sku": "DEMO-CHLORPYRIFOS-1L", "product_url": "product.html?sku=DEMO-CHLORPYRIFOS-1L"},
    {"name": "Mancozeb 75% WP Fungicide", "category": "crop-protection", "subcategory": "fungicide", "description": "Contact fungicide for labelled fungal disease management; follow local legal directions.", "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=500", "price": 285.0, "original_price": 330.0, "discount_percentage": 14.0, "rating": 4.6, "reviews_count": 45, "badge": "Fungicide", "fertilizer_type": "fungicide", "suitable_crops": json.dumps(["potato", "tomato", "grapes"]), "brand": "Krishi Care", "weight": "500g", "unit": "pack", "sku": "DEMO-MANCOZEB-500G", "product_url": "product.html?sku=DEMO-MANCOZEB-500G"},
    {"name": "Glyphosate 41% SL Herbicide", "category": "crop-protection", "subcategory": "herbicide", "description": "Non-selective herbicide for permitted non-crop areas; follow label, PPE and local regulations.", "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=500", "price": 520.0, "original_price": 590.0, "discount_percentage": 12.0, "rating": 4.3, "reviews_count": 22, "badge": "Herbicide", "fertilizer_type": "herbicide", "suitable_crops": json.dumps([]), "brand": "AgriShield", "weight": "1L", "unit": "bottle", "sku": "DEMO-GLYPHOSATE-1L", "product_url": "product.html?sku=DEMO-GLYPHOSATE-1L"},
    {"name": "Cold Pressed Neem Oil", "category": "crop-protection", "subcategory": "bio-pesticide", "description": "Plant-based neem oil for organic pest management and integrated crop care.", "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=500", "price": 249.0, "original_price": 299.0, "discount_percentage": 17.0, "rating": 4.6, "reviews_count": 78, "badge": "Organic", "fertilizer_type": "bio-control", "suitable_crops": json.dumps(["cotton", "wheat", "rice", "vegetables"]), "brand": "BioShield", "weight": "500ml", "unit": "bottle", "sku": "DEMO-NEEM-OIL-500ML", "product_url": "product.html?sku=DEMO-NEEM-OIL-500ML"},
    {"name": "Manual Hand Sprayer 16L Pump", "category": "farming-tools", "subcategory": "spray-pump", "description": "Durable 16-litre manual pump sprayer with adjustable agricultural nozzle.", "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=500", "price": 1199.0, "original_price": 1399.0, "discount_percentage": 14.0, "rating": 4.5, "reviews_count": 64, "badge": "Farm Tool", "fertilizer_type": None, "suitable_crops": json.dumps([]), "brand": "AgriTech", "weight": "16L", "unit": "piece", "sku": "DEMO-SPRAYER-16L", "product_url": "product.html?sku=DEMO-SPRAYER-16L"},
    {"name": "Forged Steel Sickle Hasiya", "category": "farming-tools", "subcategory": "hand-tools", "description": "Balanced forged-steel sickle for harvesting fodder, grass and mature crops.", "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=500", "price": 185.0, "original_price": 225.0, "discount_percentage": 18.0, "rating": 4.4, "reviews_count": 33, "badge": "Hand Tool", "fertilizer_type": None, "suitable_crops": json.dumps([]), "brand": "AgriCraft", "weight": "450g", "unit": "piece", "sku": "DEMO-SICKLE-HASIYA", "product_url": "product.html?sku=DEMO-SICKLE-HASIYA"},
    {"name": "Heavy Duty Khurpi Hand Hoe", "category": "farming-tools", "subcategory": "hand-tools", "description": "Compact steel khurpi for weeding, transplanting and loosening soil around plants.", "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=500", "price": 199.0, "original_price": 249.0, "discount_percentage": 20.0, "rating": 4.5, "reviews_count": 56, "badge": "Best Seller", "fertilizer_type": None, "suitable_crops": json.dumps([]), "brand": "AgriCraft", "weight": "500g", "unit": "piece", "sku": "DEMO-KHURPI-HOE", "product_url": "product.html?sku=DEMO-KHURPI-HOE"},
]

def seed_database(db: Session):
    """Seed initial categories, products, and fertilizer recommendations if database is empty."""
    # Seed missing categories idempotently for both fresh and existing databases.
    existing_categories = {name for (name,) in db.query(ProductCategory.name).all()}
    for cat_data in CATEGORIES:
        if cat_data["name"] not in existing_categories:
            db.add(ProductCategory(**cat_data))
    db.commit()

    # Seed the original catalog and its recommendations when the database is empty.
    if db.query(StoreProduct).count() == 0:
        for prod_data in PRODUCTS:
            db.add(StoreProduct(**prod_data))
        db.commit()

        recs = [
            ("Rice", "NPK", 5, 0.95),
            ("Rice", "Urea + DAP", 7, 0.90),
            ("Rice", "organic", 2, 0.85),
            ("Wheat", "Urea + DAP", 7, 0.95),
            ("Wheat", "NPK", 5, 0.90),
            ("Wheat", "organic", 2, 0.85),
            ("Maize", "NPK", 5, 0.95),
            ("Maize", "organic", 2, 0.85),
            ("Cotton", "NPK", 5, 0.95),
            ("Cotton", "organic", 2, 0.85),
            ("Mustard", "potash", 12, 0.95),
            ("Mustard", "Urea + DAP", 7, 0.90),
            ("Mustard", "organic", 2, 0.85),
            ("Groundnut", "potash", 12, 0.95),
            ("Groundnut", "organic", 2, 0.85),
            ("Potato", "potash", 12, 0.95),
            ("Potato", "Urea + DAP", 7, 0.90),
            ("Potato", "organic", 2, 0.85),
            ("Sugarcane", "NPK", 5, 0.95),
            ("Sugarcane", "organic", 2, 0.90),
        ]
        for crop, ftype, pid, score in recs:
            db.add(FertilizerRecommendation(
                crop_name=crop,
                fertilizer_type=ftype,
                product_id=pid,
                recommendation_score=score,
            ))
        db.commit()

    # Add the checkout demo catalog idempotently to existing deployments.
    existing_skus = {sku for (sku,) in db.query(StoreProduct.sku).filter(StoreProduct.sku.isnot(None)).all()}
    for prod_data in DEMO_PRODUCTS:
        if prod_data["sku"] not in existing_skus:
            db.add(StoreProduct(**prod_data))
    db.commit()

    normalize_catalog_images(db)

    # Seed Mandi market prices idempotently
    if db.query(MandiPrice).count() == 0:
        initial_mandi = [
            {"commodity": "Wheat", "commodity_hi": "गेहूं", "state": "Madhya Pradesh", "district": "Neemuch", "market": "Neemuch Mandi", "min_price": 2420, "max_price": 2850, "modal_price": 2680, "price_change": "+₹45", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Wheat", "commodity_hi": "गेहूं", "state": "Punjab", "district": "Ludhiana", "market": "Khanna Mandi", "min_price": 2500, "max_price": 2920, "modal_price": 2750, "price_change": "+₹60", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Wheat", "commodity_hi": "गेहूं", "state": "Uttar Pradesh", "district": "Aligarh", "market": "Aligarh Mandi", "min_price": 2380, "max_price": 2710, "modal_price": 2560, "price_change": "-₹20", "trend": "down", "arrival_date": "Today"},
            {"commodity": "Mustard", "commodity_hi": "सरसों", "state": "Rajasthan", "district": "Bharatpur", "market": "Bharatpur Mandi", "min_price": 5200, "max_price": 5850, "modal_price": 5620, "price_change": "+₹110", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Mustard", "commodity_hi": "सरसों", "state": "Haryana", "district": "Rewari", "market": "Rewari Mandi", "min_price": 5150, "max_price": 5780, "modal_price": 5540, "price_change": "+₹80", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Soybean", "commodity_hi": "सोयाबीन", "state": "Madhya Pradesh", "district": "Indore", "market": "Indore Mandi", "min_price": 4300, "max_price": 4950, "modal_price": 4720, "price_change": "+₹30", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Soybean", "commodity_hi": "सोयाबीन", "state": "Maharashtra", "district": "Nagpur", "market": "Nagpur Mandi", "min_price": 4250, "max_price": 4890, "modal_price": 4680, "price_change": "-₹40", "trend": "down", "arrival_date": "Today"},
            {"commodity": "Cotton", "commodity_hi": "कपास", "state": "Gujarat", "district": "Rajkot", "market": "Rajkot Mandi", "min_price": 6800, "max_price": 7750, "modal_price": 7350, "price_change": "+₹150", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Cotton", "commodity_hi": "कपास", "state": "Maharashtra", "district": "Yavatmal", "market": "Yavatmal Mandi", "min_price": 6700, "max_price": 7600, "modal_price": 7200, "price_change": "+₹90", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Rice / Paddy", "commodity_hi": "धान", "state": "Punjab", "district": "Amritsar", "market": "Amritsar Mandi", "min_price": 3100, "max_price": 3850, "modal_price": 3550, "price_change": "+₹50", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Rice / Paddy", "commodity_hi": "धान", "state": "Haryana", "district": "Karnal", "market": "Karnal Mandi", "min_price": 3200, "max_price": 4100, "modal_price": 3750, "price_change": "+₹75", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Onion", "commodity_hi": "प्याज", "state": "Maharashtra", "district": "Nashik", "market": "Lasalgaon Mandi", "min_price": 1450, "max_price": 2250, "modal_price": 1850, "price_change": "-₹80", "trend": "down", "arrival_date": "Today"},
            {"commodity": "Potato", "commodity_hi": "आलू", "state": "Uttar Pradesh", "district": "Agra", "market": "Agra Mandi", "min_price": 1100, "max_price": 1650, "modal_price": 1380, "price_change": "+₹25", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Gram / Chana", "commodity_hi": "चना", "state": "Rajasthan", "district": "Bikaner", "market": "Bikaner Mandi", "min_price": 5600, "max_price": 6250, "modal_price": 5980, "price_change": "+₹40", "trend": "up", "arrival_date": "Today"},
            {"commodity": "Maize", "commodity_hi": "मक्का", "state": "Bihar", "district": "Gulabbagh", "market": "Purnea Mandi", "min_price": 2050, "max_price": 2420, "modal_price": 2280, "price_change": "+₹35", "trend": "up", "arrival_date": "Today"}
        ]
        for m in initial_mandi:
            db.add(MandiPrice(**m))
        db.commit()


def normalize_catalog_images(db: Session):
    """Replace legacy placeholder/reused catalog images with category-specific assets."""
    products = db.query(StoreProduct).all()
    for product in products:
        text = " ".join(
            value or ""
            for value in (product.name, product.category, product.subcategory, product.sku)
        ).lower()

        if product.category == "vegetable-seeds" and ("rice" in text or "paddy" in text or "धान" in text):
            image_url = CATALOG_IMAGE_URLS["rice-seeds"]
        elif product.category == "vegetable-seeds" and ("maize" in text or "corn" in text or "मक्का" in text):
            image_url = CATALOG_IMAGE_URLS["maize-seeds"]
        elif product.category == "vegetable-seeds" and ("mustard" in text or "सरसों" in text):
            image_url = CATALOG_IMAGE_URLS["mustard-seeds"]
        elif product.category == "vegetable-seeds":
            image_url = CATALOG_IMAGE_URLS["seeds"]
        elif product.category == "organic-fertilizers":
            image_url = CATALOG_IMAGE_URLS["fertilizer"]
        elif product.category == "crop-protection":
            image_url = CATALOG_IMAGE_URLS["crop-protection"]
        elif product.category == "farming-tools":
            image_url = CATALOG_IMAGE_URLS["tools"]
        elif product.category == "irrigation":
            image_url = CATALOG_IMAGE_URLS["irrigation"]
        elif product.category in {"organic-bio", "organic"}:
            image_url = CATALOG_IMAGE_URLS["organic"]
        else:
            continue

        if product.image_url != image_url:
            product.image_url = image_url

    db.commit()
