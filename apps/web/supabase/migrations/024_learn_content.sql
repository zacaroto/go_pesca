-- Aprender content: 12 guides, 8 knots and fishing seasons for the 40 species.
-- Researched 2026-10-21; raw research in brain/Output/2026-10-21-learn-*.json and species-seasons.json.
-- Knot diagrams: upload the files from ~/Downloads/go-pesca-nudos/ to the "learn" bucket root after running this.

insert into public.learn_guides (slug, chapter, sort_order, read_minutes, title_es, title_en, summary_es, summary_en, body_es, body_en, sources) values
('pesca-de-orilla-para-empezar', 'technique', 1, 4, 'Pesca de orilla para empezar', 'Shore fishing for beginners', 'Todo lo básico para lanzar desde la playa, las rocas o una bocana sin necesidad de bote.', 'The basics for casting from the beach, rocks or a river mouth, no boat needed.', 'Pescar desde la orilla es la forma más sencilla y barata de empezar. No necesitas bote ni capitán: solo una caña, un par de nudos y ganas de madrugar. En Costa Rica tienes cientos de kilómetros de costa en el Pacífico y el Caribe, además de ríos y bocanas por todo el país.

## Dónde pararte

No toda la playa rinde igual. Busca lugares donde el agua "trabaje" y los peces encuentren comida:

- **Puntas de roca y arrecifes cerca de la orilla.** Ahí se esconden carnadas y cazan pargos, jureles y, con suerte, un pez gallo.
- **Bocanas y desembocaduras de río.** El agua dulce arrastra comida y atrae róbalos y jureles, sobre todo cuando la marea se mueve.
- **Canales y huecos en la playa.** Las zonas más oscuras entre las olas suelen ser más hondas y por ahí pasan los peces.

Respeta la propiedad privada, las áreas protegidas y a los bañistas. Si un lugar tiene rótulos de prohibido pescar, búscate otro.

## El equipo mínimo

Para empezar, un combo de spinning (caña y carrete juntos) de unos 2 a 3 metros es suficiente. Una caña más larga te ayuda a lanzar más lejos desde la playa; en rocas, una un poco más corta se maneja mejor.

En la caja lleva:

- Anzuelos de varios tamaños, incluidos algunos circulares.
- Plomos de distintos pesos para fondo y corriente.
- Destorcedores (girador) para que la línea no se enrede.
- Un par de cucharas y un popper para cuando veas actividad en la superficie.
- Alicate, cuchilla y un trapo.

## Carnada o señuelo

Con carnada natural (sardina, camarón o un pedazo de pescado) en el fondo casi siempre pica algo, y es la forma más fácil de aprender a sentir el pique. Los señuelos te obligan a moverte y lanzar más, pero cubren más agua. Una buena estrategia es dejar una caña con carnada y trabajar otra con una cuchara.

## Cuándo ir

Las primeras horas de la mañana y el final de la tarde suelen ser los mejores momentos. Revisa la tabla de mareas: en general pica más cuando el agua se está moviendo que en la marea quieta. En las rocas, ojo con la marea que sube, porque te puede dejar sin camino de regreso.

## Seguridad básica

- Usa zapatos con buen agarre en las rocas; el musgo resbala mucho.
- Nunca le des la espalda al mar en una punta de roca.
- Protégete del sol: gorra, camisa de manga larga, bloqueador y bastante agua.
- Avísale a alguien a dónde vas, sobre todo si pescas solo.

## Un consejo final

Ten paciencia. Los primeros días son para aprender a lanzar, a amarrar nudos y a leer el lugar. Anota en la app dónde, a qué hora y con qué marea picó algo: en pocas salidas vas a empezar a ver patrones.', 'Fishing from shore is the easiest and cheapest way to get started. You don''t need a boat or a captain, just a rod, a couple of knots and the will to get up early. Costa Rica has hundreds of kilometers of Pacific and Caribbean coastline, plus rivers and river mouths all over the country.

## Where to stand

Not every stretch of beach fishes the same. Look for places where the water is "working" and fish can find food:

- **Rocky points and reefs close to shore.** Baitfish hide there and snapper, jacks and, with luck, a roosterfish come to hunt.
- **River mouths (bocanas).** Fresh water carries food and draws snook and jacks, especially when the tide is moving.
- **Channels and holes along the beach.** Darker patches between the waves are usually deeper, and fish travel through them.

Respect private property, protected areas and swimmers. If a spot has no-fishing signs, find another one.

## The minimum gear

To start, a spinning combo (rod and reel sold together) around 2 to 3 meters long is enough. A longer rod helps you cast farther from the beach; on rocks, a slightly shorter one is easier to handle.

In your tackle box, carry:

- Hooks in several sizes, including some circle hooks.
- Sinkers in different weights for the bottom and for current.
- Swivels so your line doesn''t twist.
- A couple of spoons (cucharas) and a popper for when you see surface action.
- Pliers, a knife and a rag.

## Bait or lure

With natural bait (sardine, shrimp or a strip of fish) on the bottom, something almost always bites, and it''s the easiest way to learn what a bite feels like. Lures make you move and cast more, but they cover more water. A good plan is to leave one rod with bait and work a second one with a spoon.

## When to go

Early morning and late afternoon are usually the best times. Check the tide table: in general fish bite more while the water is moving than at slack tide. On rocks, watch the rising tide, because it can cut off your way back.

## Basic safety

- Wear shoes with good grip on the rocks; algae is very slippery.
- Never turn your back on the sea on a rocky point.
- Protect yourself from the sun: cap, long-sleeve shirt, sunscreen and plenty of water.
- Tell someone where you''re going, especially if you fish alone.

## One last tip

Be patient. Your first days are for learning to cast, tie knots and read the spot. Log in the app where, when and on what tide you got a bite: after a few trips you''ll start to see patterns.', array['https://www.takemefishing.org/how-to-fish/when-to-fish/best-tide-to-fish/','https://www.baityourhook.com/fishing-in-guanacaste-province-region-cr','https://vacationscostarica.com/fishing/guanacaste-tamarindo','https://www.takemefishing.org/blog/april-2019/lure-fishing-for-beginners-lures-every-angler-should-have/','https://fishcostarica.org/sustainable-fishing-checklist/']),
('pesca-en-kayak', 'technique', 2, 4, 'Pesca en kayak', 'Kayak fishing', 'Cómo empezar a pescar desde un kayak con seguridad, equipo simple y buena organización.', 'How to start fishing from a kayak safely, with simple gear and a well-organized setup.', 'El kayak te lleva a lugares donde no llega la gente de orilla y donde un bote grande no entra: esteros, manglares, bahías tranquilas y las rocas justo afuera de la rompiente. Es silencioso, barato de mantener y muy divertido. Eso sí, pide más planificación que pescar desde tierra.

## Primero, la seguridad

- **Chaleco salvavidas puesto siempre.** No en el compartimiento: puesto. Elige uno cómodo, pensado para remar, con bolsillos.
- **Revisa el clima y el mar antes de salir.** Si el viento o el oleaje aumentan, regresa. En la tarde de la época lluviosa son comunes las tormentas eléctricas.
- **Avisa tu plan.** Dile a alguien dónde vas a entrar y a qué hora piensas volver.
- **Lleva lo esencial:** silbato, agua, protector solar, un cuchillo a mano y el celular en bolsa impermeable.
- **Conoce las mareas y corrientes.** En esteros y bocanas la corriente puede ser más fuerte que tu remada.

Si es tu primera vez, empieza en aguas calmadas y cerca de la orilla, y practica cómo volver a subirte al kayak si te caes.

## El kayak y cómo organizarlo

Para pescar, los kayaks "sit-on-top" (te sientas encima, no adentro) son los más usados porque son estables y fáciles de abordar. Lo importante es que todo tenga su lugar:

- Portacañas para no tener las cañas sueltas.
- Una caja o hielera atrás, bien amarrada.
- Correas o cordones para el remo y las herramientas; lo que no está amarrado, se pierde.

Menos es más: dos cañas y una caja pequeña de señuelos son suficientes.

## Equipo de pesca

Una caña de spinning corta y ligera es lo más práctico en kayak, porque lanzas sentado y en poco espacio. Línea trenzada con un líder de fluorocarbono o mono funciona bien. Lleva:

- Señuelos versátiles: cucharas, plásticos suaves con cabeza plomada y un popper.
- Alicate con cordón y un pañuelo o guante para agarrar el pescado.
- Una red pequeña si vas a soltar peces.

## Cómo pescar desde el kayak

Muchos pescadores avanzan lentamente arrastrando un señuelo detrás del kayak mientras reman; es una forma fácil de encontrar peces. Cuando ves actividad o llegas a una estructura, te detienes y lanzas.

Cuando pica un pez grande, el kayak se mueve con él. Mantén la calma, apunta la punta del kayak hacia el pez y deja que el freno del carrete trabaje. No te pongas de pie a menos que tu kayak esté hecho para eso y tengas práctica.

## Dónde probar en Costa Rica

Bahías protegidas del Pacífico, esteros con manglar y lagunas como Arenal son buenos lugares para empezar, siempre respetando las áreas protegidas y las reglas de cada sitio. Evita entrar por zonas de mucha ola hasta que tengas experiencia.', 'A kayak takes you where shore anglers can''t reach and big boats can''t fit: estuaries, mangroves, calm bays and the rocks just outside the surf. It''s quiet, cheap to maintain and a lot of fun. It does, however, take more planning than fishing from land.

## Safety first

- **Wear your life jacket at all times.** Not stowed in a hatch: on you. Choose a comfortable one designed for paddling, with pockets.
- **Check the weather and sea before you go.** If wind or swell picks up, head back. Afternoon thunderstorms are common in the rainy season.
- **Share your plan.** Tell someone where you''re launching and when you expect to be back.
- **Bring the essentials:** a whistle, water, sunscreen, a knife within reach and your phone in a dry bag.
- **Know the tides and currents.** In estuaries and river mouths the current can be stronger than your paddling.

If it''s your first time, start in calm water close to shore and practice getting back on the kayak after a fall.

## The kayak and how to rig it

For fishing, sit-on-top kayaks are the most common because they''re stable and easy to get back on. The key is that everything has its place:

- Rod holders so your rods aren''t loose.
- A crate or cooler in the back, well secured.
- Leashes for your paddle and tools; anything that isn''t tied down gets lost.

Less is more: two rods and a small lure box are enough.

## Fishing gear

A short, light spinning rod is the most practical choice, since you cast sitting down in a small space. Braided line with a fluorocarbon or mono leader works well. Bring:

- Versatile lures: spoons, soft plastics on jig heads and a popper.
- Pliers on a lanyard and a towel or glove to hold the fish.
- A small net if you plan to release fish.

## How to fish from a kayak

Many anglers move slowly while trolling a lure behind the kayak as they paddle; it''s an easy way to find fish. When you see activity or reach structure, stop and cast.

When a big fish bites, the kayak moves with it. Stay calm, point the bow toward the fish and let the reel''s drag do the work. Don''t stand up unless your kayak is built for it and you''ve practiced.

## Where to try in Costa Rica

Sheltered Pacific bays, mangrove estuaries and lakes such as Arenal are good places to start, always respecting protected areas and each site''s rules. Avoid launching through heavy surf until you have experience.', array['https://www.sailmagazine.com/review/kayaking-fishing-safety-tips/','https://bendingbranches.com/blogs/resources/top-10-kayak-fishing-safety-tips','https://fishtalkmag.com/blog/10-tips-beginner-kayak-fishing-anglers','https://www.baityourhook.com/fishing-in-guanacaste-province-region-cr']),
('troleo-en-altamar-dorado-y-pez-vela', 'technique', 3, 5, 'Troleo en altamar para dorado y pez vela', 'Offshore trolling for dorado and sailfish', 'Cómo funciona un día de troleo en el Pacífico: dónde buscar, qué se arrastra y qué hacer cuando pica.', 'How an offshore trolling day works in the Pacific: where to look, what to pull and what to do on a strike.', 'El troleo es la técnica clásica de la pesca deportiva en altamar: el bote avanza despacio arrastrando carnadas o señuelos detrás, y los peces los persiguen. En el Pacífico costarricense es la forma más común de buscar pez vela y dorado, y muchas veces también sale atún o marlín.

## Cómo es un día típico

Casi todos los viajes salen temprano desde lugares como Quepos, Golfito, Playas del Coco, Tamarindo o Los Sueños. El capitán navega hasta donde cree que están los peces, que a veces es cerca y a veces muy afuera, y ahí empieza a trolear.

Detrás del bote se arma un "spread": varias líneas a distintas distancias, algunas con señuelos y otras con carnada natural como el ballyhoo (balajú). Los tangones abren las líneas hacia los lados para que no se enreden. Para el pez vela también se usan "teasers", señuelos sin anzuelo que llaman la atención del pez y lo acercan.

## Dónde buscar

Los capitanes no trolean al azar. Buscan señales:

- **Basura flotante y líneas de algas.** El dorado se refugia bajo troncos, ramas y cualquier cosa que flote, porque ahí se juntan peces pequeños.
- **Aves.** Las tijeretas (fragatas) volando en círculos o lanzándose al agua suelen marcar comida, y donde hay comida hay depredadores.
- **Cambios de color del agua.** La línea entre el agua verde y el agua azul es una zona donde se concentran carnadas.
- **Cardúmenes en la superficie.** Agua "hirviendo" o saltos de sardina.

## Dorado

El dorado es rápido, colorido y muy bueno para comer. Además de trolear, cuando el capitán encuentra un tronco con dorado a veces conviene detenerse y lanzar señuelos o carnada directamente. Si sacas uno, deja uno en el agua enganchado un rato: el resto del cardumen suele quedarse cerca.

## Pez vela

El pez vela es la estrella del Pacífico. Muchas veces se ve llegar al spread con la aleta afuera. Cuando ataca un teaser, la tripulación lo jala hacia el bote y le presenta una carnada con anzuelo circular. Con anzuelo circular no se "clava" con un tirón fuerte: se deja que el pez se lleve la carnada, se cierra el carrete y la línea se tensa sola para que el anzuelo se acomode en la comisura de la boca.

Recuerda: en Costa Rica el pez vela y el marlín se pescan para soltar. Se liberan en el agua, sin subirlos al bote.

## Qué hacer tú como pescador

- Escucha al capitán y a los marineros; ellos coordinan todo.
- Cuando te pasen la caña, mantén la punta arriba y la línea tensa.
- No aprietes el freno a lo loco; deja que el pez corra y recupera cuando pare.
- Toma agua, usa bloqueador y ten a mano algo para el mareo si lo necesitas.

## Temporadas

Hay pez vela todo el año en el Pacífico, pero la temporada fuerte cambia por zona: en el Pacífico central suele ser en los meses secos, y en el norte es mejor a mitad de año. El dorado es más común en la época lluviosa, cuando los ríos llevan troncos y basura al mar. Pregunta al capitán cómo ha estado la pesca las últimas semanas.', 'Trolling is the classic offshore sport-fishing technique: the boat moves slowly while pulling baits or lures behind it, and fish chase them. On Costa Rica''s Pacific coast it''s the most common way to target sailfish and dorado, and tuna or marlin often show up too.

## What a typical day looks like

Most trips leave early from places like Quepos, Golfito, Playas del Coco, Tamarindo or Los Sueños. The captain runs to wherever he thinks the fish are, sometimes close in and sometimes far offshore, and starts trolling there.

Behind the boat goes a "spread": several lines at different distances, some with lures and some with natural bait such as ballyhoo. Outriggers spread the lines to the sides so they don''t tangle. For sailfish, crews also use teasers, hookless lures that get the fish''s attention and draw it closer.

## Where to look

Captains don''t troll at random. They look for signs:

- **Floating debris and weed lines.** Dorado hide under logs, branches and anything that floats, because small fish gather there.
- **Birds.** Frigatebirds circling or diving usually mark food, and where there''s food there are predators.
- **Color changes.** The edge between green and blue water is a zone where bait concentrates.
- **Surface schools.** "Boiling" water or jumping sardines.

## Dorado

Dorado are fast, colorful and excellent to eat. Besides trolling, when the captain finds a log holding dorado it can pay to stop and cast lures or bait right at it. If you hook one, keep it in the water on the line for a while: the rest of the school tends to stay close.

## Sailfish

Sailfish are the stars of the Pacific. Often you''ll see one come up into the spread with its fin out. When it attacks a teaser, the crew pulls the teaser toward the boat and presents a bait on a circle hook. With a circle hook you don''t set the hook with a hard jerk: you let the fish take the bait, engage the reel and let the line come tight so the hook settles into the corner of the mouth.

Remember: in Costa Rica sailfish and marlin are catch-and-release. They''re released in the water, without bringing them aboard.

## What you do as the angler

- Listen to the captain and mates; they run the show.
- When they hand you the rod, keep the tip up and the line tight.
- Don''t crank down the drag in a panic; let the fish run and gain line when it stops.
- Drink water, wear sunscreen and bring seasickness medicine if you need it.

## Seasons

There are sailfish in the Pacific year-round, but the peak season varies by area: in the central Pacific it''s usually the dry months, while the north is better mid-year. Dorado are more common in the rainy season, when rivers wash logs and debris out to sea. Ask your captain how fishing has been over the last few weeks.', array['https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map','https://fishingbooker.com/blog/costa-rica-fishing-seasons/','https://castandspear.com/dorado-fish/','https://www.vacationscostarica.com/fishing/species/mahi-mahi-dorado/','https://sportfishingmag.com/fishing-northern-costa-ricas-pacific-coast','https://thetackleroom.com/blogs/news/how-to-read-offshore-water-color-temperature-and-current','https://fishcostarica.org/sustainable-fishing-checklist/']),
('pesca-en-rio-y-lago', 'technique', 4, 4, 'Pesca en río y lago: guapote y machaca', 'River and lake fishing: guapote and machaca', 'Cómo buscar guapote y machaca en ríos y lagos de Costa Rica, con equipo liviano y mucho cuidado al soltar.', 'How to find guapote and machaca in Costa Rica''s rivers and lakes, with light tackle and careful releases.', 'No todo es mar. Costa Rica tiene ríos, lagunas y embalses con peces que pelean muy bien en equipo liviano. Los dos más buscados son el guapote y la machaca.

## El guapote

El guapote (guapote arcoíris o "rainbow bass") es un cíclido depredador, agresivo y muy bonito. El lugar más famoso para buscarlo es el lago Arenal, pero también vive en ríos y lagunas de las tierras bajas. En Arenal lo común son peces pequeños y medianos, con alguno grande de vez en cuando.

**Dónde está:** pegado a estructura. Troncos hundidos, árboles caídos, piedras, orillas con raíces y cambios de profundidad. Le gusta emboscar.

**Cómo pescarlo:**

- Señuelos de media agua y de fondo: crankbaits (muchos les dicen "rapalas"), plásticos suaves y jigs.
- En lugares hondos, como partes de Arenal, se usa jigging vertical o troleo lento con crankbaits que bajan profundo.
- En la mañana o con poca luz, un popper o un señuelo de superficie cerca de la orilla puede dar piques muy emocionantes.

## La machaca

La machaca es pariente lejana de las pirañas, pero come sobre todo frutas, semillas y flores que caen al río. Por eso vive en ríos con árboles en la orilla. Es rápida, salta mucho y es difícil de clavar porque tiene la boca dura.

**Cómo pescarla:**

- Con mosca: los pescadores de mosca usan imitaciones de frutas o bayas de foam que flotan.
- Con spinning: popper pequeño, señuelos de superficie o cucharas pequeñas lanzadas bajo los árboles.
- Fíjate dónde caen frutas o dónde ves movimientos en la superficie; ahí suelen estar.

## Equipo

Una caña de spinning ligera o media-ligera, con línea de 6 a 12 libras, es suficiente para la mayoría de los peces de agua dulce. En ríos con troncos y piedras, un líder un poco más grueso te salva señuelos. Si pescas con mosca, una caña de peso 5 a 7 es un buen punto de partida.

## Leer el río

- Pesca donde el agua corre más lenta junto a una corriente rápida: ahí los peces esperan comida.
- Las pozas debajo de los rápidos y las curvas del río suelen tener peces.
- Después de lluvias fuertes el río se pone turbio y crecido; espera a que baje y aclare.
- Nunca cruces un río crecido. La corriente sube rápido en época lluviosa.

## Soltar con cuidado

La machaca es muy delicada: se muere fácil si la manipulas mucho o la tienes mucho tiempo fuera del agua. Suéltala rápido, con las manos mojadas y sin apretarla. Los guapotes grandes también vale la pena soltarlos para que sigan reproduciéndose.

## Reglas

Algunas zonas, como refugios de vida silvestre o parques nacionales, tienen reglas y vedas propias, o no permiten pescar. Infórmate antes de ir y pide permiso si el acceso es por una finca privada.', 'It''s not all saltwater. Costa Rica has rivers, lagoons and reservoirs with fish that fight hard on light tackle. The two most sought after are guapote and machaca.

## Guapote

Guapote (rainbow bass) is a predatory cichlid, aggressive and beautiful. The best-known place to fish for it is Lake Arenal, but it also lives in lowland rivers and lagoons. At Arenal most fish are small to medium, with a big one now and then.

**Where it lives:** tight to structure. Sunken logs, fallen trees, rocks, rooty banks and depth changes. It likes to ambush.

**How to fish it:**

- Mid-depth and bottom lures: crankbaits (many locals call them "rapalas"), soft plastics and jigs.
- In deep water, such as parts of Arenal, anglers vertical-jig or slow-troll deep-diving crankbaits.
- In the morning or in low light, a popper or topwater lure near the bank can bring exciting strikes.

## Machaca

Machaca are distant relatives of piranhas, but they mostly eat fruit, seeds and flowers that fall into the river. That''s why they live in rivers with trees along the banks. They''re fast, jump a lot and are hard to hook because of their bony mouths.

**How to fish it:**

- On the fly: fly anglers use floating foam fruit or berry imitations.
- On spinning gear: a small popper, topwater lures or small spoons cast under overhanging trees.
- Watch where fruit is falling or where you see surface swirls; that''s usually where they are.

## Gear

A light or medium-light spinning rod with 6 to 12 lb line handles most freshwater fish. In rivers full of logs and rocks, a slightly heavier leader saves lures. If you fly fish, a 5 to 7 weight rod is a good starting point.

## Reading the river

- Fish where slow water meets a faster current: fish wait there for food.
- Pools below rapids and bends in the river usually hold fish.
- After heavy rain the river runs muddy and high; wait for it to drop and clear.
- Never cross a swollen river. Water rises fast in the rainy season.

## Release with care

Machaca are very delicate: they die easily if handled too much or kept out of the water too long. Release them quickly, with wet hands and without squeezing. Big guapote are also worth releasing so they keep breeding.

## Rules

Some areas, such as wildlife refuges or national parks, have their own rules and closed seasons, or don''t allow fishing at all. Check before you go, and ask permission if access is through private land.', array['https://www.twoweeksincostarica.com/fishing-lake-arenal/','https://flylordsmag.com/fishing-the-jungle-costa-rica-species-guide/','https://fishcostarica.org/2020/09/remote-costa-rica-jungle-river-fishing-in-search-of-mogas/','https://yamahaoutboards.com/blog/fishing/reading-the-water-freshwater-edition','https://www.takemefishing.org/blog/april-2019/lure-fishing-for-beginners-lures-every-angler-should-have/']),
('como-elegir-cana-y-carrete', 'technique', 5, 5, 'Cómo elegir caña y carrete', 'How to choose a rod and reel', 'Spinning, casting o convencional: qué es cada uno, para qué sirve y cuál conviene para empezar.', 'Spinning, baitcasting or conventional: what each one is, what it''s for and which to start with.', 'Entrar a una tienda de pesca puede confundir: hay cañas de todos los largos y carretes de mil formas. La buena noticia es que casi todo se reduce a tres tipos de carrete y a escoger una caña que combine con él.

## Spinning

Es el carrete que cuelga debajo de la caña, con un arco de metal (el "bail") que se abre para lanzar.

- **Ventajas:** fácil de aprender, casi no se enreda al lanzar y funciona bien con señuelos y carnadas livianas.
- **Desventajas:** con peces muy grandes o líneas muy gruesas tiene menos fuerza que un convencional.
- **Ideal para:** orilla, kayak, río, lago y pesca costera ligera. Si vas a tener un solo equipo, que sea este.

## Casting (baitcasting)

Va encima de la caña y la línea sale de un carrete que gira al lanzar. Controlas el lanzamiento con el pulgar.

- **Ventajas:** más precisión, más control y mejor manejo de señuelos pesados y líneas gruesas.
- **Desventajas:** cuesta aprender. Si no frenas el carrete a tiempo con el pulgar se forma una "peluca" (un enredo).
- **Ideal para:** guapote con señuelos pesados, pesca de precisión cerca de estructura y pescadores con algo de experiencia.

## Convencional

También va encima de la caña, pero es más grande y robusto. No está pensado para lanzar lejos, sino para aguantar peces grandes.

- **Ventajas:** potencia, capacidad de línea y frenos fuertes.
- **Desventajas:** pesado y poco práctico para lanzar señuelos livianos.
- **Ideal para:** troleo en altamar, pesca de fondo en bote y peces grandes como atún, pez vela o pargos de profundidad.

## La caña

La caña tiene que combinar con el carrete: las de spinning tienen guías grandes por debajo y las de casting o convencional tienen guías pequeñas por encima. Revisa la etiqueta; casi siempre dice el tipo.

Fíjate en tres datos:

- **Largo.** Más larga lanza más lejos (útil en playa); más corta da más control (útil en kayak, bote o entre árboles).
- **Potencia.** Qué tanta fuerza aguanta: ligera, media, pesada. Combínala con el peso de línea recomendado que trae impreso.
- **Acción.** Dónde se dobla. Acción rápida se dobla solo en la punta y da más sensibilidad; acción lenta se dobla en toda la caña y perdona más los errores.

## Recomendación para empezar

Un combo de spinning de potencia media, de 2 a 2,7 metros, con un carrete mediano, te sirve para la mayoría de la pesca de orilla, ríos y lagos en Costa Rica. Ponle línea de unas 10 a 20 libras, según el lugar.

Cuando ya pesques seguido, suma un segundo equipo: uno más liviano para río o uno más pesado para rocas y bote.

## Cuidados básicos

- Enjuaga caña y carrete con agua dulce después de pescar en el mar. La sal corroe todo.
- Afloja el freno del carrete cuando lo guardes.
- Guarda las cañas sin peso encima y lejos del sol directo.', 'Walking into a tackle shop can be confusing: rods come in every length and reels in a thousand shapes. The good news is that it mostly comes down to three reel types and choosing a rod that matches.

## Spinning

This reel hangs under the rod and has a metal arm (the "bail") that opens for casting.

- **Pros:** easy to learn, rarely tangles on the cast and works well with light lures and baits.
- **Cons:** with very big fish or heavy line it has less muscle than a conventional reel.
- **Best for:** shore, kayak, river, lake and light inshore fishing. If you''re going to own one setup, make it this one.

## Baitcasting

It sits on top of the rod and the line comes off a spool that turns as you cast. You control the cast with your thumb.

- **Pros:** more accuracy, more control and better handling of heavy lures and thick lines.
- **Cons:** it takes practice. If you don''t stop the spool with your thumb in time, you get a backlash (a "bird''s nest").
- **Best for:** guapote with heavy lures, precise casting around structure and anglers with some experience.

## Conventional

Also mounted on top of the rod, but bigger and sturdier. It''s not designed for long casts; it''s built to handle big fish.

- **Pros:** power, line capacity and strong drags.
- **Cons:** heavy and impractical for casting light lures.
- **Best for:** offshore trolling, bottom fishing from a boat and big fish like tuna, sailfish or deep-water snapper.

## The rod

The rod must match the reel: spinning rods have large guides underneath, while baitcasting and conventional rods have smaller guides on top. Check the label; it usually says which type.

Look at three things:

- **Length.** Longer casts farther (useful on the beach); shorter gives more control (useful in a kayak, boat or under trees).
- **Power.** How much load it handles: light, medium, heavy. Match it to the line rating printed on the blank.
- **Action.** Where it bends. Fast action bends near the tip and gives more sensitivity; slow action bends through the whole rod and is more forgiving.

## A recommendation to start

A medium-power spinning combo, 2 to 2.7 meters long, with a mid-size reel, covers most shore, river and lake fishing in Costa Rica. Spool it with roughly 10 to 20 lb line, depending on where you fish.

Once you fish often, add a second setup: a lighter one for rivers or a heavier one for rocks and boats.

## Basic care

- Rinse your rod and reel with fresh water after fishing in the sea. Salt corrodes everything.
- Back off the reel''s drag when you store it.
- Store rods with nothing resting on them and out of direct sun.', array['https://advnture.com/how-to/choose-a-fishing-reel','https://www.sailmagazine.com/review/fishing-reel-types/','https://castandspear.com/types-of-fishing-reels']),
('lineas-y-lideres', 'technique', 6, 4, 'Líneas y líderes: mono, fluoro y trenzado', 'Lines and leaders: mono, fluoro and braid', 'Las diferencias entre monofilamento, fluorocarbono y trenzado, y cuándo conviene usar un líder.', 'The differences between monofilament, fluorocarbon and braid, and when to use a leader.', 'La línea es lo único que te conecta con el pez, así que vale la pena entenderla. Hay tres tipos principales y cada uno tiene su lugar.

## Monofilamento (el "nylon")

Es la línea de toda la vida: un solo filamento de nylon.

- **Estira bastante.** Eso perdona errores y amortigua los cabezazos del pez, pero también te quita sensibilidad y hace más difícil clavar a distancia.
- **Flota o se hunde muy despacio,** lo que la hace buena para señuelos de superficie.
- **Es barata y fácil de amarrar.**
- Con el sol y el tiempo se pone tiesa y pierde fuerza, así que hay que cambiarla seguido.

Es una muy buena opción para empezar y para la mayoría de la pesca de orilla.

## Fluorocarbono

Parece mono, pero es otro material.

- **Es menos visible bajo el agua** que el mono, porque refleja la luz de forma parecida al agua.
- **Es más resistente a la abrasión,** es decir, aguanta mejor el roce con piedras, conchas y dientes.
- **Se hunde más rápido** y estira menos que el mono.
- Es más cara y algo más rígida, así que los nudos hay que hacerlos con cuidado y bien mojados.

Por todo eso, el uso más común del fluoro es como líder.

## Trenzado

Son varias fibras tejidas entre sí.

- **Casi no estira.** Sientes todo: cada toque, cada piedra. Clavas mejor a distancia.
- **Es muy delgado para su fuerza,** así que te cabe más línea en el carrete y lanzas más lejos.
- **Flota** y es la más visible de las tres.
- Se corta con el roce contra piedras y no se lleva bien con los dientes, y algunos nudos se resbalan.

Es ideal para pescar con señuelos, en kayak y en lugares hondos, pero casi siempre se usa con líder.

## ¿Qué es un líder?

Es un tramo de línea distinta que se amarra al final de la línea principal, antes del anzuelo o señuelo. Sirve para:

- **Esconder la línea:** un líder de fluoro es menos visible que el trenzado.
- **Aguantar roce:** contra rocas, arrecife, bocas ásperas o la cola de un pez.
- **Agregar algo de elasticidad** cuando la línea principal es trenzado.

Un líder de un metro aproximadamente es un punto de partida común; en altamar se usan más largos y gruesos. Para peces con dientes filosos, como la macarela o la sierra, a veces se usa un tramo corto de cable.

## Combinaciones prácticas

- **Orilla y principiantes:** mono en el carrete, y si hay rocas, un líder de fluoro más grueso.
- **Señuelos, kayak, río y lago:** trenzado con líder de fluoro.
- **Altamar:** lo define el capitán según la especie; normalmente mono o trenzado con líderes gruesos.

## Cuidados

- Revisa los últimos metros de línea después de cada pez o cada enganche; si está raspada, corta y vuelve a amarrar.
- Moja los nudos antes de apretarlos.
- No tires línea vieja al agua ni en la playa: atrapa aves, tortugas y peces. Llévala a la basura.', 'Your line is the only thing connecting you to the fish, so it''s worth understanding. There are three main types and each one has its place.

## Monofilament ("nylon")

The classic: a single strand of nylon.

- **It stretches a lot.** That forgives mistakes and cushions head shakes, but it also costs you sensitivity and makes long-distance hook sets harder.
- **It floats or sinks very slowly,** which makes it good for topwater lures.
- **It''s cheap and easy to tie.**
- Sun and time make it stiff and weaker, so it needs replacing often.

It''s a great choice to start with and for most shore fishing.

## Fluorocarbon

It looks like mono, but it''s a different material.

- **It''s less visible underwater** than mono, because it bends light in a way similar to water.
- **It''s more abrasion-resistant,** meaning it handles rubbing against rocks, shells and teeth better.
- **It sinks faster** and stretches less than mono.
- It''s pricier and a bit stiffer, so tie knots carefully and wet them well.

Because of all that, the most common use for fluoro is as a leader.

## Braid

Several fibers woven together.

- **It barely stretches.** You feel everything: every tap, every rock. Hook sets at distance are better.
- **It''s very thin for its strength,** so your reel holds more line and you cast farther.
- **It floats** and is the most visible of the three.
- It can be cut by rubbing against rocks, doesn''t handle teeth well, and some knots slip.

It''s ideal for lure fishing, kayaks and deep water, but it''s almost always used with a leader.

## What''s a leader?

A section of different line tied to the end of your main line, before the hook or lure. It''s there to:

- **Hide the line:** a fluoro leader is less visible than braid.
- **Handle abrasion:** from rocks, reef, rough mouths or a fish''s tail.
- **Add some stretch** when the main line is braid.

A leader of about a meter is a common starting point; offshore anglers use longer, heavier ones. For fish with sharp teeth, like mackerel, a short piece of wire is sometimes used.

## Practical combinations

- **Shore and beginners:** mono on the reel, and if there are rocks, a heavier fluoro leader.
- **Lures, kayak, river and lake:** braid with a fluoro leader.
- **Offshore:** the captain decides by species; usually mono or braid with heavy leaders.

## Care

- Check the last few meters of line after every fish or snag; if it''s scuffed, cut and retie.
- Wet your knots before cinching them.
- Don''t toss old line in the water or on the beach: it traps birds, turtles and fish. Put it in the trash.', array['https://www.rapala.eu/eu_en/blog/mono-fluorocarbon-or-braid-how-to-choose-the-right-fishing-line','https://www.aftco.com/blogs/tackle-how-to/how-to-choose-types-of-fishing-line','https://www.wired2fish.com/tackle-tips/braid-vs-monofilament-fishing-lines-and-when-to-use-each','https://realtree.com/fishing/fluorocarbon-braid-or-mono-which-fishing-line-works-best']),
('senuelos-basicos', 'technique', 7, 5, 'Señuelos básicos y cuándo usar cada uno', 'Basic lures and when to use each one', 'Cucharas, poppers, crankbaits, plásticos suaves y jigs: qué imitan y en qué situaciones funcionan mejor.', 'Spoons, poppers, crankbaits, soft plastics and jigs: what they imitate and when each one works best.', 'Un señuelo es una imitación de comida. No necesitas cien: con cinco tipos bien escogidos puedes pescar casi cualquier lugar de Costa Rica. La clave es saber a qué profundidad trabaja cada uno y qué pez quieres engañar.

## Cuchara

Una lámina de metal curva que se mueve y brilla como un pez pequeño.

- **Cuándo:** cuando necesitas lanzar lejos, hay viento o ves peces comiendo a distancia.
- **Dónde:** playa, rocas, muelles y desde bote.
- **Cómo:** lánzala, déjala bajar un poco y recoge a ritmo constante. Prueba distintas velocidades.
- **Para:** jureles, macarelas, róbalos, pargos y muchos más.

## Popper y señuelos de superficie

Flotan y hacen ruido o salpican agua al moverlos. El popper tiene la cara cóncava que "escupe" agua; otros, como los de tipo "walk the dog", se mueven en zigzag.

- **Cuándo:** con poca luz (madrugada y atardecer), con agua calmada o cuando ves peces persiguiendo carnada en la superficie.
- **Cómo:** dale tirones cortos con la punta de la caña y haz pausas. Muchos piques llegan en la pausa.
- **Para:** jureles, pez gallo, guapote y machaca. Los piques en superficie son de lo más emocionante que hay.

## Crankbait (los famosos "rapalas")

Un pez artificial con una paleta en la nariz que lo hace bajar y vibrar al recogerlo.

- **Cuándo:** para buscar peces a una profundidad específica, cubriendo bastante agua.
- **Cómo:** el tamaño y la forma de la paleta definen qué tan hondo baja. Paleta corta: poco profundo; paleta larga: más hondo.
- **Para:** guapote en lagos y ríos, róbalo, y también para trolear despacio.

## Plásticos suaves

Imitaciones de goma de peces, camarones o gusanos, montadas en una cabeza plomada o un anzuelo.

- **Cuándo:** cuando los peces están difíciles o necesitas una presentación más lenta y natural.
- **Cómo:** sirven a cualquier profundidad según el peso de la cabeza. Un consejo común: colores claros en días soleados y más oscuros en días nublados.
- **Para:** casi todo en agua dulce y en la costa: róbalo, guapote, pargo.

## Jig

Un señuelo pesado que baja rápido. Los hay pequeños con plumas o goma y jigs metálicos largos para pesca en profundidad.

- **Cuándo:** cuando los peces están en el fondo o en agua honda.
- **Cómo:** déjalo bajar hasta el fondo, luego levanta la punta de la caña y deja que vuelva a caer. Muchos piques son en la caída.
- **Para:** pargos, meros y atunes desde bote; guapote en Arenal.

## Cómo escoger el del día

1. **¿Dónde están los peces?** Si ves actividad arriba, superficie. Si no, empieza a media agua y luego baja.
2. **¿Qué comen?** Si hay sardina, usa algo plateado y delgado. Si hay camarón, prueba un plástico.
3. **¿Cómo está el agua?** Clara: colores naturales y movimientos suaves. Turbia: colores más fuertes y señuelos que hagan ruido o vibren.
4. **Cambia si no pasa nada.** Prueba otra profundidad, velocidad o color antes de irte.

Revisa los anzuelos de tus señuelos: si están oxidados o doblados, cámbialos.', 'A lure is an imitation of food. You don''t need a hundred: with five well-chosen types you can fish almost anywhere in Costa Rica. The key is knowing what depth each one works at and which fish you want to fool.

## Spoon (cuchara)

A curved metal blade that wobbles and flashes like a small fish.

- **When:** when you need to cast far, it''s windy, or you see fish feeding at a distance.
- **Where:** beaches, rocks, piers and from a boat.
- **How:** cast, let it sink a bit and retrieve at a steady pace. Try different speeds.
- **For:** jacks, mackerel, snook, snapper and much more.

## Poppers and topwater lures

They float and make noise or splash when you work them. A popper has a cupped face that "spits" water; others, like walk-the-dog lures, zigzag across the surface.

- **When:** in low light (dawn and dusk), on calm water, or when you see fish chasing bait on top.
- **How:** give short twitches with the rod tip and pause. Many strikes come during the pause.
- **For:** jacks, roosterfish, guapote and machaca. Topwater strikes are some of the most exciting in fishing.

## Crankbait (the famous "rapalas")

A hard artificial fish with a lip on its nose that makes it dive and wobble on the retrieve.

- **When:** to target fish at a specific depth while covering a lot of water.
- **How:** the size and shape of the lip set how deep it runs. Short lip: shallow; long lip: deeper.
- **For:** guapote in lakes and rivers, snook, and slow trolling.

## Soft plastics

Rubber imitations of fish, shrimp or worms, rigged on a jig head or a hook.

- **When:** when fish are picky or you need a slower, more natural presentation.
- **How:** they work at any depth depending on the head weight. A common tip: lighter colors on sunny days and darker ones on cloudy days.
- **For:** almost everything in freshwater and inshore: snook, guapote, snapper.

## Jig

A heavy lure that sinks fast. There are small ones with feathers or rubber, and long metal jigs for deep water.

- **When:** when fish are on the bottom or in deep water.
- **How:** let it drop to the bottom, lift the rod tip and let it fall again. Many strikes come on the fall.
- **For:** snapper, grouper and tuna from a boat; guapote at Arenal.

## How to choose today''s lure

1. **Where are the fish?** If you see surface action, go topwater. If not, start mid-depth and then go deeper.
2. **What are they eating?** If there are sardines, use something silver and slim. If there''s shrimp, try a soft plastic.
3. **How''s the water?** Clear: natural colors and subtle action. Murky: brighter colors and lures that rattle or vibrate.
4. **Change if nothing happens.** Try another depth, speed or color before you leave.

Check the hooks on your lures: if they''re rusty or bent, replace them.', array['https://www.takemefishing.org/blog/april-2019/lure-fishing-for-beginners-lures-every-angler-should-have/','https://mdc.mo.gov/magazines/xplor/2025-03/lure-lures','https://www.sportsmanswarehouse.com/learn/fishing/most-common-types-of-fishing-lures','https://fishanywhere.com/blog/the-different-types-of-fishing-lures']),
('captura-y-suelta', 'technique', 8, 5, 'Captura y suelta bien hecha', 'Catch and release done right', 'Anzuelos circulares, manejo correcto y foto rápida para que el pez que sueltas de verdad sobreviva.', 'Circle hooks, proper handling and a quick photo so the fish you release actually survives.', 'Soltar un pez no es solo devolverlo al agua. Si lo peleas demasiado, lo sacas mucho tiempo o lo agarras mal, puede morir después aunque se vaya nadando. Con unos cuantos hábitos simples, tus liberaciones sí cuentan.

## Antes de pescar: el equipo correcto

- **Anzuelos circulares.** Tienen la punta curvada hacia adentro y tienden a clavar en la comisura de la boca, no en la garganta ni en el estómago. Con carnada viva son la norma en Costa Rica.
- **Equipo adecuado al pez.** Una pelea muy larga agota al pez. Usa una caña y línea con las que puedas traerlo en un tiempo razonable.
- **Herramientas a mano:** alicate, desanzuelador, cortador y un pañuelo húmedo o guantes.
- Aplanar la rebaba (barbilla) del anzuelo facilita mucho sacarlo.

## Durante la pelea

Con anzuelo circular no se clava con un tirón fuerte. Deja que el pez tome la carnada, recoge y la línea se tensa sola. Después, pelea con firmeza: un pez que llega cansado pero no agotado se recupera mucho mejor.

## Peces de pico: siempre en el agua

En el Pacífico de Costa Rica, el pez vela y el marlín se pescan para soltar, y la normativa de INCOPESCA (AJDIP/280-2014) exige liberarlos sin sacarlos del agua. Nada de subirlos al bote ni ponerlos en las piernas para la foto.

Los marineros los toman del pico con guantes, junto al costado del bote. Si el pez llega muy cansado, lo mantienen en el agua con el bote avanzando despacio para que el agua le pase por las agallas, hasta que recupere color y fuerza. El pez gallo también debe liberarse.

## Manejo de otros peces

- **Mójate las manos** antes de tocar el pez. Las manos secas y las toallas le quitan la baba que lo protege de infecciones.
- **No lo aprietes** ni metas los dedos en las agallas.
- **Sosténlo horizontal,** con una mano bajo la cabeza y otra cerca de la cola. Colgar un pez grande solo de la boca puede lastimarlo.
- **Que no toque arena caliente** ni la cubierta del bote.

Si el anzuelo está muy adentro, corta la línea lo más cerca posible. Muchas veces es mejor que forcejear.

## La foto rápida

- Ten la cámara lista **antes** de sacar el pez.
- Sácalo solo unos segundos, toma un par de fotos y devuélvelo. Si no está listo, devuélvelo al agua y vuelve a intentar.
- Con peces de pico, la foto se toma con el pez en el agua, inclinándote por el costado del bote.

## La liberación

Coloca el pez en el agua con la cabeza contra la corriente y sostenlo suavemente hasta que se vaya solo. No lo tires al agua. Si está débil, dale tiempo; en el río, ponlo en agua tranquila pero con algo de corriente.

## Por qué vale la pena

Los peces que sueltas pueden crecer, reproducirse y volver a pelear con otro pescador. La pesca deportiva en Costa Rica depende de que haya peces mañana. Registra tus liberaciones en la app: también cuentan como capturas.', 'Releasing a fish is more than putting it back in the water. If you fight it too long, keep it out too long or grip it badly, it can die later even if it swims away. A few simple habits make your releases count.

## Before you fish: the right gear

- **Circle hooks.** Their point curves inward and they tend to hook in the corner of the mouth, not the throat or gut. With live bait they''re the norm in Costa Rica.
- **Tackle matched to the fish.** A very long fight exhausts the fish. Use a rod and line that let you land it in a reasonable time.
- **Tools within reach:** pliers, a dehooker, a cutter and a wet towel or gloves.
- Crushing the barb on the hook makes removal much easier.

## During the fight

With a circle hook you don''t set the hook with a hard jerk. Let the fish take the bait, reel, and the line comes tight on its own. Then fight firmly: a fish that arrives tired but not exhausted recovers far better.

## Billfish: always in the water

On Costa Rica''s Pacific coast, sailfish and marlin are catch-and-release, and INCOPESCA regulations (AJDIP/280-2014) require releasing them without taking them out of the water. No hauling them aboard or laying them across your lap for a photo.

The mates hold them by the bill with gloves, alongside the boat. If the fish comes in very tired, they keep it in the water with the boat moving slowly forward so water flows over its gills, until it regains color and strength. Roosterfish must be released too.

## Handling other fish

- **Wet your hands** before touching the fish. Dry hands and towels strip the slime that protects it from infection.
- **Don''t squeeze it** or put your fingers in the gills.
- **Hold it horizontally,** one hand under the head and one near the tail. Hanging a big fish by its jaw alone can injure it.
- **Keep it off hot sand** and the boat deck.

If the hook is deep, cut the line as close as you can. That''s often better than digging for it.

## The quick photo

- Have the camera ready **before** you lift the fish.
- Take it out for just a few seconds, snap a couple of photos and put it back. If you''re not ready, put it back in the water and try again.
- With billfish, the photo is taken with the fish in the water while you lean over the side of the boat.

## The release

Place the fish in the water facing into the current and hold it gently until it swims off on its own. Don''t throw it. If it''s weak, give it time; in a river, set it in calm water that still has some flow.

## Why it matters

Fish you release can grow, spawn and fight another angler another day. Sport fishing in Costa Rica depends on there being fish tomorrow. Log your releases in the app: they count as catches too.', array['https://fishcostarica.org/sustainable-fishing-checklist/','https://fishcostarica.org/your-dream-photo-isnt-worth-it-leave-the-fish-in-the-water/','https://www.incopesca.go.cr/acerca_incopesca/transparencia_institucional/jerarcas_decisiones/acuerdos/AJDIP-280-2014_Medidas_ordenamiento_carnada_viva.pdf','https://www.thefisherman.com/article/noaa-reminder-on-careful-catch-and-hms-release/','https://www.mercurymarine.com/an/en/lifestyle/dockline/how-to-properly-handle-a-billfish','https://www.wlf.louisiana.gov/page/best-fishing-practices']),
('mareas-cuando-pican-mas', 'where_when', 9, 4, 'Mareas: cuándo pican más', 'Tides: when fish bite best', 'Cómo leer una tabla de mareas y por qué el agua en movimiento suele dar mejores piques.', 'How to read a tide table and why moving water usually means better fishing.', 'Si pescas en el mar, en un estero o en una bocana, la marea es probablemente lo que más influye en el pique. No hace falta ser experto: basta con entender unas pocas ideas.

## Qué es la marea

La marea es la subida y bajada del nivel del mar causada principalmente por la Luna y, en menor medida, el Sol. En la costa del Pacífico de Costa Rica hay normalmente dos mareas altas y dos bajas al día, separadas por algo más de seis horas. Cada día se corren un poco más tarde.

En el Pacífico la diferencia entre marea alta y baja es grande, sobre todo dentro de golfos como el de Nicoya. En el Caribe la diferencia es mucho menor, y ahí pesan más el viento y el oleaje.

## La regla de oro: agua en movimiento

Los peces aprovechan la corriente que crea la marea. El agua en movimiento arrastra carnada, camarones y cangrejos, y los depredadores se colocan donde la comida les llega sola.

- **Marea subiendo (llenante):** el agua cubre orillas, rocas y manglares donde se esconde la carnada, y los peces se acercan a la costa. Para la pesca de orilla, la primera parte de la marea que sube suele ser muy buena.
- **Marea bajando (vaciante):** el agua saca la comida de esteros, ríos y manglares hacia afuera. Busca canales, bocanas y caídas de profundidad por donde sale esa agua.
- **Marea quieta (repunte):** el rato en que la marea cambia y casi no hay corriente. Suele ser el momento más flojo. Aprovéchalo para cambiar de lugar, amarrar líderes o comer algo.

## Cómo usar la tabla de mareas

Una tabla te dice la hora y la altura de cada marea alta y baja. Para planear:

1. Busca la tabla del lugar más cercano a donde vas a pescar; la hora cambia de un punto a otro de la costa.
2. Fíjate en las horas en que la marea se está moviendo y combínalas, si puedes, con la madrugada o el atardecer.
3. Mira la altura. Las mareas grandes mueven más agua y crean más corriente.

## Mareas y seguridad

- En rocas y puntas, la marea que sube puede dejarte aislado. Sabe siempre por dónde vas a regresar.
- En esteros y bocanas, la corriente de la vaciante puede ser muy fuerte, sobre todo para kayak.
- Con marea baja algunas zonas quedan muy llanas; ojo con varar el bote.

## Cada lugar es distinto

No hay una marea perfecta para todo. En unos lugares pica mejor con la llenante y en otros con la vaciante. La mejor forma de descubrirlo es anotar la marea cada vez que pescas. En la app puedes registrar tus capturas con fecha y hora; con el tiempo vas a ver qué momento funciona en tus lugares favoritos.', 'If you fish the sea, an estuary or a river mouth, the tide is probably the biggest factor in whether fish bite. You don''t need to be an expert: a few ideas are enough.

## What the tide is

The tide is the rise and fall of sea level caused mainly by the Moon and, to a lesser extent, the Sun. On Costa Rica''s Pacific coast there are normally two high tides and two low tides a day, a little more than six hours apart. Each day they shift a bit later.

On the Pacific side the difference between high and low tide is large, especially inside gulfs like the Gulf of Nicoya. On the Caribbean side the difference is much smaller, and wind and swell matter more.

## The golden rule: moving water

Fish take advantage of the current the tide creates. Moving water carries baitfish, shrimp and crabs, and predators position themselves where food comes to them.

- **Rising (incoming) tide:** water covers shorelines, rocks and mangroves where bait hides, and fish move in toward the coast. For shore fishing, the first part of the incoming tide is often very good.
- **Falling (outgoing) tide:** water flushes food out of estuaries, rivers and mangroves. Look for channels, river mouths and drop-offs where that water drains out.
- **Slack tide:** the period when the tide turns and there''s almost no current. It''s usually the slowest time. Use it to move spots, tie leaders or grab a snack.

## How to use a tide table

A tide table gives you the time and height of each high and low tide. To plan:

1. Find the table for the station closest to where you''ll fish; timing changes along the coast.
2. Note the hours when the tide is moving and, if you can, line them up with dawn or dusk.
3. Look at the height. Big tides move more water and create more current.

## Tides and safety

- On rocks and points, a rising tide can cut you off. Always know your way back.
- In estuaries and river mouths, the outgoing current can be very strong, especially for kayaks.
- At low tide some areas get very shallow; watch out for running a boat aground.

## Every spot is different

There''s no perfect tide for everything. Some spots fish better on the incoming and others on the outgoing. The best way to find out is to note the tide every time you fish. In the app you can log your catches with date and time; over time you''ll see which window works at your favorite spots.', array['https://www.takemefishing.org/how-to-fish/when-to-fish/best-tide-to-fish/','https://www.takemefishing.org/how-to-fish/when-to-fish/how-to-fish-the-tides/','https://www.takemefishing.org/how-to-fish/when-to-fish/fishing-tide-chart/','https://www.saltwatersportsman.com/how-to-read-inshore-tides','https://revistas.csuca.org/Record/CIETEC2654/Details']),
('la-luna-y-la-pesca', 'where_when', 10, 4, 'La luna y la pesca', 'The moon and fishing', 'Qué hace de verdad la luna con las mareas y los peces, y qué tanto confiar en las tablas solunares.', 'What the moon really does to tides and fish, and how much to trust solunar tables.', 'Todo pescador tiene una opinión sobre la luna. Unos juran que con luna llena no pica nada; otros dicen que es la mejor. ¿Qué hay de cierto?

## Lo que sí es seguro: la luna mueve las mareas

La atracción de la Luna, junto con la del Sol, produce las mareas. Y según la fase lunar cambia su tamaño:

- **Luna nueva y luna llena:** el Sol y la Luna se alinean y se suman sus fuerzas. Las mareas son más grandes (mareas vivas o de sicigia): suben más, bajan más y crean corrientes más fuertes.
- **Cuarto creciente y cuarto menguante:** las fuerzas se contrarrestan en parte. Las mareas son más pequeñas (mareas muertas) y la corriente es más suave.

Como los peces responden al movimiento del agua, este efecto es real e importante, sobre todo en la costa, esteros y bocanas.

## Más corriente, ¿mejor pesca?

Muchas veces sí. Las mareas vivas mueven más agua y más comida, y eso activa a los depredadores. Pero demasiada corriente también puede complicar: el agua se ensucia, cuesta mantener la carnada en el fondo y algunos lugares se vuelven difíciles de pescar. En mareas muertas la corriente es más manejable, aunque a veces los peces están menos activos.

## La luz de la luna

La luna llena ilumina la noche. Algunos pescadores creen que con más luz los peces comen de noche y llegan menos activos en la mañana. Otros aprovechan esas noches para pescar porque los peces ven mejor la carnada. No hay una regla fija: depende de la especie y del lugar.

## Las tablas solunares

Las tablas solunares, populares desde hace casi un siglo, marcan "periodos mayores" (cuando la luna está en lo más alto o justo del otro lado del planeta) y "periodos menores" (cuando sale y se pone). La idea es que en esos ratos los peces comen más.

Muchos pescadores las usan y les sirven como guía, pero la evidencia científica a su favor es débil. El clima, la marea, la temperatura del agua y la presencia de carnada suelen pesar más que la posición de la luna.

## Cómo usar la luna a tu favor

- **Revisa la fase** cuando planees una salida al mar o a una bocana. Si es luna nueva o llena, espera mareas y corrientes fuertes.
- **Combínala con la tabla de mareas.** La marea te dice cuándo se mueve el agua; la luna te dice con cuánta fuerza.
- **Toma las tablas solunares como un dato más,** no como una garantía.
- **Lleva tu propio registro.** Anota la fase de la luna con cada captura. Tus datos en tus lugares valen más que cualquier regla general.

## En resumen

La luna importa sobre todo porque controla las mareas. Úsala para entender cómo se va a mover el agua, y deja que tu experiencia te diga el resto. Al final, el mejor día para pescar es el día que puedes ir.', 'Every angler has an opinion about the moon. Some swear nothing bites on a full moon; others say it''s the best. What''s actually true?

## What''s certain: the moon drives the tides

The Moon''s pull, together with the Sun''s, creates the tides. And their size changes with the lunar phase:

- **New moon and full moon:** the Sun and Moon line up and their forces add together. Tides are bigger (spring tides): higher highs, lower lows and stronger currents.
- **First and last quarter:** the forces partly cancel out. Tides are smaller (neap tides) and current is gentler.

Since fish respond to moving water, this effect is real and important, especially along the coast, in estuaries and at river mouths.

## More current, better fishing?

Often, yes. Spring tides move more water and more food, and that fires up predators. But too much current can also make things harder: water gets dirty, it''s tough to keep bait on the bottom and some spots become difficult to fish. On neap tides the current is easier to manage, though fish are sometimes less active.

## Moonlight

A full moon lights up the night. Some anglers believe that with more light fish feed at night and are less active the next morning. Others take advantage of those nights to fish because fish can see the bait better. There''s no fixed rule: it depends on the species and the place.

## Solunar tables

Solunar tables, popular for nearly a century, mark "major periods" (when the moon is directly overhead or directly underfoot) and "minor periods" (moonrise and moonset). The idea is that fish feed more during those windows.

Many anglers use them as a guide, but the scientific evidence behind them is weak. Weather, tide, water temperature and the presence of bait usually matter more than the moon''s position.

## How to use the moon to your advantage

- **Check the phase** when you plan a trip to the sea or a river mouth. If it''s a new or full moon, expect strong tides and currents.
- **Combine it with the tide table.** The tide tells you when the water moves; the moon tells you how hard.
- **Treat solunar tables as one more input,** not a guarantee.
- **Keep your own log.** Note the moon phase with each catch. Your data at your spots is worth more than any general rule.

## In short

The moon matters mainly because it controls the tides. Use it to understand how the water will move, and let your experience tell you the rest. In the end, the best day to fish is the day you can go.', array['https://texassaltwaterfishingmagazine.com/fishing/education/fishy-facts/solunar-theory','https://thetackleroom.com/blogs/news/solunar-fishing-guide-moon-phases-tides-bite-times','https://castandspear.com/how-does-the-moon-affect-fishing/','https://www.takemefishing.org/how-to-fish/when-to-fish/how-to-fish-the-tides/']),
('como-leer-el-agua', 'where_when', 11, 5, 'Cómo leer el agua', 'How to read the water', 'Estructura, corrientes, aves y cambios de color: las señales que te dicen dónde están los peces.', 'Structure, currents, birds and color changes: the signs that tell you where the fish are.', 'Los peces no están repartidos por igual. Se juntan donde hay comida, refugio y agua cómoda. Aprender a leer el agua es aprender a ver esas señales antes de lanzar.

## Estructura: donde se esconden

Casi todos los peces depredadores usan algo para emboscar o protegerse:

- **Rocas, arrecifes y puntas.** En la costa del Pacífico son casa de pargos, jureles, meros y pez gallo.
- **Troncos, árboles caídos y raíces de manglar.** Clave para róbalo en esteros y para guapote en ríos y lagos.
- **Muelles, boyas y pilotes.** Dan sombra y atraen carnada.
- **Cambios de profundidad.** Un canal, un hueco o una caída. Desde la orilla, el agua más oscura suele ser más honda.

Lanza cerca de la estructura, no en medio de la nada. Y prepárate para perder algunos señuelos: es parte del juego.

## Corrientes: donde llega la comida

El agua en movimiento lleva comida, y los peces se ponen donde les llega sin gastar energía.

- **Líneas de corriente.** Donde se encuentran dos corrientes se forma una línea en la superficie con espuma, burbujas o basura. Los peces se acomodan en el lado más lento y atacan lo que pasa por el más rápido.
- **Remolinos detrás de rocas** o en curvas de río. Son zonas de descanso con comida cerca.
- **Bocanas.** Donde el río sale al mar hay corriente, cambio de salinidad y mucha carnada.
- **Canales entre olas.** En la playa, por donde el agua regresa al mar se forman canales que arrastran comida.

## Aves: los mejores guías

Las aves ven la carnada desde arriba y casi siempre llegan antes que tú.

- **Tijeretas (fragatas)** volando en círculo sobre un punto en altamar: muchas veces hay dorado, atún o peces de pico debajo, o un tronco con vida.
- **Piqueros y pelícanos** lanzándose en picada: cardumen de sardina cerca de la superficie.
- **Gaviotas o charranes** posados o revoloteando sobre el agua: carnada arriba.

Si ves aves trabajando, acércate con calma, sin pasar por encima del cardumen, y lanza a la orilla de la actividad.

## Cambios de color

- **En altamar,** la línea entre agua verde (más rica en plancton) y agua azul (más clara) junta carnada y depredadores. Los capitanes trolean a lo largo de esa línea, no cruzándola.
- **Cerca de la costa,** la línea entre agua turbia de un río y agua clara del mar es un gran punto de emboscada. Los peces se quedan del lado claro, mirando hacia el agua sucia.
- **Agua nerviosa:** una zona pequeña con ondas o chapoteos en un mar calmado puede ser un cardumen de carnada justo debajo.

## Basura flotante

En altamar, cualquier cosa que flote, como troncos, ramas, líneas de algas o hasta una hielera perdida, puede tener dorado debajo. Siempre vale la pena pasar cerca.

## Junta las señales

Un solo indicio puede no decir mucho. Pero una punta de roca con corriente, aves trabajando y marea subiendo es casi una invitación. Antes de lanzar, toma un minuto para mirar el agua. Con práctica, esa lectura se vuelve automática.', 'Fish aren''t spread out evenly. They gather where there''s food, shelter and comfortable water. Learning to read the water means learning to spot those signs before you cast.

## Structure: where they hide

Almost every predatory fish uses something to ambush prey or take cover:

- **Rocks, reefs and points.** On the Pacific coast they''re home to snapper, jacks, grouper and roosterfish.
- **Logs, fallen trees and mangrove roots.** Key for snook in estuaries and guapote in rivers and lakes.
- **Piers, buoys and pilings.** They provide shade and attract bait.
- **Depth changes.** A channel, a hole or a drop-off. From shore, darker water is usually deeper.

Cast close to structure, not into the middle of nowhere. And be ready to lose a few lures: it''s part of the game.

## Currents: where food arrives

Moving water carries food, and fish set up where it comes to them without wasting energy.

- **Current lines (seams).** Where two currents meet, a line forms on the surface with foam, bubbles or debris. Fish sit on the slower side and strike whatever drifts by in the faster water.
- **Eddies behind rocks** or at river bends. Resting spots with food nearby.
- **River mouths.** Where a river meets the sea there''s current, a salinity change and lots of bait.
- **Rip channels in the surf.** On the beach, the channels where water flows back out to sea carry food.

## Birds: the best guides

Birds see bait from above and almost always get there before you.

- **Frigatebirds** circling over a spot offshore: often there are dorado, tuna or billfish below, or a log holding life.
- **Boobies and pelicans** diving: a school of sardines near the surface.
- **Gulls or terns** sitting on or hovering over the water: bait on top.

If you see birds working, approach calmly without running over the school, and cast to the edge of the action.

## Color changes

- **Offshore,** the edge between green water (richer in plankton) and blue water (clearer) gathers bait and predators. Captains troll along that edge, not across it.
- **Near the coast,** the line between muddy river water and clear seawater is a great ambush spot. Fish hold on the clear side, facing the dirty water.
- **Nervous water:** a small patch of ripples or splashes on a calm sea can be a bait school right underneath.

## Floating debris

Offshore, anything that floats, such as logs, branches, weed lines or even a lost cooler, can hold dorado. It''s always worth a pass.

## Put the signs together

One clue alone may not mean much. But a rocky point with current, birds working and a rising tide is practically an invitation. Before you cast, take a minute to look at the water. With practice, that read becomes automatic.', array['https://thetackleroom.com/blogs/news/how-to-read-offshore-water-color-temperature-and-current','https://thetackleroom.com/blogs/news/how-to-find-fish-offshore-reading-water-color-temperature-and-structure','https://yamahaoutboards.com/blog/fishing/reading-the-water-freshwater-edition','https://qareb.com/store/en/blogs/reading-water-currents-beach-fishing-spots','https://castandspear.com/dorado-fish/','https://www.baityourhook.com/fishing-in-guanacaste-province-region-cr']),
('clima-y-temporada-de-lluvias', 'where_when', 12, 5, 'Clima y temporada de lluvias en Costa Rica', 'Weather and the rainy season in Costa Rica', 'Verano e invierno en el Pacífico y el Caribe, y cómo cambian la pesca y la planificación de tus salidas.', 'Dry and rainy seasons on the Pacific and Caribbean coasts, and how they change your fishing plans.', 'En Costa Rica no hablamos de cuatro estaciones sino de dos: el "verano" (época seca) y el "invierno" (época lluviosa). Pero el país tiene dos costas con climas distintos, y eso cambia mucho la pesca.

## El Pacífico

- **Verano (más o menos de diciembre a abril):** cielos despejados, poca lluvia y mar generalmente más ordenado. Guanacaste es la zona más seca. En estos meses, sin embargo, soplan con fuerza los vientos alisios en el norte, sobre todo alrededor del golfo de Papagayo, y algunos días el mar se pone picado.
- **Invierno (más o menos de mayo a noviembre):** llueve casi todos los días, pero normalmente en la tarde; las mañanas suelen estar despejadas. Septiembre y octubre son los meses más lluviosos. A mitad de año suele haber unas semanas más secas que llamamos "veranillo".

## El Caribe

El Caribe va con su propio calendario. Llueve durante buena parte del año, pero sus meses más secos suelen ser **septiembre y octubre**, justo cuando el Pacífico está más mojado, y otra ventana más seca alrededor de febrero y marzo. Si en octubre el Pacífico está imposible, el Caribe puede ser una buena opción.

## Cómo afecta la pesca

**En altamar (Pacífico):**

- El pez vela está todo el año, pero la temporada fuerte cambia por zona. En el Pacífico central suele ser en los meses secos; en el Pacífico norte es mejor a mitad de año.
- El dorado se vuelve más común en el invierno, cuando las lluvias llevan troncos y basura al mar y se forman líneas de basura donde se refugia.
- Las mañanas del invierno suelen ser buenas para salir; planea regresar antes de las tormentas de la tarde.

**En la costa y bocanas:**

- Con lluvias fuertes los ríos bajan turbios y crecidos. Las bocanas cambian, el agua se ensucia cerca de la costa y la pesca puede bajar unos días. Cuando el agua empieza a aclarar, los depredadores suelen volver a activarse en la línea entre agua sucia y clara.

**En ríos y lagos:**

- El verano trae ríos más bajos y claros, más fáciles de leer y de vadear.
- En el invierno los ríos suben rápido. Hay que estar atento a crecidas, incluso si en tu lugar no está lloviendo, porque puede estar lloviendo en la montaña.

## Consejos para cualquier época

- **Revisa el pronóstico** antes de cada salida, y el estado del mar si vas en bote o kayak.
- **Sal temprano.** En casi todo el país las mañanas son la parte más estable del día.
- **Tormentas eléctricas:** si escuchas truenos, sal del agua y guarda las cañas; una caña de grafito es un buen pararrayos.
- **Sol:** incluso nublado, el sol tropical quema. Usa bloqueador, gorra, camisa de manga larga y lleva bastante agua.
- **Equipo:** una capa liviana para la lluvia y bolsas secas para el celular hacen la diferencia en invierno.

## Lo más importante

Las temporadas son promedios. Hay años más secos, años más lluviosos y fenómenos como El Niño o La Niña que lo cambian todo. Habla con capitanes y pescadores locales, revisa los reportes recientes en la app y registra tus propias salidas para conocer cómo se comportan tus lugares en cada época.', 'In Costa Rica we don''t talk about four seasons but two: "summer" (verano, the dry season) and "winter" (invierno, the rainy season). But the country has two coasts with different climates, and that changes the fishing a lot.

## The Pacific

- **Dry season (roughly December to April):** clear skies, little rain and generally calmer seas. Guanacaste is the driest region. During these months, however, strong trade winds blow in the north, especially around the Gulf of Papagayo, and some days the sea gets choppy.
- **Rainy season (roughly May to November):** it rains almost daily, but usually in the afternoon; mornings are often clear. September and October are the wettest months. Mid-year there''s usually a few drier weeks locals call the "veranillo" (little summer).

## The Caribbean

The Caribbean runs on its own calendar. It rains much of the year, but its driest months are usually **September and October**, exactly when the Pacific is wettest, with another drier window around February and March. If the Pacific is a washout in October, the Caribbean can be a good option.

## How it affects fishing

**Offshore (Pacific):**

- Sailfish are around all year, but the peak season varies by area. In the central Pacific it''s usually the dry months; in the north Pacific it''s better mid-year.
- Dorado become more common in the rainy season, when rain washes logs and debris out to sea and forms the debris lines they hide under.
- Rainy-season mornings are usually good for heading out; plan to be back before the afternoon storms.

**Along the coast and at river mouths:**

- With heavy rain, rivers run muddy and high. River mouths shift, the water near shore gets dirty and fishing can slow for a few days. When the water starts to clear, predators often switch back on along the line between dirty and clean water.

**In rivers and lakes:**

- The dry season brings lower, clearer rivers that are easier to read and wade.
- In the rainy season rivers rise fast. Watch for floods even if it isn''t raining where you are, because it may be raining up in the mountains.

## Tips for any season

- **Check the forecast** before every trip, and sea conditions if you''re going by boat or kayak.
- **Go early.** Across most of the country, mornings are the most stable part of the day.
- **Lightning:** if you hear thunder, get off the water and put your rods down; a graphite rod makes a good lightning rod.
- **Sun:** even on cloudy days the tropical sun burns. Wear sunscreen, a cap and a long-sleeve shirt, and bring plenty of water.
- **Gear:** a light rain shell and dry bags for your phone make a big difference in the rainy season.

## The bottom line

Seasons are averages. There are drier years, wetter years, and patterns like El Niño and La Niña that change everything. Talk to local captains and anglers, check recent reports in the app and log your own trips to learn how your spots behave in each season.', array['https://www.onthegotours.com/uk/Costa-Rica/Guides/Best-Time-To-Visit','https://www.rickshawtravel.co.uk/costa-rica/information/when-to-go','https://costaricaexperts.com/costa-rica-travel-blog/best-time-to-visit-costa-rica/','https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map','https://fishingbooker.com/blog/costa-rica-fishing-seasons/','https://www.vacationscostarica.com/fishing/species/mahi-mahi-dorado/'])
on conflict (slug) do update set chapter = excluded.chapter, sort_order = excluded.sort_order, read_minutes = excluded.read_minutes, title_es = excluded.title_es, title_en = excluded.title_en, summary_es = excluded.summary_es, summary_en = excluded.summary_en, body_es = excluded.body_es, body_en = excluded.body_en, sources = excluded.sources;

insert into public.knots (slug, sort_order, name_es, name_en, summary_es, summary_en, best_for_es, best_for_en, difficulty, steps, image_url, image_credit, image_source_url, sources) values
('palomar', 1, 'Palomar', 'Palomar knot', 'Nudo fuerte y fácil para atar la línea a un anzuelo, señuelo o destorcedor usando la línea doblada.', 'A strong, easy knot that ties line to a hook, lure or swivel using a doubled strand.', 'Anzuelos, señuelos y destorcedores; ideal con trenzado (multifilamento) y también funciona con monofilamento y fluorocarbono. Menos práctico con señuelos grandes, porque el lazo tiene que pasar por encima de ellos.', 'Hooks, lures and swivels; ideal for braid and also works with monofilament and fluorocarbon. Awkward with big lures, since the loop must pass over them.', 1, '[{"text_es": "Dobla unos 15–20 cm de línea para formar un lazo y pásalo por el ojo del anzuelo.", "text_en": "Double 6–8 in (15–20 cm) of line into a loop and pass it through the hook eye."}, {"text_es": "Con la línea doblada, haz un nudo simple flojo, dejando el anzuelo colgando del lazo.", "text_en": "With the doubled line, tie a loose overhand knot, leaving the hook hanging from the loop."}, {"text_es": "Pasa el anzuelo completo a través del lazo.", "text_en": "Pass the whole hook through the loop."}, {"text_es": "Humedece el nudo y tira de la línea principal y del extremo a la vez, guiando el lazo por encima del ojo.", "text_en": "Wet the knot and pull the standing line and tag end together, guiding the loop above the eye."}, {"text_es": "Ajusta bien y corta el extremo sobrante a unos 3 mm.", "text_en": "Snug it down and trim the tag end to about 1/8 in (3 mm)."}]'::jsonb, 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/learn/palomar.jpg', 'Vaughan Pratt · CC BY-SA 3.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:PalomarKnotSequence.jpg', array['https://en.wikipedia.org/wiki/Palomar_knot','https://berkley-fishing.com/blogs/news/fishing-knots-101','https://purefishing.com/dock-talk-january-2023-must-know-knots']),
('clinch-mejorado', 2, 'Clinch mejorado', 'Improved clinch knot', 'El nudo clásico para amarrar anzuelos y señuelos con monofilamento.', 'The classic knot for tying hooks and lures on monofilament.', 'Anzuelos, señuelos y destorcedores con monofilamento o fluorocarbono de hasta unas 25–30 lb. No se recomienda para trenzado porque tiende a resbalar.', 'Hooks, lures and swivels on monofilament or fluorocarbon up to about 25–30 lb test. Not recommended for braid, which tends to slip.', 1, '[{"text_es": "Pasa unos 15 cm de línea por el ojo del anzuelo.", "text_en": "Pass about 6 in (15 cm) of line through the hook eye."}, {"text_es": "Enrolla el extremo alrededor de la línea principal de 5 a 7 vueltas, sin que se monten.", "text_en": "Wrap the tag end around the standing line 5 to 7 times without overlapping the turns."}, {"text_es": "Pasa el extremo por el pequeño lazo que quedó junto al ojo.", "text_en": "Pass the tag end through the small loop next to the eye."}, {"text_es": "Pasa el extremo de vuelta por el lazo grande que acabas de formar.", "text_en": "Pass the tag end back through the big loop you just formed."}, {"text_es": "Humedece el nudo y tira de la línea principal para que las vueltas bajen apretadas contra el ojo.", "text_en": "Wet the knot and pull the standing line so the coils snug down against the eye."}, {"text_es": "Corta el extremo sobrante.", "text_en": "Trim the tag end."}]'::jsonb, 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/learn/clinch-mejorado.jpg', 'Der Barbar · CC BY-SA 4.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Barb._02_Verbesserter_Clinchknoten.jpg', array['https://berkley-fishing.com/blogs/news/fishing-knots-101','https://www.bassproboatingcenters.com/blog/knots-to-know.html','https://en.wikipedia.org/wiki/Clinch_knot']),
('uni', 3, 'Uni', 'Uni knot', 'Nudo versátil y confiable que sirve para casi cualquier amarre con cualquier tipo de línea.', 'A versatile, reliable knot that handles almost any tie with any line type.', 'Anzuelos, señuelos, destorcedores y para atar la línea al carrete; funciona con monofilamento, fluorocarbono y trenzado (con trenzado usa más vueltas).', 'Hooks, lures, swivels and tying line to the reel spool; works with monofilament, fluorocarbon and braid (use more wraps with braid).', 1, '[{"text_es": "Pasa unos 15 cm de línea por el ojo y dóblala de regreso, paralela a la línea principal.", "text_en": "Pass about 6 in (15 cm) of line through the eye and double it back alongside the standing line."}, {"text_es": "Lleva el extremo hacia el ojo para formar un lazo sobre las dos líneas.", "text_en": "Bring the tag end back toward the eye to form a loop over both lines."}, {"text_es": "Enrolla el extremo 6 veces alrededor de las dos líneas, pasando por dentro del lazo (8 o más con trenzado).", "text_en": "Wrap the tag end 6 times around both lines, passing through the loop (8 or more with braid)."}, {"text_es": "Humedece y tira del extremo para apretar las vueltas.", "text_en": "Wet the knot and pull the tag end to tighten the wraps."}, {"text_es": "Tira de la línea principal para deslizar el nudo hasta el ojo.", "text_en": "Pull the standing line to slide the knot down to the eye."}, {"text_es": "Ajusta firme y corta el extremo sobrante.", "text_en": "Snug it tight and trim the tag end."}]'::jsonb, 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/learn/uni.jpg', 'Snapper G · CC BY-SA 3.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Uni_knot.jpg', array['https://en.wikipedia.org/wiki/Uni_knot','https://fishtrack.com/article/how-to-tie-the-double-uni-knot','https://www.tacklewarehouse.com/bass-fishing/how-to/how-to-tie-a-double-uni-knot-for-bass-fishing.html']),
('doble-uni', 4, 'Doble Uni', 'Double uni knot', 'Une dos líneas con dos nudos Uni que se deslizan uno contra el otro.', 'Joins two lines with two uni knots that slide together.', 'Unir línea con línea: monofilamento con monofilamento, o trenzado con un líder de monofilamento o fluorocarbono. Funciona bien hasta unas 30 lb; en el lado del trenzado usa el doble de vueltas.', 'Joining line to line: mono to mono, or braid to a mono or fluorocarbon leader. Works well up to about 30 lb test; use double the wraps on the braid side.', 2, '[{"text_es": "Superpón los extremos de las dos líneas en direcciones opuestas, con unos 15 cm de traslape.", "text_en": "Overlap the ends of the two lines in opposite directions by about 6 in (15 cm)."}, {"text_es": "Con el extremo de una línea, forma un lazo sobre ambas líneas.", "text_en": "With the tag end of one line, form a loop over both lines."}, {"text_es": "Enrolla ese extremo 6 veces alrededor de ambas líneas, pasando por dentro del lazo (12 o más si es trenzado), y aprieta tirando del extremo.", "text_en": "Wrap that tag end 6 times around both lines, passing through the loop (12 or more for braid), and tighten by pulling the tag end."}, {"text_es": "Repite lo mismo con el extremo de la otra línea, en sentido contrario.", "text_en": "Repeat with the tag end of the other line, in the opposite direction."}, {"text_es": "Humedece y tira de las dos líneas principales en direcciones opuestas hasta que los nudos se junten.", "text_en": "Wet the knots and pull the two standing lines in opposite directions until the knots butt together."}, {"text_es": "Ajusta firme y corta los dos extremos al ras.", "text_en": "Snug them tight and trim both tag ends close."}]'::jsonb, null, null, null, array['https://fishtrack.com/article/how-to-tie-the-double-uni-knot','https://www.tacklewarehouse.com/bass-fishing/how-to/how-to-tie-a-double-uni-knot-for-bass-fishing.html','https://www.takemefishing.org/how-to-fish/fishing-knots-and-rigs/double-uni-knots/']),
('fg', 5, 'FG', 'FG knot', 'Unión delgada y muy fuerte de trenzado a líder que pasa limpia por las guías de la caña.', 'A slim, very strong braid-to-leader connection that slides cleanly through rod guides.', 'Unir trenzado a un líder de fluorocarbono o monofilamento, sobre todo para lanzar señuelos (spinning, popping, jigging) donde el nudo pasa por las guías.', 'Joining braid to a fluorocarbon or monofilament leader, especially for casting (spinning, popping, jigging) where the knot passes through the guides.', 3, '[{"text_es": "Mantén el trenzado bien tenso, por ejemplo con la caña en un portacañas y el extremo enrollado en tu dedo meñique.", "text_en": "Keep the braid under firm tension, for example with the rod in a holder and the tag end wrapped around your little finger."}, {"text_es": "Cruza el líder sobre el trenzado, dejando unos 15 cm de extremo del líder para trabajar.", "text_en": "Cross the leader over the braid, leaving about 6 in (15 cm) of leader tag to work with."}, {"text_es": "Pasa el líder alternando por debajo y por encima del trenzado tenso, para que el trenzado quede envolviendo al líder; repite hasta tener unas 20 vueltas.", "text_en": "Weave the leader alternately under and over the tight braid so the braid ends up wrapped around the leader; repeat until you have about 20 wraps."}, {"text_es": "Sujeta las vueltas y asegúralas con dos medios nudos del extremo del trenzado alrededor de ambas líneas.", "text_en": "Pinch the wraps and lock them with two half hitches of the braid tag around both lines."}, {"text_es": "Humedece y tira fuerte del líder y del trenzado en direcciones opuestas para que el trenzado muerda el líder.", "text_en": "Wet the knot and pull the leader and braid hard in opposite directions so the braid bites into the leader."}, {"text_es": "Corta el extremo del líder al ras y remata con 4 a 6 medios nudos alternos del trenzado alrededor de ambas líneas.", "text_en": "Trim the leader tag flush and finish with 4 to 6 alternating half hitches of braid around both lines."}, {"text_es": "Corta el extremo del trenzado.", "text_en": "Trim the braid tag end."}]'::jsonb, null, null, null, array['https://www.tacklewarehouse.com/bass-fishing/how-to/how-to-tie-an-fg-knot.html','https://www.aftco.com/blogs/tackle-how-to/how-to-tie-an-fg-knot','https://www.wired2fish.com/fishing-knots/how-to-tie-the-fg-knot']),
('bimini-twist', 6, 'Bimini twist', 'Bimini twist', 'Crea una sección de línea doble muy resistente que conserva casi el 100% de la fuerza de la línea.', 'Creates a very strong double-line section that keeps close to 100% of line strength.', 'Hacer línea doble para pesca de altura (troleo de marlín, pez vela y dorado) y para conectar líderes; en monofilamento y trenzado (con trenzado se necesitan muchas más torsiones).', 'Making a double line for offshore fishing (trolling for marlin, sailfish and mahi-mahi) and for attaching leaders; with monofilament or braid (braid needs many more twists).', 3, '[{"text_es": "Dobla unos 60 cm de línea para formar un lazo largo.", "text_en": "Double about 2 ft (60 cm) of line into a long loop."}, {"text_es": "Gira el extremo del lazo unas 20 veces para torcer las dos patas juntas (con trenzado, muchas más).", "text_en": "Rotate the end of the loop about 20 times to twist the two legs together (many more with braid)."}, {"text_es": "Pasa el lazo sobre tus rodillas o un objeto fijo y separa las patas para apretar las torsiones.", "text_en": "Slip the loop over your knees or a fixed object and spread the legs to compress the twists."}, {"text_es": "Manteniendo la tensión, abre el extremo en ángulo recto y deja que se enrolle solo sobre las torsiones hasta llegar a la horquilla del lazo.", "text_en": "Keeping tension, angle the tag end out at 90 degrees and let it roll down over the twists until it reaches the fork of the loop."}, {"text_es": "Sujeta las vueltas y haz un medio nudo con el extremo alrededor de una pata del lazo.", "text_en": "Hold the wraps and tie a half hitch with the tag end around one leg of the loop."}, {"text_es": "Remata con un nudo de 3 a 5 vueltas alrededor de ambas patas, pasando el extremo de regreso hacia el nudo.", "text_en": "Finish with a 3- to 5-turn hitch around both legs, passing the tag end back toward the knot."}, {"text_es": "Humedece, ajusta las vueltas tirando del extremo y córtalo.", "text_en": "Wet the knot, seat the turns by pulling the tag end, and trim it."}]'::jsonb, 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/learn/bimini-twist.png', 'LadyofHats · Public domain · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Bimini_Twist_knot.svg', array['https://howtoflyfish.orvis.com/fly-fishing-knots/bimini-twist-knot-animation','https://en.wikipedia.org/wiki/Bimini_twist','https://www.aftco.com/blogs/tackle-how-to/how-to-tie-a-bimini-twist-knot','https://www.mercurymarine.com/cn/zh/lifestyle/dockline/learn-to-tie-a-bimini-twist-the-easy-way']),
('lazo-rapala', 7, 'Lazo Rapala', 'Rapala knot (non-slip loop)', 'Deja un pequeño lazo fijo en el ojo del señuelo para que se mueva libremente.', 'Leaves a small fixed loop at the lure eye so the lure can swing freely.', 'Señuelos de acción (crankbaits, minnows, jigs, poppers) con monofilamento o líder de fluorocarbono; mejora el nado del señuelo.', 'Action lures (crankbaits, minnows, jigs, poppers) on monofilament or a fluorocarbon leader; improves the lure''s swimming action.', 2, '[{"text_es": "Haz un nudo simple flojo a unos 15–25 cm del extremo de la línea.", "text_en": "Tie a loose overhand knot about 6–10 in (15–25 cm) from the end of the line."}, {"text_es": "Pasa el extremo por el ojo del señuelo y regrésalo por dentro del nudo simple.", "text_en": "Pass the tag end through the lure eye and back through the overhand knot."}, {"text_es": "Enrolla el extremo 3 veces alrededor de la línea principal.", "text_en": "Wrap the tag end 3 times around the standing line."}, {"text_es": "Pasa el extremo de regreso por la parte de atrás del nudo simple.", "text_en": "Pass the tag end back through the back of the overhand knot."}, {"text_es": "Pasa el extremo por el lazo que acabas de formar.", "text_en": "Pass the tag end through the loop you just formed."}, {"text_es": "Humedece y tira a la vez del extremo, de la línea principal y del señuelo para cerrar el nudo.", "text_en": "Wet the knot and pull the tag end, standing line and lure together to close it."}, {"text_es": "Corta el extremo sobrante.", "text_en": "Trim the tag end."}]'::jsonb, 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/learn/lazo-rapala.jpg', 'Der Barbar · CC BY-SA 4.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Barb.06_Rapalaknoten.jpg', array['https://www.theknotsmanual.com/knots/fishing-knots/rapala-knot/','https://www.anglingtimes.co.uk/advice/beginners/how-to-tie-the-rapala-knot','https://takemefishing.org/how-to-fish/how-tie-fishing-knots/how-to-tie-a-rapala-knot']),
('snell', 8, 'Snell', 'Snell knot', 'Amarra la línea al vástago del anzuelo para lograr un tirón recto y clavadas más firmes.', 'Ties the line to the hook shank for a straight-line pull and firmer hooksets.', 'Anzuelos circulares y anzuelos para carnada viva con líder de monofilamento o fluorocarbono; también funciona con trenzado usando más vueltas.', 'Circle hooks and live-bait hooks on a monofilament or fluorocarbon leader; also works with braid using more wraps.', 2, '[{"text_es": "Pasa unos 15 cm de línea por el ojo del anzuelo, desde el lado de la punta.", "text_en": "Pass about 6 in (15 cm) of line through the hook eye, from the point side."}, {"text_es": "Extiende el extremo a lo largo del vástago, dejando un lazo grande que cuelgue junto al anzuelo.", "text_en": "Lay the tag end along the shank, leaving a large loop hanging alongside the hook."}, {"text_es": "Sujeta la línea contra el vástago con el pulgar y el índice.", "text_en": "Pinch the line against the shank with your thumb and index finger."}, {"text_es": "Con el lado del lazo, da de 5 a 7 vueltas apretadas alrededor del vástago y del extremo, avanzando desde el ojo hacia la curva.", "text_en": "Using the loop side, make 5 to 7 tight wraps around the shank and tag end, working from the eye toward the bend."}, {"text_es": "Sostén las vueltas y tira de la línea principal hasta que el lazo desaparezca bajo ellas.", "text_en": "Hold the wraps and pull the standing line until the loop disappears under them."}, {"text_es": "Humedece, tira firme de la línea principal y del extremo para asentar el nudo y corta el sobrante.", "text_en": "Wet the knot, pull the standing line and tag end firmly to seat it, and trim the excess."}]'::jsonb, 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/learn/snell.jpg', 'Fishingknotsfast · CC BY-SA 4.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Snell_Knot.jpg', array['https://takemefishing.org/how-to-fish/how-tie-fishing-knots/how-to-tie-a-snell-knot','https://www.outdoorlife.com/fishing/how-to-tie-a-snell-knot/','https://www.tacklewarehouse.com/bass-fishing/how-to/how-to-tie-a-snell-knot-for-bass-fishing.html','https://en.wikipedia.org/wiki/Snell_knot'])
on conflict (slug) do update set sort_order = excluded.sort_order, name_es = excluded.name_es, name_en = excluded.name_en, summary_es = excluded.summary_es, summary_en = excluded.summary_en, best_for_es = excluded.best_for_es, best_for_en = excluded.best_for_en, difficulty = excluded.difficulty, steps = excluded.steps, image_url = excluded.image_url, image_credit = excluded.image_credit, image_source_url = excluded.image_source_url, sources = excluded.sources;

insert into public.species_seasons (species_id, region, months, where_es, where_en, note_es, note_en, source_url)
select s.id, v.region, v.months, v.where_es, v.where_en, v.note_es, v.note_en, v.source_url
from (values
  ('Parachromis dovii', 'freshwater', array[3,3,3,3,3,2,2,2,1,1,2,2]::smallint[], 'Lago Arenal, Caño Negro, Río Frío', 'Lake Arenal, Caño Negro, Río Frío', 'Se pesca todo el año, pero en época seca el nivel del agua baja y los peces se concentran.', 'Caught year-round, but in the dry season water levels drop and fish concentrate.', 'https://www.vacationscostarica.com/fishing/species/rainbow-bass/'),
  ('Brycon guatemalensis', 'freshwater', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Lago Arenal, Caño Negro, ríos de tierras bajas del Caribe', 'Lake Arenal, Caño Negro, Caribbean lowland rivers', 'Se pesca todo el año; busca desembocaduras y árboles con fruta caída sobre el agua.', 'Caught year-round; look for creek mouths and trees dropping fruit on the water.', 'https://www.vacationscostarica.com/fishing/species/machaca/'),
  ('Centropomus undecimalis', 'caribbean', array[2,2,3,3,3,2,1,1,3,3,3,2]::smallint[], 'Barra del Colorado, Tortuguero, Parismina', 'Barra del Colorado, Tortuguero, Parismina', 'Dos picos: marzo-mayo y septiembre-noviembre; en julio-agosto los ríos bajan sucios.', 'Two peaks: March-May and September-November; in July-August rivers run muddy.', 'https://fishingbooker.com/blog/costa-rica-fishing-seasons/'),
  ('Centropomus undecimalis', 'freshwater', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Caño Negro, Río Frío, Río San Juan, Río Colorado', 'Caño Negro, Río Frío, Río San Juan, Río Colorado', 'Entra a ríos y lagunas del norte y se pesca todo el año.', 'It runs up northern rivers and lagoons and is caught year-round.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Centropomus undecimalis', 'pacific', array[1,1,3,3,3,2,2,2,3,3,3,2]::smallint[], 'Golfo Dulce, Térraba-Sierpe, Golfo de Nicoya, desembocaduras', 'Golfo Dulce, Térraba-Sierpe, Gulf of Nicoya, river mouths', 'En el Pacífico el róbalo es otra especie (C. viridis, C. nigrescens); picos marzo-mayo y septiembre-noviembre.', 'On the Pacific the snook is a different species (C. viridis, C. nigrescens); peaks March-May and September-November.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Megalops atlanticus', 'caribbean', array[2,3,3,3,3,2,1,1,3,3,2,2]::smallint[], 'Barra del Colorado, Tortuguero, Parismina', 'Barra del Colorado, Tortuguero, Parismina', 'Mejor de febrero a mayo y en septiembre-octubre; julio y agosto son difíciles por las lluvias.', 'Best February-May and September-October; July and August are tough due to rain.', 'https://fishingbooker.com/blog/costa-rica-fishing-seasons/'),
  ('Megalops atlanticus', 'freshwater', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Caño Negro, Río San Juan, Río Frío, Río Colorado', 'Caño Negro, Río San Juan, Río Frío, Río Colorado', 'Sube por los ríos del norte y se pesca todo el año; practica captura y suelta.', 'It runs up northern rivers and is caught year-round; practice catch and release.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Lutjanus campechanus', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Arrecifes de Cahuita y Manzanillo', 'Cahuita and Manzanillo reefs', 'Esta especie casi no llega a Costa Rica; en el Caribe el pargo rojo suele ser L. purpureus.', 'This species barely reaches Costa Rica; Caribbean red snapper here is usually L. purpureus.', 'https://www.fishbase.se/summary/Lutjanus-campechanus'),
  ('Lutjanus campechanus', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Papagayo, Quepos, Golfito', 'Gulf of Papagayo, Quepos, Golfito', 'En el Pacífico el pargo rojo es L. colorado o L. peru, y se pesca todo el año en fondos rocosos.', 'On the Pacific the red snapper is L. colorado or L. peru, caught year-round over rocky bottoms.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Lutjanus guttatus', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Nicoya, Golfo de Papagayo, Quepos, Golfito', 'Gulf of Nicoya, Gulf of Papagayo, Quepos, Golfito', 'Se pesca todo el año; respeta la veda del Golfo de Nicoya interior (1 mayo-31 julio).', 'Caught year-round; respect the inner Gulf of Nicoya closure (May 1-July 31).', 'https://archivo.revistas.ucr.ac.cr/index.php/rbt/article/view/11303'),
  ('Coryphaena hippurus', 'pacific', array[2,2,2,2,3,3,3,3,3,2,3,2]::smallint[], 'Quepos, Golfo de Papagayo, Golfito, Los Sueños', 'Quepos, Gulf of Papagayo, Golfito, Los Sueños', 'Abunda en época lluviosa cuando los ríos arrastran troncos y basura flotante al mar.', 'Most abundant in the rainy season when rivers wash floating debris out to sea.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Coryphaena hippurus', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Mar afuera de Limón y Puerto Viejo', 'Offshore Limón and Puerto Viejo', 'Se pesca mar afuera todo el año cuando el clima permite salir.', 'Caught offshore year-round whenever weather allows.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Makaira nigricans', 'pacific', array[3,3,2,2,2,3,3,3,2,1,2,3]::smallint[], 'Quepos, Los Sueños, Golfito, Flamingo', 'Quepos, Los Sueños, Golfito, Flamingo', 'Presente todo el año; mejores ventanas diciembre-marzo y junio-agosto; suéltalo siempre.', 'Present year-round; best windows December-March and June-August; always release it.', 'https://fishingbooker.com/blog/costa-rica-fishing-seasons/'),
  ('Kajikia audax', 'pacific', array[3,2,2,1,1,1,1,1,1,2,3,3]::smallint[], 'Golfo de Papagayo, Flamingo, Quepos', 'Gulf of Papagayo, Flamingo, Quepos', 'Llega con aguas más frescas de noviembre a enero; el resto del año es ocasional.', 'Shows with cooler water November-January; the rest of the year it is occasional.', 'https://fishingbooker.com/blog/costa-rica-fishing-seasons/'),
  ('Istiophorus platypterus', 'pacific', array[3,3,3,3,2,2,2,2,2,2,2,3]::smallint[], 'Quepos, Los Sueños, Golfito, Golfo de Papagayo', 'Quepos, Los Sueños, Golfito, Gulf of Papagayo', 'Pico de diciembre a abril en Pacífico central y sur; en Guanacaste es mejor de mayo a agosto. Solo captura y suelta.', 'Peak December-April in the central and south Pacific; Guanacaste is better May-August. Catch and release only.', 'https://fishingbooker.com/blog/costa-rica-fishing-seasons/'),
  ('Acanthocybium solandri', 'pacific', array[2,2,2,2,3,3,3,3,2,1,2,2]::smallint[], 'Golfo de Papagayo, Islas Murciélago, Quepos, Golfito', 'Gulf of Papagayo, Murciélago Islands, Quepos, Golfito', 'Mejor de mayo a agosto cerca de islas, montes submarinos y puntas rocosas.', 'Best May-August around islands, seamounts and rocky points.', 'https://sportfishingbluemarlin.com/fishing-calendar/'),
  ('Acanthocybium solandri', 'caribbean', array[1,2,2,2,2,2,1,1,1,1,1,1]::smallint[], 'Mar afuera de Limón y Puerto Viejo', 'Offshore Limón and Puerto Viejo', 'Se reporta sobre todo de febrero a junio, con poca información.', 'Reported mostly February-June, with little data.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Thunnus albacares', 'pacific', array[2,2,2,2,2,3,3,3,3,2,2,2]::smallint[], 'Quepos, Golfito, Golfo de Papagayo, mar afuera', 'Quepos, Golfito, Gulf of Papagayo, offshore', 'Se pesca todo el año; los cardúmenes se acercan más de junio a septiembre.', 'Caught year-round; schools come closer to shore June-September.', 'https://sportfishingbluemarlin.com/fishing-calendar/'),
  ('Cynoscion squamipinnis', 'pacific', array[2,2,2,2,0,0,0,2,2,2,2,2]::smallint[], 'Golfo de Nicoya, desembocadura del Tempisque, Golfo Dulce', 'Gulf of Nicoya, Tempisque river mouth, Golfo Dulce', 'Veda en el Golfo de Nicoya interior del 1 de mayo al 31 de julio para proteger su reproducción.', 'Closed season in the inner Gulf of Nicoya May 1-July 31 to protect spawning.', 'https://elmundo.cr/costa-rica/inicia-veda-pesquera-en-el-golfo-de-nicoya-para-proteger-recursos-marinos/'),
  ('Caranx hippos', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Barra del Colorado, Tortuguero, Limón', 'Barra del Colorado, Tortuguero, Limón', 'Muy común en bocas de río y costa todo el año.', 'Very common at river mouths and along the coast year-round.', 'https://archivo.revistas.ucr.ac.cr/index.php/rbt/article/view/30658'),
  ('Caranx hippos', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Nicoya, Golfo Dulce, playas del Pacífico', 'Gulf of Nicoya, Golfo Dulce, Pacific beaches', 'En el Pacífico el jurel es C. caninus, muy parecido; se pesca todo el año.', 'On the Pacific the jack is the very similar C. caninus; caught year-round.', 'https://www.fishbase.se/summary/Caranx-caninus'),
  ('Trachinotus falcatus', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Playas y arrecifes de Cahuita, Manzanillo y Limón', 'Beaches and reefs of Cahuita, Manzanillo and Limón', 'Captura ocasional en playas y arrecifes del Caribe; hay pocos datos de temporada.', 'Occasional catch on Caribbean beaches and reefs; little seasonal data.', 'https://www.fishbase.se/summary/Trachinotus-falcatus'),
  ('Lutjanus cyanopterus', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Arrecifes de Cahuita, Manzanillo, Barra del Colorado', 'Cahuita and Manzanillo reefs, Barra del Colorado', 'Se pesca en arrecifes y bocas de río del Caribe todo el año, con pocos datos de temporada.', 'Caught on Caribbean reefs and river mouths year-round, with little seasonal data.', 'https://www.fishbase.se/summary/Lutjanus-cyanopterus'),
  ('Lutjanus cyanopterus', 'pacific', array[2,3,3,3,2,2,2,2,2,2,2,3]::smallint[], 'Golfito, Península de Osa, Golfo de Papagayo, Quepos', 'Golfito, Osa Peninsula, Gulf of Papagayo, Quepos', 'En el Pacífico la cubera es L. novemfasciatus; mejor de febrero a abril y en diciembre.', 'On the Pacific the cubera is L. novemfasciatus; best February-April and December.', 'https://inthespread.com/blog/costa-rica-fishing-calendar-for-the-southern-zone-358'),
  ('Scomberomorus maculatus', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Costa de Limón, Puerto Viejo, Tortuguero', 'Limón coast, Puerto Viejo, Tortuguero', 'Se pesca todo el año cerca de la costa.', 'Caught year-round close to shore.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Scomberomorus maculatus', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Nicoya, Golfo de Papagayo, Quepos', 'Gulf of Nicoya, Gulf of Papagayo, Quepos', 'En el Pacífico la sierra es S. sierra; se pesca todo el año.', 'On the Pacific the sierra is S. sierra; caught year-round.', 'https://www.entercostarica.com/travel-guide/costa-rica-maps/fishing-map'),
  ('Sphyraena barracuda', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Arrecifes de Cahuita y Manzanillo, mar afuera de Limón', 'Cahuita and Manzanillo reefs, offshore Limón', 'Se pesca todo el año en arrecifes y mar afuera.', 'Caught year-round on reefs and offshore.', 'https://amp.entercostarica.com/tours/puerto-viejo-tours/offshore-sport-fishing-full-day'),
  ('Sphyraena barracuda', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Papagayo, Quepos, Golfito', 'Gulf of Papagayo, Quepos, Golfito', 'En el Pacífico la barracuda es otra especie (S. ensis); se pesca todo el año.', 'On the Pacific the barracuda is another species (S. ensis); caught year-round.', 'https://www.fishbase.se/summary/Sphyraena-ensis'),
  ('Epinephelus quinquefasciatus', 'pacific', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Golfo Dulce, Golfo de Nicoya, Isla del Caño, Golfo de Papagayo', 'Golfo Dulce, Gulf of Nicoya, Caño Island, Gulf of Papagayo', 'Especie amenazada y de crecimiento lento; si lo enganchas, suéltalo.', 'Threatened, slow-growing species; if you hook one, release it.', 'https://www.fishbase.se/summary/Epinephelus-quinquefasciatus'),
  ('Carcharhinus leucas', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Barra del Colorado, Tortuguero, bocas de río', 'Barra del Colorado, Tortuguero, river mouths', 'Frecuente en bocas de río; el aleteo está prohibido y se recomienda la suelta.', 'Frequent at river mouths; finning is illegal and release is recommended.', 'https://www.fishbase.se/summary/Carcharhinus-leucas'),
  ('Carcharhinus leucas', 'pacific', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Golfo Dulce, Golfo de Nicoya, Térraba-Sierpe', 'Golfo Dulce, Gulf of Nicoya, Térraba-Sierpe', 'Golfo Dulce es zona de crianza; se recomienda la suelta.', 'Golfo Dulce is a nursery area; release is recommended.', 'https://www.fishbase.se/summary/Carcharhinus-leucas'),
  ('Carcharhinus leucas', 'freshwater', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Río San Juan, Río Colorado, Río Frío', 'Río San Juan, Río Colorado, Río Frío', 'Sube por los ríos del norte; captura ocasional.', 'It runs up northern rivers; occasional catch.', 'https://www.fishbase.se/summary/Carcharhinus-leucas'),
  ('Gerres cinereus', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Lagunas y bocas de río de Tortuguero, Limón, Cahuita', 'Tortuguero lagoons and river mouths, Limón, Cahuita', 'Común en lagunas costeras y fondos arenosos todo el año.', 'Common in coastal lagoons and sandy flats year-round.', 'https://www.fishbase.se/summary/Gerres-cinereus'),
  ('Gerres cinereus', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Nicoya, Golfo Dulce, manglares', 'Gulf of Nicoya, Golfo Dulce, mangroves', 'Común en manglares y playas todo el año.', 'Common in mangroves and beaches year-round.', 'https://www.fishbase.se/summary/Gerres-cinereus'),
  ('Joturus pichardi', 'freshwater', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Ríos Pacuare, Reventazón y Sarapiquí', 'Pacuare, Reventazón and Sarapiquí rivers', 'Vive en rápidos de ríos del Caribe y baja al estuario a desovar; pesca difícil.', 'Lives in Caribbean-slope river rapids and migrates to estuaries to spawn; hard to target.', 'https://revistas.uned.ac.cr/index.php/cuadernos/article/view/2723'),
  ('Oreochromis niloticus', 'freshwater', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Lago Arenal, embalses, lagunas y fincas de pesca', 'Lake Arenal, reservoirs, lagoons and pay ponds', 'Especie introducida que se pesca todo el año.', 'Introduced species caught year-round.', 'https://www.vacationscostarica.com/fishing/species/rainbow-bass/'),
  ('Rhamdia guatemalensis', 'freshwater', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Ríos y quebradas de ambas vertientes, Caño Negro', 'Rivers and creeks on both slopes, Caño Negro', 'Se pesca todo el año, sobre todo de noche y con carnada en el fondo.', 'Caught year-round, mostly at night with bait on the bottom.', 'https://www.fishbase.se/summary/Rhamdia-guatemalensis'),
  ('Agonostomus monticola', 'freshwater', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Ríos de montaña de ambas vertientes', 'Mountain rivers on both slopes', 'Se pesca todo el año en ríos de corriente; el agua clara de la época seca ayuda.', 'Caught year-round in fast rivers; clear dry-season water helps.', 'https://www.fishbase.se/summary/Agonostomus-monticola'),
  ('Mayaheros urophthalmus', 'freshwater', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Lagunas del Caribe norte, Tortuguero', 'Northern Caribbean lagoons, Tortuguero', 'Su presencia en Costa Rica es escasa; muchas ''viejas'' locales son otras especies.', 'Scarce in Costa Rica; many local ''viejas'' are other cichlid species.', 'https://www.fishbase.se/summary/Mayaheros-urophthalmus'),
  ('Atractosteus tropicus', 'freshwater', array[2,2,2,2,1,1,1,1,1,1,1,2]::smallint[], 'Caño Negro, Río Frío, Río San Juan', 'Caño Negro, Río Frío, Río San Juan', 'Se reproduce de abril a octubre; en época seca las lagunas bajan y es más fácil ubicarlo.', 'Spawns April-October; in the dry season lagoons shrink and it is easier to find.', 'https://tropicalstudies.org/rbt/attachments/volumes/vol45-2/11_Mora_Atractosteus_tropicus.pdf'),
  ('Haemulon plumierii', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Arrecifes de Cahuita, Manzanillo, Limón', 'Cahuita, Manzanillo and Limón reefs', 'Común en arrecifes todo el año.', 'Common on reefs year-round.', 'https://www.fishbase.se/summary/Haemulon-plumierii'),
  ('Nematistius pectoralis', 'pacific', array[3,3,3,3,2,2,2,2,2,2,2,3]::smallint[], 'Golfo de Papagayo, Herradura, Península de Osa, Golfito', 'Gulf of Papagayo, Herradura, Osa Peninsula, Golfito', 'Se pesca todo el año desde playas rocosas y lancha; mejor en época seca. Practica la suelta.', 'Caught year-round from rocky beaches and boats; best in the dry season. Practice release.', 'https://fishingbooker.com/blog/costa-rica-fishing-seasons/'),
  ('Mugil cephalus', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Esteros y bocas de río del Golfo de Nicoya y Golfo Dulce', 'Estuaries and river mouths of the Gulf of Nicoya and Golfo Dulce', 'Común en esteros todo el año; se usa mucho como carnada.', 'Common in estuaries year-round; widely used as bait.', 'https://www.fishbase.se/summary/Mugil-cephalus'),
  ('Mugil cephalus', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Bocas de río y lagunas de Tortuguero y Limón', 'River mouths and lagoons of Tortuguero and Limón', 'Común en bocas de río todo el año; se usa como carnada.', 'Common at river mouths year-round; used as bait.', 'https://www.fishbase.se/summary/Mugil-cephalus'),
  ('Strongylura notata', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Canales de Tortuguero, lagunas y bocas de río', 'Tortuguero canals, lagoons and river mouths', 'Común en canales y lagunas costeras todo el año.', 'Common in canals and coastal lagoons year-round.', 'https://www.fishbase.se/summary/Strongylura-notata'),
  ('Caranx crysos', 'caribbean', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Costa de Limón, Puerto Viejo, Cahuita', 'Limón coast, Puerto Viejo, Cahuita', 'Se pesca todo el año cerca de la costa; buena carnada viva.', 'Caught year-round near shore; good live bait.', 'https://www.fishbase.se/summary/Caranx-crysos'),
  ('Caranx crysos', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Golfo de Papagayo, Golfo de Nicoya, Quepos', 'Gulf of Papagayo, Gulf of Nicoya, Quepos', 'En el Pacífico la cojinuda es C. caballus; se pesca todo el año.', 'On the Pacific the blue runner is C. caballus; caught year-round.', 'https://www.fishbase.se/summary/Caranx-caballus'),
  ('Xiphias gladius', 'pacific', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Mar afuera de Los Sueños, Quepos y Golfo de Papagayo', 'Offshore Los Sueños, Quepos and Gulf of Papagayo', 'Pesca deportiva rara, de noche o a gran profundidad; hay pocos datos de temporada.', 'Rare sport catch, at night or deep-dropping; little seasonal data.', 'https://www.fishbase.se/summary/Xiphias-gladius'),
  ('Rachycentron canadum', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Mar afuera de Limón y Puerto Viejo', 'Offshore Limón and Puerto Viejo', 'Captura ocasional en el Caribe; no vive en el Pacífico oriental.', 'Occasional catch on the Caribbean; absent from the eastern Pacific.', 'https://amp.entercostarica.com/tours/puerto-viejo-tours/offshore-sport-fishing-full-day'),
  ('Trachinotus carolinus', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Playas arenosas de Limón y Cahuita', 'Sandy beaches of Limón and Cahuita', 'Captura ocasional en playas; hay pocos datos de temporada.', 'Occasional beach catch; little seasonal data.', 'https://www.fishbase.se/summary/Trachinotus-carolinus'),
  ('Epinephelus labriformis', 'pacific', array[2,2,2,2,2,2,2,2,2,2,2,2]::smallint[], 'Fondos rocosos de Papagayo, Quepos, Isla del Caño, Golfito', 'Rocky bottoms of Papagayo, Quepos, Caño Island, Golfito', 'Común en fondos rocosos todo el año.', 'Common over rocky bottoms year-round.', 'https://www.fishbase.se/summary/Epinephelus-labriformis'),
  ('Dasyatis americana', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Playas y lagunas de Limón y Cahuita', 'Beaches and lagoons of Limón and Cahuita', 'Captura incidental en fondos arenosos; manéjala con cuidado y suéltala.', 'Incidental catch over sand; handle with care and release it.', 'https://www.fishbase.se/summary/Hypanus-americanus'),
  ('Sardinella aurita', 'caribbean', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Costa de Limón', 'Limón coast', 'Se usa sobre todo como carnada; la veda de sardina de INCOPESCA aplica al Pacífico.', 'Mostly used as bait; INCOPESCA''s sardine closure applies to the Pacific.', 'https://incopesca.go.cr/acerca_incopesca/transparencia_institucional/jerarcas_decisiones/acuerdos/AJDIP-028-2026 Aprueba_Veda_Sardina_2026.pdf'),
  ('Oncorhynchus mykiss', 'freshwater', array[3,3,3,2,2,2,2,2,1,1,2,2]::smallint[], 'Río Savegre (San Gerardo de Dota), Cerro de la Muerte, Orosi', 'Savegre River (San Gerardo de Dota), Cerro de la Muerte, Orosi', 'Se pesca todo el año; enero y febrero son los mejores meses por el agua baja y clara.', 'Fished year-round; January and February are best thanks to low, clear water.', 'https://thecatchandthehatch.com/fly-fishing-for-trout-in-costa-rica/'),
  ('Poecilia gillii', 'freshwater', array[1,1,1,1,1,1,1,1,1,1,1,1]::smallint[], 'Quebradas, acequias y lagunas de todo el país', 'Creeks, ditches and ponds nationwide', 'Pez pequeño que se atrapa más como carnada o curiosidad que como pesca deportiva.', 'Small fish caught more as bait or curiosity than as sport.', 'https://www.fishbase.se/summary/Poecilia-gillii')
) as v(sci, region, months, where_es, where_en, note_es, note_en, source_url)
join public.species s on s.scientific_name = v.sci
on conflict (species_id, region) do update set months = excluded.months, where_es = excluded.where_es, where_en = excluded.where_en, note_es = excluded.note_es, note_en = excluded.note_en, source_url = excluded.source_url;
