import { useState } from 'react'
import { PageHeader, Section, TheoryBlock, Step } from '../components/Common.jsx'
import TabBlock from '../components/TabBlock.jsx'
import { useProgress } from '../context/ProgressContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Artist images (multi-image hero) ───────────────────────────────────────

const ARTIST_IMAGES = {
  hendrix:    ['/images/hendrix.jpg',         '/images/hendrix3.jpg',         '/images/licks/hendrix.jpg'],
  page:       [],
  mayer:      ['/images/licks/mayer.jpg',     '/images/mayer2.jpg',           '/images/mayer3.jpg'],
  bonamassa:  ['/images/licks/bonamassa.jpg'],
  srv:        ['/images/licks/srv.jpg'],
  bbking:     ['/images/licks/bbking.jpg',    '/images/bbking2.jpg',          '/images/bbking3.jpg'],
  buddyguy:   ['/images/buddyGuy.jpg',        '/images/buddyGuy2.jpg',        '/images/buddyGuy3.jpg'],
  clapton:    ['/images/ericClapton.jpg',     '/images/ericClapton2.jpg',     '/images/ericClapton3.webp'],
}

// ─── Data: 7 artists, 6 licks each = 42 total ───────────────────────────────

const ARTISTS = [
  {
    id: 'hendrix',
    artist: 'Jimi Hendrix',
    initial: 'JH',
    color: '#a78bfa',
    bgFrom: '#312e81',
    bgTo: '#1e1b4b',
    era: '1942–1970',
    style: 'Blues psicodélico · Soul · Rock',
    bio: 'Pai do blues psicodélico. Misturava acompanhamento e solo no mesmo compasso — double-stops, ornamentos com polegar tocando o baixo, hammer-ons fluidos. Pegava o blues do Mississippi e dobrava com feedback, fuzz e groove de R&B.',
    licks: [
      {
        id: 'little-wing', song: 'Little Wing', album: 'Axis: Bold as Love (1967)',
        key: 'Mi menor (Em)', shape: 'Caixa 2 (Em pent) · 3ª casa · double-stops G/B', tempo: '76 BPM', timeSig: '12/8',
        rhythm: '   .   .   1   .   .   2   .   .   3   .   .   4',
        tab: [
          'e|----------------------------------------------|',
          'B|------ 8----7------------- 3---0--------------|',
          'G|--7------9------7--- /4----------4------------|',
          'D|---------------------------5---5--------------|',
          'A|----------------------------------------------|',
          'E|----------------------------------------------|',
        ],
        techniques: ['Double-stops (G+B)', 'Hammer-on 7→9', 'Slide ascendente', 'Acordes ornamentais'],
        howTo: 'Os double-stops nas cordas G+B saem com médio e anelar simultaneamente. Deixe a G "ringar" em 7 enquanto B faz 8→7. O slide para a 4ª casa imita uma voz cantando. Polegar abafa a 6ª corda — Hendrix usava o polegar quase como sexto dedo.',
        feeling: 'Hendrix nunca tocava solo puro ou acompanhamento puro — ele dançava entre os dois. Uma frase responde a outra. Toque com groove, deixe espaço, respire.',
        tip: 'Pratique a 60 BPM até os double-stops saírem 100% sincronizados. Quando dominar, adicione o slide e as notas ornamentais.',
      },
      {
        id: 'purple-haze', song: 'Purple Haze', album: 'Are You Experienced (1967)',
        key: 'Mi (E) — Mixolídio + 7#9', shape: 'Caixa 1 (E pent) · 7ª casa + E7#9 voicing', tempo: '108 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--8b10--8--7---------- 3-----0------ 0-3-0------|',
          'G|----------- 9-/7------------- 0---0-----------4-|',
          'D|-----------------------------5---5--------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend de tom inteiro', 'Slide descendente 9→7', 'Hammer-on', 'Acorde 7#9 (Hendrix chord)'],
        howTo: 'O bend inicial (8b10) é o "grito" — afine como casa 10 normal. Depois 8-7 melódico, slide 9-7 na G. Os acordes finais usam o E7#9 — forma 0-7-6-7-8-X — base de toda a música.',
        feeling: 'Hendrix tocava como se a guitarra estivesse possuída. A combinação bend + frase rápida + acorde dissonante cria a sensação psicodélica. Toque com convicção.',
        tip: 'Estude o E7#9 (Hendrix chord) separadamente. Forma: 0-7-6-7-8-X (do agudo pro grave). Sem ele, o lick perde 50% da identidade.',
      },
      {
        id: 'voodoo-child', song: 'Voodoo Child (Slight Return)', album: 'Electric Ladyland (1968)',
        key: 'Mi (E) — Pentatônica menor + wah', shape: 'Caixa 1 (Em pent) · posição aberta + wah', tempo: '92 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|----------------------------- 5---8-------------|',
          'G|--7b9-7-5---- 4h5-4--- 0------------ 5-7--- 7---|',
          'D|------------ 7--------------- 7-(7)~~-----------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend agressivo', 'Hammer + pull rápido', 'Vibrato sustentado', 'Sincronia com wah'],
        howTo: 'Comece com bend tom inteiro na 7 (G) — empurre forte. Descida 7-5-7 na D em semicolcheia. O h5 (hammer 4→5) é "vibração" rápida. Mantenha o wah em sincronia: aberto nos bends, fechado nas notas baixas.',
        feeling: 'Voodoo Child é puro Hendrix em modo atacando. Cada nota tem garra, cada bend tem fúria. Não toque "limpinho" — toque com a guitarra distorcida e pegada nervosa.',
        tip: 'Sem wah-wah, perde 70% da magia. Pratique mover o wah em sincronia: abre nas notas longas, fecha nas curtas.',
      },
      {
        id: 'wind-cries-mary', song: 'The Wind Cries Mary', album: 'Are You Experienced (1967)',
        key: 'Fá (F) — Maior com cromatismos', shape: 'Forma F (CAGED) · 5ª–10ª casa cordas e/B', tempo: '72 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|--------5-6-8------ 10-8-6---- 5-3---- 5--------|',
          'B|--6-8------------------------------ 6-----------|',
          'G|----------------- 7--------------------- 5------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Frase melódica clean', 'Cromatismo descendente', 'Bend mínimo (¼)', 'Espaçamento entre frases'],
        howTo: 'Esse é Hendrix no modo cantor melodista — sem distorção, sem efeito. A frase desce cromaticamente (10-8-6-5-3) imitando uma voz lamentando. Use palhetada limpa, sem ataque agressivo.',
        feeling: 'The Wind Cries Mary mostra que Hendrix era também um poeta sutil — não só barulho psicodélico. O lick parece "chorar" no agudo. Toque pensando em uma canção de ninar.',
        tip: 'Use tom limpo de Stratocaster — sem fuzz. Adicione vibrato leve na última nota (5 na corda E aguda). Cada frase precisa "respirar" antes da próxima.',
      },
      {
        id: 'hey-joe', song: 'Hey Joe', album: 'Are You Experienced (1967)',
        key: 'Mi maior (E) — Verso pentatônico', shape: 'Caixa aberta (E pent) · 0–4ª casa', tempo: '80 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 0-3-0---------|',
          'B|----------- 3---0-----0---3------------ 3-------|',
          'G|----- 2---4---------- 2------------- 2--------2-|',
          'D|--2-4---------------------------- 2-------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Pentatônica em colcheia', 'Hammer-on 2→4', 'Frase ascendente + descendente', 'Pull-off subutilizado'],
        howTo: 'O lick é uma "corrida descida e subida" pela pentatônica menor de Mi. Use hammer-on 2→4 nas cordas D e A pra economia de palheta. O retorno (3-0-3) na B usa hammer/pull alternado.',
        feeling: 'Hey Joe é Hendrix interpretando uma música antiga (originalmente do Billy Roberts). O lick do verso é "espinha dorsal" — segura a estrutura toda. Toque com swing leve, quase preguiçoso.',
        tip: 'Pratique a alternância palheta/hammer com metrônomo. A primeira nota de cada par é palhetada, a segunda é hammer. Isso dobra a velocidade aparente sem dobrar o esforço.',
      },
      {
        id: 'castles-made-of-sand', song: 'Castles Made of Sand', album: 'Axis: Bold as Love (1967)',
        key: 'Mi menor (Em) — Triádico clean', shape: 'Caixa 5 (Em pent) · 12ª–15ª casa cordas E/B', tempo: '68 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------ 12-15---- 12-15----------------- 12-10---|',
          'B|---13------- 13------- 13---- 12---- 10---------|',
          'G|------------------------------ 12---------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Octava sobreposta (12/15)', 'Movimento triádico', 'Slide micro', 'Articulação clean'],
        howTo: 'Toque os pares (13-12 e 13-15) usando indicador e mínimo — economia máxima. A frase descende de 13 pra 10 na B, sempre alternando com a oitava na E aguda. Tom limpo, palheta com unha.',
        feeling: 'Castles Made of Sand é uma das poucas canções acústicas/limpas do Hendrix — letra existencial. O lick está no fim da frase de cada verso, como uma "vinheta" reflexiva.',
        tip: 'Use o dedo polegar da mão direita pra tocar a corda B enquanto o indicador toca a E aguda — fingerpicking de jazz. Hendrix raramente fazia isso, mas funciona perfeitamente aqui.',
      },
    ],
  },
  {
    id: 'page',
    artist: 'Jimmy Page',
    initial: 'JP',
    color: '#6366f1',
    bgFrom: '#312e81',
    bgTo: '#1e1b4b',
    era: '1944 – presente',
    style: 'Hard rock · Blues rock · Folk acústico',
    bio: 'O arquiteto do som do Led Zeppelin. Jimmy Page foi sessionista de estúdio em Londres antes de fundar o Zeppelin em 1968 — o que explica seu domínio sobre TODOS os estilos: blues, rock pesado, folk celta, indiano. Inventou ou popularizou: o riff em oitavas, a guitarra com arco de violino, a microfonação de bateria à distância, e os "riffs-arquitetura" (Whole Lotta Love, Black Dog, Kashmir).',
    licks: [
      {
        id: 'stairway-solo', song: 'Stairway to Heaven', album: 'Led Zeppelin IV (1971)',
        key: 'Lá menor (Am) — Pentatônica + escala maior', shape: 'Caixa 1 (Am pent) · 5ª–8ª casa · cordas G/B/e', tempo: '82 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|----------------------------------------------------|',
          'B|------- 8b10r8------ 8-5-------- 5-8-5--------------|',
          'G|--- 7p5----- 7-5-7----- 7-5-7------------------ 5-7-|',
          'D|----------------------------------------------------|',
          'A|----------------------------------------------------|',
          'E|----------------------------------------------------|',
        ],
        techniques: ['Pull-off 7→5', 'Bend tom inteiro 8b10', 'Frase pentatônica fluída', 'Articulação melódica'],
        howTo: 'O solo de Stairway é considerado um dos melhores da história do rock. Pull-off 7→5 inicial (palheta na 7), depois 7-5-7 alternado. Bend 8b10r8 controlado. Termine subindo 5-7 na G aguda. Toda nota soa por mais de meio tempo.',
        feeling: 'O solo de Stairway é MELÓDICO antes de virtuoso. Cada nota é escolhida pelo significado, não pela velocidade. Imagine cantando o solo enquanto toca — ele realmente "canta".',
        tip: 'Page improvisou o solo em 3 takes diferentes — o disco usa a segunda. O solo "perfeito" não existe. Pratique improvisando sua própria versão dentro da mesma estrutura. Esse é o espírito do solo original.',
      },
      {
        id: 'whole-lotta-love', song: 'Whole Lotta Love', album: 'Led Zeppelin II (1969)',
        key: 'Mi (E) — Riff em oitavas', shape: 'Riff em corda E + A · 0ª–7ª casa', tempo: '88 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|---------------------------------------------|',
          'B|---------------------------------------------|',
          'G|---------------------------------------------|',
          'D|--- 7-7--------- 7-7---- 5-5---- 0-0---------|',
          'A|--- 7-7--------- 7-7---- 5-5---- 0-0---------|',
          'E|--- 0-0--------- 0-0---- 0-0---- 0-0---------|',
        ],
        techniques: ['Power chord em movimento', 'Riff em oitavas paralelas', 'Pegada rítmica firme', 'Síncope no contratempo'],
        howTo: 'O riff mais reconhecível do hard rock. Toque as cordas D e A juntas (oitavas) com indicador + anelar nas mesmas casas. A corda E aberta toca em todas as posições — pedal nota. Síncope marcada: o 7-7 cai exatamente no contratempo.',
        feeling: 'Whole Lotta Love é HARD ROCK puro — Page tinha 25 anos provando que blues podia ser PESADO. Pegada com palheta firme, distorção saturada (mas controlada), nenhuma hesitação. Bonham (bateria) define o groove — encaixe nele.',
        tip: 'Esse riff funciona em qualquer guitarra com pickup ponte. Pratique JUNTO com o disco — você precisa "sentar" no groove do Bonham. Sem isso, soa só como exercício.',
      },
      {
        id: 'black-dog', song: 'Black Dog', album: 'Led Zeppelin IV (1971)',
        key: 'Lá maior (A) — Pentatônica menor + acordes', shape: 'Caixa 1 (Am pent) · 5ª–8ª casa · com staccato', tempo: '92 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|---------------------------------------------|',
          'B|--- 5-7-5---- 5-7-5---- 5---- 3---- 5--------|',
          'G|----------- 7--------- 7---- 4---- 7---------|',
          'D|--- 5----- 5------------------- 5------------|',
          'A|---------------------------------------------|',
          'E|---------------------------------------------|',
        ],
        techniques: ['Frase pentatônica com saltos', 'Articulação staccato', 'Acordes ornamentais', 'Cromatismo 3→4→5'],
        howTo: 'Black Dog tem o riff mais "irregular" do Zeppelin — meses Robert Plant cantando sem banda, depois banda RESPONDENDO no contratempo. Esse lick é a "resposta" da banda. Frase staccato com saltos entre cordas. Mão direita controlada.',
        feeling: 'Page disse que tentou escrever um riff que ninguém pudesse cantar com bateria embaixo — conseguiu. Não tente "encaixar" no compasso óbvio. Toque com firmeza mas com surpresa rítmica.',
        tip: 'O segredo desse lick é ARTICULAÇÃO — cada nota tem ataque definido e silêncio depois. Use palhetada down em todas as notas (sem alternate), com pausa entre elas. Velocidade vem do timing.',
      },
      {
        id: 'heartbreaker', song: 'Heartbreaker (solo)', album: 'Led Zeppelin II (1969)',
        key: 'Lá menor (Am) — Pentatônica menor', shape: 'Caixa 1 (Am pent) · 5ª–8ª casa · alta velocidade', tempo: '95 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|---------------------------------------------|',
          'B|------- 8b10r8-5--- 8-5------ 5-8------------|',
          'G|--- 7p5----------- 7---- 5-7---------- 7-5---|',
          'D|----------------------------------- 7--------|',
          'A|---------------------------------------------|',
          'E|---------------------------------------------|',
        ],
        techniques: ['Pull-off em série', 'Bend & release rápido', 'Frase pentatônica acelerada', 'Articulação selvagem'],
        howTo: 'Solo de Heartbreaker é uma das primeiras "performances solo a cappella" no rock — Page para a banda inteiro e improvisa sozinho por 30 segundos. Esse lick é o ÁPICE. Pull-off 7-5 + bend 8b10r8 + descida 8-5. Velocidade controlada.',
        feeling: 'Page tocava esse solo COM A GUITARRA SEM AMPLIFICAR no estúdio — capturado pelos microfones de ambiente. Soa "cru". Toque com leve distorção (não saturada). Cada nota soa "respondendo" a um silêncio.',
        tip: 'Esse solo INFLUENCIOU diretamente Eddie Van Halen — Van Halen disse que aprendeu sobre "ataque" assistindo Page tocar isso ao vivo. Estude a textura RÍTMICA do solo, não as notas. É o RITMO de Page que é único.',
      },
      {
        id: 'kashmir', song: 'Kashmir', album: 'Physical Graffiti (1975)',
        key: 'Ré menor (Dm) — Modal oriental', shape: 'Riff em cordas D/A · 0ª–7ª casa · afinação DADGAD', tempo: '80 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|---------------------------------------------|',
          'B|---------------------------------------------|',
          'G|---------------------------------------------|',
          'D|--- 0-2-0-3-2-0------ 0-2-0-3-2-0------------|',
          'A|--- 0--------------- 0----------------------|',
          'E|---------------------------------------------|',
        ],
        techniques: ['Afinação DADGAD opcional', 'Riff modal (Dórico)', 'Pedal nota na corda A', 'Pegada ritualística'],
        howTo: 'Kashmir é mais que rock — é trance místico. O riff usa apenas 4 notas (0-2-3 na D, com 0 da A como pedal). Estrutura repetitiva, hipnótica. Toque CONSTANTE — sem aceleração, sem variação. Como mantra.',
        feeling: 'Page se inspirou no Marrocos (mesmo o título "Kashmir" sendo erro geográfico). O ritmo da bateria é em 4/4 mas a guitarra está em compasso de 3/4 SOBREPOSTO — polirritmia oriental. Não tente "consertar" — sinta a sobreposição.',
        tip: 'Versão original usa afinação DADGAD (D-A-D-G-A-D). Sem ela, esse riff perde 50% da magia. Vale a pena re-afinar uma guitarra só pra isso. Os intervalos vazios do DADGAD criam a "cor oriental" que define a música.',
      },
      {
        id: 'since-ive-been', song: "Since I've Been Loving You", album: 'Led Zeppelin III (1970)',
        key: 'Dó menor (Cm) — Blues lento', shape: 'Caixa 1 (Cm pent) · 8ª casa · slow blues', tempo: '64 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|---------------------------------------------|',
          'B|------- 11b13r11-(11)~~~--- 11-8-------- 8~~-|',
          'G|--- 10p8---------------------------- 10------|',
          'D|---------------------------------------------|',
          'A|---------------------------------------------|',
          'E|---------------------------------------------|',
        ],
        techniques: ['Pull-off 10→8', 'Bend tom inteiro 11b13', 'Vibrato longo sustentado', 'Espaço entre frases'],
        howTo: 'A música é o blues mais profundo do Zeppelin — Page no auge da expressividade. Pull-off 10→8 inicial (palheta na 10). Bend 11b13 SUSTENTADO com vibrato longo no release. Frase desce 11-8 com pausa, sobe 10, termina em 8 com vibrato.',
        feeling: 'Esse solo é considerado por Page como o melhor que ele JÁ GRAVOU. Ele teve que parar a gravação várias vezes pra "achar" a emoção certa. Toque com olhos fechados — é assim que o solo "sai sozinho".',
        tip: 'Page chorou em estúdio quando terminou de gravar esse solo (segundo John Bonham). Não tente "interpretar" — tente SENTIR. Bend tom inteiro precisa AFINAR — se desafinar, perde a magia. Pratique APENAS o bend por 10 minutos antes do lick.',
      },
    ],
  },
  {
    id: 'mayer',
    artist: 'John Mayer',
    initial: 'JM',
    color: '#60a5fa',
    bgFrom: '#1e3a8a',
    bgTo: '#0c4a6e',
    era: '1977 – presente',
    style: 'Blues moderno · Pop sofisticado · R&B',
    bio: 'O blues do século XXI. Mayer pegou a expressividade de Hendrix e SRV mas filtrou pela limpeza do pop. Frases que respiram, dinâmica suave, escolha cirúrgica de cada nota.',
    licks: [
      {
        id: 'slow-dancing', song: 'Slow Dancing in a Burning Room', album: 'Continuum (2006)',
        key: 'Si menor (Bm)', shape: 'Caixa 1 (Bm pent) · 7ª casa', tempo: '76 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------------- 5---5b7r5-------- 3---------------|',
          'G|--- 5h7----------------------- 5-2--------------|',
          'D|--------------------------------------- 5-------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Hammer-on suave 5→7', 'Half-step bend (½ tom)', 'Release controlado', 'Notas espaçadas'],
        howTo: 'Hammer-on 5→7 na G — palheta só na primeira, marteladinha sutil. Bend de meio tom (5b7→r5) controlado: dobre devagar, volte com calma. Anelar reforçado pelo médio.',
        feeling: 'Mayer toca como quem fala baixo numa conversa importante. Cada nota tem peso porque há espaço. Não toque rápido — toque intencionalmente.',
        tip: 'Grave o lick e ouça o tempo entre as notas. Se parece corrido, está rápido demais. Metrônomo em 70 BPM e respire um compasso entre repetições.',
      },
      {
        id: 'gravity', song: 'Gravity', album: 'Continuum (2006)',
        key: 'Sol (G) — Maior + blue notes', shape: 'Caixa 1 (Gm pent) · 3ª casa + blue notes', tempo: '62 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------------------------------------------------|',
          'B|----- 8b10r8------------------- 8-(8)~~~--------|',
          'G|------------- 10-7---- 7b9r7-5--- 5-------------|',
          'D|------------------------------ 7----------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend full + release', 'Vibrato lento e largo', 'Frases curtas com pausa', 'Sustain emocional'],
        howTo: 'Bend 8b10r8 tem que afinar exatamente — depois desliza pra 10, desce pra 7 na G. Segundo bend (7b9r7) é tom inteiro. Termine com vibrato longo na 8 do B — esse é a "alma".',
        feeling: 'Gravity é Mayer no auge da expressividade. O solo é uma súplica — letra fala em querer ser puxado pra baixo, e a guitarra também. Toque cantando junto se ajudar.',
        tip: 'Vibrato no final precisa durar 2 segundos no mínimo. Se você cortar curto, perde o efeito implorante. Segure a nota até a guitarra começar a feedback.',
      },
      {
        id: 'neon', song: 'Neon', album: 'Room for Squares (2001)',
        key: 'Mi (E) — Lídio brasileiro', shape: 'Posição aberta híbrida (thumb-style) · cordas E/B', tempo: '128 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|----- 0-7-9------ 0-7-9------ 0-7-9-------------|',
          'G|---8--------- 8----------- 8-----------8--------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|--- 0------------ 0----------- 0----------------|',
        ],
        techniques: ['Thumb bass (polegar)', 'Acordes incompletos', 'Coordenação polegar/dedos', 'Síncope'],
        howTo: 'Estilo "thumb-style" Tuck Andress. Polegar direito toca o grave (E aberto) em colcheias estáveis. Médio + anelar tocam o agudo (0-7-9 na B + 8 na G). Polegar NUNCA para.',
        feeling: 'Neon mistura jazz, fingerstyle e R&B. Coordenação polegar/dedos é o ponto crítico — você toca dois instrumentos ao mesmo tempo. Quando flui, soa magnético.',
        tip: 'Pratique APENAS o polegar tocando E grave em colcheias por 5 min. Depois adicione UMA nota nos dedos agudos. Leva semanas pra ficar fluido.',
      },
      {
        id: 'belief', song: 'Belief', album: 'Continuum (2006)',
        key: 'Lá menor (Am) — Pentatônica funk', shape: 'Caixa 1 (Am pent) · 5ª casa', tempo: '94 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 5-8-5----- 8-5----------- 5b7r5-3-----------|',
          'G|---------- 7-------- 7---5----------- 5---------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Frase staccato funk', 'Repetição rítmica', 'Bend & release rápido', 'Articulação seca'],
        howTo: 'Lick funk de pentatônica menor — toque com ataque firme, quase percussivo. As repetições (5-8-5 / 8-5) precisam ser idênticas. Bend 5b7r5 rápido, como um "soco".',
        feeling: 'Belief é Mayer no modo political-funk. Letra sobre fé religiosa que mata. Frase tem urgência, não é o Mayer "balada". Pegada de mão direita firme.',
        tip: 'Toque com palheta de espessura média (.73mm). Palheta fina não dá ataque suficiente. Cada nota precisa ter "click" inicial perceptível.',
      },
      {
        id: 'who-did-you-think', song: 'Who Did You Think I Was', album: 'Try! (2005)',
        key: 'Mi (E) — Blues rock', shape: 'Caixa 1+2 (Em pent) · transição 7ª→10ª casa', tempo: '120 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 5-8-----------|',
          'B|----- 5b7r5--------- 7-5-------- 8----- 8b10----|',
          'G|------------- 7-5------------- 7----------------|',
          'D|--- 7-----------------------------------------~~|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Pull-off pentatônico', 'Bend tom inteiro', 'Frase ascendente + descendente', 'Vibrato final'],
        howTo: 'Lick do John Mayer Trio — energia rock. Comece em D 7, sobe pelas pentatônicas com bend & release na B. O 8b10 final é o "explosão" — bend forte com vibrato.',
        feeling: 'No trio, Mayer mostra o lado rock dele — sem polidez do estúdio. Pegada Stratocaster com overdrive moderado. Toque alto, sem medo.',
        tip: 'Esse trio (Mayer + Pino Palladino + Steve Jordan) é referência obrigatória pra blues moderno. Estude os 3 instrumentistas separadamente — a interação entre eles é o segredo.',
      },
      {
        id: 'daughters', song: 'Daughters', album: 'Heavier Things (2003)',
        key: 'Si bemol (Bb) — R&B clean', shape: 'Caixa 1 (Bb pent) · 8ª–10ª casa', tempo: '78 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------ 10-13---- 10----- 8-10---- 8-------------|',
          'B|--- 11--------------- 11---------------- 11-----|',
          'G|------------------------------------------- 10--|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Lick clean R&B', 'Articulação suave', 'Frase melódica vocal', 'Sem distorção'],
        howTo: 'Tom limpo absoluto — sem nem reverb pesado. Palhetada com unha. Cada nota soa por meio compasso. O salto 10→13 na E aguda é "voz cantando" — vibrato sutil opcional.',
        feeling: 'Daughters é Mayer no modo pop-balada — música ganhou Grammy de "Song of the Year". O lick é refinado, como pop dos anos 70 (Carpenters, Bread). Toque com elegância.',
        tip: 'Use a guitarra acústica se tiver — soa ainda melhor. Capo na 3ª casa pra tocar como na gravação original (que está em D, capo 3 = Bb).',
      },
    ],
  },
  {
    id: 'bonamassa',
    artist: 'Joe Bonamassa',
    initial: 'JB',
    color: '#f472b6',
    bgFrom: '#831843',
    bgTo: '#500724',
    era: '1977 – presente',
    style: 'Blues rock agressivo · Hard blues',
    bio: 'Vocabulário enciclopédico do blues rock moderno. Pega frases de SRV, Clapton, Page e Beck e processa em alta velocidade com vibratos intensos e bends que cantam.',
    licks: [
      {
        id: 'blues-deluxe', song: 'Blues Deluxe', album: 'Blues Deluxe (2003)',
        key: 'Lá menor (Am) — blues lento', shape: 'Caixa 1 (Am pent) · 5ª casa', tempo: '60 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|------------------------------------------------|',
          'B|------------- 8b10r8---- 8-5-------- 5b7--- 5---|',
          'G|--- 5b7r5-7---------------------- 7-5----- 7----|',
          'D|--------------------------------------------- 5-7~~-|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend tom inteiro + release', 'Vibrato amplo', 'Frase descendente', 'Sustain longo'],
        howTo: 'Cover de Jeff Beck (que pegou de Bobby Bland). Bend 5→7 na G, depois 8→10 na B e libere. Desce 8-5 com swing pesado. O 5b7 mais agudo é o "grito". Termina com vibrato longo.',
        feeling: 'Blues Deluxe é Bonamassa em modo respeitando os mestres. Lick precisa soar VELHO, com toda autoridade do blues clássico. Não toque rápido — toque como se fosse contar uma história de bar.',
        tip: 'Estude a versão de Bonamassa E a original do Jeff Beck Group (1968). Compare o ataque, o vibrato. O lick é o mesmo — o envelope muda completamente.',
      },
      {
        id: 'sloe-gin', song: 'Sloe Gin', album: 'Sloe Gin (2007)',
        key: 'Dó menor (Cm) — blues balada', shape: 'Caixa B.B. King (Cm pent) · 11ª–13ª casa', tempo: '68 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------ 13b15~~~--- 13--- 11~~~--- 13-11---------|',
          'G|--------------------------------- 12-10-8-------|',
          'D|----------------------------------- 10b12r10~~--|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend implorante 1 tom', 'Vibrato sustentado', 'Frase descendente vocal', 'Bend-and-release final'],
        howTo: 'Lick puro choro. Comece em 13 na B, bend pra 15, SEGURE — vibrato por 2 tempos. Depois 13-11 com vibrato em cada. Desce melodicamente 12-10-8 na G. Termina com bend-release dramático na D.',
        feeling: 'Sloe Gin é uma das músicas mais emocionais do repertório de Bonamassa. O solo é o ÁPICE emocional do disco. Toque como se estivesse chorando.',
        tip: 'Bonamassa toca de olhos fechados — não é estilo, é necessário. Tente. Quando você fecha os olhos, os dedos param de "pensar" e o feeling sai sozinho.',
      },
      {
        id: 'mountain-time', song: 'Mountain Time', album: 'You & Me (2006)',
        key: 'Lá menor (Am) — blues rock', shape: 'Caixa 1 → Caixa 5 (Am pent) · 5ª–13ª casa', tempo: '120 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------- 8-10-12-8-5--- 8-10-------|',
          'B|--- 5p3-5b7---- 5b7r5-------------------- 13b15~~|',
          'G|----------- 7-------------------------- 5-------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Pull-off 5→3', 'Bends consecutivos', 'Frase pentatônica rápida', 'Bend agudo 13b15 final'],
        howTo: 'Frase rápida ascendente: pull-off 5→3 na B, bend 5→7 sustentado, 5b7r5 (bend e volta). Sobe pela B 8-10-12-8-5 em colcheias, alterna 8-10 e termina com BEND BRUTAL em 13b15 + vibrato.',
        feeling: 'Mountain Time mostra Bonamassa rápido mas musical. Não é só correr — cada frase termina sustentada. É o equilíbrio entre técnica e emoção.',
        tip: 'Pratique APENAS os 4 primeiros tempos a 60 BPM. Quando sair limpo, suba pra 80. Velocidade vem da limpeza, não do esforço.',
      },
      {
        id: 'dust-bowl', song: 'Dust Bowl', album: 'Dust Bowl (2011)',
        key: 'Sol menor (Gm) — Slide blues', shape: 'Slide em corda E aguda · 13ª–17ª casa', tempo: '92 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--- /15---/15---/15-15-13-15--------- /17-------|',
          'B|------------------------------ 15-13------------|',
          'G|------------------------------------------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Slide (com tubo)', 'Articulação aguda na E', 'Bend de slide (microbends)', 'Movimento horizontal'],
        howTo: 'Esse lick precisa de slide (tubo de vidro/metal). Use mínimo na corda E aguda — slide /15 várias vezes pra estabelecer o tom. Pequenas oscilações horizontais ao redor da casa 15 criam vibrato.',
        feeling: 'Dust Bowl é Bonamassa no modo Allman Brothers/Derek Trucks. Lick lamentoso, slide gemendo. Toque como se a guitarra fosse uma voz humana cantando blues.',
        tip: 'Sem slide físico, esse lick é impossível. Compre um (Dunlop 211 vidro Pyrex serve perfeito). Coloque no dedo mínimo. Os outros dedos abafam as cordas atrás do slide.',
      },
      {
        id: 'just-cos-you-can', song: "Just 'Cos You Can Don't Mean You Should", album: 'Different Shades of Blue (2014)',
        key: 'Mi (E) — Blues rock pesado', shape: 'Caixa 5 (Em pent) · 12ª–15ª casa', tempo: '88 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 12-15-12------|',
          'B|------- 12b14r12-------- 12-10---------- 12-----|',
          'G|--- 14----------- 14-12------------ 14----------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend tom inteiro 12b14', 'Frase pentatônica 12ª posição', 'Pull-off rápido', 'Articulação seca'],
        howTo: 'Lick na 12ª casa (uma oitava acima do Em pent box 1). Bend 12b14 com release. Frase ascendente 14-12 alterna com pull-off. Termina com salto 12-15-12 — três pontos rítmicos.',
        feeling: 'Just \'Cos You Can é Bonamassa em modo "moderno" — produção pesada, tom processado, frase agressiva. Ataque firme, sem hesitação.',
        tip: 'Esse lick funciona em Em e também em E maior (mesma pentatônica menor pode ser usada sobre acordes maiores no blues). Experimente sobre uma backing track de E7.',
      },
      {
        id: 'driving-towards', song: 'Driving Towards the Daylight', album: 'Driving Towards the Daylight (2012)',
        key: 'Dó# menor (C#m) — Power blues', shape: 'Caixa 1 (C#m pent) · 9ª–12ª casa', tempo: '104 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 9-12-9-7------|',
          'B|------- 9b11r9--------- 9-7-------------- 9~~~--|',
          'G|--- 11---------- 11-9------- 11-----------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release', 'Frase pentatônica 9ª pos.', 'Vibrato sustentado final', 'Pegada power-rock'],
        howTo: 'C#m pentatônica na 9ª casa. Estrutura "AABA" mini: bend 9b11r9, frase 11-9-11, salto 9-12-9-7, vibrato longo. Toda nota tem ATAQUE marcado.',
        feeling: 'Driving Towards the Daylight é Bonamassa em modo arena-rock. Pegada quase metal mas com vocabulário blues. Toque alto, com fuzz/overdrive saturado.',
        tip: 'Use a ponte (bridge pickup) da guitarra. Tom mais cortante. Esse lick não funciona com pickup neck — fica abafado demais.',
      },
    ],
  },
  {
    id: 'srv',
    artist: 'Stevie Ray Vaughan',
    initial: 'SRV',
    color: '#818cf8',
    bgFrom: '#312e81',
    bgTo: '#1e1b4b',
    era: '1954–1990',
    style: 'Texas Blues · Blues elétrico',
    bio: 'Texas Blues levado à máxima potência. SRV tocava com cordas grossas (.013!) e ataque de palheta brutal. Discípulo confesso de Albert King e Hendrix.',
    licks: [
      {
        id: 'pride-and-joy', song: 'Pride and Joy', album: 'Texas Flood (1983)',
        key: 'Mi blues (E) — shuffle', shape: 'Caixa 1 (Em pent) · 12ª casa · cordas B+G+D', tempo: '120 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 12b14--- 12-10-(10)~~-----------------------|',
          'G|---------------------------- 12-11-9------------|',
          'D|---------------------------------------- 12-10-9|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend tom inteiro', 'Vibrato pesado de pulso', 'Descida cromática', 'Ataque seco'],
        howTo: 'Bend 12b14 é VIOLENTO. Palheta firme, quase raspando. O ~~ depois da 10 é vibrato de pulso (mexa o pulso, não só o dedo). Descida 12-11-9 / 12-10-9 com alternate picking.',
        feeling: 'SRV ataca como se a guitarra fosse devolver. Você precisa SENTIR o ataque da palheta na corda. Não é tocado — é esmurrado.',
        tip: 'Grave-se e compare com a versão original. Se seu ataque soar soft, está poupando. Aumente a força até a corda quase distorcer naturalmente.',
      },
      {
        id: 'texas-flood', song: 'Texas Flood', album: 'Texas Flood (1983)',
        key: 'Sol menor (Gm) — blues lento', shape: 'Caixa 1 (Gm pent) · 3ª–8ª casa · alterna agudo/grave', tempo: '56 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|------------------------------------------------|',
          'B|--------------- 11b13r11--- 11-8------- 8-(8)~~~|',
          'G|--- 8b10r8-10------------------------ 10--------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend lento + release lento', 'Vibrato controlado', 'Frase de blues lenta', 'Espaço entre notas'],
        howTo: 'Texas Flood é o lado LENTO de SRV. Bend 8b10r8 demora 2 tempos pra subir, 1 pra voltar — paciência. Sobe 10 na G, depois 11b13r11 na B. Desce 11-8, sobe 10, descansa em 8 com vibrato.',
        feeling: 'Blues lento em 12 compassos. SRV transforma o blues em ópera. O lick precisa "chorar" — toque alto e com guitarra limpa.',
        tip: 'Timing dos bends é mais importante que a técnica. SEMPRE 2 tempos pra subir, 1 pra voltar. Pratique com metrônomo marcando os tempos do bend, não as notas.',
      },
      {
        id: 'scuttle-buttin', song: "Scuttle Buttin'", album: "Couldn't Stand the Weather (1984)",
        key: 'Mi (E) — pentatônica rápida', shape: 'Caixa aberta (Em pent) · 0–4ª casa', tempo: '140 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------------------------------------ 5b6r5-3----|',
          'G|--- 4---4h5-4-2--- 0-2-4-2-0--- 2-4--------- 4-2|',
          'D|------------------------------------------------|',
          'A|--- 2h4--------- 2-0--------------- 4-2---------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Hammer 2→4 low E', 'Alternate picking em colcheias', 'Pull-off rápido', 'Bend de ½ tom'],
        howTo: 'Lick veloz. Mão direita 100% relaxada — alternate picking constante. O h5-4-2 na G é a "voltinha". Termina com pull-off 4-2 e bend ½ tom na B. Tudo em colcheias firmes.',
        feeling: "Scuttle Buttin' é SRV mostrando velocidade SEM perder o groove de Texas. Cada nota é definida — não é correr borrado, é correr articulado.",
        tip: 'Pratique a 60 BPM. Se você tocar mais rápido e perder articulação, está perdido. SRV tocava em ~140 BPM mas com cada nota cristalina.',
      },
      {
        id: 'cold-shot', song: 'Cold Shot', album: "Couldn't Stand the Weather (1984)",
        key: 'Sol menor (Gm) — Funk blues', shape: 'Caixa 1 (Gm pent) · 3ª casa', tempo: '108 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 6-8-6----- 8-6------ 6b8r6----- 6-3---------|',
          'G|----------- 7---------- 7---------- 5-----------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Frase funk com staccato', 'Bend de tom 6b8', 'Repetição rítmica', 'Pegada articulada'],
        howTo: 'Cold Shot tem groove de R&B/funk — não de shuffle. Frase repetitiva (6-8-6, 8-6) com palhetada firme. Bend 6b8r6 no meio. Termina com 6-3 na B + 5 na G.',
        feeling: 'Cold Shot é SRV no modo Hendrix moderno — funk-rock. Você precisa "sentar" no groove. Não corra, não atrase — encaixe nos contratempos.',
        tip: 'Esse lick funciona em loop sobre qualquer backing track funk em Gm. Pratique tocando 8 compassos seguidos sem mudar nada — só pra calibrar o swing.',
      },
      {
        id: 'crossfire', song: 'Crossfire', album: 'In Step (1989)',
        key: 'Sol (G) — Hard blues', shape: 'Caixa 1 (Gm pent) · 3ª casa · pull-off G/B', tempo: '102 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------- 8b10r8------- 8-5---- 5b7r5-3-----------|',
          'G|--- 7p5------------ 7---- 5----------- 7--------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Pull-off 7→5', 'Bend tom inteiro 8b10', 'Frase descendente pentatônica', 'Articulação seca'],
        howTo: 'Crossfire é blues moderno (último álbum do SRV em vida). Pull-off 7→5 inicial — palheta na 7 só. Bend 8b10r8 com release controlado. Descida 8-5-5b7r5-3 em colcheia firme.',
        feeling: 'Crossfire mostra o SRV maduro — tinha acabado de sair da reabilitação. Pegada mais controlada mas ainda agressiva. Toque com tom limpo + drive natural.',
        tip: 'In Step (1989) é o último disco do SRV — morreu em helicóptero no ano seguinte. Estude o disco inteiro como aula sobre como blues precisa ser tocado.',
      },
      {
        id: 'lenny', song: 'Lenny', album: 'Texas Flood (1983)',
        key: 'Mi maior (E) — Balada jazz blues', shape: 'Caixa 1 (E maj pent) · 12ª casa · clean', tempo: '52 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------ 12-14b15r14~~~------- 12-(12)~~~---------|',
          'B|--- 12--------------------- 12------------------|',
          'G|---------------------- 11---------- 11----------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release com vibrato', 'Frase melódica lenta', 'Tom limpo (clean)', 'Sustain máximo'],
        howTo: 'Lenny é a balada lírica do SRV — pra sua esposa. Tom CLEAN absoluto (sem drive!). Frase 12-14b15r14 com vibrato no release. Cada nota dura compassos inteiros.',
        feeling: 'Lenny mostra que SRV não era só agressão — sabia ser sutil. Pense no Wes Montgomery ou Kenny Burrell. Palheta com unha, nem pensar em ataque firme.',
        tip: 'Use a Strato em pickup neck (sound mais doce). Reverb generoso. Pratique com olhos fechados — ajuda a manter a delicadeza.',
      },
    ],
  },
  {
    id: 'bbking',
    artist: 'B.B. King',
    initial: 'BB',
    color: '#c084fc',
    bgFrom: '#581c87',
    bgTo: '#3b0764',
    era: '1925–2015',
    style: 'Blues clássico · Soul Blues',
    bio: 'O Rei do Blues. Menos notas, mais emoção. B.B. nunca tocou um acorde no solo — só notas únicas, cada uma com vibrato cantado.',
    licks: [
      {
        id: 'thrill-is-gone', song: 'The Thrill is Gone', album: 'Completely Well (1969)',
        key: 'Si menor (Bm) — B.B. Box', shape: 'Caixa B.B. King (Bm pent) · 12ª–15ª casa · cordas e/B', tempo: '80 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 14b16r14~~~------- 12-(12)~~~---------------|',
          'G|------------------------------- 13-12-(12)~~----|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release', 'Vibrato borboleta lateral', 'Sustain máximo', 'Espaço enorme'],
        howTo: '14 na B, bend pra 16, segure e libere pra 14. AGORA — vibrato LATERAL (não vertical). Bata o dedo levemente pros lados como uma borboleta. Cada nota soa pelo menos 1 segundo.',
        feeling: 'B.B. tocava como quem chora. Cada nota é palavra. Não há frases rápidas — há LACUNAS. Se você pudesse cantar essa nota, como soaria? Toque assim.',
        tip: 'Toque com cronômetro. Cada nota deve durar 1,5 segundos no mínimo. Pratique tocar UMA nota por minuto inteiro, trabalhando só o vibrato.',
      },
      {
        id: 'sweet-little-angel', song: 'Sweet Little Angel', album: "Singin' the Blues (1956)",
        key: 'Si bemol (Bb) — blues clássico', shape: 'Caixa 1 (Bb pent) · 6ª casa · cordas B+G', tempo: '70 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 11~~--- 11-13b15r13~~--------- 11-(11)~~----|',
          'G|--------------------------- 12------------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Call and response', 'Bend & release com vibrato', 'Frase aberta', 'Slide micro'],
        howTo: 'B.B. cantava uma frase, a guitarra "respondia" — esta é a resposta. Primeira nota com vibrato curto, depois 11-13 bend pra 15, libere com vibrato. Termina 12-11 com mais vibrato.',
        feeling: 'Sweet Little Angel é blues clássico de 12 compassos. O fraseado preenche ESPAÇOS deixados pela voz. Pense em conversa entre guitarra e voz.',
        tip: 'Pratique cantando uma frase E DEPOIS tocando a resposta. Ensina a ouvir o silêncio — essência do estilo B.B.',
      },
      {
        id: 'three-oclock', song: "Three O'Clock Blues", album: "Singin' the Blues (1956)",
        key: 'Dó (C) — blues clássico', shape: 'Caixa 1 (Cm pent) · 8ª casa', tempo: '64 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 8b10r8-(8)~~--- 8-5---- 5-(5)~~-------------|',
          'G|----------------------------- 7-5--- 5b7r5~~----|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release sustentado', 'Vibrato em cada nota', 'Frase descendente lenta', 'Bend tom inteiro final'],
        howTo: 'Bend 8b10r8 lento — tempo de cantar "ahhh". Sustente o 8 com vibrato. Desce 8-5 e descansa em 5. Sobe 7-5 na G, bend 5b7r5 final sustentado. Toda nota canta.',
        feeling: 'Three O\'Clock Blues foi o primeiro #1 do B.B. (1951). Sem inventividade — só feeling. Toque como se tivesse acabado de acordar de uma noite mal dormida.',
        tip: 'Lick perfeito pra praticar vibrato. Pegue UMA nota (8 na B) e fique 5 minutos fazendo só vibrato lateral. Quando puder parar e tocar pra qualquer um, está pronto.',
      },
      {
        id: 'every-day', song: 'Every Day I Have the Blues', album: 'Live at the Regal (1965)',
        key: 'Lá (A) — blues vivo', shape: 'Caixa 1 (Am pent) · 5ª casa · pull-off G', tempo: '124 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 10b12r10----- 10-8---- 8b10r8-------- 8~~---|',
          'G|----------- 9-7----------------- 7---5----------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend tom inteiro 10b12', 'Frase ascendente vivo', 'Pull-off 9→7', 'Vibrato curto final'],
        howTo: 'Lá no Live at the Regal — disco mais famoso do B.B. (1965). Mais energia que estúdio. Bend 10b12r10 firme, pull-off 9-7 na G. Termina com vibrato em 8 (sem ser muito longo).',
        feeling: 'Ao vivo, B.B. era mais agressivo que em estúdio. A plateia respondia, e ele "puxava" pra cima. Toque com mais energia que o normal — sem perder o feel blues.',
        tip: 'Live at the Regal é considerado o melhor disco blues de todos os tempos. Estude o disco INTEIRO — não só esse lick. A interação B.B. + banda + plateia é magia.',
      },
      {
        id: 'why-i-sing', song: 'Why I Sing the Blues', album: 'Completely Well (1969)',
        key: 'Mi (E) — Blues funk', shape: 'Caixa 1 (Em pent) · 12ª casa', tempo: '110 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------- 8-12-12b14--- 12-10---------- 12-(12)~~-|',
          'G|--- 9p7------------------------- 12-10----------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Pull-off 9→7', 'Bend tom 12b14', 'Frase ascendente + descendente', 'Vibrato final'],
        howTo: 'Pull-off inicial 9→7 na G — palheta na 9. Sobe pela B 8-12-12b14 (bend tom inteiro). Desce 12-10, depois 12-10 na G. Termina em 12 na B com vibrato.',
        feeling: 'Why I Sing the Blues tem groove funk — banda dele tinha metais, organ, baixo elétrico. B.B. moderniza o blues mantendo a alma. Toque com mais articulação que nas baladas.',
        tip: 'A música tem 8 minutos no disco — B.B. constrói o solo gradualmente. Esse lick aparece tardio, quando o solo já está aquecido. Pratique como "clímax", não como "início".',
      },
      {
        id: 'lucille', song: 'Lucille', album: 'Lucille (1968)',
        key: 'Si bemol (Bb) — Blues médio', shape: 'Caixa B.B. King (Bb pent) · 11ª casa', tempo: '88 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 11b13r11~~--------- 11-8------- 11~~~-------|',
          'G|------------------ 12-10----- 10-8--------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release com vibrato', 'Frase descendente lírica', 'Espaçamento', 'Sustain'],
        howTo: 'Lucille era o nome da guitarra do B.B. (Gibson ES-345 customizada). A música é uma carta de amor pra ela. Toque o lick com paixão — bend 11b13r11 com vibrato no release. Frase desce na G.',
        feeling: 'B.B. literalmente chamava a guitarra de "Lucille" — ela tinha personalidade pra ele. Tocar esse lick é "falar com Lucille". Toque como se a guitarra fosse a parceira da vida.',
        tip: 'Lucille (a guitarra) tinha cordas SEM trastes na primeira casa (pra evitar feedback). Não precisa replicar isso — mas saiba que o som da gravação tem essa peculiaridade.',
      },
    ],
  },
  {
    id: 'buddyguy',
    artist: 'Buddy Guy',
    initial: 'BG',
    color: '#38bdf8',
    bgFrom: '#0c4a6e',
    bgTo: '#082f49',
    era: '1936 – presente',
    style: 'Chicago Blues · Blues elétrico agressivo',
    bio: 'O blues bruto e selvagem. Buddy Guy quase inventou o blues "elétrico-distorcido" — Hendrix, Clapton, SRV e Vaughan o chamavam de mestre direto. Tom estridente, ataques explosivos, gritos vocais durante o solo. Ainda toca aos 89 anos.',
    licks: [
      {
        id: 'damn-right', song: "Damn Right, I've Got the Blues", album: "Damn Right, I've Got the Blues (1991)",
        key: 'Mi (E) — Blues moderno', shape: 'Caixa 5 (Em pent) · 12ª–17ª casa', tempo: '94 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--- 12-15-12-15------------------- 15b17r15~~---|',
          'B|------------- 15-12-15---- 12-15----------------|',
          'G|------------------------------------------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Frase pentatônica veloz', 'Bend tom inteiro 15b17', 'Vibrato amplo final', 'Articulação selvagem'],
        howTo: 'Lick veloz na 12ª posição da pentatônica. Alterne E aguda e B com economia de palheta. Termina com bend 15b17 brutal + vibrato. Mão direita firme — quase arranhando as cordas.',
        feeling: 'Damn Right marca o retorno de Buddy ao topo (1991). Selvagem, estridente, sem polidez. Você precisa SENTIR a urgência — Buddy tinha 55 anos provando que ainda era o rei.',
        tip: 'Buddy usa cordas finas (.009) — oposto do SRV. Permite os bends gigantes que ele faz. Se sua guitarra tem cordas .011+, esse lick fica difícil — considere afinar 1 tom abaixo.',
      },
      {
        id: 'stone-crazy', song: 'Stone Crazy', album: 'Stone Crazy (1981)',
        key: 'Lá menor (Am) — Blues longo', shape: 'Caixa 1 (Am pent) · 5ª casa', tempo: '76 BPM', timeSig: '12/8',
        rhythm: '   1   .   .   +   .   .   2   .   .   +   .   .',
        tab: [
          'e|------------------------------------------------|',
          'B|----- 8b10r8------------- 8-5-3-------- 5~~~----|',
          'G|------------- 7p5-------------------- 7---------|',
          'D|--- 5------------------------- 5----------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release', 'Pull-off 7→5', 'Frase descendente longa', 'Vibrato selvagem'],
        howTo: 'Stone Crazy é o blues lento mais longo do Buddy Guy (8 min). Lick é um "trecho" do solo que dura compassos. Bend 8b10r8 com tempo. Pull-off 7-5 na G — palheta só na 7. Descida 8-5-3 na B.',
        feeling: 'Buddy Guy "fala" com a guitarra entre cada frase — literalmente. Ouça a gravação: ele grita "yeah!" no meio do lick. Tente capturar essa urgência sem virar grosseiro.',
        tip: 'Stone Crazy ganhou Grammy em 1982. O solo tem ESPAÇO — Buddy deixa 5-6 segundos entre frases. Pratique parar de tocar e contar até 5 antes do próximo lick.',
      },
      {
        id: 'first-time', song: 'First Time I Met the Blues', album: 'First Time... (single, 1960)',
        key: 'Sol (G) — Blues clássico Chicago', shape: 'Caixa 1 (Gm pent) · 3ª casa · Chicago style', tempo: '88 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 8b10----- 8-6---- 6b8r6-3-------- 6-(6)~~---|',
          'G|-------- 7p5------------------- 7-5-------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend tom 8b10', 'Pull-off 7→5', 'Bend & release 6b8r6', 'Frase descendente clássica'],
        howTo: 'Esse é o BUDDY GUY clássico Chess Records, 1960 — antes de virar lendário. Lick em sol pentatônica menor. Bend 8b10 forte, pull-off 7-5, bend e release 6b8r6 melódico.',
        feeling: 'Em 1960, Buddy ainda era estudante de Muddy Waters. Toque com humildade — esse não é o Buddy explosivo de 1991. É o jovem Buddy aprendendo o ofício.',
        tip: 'Gravado na Chess Records (Chicago). Estude o som "Chess" — guitarra mais escura, sem reverb, mais "garagem". Cordas com ataque seco.',
      },
      {
        id: 'skin-deep', song: 'Skin Deep', album: 'Skin Deep (2008)',
        key: 'Sol menor (Gm) — Blues político', shape: 'Caixa B.B. King (Gm pent) · 8ª–11ª casa', tempo: '70 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 11b13r11~~~------ 11-8-------- 11~~~--------|',
          'G|------------------------- 10-8-10---------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend & release com vibrato longo', 'Frase descendente', 'Sustain enorme', 'Pegada emocional'],
        howTo: 'Skin Deep tem letra sobre racismo — Buddy aos 72 anos. Lick é solene. Bend 11b13r11 lento, vibrato longo no 11. Descida 11-8 na B, sobe 10-8-10 na G, termina vibrato.',
        feeling: 'Buddy maduro toca diferente do Buddy jovem. Aos 72, ele não precisa provar nada — toca com peso de história. Toque CONTIDO, sem afobação.',
        tip: 'Esse álbum ganhou Grammy. Buddy convidou Eric Clapton e Susan Tedeschi pra duets. Compare como cada um responde aos licks dele — aula viva sobre interação musical.',
      },
      {
        id: 'hoodoo-man', song: 'Hoodoo Man Blues', album: 'Hoodoo Man Blues (1965, Junior Wells)',
        key: 'Mi (E) — Chicago blues', shape: 'Caixa 1 (Em pent) · 5ª–8ª casa · pickup ponte', tempo: '102 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 5-8-5-3-------|',
          'B|--- 5-8-5---- 8b10r8------ 5-3----------- 5~~---|',
          'G|----------- 7-------- 7-5-----------------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Frase pentatônica clássica', 'Bend & release 8b10r8', 'Pull-off 7→5', 'Articulação Chicago'],
        howTo: 'Buddy tocou esse disco com Junior Wells (gaita) em 1965 — clássico do Chicago blues. Lick pentatônica menor de Mi, ascendente e descendente. Bend 8b10r8 no meio é o "soco".',
        feeling: 'Hoodoo Man Blues tem tom mais agudo que o normal — Buddy usava captador da ponte. Pegada Chicago: seca, sem reverb, articulada. Cada nota separada.',
        tip: 'Estude o disco INTEIRO — Buddy + Junior Wells é uma das melhores parcerias do blues. A guitarra e a gaita conversam — você pode aprender sobre fraseado ouvindo só a gaita.',
      },
      {
        id: 'mary-had', song: 'Mary Had a Little Lamb', album: "Damn Right, I've Got the Blues (1991)",
        key: 'Lá maior (A) — Blues vintage', shape: 'Caixa 1 (Am pent) · 10ª–12ª casa', tempo: '116 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|--- 10-12-10---- 12-10---- 10b12r10---- 10-7----|',
          'G|------------ 11------------------- 11-9---------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Cover melódico', 'Bend & release', 'Frase ascendente + descendente', 'Vintage articulação'],
        howTo: 'Cover da clássica "Mary Had a Little Lamb" do Buddy Guy — virou padrão tocado também por SRV. Frase melódica fundada na pentatônica de Lá. Bend 10b12r10 controlado. Pull-off 9-11 na G.',
        feeling: 'Versão de Buddy de uma melodia infantil tem ironia — letra inocente sobre uma "Mary" que pode ter outras interpretações. Toque com sorriso na cara.',
        tip: 'SRV gravou cover dessa cover (versão de Buddy Guy) em "Texas Flood". Compare as duas versões — Buddy é mais selvagem, SRV é mais Texas. Mesma melodia, dois universos.',
      },
    ],
  },
  {
    id: 'clapton',
    artist: 'Eric Clapton',
    initial: 'EC',
    color: '#e879f9',
    bgFrom: '#6b21a8',
    bgTo: '#3b0764',
    era: '1945 – presente',
    style: 'Blues rock · Pop sofisticado · Blues acústico',
    bio: 'Slowhand. Eric Clapton é a "ponte" entre o blues americano (Muddy Waters, B.B. King) e o rock britânico (Cream, Derek and the Dominos). Vocabulário enciclopédico, vibrato cantado, escolha cirúrgica de notas. "God" graffitied em Londres nos 60.',
    licks: [
      {
        id: 'layla', song: 'Layla', album: 'Layla and Other Assorted Love Songs (1970)',
        key: 'Ré menor (Dm) — Riff icônico', shape: 'Caixa 1 (Am pent sobre Dm) · 5ª–7ª casa', tempo: '116 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 5-7-5-3-------|',
          'B|--- 5-7-5----- 5-7-5-3------ 5-7----------------|',
          'G|----------- 7---------- 7-5----------- 7--------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Riff pentatônico icônico', 'Sequência fixa', 'Pull-off', 'Frase em uníssono com Allman'],
        howTo: 'O riff mais famoso da história do rock. Toque os 7-5 nas cordas G e B em uníssono — Eric Clapton e Duane Allman tocavam JUNTOS no disco. A frase ascende e desce com 8 notas pentatônicas.',
        feeling: 'Layla é dedicada a Pattie Boyd (esposa do George Harrison na época, com quem Clapton estava obcecado). O riff tem URGÊNCIA — quase desespero. Toque rápido mas articulado.',
        tip: 'Esse riff é em Ré menor mas tocado na posição 5 da Lá pentatônica menor (Am pent funciona sobre Dm em blues). Conhecer essa "substituição" abre o mundo do improviso blues.',
      },
      {
        id: 'tears-in-heaven', song: 'Tears in Heaven', album: 'Unplugged (1992)',
        key: 'Lá maior (A) — Balada acústica', shape: 'Posição aberta (CAGED A) · 0ª–5ª casa · fingerstyle', tempo: '76 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|--- 5-3-2---- 5-3-2-0------- 5-3-2--------------|',
          'B|------------ 2-0---- 2---- 3---------- 3-2------|',
          'G|------------------------------------- 2---------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Fingerstyle acústico', 'Frase melódica clean', 'Articulação delicada', 'Espaçamento'],
        howTo: 'Tears in Heaven é fingerstyle no violão. Use polegar pra cordas graves, indicador-médio-anelar pras agudas. Frase desce melodicamente. Cada nota é uma palavra.',
        feeling: 'Tears in Heaven foi escrita após a morte do filho de 4 anos de Clapton (Conor). É a música mais íntima do repertório dele. Não toque tristemente — toque com aceitação.',
        tip: 'Esse álbum (MTV Unplugged 1992) ganhou 6 Grammys. Estude as transições entre acordes — Clapton usa fingerpicking pra tornar transições suaves. Toque com calma, sem rush.',
      },
      {
        id: 'crossroads', song: 'Crossroads', album: 'Wheels of Fire (1968) — Cream',
        key: 'Lá maior (A) — Blues rock veloz', shape: 'Caixa 1 (Am pent) · 5ª casa', tempo: '124 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|--------------------------------- 5-8-----------|',
          'B|------- 5b7r5-3----- 5-3-3b5r3------------ 5b7~~|',
          'G|--- 7p5--------------------------- 7------------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Pull-off 7→5', 'Bend & release', 'Frase pentatônica acelerada', 'Vibrato amplo final'],
        howTo: 'Cover do Robert Johnson tocado pelo Cream — Clapton solo dele aqui é considerado um dos melhores da história. Pull-off 7→5 inicial, depois bend & release variações. Termina com 5b7 + vibrato.',
        feeling: 'No Cream, Clapton tinha a banda mais virtuosa do mundo (Bruce no baixo, Ginger Baker bateria). Solos longos, improvisados. Toque com confiança — sem espaço pra dúvida.',
        tip: 'O solo de "Crossroads" tem 24 compassos improvisados. Estude UM compasso de cada vez. Foi gravado ao vivo no Winterland (San Francisco, 1968) — a energia da plateia é parte do som.',
      },
      {
        id: 'cocaine', song: 'Cocaine', album: 'Slowhand (1977)',
        key: 'Mi (E) — Riff rock blues', shape: 'Riff em cordas A/D · 7ª–9ª casa · power chord melódico', tempo: '108 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------------------------------------------------|',
          'G|------------------------------------------------|',
          'D|------- 9-7---- 7---------- 9-7--- 7------------|',
          'A|--- 9-7----- 7----- 9-7-9--------- 9-7----------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Riff em corda grave', 'Power-chord melódico', 'Pegada rítmica firme', 'Distorção controlada'],
        howTo: 'Cover do J.J. Cale. Riff inteiro nas cordas A e D, casas 7-9. Use indicador e anelar. Pegada FIRME — quase metal mas com swing. Sem nota muda — cada uma tem ataque definido.',
        feeling: 'Cocaine é Clapton no modo arena-rock dos anos 70. Pegada de Rolling Stones, atitude de bad boy. Toque alto, com distorção saturada mas controlada. Sem barriga, sem hesitação.',
        tip: 'O riff parece simples mas o segredo está na MICRO-PAUSA antes da nota mais aguda. Conte 1-e-+-a e a nota mais alta cai entre o "+" e o "a" — não exatamente em cima.',
      },
      {
        id: 'wonderful-tonight', song: 'Wonderful Tonight', album: 'Slowhand (1977)',
        key: 'Sol (G) — Balada lírica', shape: 'Posição aberta (G maj pent) · 0ª–5ª casa', tempo: '74 BPM', timeSig: '4/4',
        rhythm: '   1   .   +   .   2   .   +   .   3   .   +   .   4',
        tab: [
          'e|--- 3----------- 3-(3)~~------------------------|',
          'B|------- 3---5b6r5----- 3----- 3-1----- 1--------|',
          'G|------------------------------------- 2---------|',
          'D|------------------------------------------------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Bend de ½ tom 5b6r5', 'Vibrato sustentado', 'Frase melódica vocal', 'Tom clean'],
        howTo: 'Wonderful Tonight é a balada perfeita. Tom CLEAN total — sem drive. Lick é simples: 3 na E aguda com vibrato, depois 3-5 na B com bend de meio tom e release. Termina descendente 3-1 + 2 na G.',
        feeling: 'Letra sobre uma noite com Pattie Boyd — momento simples virou hino romântico. Toque com TERNURA, sem virtuosismo. Cada nota precisa "olhar nos olhos do ouvinte".',
        tip: 'Esse lick aparece como "vinheta" entre versos — não como solo principal. Pratique como pontuação musical, não como performance. Stratocaster com pickup neck, reverb suave.',
      },
      {
        id: 'sunshine-of-love', song: 'Sunshine of Your Love', album: 'Disraeli Gears (1967) — Cream',
        key: 'Ré (D) — Riff hard rock', shape: 'Riff em cordas D/G · 0ª–7ª casa · pentatônica menor sobre maior', tempo: '116 BPM', timeSig: '4/4',
        rhythm: '   1   e   +   a   2   e   +   a   3   e   +   a   4',
        tab: [
          'e|------------------------------------------------|',
          'B|------------------------------------------------|',
          'G|--- 7---5-7-------------- 7---5-7----- 4-2------|',
          'D|------------- 5-3-5---------------- 0-----------|',
          'A|------------------------------------------------|',
          'E|------------------------------------------------|',
        ],
        techniques: ['Riff icônico', 'Frase em cordas D-G', 'Pegada rock pesada', 'Movimento melódico estendido'],
        howTo: 'O riff mais famoso do Cream. Use cordas D e G — alterna entre elas para criar movimento. Anelar nas casas 7, indicador nas casas 3-5. Pegada firme, com palheta down-down-up-down.',
        feeling: 'Sunshine of Your Love é Cream no auge. Jack Bruce (baixo) escreveu o riff, Clapton apropriou pra guitarra. Energia psicodélica + blues + rock. Toque alto, com fuzz pesado.',
        tip: 'O riff é em Ré maior pentatônica MENOR — característica blues-rock dos 60. Estude essa fórmula: pentatônica menor sobre acorde maior cria a "cor" psicodélica do Cream.',
      },
    ],
  },
]

