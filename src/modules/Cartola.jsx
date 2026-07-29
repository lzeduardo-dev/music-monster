import ArtistPage from '../components/ArtistPage.jsx'

const DATA = {
  id: 'cartola',
  name: 'Cartola',
  fullName: 'Angenor de Oliveira',
  born: '1908–1980 · Rio de Janeiro, RJ',
  era: 'Era de Ouro do Samba',
  category: 'MPB',
  bio: 'Fundador da Mangueira e patrono do samba carioca. Cartola só gravou seu primeiro disco solo aos 65 anos — mas suas composições mostram um nível de sofisticação harmônica que só seria igualado décadas depois. "As Rosas Não Falam" é hoje considerado um dos sambas mais belos já compostos.',
  genres: ['Samba', 'Samba-canção', 'MPB'],
  images: [
    { src: '/images/cartola.jpg',   label: 'O sambista do morro' },
    { src: '/images/cartola2.jpg',  label: 'O patriarca da Mangueira' },
    { src: '/images/cartola3.jpeg', label: 'Anos finais' },
  ],
  color: '#60a5fa',
  bgFrom: '#1e3a8a',
  bgTo: '#0c4a6e',
  trademarks: [
    'Cadências do samba-canção (i – V7/iv – iv – V7)',
    'Uso refinado de acordes diminutos como passagem',
    'Tônicas menores com 7ª maior (efeito agridoce)',
    'Melodia construída sobre intervalos cantáveis — voz como instrumento principal',
  ],
  songs: [
    {
      id: 'as-rosas-nao-falam', title: 'As Rosas Não Falam', year: 1976, album: 'Cartola',
      key: 'Em', accent: '#60a5fa',
      description: 'Considerado um dos sambas mais belos de todos os tempos. A harmonia é uma aula de samba-canção: cromatismos, diminutos de passagem e a chegada inevitável da tônica menor.',
      composition: 'Cartola só começou sua carreira fonográfica aos 65 anos — esta é do segundo álbum solo (1976). A letra surgiu de uma frase ouvida por acaso: "as rosas não falam, simplesmente exalam o perfume". A construção composicional usa o recurso da "metáfora cumulativa" — cada estrofe acrescenta uma camada à imagem das rosas. Foi gravada por mais de 200 artistas, de Beth Carvalho a Marisa Monte. A versão original de Cartola é em violão solo, sem percussão — algo raríssimo no samba.',
      sections: [
        { name: 'Introdução', progression: ['Em', 'B7', 'Em', 'B7'],
          analysis: 'i – V7 – i – V7. A oscilação i-V7 estabelece a tônica menor com peso. Em sambas-canção, a tensão dominante volta repetidamente como um suspiro.' },
        { name: 'Verso', progression: ['Em', 'C#dim', 'D7', 'G'],
          analysis: 'i – vii°7 (do III) – V7/III – III. O C#dim funciona como dominante diminuto do G (relativo maior), criando uma modulação suave para o "lampejo de luz".' },
        { name: 'Refrão', progression: ['G', 'Em', 'Am', 'B7'],
          analysis: 'III – i – iv – V7. Conjunto perfeito: começa no relativo maior (esperança), cai na tônica menor (realidade), passa pela subdominante (lamento) e termina em dominante (suspiro inacabado).' },
      ],
      chords: [
        { root: 'E',  key: 'min',  label: 'Em',     role: 'i — tônica menor' },
        { root: 'B',  key: '7',    label: 'B7',     role: 'V7 — dominante' },
        { root: 'C#', key: 'dim',  label: 'C#dim',  role: 'vii°/III — diminuto de passagem' },
        { root: 'D',  key: '7',    label: 'D7',     role: 'V7/III' },
        { root: 'G',  key: 'maj',  label: 'G',      role: 'III — relativo maior' },
        { root: 'A',  key: 'min',  label: 'Am',     role: 'iv — subdominante' },
      ],
    },
    {
      id: 'o-mundo-e-moinho', title: 'O Mundo é um Moinho', year: 1976, album: 'Cartola',
      key: 'Em', accent: '#38bdf8',
      description: 'Conselho amargo de Cartola à filha que queria fugir de casa. A música é circular como um moinho: a harmonia gira em torno de Em mas nunca descansa de verdade.',
      composition: 'Cartola estava no estúdio gravando quando recebeu a notícia de que sua filha tinha fugido de casa pra morar com o namorado. Escreveu a letra de uma vez só, ali mesmo. O título é metáfora extraordinária: o mundo TRITURA quem entra nele sem preparo — exatamente como um moinho. Estrutura: ABAB com codetta cíclica. A frase "preste atenção, querida..." se repete três vezes na canção, em alturas melódicas diferentes — recurso típico do choro carioca pra criar densidade emocional sem mudar a letra.',
      sections: [
        { name: 'Verso (advertência)', progression: ['Em', 'Am', 'D7', 'G'],
          analysis: 'i – iv – V7/III – III. O movimento sobe gradualmente até o relativo maior, mas a sensação é de pergunta sem resposta. Não há cadência conclusiva.' },
        { name: 'Conselho', progression: ['Cmaj7', 'B7', 'Em', 'B7'],
          analysis: 'bVIM7 – V7 – i – V7. O Cmaj7 (bVIM7) é o "abraço" do pai antes da advertência (B7). A repetição do V7 sem resolução plena reforça o tom de aviso.' },
        { name: 'Coda', progression: ['Am', 'Em', 'B7', 'Em'],
          analysis: 'iv – i – V7 – i. Finalmente uma cadência conclusiva. Mas a chegada é em Em — não há saída feliz, só a aceitação melancólica.' },
      ],
      chords: [
        { root: 'E',  key: 'min',  label: 'Em',     role: 'i — tônica' },
        { root: 'A',  key: 'min',  label: 'Am',     role: 'iv — subdominante' },
        { root: 'D',  key: '7',    label: 'D7',     role: 'V7/III' },
        { root: 'G',  key: 'maj',  label: 'G',      role: 'III — relativo' },
        { root: 'C',  key: 'maj7', label: 'Cmaj7',  role: 'bVIM7 — empréstimo' },
        { root: 'B',  key: '7',    label: 'B7',     role: 'V7 — dominante' },
      ],
    },
    {
      id: 'alvorada', title: 'Alvorada', year: 1968, album: 'Mangueira do Amanhã',
      key: 'G', accent: '#3b82f6',
      description: 'Samba-exaltação à Mangueira ao amanhecer. Harmonia mais simples e luminosa que as outras — aqui Cartola está no maior, celebrando.',
      composition: 'Co-autoria com Carlos Cachaça (outro mestre do morro). A canção foi escrita para o desfile da Mangueira de 1968 — virou um dos sambas-enredo mais celebrados do carnaval carioca. Cartola dispensa qualquer complexidade harmônica aqui porque a função é COLETIVA: o samba precisa ser cantado por 5.000 pessoas no avenida. Estrutura simples I-IV-V em sol maior, melodia silábica (uma nota por sílaba), ritmo de partido alto. Pura engenharia popular.',
      sections: [
        { name: 'Verso', progression: ['G', 'D7', 'G', 'C'],
          analysis: 'I – V7 – I – IV. Cadência maior pura. A clareza harmônica representa o sol nascendo sobre o morro — sem ambiguidades.' },
        { name: 'Ponte', progression: ['Am', 'D7', 'G', 'E7'],
          analysis: 'ii – V – I – V7/ii. O E7 prepara o retorno ao Am — "respiração" entre as estrofes do samba.' },
        { name: 'Refrão', progression: ['G', 'C', 'G', 'D7'],
          analysis: 'I – IV – I – V7. Triunfo total. Quase um hino — perfeito para o desfile de carnaval.' },
      ],
      chords: [
        { root: 'G',  key: 'maj',  label: 'G',   role: 'I — tônica maior' },
        { root: 'D',  key: '7',    label: 'D7',  role: 'V7 — dominante' },
        { root: 'C',  key: 'maj',  label: 'C',   role: 'IV — subdominante' },
        { root: 'A',  key: 'min',  label: 'Am',  role: 'ii — preparação' },
        { root: 'E',  key: '7',    label: 'E7',  role: 'V7/ii' },
      ],
    },
  ],
  lessons: [
    { title: 'O diminuto de passagem é a alma do samba-canção',
      text: 'Cartola usa acordes diminutos (C#dim, A#dim) como pontes cromáticas entre acordes diatônicos. Essa é a diferença entre o samba "raiz" e o samba-canção sofisticado.' },
    { title: 'O empréstimo do maior dá esperança momentânea',
      text: 'Em sambas menores, Cartola visita o relativo maior (III) ou o bVI emprestado para criar um lampejo de alegria — que torna o retorno ao menor ainda mais comovente.' },
    { title: 'Simplicidade não é falta de profundidade',
      text: '"Alvorada" usa apenas 5 acordes — mas a escolha de cada um, e o ritmo com que aparecem, é cirúrgica. Cartola provava que beleza não precisa de complexidade.' },
  ],
}

export default function Cartola() {
  return <ArtistPage data={DATA} />
}
