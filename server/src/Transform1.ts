import Rich from "@dao3fun/arena-rich";
import * as math from "mathjs";
// console.clear();

let origin: GameVector3 = new GameVector3(0, 0, 0);
function toDirectionVector(thisss: GameQuaternion): math.MathArray<math.MathNumericType> {
    let thiss = toEulerAngles(thisss);
    // 构建绕X轴的旋转矩阵
    const Rx: math.Matrix<math.MathNumericType> = math.matrix([
        [1, 0, 0],
        [0, math.cos(thiss.x) as number, -math.sin(thiss.x) as number],
        [0, math.sin(thiss.x) as number, math.cos(thiss.x) as number]
    ]);

    // 构建绕Y轴的旋转矩阵
    const Ry: math.Matrix<math.MathNumericType> = math.matrix([
        [math.cos(thiss.y), 0, math.sin(thiss.y)],
        [0, 1, 0],
        [-math.sin(thiss.y), 0, math.cos(thiss.y)]
    ]);

    // 构建绕Z轴的旋转矩阵
    const Rz: math.Matrix<math.MathNumericType> = math.matrix([
        [math.cos(thiss.z), -math.sin(thiss.z), 0],
        [math.sin(thiss.z), math.cos(thiss.z), 0],
        [0, 0, 1]
    ]);

    // 组合旋转矩阵（注意顺序：先绕Z轴，再绕Y轴，最后绕X轴）
    const R = math.multiply(math.multiply(Rz, Ry), Rx);

    // 初始单位向量（前向量）
    const forward = math.matrix([0, 0, 1]);

    // 应用旋转矩阵
    const rotatedVector = math.multiply(R, forward);
    //  Rich.print(rotatedVector.toArray());
    // 返回归一化后的方向向量（mathjs的矩阵已经是列向量，所以直接返回）
    return rotatedVector.toArray();
}
function toEulerAngles(thiss: GameQuaternion): GameVector3 {
    const qw = thiss.w;
    const qx = thiss.x;
    const qy = thiss.y;
    const qz = thiss.z;

    let yaw = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
    let pitch = Math.asin(2 * (qw * qy - qz * qx));
    let roll = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz));

    return new GameVector3( yaw, pitch, roll );
}
export class Coord { // 2d, 先别用
    #parent?: Coord;
    #rotateVec: GameVector3; // 欧拉角
    #offset: GameVector3;
    #AbsoluteRotateVec: GameVector3;
    #AbsoluteOffset: GameVector3;
    constructor(angle: GameVector3, offset: GameVector3) {
        this.#rotateVec = this.#AbsoluteRotateVec = angle, 
        this.#offset = this.#AbsoluteOffset = offset;
        this.angle = this.angle;
        this.offset = this.offset;

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
            this.#AbsoluteRotateVec = parent.#AbsoluteRotateVec.add(
                                        this.#rotateVec);
            let quat = GameQuaternion.fromEuler(parent.#AbsoluteRotateVec.x / Math.PI * 180, parent.#AbsoluteRotateVec.y / Math.PI * 180, parent.#AbsoluteRotateVec.z / Math.PI * 180);
            // quat.rotateX(Math.PI)  
            Rich.print(quat, toDirectionVector(quat));
            this.#AbsoluteOffset.x = parent.#AbsoluteOffset.x + (toDirectionVector(quat)[0] as number) * this.#offset.x + (toDirectionVector(quat)[1] as number) * this.#offset.x + (toDirectionVector(quat)[2] as number) * this.#offset.x;
            this.#AbsoluteOffset.y = parent.#AbsoluteOffset.y + (toDirectionVector(quat)[0] as number) * this.#offset.y + (toDirectionVector(quat)[1] as number) * this.#offset.y + (toDirectionVector(quat)[2] as number) * this.#offset.y;
            this.#AbsoluteOffset.z = parent.#AbsoluteOffset.z + (toDirectionVector(quat)[0] as number) * this.#offset.z + (toDirectionVector(quat)[1] as number) * this.#offset.z + (toDirectionVector(quat)[2] as number) * this.#offset.z;
             
        }else{
            this.#AbsoluteRotateVec = this.#rotateVec;
            this.#AbsoluteOffset = this.#offset;
        }
    } 
}
console.clear()
let parent = new Coord(new GameVector3(0, 0, 0), new GameVector3(0, 0, 0));
let coord1 = new Coord(new GameVector3(0, 0, math.pi / 2), new GameVector3(0, 1, 0));
let coord2 = new Coord(new GameVector3(0, 0, 0), new GameVector3(0, 0, 2));
coord1.parent = parent;
coord2.parent = coord1;
Rich.print(coord1.AbsoluteAngle, coord1.AbsoluteOffset, coord1.angle) 
Rich.print(coord2.AbsoluteAngle, coord2.AbsoluteOffset) 
// toDirectionVector(new GameVector3(0, math.pi, 0));  