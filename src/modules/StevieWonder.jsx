import ArtistPage from '../components/ArtistPage.jsx'

const DATA = {
  id: 'stevie-wonder',
  name: 'Stevie Wonder',
  fullName: 'Stevland Hardaway Morris',
  born: '1950 · Saginaw, MI',
  era: '1962 – presente',
  category: 'R&B / Soul',
  bio: 'Compositor, multi-instrumentista e produtor — provavelmente o gênio musical mais completo do século XX. Inventou o "soul progressivo" nos anos 70: harmonias jazzísticas embaladas em groove dançável e letras de denúncia social. "Superstition", "Sir Duke", "Isn\'t She Lovely" são aulas vivas de songwriting, arranjo e produção.',
  genres: ['R&B', 'Soul', 'Funk', 'Jazz'],
  images: [
    { src: '/images/stevieWonder.jpg',  label: 'Era Talking Book' },
    { src: '/images/steviewonder2.jpg', label: 'Songs in the Key of Life' },
    { src: '/images/stevieWonder3.jpg', label: 'Era contemporânea' },
  ],
  color: '#e879f9',
  bgFrom: '#6b21a8',
  bgTo: '#3b0764',
  trademarks: [
    'Clavinet funk com bend cromático (assinatura de Superstition)',
    'Vocais em "block harmony" — todas as vozes empilhadas em paralelo',
    'Acordes maj7#11, m11 e 13(b9) — extensões jazz no pop',
    'Linhas de baixo melódicas (que cantam quase tanto quanto a voz)',
  ],
  songs: [
    {
      id: 'superstition', title: 'Superstition', year: 1972, album: 'Talking Book',
      key: 'Eb menor (Ebm)', accent: '#e879f9',
      description: 'O funk perfeito. Riff de clavinet sobre apenas DOIS acordes — todo o resto é groove. Foi gravada quando Stevie tinha 22 anos e mudou o R&B para sempre.',
      composition: 'Stevie compôs originalmente para Jeff Beck (que adorava o riff). Berry Gordy (Motown) ouviu antes do disco final e exigiu que Stevie gravasse — virou o primeiro #1 dele desde os anos 60. Compositoramente é o exemplo perfeito de "vamp groove": apenas Ebm7 oscilando com algumas notas extras. TODA a complexidade está no GROOVE — clavinet sincopado, bateria com bumbo deslocado, naipe de metais entrando como soco. Estrutura: AABA com pontes-improviso. O riff (Eb-Gb-Ab-Bb) é a pentatônica menor pura — mas executada com cromatismos rápidos entre as notas.',
      sections: [
        { name: 'Verso (groove)', progression: ['Ebm7', 'Ab9'],
          analysis: 'i7 – IV9. Cadência mínima — apenas dois acordes, mas com extensões pesadas (9, 11). Toda a "música" está no ritmo, não na harmonia.' },
        { name: 'Bridge', progression: ['Bm', 'D7', 'Ebm7', 'Ab7'],
          analysis: 'bVI – bVII7 – i7 – IV7. A bridge sai do groove com modulação efêmera ao paralelo maior — alívio momentâneo antes de voltar pro riff.' },
        { name: 'Outro', progression: ['Ebm7', 'Bbm7', 'Ab9', 'Ebm7'],
          analysis: 'i7 – v7 – IV9 – i7. Cadência expandida que prepara o fade-out. Stevie improvisa por cima por quase 2 minutos.' },
      ],
      chords: [
        { root: 'Eb', key: 'min7', label: 'Ebm7',  role: 'i7 — tônica funk' },
        { root: 'Ab', key: '7',    label: 'Ab7',   role: 'IV7 — subdominante' },
        { root: 'Ab', key: '9',    label: 'Ab9',   role: 'IV9 — com cor' },
        { root: 'Bb', key: 'min7', label: 'Bbm7',  role: 'v7' },
        { root: 'B',  key: 'min',  label: 'Bm',    role: 'bVI — bridge' },
        { root: 'D',  key: '7',    label: 'D7',    role: 'bVII7' },
      ],
    },
    {
      id: 'sir-duke', title: 'Sir Duke', year: 1976, album: 'Songs in the Key of Life',
      key: 'Si maior (B)', accent: '#c084fc',
      description: 'Tributo a Duke Ellington. Big band em formato pop — naipe de metais respondendo o vocal em cada frase. Aula viva de arranjo orquestral.',
      composition: 'Stevie escreveu como homenagem a Duke Ellington (que tinha morrido em 1974) — daí o título. O recurso composicional mais célebre: o "naipe de metais respondendo a melodia da voz" — quando Stevie canta "you can feel it all over", os metais REPETEM EXATAMENTE a melodia, em uníssono, criando efeito de "eco com peso". Esse "call and response" instrumental vem direto do swing dos anos 30/40. A ponte instrumental usa cromatismo descendente (Bm – Bbmaj7 – Am7 – Ab7) — escada por meio-tons. Forma: AABA expandida com vamps.',
      sections: [
        { name: 'Verso', progression: ['B', 'Cmaj7', 'F#m', 'B'],
          analysis: 'I – bIIM7 – v – I. O Cmaj7 (bIIM7) é um trote tonal — empréstimo modal que aparece como "soco harmônico" inesperado.' },
        { name: 'Pré-refrão', progression: ['G#m', 'F#', 'E', 'F#'],
          analysis: 'vi – V – IV – V. Descida clássica do soul, criando expectativa para o refrão.' },
        { name: 'Refrão (com naipe)', progression: ['B', 'D#m', 'G#m', 'F#'],
          analysis: 'I – iii – vi – V. Os metais respondem cada acorde com riff descendente. É a "máquina pop" mais bem azeitada do soul.' },
      ],
      chords: [
        { root: 'B',  key: 'maj',  label: 'B',     role: 'I — tônica' },
        { root: 'C',  key: 'maj7', label: 'Cmaj7', role: 'bIIM7 — surpresa modal' },
        { root: 'F#', key: 'min',  label: 'F#m',   role: 'v — modal' },
        { root: 'F#', key: 'maj',  label: 'F#',    role: 'V' },
        { root: 'G#', key: 'min',  label: 'G#m',   role: 'vi — relativo menor' },
        { root: 'E',  key: 'maj',  label: 'E',     role: 'IV' },
        { root: 'D#', key: 'min',  label: 'D#m',   role: 'iii' },
      ],
    },
    {
      id: 'isnt-she-lovely', title: "Isn't She Lovely", year: 1976, album: 'Songs in the Key of Life',
      key: 'Mi maior (E)', accent: '#d946ef',
      description: 'Celebração ao nascimento da filha Aisha. Estrutura cíclica em mi maior — soa simples mas é uma aula de extensões e voicings.',
      composition: 'Composta no dia em que Aisha (filha de Stevie) nasceu. A versão original do álbum tem 6 minutos com gravações reais do banho da bebê chorando no meio — Stevie se recusou a cortar essa parte ("ela faz parte da música"). A harmonia parece simples (I-vi-ii-V repetidamente) mas Stevie disfarça com extensões: cada acorde aparece com 9 ou maj7 dependendo do verso. O solo de harmônica no final é improvisado em uma única take. Forma: A1-A2-A3 (3 voltas) com ponte-improvisação.',
      sections: [
        { name: 'Verso', progression: ['E', 'C#m7', 'F#m7', 'B7'],
          analysis: 'I – vi7 – ii7 – V7. Cadência "Doo Wop" enriquecida com 7ª nas vozes intermediárias. Estável, dançante, sem surpresa.' },
        { name: 'Variação', progression: ['Emaj7', 'C#m9', 'F#m11', 'B13'],
          analysis: 'IM7 – vi9 – ii11 – V13. MESMA progressão, mas com extensões empilhadas. Soa "moderna" sem mudar nada estruturalmente.' },
        { name: 'Coda (com harmônica)', progression: ['Emaj7', 'A6', 'Emaj7', 'B7'],
          analysis: 'IM7 – IV6 – IM7 – V7. Vamp aberto para o solo. O A6 (com a 6ª maior na voz superior) tem cor "luminosa" — perfeito para celebração.' },
      ],
      chords: [
        { root: 'E',  key: 'maj',  label: 'E',      role: 'I — tônica' },
        { root: 'E',  key: 'maj7', label: 'Emaj7',  role: 'IM7' },
        { root: 'C#', key: 'min7', label: 'C#m7',   role: 'vi7' },
        { root: 'F#', key: 'min7', label: 'F#m7',   role: 'ii7' },
        { root: 'F#', key: 'min',  label: 'F#m',    role: 'ii' },
        { root: 'B',  key: '7',    label: 'B7',     role: 'V7' },
        { root: 'A',  key: 'maj',  label: 'A',      role: 'IV' },
      ],
    },
  ],
  lessons: [
    { title: 'A complexidade mora nas extensões, não nos acordes',
      text: 'Em Stevie, as progressões são quase sempre triviais (I-vi-ii-V, I-V-vi-IV). O que torna SOFISTICADO é a escolha das extensões em cada acorde: 9, 11, 13. Aprenda a tocar Imaj9 em vez de I, e você já está 50% do caminho.' },
    { title: 'O groove é a melodia',
      text: 'Em "Superstition", só há 2 acordes na canção inteira. Toda a "música" está no ritmo do clavinet, no deslocamento do bumbo, na entrada dos metais. Quando o groove está perfeito, harmonia complexa é desnecessária.' },
    { title: 'Linha de baixo melódica é assinatura',
      text: 'Em Stevie (que tocava o baixo no Moog), a linha de baixo NUNCA é só fundamental. Ela CANTA — sobe pra 3ª, desce pra 7ª, faz cromatismos. Estude as linhas de baixo separadamente: cada uma é uma segunda melodia.' },
  ],
}

export default function StevieWonder() {
  return <ArtistPage data={DATA} />
}
