import { CoEntity } from './CoEntity';

export enum CoHandlerStatus {
    "ACTIVE" = "active",
    "PAUSED" = "paused"
}

export enum CoHandlerActiveStatus {
    "ACTIVE" = "active",
    "RESTING" = "resting"
}

export class CoHandlerClass {
    public CoEntities: CoEntity[] = [];
    private status: CoHandlerStatus = CoHandlerStatus.ACTIVE;
    private activeStatus: CoHandlerActiveStatus = CoHandlerActiveStatus.ACTIVE;
    private handler: GameEventHandlerToken;

    constructor() {
        this.handler = world.onTick(() => {
            if (!this.CoEntities.length) this.handler.cancel();
            this.CoEntities.forEach((e: CoEntity) => {
                if (e.parent == null) {
                    let q = [e];
                    while (q[0]) {
                        let u = q.shift();
                        u?.children.forEach((v: CoEntity) => {
                            v.entity.position = u.coord.AbsoluteOffset;
                            v.entity.meshOrientation = u.coord.AbsoluteAngle;
                            q.push(v);
                        });
                    }
                }
            });
        });
    }

    getStatus(): CoHandlerStatus {
        return this.status;
    }

    getActiveStatus(): CoHandlerActiveStatus {
        return this.activeStatus;
    }

    pause(): void {
        this.status = CoHandlerStatus.PAUSED;
        this.handler.cancel();
    }

    resume(): void {
        this.status = CoHandlerStatus.ACTIVE;
        this.activeStatus = CoHandlerActiveStatus.ACTIVE;
        this.handler.resume();
    }
}

export const CoHandler = new CoHandlerClass();