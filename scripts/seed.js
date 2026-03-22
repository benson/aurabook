const API_URL = 'https://aurabook-api.brostar.workers.dev';

const auras = [
  {
    name: 'vaporwave',
    description: `An internet-born aesthetic that emerged in the early 2010s, rooted in a surreal nostalgia for late-capitalist consumer culture. Vaporwave remixes the visual and sonic artifacts of the 1980s and 90s — corporate stock imagery, shopping mall muzak, early internet graphics, and Japanese commercial design — into something dreamlike and melancholic. It treats consumer culture as both subject and medium, slowing it down and stretching it out until it becomes alien.

Visually, vaporwave leans on glitch art, neon-lit grids, classical marble busts, palm trees, and pixelated sunsets. The color palette is heavy on pink, cyan, and lavender, often layered with scanline effects, VHS artifacts, and chrome textures. Typography tends toward fullwidth characters, Japanese katakana, and the rounded letterforms of early Macintosh interfaces.

The aesthetic sits at an unusual intersection of irony and sincerity — simultaneously mocking and mourning the empty promises of late 20th century techno-optimism. It was one of the first aesthetics to be born entirely online, spreading through tumblr, bandcamp, and reddit before influencing mainstream graphic design, fashion, and album art.`,
    tags: ['digital', 'nostalgic', 'neon', 'glitch', 'ironic', '2010s'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Vaporwave', label: 'aesthetics wiki — vaporwave' },
      { url: 'https://en.wikipedia.org/wiki/Vaporwave', label: 'wikipedia — vaporwave' },
    ],
    notes: 'key palette: #ff71ce (pink), #01cdfe (cyan), #b967ff (lavender), #05ffa1 (mint), #fffb96 (pale yellow). foundational albums: macintosh plus — floral shoppe, blank banshee — 0.',
  },
  {
    name: 'frutiger aero',
    description: `The dominant visual language of consumer technology from roughly 2004 to 2013, named after Adrian Frutiger (the typeface designer) and the Windows Aero interface. This aesthetic defined the era when technology companies wanted their products to feel friendly, accessible, and aspirational — think glossy surfaces, translucent glass effects, soft gradients, and imagery of nature integrated with clean digital interfaces.

The visual signature is unmistakable: skeuomorphic UI elements with realistic shadows and reflections, stock photography of diverse smiling people in bright environments, lush green landscapes paired with sleek devices, and an overall feeling of optimistic humanism. Brands like Windows Vista/7, early iPhone, and countless corporate websites embraced this look, creating a world where technology and nature existed in perfect harmony.

Frutiger aero represents a specific moment of techno-optimism — before flat design stripped away the ornamentation, and before social media's darker implications became apparent. There's an earnest, almost naive hopefulness baked into every glossy button and sun-dappled stock photo. Its recent revival among younger internet users reflects nostalgia for a time when the digital future still felt unambiguously positive.`,
    tags: ['glossy', 'nature', 'optimistic', 'skeuomorphic', 'corporate', '2000s'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Frutiger_Aero', label: 'aesthetics wiki — frutiger aero' },
      { url: 'https://en.wikipedia.org/wiki/Frutiger_Aero', label: 'wikipedia — frutiger aero' },
    ],
    notes: 'key palette: #0078d4 (windows blue), #7fba00 (microsoft green), #ffffff (white), #00bcf2 (sky cyan), #b4e1b4 (soft green). strongly associated with windows vista/7, early ios, intel, hp branding of the era.',
  },
  {
    name: 'y2k futurism',
    description: `The aesthetic of the late 1990s and early 2000s, when the approaching millennium inspired a wave of techno-optimism expressed through inflatable furniture, iridescent materials, and bulbous translucent plastics. Y2K futurism imagined a future that was bubbly, shiny, and playful — less concerned with dystopia than with making technology feel fun and accessible. It was the visual language of the iMac G3, Nokia phones, and the first dot-com wave.

Key visual motifs include metallic and holographic surfaces, transparent colored plastics, organic blob shapes, circuit board patterns used decoratively, and a fascination with chrome and liquid metal textures. The color palette centers on silver, electric blue, hot pink, and acid green, often combined with white and translucent materials. Typography favored rounded, futuristic sans-serifs and pixel fonts.

The aesthetic appears across product design (the original iMac, the Volkswagen New Beetle), fashion (PVC, platform shoes, tiny sunglasses), graphic design (early web design, tech advertising), and pop culture (The Matrix, music videos from Britney Spears and TLC). It captures a brief window when the future felt plastic, colorful, and within reach.`,
    tags: ['futuristic', 'chrome', 'translucent', 'bubbly', 'tech', '2000s'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Y2K', label: 'aesthetics wiki — y2k' },
      { url: 'https://en.wikipedia.org/wiki/Y2K_(aesthetic)', label: 'wikipedia — y2k aesthetic' },
    ],
    notes: 'key palette: #c0c0c0 (silver), #0066ff (electric blue), #ff00aa (hot pink), #00ff66 (acid green), #e8e8e8 (chrome white). iconic references: imac g3, the matrix, britney spears music videos, early web flash intros.',
  },
  {
    name: 'retro futurism',
    description: `The aesthetic of futures past — how mid-20th century culture imagined the world of tomorrow. Retro futurism draws from the optimistic space-age visions of the 1950s and 60s, when streamlined rockets, flying cars, and gleaming chrome cities felt like inevitable destinations rather than fantasies. It is equal parts nostalgia and imagination, celebrating a future that never arrived.

The visual vocabulary borrows heavily from the space race era: atomic starbursts, swooping fins, bubble helmets, ray guns, and architecture that looks like it was designed to launch into orbit. Color palettes tend toward warm metallics, turquoise, coral, and cream — the palette of Googie architecture and vintage sci-fi pulp covers. There is a strong emphasis on aerodynamic curves, radial symmetry, and a general sense that everything should look like it is moving forward at great speed.

Retro futurism has persisted as a design influence precisely because it represents optimism at its most unrestrained. Unlike cyberpunk's dystopian warnings or solarpunk's ecological anxiety, retro futurism simply assumes that tomorrow will be wonderful and that human ingenuity will solve everything. That earnest confidence gives it a warmth and charm that continues to resonate in architecture, product design, illustration, and film (The Incredibles, Fallout, The Jetsons).`,
    tags: ['space-age', 'atomic', 'mid-century', 'optimistic', 'chrome', '1950s'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Retro-Futurism', label: 'aesthetics wiki — retro futurism' },
      { url: 'https://en.wikipedia.org/wiki/Retrofuturism', label: 'wikipedia — retrofuturism' },
    ],
    notes: 'key palette: #c0392b (atomic red), #1abc9c (turquoise), #f39c12 (golden), #ecf0f1 (cream), #2c3e50 (deep navy). key references: googie architecture, the jetsons, fallout game series, syd mead concept art, eero saarinen furniture.',
  },
  {
    name: 'utopian scholastic',
    description: `The warm, slightly surreal visual language of 1990s and early 2000s educational media — Scholastic book fairs, Discovery Zone posters, educational software splash screens, and the illustrated covers of paperback chapter books. This aesthetic carries a specific flavor of institutional optimism: the belief that learning is an adventure, that knowledge is colorful, and that the future belongs to curious kids.

Visually, it combines photorealistic illustrations with fantastical elements — a rainforest diorama that seems to glow from within, outer space rendered in vivid watercolors, dinosaurs standing in shafts of golden light, underwater scenes with impossible clarity. The typography is bold and friendly, often in primary colors against deep blue or black backgrounds. There is a pervasive sense of wonder that treats every subject — volcanoes, ancient egypt, the solar system — as equally thrilling.

The nostalgia for this aesthetic runs deep for anyone who grew up attending book fairs in elementary school gymnasiums, surrounded by glossy covers promising magic tree houses and choose-your-own-adventures. It represents a pre-internet mode of discovery where knowledge came in physical, tactile forms — posters you could smell, books with textured covers, and fold-out diagrams that felt like opening a portal.`,
    tags: ['educational', 'nostalgic', 'wonder', 'illustrated', '1990s', 'books'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Scholastic_Academia', label: 'aesthetics wiki — scholastic academia' },
    ],
    notes: 'key palette: #1a237e (deep blue), #ff6f00 (scholastic orange), #4caf50 (educational green), #fdd835 (bright yellow), #7b1fa2 (discovery purple). key references: scholastic book fair catalogs, magic school bus, dorling kindersley eyewitness books, discovery zone branding.',
  },
  {
    name: 'dark academia',
    description: `An aesthetic centered on the romanticization of classical education, literature, and the European intellectual tradition. Dark academia evokes the atmosphere of ivy-covered universities, dimly lit libraries, handwritten letters, and long afternoons spent reading dense philosophy. It carries an undercurrent of melancholy and obsession — the pursuit of knowledge as something consuming, beautiful, and slightly dangerous.

The visual palette is autumnal and muted: deep browns, forest greens, burgundy, cream, and black. Materials are natural and aged — tweed, leather, parchment, dark wood, brass. Imagery gravitates toward gothic architecture, candlelit study desks, old typewriters, skulls used as bookends, and rain-streaked windows overlooking courtyards. There is a strong literary dimension, with references to the Western canon — Homer, Donna Tartt, Oscar Wilde, Dostoevsky.

Dark academia emerged as a distinct internet aesthetic around 2015-2019, primarily on tumblr and later tiktok, though its roots draw from much older traditions of intellectual romanticism. It appeals to a desire for depth, rigor, and beauty in an age of algorithmic distraction — though critics note its tendency to idealize exclusionary institutions and Eurocentric knowledge systems.`,
    tags: ['literary', 'autumnal', 'intellectual', 'gothic', 'moody', 'classical'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Dark_Academia', label: 'aesthetics wiki — dark academia' },
      { url: 'https://en.wikipedia.org/wiki/Dark_academia', label: 'wikipedia — dark academia' },
    ],
    notes: 'key palette: #3e2723 (dark brown), #1b5e20 (forest green), #880e4f (burgundy), #f5f0e6 (parchment), #212121 (charcoal). key references: the secret history by donna tartt, dead poets society, oxford/cambridge architecture, kill your darlings.',
  },
  {
    name: 'solarpunk',
    description: `A speculative aesthetic and movement that imagines a future where humanity has solved the climate crisis through a combination of renewable energy, ecological design, community organization, and appropriate technology. Where cyberpunk warns and steampunk nostalgizes, solarpunk proposes — offering visions of cities integrated with nature, buildings covered in vertical gardens, and communities powered by solar panels and wind turbines.

The visual language blends organic and technological forms: architecture with sweeping curves inspired by art nouveau, green roofs and living walls, solar panels integrated into stained glass, community gardens on every block, and public transit systems winding through urban forests. The color palette is dominated by lush greens, warm golds, sky blues, and terracotta — the colors of a world where nature and human habitation are deeply intertwined rather than opposed.

Solarpunk is notable for being explicitly aspirational — it is less interested in predicting the future than in inspiring people to build it. The aesthetic draws from global influences including West African, Southeast Asian, and Indigenous design traditions, deliberately pushing back against the Western-centric futures of older speculative genres. It has gained significant traction since the mid-2010s as climate anxiety has intensified, offering a counterweight to doom and nihilism.`,
    tags: ['ecological', 'optimistic', 'green', 'futuristic', 'communal', 'sustainable'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Solarpunk', label: 'aesthetics wiki — solarpunk' },
      { url: 'https://en.wikipedia.org/wiki/Solarpunk', label: 'wikipedia — solarpunk' },
    ],
    notes: 'key palette: #2e7d32 (deep green), #fbc02d (solar gold), #4fc3f7 (sky blue), #d84315 (terracotta), #a5d6a7 (soft green). key references: studio ghibli (nausicaa, laputa), singapore architecture (gardens by the bay), earthship biotecture.',
  },
  {
    name: 'brutalism',
    description: `An architectural and design movement characterized by raw, unfinished surfaces — most iconically exposed concrete (béton brut, the French term from which the name derives). Emerging in the 1950s as an outgrowth of modernism, brutalism rejected decoration and polish in favor of honest expression of materials and structure. Buildings were designed to look like what they were: massive, heavy, and unapologetically functional.

The aesthetic is defined by bold geometric forms, repetitive modular elements, monolithic scale, and the visible texture of poured concrete with its formwork imprints. Brutalist buildings often appear fortress-like, with deep-set windows, cantilevered volumes, and a deliberate sense of weight and permanence. The palette is dominated by raw concrete grey, but often punctuated by bold primary accents — a red door, a yellow stairwell — that feel almost defiant against the monochrome mass.

Originally associated with social housing and public institutions (universities, libraries, government buildings), brutalism fell out of favor in the 1970s-80s as its buildings aged poorly and were perceived as cold and oppressive. A major revival began in the 2010s, driven by architectural photography on instagram and a new generation's appreciation for its uncompromising honesty. In web design, "brutalist" has become shorthand for deliberately raw, unstyled interfaces that reject the polish of modern UX conventions.`,
    tags: ['concrete', 'geometric', 'raw', 'monolithic', 'architectural', 'modernist'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Brutalism', label: 'aesthetics wiki — brutalism' },
      { url: 'https://en.wikipedia.org/wiki/Brutalist_architecture', label: 'wikipedia — brutalist architecture' },
      { url: 'https://brutalistwebsites.com/', label: 'brutalist websites' },
    ],
    notes: 'key palette: #9e9e9e (concrete grey), #424242 (dark concrete), #d32f2f (accent red), #f5f5f5 (bleached white), #ffd600 (accent yellow). key references: barbican centre (london), habitat 67 (montreal), national theatre (london), le corbusier unite d habitation.',
  },
  {
    name: 'cottagecore',
    description: `A romanticized vision of rural and pastoral life that gained enormous popularity during the late 2010s and exploded during the covid-19 pandemic. Cottagecore imagines a simpler existence centered on baking bread, tending gardens, pressing wildflowers, and living in a stone cottage surrounded by meadows. It is deliberately anachronistic, drawing from a pre-industrial European countryside that may never have existed in quite this idealized form.

The visual language is soft and warm: floral prints, gingham patterns, wicker baskets, mason jars filled with wildflowers, linen aprons, hand-thrown pottery, and dappled sunlight filtering through lace curtains. The color palette is muted and natural — sage green, dusty rose, cream, lavender, and warm brown. Everything looks slightly sun-bleached and well-worn, as if it has been loved and used for generations.

Cottagecore resonated so strongly because it offered an antidote to the hyperconnected, always-on digital world. It is fundamentally about slowness, tactility, and self-sufficiency — making things by hand, growing your own food, finding contentment in small domestic rituals. The aesthetic has been embraced across gender identities and has a particularly strong following in queer communities, where it represents a vision of peaceful rural existence free from the heteronormative constraints historically associated with country life.`,
    tags: ['pastoral', 'cozy', 'floral', 'rustic', 'handmade', 'romantic'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Cottagecore', label: 'aesthetics wiki — cottagecore' },
      { url: 'https://en.wikipedia.org/wiki/Cottagecore', label: 'wikipedia — cottagecore' },
    ],
    notes: 'key palette: #8d6e63 (warm brown), #c8e6c9 (sage green), #f8bbd0 (dusty rose), #fff8e1 (cream), #ce93d8 (lavender). key references: beatrix potter illustrations, studio ghibli (howls moving castle, kiki), anne of green gables, mushroom foraging culture.',
  },
  {
    name: 'liminal space',
    description: `The aesthetic of transitional, in-between places experienced in the absence of their usual human activity — empty shopping malls at 3am, hotel corridors that stretch endlessly, school hallways during summer break, parking garages at dusk. Liminal spaces are defined not by what they are but by what is missing: the people and purpose that normally give them meaning. Without that context, they become uncanny and dreamlike.

The visual signature is fluorescent lighting casting flat, shadowless illumination on commercial interiors. Worn carpet patterns, drop ceiling tiles, beige walls, and the particular institutional palette of places designed to be passed through rather than inhabited. The emptiness is the point — these spaces feel like memories of places, or like environments from a dream that you can almost but not quite place. Photography tends toward slightly overexposed or color-shifted processing that enhances the unreality.

The liminal space aesthetic emerged from online communities around 2019, particularly the "backrooms" creepypasta and related subreddits. It taps into a collective recognition that certain everyday environments — when stripped of their normal context — trigger a deep psychological unease. The appeal is in that productive discomfort: these images feel like they should be mundane, but something is fundamentally wrong in a way that is difficult to articulate.`,
    tags: ['uncanny', 'empty', 'fluorescent', 'dreamlike', 'transitional', 'eerie'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Liminal_Space', label: 'aesthetics wiki — liminal space' },
      { url: 'https://en.wikipedia.org/wiki/Liminal_space_(aesthetic)', label: 'wikipedia — liminal space' },
    ],
    notes: 'key palette: #fff9c4 (fluorescent yellow), #efebe9 (institutional beige), #90a4ae (grey-blue), #e0e0e0 (carpet grey), #a5d6a7 (hospital green). key references: the backrooms creepypasta, pools and empty malls photography, edward hopper paintings, stanley kubrick hallway shots.',
  },
  {
    name: 'cyberpunk',
    description: `"High tech, low life" — the aesthetic of dystopian futures where advanced technology coexists with social decay, corporate dominance, and street-level survival. Originating in 1980s science fiction literature (William Gibson, Philip K. Dick, Bruce Sterling), cyberpunk imagines megacities choked with neon advertising, rain-slicked streets reflecting holographic billboards, and hackers in cramped apartments jacked into vast digital networks.

The visual palette is dominated by electric blues, neon pinks and purples, and toxic greens against backgrounds of deep black and dark metal. Urban environments are dense, vertical, and layered — street-level markets beneath towering corporate arcologies, tangled cables and exposed infrastructure, retrofitted technology and makeshift cybernetic augmentations. The aesthetic embraces visual noise: kanji signage, scrolling data streams, lens flare, and chromatic aberration.

Cyberpunk has proven remarkably durable as both a literary genre and a design vocabulary, influencing everything from film (Blade Runner, Ghost in the Shell, The Matrix) to video games (Deus Ex, Cyberpunk 2077) to fashion (techwear, LED accessories). Its core tension — that technological progress does not equate to social progress — has only become more relevant as real-world developments in AI, surveillance, and corporate power increasingly resemble the genre's warnings.`,
    tags: ['dystopian', 'neon', 'tech', 'urban', 'noir', 'futuristic'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Cyberpunk_(aesthetic)', label: 'aesthetics wiki — cyberpunk' },
      { url: 'https://en.wikipedia.org/wiki/Cyberpunk', label: 'wikipedia — cyberpunk' },
    ],
    notes: 'key palette: #0d47a1 (deep electric blue), #e040fb (neon magenta), #00e676 (toxic green), #1a1a2e (dark void), #ff6d00 (warning orange). key references: blade runner (1982/2049), neuromancer by william gibson, ghost in the shell, akira, deus ex.',
  },
  {
    name: 'wabi-sabi',
    description: `A Japanese aesthetic philosophy centered on finding beauty in imperfection, impermanence, and incompleteness. Rooted in Buddhist teaching — particularly the acceptance of transience and suffering — wabi-sabi values the worn, the weathered, and the modest over the polished, the pristine, and the grand. A cracked teacup repaired with gold (kintsugi), a moss-covered stone path, the patina on aged wood — these are not flaws to be corrected but qualities to be appreciated.

The visual expression of wabi-sabi is characterized by natural materials in their unrefined state: raw clay, undyed linen, weathered timber, rusted iron, hand-shaped ceramics with visible irregularities. The color palette is drawn directly from the natural world — earth tones, stone greys, muted greens, the warm brown of unglazed pottery. Spaces designed with wabi-sabi principles feel spare but not empty, simple but not sterile. There is always evidence of the hand, of time, of use.

Wabi-sabi stands in deliberate contrast to Western aesthetic traditions that prize symmetry, permanence, and perfection. In design contexts, it offers a counterpoint to the slick minimalism of tech culture — where minimalism strips away to reveal clean surfaces, wabi-sabi strips away to reveal texture, age, and the beauty of things as they actually are rather than as they might ideally be.`,
    tags: ['japanese', 'imperfect', 'natural', 'weathered', 'minimal', 'philosophical'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Wabi-Sabi', label: 'aesthetics wiki — wabi sabi' },
      { url: 'https://en.wikipedia.org/wiki/Wabi-sabi', label: 'wikipedia — wabi-sabi' },
    ],
    notes: 'key palette: #8d6e63 (clay brown), #a1887f (warm stone), #4e342e (dark earth), #d7ccc8 (pale sand), #78909c (slate grey). key references: kintsugi (golden repair), tea ceremony aesthetics, zen garden design, leonard koren "wabi-sabi for artists designers poets and philosophers".',
  },
  {
    name: 'memphis design',
    description: `A postmodern design movement founded in Milan in 1981 by Ettore Sottsass and a group of young designers who were bored with the good taste of mainstream modernism. Memphis (named after a Bob Dylan song, not the city) deliberately embraced everything that "serious" design rejected: clashing colors, cartoonish patterns, mismatched materials, and forms that prioritized fun and provocation over function and refinement.

The visual signature is instantly recognizable: bold geometric shapes (triangles, circles, squiggly lines) combined in loud, almost aggressive compositions. The color palette is aggressively cheerful — bright pink, electric blue, lemon yellow, mint green, and red — often applied to surfaces covered in terrazzo-like speckle patterns, zigzags, and polka dots. Materials mixed laminate with marble, neon with pastels, cheap with expensive, in combinations that felt deliberately wrong.

Memphis lasted as a formal movement only until 1988, but its influence echoes through decades of design history. It directly shaped 80s and 90s pop culture (Saved by the Bell set design, early MTV graphics, Patrick Nagel illustrations) and has experienced periodic revivals. Its lasting contribution was proving that design could be joyful, irreverent, and deliberately unserious without being dismissed — that bad taste, deployed with enough confidence, becomes its own kind of good taste.`,
    tags: ['postmodern', 'bold', 'colorful', 'geometric', 'playful', '1980s'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Memphis_Design', label: 'aesthetics wiki — memphis design' },
      { url: 'https://en.wikipedia.org/wiki/Memphis_Group', label: 'wikipedia — memphis group' },
    ],
    notes: 'key palette: #e91e63 (hot pink), #2196f3 (electric blue), #ffeb3b (lemon yellow), #4caf50 (mint green), #ff5722 (red-orange). key references: ettore sottsass carlton bookshelf, saved by the bell set design, early mtv graphics, david bowie memphis-influenced album covers.',
  },
  {
    name: 'nordic minimalism',
    description: `The Scandinavian approach to design that prioritizes function, simplicity, natural materials, and the quality of light in spaces. Emerging from the mid-20th century design traditions of Denmark, Sweden, Finland, and Norway, nordic minimalism is shaped by long dark winters, a cultural emphasis on egalitarianism, and the influence of the surrounding natural landscape — birch forests, granite coastlines, and the pale light of high latitudes.

The visual language is characterized by clean lines, open spaces, and a restrained material palette: pale woods (birch, ash, pine), white and grey walls, natural textiles (wool, linen, cotton), and the occasional warm accent in muted tones. Furniture tends toward elegant simplicity — forms that are pared down to their essential structure without feeling cold or austere. The relationship to light is central: large windows, candles, and warm artificial lighting designed to counteract the seasonal darkness.

What distinguishes nordic minimalism from other minimalist traditions is its warmth. Where Japanese minimalism emphasizes emptiness and impermanence, and tech minimalism favors sleek surfaces, the Scandinavian version is fundamentally about coziness (hygge) and livability. A nordic minimal space should feel calm and uncluttered, but also deeply inviting — a place where you want to sit with a blanket, a cup of coffee, and a long book while snow falls outside.`,
    tags: ['scandinavian', 'clean', 'warm', 'natural', 'functional', 'light'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Scandinavian_Minimalism', label: 'aesthetics wiki — scandinavian minimalism' },
      { url: 'https://en.wikipedia.org/wiki/Scandinavian_design', label: 'wikipedia — scandinavian design' },
    ],
    notes: 'key palette: #fafafa (white), #e0d5c1 (warm birch), #90a4ae (cool grey), #5d4037 (dark wood accent), #c5cae9 (soft blue). key references: muji, ikea at its best, arne jacobsen egg chair, alvar aalto, finnish sauna culture, hygge.',
  },
  {
    name: 'art deco',
    description: `A decorative arts movement that flourished from the 1920s through the 1940s, defined by geometric precision, luxurious materials, and an unapologetic embrace of glamour and modernity. Art deco emerged from the intersection of modernist geometry, ancient Egyptian and Mesoamerican motifs, machine-age industrial forms, and the exuberance of the Jazz Age. It was the aesthetic of skyscrapers, ocean liners, movie palaces, and cocktail bars — spaces designed to make people feel like the future had arrived and it was magnificent.

The visual vocabulary is built on strong vertical lines, stepped forms, sunburst patterns, chevrons, and symmetrical geometric compositions. Materials are deliberately opulent: polished chrome, lacquered wood, exotic inlays, terrazzo floors, gold leaf, and marble. The color palette ranges from bold combinations of black and gold, emerald and silver, to the softer pastels of art deco's later Miami Beach incarnation. Typography favors angular, geometric letterforms with strong vertical emphasis.

Art deco differs from art nouveau (its predecessor) in its embrace of the machine and the geometric over the organic and the handcrafted. It was a style of confident modernity — the aesthetic of a world that believed in progress, prosperity, and the transformative power of good design. Its influence remains visible in everything from the Chrysler Building to contemporary cocktail bar interiors to the gatsby-era revival in fashion and film.`,
    tags: ['geometric', 'glamorous', 'golden', 'architectural', 'luxurious', '1920s'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Art_Deco', label: 'aesthetics wiki — art deco' },
      { url: 'https://en.wikipedia.org/wiki/Art_Deco', label: 'wikipedia — art deco' },
    ],
    notes: 'key palette: #212121 (black), #ffd700 (gold), #004d40 (emerald), #bdbdbd (silver chrome), #f5f0e6 (ivory). key references: chrysler building (nyc), miami beach historic district, the great gatsby (2013 film), orient express interiors, tamara de lempicka paintings.',
  },
  {
    name: 'global village coffeehouse',
    description: `The aesthetic of independent coffee shops, world music compilations, and the early fair-trade movement — a warm, eclectic visual language that blends influences from across the globe into a cozy, slightly bohemian atmosphere. Think exposed brick walls hung with tapestries from different continents, mismatched wooden furniture, hand-painted ceramic mugs, burlap coffee sacks used as decor, and world music playing over a sound system next to a community bulletin board.

The visual palette is warm and earthy: deep terracotta, coffee brown, burnt orange, sage green, and natural wood tones. Textures are layered and tactile — woven textiles, jute, hammered metal, clay, and reclaimed wood. Decorative elements draw from multiple cultural traditions without strict adherence to any one: Moroccan lanterns, Indonesian batik, South American woven blankets, African carved figures, Indian block-print fabrics. The lighting is always warm, usually from a mix of pendant lamps, string lights, and candles.

This aesthetic peaked in the late 1990s and 2000s, closely tied to the Putumayo World Music era, early fair-trade certification, and the spread of independent coffeehouse culture before the complete dominance of Starbucks. It represents a certain kind of pre-internet cosmopolitanism — the idea that the world could be explored and appreciated through its crafts, cuisines, and music, ideally while sitting in a comfortable chair with a very good latte.`,
    tags: ['eclectic', 'warm', 'multicultural', 'bohemian', 'cozy', 'handcrafted'],
    links: [
      { url: 'https://aesthetics.fandom.com/wiki/Global_Village_Coffeehouse', label: 'aesthetics wiki — global village coffeehouse' },
    ],
    notes: 'key palette: #bf360c (terracotta), #4e342e (coffee brown), #ef6c00 (burnt orange), #689f38 (sage), #d7ccc8 (natural linen). key references: putumayo world music album covers, early fair trade branding, ten thousand villages stores, independent coffee shop culture of the 2000s.',
  },
];

async function seed() {
  console.log(`seeding ${auras.length} auras...`);

  for (const aura of auras) {
    console.log(`  creating: ${aura.name}`);
    const res = await fetch(`${API_URL}/auras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aura),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error(`    FAILED: ${err.error || res.status}`);
    } else {
      console.log(`    ok`);
    }
  }

  console.log('done!');
}

seed();
