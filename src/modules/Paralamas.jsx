import ArtistPage from '../components/ArtistPage.jsx'

const DATA = {
  id: 'paralamas',
  name: 'Paralamas do Sucesso',
  fullName: 'Herbert Vianna, Bi Ribeiro & João Barone',
  born: '1977 · Rio de Janeiro, RJ',
  era: 'Rock Brasil dos 80 e 90',
  category: 'Blues & Rock',
  bio: 'Power trio que definiu o som do rock brasileiro pop. Mistura new wave, reggae, ska e MPB com letras inteligentes. Herbert Vianna é um dos compositores mais subestimados do Brasil — harmonicamente, é mais sofisticado do que parece.',
  genres: ['Rock Brasil', 'New Wave', 'Reggae', 'Ska'],
  images: [
    { src: '/images/paralamasDosucesso.jpg',  label: 'O trio carioca' },
    { src: '/images/paralamasDosucesso2.jpg', label: 'Era Selvagem? (anos 80)' },
    { src: '/images/paralamasDosucesso3.jpg', label: 'Maturidade (Hey Na Na)' },
  ],
  color: '#38bdf8',
  bgFrom: '#0c4a6e',
  bgTo: '#082f49',
  trademarks: [
    'Acordes maj7 e add9 em contexto pop-rock (toque do new wave)',
    'Levadas de reggae/ska sobre harmonia maior',
    'Modulações abruptas para o relativo maior',
    'Refrões com cadência IV – V – I "anabolizada"',
  ],
  songs: [
    {
      id: 'lanterna-dos-afogados', title: 'Lanterna dos Afogados', year: 1989, album: 'Big Bang',
      key: 'G', accent: '#38bdf8',
      description: 'Balada com letra sobre amor que não morre. Harmonia em sol maior com acordes maj7 que dão a sensação "flutuante" da letra. Um dos refrões mais cantados da história do rock nacional.',
      composition: 'Composta por Herbert Vianna na praia de Ipanema, após o fim de um relacionamento. A "lanterna dos afogados" é referência ao mito grego das almas que vagam pela praia sem sepultura — letras de amor não-correspondido virando metáfora poética. Compositoramente, é exemplo da "elevação harmônica do pop": uma progressão I-vi-IV-V banal vestida de Imaj7-vi7-IVM7-V que soa instantaneamente sofisticada. Vianna pegou essa sofisticação direto da MPB que ouvia (Toninho Horta, Djavan).',
      sections: [
        { name: 'Intro / Verso', progression: ['Gmaj7', 'Em7', 'Cmaj7', 'D'],
          analysis: 'Imaj7 – vi7 – IVM7 – V. Os maj7 dão o brilho típico do pop dos anos 80 — soa "sonhador". Comparado ao G simples, o Gmaj7 acrescenta a 7ª maior que "esfumaça" a tônica.' },
        { name: 'Pré-refrão', progression: ['Em7', 'D', 'Cmaj7', 'D'],
          analysis: 'vi7 – V – IVM7 – V. Acúmulo de tensão antes do refrão — o V se repete, prolongando a expectativa.' },
        { name: 'Refrão', progression: ['G', 'D', 'Em', 'C'],
          analysis: 'I – V – vi – IV. A "fórmula universal do pop". Sem maj7 aqui — Herbert tira a sofisticação no refrão pra que ele soe "cantável" pelo público.' },
      ],
      chords: [
        { root: 'G', key: 'maj7', label: 'Gmaj7', role: 'IM7 — tônica brilhante' },
        { root: 'G', key: 'maj',  label: 'G',     role: 'I' },
        { root: 'E', key: 'min7', label: 'Em7',   role: 'vi7' },
        { root: 'E', key: 'min',  label: 'Em',    role: 'vi' },
        { root: 'C', key: 'maj7', label: 'Cmaj7', role: 'IVM7' },
        { root: 'C', key: 'maj',  label: 'C',     role: 'IV' },
        { root: 'D', key: 'maj',  label: 'D',     role: 'V — dominante' },
      ],
    },
    {
      id: 'alagados', title: 'Alagados', year: 1986, album: 'Selvagem?',
      key: 'E', accent: '#0ea5e9',
      description: 'Hit reggae-rock com mensagem social. Compara a vida nas favelas do Rio às de Trenchtown (Jamaica). Levada reggae-ska em mi maior com energia constante.',
      composition: 'Composta por Bi Ribeiro e Herbert Vianna. Influência direta de Bob Marley — Vianna era fã declarado e usou o "skanking" jamaicano (acorde curto, no contratempo) como base rítmica de toda a canção. A letra cita explicitamente "Trenchtown" (bairro de Marley na Jamaica) e estabelece o paralelo direto com as favelas brasileiras. Recurso composicional: "letra cumulativa" — cada estrofe acrescenta um sintoma social novo, e o refrão é a denúncia coletiva ("aqui é Brasil, lá é a Jamaica / e o problema é o mesmo").',
      sections: [
        { name: 'Verso (levada reggae)', progression: ['E', 'A', 'B', 'A'],
          analysis: 'I – IV – V – IV. A oscilação IV–V (sem voltar à tônica entre eles) é puro reggae. Você sente o "skanking" da guitarra mesmo só lendo a cifra.' },
        { name: 'Ponte', progression: ['C#m', 'B', 'A', 'E'],
          analysis: 'vi – V – IV – I. Cai no relativo menor — momento em que a letra fica mais crítica. A descida diatônica termina na tônica como uma resolução resignada.' },
        { name: 'Refrão', progression: ['E', 'A', 'E', 'B'],
          analysis: 'I – IV – I – V. Cadência simples, repetitiva, hipnótica — perfeita para a mensagem reggae que precisa "entrar" no ouvinte.' },
      ],
      chords: [
        { root: 'E',  key: 'maj', label: 'E',   role: 'I — tônica' },
        { root: 'A',  key: 'maj', label: 'A',   role: 'IV — subdominante' },
        { root: 'B',  key: 'maj', label: 'B',   role: 'V — dominante' },
        { root: 'C#', key: 'min', label: 'C#m', role: 'vi — relativo menor' },
      ],
    },
    {
      id: 'meu-erro', title: 'Meu Erro', year: 1984, album: 'O Passo do Lui',
      key: 'Em', accent: '#7dd3fc',
      description: 'New wave puro. Andamento rápido, harmonia menor, levada de guitarra com acordes "abafados" no estilo de The Police. Letra de auto-crítica romântica.',
      composition: 'A composição que colocou os Paralamas no mapa. Herbert tinha 22 anos. A música começou como um exercício de imitar o som da The Police (que ele acabara de descobrir), mas a letra é puramente brasileira — auto-crítica romântica adolescente. Recurso composicional fundamental: a guitarra usa "ghost strums" (palhetadas mudas) entre os acordes, criando um pulso rítmico de semicolcheia mesmo quando o acorde está sustentado. Sting fazia isso o tempo todo na Police — Vianna importou pro rock brasileiro.',
      sections: [
        { name: 'Verso', progression: ['Em', 'D', 'G', 'A'],
          analysis: 'i – bVII – bIII – IV (Dórico). A presença do A maior (IV em Em dórico, não Em natural) dá o sabor new wave característico — soa "neutro" em vez de "triste".' },
        { name: 'Pré-refrão', progression: ['Bm', 'C', 'Em', 'D'],
          analysis: 'v – bVI – i – bVII. Movimento eólio que escurece a harmonia antes do refrão explodir.' },
        { name: 'Refrão', progression: ['G', 'D', 'Am', 'C'],
          analysis: 'III – bVII – iv – bVI. Modulação efêmera ao relativo maior (G) — alívio momentâneo em meio à letra confessional.' },
      ],
      chords: [
        { root: 'E', key: 'min', label: 'Em', role: 'i — tônica' },
        { root: 'D', key: 'maj', label: 'D',  role: 'bVII' },
        { root: 'G', key: 'maj', label: 'G',  role: 'bIII — relativo maior' },
        { root: 'A', key: 'maj', label: 'A',  role: 'IV (Dórico)' },
        { root: 'B', key: 'min', label: 'Bm', role: 'v — eólio' },
        { root: 'C', key: 'maj', label: 'C',  role: 'bVI' },
        { root: 'A', key: 'min', label: 'Am', role: 'iv' },
      ],
    },
  ],
  lessons: [
    { title: 'maj7 + add9 = som dos anos 80',
      text: 'Os Paralamas usam acordes com 7ª e 9ª maiores para dar o brilho característico do pop oitentista. Comparado ao G "puro", o Gmaj7 soa "sofisticado e flutuante".' },
    { title: 'O modo Dórico é o segredo do new wave',
      text: 'Em "Meu Erro", a presença do A maior em Em (que pertence ao Dórico, não ao menor natural) é o que diferencia o som — soa mais "moderno" que melancólico.' },
    { title: 'I – IV – V no reggae mora no IV',
      text: 'Em "Alagados", a tônica aparece pouco — o peso harmônico fica no IV e V se alternando. Isso é o "groove jamaicano" traduzido para a harmonia.' },
  ],
}

export default function Paralamas() {
  return <ArtistPage data={DATA} />
}
