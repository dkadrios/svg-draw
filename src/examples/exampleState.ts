import { TDShape, TDShapeType, TLPage } from 'types'

const defaultPageData = {
  id: 'page',
  shapes: {
    rect1: {
      id: 'rect1',
      type: TDShapeType.Rectangle,
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
      type: TDShapeType.Line,
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
    '0ebbf255-ea5d-4018-103f-152ced3e6e5f': {
      id: '0ebbf255-ea5d-4018-103f-152ced3e6e5f',
      type: 'freedraw',
      parentId: 'page',
      childIndex: 3,
      point: [41.9, 226.69],
      rotation: 0,
      styles: {
        color: '#ff2133',
      },
      points: [
        [0, 9.04],
        [0.14, 8.99],
        [0.52, 8.61],
        [1.06, 8.18],
        [2.04, 7.34],
        [2.63, 6.62],
        [3.35, 6.03],
        [3.92, 5.45],
        [4.64, 4.86],
        [5.23, 4.26],
        [7.15, 2.9],
        [8.21, 2.04],
        [8.8, 1.45],
        [9.19, 1.16],
        [9.73, 0.73],
        [9.88, 0.5],
        [10.11, 0.35],
        [10.26, 0.12],
        [10.39, 0.05],
        [10.44, 0],
        [10.5, 2.1316282072803006e-14],
      ],
    },
    text1: {
      id: 'text1',
      type: 'text',
      parentId: 'page',
      childIndex: 4,
      point: [300, 300],
      rotation: 0,
      text: 'hello, world!',
      styles: {
        color: '#ff2133',
      },
    },
    /*
    image1: {
      id: 'image1',
      type: 'image',
      parentId: 'page',
      childIndex: 5,
      point: [0, 0],
      rotation: 0,
      src: 'https://avatars.githubusercontent.com/u/128515?s=400&v=4',
      size: [300, 300],
    }, */
  },
} as TLPage<TDShape>

export default defaultPageData
