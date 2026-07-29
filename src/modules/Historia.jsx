import { useState } from 'react'
import { PageHeader, Section, TheoryBlock } from '../components/Common.jsx'

const ERAS = [
  {
    decade: '1900s–1930s',
    title: 'Delta Blues — As origens',
    color: '#c084fc',
    desc: 'Nascido no Delta do Mississippi, o blues surgiu das comunidades negras do sul dos EUA a partir de cantos de trabalho, hollers e spirituals. Era música de um homem e um violão — cru, visceral e profundamente expressivo.',
    artists: [
      {
        name: 'Robert Johnson',
        life: '1911–1938',
        origin: 'Mississippi, EUA',
        badge: 'Lenda fundadora',
        bio: 'O mais mitológico dos bluesmens. Suas 29 gravações feitas entre 1936 e 1937 influenciaram Clapton, Richards, Page e praticamente todo músico de rock. A lenda da encruzilhada — onde teria vendido sua alma ao diabo em troca do talento — acompanha sua breve e misteriosa vida.',
        albums: ['Complete Recordings (1936–37)'],
        songs: ['Cross Road Blues', 'Love in Vain', 'Sweet Home Chicago', 'Hellhound on My Trail'],
        guitar: 'Gibson L-1 (acústico)',
        legacy: 'A guitarra slide, os baixos ambulantes, as progressões I-IV-V — Johnson codificou o vocabulário do blues que todos usariam depois.'
      },
      {
        name: 'Charlie Patton',
        life: '1891–1934',
        origin: 'Mississippi, EUA',
        badge: 'Pai do Delta Blues',
        bio: 'Considerado o fundador do Delta Blues, Patton era famoso por sua voz poderosa e por usar o violão como instrumento percussivo — batucando no corpo enquanto tocava. Influenciou diretamente Robert Johnson e Howlin\' Wolf.',
        albums: ['Founder of the Delta Blues'],
        songs: ['Pony Blues', 'High Water Everywhere'],
        guitar: 'Stella (acústico)',
        legacy: 'Definiu o uso rítmico do violão no blues e a postura performática do bluesman solista.'
      }
    ]
  },
  {
    decade: '1940s–1950s',
    title: 'Chicago Blues — O blues vai para a cidade',
    color: '#f472b6',
    desc: 'A Grande Migração levou os negros do sul para as cidades industriais do norte. Em Chicago, o blues ganhou eletricidade, banda completa e volume. Mudou para sempre.',
    artists: [
      {
        name: 'Muddy Waters',
        life: '1913–1983',
        origin: 'Mississippi → Chicago',
        badge: 'Pai do Chicago Blues',
        bio: 'McKinley Morganfield levou o blues do Delta para Chicago e o eletrificou. Seu som de guitarra deslizante amplificada, combinado com bandas de harmônica, baixo e bateria, criou o Chicago Blues. Os Rolling Stones escolheram seu nome em homenagem a sua música "Rollin\' Stone".',
        albums: ['At Newport 1960', 'Folk Singer'],
        songs: ['Hoochie Coochie Man', 'Mannish Boy', 'Got My Mojo Working', 'Rollin\' Stone'],
        guitar: 'Fender Telecaster (slide)',
        legacy: 'Criou o template do blues elétrico em banda. Influenciou diretamente Clapton, Hendrix, os Rolling Stones e Led Zeppelin.'
      },
      {
        name: 'B.B. King',
        life: '1925–2015',
        origin: 'Mississippi → Las Vegas',
        badge: 'Rei do Blues',
        bio: 'Riley B. King revolucionou a técnica de guitarra no blues. Sem usar slide, criou um vibrato de pulso inimitável que simulava a expressividade do canto. Sua abordagem de três mãos — frases em single notes, vibrato e muting — é estudada até hoje. Seu violão "Lucille" se tornou um ícone.',
        albums: ['Live at the Regal', 'Completely Well', 'Live in Cook County Jail'],
        songs: ['The Thrill Is Gone', 'Every Day I Have the Blues', 'Three O\'Clock Blues', 'Why I Sing the Blues'],
        guitar: 'Gibson ES-355 "Lucille"',
        legacy: 'O vibrato de B.B. é o padrão de ouro do blues. Clapton, SRV e John Mayer reconhecem sua influência fundamental. Popularizou o blues para audiências brancas nos anos 60.'
      },
      {
        name: 'T-Bone Walker',
        life: '1910–1975',
        origin: 'Texas → Los Angeles',
        badge: 'Pioneiro da guitarra elétrica',
        bio: 'T-Bone Walker foi um dos primeiros a usar a guitarra elétrica no blues (desde 1942), antes mesmo que se tornasse padrão. Sua técnica de single notes, os double-stops e a postura de tocar a guitarra atrás da cabeça influenciaram Chuck Berry e diretamente BB King.',
        albums: ['T-Bone Blues (1959)'],
        songs: ['Stormy Monday', 'T-Bone Shuffle', 'I\'m Still in Love with You'],
        guitar: 'Gibson ES-250 / ES-5',
        legacy: 'Fundou o Texas Blues e definiu a guitarra elétrica como instrumento de solo no blues. Influência direta sobre BB King, Chuck Berry e praticamente todos que vieram depois.'
      }
    ]
  },
  {
    decade: '1950s–1960s',
    title: 'Blues Rock & Chicago — Segunda geração',
    color: '#818cf8',
    desc: 'O blues se funde com o rock and roll. Artistas como Chuck Berry popularizam o blues para audiências jovens e brancas. Em Chicago, Buddy Guy e Otis Rush levam a guitarra a novos extremos expressivos.',
    artists: [
      {
        name: 'Buddy Guy',
        life: '1936–presente',
        origin: 'Louisiana → Chicago',
        badge: 'Influenciador de gerações',
        bio: 'Buddy Guy é o elo perdido entre o blues clássico e o rock psicodélico. Seu estilo agressivo, imprevisível e altamente expressivo influenciou diretamente Jimi Hendrix, Eric Clapton e Stevie Ray Vaughan. Clapton o chama de "o maior guitarrista vivo". Suas apresentações ao vivo são lendárias pela imprevisibilidade.',
        albums: ['A Man and the Blues', 'Damn Right I\'ve Got the Blues', 'Slippin\' In'],
        songs: ['Stone Crazy', 'Damn Right I\'ve Got the Blues', 'Five Long Years', 'Mary Had a Little Lamb'],
        guitar: 'Fender Stratocaster (polca-dot)',
        legacy: 'Ponte entre o Chicago Blues clássico e o blues rock. Seu impacto em Hendrix e Clapton é incalculável.'
      },
      {
        name: 'Howlin\' Wolf',
        life: '1910–1976',
        origin: 'Mississippi → Chicago',
        badge: 'O Lobo Uivante',
        bio: 'Chester Burnett — o Howlin\' Wolf — tinha uma voz como nenhuma outra: cavernosa, ameaçadora e primitiva. Com o guitarrista Hubert Sumlin, criou um som que influenciou Led Zeppelin, Rolling Stones e toda a cena de blues britânico dos anos 60.',
        albums: ['Moanin\' in the Moonshine', 'Howlin\' Wolf (Chess LP)'],
        songs: ['Smokestack Lightning', 'Back Door Man', 'Spoonful', 'Killing Floor'],
        guitar: 'Gibson ES-335',
        legacy: 'Led Zeppelin adaptou "Killing Floor" em "The Lemon Song" e "Whole Lotta Love".'
      }
    ]
  },
  {
    decade: '1960s–1970s',
    title: 'Blues Rock — A explosão britânica',
    color: '#60a5fa',
    desc: 'Músicos britânicos descobrem o blues americano e o devolvem para o mundo amplificado e transformado. Eric Clapton, Jimmy Page e Jeff Beck criam o blues rock — e Jimi Hendrix redefine tudo novamente.',
    artists: [
      {
        name: 'Eric Clapton',
        life: '1945–presente',
        origin: 'Surrey, Inglaterra',
        badge: 'Slowhand',
        bio: '"Slowhand" — o apelido vem da lentidão metódica com que trocava as cordas ao vivo, enquanto a plateia batia palmas devagar. Clapton tocou no Yardbirds, Cream, Blind Faith e Derek and the Dominos antes de solo. Sua interpretação de "Crossroads" (Cream, 1968) é considerada uma das melhores performances de blues rock da história.',
        albums: ['Fresh Cream', 'Disraeli Gears', 'Layla (Derek & Dominos)', '461 Ocean Boulevard', 'Unplugged'],
        songs: ['Crossroads', 'Layla', 'Wonderful Tonight', 'Tears in Heaven', 'Cocaine', 'White Room'],
        guitar: 'Gibson SG, Fender Stratocaster "Blackie", ES-335',
        legacy: 'Popularizou BB King e Robert Johnson para o mundo. O "Clapton is God" grafitado em Londres em 1967 captura o impacto que causou na época.'
      },
      {
        name: 'Jimi Hendrix',
        life: '1942–1970',
        origin: 'Seattle, EUA',
        badge: 'Revolucionário',
        bio: 'James Marshall Hendrix redefeniu o que era possível na guitarra elétrica em apenas 4 anos de carreira. Canhoto que tocava guitarra destra invertida, usava o polegar da mão esquerda para acordes de baixo enquanto fazia single notes com os outros dedos. Seu uso de feedback, wah-wah e distorção era completamente original.',
        albums: ['Are You Experienced', 'Axis: Bold as Love', 'Electric Ladyland'],
        songs: ['Purple Haze', 'Hey Joe', 'Voodoo Child', 'Red House', 'All Along the Watchtower', 'Little Wing'],
        guitar: 'Fender Stratocaster (invertida, canhoto)',
        legacy: 'Expandiu o vocabulário técnico e expressivo da guitarra além do que qualquer um imaginava possível. "Little Wing" e "Red House" são blues puro, transmutado em algo único.'
      }
    ]
  },
  {
    decade: '1970s–1980s',
    title: 'Texas Blues Revival & Hard Blues',
    color: '#c084fc',
    desc: 'Após a morte de Hendrix, o blues encontra novos porta-vozes: de Albert King ao jovem Stevie Ray Vaughan, o Texas Blues ressurge com força total.',
    artists: [
      {
        name: 'Albert King',
        life: '1923–1992',
        origin: 'Mississippi → St. Louis',
        badge: 'O mestre do bend',
        bio: 'Um dos três "Kings" do blues (BB, Freddie e Albert). Canhoto que tocava guitarra destra sem inverter as cordas — resultado: bendia as cordas puxando para baixo, criando um timbre completamente único. Stevie Ray Vaughan ouvia Albert King obsessivamente na adolescência.',
        albums: ['Born Under a Bad Sign', 'Live Wire / Blues Power'],
        songs: ['Born Under a Bad Sign', 'Crosscut Saw', 'As the Years Go Passing By'],
        guitar: 'Gibson Flying V',
        legacy: 'Seu estilo de bend influenciou diretamente Stevie Ray Vaughan, que praticamente transcreveu seus solos de cabeça.'
      },
      {
        name: 'Stevie Ray Vaughan',
        life: '1954–1990',
        origin: 'Dallas, Texas',
        badge: 'O último grande',
        bio: 'Stevie Ray Vaughan reviveu o blues num momento em que o mundo havia se rendido ao pop dos anos 80. Usava cordas calibre 0.13 afinadas meio tom abaixo, criando um som denso e poderoso que ninguém mais conseguia imitar. Seu álbum "Texas Flood" (1983) mudou a indústria.',
        albums: ['Texas Flood', 'Couldn\'t Stand the Weather', 'Soul to Soul', 'In Step'],
        songs: ['Pride and Joy', 'Texas Flood', 'Couldn\'t Stand the Weather', 'Tightrope', 'Little Wing', 'Lenny'],
        guitar: 'Fender Stratocaster "Number One" (1963)',
        legacy: 'Salvou o blues do ostracismo nos anos 80. Morreu em um acidente de helicóptero em 1990, aos 35 anos. Uma tragédia incalculável para a música.'
      }
    ]
  },
  {
    decade: '1990s–2000s',
    title: 'Blues Contemporâneo — Nova geração',
    color: '#f472b6',
    desc: 'O blues vive. Joe Bonamassa, John Mayer, Gary Clark Jr. e outros provam que a tradição continua evoluindo, conectando o passado ao presente.',
    artists: [
      {
        name: 'John Mayer',
        life: '1977–presente',
        origin: 'Bridgeport, Connecticut',
        badge: 'Blues do século XXI',
        bio: 'John Mayer começou como cantor pop e surpreendeu o mundo em 2006 com "Continuum" — um álbum de blues e soul impecável. Seu álbum "Born and Raised" e o projeto John Mayer Trio mostram um guitarrista que estudou profundamente SRV, BB King e Buddy Guy.',
        albums: ['Continuum', 'Born and Raised', 'The Search for Everything', 'Sob Rock'],
        songs: ['Slow Dancing in a Burning Room', 'Gravity', 'Vultures', 'Waiting on the World to Change', 'Who Did You Think I Was (JM Trio)'],
        guitar: 'Fender Stratocaster "Black One", PRS Silver Sky',
        legacy: 'Apresentou o blues para a geração do pop dos anos 2000. Seu "Trio" é uma das melhores bandas de blues ao vivo da atualidade.'
      },
      {
        name: 'Joe Bonamassa',
        life: '1977–presente',
        origin: 'New Hartford, Nova York',
        badge: 'O virtuoso moderno',
        bio: 'Joe Bonamassa começou a tocar guitarra aos 4 anos e aos 12 abriu shows para B.B. King. Desde então, construiu uma carreira prolífica (mais de 40 álbuns) de forma completamente independente, sem os grandes selos. É considerado o guitarrista de blues mais técnico e prolífico da atualidade.',
        albums: ['Sloe Gin', 'Dust Bowl', 'Blues of Desperation', 'Royal Tea', 'Time Clocks'],
        songs: ['Sloe Gin', 'The River', 'Mountain Time', 'Driving Towards the Daylight', 'How Deep This River Runs'],
        guitar: 'Gibson Les Paul Standard, 1960 Burst',
        legacy: 'Prova que o blues pode ser comercialmente independente. Sua coleção de guitarras históricas é uma das mais valiosas do mundo.'
      },
      {
        name: 'Gary Clark Jr.',
        life: '1984–presente',
        origin: 'Austin, Texas',
        badge: 'O próximo',
        bio: 'Texano de Austin, Gary Clark Jr. funde blues, rock, soul e hip-hop de forma única. Obama o convidou para tocar na Casa Branca. Seu álbum "Blak and Blu" (2012) mostrou ao mundo um guitarrista para a próxima geração.',
        albums: ['Blak and Blu', 'The Story of Sonny Boy Slim', 'This Land'],
        songs: ['Bright Lights', 'Numb', 'When My Train Pulls In', 'This Land'],
        guitar: 'Gibson ES-335, Fender Stratocaster',
        legacy: 'Representa a evolução do blues para além das fronteiras do gênero — uma visão do que vem a seguir.'
      }
    ]
  }
]

