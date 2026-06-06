import { Item } from './item'

export abstract class ActionItem extends Item {
  abstract onCollect(): void
}
