// Centralised module → lessons map. Each key matches the moduleId actually
// used by the corresponding module page (in markLesson calls).
// LessonFooter resolves `moduleId` → list of lesson IDs to toggle all at once.

export const MODULE_LESSONS = {
  fundamentals:         ['waves', 'scale', 'intervals', 'formula', 'intervalos_aprofundados', 'major-scale'],
  figuras_ritmicas:     ['introducao', 'figuras', 'pausas', 'pontua_ligaduras', 'subdivisao', 'tercinas', 'sextinas', 'metronomo_integrado'],
  ciclo_quintas:        ['quintas', 'quartas'],
  harmony:              ['chord_qualities', 'triads', 'string_shapes', 'inversions'],
  harmonia_funcional:   ['tsdf', 'progressions', 'ii_v_i'],
  scales:               ['pentatonicMinor', 'pentatonicMajor', 'blues', 'bluesMajor', 'shapes_5', 'horizontalidade'],
  penta_patterns:       ['col_4', 'col_3', 'tercina_3', 'tercina_4', 'nao_seq_4', 'col_6', 'cinco_sobre', 'salto', 'tercina_6'],
  arpejos:              ['maj', 'min', 'aug', 'dim', '7', 'maj7', 'min7'],
  caged:                ['concept', 'c_shape', 'a_shape', 'g_shape', 'e_shape', 'd_shape'],
  escalas_avancadas:    ['harmonic_minor', 'harmonic_modes', 'melodic_minor'],
  advanced:             ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'],
  'melodic-minor':      ['melodic_minor', 'melodic_modes'],
  maquina_acordes:      ['teoria', 'maquina'],
  groove:               ['mpq'],
  improviso:            ['blues_g', 'neo_soul_am', 'ciclo_quartas'],
  quiz:                 ['completed'],
  licks:                ['module_done'],
  tecnicas:             ['chord_tones', 'avoid_notes', 'approach', 'relative_minor'],
  'jazz-blues':         ['blues_12', 'jazz_blues'],
}
