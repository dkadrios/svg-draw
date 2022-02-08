# SvgDraw

This project in fact is a lightweight version of great [tldraw](https://tldraw.com) application
with stripped down functionality and different choice of UI and state management libraries.

So if you need a full-fleshed svg editor in your browser - TlDraw will do an incredible job for you;
this one is made as a simpler and lighter module which dependencies are more likely to hit the choice of UI and state managements libs in the main app. 

Differences are:
 - MobX and zustand replaced with immer and simple custom stores implementation
 - radix-ui and stitches substituted with material-ui and emotion
 - minimal tools set: shapes, image, text, grid 
 - ~60Kb minified (not including deps)

## Usage
```
const initPicture = {
  id: 'page',
  shapes: {
    rect1: {
      id: 'rect1',
      type: 'rect',
      parentId: 'page',
      childIndex: 1,
      rotation: 0,
      styles: {
        color: '#1c7ed6',
        fill: '#d2e4f4',
      },
      point: [100, 100],
      size: [100, 100],
    },
    line1: {
      id: 'line1',
      type: 'line',
      parentId: 'page',
      childIndex: 2,
      rotation: 0,
      styles: {
        color: '#36b24d',
      },
      point: [300, 100],
      handles: {
        start: {
          id: 'start',
          index: 1,
          point: [0, 0],
        },
        end: {
          id: 'end',
          index: 2,
          point: [50, 50],
        },
      },
    },
  },
}

<SvgDraw data={initPicture} />
```

## License
This project is licensed under MIT.
