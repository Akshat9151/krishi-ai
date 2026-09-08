# -*- coding: utf-8 -*-
"""
Generates and seeds 104+ authentic Indian village agricultural products into SQLite database.
Categories:
1. seeds (बीज)
2. fertilizers (उर्वरक व पोषण)
3. crop-protection (फसल सुरक्षा व कीटनाशक)
4. farming-tools (स्प्रेयर व औजार)
5. irrigation (ड्रिप व सिंचाई)
6. farm-utility (तिरपाल व खेत सुरक्षा)
7. cattle-care (पशु आहार व देखभाल)
8. organic-bio (जैविक व बायो उत्पाद)
"""

import os, sys, json
sys.path.insert(0, os.getcwd())

from backend.database import SessionLocal, engine, Base
from backend.models_store import StoreProduct, ProductCategory, FertilizerRecommendation

# Ensure tables exist
Base.metadata.create_all(bind=engine)

CATEGORIES = [
    {
        "name": "vegetable-seeds",
        "display_name": "🌱 बीज (Certified Seeds)",
        "icon": "fa-solid fa-seedling",
        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
        "description": "सरकारी प्रमाणित हाइब्रिड व उन्नत किस्म के बीज",
        "sort_order": 1
    },
    {
        "name": "organic-fertilizers",
        "display_name": "🧪 खाद व पोषण (Fertilizers & Nutrients)",
        "icon": "fa-solid fa-flask-vial",
        "image": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "description": "IFFCO यूरिया, डीएपी, पोटाश, NPK व सूक्ष्म पोषक तत्व",
        "sort_order": 2
    },
    {
        "name": "crop-protection",
        "display_name": "🛡️ फसल सुरक्षा (Crop Protection & Pesticides)",
        "icon": "fa-solid fa-shield-halved",
        "image": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "description": "कीटनाशक, फफूंदनाशक, खरपतवार नाशक व बायो-पेस्टिसाइड",
        "sort_order": 3
    },
    {
        "name": "farming-tools",
        "display_name": "🛠️ स्प्रेयर व औजार (Sprayers & Farm Tools)",
        "icon": "fa-solid fa-screwdriver-wrench",
        "image": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "description": "16L बैटरी स्प्रेयर पंप, खुरपी, फावड़ा, दरांती व कटाई औजार",
        "sort_order": 4
    },
    {
        "name": "irrigation",
        "display_name": "💧 ड्रिप व सिंचाई (Irrigation & Pipes)",
        "icon": "fa-solid fa-droplet",
        "image": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "description": "ड्रिप किट, रेन पाइप, स्प्रिंकलर व डिलीवरी होज पाइप",
        "sort_order": 5
    },
    {
        "name": "farm-utility",
        "display_name": "⛺ तिरपाल व खेत सुरक्षा (Tarpaulins & Utility)",
        "icon": "fa-solid fa-tent",
        "image": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&auto=format&fit=crop&q=80",
        "description": "वाटरप्रूफ तिरपाल, ग्रीन शेड नेट, मल्चिंग फिल्म व झटका मशीन",
        "sort_order": 6
    },
    {
        "name": "cattle-care",
        "display_name": "🐄 पशु आहार व देखभाल (Cattle Feed & Dairy)",
        "icon": "fa-solid fa-cow",
        "image": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "description": "संतुलित पशु आहार, कैल्शियम जेल, मिनरल मिक्सचर व डिवर्मर",
        "sort_order": 7
    },
    {
        "name": "organic-bio",
        "display_name": "🍃 जैविक उत्पाद (Organic & Bio)",
        "icon": "fa-solid fa-leaf",
        "image": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "description": "शुद्ध वर्मीकम्पोस्ट, नीम खली, ट्राइकोडर्मा व जाइम",
        "sort_order": 8
    }
]

