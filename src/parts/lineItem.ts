import vt from '../glsl/line.vert';
import fg from '../glsl/line.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector3 } from 'three/src/math/Vector3';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { MyObject3D } from "../webgl/myObject3D";
import { Func } from '../core/func';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Util } from '../libs/util';
import { Vector2 } from 'three/src/math/Vector2';
import { Tween } from '../core/tween';

export class LineItem extends MyObject3D {

  private _id: number;
  private _isB: boolean = false;
  private _mesh: Mesh;
  private _noise: Vector3 = new Vector3();

  get mesh(): Mesh {
    return this._mesh;
  }

  get noise(): Vector3 {
    return this._noise;
  }

  constructor(opt: {geo: PlaneGeometry, lineId: number, id:number, isB: boolean}) {
    super();

    this._id = opt.lineId;
    this._isB = opt.isB;

    if(this._isB) {
      this._noise = new Vector3(
        0.1,
        1,
        1
      );
    } else {
      this._noise = new Vector3(
        [0.5, 2.5][this._id],
        1,
        1
      );
    }

    this._mesh = new Mesh(
      opt.geo,
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent:true,
        depthTest:false,
        uniforms:{
          color:{value:new Color(this._isB ? 0x000000 : 0xffffff)},
          alpha:{value: this._isB ? 1 : 0.5},
          radius:{value: 0},
          time:{value: opt.id * 2 + opt.id * 10},
        }
      })
    );
    this.add(this._mesh);

    if(!this._isB) {
      this._start(opt.id * 0.01);
    }
  }

  private _start(d:number = 0):void {
    const sw = Func.instance.sw();
    const sh = Func.instance.sh();
    const area = Math.max(sw, sh) * 1;

    const pA = new Vector2(0, area);
    const pB = new Vector2(0, -area);

    if(Util.instance.hit(2)) {
      pA.y *= -1;
      pB.y *= -1;
    }

    const time = 1.5;
    Tween.instance.a(this._mesh.position, {
      y:[pA.y, pA.clone().lerp(pB, 0.5).y],
    }, time, d, Tween.ExpoEaseInOut, null, null, () => {
      Tween.instance.a(this._mesh.position, {
        y:pB.y,
      }, time, 2, Tween.ExpoEaseInOut, null, null, () => {
        this._start();
      })
    });

    // const sc = 0.5;
    // Tween.instance.a(this.position, {
    //   y:[pA.y * sc, pB.y * sc],
    // }, time * 5, d, Tween.EaseNone);
  }

  protected _update():void {
    super._update();

    // const maxSize = Math.max(Func.instance.sw(), Func.instance.sh()) * 1;
    // const sw = maxSize;
    // const sh = maxSize;
    // const hutosa = 0.25;

    // const n = this._noise;

    // val.scale.set((sw / this._mesh.length) * hutosa * n.x, sh, 1);
    // val.position.x = i * (sw / this._mesh.length) - sw * 0.5 + (sw / this._mesh.length) * 0.5;

    // if(this._id == 1) {
    //   val.position.x += val.scale.x * 0.65;
    // }

    // if(this._isB) {
    //   val.position.x += val.scale.x * 0.3;
    // }

    // const uni = this._getUni(val);
    // uni.time.value += this._isB ? 1 : 1;
    // uni.radius.value = this._isB ? maxSize * 0.05 : maxSize * 0.1;
  }
}