import * as THREE from "three";
import * as Framework from "./framework/BaseApplication";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Ugly, very ugly, move it somewhere else.
const LEFT_ARROW:  string = "ArrowLeft";
const UP_ARROW:    string = "ArrowUp";
const RIGHT_ARROW: string = "ArrowRight";
const DOWN_ARROW:  string = "ArrowDown";

namespace Utility {

    export const createWireframe = (geometry: THREE.BufferGeometry, color: THREE.ColorRepresentation, width: number): THREE.LineSegments => {

        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            new THREE.LineBasicMaterial({
                color:     color,
                linewidth: width,
            }),
        );

        // Make sure to render wireframe on top of the mesh
        wireframe.renderOrder = 1;

        return wireframe;

    }

    export const addWireframe = (object: THREE.Mesh, color: THREE.ColorRepresentation, width: number): void => {

        object.add(createWireframe(object.geometry, color, width));

    }

}

class Application extends Framework.BaseApplication {

    private readonly scene:  THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;

    private readonly plane: THREE.Mesh;

    private readonly player: THREE.Mesh;

    private readonly orbitControls: OrbitControls;

    /**
     * I really don't why it is here, move it somewhere else.
     */
    private updateCamera = (): void => {

        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(innerWidth, innerHeight);

    }

    public constructor() {

        super();

        // Move all those initialization things to seperate methods
        // in order to keep the code clean.

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, (innerWidth / innerHeight), 0.1, 1000);
        this.camera.position.set(0, 10, 0);
        this.camera.lookAt(0, 0, 0);
        this.camera.name = "main-camera";
        this.scene.add(this.camera);

        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10, 10, 10),
            new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide,
            }),
        );
        this.plane.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
        this.plane.name = "main-plane";
        this.scene.add(this.plane);

        // Remove that thing later. Maybe.
        Utility.addWireframe(this.plane, 0x0, 2);

        this.player = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
            }),
        );
        this.player.position.set(0, 0.5, 0);
        this.player.name = "player";
        this.scene.add(this.player);

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enablePan = false;

        //Hey, it's too dangerous here, move out!
        window.addEventListener("resize", this.updateCamera);

        //Very bad solution! Move it to update method in order to make use of deltatime!
        // + you add GLOBAL event listener to the entire document.
        // + it is desynchronised with game's loop (update & render). Too bad!
        //FIXME: Fix that!
        document.addEventListener("keydown", (event: KeyboardEvent) => {

            const playerSpeed = 0.3;

            switch (event.key) {

            case LEFT_ARROW:  this.player.position.x -= playerSpeed; break;
            case RIGHT_ARROW: this.player.position.x += playerSpeed; break;
            case UP_ARROW:    this.player.position.z -= playerSpeed; break;
            case DOWN_ARROW:  this.player.position.z += playerSpeed; break;

            }

        });

    }

    protected update: Framework.UpdateMethod = (deltaTime: number, totalTime: number) => {


    }

    protected render: Framework.RenderMethod = (renderer: THREE.WebGLRenderer) => {

        renderer.render(this.scene, this.camera);

    }

};

export { Application };
