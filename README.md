# cross-aquarium

The overall performances (with a "regular" aquarium) are quite good, however things get tricky when there are a lot of objects involved (e.g.: the extrem case of MSF space). It might be related to the library (p5.js) I'm using, but switching to full canvas api would require much more time.

### Content
```
p5.js         drawing library

toxiclibs.js  particles/springs utils library
↳ utils.js      pointers to toxiclibs core functions + custom maths functions
```

```
jsonReader.js add/remove item/member/comment functions + changeScore function

flowfield.js  array of random vectors for fishes to look at to add random movement

rock.js       representation of an item and its comments
↳ algae.js      collection of branches (comments)
  ↳ branch.js     representation of a comment
  
gems.js       representation of an alias
  
fish.js       representation of a member

bubble.js     

sketch.js     wrapper where things are initialized, updated and drawn
```
