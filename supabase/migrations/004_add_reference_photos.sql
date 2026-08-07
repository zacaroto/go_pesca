-- Add reference photo URLs using verified FishBase thumbnail images
-- All URLs confirmed working (HTTP 200) from fishbase.se

UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Padov_u5.jpg' WHERE scientific_name = 'Parachromis dovii';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Brgua_f3.jpg' WHERE scientific_name = 'Brycon guatemalensis';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Ceund_u1.jpg' WHERE scientific_name = 'Centropomus undecimalis';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Meatl_u8.jpg' WHERE scientific_name = 'Megalops atlanticus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Lucam_u2.jpg' WHERE scientific_name = 'Lutjanus campechanus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Lugut_j0.jpg' WHERE scientific_name = 'Lutjanus guttatus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Cohip_ud.jpg' WHERE scientific_name = 'Coryphaena hippurus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Manig_f0.jpg' WHERE scientific_name = 'Makaira nigricans';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Teaud_u3.jpg' WHERE scientific_name = 'Kajikia audax';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Ispla_ub.jpg' WHERE scientific_name = 'Istiophorus platypterus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Acsol_ua.jpg' WHERE scientific_name = 'Acanthocybium solandri';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Thalb_u0.jpg' WHERE scientific_name = 'Thunnus albacares';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Cysqu_u0.jpg' WHERE scientific_name = 'Cynoscion squamipinnis';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Cahip_u0.jpg' WHERE scientific_name = 'Caranx hippos';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Trfal_u5.jpg' WHERE scientific_name = 'Trachinotus falcatus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Lucya_u5.jpg' WHERE scientific_name = 'Lutjanus cyanopterus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Scmac_u1.jpg' WHERE scientific_name = 'Scomberomorus maculatus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Spbar_ud.jpg' WHERE scientific_name = 'Sphyraena barracuda';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Epqui_u0.jpg' WHERE scientific_name = 'Epinephelus quinquefasciatus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Caleu_u1.jpg' WHERE scientific_name = 'Carcharhinus leucas';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Gecin_u1.jpg' WHERE scientific_name = 'Gerres cinereus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Jopic_u3.jpg' WHERE scientific_name = 'Joturus pichardi';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Ornil_u6.jpg' WHERE scientific_name = 'Oreochromis niloticus';
-- Rhamdia guatemalensis has no photograph on FishBase; family illustration used as fallback
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/gif/tn_HEPTAPT0.gif' WHERE scientific_name = 'Rhamdia guatemalensis';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Agmon_f2.jpg' WHERE scientific_name = 'Agonostomus monticola';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Mauro_m0.jpg' WHERE scientific_name = 'Mayaheros urophthalmus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Attro_u1.jpg' WHERE scientific_name = 'Atractosteus tropicus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Haplu_u4.jpg' WHERE scientific_name = 'Haemulon plumierii';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Nepec_u2.jpg' WHERE scientific_name = 'Nematistius pectoralis';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Mucep_u4.jpg' WHERE scientific_name = 'Mugil cephalus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Stnot_u2.jpg' WHERE scientific_name = 'Strongylura notata';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Cacry_u6.jpg' WHERE scientific_name = 'Caranx crysos';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Xigla_u5.jpg' WHERE scientific_name = 'Xiphias gladius';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Racan_u9.jpg' WHERE scientific_name = 'Rachycentron canadum';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Trcar_u0.jpg' WHERE scientific_name = 'Trachinotus carolinus';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Eplab_u1.jpg' WHERE scientific_name = 'Epinephelus labriformis';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Daame_u0.jpg' WHERE scientific_name = 'Dasyatis americana';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Saaur_u4.jpg' WHERE scientific_name = 'Sardinella aurita';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Onmyk_ue.jpg' WHERE scientific_name = 'Oncorhynchus mykiss';
UPDATE species SET reference_photo_url = 'https://www.fishbase.se/images/thumbnails/jpg/tn_Pogil_u0.jpg' WHERE scientific_name = 'Poecilia gillii';
