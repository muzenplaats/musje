# musje
![alt musje 123](https://github.com/malcomwu/musje/blob/master/dist/assets/musje123-64x64.jpg)
<br>
A numbered musical notation in sheet music.

## Background
Musje is sparrow in Dutch. The first numbered musical notation was
presented by Jean-Jacques Rousseau to the French Academy of
Sciences in 1742. It has been evolved and become popular in some
areas of Asia, and called jianpu, literally simple music score, in Chinese.
The musje 123 is a music processor based on this notation.

## Development
This project was initiated about year 2015; however, several attempts
has been missed or discontinued.
This version is musje 2 (codename: gezondheid).

```sh
npm run serve
```

and http://localhost:9000/.

The rendering is based on a funny `el.js` by-product.


### Roadmap toward musje 2.0.0-beta

#### Improvement

- reflowSticks(sticks, dataLayoutWidth)

Incorporate timing (tcQ) with spacings (minX) -> x = transform(minX, tcQ).

#### Bugfix

- 004.musje