// ─── Portrait component ──────────────────────────────────────────────────────

function ArtistPortrait({ data, large = false }) {
  const [imgError, setImgError] = useState(false)
  const size = large ? 220 : 56
  const borderRadius = large ? 18 : '50%'
  const images = ARTIST_IMAGES[data.id] || []
  const image = images[0]

  if (imgError || !image) {
    return (
      <div style={{
        width: size, height: size, borderRadius,
        background: `linear-gradient(135deg, ${data.bgFrom}, ${data.bgTo})`,
        border: `1px solid ${data.color}30`,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
        boxShadow: large ? '0 10px 30px rgba(0,0,0,0.4)' : 'none',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 1.3) * 40)
            return <rect key={i} x={6 + i * 11} y={50 - h / 2} width={5} height={h} rx={2} fill={data.color} />
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            fontSize: large ? 64 : 18, fontWeight: 900, color: data.color,
            letterSpacing: '-0.04em', textShadow: `0 0 20px ${data.color}40`,
          }}>{data.initial}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      border: `1px solid ${data.color}40`,
      boxShadow: large ? `0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px ${data.color}25` : 'none',
    }}>
      <img
        src={image} alt={data.artist}
        onError={() => setImgError(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: 'center 25%', display: 'block',
          filter: large ? 'saturate(1.05) contrast(1.05)' : 'saturate(1.05)',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: large
          ? `linear-gradient(180deg, transparent 40%, ${data.bgTo}cc 100%)`
          : `linear-gradient(135deg, transparent 50%, ${data.color}30 100%)`,
        pointerEvents: 'none',
      }} />
      {large && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '14px 14px 12px', color: '#fff',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: data.color,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            textShadow: '0 1px 4px rgba(0,0,0,0.7)', marginBottom: 2,
          }}>{data.initial}</div>
          <div style={{
            fontSize: 14, fontWeight: 800, textShadow: '0 1px 6px rgba(0,0,0,0.8)', lineHeight: 1.1,
          }}>{data.artist}</div>
        </div>
      )}
    </div>
  )
}

