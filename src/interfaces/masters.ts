export interface Master {
  serialId: string,
  artistsIds: string[],
  name: string,
  tracklist: {
    name: string,
    type: string,
    serialId: string,
  }[],
  styles?: string[],
}