# 104 Detailed, Village-essential products
PRODUCTS_DATA = [
    # === 1. SEEDS (16 items) ===
    {
        "name": "हाइब्रिड गेहूं बीज HD-2967 (Certified Wheat Seeds 40kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "भारतीय कृषि अनुसंधान संस्थान (IARI) द्वारा प्रमाणित उच्च पैदावार गेहूं बीज। रतुआ रोग प्रतिरोधी। प्रति एकड़ 22-25 क्विंटल पैदावार क्षमता।",
        "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
        "price": 1450.0, "original_price": 1650.0, "discount_percentage": 12.0, "rating": 4.9, "reviews_count": 240,
        "badge": "बेस्टसेलर", "brand": "National Seeds Corp", "weight": "40kg", "unit": "bag", "sku": "SEED-WHEAT-2967"
    },
    {
        "name": "श्रीराम सुपर 303 गेहूं बीज (Shriram Super 303 Wheat 40kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "मजबूत तना, चमकदार दाना और उच्च पैदावार के लिए विख्यात लोकप्रिय गेहूं किस्म।",
        "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
        "price": 1580.0, "original_price": 1800.0, "discount_percentage": 12.0, "rating": 4.8, "reviews_count": 185,
        "badge": "टॉप चॉइस", "brand": "Shriram Seeds", "weight": "40kg", "unit": "bag", "sku": "SEED-WHEAT-303"
    },
    {
        "name": "बासमती 1121 धान बीज (Pusa Basmati 1121 Seeds 10kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "विश्व प्रसिद्ध सबसे लंबे दाने वाली सुगंधित बासमती किस्म। मंडियों में सबसे ऊंचा भाव।",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        "price": 850.0, "original_price": 990.0, "discount_percentage": 14.0, "rating": 4.9, "reviews_count": 160,
        "badge": "प्रीमियम", "brand": "Pusa IARI", "weight": "10kg", "unit": "bag", "sku": "SEED-PADDY-1121"
    },
    {
        "name": "PR-126 कम अवधि धान बीज (PR-126 Early Paddy Seeds 10kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "मात्र 123 दिनों में पकने वाली कम पानी की खपत वाली उच्च पैदावार धान किस्म।",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        "price": 620.0, "original_price": 720.0, "discount_percentage": 14.0, "rating": 4.7, "reviews_count": 92,
        "badge": "कम पानी", "brand": "PAU Certified", "weight": "10kg", "unit": "bag", "sku": "SEED-PADDY-PR126"
    },
    {
        "name": "रासी RCH-659 बीटी कपास बीज (Rasi Bt Cotton Seeds 450g)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "गुलाबी सुंडी (PBW) प्रतिरोधी तकनीक युक्त सर्वाधिक बिकने वाला हाइब्रिड कपास बीज।",
        "image_url": "https://images.unsplash.com/photo-1594488518001-4475476a88b5?w=600&auto=format&fit=crop&q=80",
        "price": 864.0, "original_price": 950.0, "discount_percentage": 9.0, "rating": 4.9, "reviews_count": 310,
        "badge": "बेस्टसेलर", "brand": "Rasi Seeds", "weight": "450g", "unit": "packet", "sku": "SEED-COTTON-659"
    },
    {
        "name": "पायनियर 45S46 सरसों बीज (Pioneer 45S46 Mustard 1kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "42%+ तेल की मात्रा और पाला प्रतिरोधी हाइब्रिड सरसों। 12-15 क्विंटल प्रति एकड़।",
        "image_url": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80",
        "price": 890.0, "original_price": 1050.0, "discount_percentage": 15.0, "rating": 4.8, "reviews_count": 215,
        "badge": "हाई ऑयल", "brand": "Corteva Pioneer", "weight": "1kg", "unit": "pack", "sku": "SEED-MUSTARD-45S46"
    },
    {
        "name": "डेकाल्ब DKC-9108 हाइब्रिड मक्का बीज (Dekalb Maize 4kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "पूरे दाने से भरा भारी भुट्टा और सूखा सहने वाली मजबूत जड़ें। 35-40 क्विंटल पैदावार।",
        "image_url": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
        "price": 1650.0, "original_price": 1900.0, "discount_percentage": 13.0, "rating": 4.8, "reviews_count": 140,
        "badge": "भारी भुट्टा", "brand": "Bayer Dekalb", "weight": "4kg", "unit": "bag", "sku": "SEED-MAIZE-9108"
    },
    {
        "name": "सोयाबीन JS-9560 बीज (Certified Soybean Seeds 30kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "मध्य भारत के लिए सबसे उपयुक्त 85-90 दिन में पकने वाली रोगरोधी सोयाबीन किस्म।",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        "price": 2800.0, "original_price": 3200.0, "discount_percentage": 12.0, "rating": 4.7, "reviews_count": 110,
        "badge": "विश्वसनीय", "brand": "MP State Seeds", "weight": "30kg", "unit": "bag", "sku": "SEED-SOYA-9560"
    },
    {
        "name": "सेमिनिस अभिनव हाइब्रिड टमाटर बीज (Abhinav Tomato 10g)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "लंबी दूरी के परिवहन के लिए कड़े, गहरे लाल और चमकीले फल। वायरस प्रतिरोधी।",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        "price": 750.0, "original_price": 890.0, "discount_percentage": 15.0, "rating": 4.9, "reviews_count": 190,
        "badge": "सुपर क्वालिटी", "brand": "Seminis Bayer", "weight": "10g", "unit": "pack", "sku": "SEED-TOMATO-ABH"
    },
    {
        "name": "नासिक रेड हाइब्रिड प्याज बीज (Nasik Red Onion Seeds 500g)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "गोल, गहरे लाल रंग के बड़े कंद और 5-6 महीने भंडारण क्षमता वाली प्याज।",
        "image_url": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
        "price": 950.0, "original_price": 1200.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 88,
        "badge": "भंडारण योग्य", "brand": "Mahyco Seeds", "weight": "500g", "unit": "tin", "sku": "SEED-ONION-NASIK"
    },
    {
        "name": "तेजा 4 हाइब्रिड तीखी लाल मिर्च बीज (Teja-4 Chilli 10g)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "अत्यधिक तीखी, निर्यात योग्य चमकदार लाल मिर्च। वायरस सहने की विशेष क्षमता।",
        "image_url": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
        "price": 680.0, "original_price": 800.0, "discount_percentage": 15.0, "rating": 4.8, "reviews_count": 130,
        "badge": "तीखी मिर्च", "brand": "Nunhems", "weight": "10g", "unit": "pack", "sku": "SEED-CHILLI-TEJA"
    },
    {
        "name": "कुफरी पुखराज आलू बीज (Kufri Pukhraj Seed Potatoes 50kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "70-80 दिनों में तैयार अगेती किस्म। बड़े आकार के चिकने आलू, उच्च मंड उत्पादन।",
        "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
        "price": 1850.0, "original_price": 2100.0, "discount_percentage": 11.0, "rating": 4.6, "reviews_count": 95,
        "badge": "अगेती फसल", "brand": "CPRI Certified", "weight": "50kg", "unit": "bag", "sku": "SEED-POTATO-PUKH"
    },
    {
        "name": "हाइब्रिड भिंडी राधिका बीज (Radhika Ladyfinger 100g)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "पीली मोजेक वायरस प्रतिरोधी, 5 कोणीय गहरी हरी मुलायम भिंडी। लगातार 45 दिन तुड़ाई।",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        "price": 540.0, "original_price": 650.0, "discount_percentage": 16.0, "rating": 4.9, "reviews_count": 170,
        "badge": "वायरस मुक्त", "brand": "Advanta Seeds", "weight": "100g", "unit": "pack", "sku": "SEED-OKRA-RADH"
    },
    {
        "name": "मूंग IPM-02-03 बीज (Summer Moong Seeds 5kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "60 दिन में पकने वाली जायद व खरीफ मूंग। चमकदार दाना, पीला मोजेक मुक्त।",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        "price": 650.0, "original_price": 750.0, "discount_percentage": 13.0, "rating": 4.7, "reviews_count": 64,
        "badge": "60 दिन", "brand": "IIPR Kanpur", "weight": "5kg", "unit": "bag", "sku": "SEED-MOONG-0203"
    },
    {
        "name": "सुपर 777 बाजरा हाइब्रिड बीज (Bajra Hybrid Seeds 1.5kg)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "लंबा सघन सिट्टा, सूखे को सहन करने वाला भारी दाना व मीठा चारा।",
        "image_url": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
        "price": 420.0, "original_price": 500.0, "discount_percentage": 16.0, "rating": 4.6, "reviews_count": 52,
        "badge": "सूखा सहने योग्य", "brand": "Crystal Crop", "weight": "1.5kg", "unit": "pack", "sku": "SEED-BAJRA-777"
    },
    {
        "name": "मल्टी-कट हरा धनिया बीज (Multi-Cut Coriander 500g)",
        "category": "vegetable-seeds", "subcategory": "seeds",
        "description": "खुशबूदार चौड़ी पत्तियों वाला धनिया। 4 से 5 बार तक कटाई संभव।",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 350.0, "discount_percentage": 20.0, "rating": 4.8, "reviews_count": 76,
        "badge": "4-5 कटाई", "brand": "Namdhari Seeds", "weight": "500g", "unit": "pack", "sku": "SEED-CORI-MULTI"
    },

    # === 2. FERTILIZERS & NUTRITION (16 items) ===
    {
        "name": "इफको डीएपी खाद (IFFCO DAP 18:46:0 50kg Bag)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "सरकारी सब्सिडी प्राप्त 100% शुद्ध इफको डीएपी। जड़ों के तीव्र फैलाव व मजबूत कल्लों हेतु।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 1350.0, "original_price": 1500.0, "discount_percentage": 10.0, "rating": 5.0, "reviews_count": 480,
        "badge": "सरकारी दर", "brand": "IFFCO", "weight": "50kg", "unit": "bag", "sku": "FERT-DAP-50KG"
    },
    {
        "name": "इफco नीम कोटेड यूरिया (IFFCO Neem Coated Urea 45kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "धीमी गति से घुलने वाली 46% नाइट्रोजन युक्त नीम कोटेड यूरिया। पौधों में लंबे समय तक हरियाली।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 266.5, "original_price": 300.0, "discount_percentage": 11.0, "rating": 5.0, "reviews_count": 520,
        "badge": "आवश्यक खाद", "brand": "IFFCO", "weight": "45kg", "unit": "bag", "sku": "FERT-UREA-45KG"
    },
    {
        "name": "पोटाश खाद MOP 60% K2O (Muriate of Potash 50kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "दाने की चमक, वजन बढ़ाने और फसलों को सूखा व कीटों से बचाने वाला लाल पोटाश।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 1650.0, "original_price": 1850.0, "discount_percentage": 10.0, "rating": 4.8, "reviews_count": 140,
        "badge": "दाने की चमक", "brand": "IPL Potash", "weight": "50kg", "unit": "bag", "sku": "FERT-MOP-50KG"
    },
    {
        "name": "100% जल घुलनशील NPK 19:19:19 (Water Soluble NPK 1kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "ड्रिप सिंचाई व फोलियर स्प्रे के लिए संपूर्ण पोषक खाद। तुरंत अवशोषण और जोरदार वानस्पतिक वृद्धि।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 170.0, "original_price": 220.0, "discount_percentage": 22.0, "rating": 4.9, "reviews_count": 210,
        "badge": "तुरंत असर", "brand": "IFFCO Water Soluble", "weight": "1kg", "unit": "pack", "sku": "FERT-NPK-191919"
    },
    {
        "name": "एनपीके 0:52:34 मोनो पोटैशियम फॉस्फेट (NPK 00:52:34 1kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "फूल झड़ने से रोकने व फलों का आकार बड़ा करने के लिए सर्वोत्तम फास्फोरस व पोटाश खाद।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 210.0, "original_price": 260.0, "discount_percentage": 19.0, "rating": 4.8, "reviews_count": 130,
        "badge": "फूल व फल रक्षक", "brand": "Mahadhan", "weight": "1kg", "unit": "pack", "sku": "FERT-NPK-05234"
    },
    {
        "name": "एनपीके 0:0:50 पोटैशियम सल्फेट (NPK 00:00:50 SOP 1kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "फलों की मिठास, रंग और वजन बढ़ाने के लिए सल्फर युक्त प्रीमियम पोटाश।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 230.0, "original_price": 280.0, "discount_percentage": 17.0, "rating": 4.8, "reviews_count": 95,
        "badge": "फलों का वजन", "brand": "Mahadhan", "weight": "1kg", "unit": "pack", "sku": "FERT-NPK-00050"
    },
    {
        "name": "जिंक सल्फेट मोनोहाइड्रेट 33% (Zinc Sulphate 33% 5kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "धान में खैरा रोग और मक्का-गेहूं में सफेद पत्ती की रोकथाम हेतु आवश्यक माइक्रोन्यूट्रिएंट।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 420.0, "original_price": 500.0, "discount_percentage": 16.0, "rating": 4.7, "reviews_count": 160,
        "badge": "खैरा रोग नाशक", "brand": "Dayal Fertilizers", "weight": "5kg", "unit": "bag", "sku": "FERT-ZINC-33"
    },
    {
        "name": "सागरिका समुद्री शैवाल अर्क (IFFCO Sagarika Liquid 1L)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "लाल व भूरे समुद्री शैवाल से बना 100% प्राकृतिक बायो-स्टीमुलेंट। 28% अधिक पैदावार।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 500.0, "original_price": 600.0, "discount_percentage": 16.0, "rating": 4.9, "reviews_count": 340,
        "badge": "ऑर्गेनिक टॉनिक", "brand": "IFFCO Sagarika", "weight": "1L", "unit": "bottle", "sku": "FERT-SAGARIKA-1L"
    },
    {
        "name": "सागरिका दानेदार मिट्टी अनुप्रयोग (Sagarika Z++ Granules 10kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "बुवाई के समय यूरिया-डीएपी के साथ डालने वाला समुद्री शैवाल दानेदार खाद।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 460.0, "original_price": 550.0, "discount_percentage": 16.0, "rating": 4.8, "reviews_count": 180,
        "badge": "जड़ों का विकास", "brand": "IFFCO", "weight": "10kg", "unit": "bucket", "sku": "FERT-SAGARIKA-10K"
    },
    {
        "name": "प्रीमियम ह्यूमिक एसिड 98% शाइनिंग (Humic Acid 98% 1kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "मिट्टी को भुरभुरा बनाने, सफेद जड़ों का जाल फैलाने और खाद सोखने की क्षमता बढ़ाने हेतु।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 380.0, "original_price": 480.0, "discount_percentage": 20.0, "rating": 4.9, "reviews_count": 150,
        "badge": "सफेद जड़ें", "brand": "AgriGold Bio", "weight": "1kg", "unit": "pack", "sku": "FERT-HUMIC-98"
    },
    {
        "name": "कृषि बोरोन 20% घुलनशील (Agricultural Boron 20% 500g)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "फलों को फटने से बचाने, परागण सुधारने और सरसों-सब्जियों में दानों की संख्या बढ़ाने हेतु।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 240.0, "original_price": 300.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 88,
        "badge": "फल फटने से रोके", "brand": "Cheminova", "weight": "500g", "unit": "pack", "sku": "FERT-BORON-20"
    },
    {
        "name": "कैल्शियम नाइट्रेट + बोरोन (YaraLiva Nitrabor 25kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "टमाटर, मिर्च व आलू में सड़न (BER) रोकने और फलों की त्वचा चमकदार व मजबूत करने वाला प्रीमियम खाद।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 1450.0, "original_price": 1680.0, "discount_percentage": 13.0, "rating": 4.8, "reviews_count": 110,
        "badge": "सड़न रोके", "brand": "Yara", "weight": "25kg", "unit": "bag", "sku": "FERT-YARA-NITR"
    },
    {
        "name": "बेंटोनाइट सल्फर 90% दानेदार (Sulphur 90% Granules 10kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "तिलहनी व दलहनी फसलों में तेल की मात्रा व प्रोटीन बढ़ाने वाला चौथा प्रमुख पोषक तत्व।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 520.0, "original_price": 620.0, "discount_percentage": 16.0, "rating": 4.7, "reviews_count": 92,
        "badge": "तेल वृद्धि", "brand": "Coromandel", "weight": "10kg", "unit": "bag", "sku": "FERT-SULPH-90"
    },
    {
        "name": "मैग्नीशियम सल्फेट एप्सम सॉल्ट (Magnesium Sulphate 5kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "पत्तियों में क्लोरोफिल और गहरा हरा रंग लाने वाला आवश्यक द्वितीयक पोषक तत्व।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 220.0, "original_price": 280.0, "discount_percentage": 21.0, "rating": 4.6, "reviews_count": 75,
        "badge": "हरी पत्तियां", "brand": "AgroCare", "weight": "5kg", "unit": "bag", "sku": "FERT-MAG-SULPH"
    },
    {
        "name": "फेरस सल्फेट 19% हरा कसीस (Ferrous Sulphate 5kg)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "पीली पड़ती फसलों में लोहे (Iron) की कमी दूर कर तुरंत हरापन लाने वाला लवण।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 190.0, "original_price": 240.0, "discount_percentage": 20.0, "rating": 4.5, "reviews_count": 62,
        "badge": "पीलापन दूर करे", "brand": "Krishi Bio", "weight": "5kg", "unit": "bag", "sku": "FERT-FERROUS-19"
    },
    {
        "name": "इफको नैनो डीएपी तरल (IFFCO Nano DAP Liquid 500ml)",
        "category": "organic-fertilizers", "subcategory": "fertilizers",
        "description": "एक बोतल = एक बोरी डीएपी का असर। पत्तियों पर 100% अवशोषण और पर्यावरण अनुकूल।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 600.0, "original_price": 650.0, "discount_percentage": 8.0, "rating": 4.8, "reviews_count": 290,
        "badge": "नैनो तकनीक", "brand": "IFFCO Nano", "weight": "500ml", "unit": "bottle", "sku": "FERT-NANO-DAP"
    },

    # === 3. CROP PROTECTION / PESTICIDES (16 items) ===
    {
        "name": "कोराजन कीटनाशक (FMC Coragen Chlorantraniliprole 60ml)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "धान का तना छेदक, मक्का का फॉल आर्मीवर्म और गन्ने की चोटी छेदक सुंडी पर अचूक नियंत्रण।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 1180.0, "original_price": 1350.0, "discount_percentage": 12.0, "rating": 5.0, "reviews_count": 340,
        "badge": "सुंडी नाशक", "brand": "FMC India", "weight": "60ml", "unit": "bottle", "sku": "PEST-CORAGEN-60"
    },
    {
        "name": "एमएमेक्टिन बेंजोएट 5% SG (Emamectin Benzoate 5% 100g)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "चना इल्ली, कपास अमेरिकन सुंडी व गोभी की डीबीएम सुंडी को 2 घंटे में खत्म करने वाली दवा।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 380.0, "original_price": 480.0, "discount_percentage": 20.0, "rating": 4.8, "reviews_count": 190,
        "badge": "इल्ली रक्षक", "brand": "Syngenta Proclaim", "weight": "100g", "unit": "pack", "sku": "PEST-EMAMEC-100"
    },
    {
        "name": "कान्फीडोर इमिडाक्लोप्रिड 17.8% SL (Confidor Bayer 100ml)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "माहू, तेला, चेपा, थ्रिप्स व सफेद मक्खी जैसे रस चूसक कीड़ों का संपूर्ण सफाया।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 320.0, "original_price": 390.0, "discount_percentage": 18.0, "rating": 4.9, "reviews_count": 270,
        "badge": "रस चूसक कीट", "brand": "Bayer CropScience", "weight": "100ml", "unit": "bottle", "sku": "PEST-CONFIDOR-100"
    },
    {
        "name": "साफ फंगीसाइड (UPL Saaf Carbendazim + Mancozeb 500g)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "जड़ सड़न, तना झुलसा, टिक्का रोग व डैम्पिंग ऑफ का दोहरा सुरक्षा कवच। बीज उपचार व स्प्रे दोनों में।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 390.0, "original_price": 480.0, "discount_percentage": 18.0, "rating": 4.9, "reviews_count": 310,
        "badge": "नंबर 1 फंगीसाइड", "brand": "UPL", "weight": "500g", "unit": "pack", "sku": "PEST-SAAF-500"
    },
    {
        "name": "प्राकृतिक नीम तेल 10000 PPM (Pure Neem Oil Bio-Pesticide 1L)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "कोल्ड प्रेस्ड 100% शुद्ध अजाडिरैक्टिन नीम तेल। मित्र कीटों को नुकसान पहुंचाए बिना सभी कीटों से सुरक्षा।",
        "image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
        "price": 480.0, "original_price": 600.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 180,
        "badge": "जैविक कीटनाशक", "brand": "BioShield", "weight": "1L", "unit": "bottle", "sku": "PEST-NEEM-10000"
    },
    {
        "name": "डाइथेन एम-45 मैंकोजेब 75% WP (Dithane M-45 500g)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "आलू व टमाटर में अगेती व पछेती झुलसा (Late Blight) तथा पत्तियों के धब्बे की प्रसिद्ध दवा।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 340.0, "discount_percentage": 17.0, "rating": 4.8, "reviews_count": 150,
        "badge": "झुलसा रक्षक", "brand": "Indofil", "weight": "500g", "unit": "pack", "sku": "PEST-DITHANE-500"
    },
    {
        "name": "टिल्ट प्रोपिकोनाजोल 25% EC (Syngenta Tilt 250ml)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "गेहूं में पीला व भूरा रतुआ (Rust), धान में शीथ ब्लाइट और मूंगफली में टिक्का रोग की रामबाण दवा।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 490.0, "original_price": 590.0, "discount_percentage": 17.0, "rating": 4.9, "reviews_count": 160,
        "badge": "रतुआ नाशक", "brand": "Syngenta", "weight": "250ml", "unit": "bottle", "sku": "PEST-TILT-250"
    },
    {
        "name": "राउंडअप ग्लाइफोसेट 41% SL (Roundup Weedicide 1L)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "खेत की मेड़ों, खाली खेतों व बगीचों में मोथा, दूब और सभी प्रकार के जिद्दी खरपतवार का जड़ से खात्मा।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 460.0, "original_price": 550.0, "discount_percentage": 16.0, "rating": 4.8, "reviews_count": 220,
        "badge": "जड़ से खत्म", "brand": "Bayer Roundup", "weight": "1L", "unit": "bottle", "sku": "PEST-ROUNDUP-1L"
    },
    {
        "name": "पेंडीमेथालिन 30% EC खरपतवार नाशक (Stomp Extra 1L)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "गेहूं, सोयाबीन, प्याज व लहसुन की बुवाई के तुरंत बाद छिड़काव करने से खरपतवार उगने ही नहीं देता।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 580.0, "original_price": 680.0, "discount_percentage": 15.0, "rating": 4.7, "reviews_count": 95,
        "badge": "प्री-इमर्जेंस", "brand": "BASF Stomp", "weight": "1L", "unit": "bottle", "sku": "PEST-STOMP-1L"
    },
    {
        "name": "क्लोरोपायरीफॉस 20% EC (Chlorpyrifos Termite Killer 1L)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "दीमक, तना छेदक व जमीन के कीड़ों का सबसे भरोसेमंद और किफायती कीटनाशक।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 350.0, "original_price": 420.0, "discount_percentage": 16.0, "rating": 4.7, "reviews_count": 140,
        "badge": "दीमक नाशक", "brand": "Tata Rallis", "weight": "1L", "unit": "bottle", "sku": "PEST-CHLORO-1L"
    },
    {
        "name": "2,4-D एमाइन साल्ट 58% SL (Broadleaf Weedicide 1L)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "गेहूं, मक्का व गन्ने में चौड़ी पत्ती वाले बथुआ, हिरनखुरी व गाजरघास का संपूर्ण सफाया।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 380.0, "original_price": 450.0, "discount_percentage": 15.0, "rating": 4.6, "reviews_count": 85,
        "badge": "चौड़ी पत्ती नाशक", "brand": "Atul Ltd", "weight": "1L", "unit": "bottle", "sku": "PEST-24D-1L"
    },
    {
        "name": "कस्टोडिया फंगीसाइड (Adama Custodia 250ml)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "एजोक्सीस्ट्रोबिन व टेबुकोनाजोल का शक्तिशाली मिश्रण। मिर्च का डाइ-बैक व फल सड़न तुरंत रोके।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 620.0, "original_price": 720.0, "discount_percentage": 14.0, "rating": 4.8, "reviews_count": 92,
        "badge": "फल सड़न रोके", "brand": "Adama", "weight": "250ml", "unit": "bottle", "sku": "PEST-CUSTODIA-250"
    },
    {
        "name": "उलाला फ्लोनिकामिड 50% WG (UPL Ulala 60g)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "कपास व धान में सफेद मक्खी (Whitefly) व भूरा फुदका (BPH) पर 20 दिनों का लंबा सुरक्षा कवच।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 640.0, "original_price": 750.0, "discount_percentage": 15.0, "rating": 4.9, "reviews_count": 115,
        "badge": "सफेद मक्खी नाशक", "brand": "UPL", "weight": "60g", "unit": "pack", "sku": "PEST-ULALA-60G"
    },
    {
        "name": "ट्राइकोडर्मा विरिडी जैव कवकनाशी (Trichoderma Viride 1kg)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "जैविक फफूंदनाशक। मिट्टी से फैलने वाले उकठा (Wilt) और जड़ गलन रोग की प्राकृतिक रोकथाम।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 220.0, "original_price": 280.0, "discount_percentage": 21.0, "rating": 4.8, "reviews_count": 145,
        "badge": "उकठा रोग रोके", "brand": "Krishi Bio", "weight": "1kg", "unit": "pack", "sku": "PEST-TRICHO-1KG"
    },
    {
        "name": "स्यूडोमोनास फ्लोरोसेंस बायो-बैक्टीरिसाइड (Pseudomonas 1kg)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "जीवाणु झुलसा (Bacterial Blight) व कैंकर रोग की रोकथाम हेतु जैविक जीवाणु रक्षक।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 240.0, "original_price": 300.0, "discount_percentage": 20.0, "rating": 4.6, "reviews_count": 78,
        "badge": "बैक्टीरियल रक्षक", "brand": "Krishi Bio", "weight": "1kg", "unit": "pack", "sku": "PEST-PSEUDO-1KG"
    },
    {
        "name": "सुपर सिलिकॉन स्प्रेडर व स्टीकर (Agro Spreader Chipko 500ml)",
        "category": "crop-protection", "subcategory": "protection",
        "description": "दवा को पत्तियों पर चिपकाने व तेजी से फैलाने वाला। बारिश में भी दवा का असर बनाए रखता है।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 260.0, "original_price": 350.0, "discount_percentage": 25.0, "rating": 4.9, "reviews_count": 210,
        "badge": "दवा का 100% असर", "brand": "Silix Pro", "weight": "500ml", "unit": "bottle", "sku": "PEST-STICKER-500"
    },

    # === 4. SPRAYERS & FARM TOOLS (14 items) ===
    {
        "name": "16 लीटर 12V बैटरी स्प्रेयर पंप डबल मोटर (Balwaan 16L Sprayer)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "एक चार्ज में 25-30 टंकी छिड़काव। डबल मोटर, हाई प्रेशर ब्रास गन, 4 अलग-अलग नोजल व रेगुलेटर सहित।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 2350.0, "original_price": 2999.0, "discount_percentage": 22.0, "rating": 4.9, "reviews_count": 380,
        "badge": "डबल मोटर", "brand": "Balwaan Agri", "weight": "5.5kg", "unit": "piece", "sku": "TOOL-SPRAY-16L-DBL"
    },
    {
        "name": "2-in-1 बैटरी व हाथ से चलने वाला स्प्रेयर (2-in-1 Knapsack 16L)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "बैटरी खत्म होने पर हाथ के हैंडल से भी चलाने की सुविधा। कभी भी काम न रुके।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 2650.0, "original_price": 3200.0, "discount_percentage": 17.0, "rating": 4.8, "reviews_count": 195,
        "badge": "2-इन-1 हाइब्रिड", "brand": "Kisan Kraft", "weight": "6.2kg", "unit": "piece", "sku": "TOOL-SPRAY-2IN1"
    },
    {
        "name": "मैनुअल नैपसैक स्प्रे पंप (16L Heavy Duty Manual Sprayer)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "मजबूत वर्जिन प्लास्टिक बॉडी, लीक-प्रूफ टैंक और ब्रास लांस वाला क्लासिक हैंड स्प्रेयर।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 950.0, "original_price": 1250.0, "discount_percentage": 24.0, "rating": 4.6, "reviews_count": 130,
        "badge": "किफायती व मजबूत", "brand": "AgroTech", "weight": "3.8kg", "unit": "piece", "sku": "TOOL-SPRAY-MAN16"
    },
    {
        "name": "हेवी ड्यूटी लोहे का फावड़ा/कुदाल (Heavy Steel Phawra with Handle)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "उच्च कार्बन स्टील से फोर्ज किया हुआ नुकीला मजबूत फावड़ा। मजबूत लकड़ी के हैंडल सहित।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=600&auto=format&fit=crop&q=80",
        "price": 420.0, "original_price": 520.0, "discount_percentage": 19.0, "rating": 4.7, "reviews_count": 88,
        "badge": "कड़ा स्टील", "brand": "Tata Agrico", "weight": "2.2kg", "unit": "piece", "sku": "TOOL-PHAWRA-01"
    },
    {
        "name": "स्टील खुरपी व निंदाई औजार (Forged Steel Hand Weeder 3 inch)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "सब्जियों व फसलों में खरपतवार निकालने हेतु तेज धार वाली हाथ की खुरपी।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=600&auto=format&fit=crop&q=80",
        "price": 160.0, "original_price": 220.0, "discount_percentage": 27.0, "rating": 4.8, "reviews_count": 140,
        "badge": "तेज धार", "brand": "Kisan Tool", "weight": "400g", "unit": "piece", "sku": "TOOL-KHURPI-01"
    },
    {
        "name": "फसल कटाई दरांती / हंसिया (Serrated Sickle Daranti)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "गेहूं व धान की फसल काटने के लिए दांतों वाली तेज धार दरांती। हाथ को न थकाने वाला ग्रिप।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=600&auto=format&fit=crop&q=80",
        "price": 140.0, "original_price": 190.0, "discount_percentage": 26.0, "rating": 4.8, "reviews_count": 165,
        "badge": "दांतेदार धार", "brand": "AgriCraft", "weight": "350g", "unit": "piece", "sku": "TOOL-SICKLE-01"
    },
    {
        "name": "सोलर प्रकाश कीट प्रपंच (Solar Light Insect Trap)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "बिना बिजली चलने वाला सोलर कीट ट्रैप। रात में हानिकारक पतंगों व सुंडियों को आकर्षित कर नष्ट करे।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 1450.0, "original_price": 1900.0, "discount_percentage": 23.0, "rating": 4.8, "reviews_count": 82,
        "badge": "सोलर चालित", "brand": "SunKrishi", "weight": "1.8kg", "unit": "unit", "sku": "TOOL-SOLAR-TRAP"
    },
    {
        "name": "मैनुअल सीड ट्रीटिंग ड्रम (Seed Dressing Drum 20kg)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "बुवाई से पहले बीज में फफूंदनाशक व कीटनाशक दवा समान रूप से मिलाने वाला रोटरी ड्रम।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 1850.0, "original_price": 2300.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 45,
        "badge": "बीज उपचार", "brand": "AgroTech", "weight": "7kg", "unit": "unit", "sku": "TOOL-SEED-DRUM"
    },
    {
        "name": "गार्डन व फल प्रूनिंग कटर कटर (Heavy Duty Pruning Shear)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "फलदार पेड़ों, अंगूर, अनार व सब्जियों की कटाई-छंटाई हेतु SK-5 जापानी स्टील कटर।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=600&auto=format&fit=crop&q=80",
        "price": 390.0, "original_price": 550.0, "discount_percentage": 29.0, "rating": 4.8, "reviews_count": 115,
        "badge": "SK-5 स्टील", "brand": "Falcon Tools", "weight": "260g", "unit": "piece", "sku": "TOOL-PRUNER-01"
    },
    {
        "name": "स्प्रेयर पंप 12V 12Ah लिथियम बैटरी (Replacement Battery)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "हल्की व लंबी उम्र वाली लिथियम आयन बैटरी। सभी ब्रांड के 16L व 20L स्प्रेयर पंप में फिट।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 1250.0, "original_price": 1600.0, "discount_percentage": 22.0, "rating": 4.7, "reviews_count": 89,
        "badge": "लंबा बैकअप", "brand": "PowerKisan", "weight": "950g", "unit": "piece", "sku": "TOOL-BATT-12V"
    },
    {
        "name": "पीतल स्प्रेयर नोजल सेट 4 पीस (Brass Nozzle Combo Pack)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "फैन नोजल, 4-होल मिस्ट नोजल, कोन नोजल व एडजस्टेबल हाई जेट ब्रास नोजल का सेट।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 380.0, "discount_percentage": 26.0, "rating": 4.8, "reviews_count": 140,
        "badge": "100% पीतल", "brand": "Kisan Brass", "weight": "200g", "unit": "set", "sku": "TOOL-NOZZLE-SET"
    },
    {
        "name": "मैनुअल व्हील वीडर साइकिल खुरपी (Single Wheel Hand Weeder)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "कतार में बोई फसलों (सोयाबीन, मक्का, कपास) में खड़े-खड़े तेजी से खरपतवार निकालने की मशीन।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=600&auto=format&fit=crop&q=80",
        "price": 1150.0, "original_price": 1450.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 68,
        "badge": "खड़े-खड़े काम", "brand": "AgroTech", "weight": "4.5kg", "unit": "unit", "sku": "TOOL-WHEEL-WEED"
    },
    {
        "name": "अनाज व बीज नमी मापक मीटर (Digital Grain Moisture Meter)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "गेहूं, धान, सरसों व मक्के की नमी (Moisture) तुरंत नापें ताकि मंडी में सही भाव मिले।",
        "image_url": "https://images.unsplash.com/photo-1589652043056-ba1a2c4830a7?w=600&auto=format&fit=crop&q=80",
        "price": 2100.0, "original_price": 2800.0, "discount_percentage": 25.0, "rating": 4.8, "reviews_count": 52,
        "badge": "मंडी भाव रक्षक", "brand": "AgroMeter", "weight": "400g", "unit": "piece", "sku": "TOOL-MOIST-METER"
    },
    {
        "name": "खेत सुरक्षा चश्मा व एन-95 केमिकल मास्क (Spraying PPE Kit)",
        "category": "farming-tools", "subcategory": "tools",
        "description": "कीटनाशक छिड़काव के दौरान आंखों व फेफड़ों को जहरीले रसायनों से सुरक्षित रखने वाला किट।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 220.0, "original_price": 320.0, "discount_percentage": 31.0, "rating": 4.9, "reviews_count": 180,
        "badge": "किसान सुरक्षा", "brand": "3M AgriSafety", "weight": "250g", "unit": "kit", "sku": "TOOL-PPE-KIT"
    },

    # === 5. IRRIGATION & PIPES (14 items) ===
    {
        "name": "ड्रिप इरिगेशन 16mm लैटरल पाइप (16mm Drip Pipe 400m Roll)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "ISI मार्क 100% वर्जिन प्लास्टिक ड्रिप पाइप। धूप में 7 साल तक न फटने वाला यूवी प्रोटेक्टेड।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 1850.0, "original_price": 2300.0, "discount_percentage": 20.0, "rating": 4.9, "reviews_count": 165,
        "badge": "ISI प्रमाणित", "brand": "Jain Irrigation", "weight": "14kg", "unit": "roll", "sku": "IRR-DRIP-400M"
    },
    {
        "name": "लेजर रेन पाइप किट 100 मीटर (Laser Rain Pipe 100m Set)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "फव्वारे की तरह बारिश जैसा पानी देने वाला रेन पाइप। प्याज, मूंगफली व लहसुन के लिए वरदान।",
        "image_url": "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
        "price": 1450.0, "original_price": 1850.0, "discount_percentage": 21.0, "rating": 4.8, "reviews_count": 120,
        "badge": "बारिश जैसा पानी", "brand": "DropWise", "weight": "5.8kg", "unit": "set", "sku": "IRR-RAIN-100M"
    },
    {
        "name": "कंप्लीट किचन गार्डन व छोटा खेत ड्रिप किट (Family Drip Kit 250 Plants)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "250 पौधों के लिए संपूर्ण ड्रिप सिस्टम: मेन पाइप, ड्रीपर्स, कनेक्टर, पंचर व वाल्व सहित।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 1299.0, "original_price": 1699.0, "discount_percentage": 23.0, "rating": 4.8, "reviews_count": 94,
        "badge": "फुल किट", "brand": "DropWise", "weight": "3.5kg", "unit": "kit", "sku": "IRR-KIT-250P"
    },
    {
        "name": "माइक्रो स्प्रिंकलर फव्वारा सिंचाई किट (Micro Sprinkler Half Acre 15pcs)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "आधे एकड़ खेत में समान रूप से फव्वारा पानी देने वाला माइक्रो स्प्रिंकलर सेट।",
        "image_url": "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
        "price": 1750.0, "original_price": 2200.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 78,
        "badge": "फव्वारा सेट", "brand": "Netafim", "weight": "4.2kg", "unit": "kit", "sku": "IRR-SPRINK-HALF"
    },
    {
        "name": "हैवी ड्यूटी लपेटा पाइप डिलीवरी होज (2.5 Inch Lapeta Pipe 60m)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "ट्यूबवेल से खेत तक पानी ले जाने वाला 3-प्लाई वाटरप्रूफ मजबूत लपेटा पाइप।",
        "image_url": "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80",
        "price": 1950.0, "original_price": 2400.0, "discount_percentage": 19.0, "rating": 4.8, "reviews_count": 210,
        "badge": "3-प्लाई मजबूत", "brand": "Kisan Shaktiman", "weight": "11kg", "unit": "roll", "sku": "IRR-LAPETA-60M"
    },
    {
        "name": "वेंचुरी खाद इंजेक्टर 2 इंच (Venturi Fertilizer Injector 2 Inch)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "ड्रिप के पानी के साथ घुलनशील खाद सीधे पौधों की जड़ों तक पहुंचाने का ऑटोमैटिक उपकरण।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 850.0, "original_price": 1100.0, "discount_percentage": 23.0, "rating": 4.7, "reviews_count": 86,
        "badge": "खाद इंजेक्टर", "brand": "DropWise", "weight": "650g", "unit": "piece", "sku": "IRR-VENTURI-2IN"
    },
    {
        "name": "एडजस्टेबल ड्रिपर एमिटर 100 पीस (Adjustable Drippers Pack of 100)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "0 से 70 लीटर प्रति घंटा पानी का बहाव सेट करने वाले प्रीमियम स्क्रू ड्रिपर्स।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 320.0, "original_price": 450.0, "discount_percentage": 29.0, "rating": 4.8, "reviews_count": 140,
        "badge": "100 पीस", "brand": "DropWise", "weight": "450g", "unit": "pack", "sku": "IRR-DRIP-100P"
    },
    {
        "name": "डिस्क फिल्टर ड्रिप क्लीनर 2 इंच (Drip Irrigation Disc Filter 2 Inch)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "रेत, शैवाल व कचरे को ड्रिप में जाने से रोककर ड्रिपर्स को चोक होने से बचाने वाला फिल्टर।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 1650.0, "original_price": 2100.0, "discount_percentage": 21.0, "rating": 4.8, "reviews_count": 72,
        "badge": "चोकिंग रोके", "brand": "Jain Irrigation", "weight": "3.2kg", "unit": "piece", "sku": "IRR-FILTER-2IN"
    },
    {
        "name": "पीवीसी बॉल वाल्व 2 इंच हैवी (PVC Ball Valve 2 Inch Heavy Duty)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "खेत में पानी की दिशा नियंत्रित करने वाला बिना लीकेज का मजबूत पीवीसी वाल्व।",
        "image_url": "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80",
        "price": 260.0, "original_price": 350.0, "discount_percentage": 25.0, "rating": 4.6, "reviews_count": 90,
        "badge": "नो लीकेज", "brand": "Supreme Pipes", "weight": "450g", "unit": "piece", "sku": "IRR-VALVE-2IN"
    },
    {
        "name": "फ्लेक्सिबल गार्डन व नर्सरी होज 1/2 इंच 30 मीटर (Braided Garden Hose 30m)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "नर्सरी, पशु बाड़े व सब्जियों में छिड़काव हेतु मुड़ने पर न रुकने वाला 3-लेयर ब्रेडेड पाइप।",
        "image_url": "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80",
        "price": 750.0, "original_price": 990.0, "discount_percentage": 24.0, "rating": 4.7, "reviews_count": 110,
        "badge": "मुड़ेगा नहीं", "brand": "Ganga Flexible", "weight": "3.1kg", "unit": "roll", "sku": "IRR-HOSE-30M"
    },
    {
        "name": "ड्रिप लैटरल पंच टूल (Drip Hole Puncher 3mm / 4mm)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "16mm पाइप में ड्रिपर्स लगाने के लिए सही आकार का सुराख बनाने वाला एर्गोनोमिक पंचर।",
        "image_url": "https://images.unsplash.com/photo-1598257008754-b4d61c42d6d4?w=600&auto=format&fit=crop&q=80",
        "price": 80.0, "original_price": 120.0, "discount_percentage": 33.0, "rating": 4.7, "reviews_count": 95,
        "badge": "सटीक छेद", "brand": "DropWise", "weight": "80g", "unit": "piece", "sku": "IRR-PUNCH-TOOL"
    },
    {
        "name": "रेनगन स्प्रिंकलर 1.5 इंच ब्रास (Brass Rain Gun Sprinkler 1.5 Inch)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "गन्ने, गेहूं व चारे के खेतों में 100 फीट व्यास तक चारों तरफ एक साथ तेज फव्वारा पानी।",
        "image_url": "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
        "price": 2850.0, "original_price": 3600.0, "discount_percentage": 21.0, "rating": 4.9, "reviews_count": 85,
        "badge": "100 फीट दायरा", "brand": "Kisan RainGun", "weight": "2.8kg", "unit": "unit", "sku": "IRR-RAINGUN-15"
    },
    {
        "name": "16mm ड्रिप जॉइनर व एंड कैप कॉम्बो (Connectors 50 Pcs Set)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "पाइप जोड़ने, टी बनाने व अंतिम सिरे बंद करने के लिए 50 आवश्यक कनेक्टर्स का कॉम्बो।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 220.0, "original_price": 300.0, "discount_percentage": 27.0, "rating": 4.6, "reviews_count": 65,
        "badge": "50 पीस पैक", "brand": "DropWise", "weight": "350g", "unit": "set", "sku": "IRR-CONN-50PCS"
    },
    {
        "name": "ऑटोमैटिक वाटर टाइमर कंट्रोलर (Solar Drip Timer Controller)",
        "category": "irrigation", "subcategory": "irrigation",
        "description": "निर्धारित समय पर अपने आप ड्रिप चालू व बंद करने वाला डिजिटल वॉटर टाइमर।",
        "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=80",
        "price": 2150.0, "original_price": 2800.0, "discount_percentage": 23.0, "rating": 4.7, "reviews_count": 48,
        "badge": "ऑटोमेटिक", "brand": "AutoKisan", "weight": "600g", "unit": "piece", "sku": "IRR-TIMER-AUTO"
    },

    # === 6. TARPAULIN & FARM UTILITY (14 items) ===
    {
        "name": "हैवी ड्यूटी वाटरप्रूफ तिरपाल 12x18 फीट (HDPE Tirpal 120 GSM)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "फसल, तूड़ी, थ्रेशिंग फ्लोर व ट्रैक्टर ढकने के लिए 100% वाटरप्रूफ, मजबूत कोनों वाली तिरपाल।",
        "image_url": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&auto=format&fit=crop&q=80",
        "price": 680.0, "original_price": 850.0, "discount_percentage": 20.0, "rating": 4.8, "reviews_count": 290,
        "badge": "100% वाटरप्रूफ", "brand": "Silpaulin Partner", "weight": "2.4kg", "unit": "piece", "sku": "UTIL-TIRPAL-1218"
    },
    {
        "name": "सुपर स्ट्रांग तिरपाल 18x24 फीट (HDPE Heavy Tirpal 150 GSM)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "बड़ी फसल की ढेरियों व भूसे को बारिश से बचाने हेतु अतिरिक्त मजबूत 150 GSM तिरपाल।",
        "image_url": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&auto=format&fit=crop&q=80",
        "price": 1450.0, "original_price": 1800.0, "discount_percentage": 19.0, "rating": 4.9, "reviews_count": 215,
        "badge": "बड़ा साइज", "brand": "Silpaulin Partner", "weight": "4.8kg", "unit": "piece", "sku": "UTIL-TIRPAL-1824"
    },
    {
        "name": "ग्रीन शेड नेट 50% 3x50 मीटर (Green Shade Net 50% 150 Sqm)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "नर्सरी, सब्जियों व पशु बाड़ों में चिलचिलाती धूप व लू से 50% सुरक्षा देने वाला शेड नेट।",
        "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80",
        "price": 2150.0, "original_price": 2700.0, "discount_percentage": 20.0, "rating": 4.8, "reviews_count": 130,
        "badge": "धूप रक्षक", "brand": "AgroNet India", "weight": "9kg", "unit": "roll", "sku": "UTIL-SHADE-50"
    },
    {
        "name": "ग्रीन शेड नेट 75% 3x50 मीटर (Green Shade Net 75% Heavy)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "गर्मी में पशुओं के बाड़े को ठंडा रखने और पॉलीहाउस नर्सरी के लिए 75% छाया वाला नेट।",
        "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80",
        "price": 2750.0, "original_price": 3400.0, "discount_percentage": 19.0, "rating": 4.9, "reviews_count": 110,
        "badge": "75% छाया", "brand": "AgroNet India", "weight": "12kg", "unit": "roll", "sku": "UTIL-SHADE-75"
    },
    {
        "name": "सिल्वर ब्लैक मल्चिंग फिल्म 25 माइक्रोन (Mulching Film 400m Roll)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "खरपतवार रोकने, नमी बचाने और पैदावार 40% बढ़ाने वाली सरकारी मानक मल्चिंग फिल्म।",
        "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80",
        "price": 1780.0, "original_price": 2200.0, "discount_percentage": 19.0, "rating": 4.8, "reviews_count": 175,
        "badge": "खरपतवार रोके", "brand": "IndoFil Mulch", "weight": "11kg", "unit": "roll", "sku": "UTIL-MULCH-25M"
    },
    {
        "name": "सोलर झटका मशीन फेंस गार्ड (Solar Zatka Machine 10 Acre)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "नीलगाय, जंगली सुअर व आवारा पशुओं से 10 एकड़ फसल की सुरक्षा। सुरक्षित हल्का झटका।",
        "image_url": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
        "price": 4650.0, "original_price": 5800.0, "discount_percentage": 20.0, "rating": 4.9, "reviews_count": 160,
        "badge": "नीलगाय रक्षक", "brand": "Kisan Rakshak", "weight": "6kg", "unit": "system", "sku": "UTIL-ZATKA-10AC"
    },
    {
        "name": "इंसुलेटर कॉर्नर फेंसिंग 100 पीस (Fence Corner Insulators 100pcs)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "तारबंदी व झटका मशीन के तारों को खंभों में बिना करंट लीकेज सुरक्षित बांधने वाले इंसुलेटर।",
        "image_url": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
        "price": 450.0, "original_price": 600.0, "discount_percentage": 25.0, "rating": 4.7, "reviews_count": 92,
        "badge": "100 पीस", "brand": "Kisan Rakshak", "weight": "1.2kg", "unit": "pack", "sku": "UTIL-INSUL-100"
    },
    {
        "name": "फसल व फल पक्षी सुरक्षा नेट (Anti-Bird Crop Netting 10x30m)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "तोते, चिड़ियों व चमगादड़ों से फलदार बागों व मक्के-सूरजमुखी की फसल की अहिंसक सुरक्षा।",
        "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80",
        "price": 850.0, "original_price": 1150.0, "discount_percentage": 26.0, "rating": 4.6, "reviews_count": 64,
        "badge": "पक्षी रक्षक", "brand": "SafeAgro", "weight": "2kg", "unit": "piece", "sku": "UTIL-BIRD-NET"
    },
    {
        "name": "हैवी ड्यूटी जूट बारदाना बोरी 50kg 10 पीस (Jute Gunny Bags Pack of 10)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "गेहूं, धान, चना व आलू भंडारण के लिए 100% प्राकृतिक सांस लेने वाली मजबूत जूट बोरियां।",
        "image_url": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&auto=format&fit=crop&q=80",
        "price": 650.0, "original_price": 800.0, "discount_percentage": 19.0, "rating": 4.8, "reviews_count": 180,
        "badge": "अनाज भंडारण", "brand": "Bengal Jute", "weight": "6kg", "unit": "bundle", "sku": "UTIL-JUTE-10PCS"
    },
    {
        "name": "टमाटर व बेल वाली फसलों का धागा (Polypropylene Trellising Twine 1kg)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "टमाटर, खीरा, शिमला मिर्च की लताओं को ऊपर चढ़ाने वाला धूप में न गलने वाला यूवी धागा।",
        "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 350.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 75,
        "badge": "मजबूत धागा", "brand": "AgroTwine", "weight": "1kg", "unit": "roll", "sku": "UTIL-TWINE-1KG"
    },
    {
        "name": "फसल व बीज सुखाने का ड्रायर नेट (Crop Drying Floor Sheet 15x15 ft)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "आंगन या खेत में अनाज व बीज को जमीन की धूल व नमी से बचाकर तेजी से सुखाने वाली जाली।",
        "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80",
        "price": 590.0, "original_price": 750.0, "discount_percentage": 21.0, "rating": 4.7, "reviews_count": 88,
        "badge": "अनाज सुखाना", "brand": "CleanKisan", "weight": "1.5kg", "unit": "piece", "sku": "UTIL-DRY-SHEET"
    },
    {
        "name": "लोहा तार 14 गेज तारबंदी (GI Barbed Wire 14 Gauge 25kg Bundle)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "खेत की बाहरी सीमा को मजबूत तारबंदी से घेरने वाला जंग-रोधी गैल्वेनाइज्ड कांटेदार तार।",
        "image_url": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
        "price": 2350.0, "original_price": 2700.0, "discount_percentage": 13.0, "rating": 4.8, "reviews_count": 140,
        "badge": "जंग रोधी GI", "brand": "Tata Wiron", "weight": "25kg", "unit": "bundle", "sku": "UTIL-WIRE-14G"
    },
    {
        "name": "चूहा नियंत्रक चारा जिंक फॉस्फाइड (Rat Poison Quick Baits 100g)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "गोदामों व खेत की मेड़ों में फसलों व अनाज को कुतरने वाले चूहों का त्वरित खात्मा।",
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80",
        "price": 110.0, "original_price": 150.0, "discount_percentage": 27.0, "rating": 4.6, "reviews_count": 96,
        "badge": "चूहा नाशक", "brand": "RatStop", "weight": "100g", "unit": "pack", "sku": "UTIL-RAT-100G"
    },
    {
        "name": "कीट चिपचिपा पीला व नीला ट्रैप (Sticky Insect Traps 20 Pcs)",
        "category": "farm-utility", "subcategory": "utility",
        "description": "सफेद मक्खी, माहू, थ्रिप्स को आकर्षित कर चिपकाने वाला बिना केमिकल का प्राकृतिक ट्रैप।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 290.0, "original_price": 400.0, "discount_percentage": 28.0, "rating": 4.9, "reviews_count": 170,
        "badge": "बिना दवा कीट खात्मा", "brand": "BioTrap", "weight": "400g", "unit": "pack", "sku": "UTIL-STICKY-20P"
    },

    # === 7. CATTLE FEED & ANIMAL CARE (14 items) ===
    {
        "name": "संतुलित दुधारू पशु आहार (Balanced Dairy Cattle Feed 50kg)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "22% प्रोटीन व 4% फैट युक्त गाय व भैंस का संपूर्ण आहार। दूध उत्पादन व गाढ़ापन 20% बढ़ाता है।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 1250.0, "original_price": 1450.0, "discount_percentage": 14.0, "rating": 4.9, "reviews_count": 280,
        "badge": "दूध व फैट बढ़ाए", "brand": "Amul / Kapila Partner", "weight": "50kg", "unit": "bag", "sku": "CAT-FEED-50KG"
    },
    {
        "name": "कैल्शियम जेल ऑस्टोवेट फोर्ट (Ostovet High Calcium Gel 1L)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "ब्याने के बाद गाय-भैंस में मिल्क फीवर (सूता रोग) से बचाव और दूध की मात्रा तुरंत बढ़ाने वाला कैल्शियम।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 360.0, "discount_percentage": 22.0, "rating": 4.9, "reviews_count": 240,
        "badge": "कैल्शियम टॉनिक", "brand": "Virbac Ostovet", "weight": "1L", "unit": "bottle", "sku": "CAT-CALC-1L"
    },
    {
        "name": "दुधारू पशु मिनरल मिक्सचर (Chelated Mineral Mixture 5kg)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "गाय-भैंस को समय पर गाभिन कराने, बांझपन दूर करने व चमक बढ़ाने वाला विटामिन युक्त मिनरल पाउडर।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 650.0, "original_price": 820.0, "discount_percentage": 21.0, "rating": 4.8, "reviews_count": 190,
        "badge": "गाभिन कराए", "brand": "Agrimin Forte", "weight": "5kg", "unit": "bucket", "sku": "CAT-MINERAL-5K"
    },
    {
        "name": "पेट के कीड़े मारने की गोली बोलस (Albendazole Bolus 10 Pcs)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "पशुओं के पेट के फीताकृमि व गोलकृमि को जड़ से खत्म करने वाली डिवर्मिंग गोली। वजन व भूख बढ़ाए।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 180.0, "original_price": 240.0, "discount_percentage": 25.0, "rating": 4.8, "reviews_count": 160,
        "badge": "पेट के कीड़े खत्म", "brand": "Albomar Vet", "weight": "100g", "unit": "strip", "sku": "CAT-DEWORM-10B"
    },
    {
        "name": "दुग्ध वर्धक लेप्टाडेनिया चूर्ण (Milk Booster Herb Powder 1kg)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "जीवंती, शतावरी व मेथी से बना 100% आयुर्वेदिक चूर्ण जो बिना किसी दुष्प्रभाव के दूध बढ़ाता है।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 340.0, "original_price": 450.0, "discount_percentage": 24.0, "rating": 4.7, "reviews_count": 115,
        "badge": "आयुर्वेदिक", "brand": "Himalaya HimCal", "weight": "1kg", "unit": "pack", "sku": "CAT-HERB-1KG"
    },
    {
        "name": "पशु चिचड़ी व जूँ नाशक स्प्रे (Anti-Tick & Flea Spray 100ml)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "गाय, भैंस, बकरी के शरीर से किलनी, चिचड़ी, जूँ और पिस्सू को 24 घंटे में पूरी तरह खत्म करे।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 190.0, "original_price": 250.0, "discount_percentage": 24.0, "rating": 4.9, "reviews_count": 180,
        "badge": "चिचड़ी नाशक", "brand": "Butox Vet", "weight": "100ml", "unit": "bottle", "sku": "CAT-TICK-100"
    },
    {
        "name": "सुपर नेपियर हरा चारा कलम (Super Napier Grass Stems 100 Pcs)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "एक बार लगाएं और 5 साल तक साल भर लगातार भरपूर पौष्टिक हरा चारा पाएं। 18% प्रोटीन।",
        "image_url": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&auto=format&fit=crop&q=80",
        "price": 490.0, "original_price": 650.0, "discount_percentage": 25.0, "rating": 4.8, "reviews_count": 92,
        "badge": "5 साल हरा चारा", "brand": "Kisan Fodder", "weight": "3kg", "unit": "bundle", "sku": "CAT-NAPIER-100"
    },
    {
        "name": "मैनुअल वैक्यूम मिल्किंग मशीन (Hand Milking Machine for Cows)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "थनों को बिना दर्द दिए 5 मिनट में पूरी सफाई के साथ गाय-भैंस का दूध निकालने वाली हाथ की मशीन।",
        "image_url": "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=600&auto=format&fit=crop&q=80",
        "price": 2850.0, "original_price": 3600.0, "discount_percentage": 21.0, "rating": 4.7, "reviews_count": 74,
        "badge": "थनों की सुरक्षा", "brand": "DairyTech", "weight": "4.2kg", "unit": "unit", "sku": "CAT-MILK-MAN"
    },
    {
        "name": "पशु लिवर टॉनिक लीव-52 वेट (Himalaya Liv.52 Vet 1L)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "पशुओं की भूख बढ़ाने, पाचन सुधारने और बीमारी के बाद त्वरित कमजोरी दूर करने वाला टॉनिक।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 310.0, "original_price": 390.0, "discount_percentage": 21.0, "rating": 4.9, "reviews_count": 210,
        "badge": "भूख बढ़ाए", "brand": "Himalaya Drug", "weight": "1L", "unit": "bottle", "sku": "CAT-LIV52-1L"
    },
    {
        "name": "थनैला रोग रोकथाम किट (Mastitis Care & Prevention Kit)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "दूध में खून, छिछड़े व थन की सूजन आने पर तुरंत आराम देने वाला एंटी-बायोटिक फ्री वेट किट।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 420.0, "original_price": 550.0, "discount_percentage": 24.0, "rating": 4.8, "reviews_count": 98,
        "badge": "थनैला रक्षक", "brand": "MastiCare", "weight": "500g", "unit": "kit", "sku": "CAT-MASTITIS-KIT"
    },
    {
        "name": "शुद्ध सेंधा नमक साबुत पशु डली (Rock Salt Lick Blocks 5kg)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "पशुओं के चरनी में बांधने वाला प्राकृतिक सेंधा नमक। पाचन सही रखे व पानी पीने की इच्छा बढ़ाए।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 140.0, "original_price": 190.0, "discount_percentage": 26.0, "rating": 4.7, "reviews_count": 130,
        "badge": "प्राकृतिक नमक", "brand": "Kisan Pure", "weight": "5kg", "unit": "block", "sku": "CAT-SALT-5KG"
    },
    {
        "name": "पशु खुर खुरपका-मुंहपका स्प्रे (FMD Antiseptic Spray 200ml)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "खुरों व मुंह के छालों पर मक्खियां बैठने से रोकने व घाव को 3 दिन में सुखाने वाला हर्बल स्प्रे।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 160.0, "original_price": 210.0, "discount_percentage": 24.0, "rating": 4.8, "reviews_count": 145,
        "badge": "घाव सुखाए", "brand": "Topicure Vet", "weight": "200ml", "unit": "can", "sku": "CAT-FMD-SPRAY"
    },
    {
        "name": "बकरी व भेड़ स्पेशल मिनरल ब्लॉक (Goat Mineral Lick 2kg)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "बकरियों में वजन तेजी से बढ़ाने और बच्चों की रोग प्रतिरोधक क्षमता बढ़ाने वाला ब्लॉक।",
        "image_url": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80",
        "price": 190.0, "original_price": 250.0, "discount_percentage": 24.0, "rating": 4.7, "reviews_count": 68,
        "badge": "बकरी विशेष", "brand": "GoatGrow", "weight": "2kg", "unit": "block", "sku": "CAT-GOAT-MIN"
    },
    {
        "name": "इलेक्ट्रिक चारा कुट्टी मशीन मोटर (Chaff Cutter 3HP Motor)",
        "category": "cattle-care", "subcategory": "cattle",
        "description": "कुट्टी कटर को बिजली से चलाने वाली भारी तांबा वाइंडिंग 3 हॉर्सपावर सिंगल फेज मोटर।",
        "image_url": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
        "price": 6800.0, "original_price": 8200.0, "discount_percentage": 17.0, "rating": 4.8, "reviews_count": 54,
        "badge": "कॉपर वाइंडिंग", "brand": "Kirloskar Agri", "weight": "22kg", "unit": "unit", "sku": "CAT-MOTOR-3HP"
    },

    # === 8. ORGANIC & BIO-INPUTS (16 items) ===
    {
        "name": "100% शुद्ध केंचुआ खाद वर्मीकम्पोस्ट (Organic Vermicompost 25kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "आइसिनिया फेटिडा केंचुओं द्वारा तैयार पोषक तत्वों से भरपूर गोबर खाद। मिट्टी में केंचुए बढ़ाए।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 450.0, "original_price": 600.0, "discount_percentage": 25.0, "rating": 4.9, "reviews_count": 310,
        "badge": "100% शुद्ध केंचुआ खाद", "brand": "Krishi Bio", "weight": "25kg", "unit": "bag", "sku": "BIO-VERMI-25K"
    },
    {
        "name": "शुद्ध नीम खली पाउडर (Pure Neem Cake Fertilizer 20kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "दीमक व जड़ की गांठ (नेमाटोड) को रोकने वाली और यूरिया की क्षमता दुगनी करने वाली नीम खली।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 680.0, "original_price": 850.0, "discount_percentage": 20.0, "rating": 4.8, "reviews_count": 180,
        "badge": "नेमाटोड नाशक", "brand": "BioShakti", "weight": "20kg", "unit": "bag", "sku": "BIO-NEEM-CAKE"
    },
    {
        "name": "वेस्ट डीकंपोजर मूल कल्चर (ICAR National Waste Decomposer 50g)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "गाजियाबाद जैविक केंद्र द्वारा विकसित। पराली, गोबर व कचरे को 30 दिन में उत्तम खाद बनाए।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 80.0, "original_price": 120.0, "discount_percentage": 33.0, "rating": 4.9, "reviews_count": 420,
        "badge": "पराली खाद बनाए", "brand": "NCOF Ghaziabad", "weight": "50g", "unit": "bottle", "sku": "BIO-WDC-50G"
    },
    {
        "name": "जैव पोटाश बैक्टीरिया कल्चर (Potash Mobilizing Bacteria 1L)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "मिट्टी में जमे अघुलनशील पोटाश को घोलकर पौधों को तुरंत उपलब्ध कराने वाला जीवित बैक्टीरिया।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 320.0, "original_price": 420.0, "discount_percentage": 24.0, "rating": 4.7, "reviews_count": 95,
        "badge": "पोटाश घुलक", "brand": "IFFCO Bio", "weight": "1L", "unit": "bottle", "sku": "BIO-KMB-1L"
    },
    {
        "name": "फास्फोरस सोलुबिलाइजिंग बैक्टीरिया पीएसबी (PSB Bio-Fertilizer 1L)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "डीएपी की आवश्यकता 25% कम करने वाला जीवित कल्चर। जमीन में फंसा फास्फोरस पौधों को दिलाए।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 290.0, "original_price": 380.0, "discount_percentage": 24.0, "rating": 4.8, "reviews_count": 130,
        "badge": "डीएपी बचाए", "brand": "IFFCO Bio", "weight": "1L", "unit": "bottle", "sku": "BIO-PSB-1L"
    },
    {
        "name": "राइजोबियम कल्चर दालों के लिए (Rhizobium Bio-Inoculant 500g)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "चना, मटर, मूंग व उड़द की जड़ों में नाइट्रोजन की गांठे बनाकर मुफ्त यूरिया बनाने वाला टीका।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 140.0, "original_price": 190.0, "discount_percentage": 26.0, "rating": 4.8, "reviews_count": 110,
        "badge": "दालों का टीका", "brand": "Krishi Bio", "weight": "500g", "unit": "pack", "sku": "BIO-RHIZO-500"
    },
    {
        "name": "एजोटोबैक्टर गेहूं व धान हेतु (Azotobacter Nitrogen Fixer 1L)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "हवा से नाइट्रोजन खींचकर पौधों को देने वाला बायो-फर्टिलाइजर। प्रति एकड़ 20kg यूरिया की बचत।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 310.0, "original_price": 400.0, "discount_percentage": 22.0, "rating": 4.7, "reviews_count": 92,
        "badge": "यूरिया की बचत", "brand": "Krishi Bio", "weight": "1L", "unit": "bottle", "sku": "BIO-AZOTO-1L"
    },
    {
        "name": "माइकोराइजा वाम बायो-रूट प्रमोटर (Mycorrhiza VAM Granules 4kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "जड़ों की लंबाई 100 गुना बढ़ाने वाला कवक जाल। पानी व पोषक तत्वों का गहरा अवशोषण।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 480.0, "original_price": 600.0, "discount_percentage": 20.0, "rating": 4.9, "reviews_count": 165,
        "badge": "जड़ों का जाल", "brand": "RhizoVAM", "weight": "4kg", "unit": "bucket", "sku": "BIO-VAM-4KG"
    },
    {
        "name": "बीवेरिया बेसियाना जैविक सुंडी नाशक (Beauveria Bassiana 1kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "सुंडियों, मक्खियों व तना छेदक कीटों के शरीर पर सफेद फफूंद उगाकर उन्हें प्राकृतिक रूप से मारने वाला बायो एजेंट।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 360.0, "discount_percentage": 22.0, "rating": 4.7, "reviews_count": 88,
        "badge": "मित्र कवक", "brand": "Krishi Bio", "weight": "1kg", "unit": "pack", "sku": "BIO-BEAUVERIA"
    },
    {
        "name": "वर्टिसिलियम लेकानी सफेद मक्खी नाशक (Verticillium Lecanii 1kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "कपास व मिर्च में सफेद मक्खी, थ्रिप्स व एफिड्स का सुरक्षित जैविक नियंत्रण।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 290.0, "original_price": 380.0, "discount_percentage": 24.0, "rating": 4.8, "reviews_count": 76,
        "badge": "जैविक रक्षक", "brand": "BioShield", "weight": "1kg", "unit": "pack", "sku": "BIO-VERTICILL"
    },
    {
        "name": "जैविक सरसों खली बारीक पिसी (Mustard Cake Organic Fertilizer 10kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "सब्जियों व फलों के लिए पारंपरिक नाइट्रोजन, फास्फोरस व पोटाश युक्त सरसों की खली।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 390.0, "original_price": 490.0, "discount_percentage": 20.0, "rating": 4.8, "reviews_count": 140,
        "badge": "देसी ताकत", "brand": "Shuddh Kisan", "weight": "10kg", "unit": "bag", "sku": "BIO-MUSTARD-10K"
    },
    {
        "name": "अमीनो एसिड + सीवीड प्लांट बूस्टर (Amino Acid Crop Tonic 1L)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "फसल का तनाव दूर करने, फूलों की बहार लाने और पीलापन हटाकर बंपर पैदावार देने वाला टॉनिक।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 450.0, "original_price": 580.0, "discount_percentage": 22.0, "rating": 4.9, "reviews_count": 190,
        "badge": "फूलों की बहार", "brand": "AgroGrow Bio", "weight": "1L", "unit": "bottle", "sku": "BIO-AMINO-1L"
    },
    {
        "name": "बायो एनपीके लिक्विड कंसोर्टियम (Consortium Bio-NPK 1L)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "नाइट्रोजन, फास्फोरस व पोटाश तीनों बैक्टीरिया का एक साथ शक्तिशाली मिश्रण। ड्रिप व स्प्रे में।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 380.0, "original_price": 480.0, "discount_percentage": 21.0, "rating": 4.8, "reviews_count": 125,
        "badge": "3-इन-1 बैक्टीरिया", "brand": "IFFCO Bio", "weight": "1L", "unit": "bottle", "sku": "BIO-CONSOR-1L"
    },
    {
        "name": "जिप्सम कृषि ग्रेड दानेदार (Agricultural Gypsum 50kg Bag)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "खारी (कल्लड़) मिट्टी सुधारने, कठोर मिट्टी को पोला करने और मूंगफली में दाना भरने वाला कैल्शियम व सल्फर।",
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
        "price": 280.0, "original_price": 350.0, "discount_percentage": 20.0, "rating": 4.7, "reviews_count": 88,
        "badge": "कल्लड़ सुधारक", "brand": "RSMM Gypsum", "weight": "50kg", "unit": "bag", "sku": "BIO-GYPSUM-50K"
    },
    {
        "name": "पंचगव्य प्राकृतिक फसल संजीवनी (Panchagavya Organic Tonic 1L)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "देसी गाय के गोबर, गोमूत्र, दूध, दही व घी से विधिपूर्वक निर्मित संपूर्ण फसल संजीवनी।",
        "image_url": "https://images.unsplash.com/photo-1584990347441-8c0a8c802f2c?w=600&auto=format&fit=crop&q=80",
        "price": 260.0, "original_price": 340.0, "discount_percentage": 23.0, "rating": 4.8, "reviews_count": 110,
        "badge": "देसी गाय उत्पाद", "brand": "GauKrupa", "weight": "1L", "unit": "bottle", "sku": "BIO-PANCHAGAVYA"
    },
    {
        "name": "बायो-चार मृदा कार्बन सुधारक (Biochar Soil Carbon Booster 10kg)",
        "category": "organic-bio", "subcategory": "organic",
        "description": "मिट्टी में जैविक कार्बन (Organic Carbon) बढ़ाने और पानी सोखने की क्षमता 3 गुना करने वाला बायो-चार।",
        "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
        "price": 540.0, "original_price": 680.0, "discount_percentage": 21.0, "rating": 4.7, "reviews_count": 65,
        "badge": "जैविक कार्बन", "brand": "GreenChar", "weight": "10kg", "unit": "bag", "sku": "BIO-BIOCHAR-10K"
    }
]

