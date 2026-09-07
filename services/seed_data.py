import json
from sqlalchemy.orm import Session
from backend.models_store import StoreProduct, ProductCategory, FertilizerRecommendation

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

def seed_database(db: Session):
    """Seed initial categories, products, and fertilizer recommendations if database is empty."""
    # Seed categories
    if db.query(ProductCategory).count() == 0:
        for cat_data in CATEGORIES:
            cat = ProductCategory(**cat_data)
            db.add(cat)
        db.commit()

    # Seed products
    if db.query(StoreProduct).count() == 0:
        created_products = []
        for prod_data in PRODUCTS:
            prod = StoreProduct(**prod_data)
            db.add(prod)
            created_products.append(prod)
        db.commit()

        # Seed fertilizer recommendations linked to products
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
            rec = FertilizerRecommendation(
                crop_name=crop,
                fertilizer_type=ftype,
                product_id=pid,
                recommendation_score=score
            )
            db.add(rec)
        db.commit()
