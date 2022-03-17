import * as THREE from "three";
import * as Framework from "./framework/BaseApplication";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    private readonly cubeMesh: THREE.Mesh;

    private readonly ambientLight: THREE.AmbientLight;
    private readonly pointLight:   THREE.PointLight;

    private readonly pointLightHelper: THREE.PointLightHelper;

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

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.GridHelper(10, 10));

        this.camera = new THREE.PerspectiveCamera(75, (innerWidth / innerHeight), 0.1, 1000);
        this.camera.position.set(0, 1, 4);
        this.camera.lookAt(0, 1, 0);
        this.scene.add(this.camera);

        { // cubes setup
            this.cubeMesh = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 1.0, 1.0),
                new THREE.MeshPhongMaterial({
                    color:    new THREE.Color(1.0, 1.0, 0.0),
                    specular: new THREE.Color(0.1, 0.1, 0.1),
                }),
            );
            this.cubeMesh.position.set(0, 1, 0);
            this.scene.add(this.cubeMesh);

            Utility.addWireframe(this.cubeMesh, 0x0, 4);

            const smallerCube = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.5, 0.5),
                new THREE.MeshPhongMaterial({
                    color: new THREE.Color(1.0, 0.0, 0.0),
                }),
            );

            smallerCube.position.set(0.5, 0.5, 0.5);
            Utility.addWireframe(smallerCube, 0x0, 4);
            this.cubeMesh.add(smallerCube);
        }

        { // lighting setup
            this.ambientLight = new THREE.AmbientLight(new THREE.Color(1.0, 1.0, 1.0), 0.8);
            this.scene.add(this.ambientLight);

            this.pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 2.0);
            this.pointLight.position.set(0, 1, 4);
            this.scene.add(this.pointLight);

            this.pointLightHelper = new THREE.PointLightHelper(this.pointLight);
            this.scene.add(this.pointLightHelper);
        }

        { // orbit controls setup
            this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
            this.orbitControls.target.y = 1;
            this.orbitControls.update();

            this.orbitControls.enablePan  = false;
            this.orbitControls.enableZoom = true;
        }

        //Hey, it's too dangerous here, move out!
        window.addEventListener("resize", this.updateCamera);

    }

    protected update: Framework.UpdateMethod = (deltaTime: number, totalTime: number) => {

        this.pointLight.position.x = 3 * Math.sin(totalTime / 1000);
        this.pointLight.position.z = 3 * Math.cos(totalTime / 1000);

        this.cubeMesh.rotation.x += deltaTime;
        this.cubeMesh.rotation.z += deltaTime;

    }

    protected render: Framework.RenderMethod = (renderer: THREE.WebGLRenderer) => {

        renderer.render(this.scene, this.camera);

    }

};

export { Application };