// ─── Multi-image artist showcase ─────────────────────────────────────────────

function ArtistShowcase({ data }) {
  const images = ARTIST_IMAGES[data.id] || []
  if (images.length === 0) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 10, marginTop: 16,
    }}>
      {images.slice(0, 3).map((src, i) => (
        <PhotoTile key={i} src={src} idx={i} color={data.color} />
      ))}
    </div>
  )
}

function PhotoTile({ src, idx, color }) {
  const [err, setErr] = useState(false)
  if (err) return null
  return (
    <div style={{
      position: 'relative', aspectRatio: '4 / 5', borderRadius: 12,
      overflow: 'hidden', border: `1px solid ${color}25`,
      boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
    }}>
      <img src={src} alt="" onError={() => setErr(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: 'center top', filter: 'saturate(1.03)',
        }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 20, height: 20, borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
        border: `1px solid ${color}50`, color,
        fontSize: 10, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{idx + 1}</div>
    </div>
  )
}

// ─── Professional TAB rendering ──────────────────────────────────────────────



// ─── Shape Diagram (visual pentatonic boxes) ────────────────────────────────

// Each box is a 4-fret window pattern. Dots are [string (1=high e), fretOffset, isRoot].
// Patterns approximate the canonical CAGED pentatonic minor positions.

const SHAPE_PATTERNS = {
  box1: {
    label: 'Caixa 1',
    span: 4,
    dots: [
      [1, 0, true],  [1, 3, false],
      [2, 0, false], [2, 3, false],
      [3, 0, false], [3, 2, false],
      [4, 0, false], [4, 2, true],
      [5, 0, false], [5, 2, false],
      [6, 0, true],  [6, 3, false],
    ],
  },
  box2: {
    label: 'Caixa 2',
    span: 4,
    dots: [
      [1, 0, false], [1, 3, false],
      [2, 1, false], [2, 3, true],
      [3, 0, false], [3, 2, false],
      [4, 0, true],  [4, 2, false],
      [5, 0, false], [5, 3, false],
      [6, 0, false], [6, 3, false],
    ],
  },
  box3: {
    label: 'Caixa 3',
    span: 4,
    dots: [
      [1, 0, false], [1, 3, false],
      [2, 0, true],  [2, 3, false],
      [3, 0, false], [3, 2, false],
      [4, 0, false], [4, 2, false],
      [5, 1, false], [5, 3, true],
      [6, 0, false], [6, 3, false],
    ],
  },
  box4: {
    label: 'Caixa 4',
    span: 4,
    dots: [
      [1, 0, false], [1, 3, true],
      [2, 1, false], [2, 3, false],
      [3, 0, true],  [3, 2, false],
      [4, 0, false], [4, 2, false],
      [5, 0, false], [5, 2, false],
      [6, 0, false], [6, 3, true],
    ],
  },
  box5: {
    label: 'Caixa 5',
    span: 4,
    dots: [
      [1, 0, true],  [1, 2, false],
      [2, 1, false], [2, 3, false],
      [3, 0, false], [3, 2, false],
      [4, 0, true],  [4, 2, false],
      [5, 0, false], [5, 2, false],
      [6, 0, true],  [6, 2, false],
    ],
  },
  bbking: {
    label: 'Caixa B.B. King',
    span: 4,
    dots: [
      [1, 0, true],  [1, 3, false],
      [2, 0, false], [2, 3, false],
      [3, 1, false],
    ],
  },
  open: {
    label: 'Posição Aberta',
    span: 4,
    dots: [
      [1, 0, true],  [1, 3, false],
      [2, 0, false], [2, 3, false],
      [3, 0, false], [3, 2, false],
      [4, 0, false], [4, 2, true],
      [5, 0, false], [5, 2, false],
      [6, 0, true],  [6, 3, false],
    ],
  },
}

// Infer the shape pattern + start fret from the existing text label
function parseShape(shapeStr) {
  if (!shapeStr) return null
  let key = null
  if (/B\.?B\.?/i.test(shapeStr) && /caixa/i.test(shapeStr)) key = 'bbking'
  else if (/caixa\s*1\b/i.test(shapeStr))                    key = 'box1'
  else if (/caixa\s*2\b/i.test(shapeStr))                    key = 'box2'
  else if (/caixa\s*3\b/i.test(shapeStr))                    key = 'box3'
  else if (/caixa\s*4\b/i.test(shapeStr))                    key = 'box4'
  else if (/caixa\s*5\b/i.test(shapeStr))                    key = 'box5'
  else if (/aberta/i.test(shapeStr))                         key = 'open'

  // Extract first fret number
  const m = shapeStr.match(/(\d+)\s*ª/)
  const startFret = m ? parseInt(m[1], 10) : 0

  // Short label: just "Caixa X" or first segment
  const segments = shapeStr.split('·').map(s => s.trim())
  const mainLabel = segments[0] || shapeStr

  return { key, startFret, mainLabel, fullLabel: shapeStr }
}

const FRET_MARKER_SINGLE = new Set([3, 5, 7, 9, 15, 17, 19, 21])
const FRET_MARKER_DOUBLE = new Set([12, 24])

function ShapeDiagram({ shape, color }) {
  const parsed = parseShape(shape)
  const pattern = parsed?.key ? SHAPE_PATTERNS[parsed.key] : null

  // Fallback: no recognizable pattern, show description
  if (!pattern) {
    return (
      <div style={{
        padding: '10px 12px',
        background: 'var(--ink-03)',
        border: `1px solid ${color}25`,
        borderRadius: 10,
        fontSize: 12, color: 'var(--text-muted)',
        lineHeight: 1.5,
      }}>
        {shape}
      </div>
    )
  }

  // SVG dimensions (vertical layout — strings vertical, frets horizontal)
  // s=6 (low E) leftmost, s=1 (high e) rightmost
  const STRINGS = 6
  const FRETS = pattern.span
  const STR_GAP = 18
  const FRET_GAP = 26
  const PAD_L = 38   // extra room for fret number label
  const PAD_T = 22
  const PAD_R = 28   // room for string labels
  const PAD_B = 22
  const W = PAD_L + (STRINGS - 1) * STR_GAP + PAD_R
  const H = PAD_T + FRETS * FRET_GAP + PAD_B
  const DOT_R = 7

  const colX = (s) => PAD_L + (STRINGS - s) * STR_GAP
  const rowY = (f) => PAD_T + f * FRET_GAP

  const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'] // low to high

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.28))',
      border: `1px solid ${color}30`,
      borderRadius: 12,
      padding: '12px 16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 18,
      flexWrap: 'wrap',
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
        {/* String labels (top, above the nut/first fret line) */}
        {Array.from({ length: STRINGS }, (_, i) => {
          const s = STRINGS - i // 6..1 from left to right
          return (
            <text key={`sl${s}`}
              x={colX(s)} y={PAD_T - 7}
              textAnchor="middle"
              fontSize="8" fontWeight="700"
              fill="var(--text-ultra)"
              opacity={0.7}
            >
              {STRING_NAMES[s - 1]}
            </text>
          )
        })}

        {/* Strings (vertical lines) */}
        {Array.from({ length: STRINGS }, (_, i) => {
          const s = i + 1
          return (
            <line key={`s${s}`}
              x1={colX(s)} y1={rowY(0)}
              x2={colX(s)} y2={rowY(FRETS)}
              stroke={`${color}80`} strokeWidth={0.9}
            />
          )
        })}

        {/* Fret position markers (single dots at 3,5,7,9; double at 12) */}
        {Array.from({ length: FRETS }, (_, f) => {
          const absoluteFret = parsed.startFret + f
          if (FRET_MARKER_DOUBLE.has(absoluteFret)) {
            const x1 = (colX(5) + colX(4)) / 2
            const x2 = (colX(3) + colX(2)) / 2
            return (
              <g key={`fm${f}`} opacity={0.18}>
                <circle cx={x1} cy={rowY(f + 0.5)} r={3} fill="white" />
                <circle cx={x2} cy={rowY(f + 0.5)} r={3} fill="white" />
              </g>
            )
          }
          if (FRET_MARKER_SINGLE.has(absoluteFret)) {
            const x = (colX(4) + colX(3)) / 2
            return (
              <circle key={`fm${f}`}
                cx={x} cy={rowY(f + 0.5)}
                r={3} fill="white" opacity={0.18}
              />
            )
          }
          return null
        })}

        {/* Frets (horizontal lines) — nut is bold if open */}
        {Array.from({ length: FRETS + 1 }, (_, f) => {
          const isNut = parsed.startFret === 0 && f === 0
          return (
            <line key={`f${f}`}
              x1={colX(STRINGS) - 0.5} y1={rowY(f)}
              x2={colX(1) + 0.5}       y2={rowY(f)}
              stroke={isNut ? '#e2e8f0' : `${color}80`}
              strokeWidth={isNut ? 3.5 : 0.9}
            />
          )
        })}

        {/* Fret position label (Xfr) on the LEFT of the first fret */}
        {parsed.startFret > 0 && (
          <g>
            <text
              x={colX(STRINGS) - 10} y={rowY(0.5) + 4}
              textAnchor="end"
              fontSize="11" fontWeight="800"
              fill={color}
              style={{ letterSpacing: '0.02em' }}
            >
              {parsed.startFret}fr
            </text>
          </g>
        )}

        {/* Absolute fret numbers along the right side */}
        {Array.from({ length: FRETS }, (_, f) => {
          const absoluteFret = parsed.startFret + f
          if (absoluteFret === 0) return null
          return (
            <text key={`fn${f}`}
              x={colX(1) + 9} y={rowY(f + 0.5) + 3}
              textAnchor="start"
              fontSize="8" fontWeight="600"
              fill="var(--text-ultra)"
              opacity={0.6}
            >
              {absoluteFret}
            </text>
          )
        })}

        {/* Dots (notes) */}
        {pattern.dots.map(([s, f, isRoot], i) => (
          <g key={i}>
            <circle
              cx={colX(s)}
              cy={rowY(f + 0.5)}
              r={DOT_R}
              fill={isRoot ? color : '#e2e8f0'}
              stroke={isRoot ? color : `${color}60`}
              strokeWidth={1}
            />
            {isRoot && (
              <text
                x={colX(s)}
                y={rowY(f + 0.5) + 3}
                textAnchor="middle"
                fontSize="8"
                fontWeight="800"
                fill="#0b1220"
              >R</text>
            )}
          </g>
        ))}
      </svg>

      <div style={{ minWidth: 0, maxWidth: 200 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 4,
        }}>
          Shape · Posição
        </div>
        <div style={{
          fontSize: 14, fontWeight: 800, color: 'var(--text-base)',
          lineHeight: 1.2, marginBottom: 4,
        }}>
          {pattern.label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {parsed.fullLabel.replace(/^[^·]+·\s*/, '').trim()}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 9, color: 'var(--text-ultra)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            Tônica
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0', border: `1px solid ${color}60` }} />
            Notas
          </span>
        </div>
      </div>
    </div>
  )
}