function ArtistCard({ artist, eraColor }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className="artist-card p-5 cursor-pointer"
      style={{ borderLeft: `3px solid ${eraColor}` }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-base)' }}>{artist.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${eraColor}20`, color: eraColor }}>
              {artist.badge}
            </span>
          </div>
          <div className="text-xs flex gap-3" style={{ color: 'var(--text-subtle)' }}>
            <span>{artist.life}</span>
            <span>{artist.origin}</span>
          </div>
        </div>
        <span className="text-xl" style={{ color: 'var(--text-subtle)' }}>{expanded ? '↑' : '↓'}</span>
      </div>

      {!expanded && (
        <p className="text-sm mt-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{artist.bio}</p>
      )}

      {expanded && (
        <div className="mt-4 space-y-4 fade-up">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{artist.bio}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-subtle)' }}>Músicas essenciais</div>
              <ul className="space-y-1">
                {artist.songs.map((s) => (
                  <li key={s} className="text-sm flex gap-2" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: eraColor }}>♪</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-subtle)' }}>Álbuns fundamentais</div>
              <ul className="space-y-1">
                {artist.albums.map((a) => (
                  <li key={a} className="text-sm" style={{ color: 'var(--text-muted)' }}>{a}</li>
                ))}
              </ul>
              <div className="mt-3">
                <div className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-subtle)' }}>Guitarra de assinatura</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-base)' }}>{artist.guitar}</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl" style={{ background: `${eraColor}12`, borderLeft: `3px solid ${eraColor}60` }}>
            <div className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: eraColor }}>Legado</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{artist.legacy}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Historia() {
  return (
    <div>
      <PageHeader
        chip="História"
        title="A História do Blues & Jazz"
        description="De Robert Johnson nas plantações do Mississippi a Joe Bonamassa em arenas ao redor do mundo. A história da música mais influente do século XX."
      />

      <div className="card p-5 mb-8">
        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <p className="mb-3">
            O blues não é apenas um gênero musical — é uma <b>linguagem emocional</b>. Nascido da dor da escravidão
            e da opressão, tornou-se a raiz de praticamente toda a música popular do século XX:
            rock, jazz, soul, R&B, funk e pop.
          </p>
          <p>
            Entender a história do blues é entender de onde vem o vocabulário que você usa quando improvisa.
            Cada técnica — o bend, o vibrato, o slide — tem uma origem, um criador, uma história.
            Clique nos artistas para explorar seu legado.
          </p>
        </div>
      </div>

      {ERAS.map((era) => (
        <section key={era.decade} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: `${era.color}30` }} />
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: era.color }}>{era.decade}</div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-base)' }}>{era.title}</h2>
            </div>
            <div className="h-px flex-1" style={{ background: `${era.color}30` }} />
          </div>

          <div className="card p-4 mb-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{era.desc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {era.artists.map((artist) => (
              <ArtistCard key={artist.name} artist={artist} eraColor={era.color} />
            ))}
          </div>
        </section>
      ))}

      <Section title="O Jazz como irmão do Blues">
        <TheoryBlock>
          <p>
            O <b>jazz</b> e o <b>blues</b> compartilham o mesmo DNA. Ambos nasceram no sul dos EUA,
            nas comunidades negras, no início do século XX. A diferença: enquanto o blues manteve
            a estrutura simples de 12 compassos e a expressividade bruta, o jazz evoluiu para
            harmonias cada vez mais complexas.
          </p>
          <p>
            <b>Charlie Parker</b> (1920–1955) pegou o blues de 12 compassos e reharmonizou com velocidades
            e complexidades que ninguém havia imaginado — nasceu o bebop.
            <b> Miles Davis</b> (1926–1991) com "Kind of Blue" (1959) — o álbum mais vendido da história do jazz —
            introduziu o conceito modal que libertou os músicos das progressões de acordes rígidas.
          </p>
          <p>
            <b>Wes Montgomery</b> (1923–1968) transferiu o vocabulário do bebop para a guitarra de forma
            definitiva. Sua técnica de tocar com o polegar (sem palheta) e seus chorus em oitavas
            são copiados por guitarristas até hoje.
          </p>
          <p>
            A fusão blues-jazz produz o <b>jazz blues</b> — onde a progressão de 12 compassos encontra
            as substituições harmônicas do bebop. É o que você ouve em Charlie Parker tocando "Now's the Time"
            ou em Grant Green em "Idle Moments".
          </p>
        </TheoryBlock>
      </Section>
    </div>
  )
}
