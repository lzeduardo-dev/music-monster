import ArtistPage from '../components/ArtistPage.jsx'

const DATA = {
  id: 'chico-buarque',
  name: 'Chico Buarque',
  fullName: 'Francisco Buarque de Hollanda',
  born: '1944 · Rio de Janeiro, RJ',
  era: '1964 – presente',
  category: 'MPB',
  bio: 'Compositor, escritor e cantor — voz lírica e politicamente afiada da MPB. Suas canções unem letras de altíssima literatura a harmonias que dialogam com o jazz, o samba e o choro. "Construção", "Cálice", "O Que Será" são obras-primas tanto verbais quanto musicais.',
  genres: ['MPB', 'Samba', 'Bossa nova', 'Canção engajada'],
  images: [
    { src: '/images/chicobuarque.jpg',  label: 'O jovem compositor' },
    { src: '/images/chicobuarque2.jpg', label: 'Anos de exílio' },
    { src: '/images/chicoBuarque3.jpg', label: 'O patriarca da MPB' },
  ],
  color: '#818cf8',
  bgFrom: '#312e81',
  bgTo: '#1e1b4b',
  trademarks: [
    'Cadências menores expandidas (i – iv – V7) com voicings de jazz',
    'Modulações sutis para o paralelo maior dentro de canções menores',
    'Uso de empréstimo modal (bVIM7, bVIIM7) como cor narrativa',
    'Harmonias que "comentam" a letra — cada acorde tem função poética',
  ],
  songs: [
    {
      id: 'construcao', title: 'Construção', year: 1971, album: 'Construção',
      key: 'Dm', accent: '#818cf8',
      description: 'A obra-prima absoluta. Cada verso termina em proparoxítona e cada estrofe é harmonicamente igual, mas com letras reorganizadas. A música constrói tensão emocional como um edifício — em camadas.',
      composition: 'O experimento formal mais ousado da MPB. Chico escreveu 3 estrofes onde as MESMAS palavras-rima são REORGANIZADAS — "tijolo / desenho / canteiro" aparecem nas mesmas posições, mas com contextos diferentes. Musicalmente, o arranjo orquestral de Rogério Duprat (mesmo dos Mutantes) usa metais ascendentes em camadas que simulam o crescimento físico do prédio. A última estrofe sobe pra agudo conforme a tragédia se aproxima — o cara cai como "um saco flácido de morte" no final. Sem refrão. Forma única.',
      sections: [
        { name: 'Verso (motivo cíclico)', progression: ['Dm', 'Gm', 'A7', 'Dm'],
          analysis: 'i – iv – V7 – i. Cadência menor harmônica clássica em Ré menor. A simplicidade harmônica deixa todo o peso na letra e no arranjo orquestral.' },
        { name: 'Subida dramática', progression: ['Dm', 'Bb', 'A7', 'Dm'],
          analysis: 'i – bVI – V7 – i. O Bb (bVIM) é o "salto na escada" — empréstimo do menor harmônico que cria tensão antes do V7.' },
        { name: 'Modulação final', progression: ['Gm', 'C7', 'Fmaj7', 'A7'],
          analysis: 'ii – V – I (em Fá maior) – V7 (de Ré menor). Modula brevemente para o relativo maior antes de voltar. É a "luz no fim do túnel" musical.' },
      ],
      chords: [
        { root: 'D',  key: 'min',  label: 'Dm',    role: 'i — tônica' },
        { root: 'G',  key: 'min',  label: 'Gm',    role: 'iv — subdominante' },
        { root: 'A',  key: '7',    label: 'A7',    role: 'V7 — dominante' },
        { root: 'Bb', key: 'maj',  label: 'Bb',    role: 'bVI — emprestado' },
        { root: 'C',  key: '7',    label: 'C7',    role: 'V7/IV — dominante secundário' },
        { root: 'F',  key: 'maj7', label: 'Fmaj7', role: 'bIIIM7 — relativo maior' },
      ],
    },
    {
      id: 'calice', title: 'Cálice', year: 1973, album: 'Chico Buarque',
      key: 'Am', accent: '#6366f1',
      description: 'Parceria com Gilberto Gil — censurada pelo regime militar em 1973. "Cálice" (cale-se) é um trocadilho perfeito. Harmonia menor melódica que sustenta uma das letras mais corajosas da história da MPB.',
      composition: 'Inspirada no Sermão da Montanha — "Pai, afasta de mim esse cálice". Chico tentou cantar em 1973 com Gil no Phono 73, mas os microfones foram cortados ao vivo pela censura militar. A canção só foi gravada oficialmente em 1978. O recurso composicional mais brilhante: a frase "Pai, afasta de mim esse cálice" é solene, religiosa — mas "cálice" soa como "cale-se" (imperativo de calar). Toda a letra opera nesses dois níveis simultaneamente. A harmonia menor pura (sem ornamentos jazz) reforça o tom de cântico fúnebre.',
      sections: [
        { name: 'Refrão (chamado)', progression: ['Am', 'Dm', 'E7', 'Am'],
          analysis: 'i – iv – V7 – i. A cadência menor pura — solene, religiosa, quase um cântico fúnebre. Simplicidade total para a letra ferir.' },
        { name: 'Verso', progression: ['Am', 'Fmaj7', 'Dm', 'E7'],
          analysis: 'i – bVIM7 – iv – V7. O Fmaj7 (bVIM7) é um "ai" suspenso — empréstimo modal que adoça a tensão antes da resolução.' },
        { name: 'Ponte', progression: ['G', 'C', 'Dm', 'E7'],
          analysis: 'bVII – bIII – iv – V7. Os acordes maiores emprestados do paralelo maior criam um respiro de "esperança falsa" antes de cair de novo no menor.' },
      ],
      chords: [
        { root: 'A',  key: 'min',  label: 'Am',    role: 'i — tônica' },
        { root: 'D',  key: 'min',  label: 'Dm',    role: 'iv — subdominante' },
        { root: 'E',  key: '7',    label: 'E7',    role: 'V7 — dominante' },
        { root: 'F',  key: 'maj7', label: 'Fmaj7', role: 'bVIM7 — empréstimo' },
        { root: 'G',  key: 'maj',  label: 'G',     role: 'bVII — modal' },
        { root: 'C',  key: 'maj',  label: 'C',     role: 'bIII — relativo maior' },
      ],
    },
    {
      id: 'o-que-sera', title: 'O Que Será (À Flor da Pele)', year: 1976, album: 'Meus Caros Amigos',
      key: 'Cm', accent: '#a78bfa',
      description: 'Trilha sonora de "Dona Flor e Seus Dois Maridos". Samba envolvente em dó menor com harmonia que escorrega cromaticamente — perfeita para descrever desejo "à flor da pele".',
      composition: 'Composta para o filme de Bruno Barreto (1976) baseado em Jorge Amado. A canção tem três versões: "Geraldinas" (versão pra Geraldas e Marias), "Marianas" (versão sensual), e a versão instrumental. Chico escreveu a letra como uma sucessão de PERGUNTAS sem resposta — "Que será, que será...". Musicalmente, a harmonia desliza por quartas descendentes (Cm7 – F7 – Bbmaj7 – Ebmaj7) imitando o "escorregar" do desejo. Quase nada se resolve até o último compasso. É o oposto da estrutura clássica de samba.',
      sections: [
        { name: 'Verso', progression: ['Cm7', 'F7', 'Bbmaj7', 'Ebmaj7'],
          analysis: 'i – IV7 – bVIIM7 – bIIIM7. Movimento de quartas descendentes — Chico desliza por todo o campo de Bb maior usando Cm como tônica modal (Dórico).' },
        { name: 'Frase B', progression: ['Am7b5', 'D7', 'Gm7', 'C7'],
          analysis: 'vii°7 – III7 – vi7 – II7. Cadeia de dominantes secundários que prepara o retorno — cada acorde é V7 do próximo. Característico do samba-jazz.' },
        { name: 'Resolução', progression: ['Fm7', 'Bb7', 'Ebmaj7', 'Ab7'],
          analysis: 'ii – V – I – bVII7 (em Eb). Modulação ao relativo maior (Eb) com cadência ii-V-I clássica antes de voltar pra Cm.' },
      ],
      chords: [
        { root: 'C',  key: 'min7', label: 'Cm7',    role: 'i7 — tônica' },
        { root: 'F',  key: '7',    label: 'F7',     role: 'IV7 — sub. dom.' },
        { root: 'Bb', key: 'maj7', label: 'Bbmaj7', role: 'bVIIM7' },
        { root: 'Eb', key: 'maj7', label: 'Ebmaj7', role: 'bIIIM7 — relativo' },
        { root: 'A',  key: 'm7b5', label: 'Am7b5',  role: 'vii°7' },
        { root: 'D',  key: '7',    label: 'D7',     role: 'III7' },
        { root: 'G',  key: 'min7', label: 'Gm7',    role: 'vi7' },
        { root: 'F',  key: 'min7', label: 'Fm7',    role: 'iv7' },
        { root: 'Bb', key: '7',    label: 'Bb7',    role: 'V7 (relativo)' },
      ],
    },
  ],
  lessons: [
    { title: 'A harmonia conta a história',
      text: 'Chico escolhe cada acorde pelo significado emocional, não pela "boniteza". Em "Cálice", a simplicidade da cadência menor é proposital — quanto menos ornamento, mais a letra fere.' },
    { title: 'Empréstimo do paralelo maior é a regra',
      text: 'Quase toda canção menor de Chico tem visitas ao relativo maior. É como um raio de sol no meio da tempestade — torna a tristeza mais devastadora pelo contraste.' },
    { title: 'Cadeias de dominantes secundários',
      text: 'Em "O Que Será", a sequência ii–V–I se aplica em várias tonalidades diferentes dentro da mesma música, criando uma sensação de "deslizar" — perfeita para o tema do desejo.' },
  ],
}

export default function ChicoBuarque() {
  return <ArtistPage data={DATA} />
}
