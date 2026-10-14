/**
 * Age of Kingdoms - Rise of Kingdoms Tarzı Pixel Art Mobil Strateji Oyunu
 * Birim Eğitim Sistemi, Akademi Araştırma Kilitleri ve Envanter Yönetimi
 */

(function () {
  'use strict';

  // --- 1. SES MOTORU (Web Audio API) ---
  const Sound = {
    ctx: null,
    muted: false,
    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('AudioContext baslatilamadi', e);
      }
    },
    play(type) {
      if (this.muted) return;
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'whoosh') {
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        whiteNoise.connect(filter);
        filter.connect(gain);
        whiteNoise.start(now);
      } else if (type === 'build') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'complete') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.gain.setValueAtTime(0.25, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.2);
        });
      } else if (type === 'collect' || type === 'potion') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'march') {
        const notes = [440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(freq, now + idx * 0.1);
          g.gain.setValueAtTime(0.2, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.22);
          o.start(now + idx * 0.1);
          o.stop(now + idx * 0.1 + 0.22);
        });
      }
    }
  };

  // --- 2. BİRİM KATALOĞU (T1 ve T2 KADEMELERİ) ---
  const UNITS = {
    infantry_t1: {
      id: "infantry_t1",
      name: "Piyade",
      tier: "T1",
      buildingType: "barracks",
      icon: "🗡️",
      power: 1.0,
      costPerUnit: { food: 4, wood: 2, stone: 0, gold: 1 },
      timePerUnit: 0.3,
      reqTech: null,
      desc: "Temel piyade birliği. Hızlı eğitilir, sur savunmasında dayanıklıdır."
    },
    infantry_t2: {
      id: "infantry_t2",
      name: "Ağır Muhafız",
      tier: "T2",
      buildingType: "barracks",
      icon: "🛡️",
      power: 2.5,
      costPerUnit: { food: 8, wood: 4, stone: 2, gold: 2 },
      timePerUnit: 0.5,
      reqTech: "iron_shield",
      desc: "Kalkan duvarı kurabilen seçkin ağır piyade. Akademi Kalkan Duvarı araştırması gerektirir."
    },
    archer_t1: {
      id: "archer_t1",
      name: "Okçu",
      tier: "T1",
      buildingType: "tower_archer",
      icon: "🏹",
      power: 1.0,
      costPerUnit: { food: 2, wood: 6, stone: 0, gold: 1 },
      timePerUnit: 0.3,
      reqTech: null,
      desc: "Yaylı menzilli birlik. Savunma kulelerinden düşmanı uzaktan vurur."
    },
    archer_t2: {
      id: "archer_t2",
      name: "Kıdemli Okçu",
      tier: "T2",
      buildingType: "tower_archer",
      icon: "🎯",
      power: 2.6,
      costPerUnit: { food: 4, wood: 10, stone: 1, gold: 3 },
      timePerUnit: 0.55,
      reqTech: "composite_bow",
      desc: "Kompozit yay kullanan keskin nişancı. Zırh delici oklarla yüksek hasar verir."
    },
    cavalry_t1: {
      id: "cavalry_t1",
      name: "Hafif Süvari",
      tier: "T1",
      buildingType: "training_yard",
      icon: "🐎",
      power: 1.5,
      costPerUnit: { food: 6, wood: 3, stone: 0, gold: 2 },
      timePerUnit: 0.4,
      reqTech: null,
      desc: "Çevik atlı süvari. Dünya haritasında yüksek hızla ilerler ve baskın yapar."
    },
    cavalry_t2: {
      id: "cavalry_t2",
      name: "Ağır Şövalye",
      tier: "T2",
      buildingType: "training_yard",
      icon: "🏇",
      power: 3.5,
      costPerUnit: { food: 12, wood: 6, stone: 3, gold: 5 },
      timePerUnit: 0.75,
      reqTech: "barded_horse",
      desc: "Zırhlı savaş atına binen elit şövalyeler. Yıkıcı taarruz gücüne sahiptir."
    }
  };

  // --- 3. AKADEMİ TEKNOLOJİLERİ ---
  const TECHS = [
    {
      id: "axes",
      name: "Keskin Baltalar",
      icon: "🪓",
      category: "eco",
      desc: "Odun üretim ve toplama hızını +%20 artırır.",
      reqAcademyLevel: 1,
      cost: { wood: 400, gold: 200, food: 100, stone: 0 },
      time: 20
    },
    {
      id: "plow",
      name: "Ağır Saban",
      icon: "🌾",
      category: "eco",
      desc: "Çiftlik yiyecek üretim verimini +%20 artırır.",
      reqAcademyLevel: 1,
      cost: { wood: 200, gold: 200, food: 400, stone: 0 },
      time: 20
    },
    {
      id: "masonry",
      name: "Taş İşçiliği",
      icon: "🧱",
      category: "eco",
      desc: "Taş ocağı üretim hızını +%20 artırır.",
      reqAcademyLevel: 1,
      cost: { wood: 200, gold: 200, food: 0, stone: 400 },
      time: 20
    },
    {
      id: "iron_shield",
      name: "Kalkan Duvarı & Ağır Muhafız",
      icon: "🛡️",
      category: "military",
      desc: "Kışlada Seviye 2 (T2) Ağır Muhafız eğitiminin kilidini açar.",
      reqAcademyLevel: 2,
      cost: { wood: 600, gold: 400, food: 500, stone: 400 },
      time: 35
    },
    {
      id: "composite_bow",
      name: "Kompozit Yaylar & Kıdemli Okçu",
      icon: "🏹",
      category: "military",
      desc: "Okçu Kulesinde Seviye 2 (T2) Kıdemli Okçu eğitiminin kilidini açar.",
      reqAcademyLevel: 2,
      cost: { wood: 800, gold: 400, food: 300, stone: 300 },
      time: 35
    },
    {
      id: "barded_horse",
      name: "Savaş Atı Zırhı & Ağır Şövalye",
      icon: "🐎",
      category: "military",
      desc: "Talim Alanında Seviye 2 (T2) Ağır Şövalye eğitiminin kilidini açar.",
      reqAcademyLevel: 3,
      cost: { wood: 1000, gold: 600, food: 800, stone: 600 },
      time: 50
    }
  ];

  // --- 4. ENVANTER EŞYA KATALOĞU ---
  const ITEMS = {
    speedup_1m: {
      id: "speedup_1m",
      title: "1 Dk Hızlandırıcı",
      icon: "⚡",
      rarity: "common",
      desc: "Devam eden herhangi bir inşaat, araştırma veya birlik eğitim süresini 1 dakika kısaltır.",
      type: "speedup",
      seconds: 60
    },
    speedup_5m: {
      id: "speedup_5m",
      title: "5 Dk Hızlandırıcı",
      icon: "⏳",
      rarity: "rare",
      desc: "İnşaat, araştırma veya birlik eğitim süresini 5 dakika kısaltır.",
      type: "speedup",
      seconds: 300
    },
    speedup_15m: {
      id: "speedup_15m",
      title: "15 Dk Hızlandırıcı",
      icon: "⌛",
      rarity: "epic",
      desc: "Büyük projelerin süresini anında 15 dakika kısaltır.",
      type: "speedup",
      seconds: 900
    },
    xp_small: {
      id: "xp_small",
      title: "Küçük TP İksiri",
      icon: "🧪",
      rarity: "common",
      desc: "Hükümdarınıza +500 Deneyim Puanı (XP) kazandırır.",
      type: "xp",
      amount: 500
    },
    xp_large: {
      id: "xp_large",
      title: "Büyük TP İksiri",
      icon: "⚗️",
      rarity: "rare",
      desc: "Hükümdarınıza +2.000 Deneyim Puanı (XP) kazandırır. Hızlı seviye atlatır.",
      type: "xp",
      amount: 2000
    },
    pack_wood: {
      id: "pack_wood",
      title: "Kereste Paketi",
      icon: "🪵",
      rarity: "common",
      desc: "Hazineye +3.000 Odun ekler.",
      type: "resource",
      res: { wood: 3000 }
    },
    pack_food: {
      id: "pack_food",
      title: "Erzak Sandığı",
      icon: "🌾",
      rarity: "common",
      desc: "Hazineye +3.000 Yiyecek ekler.",
      type: "resource",
      res: { food: 3000 }
    },
    pack_stone: {
      id: "pack_stone",
      title: "Taş Stoğu",
      icon: "🪨",
      rarity: "common",
      desc: "Hazineye +3.000 Taş ekler.",
      type: "resource",
      res: { stone: 3000 }
    },
    pack_royal: {
      id: "pack_royal",
      title: "Kraliyet Hazinesi",
      icon: "👑",
      rarity: "legend",
      desc: "Her kaynaktan +5.000 (Odun, Yiyecek, Taş, Altın) kazandırır.",
      type: "resource",
      res: { wood: 5000, food: 5000, stone: 5000, gold: 5000 }
    }
  };

  // --- 5. BİNA VE SLOT VERİLERİ ---
  const BUILDINGS = {
    castle: { label: "Ana Kale", category: "keep", footprint: [6, 5], max_count: 1, allowed_zones: ["z_keep"], sprite: "castle_detailed.png", unlock: 1, desc: "Krallığın yönetim merkezi. Kale seviyesi diğer tüm yapı ve araştırmaların kilidini açar." },
    tower_archer: { label: "Okçu Kulesi", category: "military", footprint: [2, 2], max_count: 4, allowed_zones: ["z_keep", "z_military"], sprite: "tower_archer.png", unlock: 1, desc: "Okçu birliklerini barındırır ve eğitir." },
    barracks: { label: "Kışla", category: "military", footprint: [4, 3], max_count: 3, allowed_zones: ["z_military"], sprite: "barracks.png", unlock: 1, desc: "Piyade ve Ağır Muhafız birliklerini eğitir." },
    academy: { label: "Akademi", category: "military", footprint: [4, 3], max_count: 1, allowed_zones: ["z_military"], sprite: "academy25.png", unlock: 2, desc: "Ekonomi ve askeri teknolojileri araştırır." },
    smithy: { label: "Silah Deposu", category: "military", footprint: [3, 3], max_count: 1, allowed_zones: ["z_military"], sprite: "smithy.png", unlock: 1, desc: "Ordunun silah ve zırhlarını döver, ordu gücünü artırır." },
    training_yard: { label: "Talim Alanı", category: "military", footprint: [4, 3], max_count: 2, allowed_zones: ["z_military"], sprite: "training_yard.png", unlock: 1, desc: "Süvarileri ve Şövalyeleri sefere hazırlar." },
    watch_post: { label: "Nöbet Noktası", category: "military", footprint: [1, 1], max_count: 4, allowed_zones: ["z_military"], sprite: "watch_post.png", unlock: 1, desc: "Askeri bölgenin sınır gözetleme mevkii." },
    house: { label: "Ev", category: "civil", footprint: [2, 2], max_count: 6, allowed_zones: ["z_civil"], sprite: "house.png", unlock: 1, desc: "Halkın barınmasını sağlar, vergi ve altın geliri üretir." },
    healer: { label: "Şifahane", category: "civil", footprint: [2, 2], max_count: 1, allowed_zones: ["z_civil"], sprite: "healer.png", unlock: 2, desc: "Yaralı askerleri tedavi eder ve şehir sağlığını korur." },
    market: { label: "Pazar", category: "civil", footprint: [4, 3], max_count: 1, allowed_zones: ["z_civil"], sprite: "market.png", unlock: 1, desc: "Tüccarları ağırlar, kaynak takası ve altın ticareti sağlar." },
    bath: { label: "Hamam", category: "civil", footprint: [3, 3], max_count: 1, allowed_zones: ["z_civil"], sprite: "bath.png", unlock: 3, desc: "Halkın mutluluğunu ve iş gücü verimini artırır." },
    temple: { label: "Mabet", category: "civil", footprint: [3, 3], max_count: 1, allowed_zones: ["z_civil"], sprite: "temple.png", unlock: 3, desc: "Manevi güç ve krallık bereket bonusu sunar." },
    storehouse: { label: "Depo", category: "resource", footprint: [3, 3], max_count: 2, allowed_zones: ["z_forest", "z_mine"], sprite: "storehouse.png", unlock: 1, desc: "Kaynaklarınızı korur ve saklama kapasitesini artırır." },
    woodcutter: { label: "Oduncu", category: "resource", footprint: [2, 2], max_count: 3, allowed_zones: ["z_forest"], sprite: "woodcutter.png", unlock: 1, desc: "Ormandan düzenli kereste ve odun toplar." },
    quarry: { label: "Taş Ocağı", category: "resource", footprint: [2, 2], max_count: 3, allowed_zones: ["z_mine"], sprite: "quarry.png", unlock: 1, desc: "Maden dağlarından sağlam inşaat taşı çıkarır." },
    farm: { label: "Çiftlik", category: "resource", footprint: [3, 3], max_count: 4, allowed_zones: ["z_field"], sprite: "farm.png", unlock: 1, desc: "Krallığın halkı ve ordusu için tahıl ve yiyecek üretir." }
  };

  const SLOTS = [
    { id: "castle_main", building: "castle", zone: "z_keep", x: 19, y: 12, w: 6, h: 5 },
    { id: "tower_keep_1", building: "tower_archer", zone: "z_keep", x: 16, y: 9, w: 2, h: 2 },
    { id: "tower_keep_2", building: "tower_archer", zone: "z_keep", x: 23, y: 9, w: 2, h: 2 },

    { id: "barracks_1", building: "barracks", zone: "z_military", x: 3, y: 3, w: 4, h: 3 },
    { id: "barracks_2", building: "barracks", zone: "z_military", x: 3, y: 7, w: 4, h: 3 },
    { id: "barracks_3", building: "barracks", zone: "z_military", x: 8, y: 3, w: 4, h: 3 },
    { id: "academy_1", building: "academy", zone: "z_military", x: 8, y: 7, w: 4, h: 3 },
    { id: "armory_1", building: "smithy", zone: "z_military", x: 13, y: 4, w: 3, h: 3 },
    { id: "training_1", building: "training_yard", zone: "z_military", x: 4, y: 11, w: 4, h: 3 },
    { id: "training_2", building: "training_yard", zone: "z_military", x: 9, y: 11, w: 4, h: 3 },
    { id: "watch_ne", building: "watch_post", zone: "z_military", x: 15, y: 2, w: 1, h: 1 },
    { id: "watch_w", building: "watch_post", zone: "z_military", x: 2, y: 11, w: 1, h: 1 },
    { id: "watch_se", building: "watch_post", zone: "z_military", x: 15, y: 13, w: 1, h: 1 },
    { id: "watch_sw", building: "watch_post", zone: "z_military", x: 2, y: 13, w: 1, h: 1 },

    { id: "house_1", building: "house", zone: "z_civil", x: 28, y: 3, w: 2, h: 2 },
    { id: "house_2", building: "house", zone: "z_civil", x: 31, y: 3, w: 2, h: 2 },
    { id: "house_3", building: "house", zone: "z_civil", x: 34, y: 3, w: 2, h: 2 },
    { id: "house_4", building: "house", zone: "z_civil", x: 28, y: 7, w: 2, h: 2 },
    { id: "house_5", building: "house", zone: "z_civil", x: 31, y: 7, w: 2, h: 2 },
    { id: "house_6", building: "house", zone: "z_civil", x: 34, y: 7, w: 2, h: 2 },
    { id: "healer_1", building: "healer", zone: "z_civil", x: 37, y: 3, w: 2, h: 2 },
    { id: "market_1", building: "market", zone: "z_civil", x: 27, y: 10, w: 4, h: 3 },
    { id: "bath_1", building: "bath", zone: "z_civil", x: 32, y: 10, w: 3, h: 3 },
    { id: "temple_1", building: "temple", zone: "z_civil", x: 36, y: 10, w: 3, h: 3 },

    { id: "quarry_1", building: "quarry", zone: "z_mine", x: 3, y: 23, w: 2, h: 2 },
    { id: "quarry_2", building: "quarry", zone: "z_mine", x: 6, y: 23, w: 2, h: 2 },
    { id: "quarry_3", building: "quarry", zone: "z_mine", x: 12, y: 25, w: 2, h: 2 },

    { id: "woodcutter_1", building: "woodcutter", zone: "z_forest", x: 27, y: 21, w: 2, h: 2 },
    { id: "woodcutter_2", building: "woodcutter", zone: "z_forest", x: 31, y: 21, w: 2, h: 2 },
    { id: "woodcutter_3", building: "woodcutter", zone: "z_forest", x: 36, y: 24, w: 2, h: 2 },
    { id: "storehouse_1", building: "storehouse", zone: "z_forest", x: 29, y: 24, w: 3, h: 3 },

    { id: "farm_1", building: "farm", zone: "z_field", x: 16, y: 22, w: 3, h: 3 },
    { id: "farm_2", building: "farm", zone: "z_field", x: 20, y: 22, w: 3, h: 3 },
    { id: "farm_3", building: "farm", zone: "z_field", x: 16, y: 26, w: 3, h: 3 },
    { id: "farm_4", building: "farm", zone: "z_field", x: 20, y: 26, w: 3, h: 3 }
  ];

  const BASE_COSTS = {
    castle: { wood: 1000, stone: 800, food: 600, gold: 500, time: 25 },
    barracks: { wood: 300, stone: 200, food: 100, gold: 150, time: 15 },
    academy: { wood: 500, stone: 400, food: 200, gold: 300, time: 25 },
    smithy: { wood: 250, stone: 200, food: 100, gold: 100, time: 15 },
    training_yard: { wood: 180, stone: 120, food: 100, gold: 80, time: 12 },
    watch_post: { wood: 80, stone: 60, food: 20, gold: 30, time: 6 },
    tower_archer: { wood: 220, stone: 260, food: 80, gold: 120, time: 15 },
    house: { wood: 100, stone: 40, food: 50, gold: 0, time: 8 },
    healer: { wood: 200, stone: 100, food: 150, gold: 150, time: 15 },
    market: { wood: 260, stone: 120, food: 100, gold: 200, time: 18 },
    bath: { wood: 400, stone: 300, food: 200, gold: 250, time: 25 },
    temple: { wood: 450, stone: 400, food: 250, gold: 350, time: 30 },
    storehouse: { wood: 150, stone: 100, food: 50, gold: 50, time: 10 },
    woodcutter: { wood: 60, stone: 30, food: 30, gold: 0, time: 6 },
    quarry: { wood: 60, stone: 30, food: 30, gold: 0, time: 6 },
    farm: { wood: 80, stone: 20, food: 0, gold: 0, time: 6 }
  };

  const ZONES = {
    z_keep: { x: 19 * 25, y: 12 * 25 },
    z_military: { x: 7 * 25, y: 7 * 25 },
    z_civil: { x: 31 * 25, y: 6 * 25 },
    z_mine: { x: 7 * 25, y: 24 * 25 },
    z_forest: { x: 31 * 25, y: 23 * 25 },
    z_field: { x: 18 * 25, y: 24 * 25 }
  };

  // --- 6. MERKEZİ OYUN DURUMU (Kayıt Sistemi) ---
  const DEFAULT_STATE = {
    castle_level: 1,
    player_level: 1,
    player_xp: 0,
    resources: { wood: 12450, food: 8320, stone: 6710, gold: 2140 },
    built: {
      castle_main: 1,
      tower_keep_1: 1,
      barracks_1: 1,
      house_1: 1,
      house_2: 1,
      house_3: 1,
      quarry_1: 1,
      farm_1: 1,
      woodcutter_1: 1
    },
    active_builds: {}, // { [slotId]: { targetLevel, startTime, duration } }
    troops: {
      infantry_t1: 150,
      infantry_t2: 0,
      archer_t1: 100,
      archer_t2: 0,
      cavalry_t1: 40,
      cavalry_t2: 0
    },
    active_training: null, // { unitId, count, startTime, duration }
    research: {
      axes: true,
      plow: false,
      masonry: false,
      iron_shield: false,
      composite_bow: false,
      barded_horse: false
    },
    active_research: null, // { techId, startTime, duration }
    inventory: {
      speedup_1m: 8,
      speedup_5m: 4,
      speedup_15m: 2,
      xp_small: 5,
      xp_large: 2,
      pack_wood: 4,
      pack_food: 4,
      pack_stone: 3,
      pack_royal: 1
    },
    active_marches: [],
    current_map: "kingdom",
    quest_step: 1
  };

  let State = JSON.parse(JSON.stringify(DEFAULT_STATE));

  function loadSavedState() {
    try {
      const data = localStorage.getItem('age_of_kingdoms_data');
      if (data) {
        const parsed = JSON.parse(data);
        State = Object.assign({}, DEFAULT_STATE, parsed);

        // Eski ordu verilerini T1 formatına taşı
        if (parsed.troops) {
          if (parsed.troops.infantry !== undefined && !parsed.troops.infantry_t1) {
            State.troops.infantry_t1 = parsed.troops.infantry;
          }
          if (parsed.troops.archers !== undefined && !parsed.troops.archer_t1) {
            State.troops.archer_t1 = parsed.troops.archers;
          }
          if (parsed.troops.cavalry !== undefined && !parsed.troops.cavalry_t1) {
            State.troops.cavalry_t1 = parsed.troops.cavalry;
          }
        }

        // Envanter alanlarını birleştir
        State.inventory = Object.assign({}, DEFAULT_STATE.inventory, parsed.inventory || {});
        State.research = Object.assign({}, DEFAULT_STATE.research, parsed.research || {});
      }
    } catch (e) {
      console.warn('Kayıt yüklenirken hata:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem('age_of_kingdoms_data', JSON.stringify(State));
    } catch (e) {}
  }

  // --- 7. YARDIMCI HESAPLAMA VE FORMATLAR ---
  function fmt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
    return Math.floor(n).toString();
  }

  function fmtSec(sec) {
    sec = Math.max(0, Math.ceil(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function getCost(type, targetLevel) {
    const base = BASE_COSTS[type] || { wood: 50, stone: 50, food: 50, gold: 20, time: 10 };
    const mult = Math.pow(1.35, targetLevel - 1);
    return {
      wood: Math.floor(base.wood * mult),
      stone: Math.floor(base.stone * mult),
      food: Math.floor(base.food * mult),
      gold: Math.floor(base.gold * mult),
      time: Math.max(5, Math.floor(base.time * Math.pow(1.25, targetLevel - 1)))
    };
  }

  function canAfford(cost) {
    return State.resources.wood >= (cost.wood || 0) &&
           State.resources.stone >= (cost.stone || 0) &&
           State.resources.food >= (cost.food || 0) &&
           State.resources.gold >= (cost.gold || 0);
  }

  function deductCost(cost) {
    State.resources.wood -= (cost.wood || 0);
    State.resources.stone -= (cost.stone || 0);
    State.resources.food -= (cost.food || 0);
    State.resources.gold -= (cost.gold || 0);
    saveState();
    updateHUD();
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('on'), 2500);
  }

  function addPlayerXP(amount) {
    State.player_xp += amount;
    const requiredXP = State.player_level * 1000;
    if (State.player_xp >= requiredXP) {
      State.player_xp -= requiredXP;
      State.player_level++;
      Sound.play('complete');
      showToast(`Tebrikler! Hükümdar Seviye ${State.player_level}'e ulaştı!`);
    } else {
      Sound.play('potion');
      showToast(`+${amount} XP kazanıldı! (${State.player_xp}/${requiredXP})`);
    }
    saveState();
    updateHUD();
  }

  // Toplam Ordu Gücü Hesaplama
  function getTotalMilitaryPower() {
    let power = 0;
    Object.entries(State.troops).forEach(([uid, count]) => {
      const u = UNITS[uid];
      if (u) power += count * u.power;
    });
    return Math.floor(power);
  }

  // --- 8. KAMERA KONTROLÜ ---
  class CameraController {
    constructor(viewEl, camEl, mapW, mapH) {
      this.view = viewEl;
      this.cam = camEl;
      this.mapW = mapW;
      this.mapH = mapH;
      this.x = 0;
      this.y = 0;
      this.dragStart = null;
      this.isMoved = false;

      this.bindEvents();
    }

    clamp(targetX, targetY) {
      const vw = this.view.clientWidth;
      const vh = this.view.clientHeight;
      const minX = Math.min(0, vw - this.mapW);
      const minY = Math.min(0, vh - this.mapH);
      return [
        Math.min(0, Math.max(minX, targetX)),
        Math.min(0, Math.max(minY, targetY))
      ];
    }

    moveTo(tx, ty, anim = true) {
      [this.x, this.y] = this.clamp(tx, ty);
      this.cam.style.transition = anim ? 'transform 0.35s ease' : 'none';
      this.cam.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
      if (!anim) {
        requestAnimationFrame(() => this.cam.style.transition = '');
      }
    }

    centerOn(px, py, anim = true) {
      const vw = this.view.clientWidth;
      const vh = this.view.clientHeight;
      this.moveTo(vw / 2 - px, vh / 2 - py, anim);
    }

    bindEvents() {
      this.view.addEventListener('pointerdown', e => {
        if (e.target.closest('button, .slot-node, .world-node, .zone-pill')) return;
        this.dragStart = { x: e.clientX, y: e.clientY, startX: this.x, startY: this.y };
        this.isMoved = false;
      });

      window.addEventListener('pointermove', e => {
        if (!this.dragStart) return;
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) {
          this.isMoved = true;
          this.moveTo(this.dragStart.startX + dx, this.dragStart.startY + dy, false);
        }
      });

      const stopDrag = () => {
        this.dragStart = null;
      };
      window.addEventListener('pointerup', stopDrag);
      window.addEventListener('pointercancel', stopDrag);
    }
  }

  let kingdomCamera, worldCamera;

  // --- 9. KRALLIK HARİTASI İŞLEMLERİ ---
  const TILE_PX = 25;

  function renderKingdomSlots() {
    const container = document.getElementById('slots-container');
    container.innerHTML = '';

    SLOTS.forEach(slot => {
      const bType = slot.building;
      const bDef = BUILDINGS[bType];
      const isBuilt = State.built[slot.id];
      const level = isBuilt || 0;
      const isUpgrading = State.active_builds[slot.id];

      const node = document.createElement('div');
      node.className = `slot-node slot-${slot.id} ${isUpgrading ? 'construction-active' : ''}`;
      node.id = `slot-el-${slot.id}`;

      const left = slot.x * TILE_PX;
      const top = slot.y * TILE_PX;
      const width = slot.w * TILE_PX;
      const height = slot.h * TILE_PX;

      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;

      if (isBuilt) {
        const img = document.createElement('img');
        img.className = 'slot-building-img';
        img.src = `assets/buildings/${bDef.sprite || 'house.png'}`;
        if (bType === 'castle') {
          img.src = 'assets/castle_detailed.png';
          img.style.maxHeight = '185%';
          img.style.bottom = '-6px';
          img.style.filter = 'drop-shadow(0 8px 18px rgba(0,0,0,0.8))';
        }
        img.alt = bDef.label;
        node.appendChild(img);

        const badge = document.createElement('div');
        badge.className = 'slot-level-badge';
        badge.textContent = `Sv.${level}`;
        node.appendChild(badge);

        // Kaynak toplama balonu
        if (['farm', 'woodcutter', 'quarry'].includes(bType)) {
          const bubble = document.createElement('div');
          bubble.className = 'slot-ready-bubble';
          bubble.innerHTML = bType === 'farm' ? '🌾' : (bType === 'woodcutter' ? '🪵' : '🪨');
          bubble.title = 'Üretimi Topla';
          bubble.onclick = (e) => {
            e.stopPropagation();
            collectFromBuilding(slot.id, bType, level);
          };
          node.appendChild(bubble);
        }
      } else {
        const marker = document.createElement('div');
        marker.className = 'slot-empty-marker';
        marker.textContent = '+';
        node.appendChild(marker);
      }

      // İnşaat / Yükseltme durumu
      if (isUpgrading) {
        const timerBadge = document.createElement('div');
        timerBadge.className = 'slot-timer-badge';
        timerBadge.id = `timer-badge-${slot.id}`;
        timerBadge.innerHTML = `🔨 <span class="time-left">${fmtSec(isUpgrading.duration - (Date.now() - isUpgrading.startTime)/1000)}</span>`;
        node.appendChild(timerBadge);

        const progressBox = document.createElement('div');
        progressBox.className = 'slot-progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'slot-progress-fill';
        progressFill.id = `pfill-${slot.id}`;
        progressBox.appendChild(progressFill);
        node.appendChild(progressBox);
      }

      node.onclick = () => {
        if (kingdomCamera.isMoved) return;
        Sound.play('click');
        onSlotClicked(slot);
      };

      container.appendChild(node);
    });
  }

  function collectFromBuilding(slotId, bType, level) {
    Sound.play('collect');
    const amount = 150 * level;
    if (bType === 'farm') State.resources.food += amount;
    else if (bType === 'woodcutter') State.resources.wood += amount;
    else if (bType === 'quarry') State.resources.stone += amount;

    saveState();
    updateHUD();
    showToast(`+${amount} ${bType === 'farm' ? 'Yiyecek' : (bType === 'woodcutter' ? 'Odun' : 'Taş')} toplandı!`);

    if (window.AndroidNative && window.AndroidNative.vibrate) {
      window.AndroidNative.vibrate(25);
    }
  }

  let selectedSlot = null;

  function onSlotClicked(slot) {
    selectedSlot = slot;
    document.querySelectorAll('.slot-node').forEach(el => el.classList.remove('highlighted'));
    const el = document.getElementById(`slot-el-${slot.id}`);
    if (el) el.classList.add('highlighted');

    const isBuilt = State.built[slot.id];
    if (isBuilt) {
      openBuildingContextSheet(slot, isBuilt);
    } else {
      openBuildSlotSheet(slot);
    }
  }

  // --- 10. DÜNYA HARİTASI İŞLEMLERİ ---
  const WORLD_NODES = [
    { id: "player_castle", type: "castle", name: "Akıncılar Kalesi", x: 680, y: 520, level: 1, isPlayer: true },
    { id: "barb_1", type: "barbarian", name: "Barbar Kampı", x: 420, y: 380, level: 1, power: 80, loot: { wood: 500, food: 500, gold: 200 } },
    { id: "barb_2", type: "barbarian", name: "Barbar Kalesi", x: 920, y: 440, level: 2, power: 180, loot: { wood: 1200, stone: 800, gold: 400 } },
    { id: "barb_3", type: "barbarian", name: "Vahşi Savaşçılar", x: 580, y: 840, level: 3, power: 350, loot: { stone: 1500, food: 1500, gold: 800 } },
    { id: "res_grove", type: "resource_wood", name: "Zengin Koru", x: 510, y: 590, level: 2, resType: "wood", amount: 4000 },
    { id: "res_quarry", type: "resource_stone", name: "Kadim Taş Ocağı", x: 860, y: 680, level: 2, resType: "stone", amount: 3500 },
    { id: "res_farms", type: "resource_food", name: "Verimli Ovalar", x: 740, y: 320, level: 1, resType: "food", amount: 3000 },
    { id: "res_gold", type: "resource_gold", name: "Altın Damarı", x: 1100, y: 540, level: 3, resType: "gold", amount: 2000 },
    { id: "king_valen", type: "rival", name: "Valen Krallığı", x: 260, y: 640, level: 3, status: "Dostane", power: 800 },
    { id: "king_iron", type: "rival", name: "Demir Muhafızlar", x: 1220, y: 300, level: 4, status: "Tarafsız", power: 1500 },
    { id: "king_eldoria", type: "rival", name: "Eldoria Şehri", x: 1040, y: 920, level: 4, status: "İttifak", power: 1800 }
  ];

  const worldMapImg = new Image();
  worldMapImg.src = 'assets/world_map_art.png';
  let worldMapLoaded = false;
  worldMapImg.onload = () => {
    worldMapLoaded = true;
    drawWorldMapBackground();
  };

  function drawWorldMapBackground() {
    const canvas = document.getElementById('world-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    if (worldMapLoaded) {
      ctx.drawImage(worldMapImg, 0, 0, W, H);
      // Soft atmospheric vignette
      const grad = ctx.createRadialGradient(W / 2, H / 2, 450, W / 2, H / 2, 950);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(10,8,18,0.45)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#183652';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#3a7d44';
      ctx.beginPath();
      ctx.moveTo(120, 150);
      ctx.bezierCurveTo(400, 80, 1100, 100, 1450, 220);
      ctx.bezierCurveTo(1550, 500, 1500, 950, 1300, 1080);
      ctx.bezierCurveTo(900, 1150, 350, 1100, 160, 950);
      ctx.bezierCurveTo(80, 650, 70, 350, 120, 150);
      ctx.fill();

      ctx.lineWidth = 14;
      ctx.strokeStyle = '#cbb368';
      ctx.stroke();

      ctx.lineWidth = 10;
      ctx.strokeStyle = '#275d8a';
      ctx.beginPath();
      ctx.moveTo(350, 110);
      ctx.quadraticCurveTo(620, 480, 700, 700);
      ctx.quadraticCurveTo(750, 860, 850, 1110);
      ctx.stroke();
    }
  }

  function renderWorldNodes() {
    const container = document.getElementById('world-nodes-container');
    container.innerHTML = '';

    WORLD_NODES.forEach(node => {
      const el = document.createElement('div');
      el.className = `world-node ${node.isPlayer ? 'player-castle' : ''}`;
      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;

      let icon = "🏰";
      let subtitle = node.name;

      if (node.isPlayer) {
        subtitle = `Kaleniz (Sv.${State.castle_level})`;
        el.innerHTML = `
          <div class="world-node-icon" style="background: url('assets/castle_detailed.png') center/contain no-repeat, radial-gradient(circle, #382c5a 0%, #151122 100%); width:68px; height:68px; border: 3px solid #ffd700; box-shadow: 0 0 25px rgba(255,215,0,0.65); border-radius:50%;"></div>
          <div class="world-node-label" style="background:linear-gradient(135deg,var(--gold),#c98f21); color:#2a1d05; font-weight:900; border:0; padding:2px 8px; border-radius:10px;">👑 ${subtitle}</div>
        `;
      } else {
        if (node.type === 'barbarian') {
          icon = "💀";
          subtitle = `${node.name} Sv.${node.level}`;
        } else if (node.type === 'resource_wood') {
          icon = "🪵";
        } else if (node.type === 'resource_stone') {
          icon = "🪨";
        } else if (node.type === 'resource_food') {
          icon = "🌾";
        } else if (node.type === 'resource_gold') {
          icon = "🪙";
        } else if (node.type === 'rival') {
          icon = "🛡️";
        }

        el.innerHTML = `
          <div class="world-node-icon">${icon}</div>
          <div class="world-node-label">${subtitle}</div>
        `;
      }

      el.onclick = () => {
        if (worldCamera.isMoved) return;
        Sound.play('click');
        if (node.isPlayer) {
          showToast(`Kendi Krallığınızdasınız (Kale Seviyesi: ${State.castle_level}).`);
          switchMap('kingdom');
          return;
        }
        openWorldNodeSheet(node);
      };

      container.appendChild(el);
    });
  }

  // --- 11. HARİTA GEÇİŞİ (SİSLİ GEÇİŞ) ---
  let isTransitioning = false;

  function switchMap(targetMap) {
    if (isTransitioning) return;
    if (State.current_map === targetMap) return;

    isTransitioning = true;
    Sound.play('whoosh');

    const fog = document.getElementById('fog-transition');
    const fogLabel = document.getElementById('fog-label');
    const btnGotoWorld = document.getElementById('btn-goto-world');
    const btnGotoKingdom = document.getElementById('btn-goto-kingdom');

    fogLabel.textContent = targetMap === 'world' ? 'Dünya Haritasına Çıkılıyor...' : 'Krallığa Dönülüyor...';
    fog.classList.remove('hidden');

    setTimeout(() => {
      State.current_map = targetMap;
      saveState();

      const kingdomLayer = document.getElementById('kingdom-map-layer');
      const worldLayer = document.getElementById('world-map-layer');

      if (targetMap === 'world') {
        kingdomLayer.classList.add('hidden-map');
        kingdomLayer.classList.remove('active-map');
        worldLayer.classList.remove('hidden-map');
        worldLayer.classList.add('active-map');

        btnGotoWorld.classList.add('hidden');
        btnGotoKingdom.classList.remove('hidden');

        worldCamera.centerOn(680, 520, false);
        renderWorldNodes();
      } else {
        worldLayer.classList.add('hidden-map');
        worldLayer.classList.remove('active-map');
        kingdomLayer.classList.remove('hidden-map');
        kingdomLayer.classList.add('active-map');

        btnGotoKingdom.classList.add('hidden');
        btnGotoWorld.classList.remove('hidden');

        kingdomCamera.centerOn(19 * TILE_PX + 75, 12 * TILE_PX + 60, false);
        renderKingdomSlots();
      }

      setTimeout(() => {
        fog.classList.add('hidden');
        isTransitioning = false;
      }, 400);

    }, 500);
  }

  // --- 12. BOTTOM SHEET YÖNETİCİSİ ---
  const Sheet = {
    open(title, html) {
      document.getElementById('sheet-title').textContent = title;
      document.getElementById('sheet-body').innerHTML = html;
      document.getElementById('sheet').classList.add('on');
      document.getElementById('scrim').classList.add('on');
    },
    close() {
      document.getElementById('sheet').classList.remove('on');
      document.getElementById('scrim').classList.remove('on');
      document.querySelectorAll('.slot-node').forEach(el => el.classList.remove('highlighted'));
    }
  };

  document.getElementById('sheet-close-btn').onclick = () => Sheet.close();
  document.getElementById('scrim').onclick = () => Sheet.close();

  // BİNA BAĞLAMSAL MENÜSÜ
  function openBuildingContextSheet(slot, currentLevel) {
    const bType = slot.building;
    const bDef = BUILDINGS[bType];
    const isUpgrading = State.active_builds[slot.id];
    const nextLevel = currentLevel + 1;
    const cost = getCost(bType, nextLevel);
    const affordable = canAfford(cost);
    const meetsCastleReq = bType === 'castle' || State.castle_level >= nextLevel;

    let actionsHtml = '';

    if (isUpgrading) {
      const timeLeft = Math.max(1, Math.ceil(isUpgrading.duration - (Date.now() - isUpgrading.startTime)/1000));
      actionsHtml = `
        <div style="background:var(--card2);border-radius:12px;padding:12px;text-align:center;margin-bottom:12px;">
          <div style="font-weight:700;color:var(--gold);margin-bottom:6px;">Yükseltme Sürüyor (Seviye ${isUpgrading.targetLevel})</div>
          <div style="font-size:18px;font-weight:900;">⏳ ${fmtSec(timeLeft)}</div>
        </div>
        <button class="btn-primary btn-speedup" id="btn-speedup-action">
          ⚡ Hızlandırıcı Kullan
        </button>
        <button class="btn-secondary" style="margin-top:8px;width:100%" id="btn-instant-finish">
          💎 Anında Tamamla
        </button>
      `;
    } else {
      actionsHtml = `
        <div class="cost-grid">
          <div class="cost-item ${State.resources.wood < cost.wood ? 'not-enough' : ''}">
            <span class="cost-lbl">🪵 Odun</span>
            <span class="cost-num">${fmt(cost.wood)}</span>
          </div>
          <div class="cost-item ${State.resources.food < cost.food ? 'not-enough' : ''}">
            <span class="cost-lbl">🌾 Yiyecek</span>
            <span class="cost-num">${fmt(cost.food)}</span>
          </div>
          <div class="cost-item ${State.resources.stone < cost.stone ? 'not-enough' : ''}">
            <span class="cost-lbl">🪨 Taş</span>
            <span class="cost-num">${fmt(cost.stone)}</span>
          </div>
          <div class="cost-item ${State.resources.gold < cost.gold ? 'not-enough' : ''}">
            <span class="cost-lbl">🪙 Altın</span>
            <span class="cost-num">${fmt(cost.gold)}</span>
          </div>
        </div>

        ${!meetsCastleReq ? `<div style="color:var(--red);font-size:11.5px;font-weight:700;margin-bottom:10px;text-align:center;">Önkoşul: Kale Seviye ${nextLevel} gereklidir!</div>` : ''}

        <button class="btn-primary" id="btn-upgrade-action" ${(!affordable || !meetsCastleReq) ? 'disabled' : ''}>
          <span>⬆️ Seviye ${nextLevel}'ye Yükselt (${fmtSec(cost.time)})</span>
        </button>

        <div class="btn-row" style="margin-top:10px;">
          <button class="btn-secondary" id="btn-view-stats">📊 Bilgi / İstatistik</button>
          ${['barracks', 'tower_archer', 'training_yard'].includes(bType) ? `<button class="btn-secondary" id="btn-train-action">⚔️ Asker Eğit</button>` : ''}
          ${bType === 'academy' ? `<button class="btn-secondary" id="btn-research-action">📜 Araştır</button>` : ''}
        </div>
      `;
    }

    const html = `
      <div class="building-detail-hero">
        <div class="detail-img-box">
          <img src="assets/buildings/${bDef.sprite || 'house.png'}" alt="${bDef.label}">
        </div>
        <div class="detail-info">
          <div class="detail-name">${bDef.label}</div>
          <div class="detail-level">Mevcut: Seviye ${currentLevel}</div>
          <div class="detail-desc">${bDef.desc}</div>
        </div>
      </div>
      <div class="action-buttons-stack">
        ${actionsHtml}
      </div>
    `;

    Sheet.open(bDef.label, html);

    const upBtn = document.getElementById('btn-upgrade-action');
    if (upBtn) {
      upBtn.onclick = () => {
        deductCost(cost);
        Sound.play('build');
        startBuildingUpgrade(slot.id, nextLevel, cost.time);
        Sheet.close();
        showToast(`${bDef.label} Seviye ${nextLevel} inşaatı başladı!`);
      };
    }

    const spBtn = document.getElementById('btn-speedup-action');
    if (spBtn) {
      spBtn.onclick = () => {
        openSpeedupPickerModal('building', slot.id);
      };
    }

    const instBtn = document.getElementById('btn-instant-finish');
    if (instBtn) {
      instBtn.onclick = () => {
        finishBuildingUpgrade(slot.id);
        Sheet.close();
      };
    }

    const statsBtn = document.getElementById('btn-view-stats');
    if (statsBtn) {
      statsBtn.onclick = () => showBuildingStatsModal(bDef, currentLevel);
    }

    const trainBtn = document.getElementById('btn-train-action');
    if (trainBtn) {
      trainBtn.onclick = () => openTroopTrainingSheet(bType);
    }

    const resBtn = document.getElementById('btn-research-action');
    if (resBtn) {
      resBtn.onclick = () => openAcademySheet();
    }
  }

  function startBuildingUpgrade(slotId, targetLevel, durationSec) {
    State.active_builds[slotId] = {
      targetLevel: targetLevel,
      startTime: Date.now(),
      duration: durationSec
    };
    saveState();
    renderKingdomSlots();
  }

  function finishBuildingUpgrade(slotId) {
    const b = State.active_builds[slotId];
    if (!b) return;
    const slot = SLOTS.find(s => s.id === slotId);
    State.built[slotId] = b.targetLevel;

    if (slot && slot.building === 'castle') {
      State.castle_level = b.targetLevel;
      showToast(`Tebrikler! Kale Seviye ${State.castle_level}'e yükseldi!`);
    } else {
      showToast(`İnşaat tamamlandı!`);
    }

    delete State.active_builds[slotId];
    Sound.play('complete');
    addPlayerXP(100 * b.targetLevel);
    saveState();
    updateHUD();
    renderKingdomSlots();
    renderWorldNodes();
  }

  function showBuildingStatsModal(bDef, level) {
    const html = `
      <div style="background:var(--card2);border-radius:12px;padding:14px;margin-bottom:12px;">
        <h4 style="margin:0 0 8px;color:var(--gold);">${bDef.label} (Seviye ${level})</h4>
        <p style="font-size:12px;color:var(--txt-mute);margin:0 0 10px;">${bDef.desc}</p>
        <div style="font-size:12px;line-height:1.8;">
          <div>• Temel Kapasite: <b>${level * 250}</b></div>
          <div>• Üretim/Saat Bonusu: <b>+${level * 15}%</b></div>
          <div>• Şehir Dayanıklılığı: <b>+${level * 500} HP</b></div>
          <div>• Güç Katkısı: <b>+${level * 120} Güç</b></div>
        </div>
      </div>
      <button class="btn-primary" onclick="document.getElementById('sheet-close-btn').click()">Tamam</button>
    `;
    Sheet.open(`${bDef.label} İstatistikleri`, html);
  }

  // BOŞ SLOTA BİNA İNŞA ETME
  function openBuildSlotSheet(slot) {
    const allowed = BUILDINGS[slot.building];
    const cost = getCost(slot.building, 1);
    const affordable = canAfford(cost);
    const meetsUnlock = State.castle_level >= (allowed.unlock || 1);

    const html = `
      <div class="building-detail-hero">
        <div class="detail-img-box">
          <img src="assets/buildings/${allowed.sprite || 'house.png'}" alt="${allowed.label}">
        </div>
        <div class="detail-info">
          <div class="detail-name">${allowed.label}</div>
          <div class="detail-level">Kategori: ${allowed.category.toUpperCase()}</div>
          <div class="detail-desc">${allowed.desc}</div>
        </div>
      </div>

      <div class="cost-grid">
        <div class="cost-item ${State.resources.wood < cost.wood ? 'not-enough' : ''}">
          <span class="cost-lbl">🪵 Odun</span>
          <span class="cost-num">${fmt(cost.wood)}</span>
        </div>
        <div class="cost-item ${State.resources.food < cost.food ? 'not-enough' : ''}">
          <span class="cost-lbl">🌾 Yiyecek</span>
          <span class="cost-num">${fmt(cost.food)}</span>
        </div>
        <div class="cost-item ${State.resources.stone < cost.stone ? 'not-enough' : ''}">
          <span class="cost-lbl">🪨 Taş</span>
          <span class="cost-num">${fmt(cost.stone)}</span>
        </div>
        <div class="cost-item ${State.resources.gold < cost.gold ? 'not-enough' : ''}">
          <span class="cost-lbl">🪙 Altın</span>
          <span class="cost-num">${fmt(cost.gold)}</span>
        </div>
      </div>

      ${!meetsUnlock ? `<div style="color:var(--red);font-size:12px;font-weight:700;margin-bottom:10px;text-align:center;">Önkoşul: Kale Seviye ${allowed.unlock} gereklidir!</div>` : ''}

      <button class="btn-primary" id="btn-build-now" ${(!affordable || !meetsUnlock) ? 'disabled' : ''}>
        🔨 Şimdi İnşa Et (${fmtSec(cost.time)})
      </button>
    `;

    Sheet.open(`İnşa: ${allowed.label}`, html);

    const btn = document.getElementById('btn-build-now');
    if (btn) {
      btn.onclick = () => {
        deductCost(cost);
        Sound.play('build');
        startBuildingUpgrade(slot.id, 1, cost.time);
        Sheet.close();
        showToast(`${allowed.label} inşaatı başladı!`);
      };
    }
  }

  // --- 13. GELİŞMİŞ BİRİM EĞİTİM SİSTEMİ (T1 & T2) ---
  let selectedUnitForTrain = "infantry_t1";
  let trainCount = 25;

  function openTroopTrainingSheet(filterBuildingType = null) {
    let availableUnits = Object.values(UNITS);
    if (filterBuildingType) {
      availableUnits = availableUnits.filter(u => u.buildingType === filterBuildingType);
    }

    if (availableUnits.length > 0 && !availableUnits.find(u => u.id === selectedUnitForTrain)) {
      selectedUnitForTrain = availableUnits[0].id;
    }

    const curUnit = UNITS[selectedUnitForTrain] || availableUnits[0];
    const isUnlocked = !curUnit.reqTech || State.research[curUnit.reqTech];
    const totalCost = {
      food: Math.floor(curUnit.costPerUnit.food * trainCount),
      wood: Math.floor(curUnit.costPerUnit.wood * trainCount),
      stone: Math.floor(curUnit.costPerUnit.stone * trainCount),
      gold: Math.floor(curUnit.costPerUnit.gold * trainCount)
    };
    const totalTime = Math.max(5, Math.ceil(curUnit.timePerUnit * trainCount));
    const affordable = canAfford(totalCost);

    // Eğer şu an bir eğitim aktifse durumunu göster
    let activeTrainingHtml = '';
    if (State.active_training) {
      const activeU = UNITS[State.active_training.unitId];
      const elapsed = (Date.now() - State.active_training.startTime) / 1000;
      const rem = Math.max(0, Math.ceil(State.active_training.duration - elapsed));
      activeTrainingHtml = `
        <div style="background:#281e3d;border:1px solid var(--gold);border-radius:12px;padding:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-weight:800;color:var(--gold);">⚔️ Devam Eden Eğitim: ${State.active_training.count}x ${activeU.name}</span>
            <span style="font-size:12px;font-weight:900;">⏳ ${fmtSec(rem)}</span>
          </div>
          <button class="btn-primary btn-speedup" style="padding:8px;font-size:12px;" onclick="window.openSpeedupPickerModal('training')">
            ⚡ Hızlandırıcı Kullan
          </button>
        </div>
      `;
    }

    const unitListHtml = availableUnits.map(u => {
      const unlocked = !u.reqTech || State.research[u.reqTech];
      const isSelected = u.id === selectedUnitForTrain;
      const reqTechObj = u.reqTech ? TECHS.find(t => t.id === u.reqTech) : null;
      return `
        <div class="unit-select-card ${isSelected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}" onclick="window.selectUnitTrain('${u.id}', '${filterBuildingType || ''}')">
          <div class="unit-card-icon">${u.icon}</div>
          <div class="unit-card-details">
            <div class="unit-card-name">
              ${u.name} <span class="unit-tier-badge ${u.tier === 'T2' ? 'unit-t2' : 'unit-t1'}">${u.tier}</span>
              ${!unlocked ? '<span style="font-size:10px;color:var(--gold);margin-left:auto;">🔒 Kilitli</span>' : ''}
            </div>
            <div class="unit-card-stats">
              ${unlocked ? `Güç: ${u.power} • Mevcut: <b>${State.troops[u.id] || 0}</b>` : `<span style="color:var(--red);">Gereksinim: Akademi '${reqTechObj?.name || 'Araştırma'}'</span>`}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const html = `
      ${activeTrainingHtml}

      <div style="font-size:12px;font-weight:800;color:var(--txt-mute);margin-bottom:6px;">EĞİTİLECEK BİRİMİ SEÇİN:</div>
      ${unitListHtml}

      <div class="training-slider-box">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:12px;font-weight:700;">Eğitim Miktarı:</span>
          <span style="font-size:16px;font-weight:900;color:var(--gold);">${trainCount} Asker</span>
        </div>
        <div class="slider-quick-buttons">
          <button class="btn-qty ${trainCount === 10 ? 'on' : ''}" onclick="window.setTrainCount(10, '${filterBuildingType || ''}')">10</button>
          <button class="btn-qty ${trainCount === 25 ? 'on' : ''}" onclick="window.setTrainCount(25, '${filterBuildingType || ''}')">25</button>
          <button class="btn-qty ${trainCount === 50 ? 'on' : ''}" onclick="window.setTrainCount(50, '${filterBuildingType || ''}')">50</button>
          <button class="btn-qty ${trainCount === 100 ? 'on' : ''}" onclick="window.setTrainCount(100, '${filterBuildingType || ''}')">100</button>
        </div>
      </div>

      <div class="cost-grid">
        <div class="cost-item ${State.resources.food < totalCost.food ? 'not-enough' : ''}">
          <span class="cost-lbl">🌾 Yiyecek</span>
          <span class="cost-num">${fmt(totalCost.food)}</span>
        </div>
        <div class="cost-item ${State.resources.wood < totalCost.wood ? 'not-enough' : ''}">
          <span class="cost-lbl">🪵 Odun</span>
          <span class="cost-num">${fmt(totalCost.wood)}</span>
        </div>
        <div class="cost-item ${State.resources.stone < totalCost.stone ? 'not-enough' : ''}">
          <span class="cost-lbl">🪨 Taş</span>
          <span class="cost-num">${fmt(totalCost.stone)}</span>
        </div>
        <div class="cost-item ${State.resources.gold < totalCost.gold ? 'not-enough' : ''}">
          <span class="cost-lbl">🪙 Altın</span>
          <span class="cost-num">${fmt(totalCost.gold)}</span>
        </div>
      </div>

      <button class="btn-primary" id="btn-start-training" ${(!isUnlocked || !affordable || State.active_training) ? 'disabled' : ''}>
        ⚔️ ${curUnit.name} Eğit (${fmtSec(totalTime)})
      </button>
    `;

    Sheet.open('Birim Eğitimi', html);

    const trainBtn = document.getElementById('btn-start-training');
    if (trainBtn) {
      trainBtn.onclick = () => {
        if (!isUnlocked) {
          showToast('Bu birim için önce Akademi araştırmasını tamamlayın!');
          return;
        }
        if (!affordable) {
          showToast('Yetersiz kaynak!');
          return;
        }
        if (State.active_training) {
          showToast('Şu anda devam eden bir eğitim var!');
          return;
        }

        deductCost(totalCost);
        Sound.play('march');
        State.active_training = {
          unitId: curUnit.id,
          count: trainCount,
          startTime: Date.now(),
          duration: totalTime
        };
        saveState();
        Sheet.close();
        showToast(`${trainCount} adet ${curUnit.name} eğitimi başladı!`);
      };
    }
  }

  window.selectUnitTrain = function (uid, filterType) {
    selectedUnitForTrain = uid;
    openTroopTrainingSheet(filterType || null);
  };

  window.setTrainCount = function (qty, filterType) {
    trainCount = qty;
    openTroopTrainingSheet(filterType || null);
  };

  // BİRLİKLER GENEL ÖZET SEKME PANELİ
  function openTroopsOverviewSheet() {
    const totalPower = getTotalMilitaryPower();
    let unitCardsHtml = Object.values(UNITS).map(u => {
      const count = State.troops[u.id] || 0;
      const isUnlocked = !u.reqTech || State.research[u.reqTech];
      return `
        <div style="background:var(--card2);border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="font-size:26px;">${u.icon}</div>
          <div style="flex:1;">
            <div style="font-weight:800;font-size:13px;">${u.name} <span class="unit-tier-badge ${u.tier === 'T2' ? 'unit-t2' : 'unit-t1'}">${u.tier}</span></div>
            <div style="font-size:11px;color:var(--txt-mute);">${isUnlocked ? `Mevcut: <b style="color:var(--gold);font-size:13px;">${count}</b>` : '<span style="color:var(--red);">🔒 Akademi Kilitli</span>'}</div>
          </div>
          <button class="btn-secondary" style="font-size:11px;padding:6px 10px;" onclick="window.openTroopTrainingSheet('${u.buildingType}')">Eğit</button>
        </div>
      `;
    }).join('');

    const html = `
      <div style="background:linear-gradient(135deg,#342b4d,#1e1830);border:1px solid var(--gold);border-radius:14px;padding:12px;margin-bottom:12px;text-align:center;">
        <div style="font-size:11px;color:var(--txt-mute);text-transform:uppercase;letter-spacing:1px;">Toplam Askeri Güç</div>
        <div style="font-size:24px;font-weight:900;color:var(--gold);margin:2px 0;">⚔️ ${fmt(totalPower)}</div>
        <div style="font-size:11.5px;color:#c98f21;">Aktif Sefer Sayısı: ${State.active_marches.length}</div>
      </div>

      <div style="font-size:12px;font-weight:800;color:var(--txt-mute);margin-bottom:8px;">ORDU BİRLİKLERİ:</div>
      ${unitCardsHtml}

      <button class="btn-primary" style="margin-top:10px;" onclick="window.openTroopTrainingSheet()">
        ⚔️ Birlik Eğitim Menüsüne Git
      </button>
    `;

    Sheet.open('Birlikler ve Ordu Durumu', html);
  }

  // --- 14. AKADEMİ ARAŞTIRMA SİSTEMİ ---
  function openAcademySheet() {
    let activeResearchHtml = '';
    if (State.active_research) {
      const activeTech = TECHS.find(t => t.id === State.active_research.techId);
      const elapsed = (Date.now() - State.active_research.startTime) / 1000;
      const rem = Math.max(0, Math.ceil(State.active_research.duration - elapsed));
      activeResearchHtml = `
        <div style="background:#281e3d;border:1px solid var(--gold);border-radius:12px;padding:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-weight:800;color:var(--gold);">📜 Araştırma Sürüyor: ${activeTech?.name}</span>
            <span style="font-size:12px;font-weight:900;">⏳ ${fmtSec(rem)}</span>
          </div>
          <button class="btn-primary btn-speedup" style="padding:8px;font-size:12px;" onclick="window.openSpeedupPickerModal('research')">
            ⚡ Hızlandırıcı Kullan
          </button>
        </div>
      `;
    }

    const listHtml = TECHS.map(t => {
      const isDone = State.research[t.id];
      const meetsAcademy = State.castle_level >= t.reqAcademyLevel;
      const canPay = canAfford(t.cost);

      let actionBlock = '';
      if (isDone) {
        actionBlock = `<span style="color:var(--green);font-weight:800;font-size:12px;">✓ Tamamlandı</span>`;
      } else if (!meetsAcademy) {
        actionBlock = `<span style="color:var(--red);font-size:10px;font-weight:800;">Kale Sv.${t.reqAcademyLevel}</span>`;
      } else {
        actionBlock = `
          <button class="btn-primary" style="width:auto;padding:6px 12px;font-size:11px;" ${(!canPay || State.active_research) ? 'disabled' : ''} onclick="window.startResearch('${t.id}')">
            Araştır (${fmtSec(t.time)})
          </button>
        `;
      }

      return `
        <div style="display:flex;align-items:center;gap:10px;background:var(--card2);border-radius:12px;padding:10px;margin-bottom:8px;border:1px solid ${t.category === 'military' ? 'rgba(245,196,81,0.2)' : 'rgba(255,255,255,0.05)'};">
          <div style="font-size:26px;">${t.icon}</div>
          <div style="flex:1;">
            <div style="font-weight:800;font-size:12.5px;display:flex;align-items:center;gap:4px;">
              ${t.name}
              ${t.category === 'military' ? '<span class="unit-tier-badge unit-t2">T2 Açılışı</span>' : ''}
            </div>
            <div style="font-size:11px;color:var(--txt-mute);">${t.desc}</div>
            ${!isDone ? `<div style="font-size:10px;color:var(--gold);margin-top:2px;">Maliyet: 🪵${fmt(t.cost.wood)} 🌾${fmt(t.cost.food)} 🪨${fmt(t.cost.stone)} 🪙${fmt(t.cost.gold)}</div>` : ''}
          </div>
          ${actionBlock}
        </div>
      `;
    }).join('');

    const html = `
      ${activeResearchHtml}
      <div style="font-size:12px;font-weight:800;color:var(--txt-mute);margin-bottom:8px;">TEKNOLOJİ VE BİRİM KİLİTLERİ:</div>
      ${listHtml}
    `;

    Sheet.open('Akademi - Teknoloji Ağacı', html);
  }

  window.startResearch = function (techId) {
    const tech = TECHS.find(t => t.id === techId);
    if (!tech) return;
    if (State.active_research) {
      showToast('Şu anda devam eden bir araştırma var!');
      return;
    }
    if (!canAfford(tech.cost)) {
      showToast('Yetersiz kaynak!');
      return;
    }

    deductCost(tech.cost);
    Sound.play('build');
    State.active_research = {
      techId: tech.id,
      startTime: Date.now(),
      duration: tech.time
    };
    saveState();
    showToast(`${tech.name} araştırması başladı!`);
    openAcademySheet();
  };

  // --- 15. GELİŞMİŞ ENVANTER VE EŞYA KULLANIMI ---
  function openInventorySheet() {
    const cardsHtml = Object.values(ITEMS).map(item => {
      const qty = State.inventory[item.id] || 0;
      return `
        <div class="inv-card rarity-${item.rarity}">
          <div class="inv-badge">x${qty}</div>
          <div class="inv-icon">${item.icon}</div>
          <div class="inv-title">${item.title}</div>
          <div class="inv-desc">${item.desc}</div>
          <button class="btn-secondary" style="font-size:11px;padding:6px;width:100%;font-weight:800;" ${qty <= 0 ? 'disabled' : ''} onclick="window.useInventoryItem('${item.id}')">
            ${qty > 0 ? 'Kullan' : 'Tükendi'}
          </button>
        </div>
      `;
    }).join('');

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--card2);border-radius:12px;padding:10px 12px;margin-bottom:12px;">
        <div>
          <span style="font-size:12px;font-weight:800;">Hükümdar Seviyesi:</span>
          <b style="color:var(--gold);font-size:14px;margin-left:4px;">Sv. ${State.player_level}</b>
        </div>
        <div style="font-size:11px;color:var(--txt-mute);">
          TP: ${State.player_xp} / ${State.player_level * 1000}
        </div>
      </div>

      <div class="inventory-grid">
        ${cardsHtml}
      </div>
      <button class="btn-primary" onclick="document.getElementById('sheet-close-btn').click()">Kapat</button>
    `;

    Sheet.open('Envanter ve Eşyalar', html);
  }

  window.useInventoryItem = function (itemId) {
    const item = ITEMS[itemId];
    if (!item) return;
    const qty = State.inventory[itemId] || 0;
    if (qty <= 0) {
      showToast('Bu eşyadan elinizde bulunmuyor!');
      return;
    }

    if (item.type === 'xp') {
      State.inventory[itemId]--;
      addPlayerXP(item.amount);
      openInventorySheet();
    } else if (item.type === 'resource') {
      State.inventory[itemId]--;
      if (item.res.wood) State.resources.wood += item.res.wood;
      if (item.res.food) State.resources.food += item.res.food;
      if (item.res.stone) State.resources.stone += item.res.stone;
      if (item.res.gold) State.resources.gold += item.res.gold;
      Sound.play('collect');
      saveState();
      updateHUD();
      showToast(`${item.title} kullanıldı! Kaynaklar hazineye eklendi.`);
      openInventorySheet();
    } else if (item.type === 'speedup') {
      // Hızlandırıcılar için hedef seçimi kontrolü
      const hasBuild = Object.keys(State.active_builds).length > 0;
      const hasTrain = !!State.active_training;
      const hasRes = !!State.active_research;

      if (!hasBuild && !hasTrain && !hasRes) {
        showToast('Şu anda devam eden aktif bir inşaat, eğitim veya araştırma yok!');
        return;
      }

      openSpeedupPickerModal();
    }
  };

  // HIZLANDIRICI KULLANIM MODALI (BAĞLAMSAL KULLANIM)
  window.openSpeedupPickerModal = function (targetType = null, targetId = null) {
    const speedups = [ITEMS.speedup_1m, ITEMS.speedup_5m, ITEMS.speedup_15m];

    const listHtml = speedups.map(sp => {
      const count = State.inventory[sp.id] || 0;
      return `
        <div class="speedup-picker-item">
          <div class="speedup-picker-info">
            <span style="font-size:24px;">${sp.icon}</span>
            <div>
              <div style="font-size:12px;font-weight:800;">${sp.title}</div>
              <div style="font-size:10.5px;color:var(--txt-mute);">${sp.desc}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;font-weight:900;color:var(--gold);margin-bottom:4px;">Stok: ${count}</div>
            <button class="btn-primary" style="padding:6px 14px;font-size:11px;" ${count <= 0 ? 'disabled' : ''} onclick="window.applySpeedupFromPicker('${sp.id}', '${targetType || ''}', '${targetId || ''}')">
              Kullan
            </button>
          </div>
        </div>
      `;
    }).join('');

    const html = `
      <div style="font-size:12px;color:var(--txt-mute);margin-bottom:10px;">
        Kullanmak istediğiniz hızlandırıcıyı seçin:
      </div>
      <div class="speedup-picker-list">
        ${listHtml}
      </div>
      <button class="btn-secondary" style="width:100%;" onclick="document.getElementById('sheet-close-btn').click()">Vazgeç</button>
    `;

    Sheet.open('Hızlandırıcı Seçin', html);
  };

  window.applySpeedupFromPicker = function (itemId, targetType, targetId) {
    const sp = ITEMS[itemId];
    if (!sp || State.inventory[itemId] <= 0) return;

    State.inventory[itemId]--;
    const seconds = sp.seconds;

    // Hedefe uygula
    if (targetType === 'training' && State.active_training) {
      State.active_training.duration = Math.max(1, State.active_training.duration - seconds);
      Sound.play('click');
      showToast(`${sp.title} eğitime uygulandı (-${seconds/60} dk)!`);
    } else if (targetType === 'research' && State.active_research) {
      State.active_research.duration = Math.max(1, State.active_research.duration - seconds);
      Sound.play('click');
      showToast(`${sp.title} araştırmaya uygulandı (-${seconds/60} dk)!`);
    } else if (targetType === 'building' && targetId && State.active_builds[targetId]) {
      State.active_builds[targetId].duration = Math.max(1, State.active_builds[targetId].duration - seconds);
      Sound.play('click');
      showToast(`${sp.title} inşaata uygulandı (-${seconds/60} dk)!`);
    } else {
      // Genel hızlandırma: ilk aktif işleme uygula
      if (Object.keys(State.active_builds).length > 0) {
        const firstSlot = Object.keys(State.active_builds)[0];
        State.active_builds[firstSlot].duration = Math.max(1, State.active_builds[firstSlot].duration - seconds);
      } else if (State.active_training) {
        State.active_training.duration = Math.max(1, State.active_training.duration - seconds);
      } else if (State.active_research) {
        State.active_research.duration = Math.max(1, State.active_research.duration - seconds);
      }
      Sound.play('click');
      showToast(`Hızlandırıcı uygulandı (-${seconds/60} dk)!`);
    }

    saveState();
    Sheet.close();
  };

  // --- 16. DİĞER SEKME VE GÖREVLER ---
  function openQuestsSheet() {
    const quests = [
      { id: 1, title: "Kalenizi Seviye 2'ye yükseltin", reward: "🪵 2000 Odun, 🪙 500 Altın", done: State.castle_level >= 2 },
      { id: 2, title: "Akademi'de Seviye 2 Asker Araştırması Yapın", reward: "🧪 1x Büyük TP İksiri, ⚡ 2x Hızlandırıcı", done: State.research.iron_shield || State.research.composite_bow || State.research.barded_horse },
      { id: 3, title: "50 Ağır Muhafız veya Kıdemli Okçu Eğitin", reward: "🌾 3000 Yiyecek, 📦 1x Kraliyet Sandığı", done: (State.troops.infantry_t2 + State.troops.archer_t2 + State.troops.cavalry_t2) >= 50 }
    ];

    const listHtml = quests.map(q => `
      <div style="background:var(--card2);border-radius:12px;padding:12px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div>
          <div style="font-weight:800;font-size:12.5px;color:${q.done ? 'var(--green)' : 'var(--txt)'};">${q.done ? '✓ ' : '⚔️ '}${q.title}</div>
          <div style="font-size:11px;color:var(--gold);margin-top:3px;">Ödül: ${q.reward}</div>
        </div>
        ${q.done ? `<button class="btn-primary" style="width:auto;padding:6px 12px;font-size:11px;" onclick="window.claimQuestReward(${q.id})">Ödülü Al</button>` : `<span style="font-size:11px;color:var(--txt-mute);">Devam Ediyor</span>`}
      </div>
    `).join('');

    Sheet.open('Krallık Görevleri', listHtml);
  }

  window.claimQuestReward = function (qid) {
    State.resources.wood += 2000;
    State.resources.food += 2000;
    State.resources.gold += 500;
    State.inventory.speedup_5m = (State.inventory.speedup_5m || 0) + 1;
    Sound.play('complete');
    saveState();
    updateHUD();
    showToast('Görev ödülü alındı!');
    Sheet.close();
  };

  function openBuildCatalogSheet(category = 'all') {
    let list = Object.entries(BUILDINGS);
    if (category !== 'all') {
      list = list.filter(([key, b]) => b.category === category);
    }

    const cardsHtml = list.map(([key, b]) => {
      const isUnlocked = State.castle_level >= (b.unlock || 1);
      const builtCount = SLOTS.filter(s => s.building === key && State.built[s.id]).length;
      return `
        <div class="building-card ${!isUnlocked ? 'locked' : ''}" data-btype="${key}">
          ${!isUnlocked ? `<div class="card-lock-badge">Sv.${b.unlock}</div>` : ''}
          <div class="card-img-box">
            <img src="assets/buildings/${b.sprite || 'house.png'}" alt="${b.label}">
          </div>
          <div class="card-title">${b.label}</div>
          <div class="card-count">${builtCount}/${b.max_count} Kurulu</div>
        </div>
      `;
    }).join('');

    const html = `
      <div class="cat-segment">
        <button class="cat-tab-btn ${category === 'all' ? 'on' : ''}" data-cat="all">Tümü</button>
        <button class="cat-tab-btn ${category === 'military' ? 'on' : ''}" data-cat="military">Askeri</button>
        <button class="cat-tab-btn ${category === 'civil' ? 'on' : ''}" data-cat="civil">Sivil</button>
        <button class="cat-tab-btn ${category === 'resource' ? 'on' : ''}" data-cat="resource">Kaynak</button>
      </div>
      <div class="buildings-grid">
        ${cardsHtml}
      </div>
    `;

    Sheet.open('İnşaat Kataloğu', html);

    document.querySelectorAll('.cat-tab-btn').forEach(btn => {
      btn.onclick = () => openBuildCatalogSheet(btn.dataset.cat);
    });

    document.querySelectorAll('.building-card').forEach(card => {
      card.onclick = () => {
        const bType = card.dataset.btype;
        highlightSlotsForBuilding(bType);
        Sheet.close();
      };
    });
  }

  function highlightSlotsForBuilding(bType) {
    const bDef = BUILDINGS[bType];
    const available = SLOTS.filter(s => s.building === bType && !State.built[s.id]);

    if (available.length === 0) {
      showToast(`Bu binadan daha fazla inşa edilemez veya boş slot yok.`);
      return;
    }

    switchMap('kingdom');
    showToast(`İnşa etmek için yanıp sönen slota dokunun`);

    document.getElementById('placement-banner').classList.remove('hidden');
    document.getElementById('placement-text').textContent = `${bDef.label} için uygun bir alan seçin`;

    available.forEach(s => {
      const el = document.getElementById(`slot-el-${s.id}`);
      if (el) el.classList.add('highlighted');
    });

    kingdomCamera.centerOn(available[0].x * TILE_PX, available[0].y * TILE_PX);
  }

  document.getElementById('cancel-placement-btn').onclick = () => {
    document.getElementById('placement-banner').classList.add('hidden');
    document.querySelectorAll('.slot-node').forEach(el => el.classList.remove('highlighted'));
  };

  function openWorldNodeSheet(node) {
    let actionBtnHtml = '';

    if (node.type === 'barbarian') {
      actionBtnHtml = `
        <div style="background:var(--card2);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;line-height:1.6;">
          <div>• Düşman Gücü: <b style="color:var(--red);">${node.power} Güç</b></div>
          <div>• Zafer Ödülü: <b>${node.loot.wood ? `🪵 ${node.loot.wood} ` : ''}${node.loot.food ? `🌾 ${node.loot.food} ` : ''}🪙 ${node.loot.gold}</b></div>
          <div>• Sefer Süresi: <b>15 saniye</b></div>
        </div>
        <button class="btn-primary" id="btn-attack-world">⚔️ Birlik Gönder ve Saldır</button>
      `;
    } else if (node.type.startsWith('resource_')) {
      actionBtnHtml = `
        <div style="background:var(--card2);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;line-height:1.6;">
          <div>• Kalan Rezerv: <b>${node.amount} Birim</b></div>
          <div>• Toplama Hızı: <b>150/saniye</b></div>
          <div>• Sefer Süresi: <b>12 saniye</b></div>
        </div>
        <button class="btn-primary" id="btn-gather-world">⛏️ Toplama Seferi Gönder</button>
      `;
    } else {
      actionBtnHtml = `
        <div style="background:var(--card2);border-radius:12px;padding:10px;margin-bottom:12px;font-size:12px;line-height:1.6;">
          <div>• Krallık Gücü: <b>${node.power}</b></div>
          <div>• Diplomatik İlişki: <b style="color:var(--gold);">${node.status}</b></div>
        </div>
        <button class="btn-secondary" style="width:100%;" onclick="document.getElementById('sheet-close-btn').click()">Diplomasiyi Koru</button>
      `;
    }

    const html = `
      <div style="text-align:center;margin-bottom:14px;">
        <h3 style="margin:0 0 4px;font-size:16px;">${node.name}</h3>
        <div style="font-size:12px;color:var(--gold);">Seviye ${node.level}</div>
      </div>
      ${actionBtnHtml}
    `;

    Sheet.open(node.name, html);

    const atkBtn = document.getElementById('btn-attack-world');
    if (atkBtn) {
      atkBtn.onclick = () => {
        Sound.play('march');
        Sheet.close();
        showToast('Ordunuz sefere çıktı! Yolda...');
        setTimeout(() => {
          Sound.play('complete');
          State.resources.wood += node.loot.wood || 0;
          State.resources.food += node.loot.food || 0;
          State.resources.gold += node.loot.gold || 0;
          addPlayerXP(150);
          saveState();
          updateHUD();
          showToast(`Zafer! ${node.name} yenildi, ganimet toplandı!`);
        }, 15000);
      };
    }

    const gthBtn = document.getElementById('btn-gather-world');
    if (gthBtn) {
      gthBtn.onclick = () => {
        Sound.play('march');
        Sheet.close();
        showToast('Toplama birliği hareket etti!');
        setTimeout(() => {
          Sound.play('collect');
          if (node.resType === 'wood') State.resources.wood += 1000;
          else if (node.resType === 'stone') State.resources.stone += 1000;
          else if (node.resType === 'food') State.resources.food += 1000;
          else if (node.resType === 'gold') State.resources.gold += 500;
          addPlayerXP(50);
          saveState();
          updateHUD();
          showToast(`Toplama tamamlandı (+1000 kaynak)!`);
        }, 12000);
      };
    }
  }

  // --- 17. HUD VE GERİ SAYIMLAR ---
  function updateHUD() {
    document.getElementById('res-wood-val').textContent = fmt(State.resources.wood);
    document.getElementById('res-food-val').textContent = fmt(State.resources.food);
    document.getElementById('res-stone-val').textContent = fmt(State.resources.stone);
    document.getElementById('res-gold-val').textContent = fmt(State.resources.gold);
    document.getElementById('castle-badge').textContent = `Kale Sv. ${State.castle_level}`;
  }

  // Periyodik Döngü (Pasif Üretim, İnşaat, Eğitim, Araştırma)
  setInterval(() => {
    // 1. Pasif Üretim
    let farmCount = 0, woodCount = 0, quarryCount = 0, houseCount = 0;
    SLOTS.forEach(s => {
      const lvl = State.built[s.id];
      if (lvl) {
        if (s.building === 'farm') farmCount += lvl;
        if (s.building === 'woodcutter') woodCount += lvl;
        if (s.building === 'quarry') quarryCount += lvl;
        if (s.building === 'house') houseCount += lvl;
      }
    });

    // Akademi bonusları
    const woodMult = State.research.axes ? 1.2 : 1.0;
    const foodMult = State.research.plow ? 1.2 : 1.0;
    const stoneMult = State.research.masonry ? 1.2 : 1.0;

    State.resources.food += Math.floor(farmCount * 2 * foodMult);
    State.resources.wood += Math.floor(woodCount * 2 * woodMult);
    State.resources.stone += Math.floor(quarryCount * 1.5 * stoneMult);
    State.resources.gold += houseCount * 1;

    updateHUD();

    const now = Date.now();

    // 2. İnşaat geri sayımları
    Object.keys(State.active_builds).forEach(slotId => {
      const b = State.active_builds[slotId];
      const elapsed = (now - b.startTime) / 1000;
      const remaining = b.duration - elapsed;

      const pfill = document.getElementById(`pfill-${slotId}`);
      if (pfill) {
        const pct = Math.min(100, Math.max(0, (elapsed / b.duration) * 100));
        pfill.style.width = `${pct}%`;
      }

      const tbadge = document.getElementById(`timer-badge-${slotId}`);
      if (tbadge) {
        const span = tbadge.querySelector('.time-left');
        if (span) span.textContent = fmtSec(remaining);
      }

      if (remaining <= 0) {
        finishBuildingUpgrade(slotId);
      }
    });

    // 3. Birim Eğitim geri sayımı
    if (State.active_training) {
      const elapsed = (now - State.active_training.startTime) / 1000;
      if (elapsed >= State.active_training.duration) {
        const u = UNITS[State.active_training.unitId];
        State.troops[u.id] = (State.troops[u.id] || 0) + State.active_training.count;
        Sound.play('march');
        showToast(`Tebrikler! ${State.active_training.count}x ${u.name} ordunuza katıldı!`);
        addPlayerXP(State.active_training.count * 2);
        State.active_training = null;
        saveState();
      }
    }

    // 4. Akademi Araştırma geri sayımı
    if (State.active_research) {
      const elapsed = (now - State.active_research.startTime) / 1000;
      if (elapsed >= State.active_research.duration) {
        const tech = TECHS.find(t => t.id === State.active_research.techId);
        State.research[tech.id] = true;
        Sound.play('complete');
        showToast(`Araştırma Tamamlandı: ${tech.name}!`);
        addPlayerXP(150);
        State.active_research = null;
        saveState();
      }
    }

  }, 1000);

  // --- 18. BAŞLATMA ---
  function initGame() {
    loadSavedState();

    const view = document.getElementById('viewport');
    const kingdomCam = document.getElementById('kingdom-cam');
    const worldCam = document.getElementById('world-cam');

    kingdomCamera = new CameraController(view, kingdomCam, 1000, 750);
    worldCamera = new CameraController(view, worldCam, 1600, 1200);

    renderKingdomSlots();
    drawWorldMapBackground();
    renderWorldNodes();
    updateHUD();

    kingdomCamera.centerOn(19 * TILE_PX + 75, 12 * TILE_PX + 60, false);

    document.getElementById('btn-goto-world').onclick = () => switchMap('world');
    document.getElementById('btn-goto-kingdom').onclick = () => switchMap('kingdom');

    const sndBtn = document.getElementById('sound-btn');
    sndBtn.onclick = () => {
      Sound.muted = !Sound.muted;
      sndBtn.style.opacity = Sound.muted ? '0.4' : '1';
      showToast(Sound.muted ? 'Ses Kapatıldı' : 'Ses Açıldı');
    };

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.onclick = () => {
        Sound.play('click');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('on'));
        tab.classList.add('on');

        const type = tab.dataset.tab;
        if (type === 'build') openBuildCatalogSheet();
        else if (type === 'troops') openTroopsOverviewSheet();
        else if (type === 'academy') openAcademySheet();
        else if (type === 'quests') openQuestsSheet();
        else if (type === 'inventory') openInventorySheet();
      };
    });

    document.querySelectorAll('.zone-pill').forEach(btn => {
      btn.onclick = () => {
        Sound.play('click');
        document.querySelectorAll('.zone-pill').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const zid = btn.dataset.zone;
        if (zid === 'all') {
          kingdomCamera.centerOn(19 * TILE_PX, 12 * TILE_PX);
        } else if (ZONES[zid]) {
          kingdomCamera.centerOn(ZONES[zid].x, ZONES[zid].y);
        }
      };
    });

    document.getElementById('quest-quick-action').onclick = () => {
      Sound.play('click');
      openQuestsSheet();
    };

    document.getElementById('player-profile-btn').onclick = () => {
      Sound.play('click');
      const html = `
        <div style="text-align:center;padding:10px;">
          <div style="font-size:48px;">👑</div>
          <h3 style="margin:8px 0 2px;">Akıncılar Krallığı</h3>
          <div style="color:var(--gold);font-weight:700;font-size:13px;">Hükümdar Sv. ${State.player_level} • Kale Sv. ${State.castle_level}</div>
          <div style="font-size:11px;color:var(--txt-mute);margin:4px 0 12px;">Deneyim: ${State.player_xp} / ${State.player_level * 1000} XP</div>
          <div style="margin:14px 0;font-size:12px;color:var(--txt-mute);line-height:1.6;">
            Rise of Kingdoms tarzı pixel art mobil strateji dünyası. Birliklerinizi eğitin, araştırmalar yapın ve haritayı fethedin!
          </div>
          <button class="btn-secondary" style="width:100%;margin-bottom:8px;" onclick="window.resetGameProgress()">İlerlemeyi Sıfırla</button>
          <button class="btn-primary" onclick="document.getElementById('sheet-close-btn').click()">Kapat</button>
        </div>
      `;
      Sheet.open('Hükümdar Profili', html);
    };

    window.resetGameProgress = function() {
      if (confirm('Bütün krallık ilerlemesi sıfırlanacak. Emin misiniz?')) {
        localStorage.removeItem('age_of_kingdoms_data');
        location.reload();
      }
    };

    window.openTroopTrainingSheet = openTroopTrainingSheet;
    window.openAcademySheet = openAcademySheet;
    window.openInventorySheet = openInventorySheet;

    window.handleAndroidBack = function () {
      const sheet = document.getElementById('sheet');
      if (sheet && sheet.classList.contains('on')) {
        Sheet.close();
        return true;
      }
      if (State.current_map === 'world') {
        switchMap('kingdom');
        return true;
      }
      return false;
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
