# Mongo Discogs Loader

CLI thats load XML Discogs dumps into MongoDB.


## Installation

```
npm i -g mongo-discogs-loader
```

## Format

This package loads **only** main releases (The tracks are loaded into a different collection) and artists.


### Album Document Schema
```
{
  _id: ObjectId(),  
  serialId: string,
  artistIds: string[],
  name: string,
  date: string,
  artistNames: string[],
  styles: string[],
  genres: string[],
  tracklist: string[] (Songs serial ids)
}
```

### Song Document Schema 

```
{
  _id: ObjectId(),
  name: string,
  type: string,
  serialId: string (Composed from release `${Discogs ids}_${position}`),
  genres: string[],
  styles: string[],
  position: string,
  artistIds: string[] (Discogs ids),
  artistNames: string[],
}

```

### Artist Document Schema 

```
{
  _id: ObjectId(),
  serialId: string,
  name: string,
  profile?: string,
  variations?: string[],
}
```

## Usage 

```
 mongo discogs-loader load [options] <Path to xml file - releases | artists>

Options:
  -o, --connection <String>  Mongo connection URL
  -d, --db <String>          DB Name (default: "music")
  -h, --help                 display help for command
```