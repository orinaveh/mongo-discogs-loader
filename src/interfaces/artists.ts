export interface Artist {
  serialId: string,
  name: string,
  profile?: string,
  variations?: string[],
}

export interface ArtistCsv {
  id: string,
  name: string,
  profile?: string,
  variations: string[]
}

export interface VariationsCsv {
  artist_id: string
  name: string[]
}
