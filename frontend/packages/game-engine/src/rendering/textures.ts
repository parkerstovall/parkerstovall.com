export type Sprite = {
  type: 'circle' | 'rectangle'
  color: string
}

export type Image = {
  type: 'image'
  image: CanvasImageSource
}

export type Texture = Image | Sprite
