/* CubanRippers — featured inventory (mockup). Per-category high-value singles ($1000+).
   Real card names + sets + prices. Real card images sourced + downloaded locally:
   Pokémon = pokemontcg.io, One Piece + Dragon Ball = dotgg CDN (clean scans).
   Sports = real names/prices, image swap pending (styled fallback for now).
   img: local path or null (null -> styled fallback card). */
window.CR_CATEGORIES = [
  { id: 'pokemon',  name: 'Pokémon',     tag: 'PKMN', blurb: 'Vintage WOTC to modern alt-art chase — graded grails.' },
  { id: 'sports',   name: 'Sports',      tag: 'SPRT', blurb: 'Iconic rookies & autos — basketball, football, soccer, baseball.' },
  { id: 'onepiece', name: 'One Piece',   tag: 'OP',   blurb: 'Secret-rare manga & alt-art leaders.' },
  { id: 'dbz',      name: 'Dragon Ball', tag: 'DBZ',  blurb: 'Fusion World secret rares & alt-art leaders.' },
];

const PK = '_assets/cards/pokemon/', OP = '_assets/cards/onepiece/', DB = '_assets/cards/dbz/';

window.CR_INVENTORY = {
  pokemon: [
    { id:'pk-1', name:'Charizard', set:'Base Set · 1999', price:1800, rarity:'Holo Rare', img:PK+'charizard-base.png', hot:true },
    { id:'pk-2', name:'Umbreon VMAX — Alt Art', set:'Evolving Skies · "Moonbreon"', price:1500, rarity:'Secret Rare', img:PK+'umbreon-vmax-moonbreon.png' },
    { id:'pk-3', name:'Lugia', set:'Neo Genesis · 1st Ed', price:2400, rarity:'Holo Rare', img:PK+'lugia-neo.png', hot:true },
    { id:'pk-4', name:'Rayquaza VMAX — Alt Art', set:'Evolving Skies', price:1300, rarity:'Secret Rare', img:PK+'rayquaza-vmax-alt.png' },
    { id:'pk-5', name:'Blastoise', set:'Base Set · 1999', price:1200, rarity:'Holo Rare', img:PK+'blastoise-base.png' },
    { id:'pk-6', name:'Charizard VMAX — Rainbow', set:"Champion's Path", price:1100, rarity:'Secret Rare', img:PK+'charizard-vmax-champions.png' },
    { id:'pk-7', name:'Giratina V — Alt Art', set:'Lost Origin', price:1050, rarity:'Ultra Rare', img:PK+'giratina-v-alt.png' },
    { id:'pk-8', name:'Charizard ex — SAR', set:'Scarlet & Violet 151', price:1000, rarity:'Special Art', img:PK+'charizard-ex-151.png' },
    { id:'pk-9', name:'Venusaur', set:'Base Set · 1999', price:1000, rarity:'Holo Rare', img:PK+'venusaur-base.png' },
    { id:'pk-10',name:'Mewtwo', set:'Base Set · 1999', price:1000, rarity:'Holo Rare', img:PK+'mewtwo-base.png' },
  ],
  sports: [
    { id:'sp-1', name:'Michael Jordan — RC', set:'1986 Fleer #57', price:6000, rarity:'Rookie', img:null, hot:true },
    { id:'sp-2', name:'Lionel Messi — RC', set:'2004 Panini Mega Cracks', price:5000, rarity:'Rookie', img:null },
    { id:'sp-3', name:'LeBron James — RC', set:'2003 Topps Chrome', price:4000, rarity:'Rookie', img:null, hot:true },
    { id:'sp-4', name:'Tom Brady — RC', set:'2000 Bowman Chrome', price:3500, rarity:'Rookie', img:null },
    { id:'sp-5', name:'Luka Dončić — Silver RC', set:'2018 Prizm', price:2500, rarity:'Rookie', img:null },
    { id:'sp-6', name:'Shohei Ohtani — RC Auto', set:'2018 Bowman Chrome', price:2200, rarity:'Auto', img:null },
    { id:'sp-7', name:'Victor Wembanyama — RC', set:'2023 Prizm', price:1800, rarity:'Rookie', img:null },
    { id:'sp-8', name:'Kobe Bryant — RC', set:'1996 Topps Chrome', price:1500, rarity:'Rookie', img:null },
    { id:'sp-9', name:'Patrick Mahomes — Silver RC', set:'2017 Prizm', price:1200, rarity:'Rookie', img:null },
    { id:'sp-10',name:'Ja Morant — RC', set:'2019 Prizm', price:1000, rarity:'Rookie', img:null },
  ],
  onepiece: [
    { id:'op-1', name:'Shanks', set:'Romance Dawn · OP01', price:1800, rarity:'Secret Rare', img:OP+'OP01-120.webp', hot:true },
    { id:'op-2', name:'Monkey D. Luffy', set:'Awakening of the New Era · OP05', price:1500, rarity:'Secret Rare', img:OP+'OP05-119.webp' },
    { id:'op-3', name:'Boa Hancock', set:'Paramount War · OP02', price:1400, rarity:'Secret Rare', img:OP+'OP02-120.webp' },
    { id:'op-4', name:'Portgas D. Ace', set:'500 Years in the Future · OP07', price:1300, rarity:'Secret Rare', img:OP+'OP07-119.webp' },
    { id:'op-5', name:'Yamato', set:'Romance Dawn · OP01', price:1200, rarity:'Secret Rare', img:OP+'OP01-121.webp' },
    { id:'op-6', name:'Nico Robin', set:'Kingdoms of Intrigue · OP04', price:1100, rarity:'Secret Rare', img:OP+'OP04-118.webp' },
    { id:'op-7', name:'Trafalgar Law', set:'Paramount War · OP02', price:1050, rarity:'Secret Rare', img:OP+'OP02-121.webp' },
    { id:'op-8', name:'Roronoa Zoro', set:'Wings of the Captain · OP06', price:1000, rarity:'Secret Rare', img:OP+'OP06-118.webp' },
    { id:'op-9', name:'Charlotte Cracker', set:'Pillars of Strength · OP03', price:1000, rarity:'Super Rare', img:OP+'OP03-108.webp' },
    { id:'op-10',name:'Sabo', set:'Royal Blood · OP10', price:1000, rarity:'Secret Rare', img:OP+'OP10-118.webp' },
  ],
  dbz: [
    { id:'db-1', name:'Mecha Frieza', set:'Awakened Pulse · FB01', price:1200, rarity:'Secret Rare', img:DB+'FB01-130.webp', hot:true },
    { id:'db-2', name:'Majin Buu : Good', set:'Manga Booster · SB01', price:1200, rarity:'Super Rare', img:DB+'SB01-041.webp' },
    { id:'db-3', name:'Son Gohan : Adolescence', set:'Fusion World · FB08', price:1150, rarity:'Leader Alt', img:DB+'FB08-001.webp' },
    { id:'db-4', name:'Jiren', set:'Fusion World · FB03', price:1100, rarity:'Leader Alt', img:DB+'FB03-001.webp' },
    { id:'db-5', name:'Gotenks', set:'Blazing Aura · FB02', price:1050, rarity:'Super Rare', img:DB+'FB02-041.webp' },
    { id:'db-6', name:'Son Goku', set:'Awakened Pulse · FB01', price:1000, rarity:'Leader Alt', img:DB+'FB01-001.webp' },
    { id:'db-7', name:'Trunks : Youth', set:'Fusion World · FB03', price:1000, rarity:'Super Rare', img:DB+'FB03-041.webp' },
    { id:'db-8', name:'Android 18', set:'Fusion World · FB06', price:1000, rarity:'Leader Alt', img:DB+'FB06-001.webp' },
    { id:'db-9', name:'Bulma', set:'Blazing Aura · FB02', price:1000, rarity:'Secret Rare', img:DB+'FB02-130.webp' },
    { id:'db-10',name:'Gloria', set:'Fusion World · FB07', price:1000, rarity:'Leader Alt', img:DB+'FB07-001.webp' },
  ],
};

// flat view (back-compat): every card tagged with its category
window.CR_PRODUCTS = Object.entries(window.CR_INVENTORY)
  .flatMap(([cat, list]) => list.map((c) => ({ ...c, cat, type: 'single' })));

/* ---- Link-per-card BUY config (pre-wired; awaiting Jay's store platform + listing URLs) ----
   When a card has a `buy_url`, its CTA becomes "Buy on <store>" -> opens that listing in a new
   tab (checkout happens on the store; no on-site payment). Until then, cards fall back to the
   current Add-to-cart / DM flow. To go live: set CR_STORE.label + add buy_url per card. */
window.CR_STORE = { label: '', baseUrl: '' }; // e.g. { label:'TCGplayer', baseUrl:'https://...' }
