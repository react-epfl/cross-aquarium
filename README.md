# cross-aquarium

There is still a lot of dynamic drawing involved (particularly on the seaweed), needs investigation for performances. Also a good cleanup of the code would be nice, right now it is just a mess.

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
