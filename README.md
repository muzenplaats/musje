# musje 2.0.0-beta

![alt musje 123](https://github.com/malcomwu/musje/blob/master/dist/assets/musje123-64x64.jpg)
<br>
A numbered musical notation in sheet music.

## Background
Musje is sparrow in Dutch. The first numbered musical notation was
presented by Jean-Jacques Rousseau to the French Academy of
Sciences in 1742. It has been evolved and become popular in some
areas of Asia. It is called jianpu, literally simple music score, in Chinese.
The musje 123 is a music processor based on this notation.

## Language description

- The grammar of musje 2.0.
- The musje stylesheet.

## Development
This project was initiated about year 2015; however, several attempts
has been missed or discontinued.
This version is musje 2 (codename: gezondheid).

```sh
npm run serve
```

and http://localhost:9000/.

## Technical notes
- Th language is derived from LilyPond, abc, pmx and the MusicTeX family.
- The data structure is adapted from the MusicXML 3.0.
- The idea of parsing is based on "Let's Build a Compiler - Jack Crenshaw".
- The flow of layout start from the ideas of the css box model and stylesheets.
- The rendering uses an `el.js` by-product, affected by
  "Eloquent JavaScript - Marijn Haverbeke".
  However, it can be easily reproduced by some other libraries or using canvas.
- It uses the musical font of Cadence, LilyPond, and takes some from MuseScore.
