const flags: Record<string, string> = {
  // CONMEBOL
  'Brazil': '🇧🇷', 'Brasilia': '🇧🇷',
  'Argentina': '🇦🇷', 'Argentiina': '🇦🇷',
  'Uruguay': '🇺🇾', 'Colombia': '🇨🇴', 'Ecuador': '🇪🇨',
  'Venezuela': '🇻🇪', 'Paraguay': '🇵🇾', 'Bolivia': '🇧🇴',
  'Peru': '🇵🇪', 'Chile': '🇨🇱',

  // CONCACAF
  'Mexico': '🇲🇽', 'Meksiko': '🇲🇽',
  'United States': '🇺🇸', 'USA': '🇺🇸',
  'Canada': '🇨🇦', 'Kanada': '🇨🇦',
  'Honduras': '🇭🇳', 'Panama': '🇵🇦', 'Costa Rica': '🇨🇷',
  'Guatemala': '🇬🇹', 'Jamaica': '🇯🇲', 'El Salvador': '🇸🇻',
  'Trinidad and Tobago': '🇹🇹', 'Cuba': '🇨🇺', 'Haiti': '🇭🇹',
  'Curaçao': '🇨🇼', 'Curacao': '🇨🇼',

  // UEFA
  'Germany': '🇩🇪', 'Saksa': '🇩🇪',
  'France': '🇫🇷', 'Ranska': '🇫🇷',
  'Spain': '🇪🇸', 'Espanja': '🇪🇸',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Englanti': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Portugal': '🇵🇹', 'Italy': '🇮🇹', 'Italia': '🇮🇹',
  'Netherlands': '🇳🇱', 'Alankomaat': '🇳🇱',
  'Belgium': '🇧🇪', 'Belgia': '🇧🇪',
  'Poland': '🇵🇱', 'Puola': '🇵🇱',
  'Croatia': '🇭🇷', 'Kroatia': '🇭🇷',
  'Turkey': '🇹🇷', 'Türkiye': '🇹🇷', 'Turkki': '🇹🇷',
  'Switzerland': '🇨🇭', 'Sveitsi': '🇨🇭',
  'Denmark': '🇩🇰', 'Tanska': '🇩🇰',
  'Austria': '🇦🇹', 'Itävalta': '🇦🇹',
  'Hungary': '🇭🇺', 'Unkari': '🇭🇺',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Skotlanti': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Serbia': '🇷🇸',
  'Czech Republic': '🇨🇿', 'Czechia': '🇨🇿', 'Tšekki': '🇨🇿',
  'Slovakia': '🇸🇰', 'Greece': '🇬🇷', 'Kreikka': '🇬🇷',
  'Romania': '🇷🇴', 'Ukraine': '🇺🇦', 'Ukraina': '🇺🇦',
  'Albania': '🇦🇱', 'Georgia': '🇬🇪', 'Slovenia': '🇸🇮',
  'Finland': '🇫🇮', 'Suomi': '🇫🇮',
  'Norway': '🇳🇴', 'Norja': '🇳🇴',
  'Sweden': '🇸🇪', 'Ruotsi': '🇸🇪',
  'Iceland': '🇮🇸', 'Islanti': '🇮🇸',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Bosnia and Herzegovina': '🇧🇦', 'Bosnia-Herzegovina': '🇧🇦',
  'North Macedonia': '🇲🇰', 'Kosovo': '🇽🇰', 'Montenegro': '🇲🇪',
  'Ireland': '🇮🇪', 'Republic of Ireland': '🇮🇪', 'Northern Ireland': '🇬🇧',
  'Azerbaijan': '🇦🇿', 'Armenia': '🇦🇲', 'Moldova': '🇲🇩',
  'Luxembourg': '🇱🇺', 'Bulgaria': '🇧🇬',
  'Lithuania': '🇱🇹', 'Latvia': '🇱🇻', 'Estonia': '🇪🇪',

  // CAF
  'Morocco': '🇲🇦', 'Marokko': '🇲🇦',
  'Senegal': '🇸🇳', 'Nigeria': '🇳🇬',
  'Egypt': '🇪🇬', 'Egypti': '🇪🇬',
  "Côte d'Ivoire": '🇨🇮', 'Ivory Coast': '🇨🇮', 'Norsunluurannikko': '🇨🇮',
  'Cameroon': '🇨🇲', 'Kamerun': '🇨🇲',
  'Ghana': '🇬🇭', 'Mali': '🇲🇱',
  'Algeria': '🇩🇿', 'Tunisia': '🇹🇳',
  'South Africa': '🇿🇦', 'Etelä-Afrikka': '🇿🇦',
  'DR Congo': '🇨🇩', 'Congo DR': '🇨🇩',
  'Zambia': '🇿🇲', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Kenya': '🇰🇪',
  'Burkina Faso': '🇧🇫',
  'Cape Verde': '🇨🇻', 'Cape Verde Islands': '🇨🇻',

  // AFC
  'Japan': '🇯🇵', 'Japani': '🇯🇵',
  'South Korea': '🇰🇷', 'Korea Republic': '🇰🇷', 'Etelä-Korea': '🇰🇷',
  'Iran': '🇮🇷', 'IR Iran': '🇮🇷',
  'Saudi Arabia': '🇸🇦', 'Saudi-Arabia': '🇸🇦',
  'Australia': '🇦🇺', 'Qatar': '🇶🇦',
  'Iraq': '🇮🇶', 'Irak': '🇮🇶',
  'Jordan': '🇯🇴', 'Uzbekistan': '🇺🇿', 'Indonesia': '🇮🇩',
  'Bahrain': '🇧🇭', 'China': '🇨🇳', 'Kiina': '🇨🇳',
  'Oman': '🇴🇲', 'Kuwait': '🇰🇼',
  'Palestine': '🇵🇸', 'United Arab Emirates': '🇦🇪', 'UAE': '🇦🇪',

  // OFC
  'New Zealand': '🇳🇿', 'Uusi-Seelanti': '🇳🇿',
}

