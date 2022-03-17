import * as THREE from "three";

export type UpdateMethod = (deltaTime: number, totalTime: number) => void;
export type RenderMethod = (renderer: THREE.WebGLRenderer)        => void;

export class BaseApplication {

    /**
     * I'm still not sure if I want it to be public.
     */
    public readonly renderer: THREE.WebGLRenderer;

    private deltaTime: number = 0;
    private lastTime:  number = 0;

    public constructor() {

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("app") as HTMLCanvasElement,
            antialias: true,
        });
        this.renderer.setSize(innerWidth, innerHeight);

    }

    /**
     * Self explanatory.
     */
    public run = () => this.renderer.setAnimationLoop(this.gameLoop);
    
    /**
     * Main application's loop which is handled by and only by BaseApplication.
     * I've put readonly to prevent it from being changed, but it doesn't seem to work.
     * 
     * @param time total session time in milliseconds
     * @param frame i don't know yet what it does
     */
    public readonly gameLoop: THREE.XRAnimationLoopCallback = (time: number, frame?: THREE.XRFrame) => {

        this.deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(this.deltaTime, time);
        this.render(this.renderer);

    }

    /**
     * Updates all logic one time in a frame.
     * Has to be overridden by a derived class.
     */
    protected update: UpdateMethod = () => {}

     /**
      * Draws elements on the viewport.
      * Has to be overridden by a derived class.
      */
    protected render: RenderMethod = () => {}
    
};
