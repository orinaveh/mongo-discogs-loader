# Mongo Discogs Loader

Package thats load XML flies into MongoDB.

## Format

This package loads **only** main releases (The tracks are loaded into a different collection) and artists.


### Album Document Schema
```
{
  _id: ObjectId(),  
  serialId: string,
  artistsIds: string[],
  name: string,
  date: string,
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
  artistIds: string[] (Discogs ids)
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

## Installation

```
npm i -g discogs-loader
```

## Usage 

```
 mongo discogs-loader load [options] <Path to xml file - releases | artists>

Options:
  -o, --connection <String>  Mongo connection URL
  -d, --db <String>          DB Name (default: "music")
  -h, --help                 display help for command
  ```