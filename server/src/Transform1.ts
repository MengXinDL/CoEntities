function toDirectionVector(thiss: GameVector3): GameVector3 {
    const { x: PItch, y: yaw, z: roll } = thiss;
    const cx = Math.cos(PItch);
    const sx = Math.sin(PItch);
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cz = Math.cos(roll);
    const sz = Math.sin(roll);

    const x = cy * cz;
    const y = sx * sy * cz - cx * sz;
    const z = cx * sy * cz + sx * sz;

    return new GameVector3(x, y, z);
}

function toEulerAngles(thiss: GameQuaternion): GameVector3 {
    const qw = thiss.w;
    const qx = thiss.x;
    const qy = thiss.y;
    const qz = thiss.z;

    const sin_rcos_p = 2 * (qx * qw + qy * qz);
    const cos_rcos_p = 1 - 2 * (qx * qx + qy * qy);
    let roll = Math.atan2(sin_rcos_p, cos_rcos_p);
    const sinp = 2 * (qw * qy - qx * qz);
    let PItch;
    if(Math.abs(sinp) >= 1){
        PItch = Math.sign(sinp) * Math.PI;
    }else{
        PItch = Math.asin(sinp) as number;
    }
    let siny_cosp = 2 * (qw * qz + qx * qy);
    let cosy_cosp = 1 - 2 * (qy * qy + qz * qz);
    let yaw = Math.atan2(siny_cosp, cosy_cosp);
    return new GameVector3( yaw, PItch, roll );
}
export class Coord {
    #parent?: Coord;
    #rotateVec: GameVector3 = new GameVector3(0, 0, 0); 
    #offset: GameVector3 = new GameVector3(0, 0, 0);
    #AbsoluteRotateVec: GameVector3 = new GameVector3(0, 0, 0);
    #AbsoluteOffset: GameVector3 = new GameVector3(0, 0, 0);
    name: string = "#Coord";
    constructor(angle: GameVector3, offset: GameVector3, name?: string) {
        this.#rotateVec = angle.clone();
        this.#AbsoluteRotateVec = angle.clone();
        this.#AbsoluteOffset.copy(offset); 
        this.#offset.copy(offset);
        this.name = name??"A Coord";
        this.setAbsolute()
    }
    get angle(): GameQuaternion {
        return GameQuaternion.fromEuler(this.#rotateVec.x / Math.PI * 180, this.#rotateVec.y / Math.PI * 180, this.#rotateVec.z / Math.PI * 180);
    }
    set angle(a: GameQuaternion) {
        this.#rotateVec = toEulerAngles(a); 
        this.setAbsolute();
    }
    get parent(): Coord | undefined {
        return this.#parent;
    }
    set parent(a: Coord | undefined) {
        this.#parent = a;
        this.setAbsolute();
    }
    get offset(): GameVector3 {
        return this.#offset;
    }
    set offset(a: GameVector3) {
        this.#offset = a;
        this.setAbsolute();
    }
    get AbsoluteAngle(): GameQuaternion {
        return GameQuaternion.fromEuler(this.#AbsoluteRotateVec.x  / Math.PI * 180, this.#AbsoluteRotateVec.y / Math.PI * 180, this.#AbsoluteRotateVec.z / Math.PI * 180);
    }
    get AbsoluteOffset(): GameVector3 {
        return this.#AbsoluteOffset;
    }
    setAbsolute() {
        if(this.#parent){
            let parent = this.#parent;
            this.#AbsoluteRotateVec.x = parent.#AbsoluteRotateVec.x + this.#rotateVec.x;
            this.#AbsoluteRotateVec.y = parent.#AbsoluteRotateVec.y + this.#rotateVec.y;
            this.#AbsoluteRotateVec.z = parent.#AbsoluteRotateVec.z + this.#rotateVec.z;
            let a = toDirectionVector(parent.#AbsoluteRotateVec);
            let b = toDirectionVector(parent.#AbsoluteRotateVec.add(new GameVector3(0, 0, -Math.PI/2)));
            let c = toDirectionVector(parent.#AbsoluteRotateVec.add(new GameVector3(0, Math.PI/2, 0)));
            this.#AbsoluteOffset.x = parent.#AbsoluteOffset.x + a.scale(this.#offset.x).x + b.scale(this.#offset.y).x + c.scale(this.#offset.z).x;
            this.#AbsoluteOffset.y = parent.#AbsoluteOffset.y + a.scale(this.#offset.x).y + b.scale(this.#offset.y).y + c.scale(this.#offset.z).y;
            this.#AbsoluteOffset.z = parent.#AbsoluteOffset.z + a.scale(this.#offset.x).z + b.scale(this.#offset.y).z + c.scale(this.#offset.z).z;
        }else{
            this.#AbsoluteRotateVec = this.#rotateVec;
            this.#AbsoluteOffset = this.#offset;
        }
    } 
}