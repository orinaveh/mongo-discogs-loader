export interface Master {
  serialId: string,
  artistsIds: string[],
  name: string,
  year: string,
  styles?: string[],
}

export interface Song {
  name: string,
  type: string,
  serialId: string,
}

export interface MasterXml {
  '$attrs': {
    id: string,
  },
  title: string,
  released: string,
  master_id: {
    '$text': string,
    '$attrs': { is_main_release: 'true' | 'false' }
  },
  styles: string[],
  genres: string[],
  artists: {
    id: string,
    name: string,
  }[],
  tracklist: {
    position: string,
    title: string,
    type: string,
    artists: {
      id: string,
      name: string,
    } | {
      id: string,
      name: string,
    }[],
  }[],
}
