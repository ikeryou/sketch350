import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { MyObject3D } from "../webgl/myObject3D";
import { Func } from '../core/func';
import { LineItem } from './lineItem';

export class Line extends MyObject3D {

  private _id: number;
  private _isB: boolean;
  private item: Array<LineItem> = [];

  constructor(opt: {geo: PlaneGeometry, id: number, isB: boolean}) {
    super();

    this._id = opt.id;
    this._isB = opt.isB;

    const num = 40
    for (let i = 0; i < num; i++) {
      const item = new LineItem({
        geo: opt.geo,
        id: i,
        lineId: this._id,
        isB: this._isB,
      })
      this.add(item);
      this.item.push(item);
    }
  }

  protected _update():void {
    super._update();

    const maxSize = Math.max(Func.instance.sw(), Func.instance.sh()) * 1;
    const sw = maxSize;
    const sh = maxSize;
    const hutosa = 0.25;

    this.item.forEach((val,i) => {
      const n = val.noise;
      const mesh = val.mesh;

      mesh.scale.set((sw / this.item.length) * hutosa * n.x, sh, 1);

      val.position.x = i * (sw / this.item.length) - sw * 0.5 + (sw / this.item.length) * 0.5;

      if(this._id == 1) {
        val.position.x += val.scale.x * 0.65;
      }

      if(this._isB) {
        val.position.x += val.scale.x * 0.3;
      }

      const uni = this._getUni(mesh);
      uni.time.value += this._isB ? 1 : 1;
      uni.radius.value = this._isB ? maxSize * 0.05 : maxSize * 0.1;
    });
  }
}