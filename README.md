# dizzidotz

__Source code for dizzidotz.com__

> There's this circle. 
> A bar goes around it like a clock hand and hits "pegs" that are placed in it. 
> It makes noise.

I saw a real one of these at the Exploritorium. Or at least I think I did. I remember it had twelve holes 
around in a circle, and you could place pegs in them. Then a bar went around and range a bell. 
So you could then make some music-like noise. This is kinda like one of those.


### Thoughts

A few themes are driving this project:

  * to explore RxJS and _naked functional reactive programming_ (FRP without a framework). I'm evolving the codebase organically, but rework the design as I figure out how to make it more reactive. I am using *cycle.js* as an inspiration, but adding pieces as I run across them to see if I end up at a different place.
  * improve my knowledge of specific technologies: SVG, HTML5 MIDI  sound, in-browser ES6, browser DOM api, CSS animations, Heroku pipelines.
  
### Test Suite

  * `mocha`
  * add peg: verify sound and highlight
  * restore old pegs: verify sound and highlight
  * save pegs
  * restore newly saved pegs: verify sound and highlight
  * scratch

### Source Code Style Guide & Glossary

  * **El**: Suffix added to variables denoting an HTML **element**.
  * **$**: Suffix added to variables denoting a stream. Can be read as "stream."
  * **Iter**: Iterator.
  
  
  
### Colors

TBD 

What would a set of colors be?
tonality sets theme
 * background to wheel
 * arm

Instruments
 * on screen
 * playing
 * growing
