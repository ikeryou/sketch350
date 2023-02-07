import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
// import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { Capture } from '../webgl/capture';
import { Line } from './line';
import { Dest2 } from './dest2';
import { Util } from '../libs/util';
// import { MousePointer } from '../core/mousePointer';
import { Dest3 } from './dest3';

export class Visual extends Canvas {

  private _con:Object3D;
  private _destCap: Capture;
  private _dest: Dest2;
  private _destB: Dest3;
  private _lineCap: Array<Capture> = [];

  constructor(opt: any) {
    super(opt);

    this._destCap = new Capture();

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const geo = new PlaneGeometry(1, 1, 8, 64);

    for(let i = 0; i < 2; i++) {
      const cap = new Capture();
      this._lineCap.push(cap);

      const line = new Line({
        geo: geo,
        id: i,
        isB :false,
      });
      cap.add(line);
      line.rotation.z = Util.instance.radian(-45);
    }

    this._dest = new Dest2({
      texA: this._lineCap[0].texture(),
      texB: this._lineCap[1].texture(),
    });
    this._con.add(this._dest);

    // 黒いやつ
    for(let i = 0; i < 2; i++) {
      const cap = new Capture();
      this._lineCap.push(cap);

      const line = new Line({
        geo: geo,
        id: i,
        isB: true,
      });
      cap.add(line);
      line.rotation.z = Util.instance.radian(-45);
    }
    this._destB = new Dest3({
      texA: this._lineCap[2].texture(),
      texB: this._lineCap[3].texture(),
    });
    this._con.add(this._destB)

    this._resize();
  }


  protected _update(): void {
    super._update();

    this._con.position.y = Func.instance.screenOffsetY() * -1;

    // const mx = MousePointer.instance.easeNormal.x;
    // const my = MousePointer.instance.easeNormal.y;

    // this._con.rotation.x = Util.instance.radian(my * 30 * 1);
    // this._con.rotation.y = Util.instance.radian(mx * 30 * 1);

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 0);
    this._lineCap.forEach((val,i) => {
      if(i >= 2) {
        if(Update.instance.cnt % 3 == 0) val.render(this.renderer, this.cameraPers);
      } else {
        val.render(this.renderer, this.cameraPers);
      }
    });

    this._destCap.render(this.renderer, this.cameraPers);

    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraPers);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 60;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this._lineCap.forEach((val) => {
      val.setSize(w, h, pixelRatio);
    });

    this._destCap.setSize(w, h, pixelRatio);
    this._dest.scale.set(w, h, 1);
    this._destB.scale.set(w, h, 1);

    // this._con.children.forEach((val) => {
    //   val.scale.set(w, h, 1);
    // });

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