const finnishNames: Record<string, string> = {
  // CONMEBOL
  'Brazil': 'Brasilia', 'Argentina': 'Argentiina', 'Uruguay': 'Uruguay',
  'Colombia': 'Kolumbia', 'Ecuador': 'Ecuador', 'Venezuela': 'Venezuela',
  'Paraguay': 'Paraguay', 'Bolivia': 'Bolivia', 'Peru': 'Peru', 'Chile': 'Chile',

  // CONCACAF
  'Mexico': 'Meksiko', 'United States': 'Yhdysvallat', 'USA': 'Yhdysvallat',
  'Canada': 'Kanada', 'Honduras': 'Honduras', 'Panama': 'Panama',
  'Costa Rica': 'Costa Rica', 'Guatemala': 'Guatemala', 'Jamaica': 'Jamaika',
  'El Salvador': 'El Salvador', 'Trinidad and Tobago': 'Trinidad ja Tobago',
  'Cuba': 'Kuuba', 'Haiti': 'Haiti',

  // UEFA
  'Germany': 'Saksa', 'France': 'Ranska', 'Spain': 'Espanja',
  'England': 'Englanti', 'Portugal': 'Portugali', 'Italy': 'Italia',
  'Netherlands': 'Alankomaat', 'Belgium': 'Belgia', 'Poland': 'Puola',
  'Croatia': 'Kroatia', 'Turkey': 'Turkki', 'Türkiye': 'Turkki',
  'Switzerland': 'Sveitsi', 'Denmark': 'Tanska', 'Austria': 'Itävalta',
  'Hungary': 'Unkari', 'Scotland': 'Skotlanti', 'Serbia': 'Serbia',
  'Czech Republic': 'Tšekki', 'Czechia': 'Tšekki', 'Slovakia': 'Slovakia',
  'Greece': 'Kreikka', 'Romania': 'Romania', 'Ukraine': 'Ukraina',
  'Albania': 'Albania', 'Georgia': 'Georgia', 'Slovenia': 'Slovenia',
  'Finland': 'Suomi', 'Norway': 'Norja', 'Iceland': 'Islanti', 'Wales': 'Wales',
  'Bosnia and Herzegovina': 'Bosnia-Hertsegovina', 'Bosnia-Herzegovina': 'Bosnia-Hertsegovina',
  'North Macedonia': 'Pohjois-Makedonia', 'Kosovo': 'Kosovo', 'Montenegro': 'Montenegro',
  'Ireland': 'Irlanti', 'Republic of Ireland': 'Irlanti', 'Northern Ireland': 'Pohjois-Irlanti',
  'Azerbaijan': 'Azerbaidžan', 'Armenia': 'Armenia', 'Moldova': 'Moldova',
  'Luxembourg': 'Luxemburg', 'Bulgaria': 'Bulgaria',
  'Lithuania': 'Liettua', 'Latvia': 'Latvia', 'Estonia': 'Viro',

  // CAF
  'Morocco': 'Marokko', 'Senegal': 'Senegal', 'Nigeria': 'Nigeria',
  'Egypt': 'Egypti', "Côte d'Ivoire": 'Norsunluurannikko', 'Ivory Coast': 'Norsunluurannikko',
  'Cameroon': 'Kamerun', 'Ghana': 'Ghana', 'Mali': 'Mali',
  'Algeria': 'Algeria', 'Tunisia': 'Tunisia', 'South Africa': 'Etelä-Afrikka',
  'DR Congo': 'Kongo DR', 'Congo DR': 'Kongo DR', 'Zambia': 'Sambia',
  'Tanzania': 'Tansania', 'Uganda': 'Uganda', 'Kenya': 'Kenia',
  'Burkina Faso': 'Burkina Faso', 'Cape Verde': 'Kap Verde',

  // AFC
  'Japan': 'Japani', 'South Korea': 'Etelä-Korea', 'Korea Republic': 'Etelä-Korea',
  'Iran': 'Iran', 'Saudi Arabia': 'Saudi-Arabia', 'Australia': 'Australia',
  'Qatar': 'Qatar', 'Iraq': 'Irak', 'Jordan': 'Jordania',
  'Uzbekistan': 'Uzbekistan', 'Indonesia': 'Indonesia', 'Bahrain': 'Bahrain',
  'China': 'Kiina', 'Oman': 'Oman', 'Kuwait': 'Kuwait',
  'Palestine': 'Palestiina', 'United Arab Emirates': 'Arabiemiirikunnat', 'UAE': 'Arabiemiirikunnat',

  // OFC
  'New Zealand': 'Uusi-Seelanti',
}

export function getFlag(teamName: string): string {
  return flags[teamName] ?? ''
}

export function getTeamName(teamName: string): string {
  return finnishNames[teamName] ?? teamName
}
