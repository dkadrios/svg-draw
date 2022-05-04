import { vec } from 'utils/vec'

export const fileToBase64 = (file: Blob): Promise<string | null> => (
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
    reader.onabort = error => reject(error)
  })
)

export const getImageSizeFromSrc = (src: string): Promise<number[]> => (
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve([img.width, img.height])
    img.onerror = () => reject(new Error('Could not get image size'))
    img.src = src
  })
)

export const getImagePropsAtPoint = (point: number[], size: number[], src: string) => {
  const [width, height] = size

  return {
    point: vec.toFixed([point[0] - width / 2, point[1] - height / 2]),
    size,
    src,
  }
}