def seed_database():
    db = SessionLocal()
    try:
        # Clear existing categories & products for a clean, non-fake state
        db.query(FertilizerRecommendation).delete()
        db.query(StoreProduct).delete()
        db.query(ProductCategory).delete()
        db.commit()

        # Insert 8 Categories
        for cat in CATEGORIES:
            c = ProductCategory(
                name=cat["name"],
                display_name=cat["display_name"],
                icon=cat["icon"],
                image=cat["image"],
                description=cat["description"],
                sort_order=cat["sort_order"],
                is_active=True
            )
            db.add(c)
        db.commit()

        # Insert 104 Real Products
        for prod in PRODUCTS_DATA:
            p = StoreProduct(
                name=prod["name"],
                category=prod["category"],
                subcategory=prod.get("subcategory"),
                description=prod["description"],
                image_url=prod["image_url"],
                price=prod["price"],
                original_price=prod["original_price"],
                discount_percentage=prod.get("discount_percentage", 0),
                rating=prod.get("rating", 4.7),
                reviews_count=prod.get("reviews_count", 50),
                in_stock=True,
                badge=prod.get("badge"),
                brand=prod.get("brand", "Krishi AI"),
                weight=prod.get("weight"),
                unit=prod.get("unit"),
                sku=prod.get("sku"),
                product_url=f"product.html?id={prod.get('sku')}"
            )
            db.add(p)
        db.commit()

        total_cats = db.query(ProductCategory).count()
        total_prods = db.query(StoreProduct).count()
        print(f"SUCCESS: Seeded {total_cats} categories and {total_prods} authentic products into SQLite!")

    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
