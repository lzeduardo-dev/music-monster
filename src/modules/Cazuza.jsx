import ArtistPage from '../components/ArtistPage.jsx'

const DATA = {
  id: 'cazuza',
  name: 'Cazuza',
  fullName: 'Agenor de Miranda Araújo Neto',
  born: '1958–1990 · Rio de Janeiro, RJ',
  era: 'Rock Brasil dos anos 80',
  category: 'MPB',
  bio: 'Voz e letra do rock brasileiro dos anos 80 — mas com pegada de MPB lírica. Vocalista do Barão Vermelho e, depois, solo. Cazuza escreveu hinos de uma geração — "Codinome Beija-Flor", "O Tempo Não Para", "Exagerado" — com letras de poeta e harmonias que dialogam diretamente com Chico Buarque e Cartola, apesar do arranjo de banda elétrica.',
  genres: ['MPB', 'Rock Brasil', 'Pop Rock'],
  images: [
    { src: '/images/cazuza.webp', label: 'Barão Vermelho' },
    { src: '/images/cazuza2.jpg', label: 'Auge da carreira solo' },
    { src: '/images/cazuza3.jpg', label: 'Anos finais (Ideologia)' },
  ],
  color: '#c084fc',
  bgFrom: '#581c87',
  bgTo: '#3b0764',
  trademarks: [
    'Cadências de rock clássico (I – IV – V) com mudanças bruscas',
    'Modulações por terças (recurso do rock dos 80)',
    'Refrões em maior contrastando com versos em menor',
    'Letra-comanda — a harmonia segue a urgência da palavra',
  ],
  songs: [
    {
      id: 'codinome-beija-flor', title: 'Codinome Beija-Flor', year: 1985, album: 'Maior Abandonado',
      key: 'G', accent: '#c084fc',
      description: 'Hino da geração. Letra metafórica sobre amor e despedida. Harmonia em sol maior com piscadas de menor relativo — soa nostálgica e leve ao mesmo tempo.',
      composition: 'Composta com Roberto Frejat (guitarrista do Barão Vermelho). A letra usa "codinomes" porque era endereçada a Eduardo Dusek (parceiro romântico de Cazuza) — algo que só foi confirmado anos depois. Compositoramente é um exemplo perfeito da "Axis Progression" (vi-IV-I-V em variações) usada em milhares de hits pop — só que Cazuza inverte a fórmula para começar pelo I, dando sensação de "abertura" em vez de tensão. O refrão usa síncope na palavra "BEIJA-flor" forçando ela a cair fora do tempo — recurso de bossa nova adaptado pro rock.',
      sections: [
        { name: 'Intro / Verso', progression: ['G', 'Em', 'C', 'D'],
          analysis: 'I – vi – IV – V. A progressão mais usada do pop ocidental (chamada "4 chord song"). Soa familiar, confortável — perfeita para uma letra de despedida.' },
        { name: 'Pré-refrão', progression: ['Em', 'Bm', 'C', 'D'],
          analysis: 'vi – iii – IV – V. Subida gradual da intensidade. O Bm (iii) é a "ponte emocional" antes do refrão explodir.' },
        { name: 'Refrão', progression: ['G', 'D', 'Em', 'C'],
          analysis: 'I – V – vi – IV. Variação da fórmula — começa firme na tônica e descansa no IV no final. É o "respira" entre o lirismo da letra.' },
      ],
      chords: [
        { root: 'G',  key: 'maj', label: 'G',  role: 'I — tônica' },
        { root: 'E',  key: 'min', label: 'Em', role: 'vi — relativo menor' },
        { root: 'C',  key: 'maj', label: 'C',  role: 'IV — subdominante' },
        { root: 'D',  key: 'maj', label: 'D',  role: 'V — dominante' },
        { root: 'B',  key: 'min', label: 'Bm', role: 'iii — mediante' },
      ],
    },
    {
      id: 'o-tempo-nao-para', title: 'O Tempo Não Para', year: 1988, album: 'Ideologia',
      key: 'E', accent: '#a78bfa',
      description: 'Manifesto pessoal de Cazuza já doente. Rock cru, harmonia agressiva, mas com a melodia oscilando entre cinismo e ternura. "Disparo contra o sol".',
      composition: 'Composta em 1987, quando Cazuza descobriu ser portador de HIV. A letra é um testamento poético — "eu vejo o futuro repetir o passado" virou frase-mantra dos anos 80. Compositoramente, é um sonnet musical: 14 versos (mais ou menos), divididos em quartetos rimados, terminando com couplet de virada. A melodia evita o agudo o tempo todo, mantendo Cazuza no registro grave/médio — efeito de "cansaço corporal" intencional. O refrão estoura para o agudo apenas na frase "o tempo NÃO PARA" — aí entra como soco emocional.',
      sections: [
        { name: 'Verso', progression: ['E', 'A', 'B', 'E'],
          analysis: 'I – IV – V – I. Cadência de blues/rock pura. Sem ornamentos. A energia toda vem da letra e do ataque da guitarra.' },
        { name: 'Pré-refrão', progression: ['A', 'B', 'C#m', 'B'],
          analysis: 'IV – V – vi – V. A subida ao relativo menor (C#m) é o ponto onde a letra muda de tom — do cinismo à confissão.' },
        { name: 'Refrão', progression: ['E', 'B', 'C#m', 'A'],
          analysis: 'I – V – vi – IV. A "deceptive cadence" (V → vi) no meio do refrão é o que dá o impacto emocional — em vez de resolver na tônica, vai ao relativo menor.' },
      ],
      chords: [
        { root: 'E',  key: 'maj', label: 'E',   role: 'I — tônica' },
        { root: 'A',  key: 'maj', label: 'A',   role: 'IV' },
        { root: 'B',  key: 'maj', label: 'B',   role: 'V' },
        { root: 'C#', key: 'min', label: 'C#m', role: 'vi — relativo menor' },
      ],
    },
    {
      id: 'faz-parte-do-meu-show', title: 'Faz Parte do Meu Show', year: 1988, album: 'O Tempo Não Para',
      key: 'D', accent: '#d8b4fe',
      description: 'Cazuza no auge da ironia. A letra finge ser sobre um show — mas é sobre encarar a doença. Harmonia simples, modulação certeira para enfatizar o "faz parte".',
      composition: 'A canção mais "leve" do álbum O Tempo Não Para — mas é a mais dolorida, justamente porque mascara a dor sob uma melodia dançante de country-rock. A estrofe "Mas isso faz parte do meu show / vivendo de cigarro e champanhê" é exatamente o oposto do que Cazuza estava vivendo (já estava muito magro, debilitado). Compositoramente, é uma "fake-positive song" — gênero usado por Bowie ("Lazarus"), Freddie Mercury ("The Show Must Go On") e Belchior ("Como Nossos Pais"). A melodia ascendente do refrão simula esperança que não existe.',
      sections: [
        { name: 'Verso', progression: ['D', 'A', 'G', 'D'],
          analysis: 'I – V – IV – I. Cadência de rock clássico (estilo "Sweet Home Alabama"). Letra fala em tom casual, harmonia acompanha sem dramatizar.' },
        { name: 'Ponte', progression: ['Bm', 'A', 'G', 'A'],
          analysis: 'vi – V – IV – V. Cai no relativo menor — o momento em que a ironia se quebra e a verdade emerge.' },
        { name: 'Refrão', progression: ['D', 'G', 'A', 'D'],
          analysis: 'I – IV – V – I. Volta à simplicidade. O refrão é resoluto: aceita o destino sem dramatizar.' },
      ],
      chords: [
        { root: 'D',  key: 'maj', label: 'D',  role: 'I — tônica' },
        { root: 'A',  key: 'maj', label: 'A',  role: 'V — dominante' },
        { root: 'G',  key: 'maj', label: 'G',  role: 'IV — subdominante' },
        { root: 'B',  key: 'min', label: 'Bm', role: 'vi — relativo menor' },
      ],
    },
  ],
  lessons: [
    { title: 'O rock vive da progressão I–IV–V',
      text: 'Cazuza raramente complica a harmonia. A força está em tocar a fórmula clássica do rock com convicção. A letra carrega o resto.' },
    { title: 'A "deceptive cadence" (V → vi) é o golpe emocional',
      text: 'Em vez de V → I (resolução esperada), Cazuza vai V → vi (relativo menor). Sente como se o chão caísse — perfeito pra letras com vira-volta emocional.' },
    { title: 'O relativo menor é o "outro lado" da canção',
      text: 'Quando o verso está no maior, visitar o vi (relativo menor) muda completamente o tom — sem precisar mudar de tonalidade. É a forma mais barata de criar profundidade.' },
  ],
}

export default function Cazuza() {
  return <ArtistPage data={DATA} />
}