const LEGEND = [
  { sym: 'b',   desc: 'Bend (subir o tom)' },
  { sym: 'r',   desc: 'Release (voltar bend)' },
  { sym: 'h',   desc: 'Hammer-on' },
  { sym: 'p',   desc: 'Pull-off' },
  { sym: '/',   desc: 'Slide ascendente' },
  { sym: '\\',  desc: 'Slide descendente' },
  { sym: '~~',  desc: 'Vibrato' },
  { sym: '()',  desc: 'Nota fantasma' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function VocabularioLicks() {
  const [artistId, setArtistId] = useState(ARTISTS[0].id)
  const [lickId, setLickId] = useState(ARTISTS[0].licks[0].id)
  const { markLesson, isComplete } = useProgress()

  const artist = ARTISTS.find(a => a.id === artistId) ?? ARTISTS[0]
  const lick = artist.licks.find(l => l.id === lickId) ?? artist.licks[0]

  const selectArtist = (id) => {
    setArtistId(id)
    const a = ARTISTS.find(x => x.id === id)
    if (a) setLickId(a.licks[0].id)
  }

  const totalLicks = ARTISTS.reduce((acc, a) => acc + a.licks.length, 0)

  return (
    <div>
      <PageHeader
        chip="Desconstruindo Lendas"
        title="Vocabulário de Licks"
        description={`${totalLicks} licks autênticos de ${ARTISTS.length} lendas do blues e rock, organizados por música. Cada lick traz TAB profissional, técnicas, como tocar no estilo do artista e dica de treino direcionada.`}
      />

      <Section title="O que é um lick?">
        <TheoryBlock>
          <Step>
            <p>
              Um <b>lick</b> é uma frase melódica curta — geralmente 1 a 2 compassos — que funciona
              como uma "palavra" no vocabulário do improviso. Não é um solo inteiro: é uma <b>unidade</b>
              que você guarda na cabeça e usa quando o momento pede.
            </p>
          </Step>
          <Step>
            <p>
              Cada guitarrista lendário tem seus licks-assinatura, e cada música tem suas frases icônicas.
              Aqui você encontra <b>{totalLicks} licks autênticos</b> tirados de músicas específicas — desde
              "Little Wing" e "Crossroads" até "Blues Deluxe" e "The Thrill is Gone".
            </p>
          </Step>
          <Step>
            <p>
              <b>Como praticar</b>: decore um lick por semana. Toque-o em 5 tonalidades diferentes,
              em 3 velocidades, e em diferentes momentos do compasso. Quando virar reflexo, passe pro próximo.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* ── Artist tabs ─────────────────────────────────────────────────── */}
      <Section title="Escolha o mestre">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {ARTISTS.map(a => {
            const active = a.id === artistId
            return (
              <button
                key={a.id}
                onClick={() => selectArtist(a.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 14px 8px 8px',
                  borderRadius: 12, cursor: 'pointer',
                  background: active ? `${a.color}12` : 'var(--ink-03)',
                  border: `1px solid ${active ? a.color + '50' : 'var(--ink-08)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <ArtistPortrait data={a} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? a.color : 'var(--text-base)' }}>
                    {a.artist}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-ultra)', marginTop: 1 }}>
                    {a.licks.length} licks · {a.era}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Active artist card ──────────────────────────────────────── */}
        <div className="card" style={{ padding: 20, borderTop: `3px solid ${artist.color}`, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <ArtistPortrait data={artist} large />
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: artist.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                {artist.style}
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-base)', lineHeight: 1, margin: '0 0 8px 0' }}>
                {artist.artist}
              </h3>
              <div style={{ fontSize: 12, color: 'var(--text-ultra)', marginBottom: 12 }}>
                {artist.era}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {artist.bio}
              </p>
            </div>
          </div>

        </div>

        {/* ── Lick selector ─────────────────────────────────────────── */}
        <div style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
        }}>
          Licks de {artist.artist} ({artist.licks.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {artist.licks.map(l => {
            const active = l.id === lickId
            return (
              <button
                key={l.id}
                onClick={() => setLickId(l.id)}
                style={{
                  padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                  background: active ? `${artist.color}15` : 'var(--ink-03)',
                  border: `1px solid ${active ? artist.color + '55' : 'var(--ink-08)'}`,
                  transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  minWidth: 180,
                }}
              >
                <div style={{
                  fontSize: 9, fontWeight: 700,
                  color: active ? artist.color : 'var(--text-ultra)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: 2,
                }}>{l.album}</div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: active ? artist.color : 'var(--text-base)',
                }}>{l.song}</div>
              </button>
            )
          })}
        </div>

        {/* ── Lick details ───────────────────────────────────────────── */}
        <div className="card" style={{ padding: 20, borderTop: `3px solid ${artist.color}` }}>

          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: 'inline-block',
              fontSize: 9, fontWeight: 700, color: artist.color,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '3px 9px', borderRadius: 999,
              background: `${artist.color}12`,
              border: `1px solid ${artist.color}30`,
              marginBottom: 8,
            }}>{lick.album}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-base)', lineHeight: 1.1 }}>
              {lick.song}
            </div>
          </div>

          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 12,
            background: `${artist.color}10`,
            border: `1px solid ${artist.color}25`,
            display: 'inline-block',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: artist.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Tom
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-base)' }}>
              {lick.key}
            </div>
          </div>

          {lick.shape && (
            <div style={{ marginBottom: 16 }}>
              <ShapeDiagram shape={lick.shape} color={artist.color} />
            </div>
          )}

          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Tablatura profissional
          </div>
          <TabBlock tab={lick.tab} color={artist.color} timeSig={lick.timeSig} tempo={lick.tempo} rhythm={lick.rhythm} />

          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LEGEND.map(l => (
              <span key={l.sym} style={{
                fontSize: 10, color: 'var(--text-ultra)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{
                  fontFamily: 'monospace', fontWeight: 700,
                  color: artist.color, padding: '0 5px',
                  background: `${artist.color}14`, borderRadius: 4,
                }}>{l.sym}</span>
                {l.desc}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Técnicas usadas
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {lick.techniques.map((t, i) => (
                <span key={i} style={{
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 11, fontWeight: 600,
                  background: `${artist.color}10`, color: artist.color,
                  border: `1px solid ${artist.color}28`,
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 18 }}>
            {[
              { label: 'Como tocar',       text: lick.howTo,   icon: '🎸', color: '#60a5fa' },
              { label: 'Feeling',          text: lick.feeling, icon: '💭', color: '#a78bfa' },
              { label: 'Dica de treino',   text: lick.tip,     icon: '⚡', color: '#f59e0b' },
            ].map((box, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 12,
                background: 'var(--ink-03)',
                border: `1px solid ${box.color}20`,
                borderLeft: `3px solid ${box.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 14 }}>{box.icon}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: box.color,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>{box.label}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                  {box.text}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <CompleteToggle
              done={isComplete('licks', `${artist.id}-${lick.id}`)}
              onClick={() => markLesson('licks', `${artist.id}-${lick.id}`)}
            />
          </div>
        </div>
      </Section>
      <LessonFooter moduleId="licks" />

    </div>
  )
}
