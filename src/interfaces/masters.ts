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
  id: string,
  title: string,
  released: string,
  styles: string[],
  genres: string[],
  tracklist: {
    position: string,
    title: string,
    type: string,
  }[],
}
