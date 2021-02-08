import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import React from "react";
import earthTexture from '../world2.jpg';
import {isWebGLSupported} from "webgl-detector";
import * as THREE from 'three';

const style = {
    color: '#fff',
};

const Shaders = {
    'earth': {
        uniforms: {
            'texture': { type: 't', value: null }
        },
        vertexShader: [
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            'vNormal = normalize( normalMatrix * normal );',
            'vUv = uv;',
            '}'
        ].join('\n'),
        fragmentShader: [
            'uniform sampler2D texture;',
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
            'vec3 diffuse = texture2D( texture, vUv ).xyz;',
            'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
            'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
            'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
            '}'
        ].join('\n')
    },
    'atmosphere': {
        uniforms: {},
        vertexShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'vNormal = normalize( normalMatrix * normal );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
            'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
            '}'
        ].join('\n')
    }
};

const curZoomSpeed = 0;

let rotation = new THREE.Vector2(),
    target = {x: 4.7, y: 0.6};

let distance = 100000,
    distanceTarget = 100000;

export default class Container extends React.Component {

    constructor(props) {
        super(props);
        this.container = React.createRef()
    }

    componentDidMount() {
        if (isWebGLSupported()) {
            this.sceneSetup();
            this.addObjects();
            this.addData(this.props.coordinate);
            this.createPoints();
            this.handle();
            this.startAnimationLoop();
            this.setTarget([5.219797980385109, 0.55612037755986923], 275);
            // console.log(this.props.coordinate);
            // console.log(this.scene.children);

        } else {
            console.log("WebGL required!")
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.details) {
            if (prevProps.details !== this.props.details) {

                const phi = (90 - this.props.details.latitude) * Math.PI / 180;
                const theta = (180 - this.props.details.longitude) * Math.PI / 180;

                this.lightObject.position.x = 200 * Math.sin(phi) * Math.cos(theta);
                this.lightObject.position.y = 200 * Math.cos(phi);
                this.lightObject.position.z = 200 * Math.sin(phi) * Math.sin(theta);
                console.log("props.details were updated: " + this.scene.children)
            }
        }
        if (this.props.filter) {
            if (prevProps.filter !== this.props.filter) {
                this.scene.children.pop();
                this.addData(this.props.filter);
                this.createPoints();
                // this.startAnimationLoop();
                this.handle();
                // this.setTarget([5.219797980385109, 0.55612037755986923], 275);
            }
        }
    }

    sceneSetup = () => {

        const w = window.offsetWidth || window.innerWidth;
        const h = window.offsetHeight || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(28, w/h, 1, 10000);
        this.camera.position.z = distance;


        // this.vector = new THREE.Vector3();
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(w, h);

        this.renderer.domElement.style.position = 'absolute';

        this.control = new OrbitControls(this.camera, this.renderer.domElement);

        this.control.enableDamping = true;
        this.control.dampingFactor = 0.02;
        // this.control.enabled = true;
        this.control.target.x += (3000 - this.control.target.x)*0.05;
        this.control.enableZoom = true;

        this.container.appendChild(this.renderer.domElement);
    }

    addObjects = () => {
        // earth

        let geometry = new THREE.SphereGeometry(200, 40, 30);

        let shader = Shaders['earth'];
        let uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms['texture'].value = new THREE.TextureLoader().load(earthTexture);

        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        let standardMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0.1 } )

        this.mesh = new THREE.Mesh(geometry, standardMaterial);
        this.mesh.rotation.y = Math.PI;
        this.scene.add(this.mesh); // add earth object

        // atmosphere

        shader = Shaders['atmosphere'];
        uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.scale.set(1.1, 1.1, 1.1);
        this.scene.add(this.mesh);

        // elements geometry


        geometry = new THREE.BoxGeometry(0.08, 0.08, 1);
        // geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
        //
        this.point = new THREE.Mesh(geometry);

        // highLight object

        this.lightObject = new THREE.PointLight(0xeb3434, 1, 10, 5);
        // const lightGeo = new THREE.BoxGeometry(1, 1, 1);
        // this.lightObject.add(lightGeo, new THREE.MeshBasicMaterial({color: 0xeb3434}));



        this.scene.add(this.lightObject);
    }

    startAnimationLoop = () => {
        this.zoom(curZoomSpeed);

        rotation.x += (target.x - rotation.x) * 0.08;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (distanceTarget - distance) * 0.15;

        this.camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        this.camera.position.y = distance * Math.sin(rotation.y);
        this.camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

        this.control.update();
        // this.camera.lookAt(this.mesh.position);
        // this.camera.lookAt.x += (3000 - this.camera.lookAt.x) * 0.005;
        // vector.copy(camera.position);
        window.requestAnimationFrame(this.startAnimationLoop);
        this.renderer.render(this.scene, this.camera);

    }

    // data manipulation

    addLight = data => {
    }


    addData = data => {
        let lat, lng, size, color, i, colorFnWrapper, step;

        // set Color
        let colorFn = x => {
            let c = new THREE.Color();
            let ton = y => {
                if (y >= 10) {
                    y = 10;
                }
                return ((1 / y * 0.08));
            };
            c.setHSL(ton(x), 0.8, 0.35);
            return c;
        }


        colorFnWrapper = (data, i) => {return colorFn(data[i].deaths_num)};

        // if (this._baseGeometry === undefined) {
        //     this._bassGeometry = new THREE.Geometry();
        //     for (i = 0; i < data.length; i += step) {
        //         lat = data[i];
        //         lng = data[i + 1];
        //         size = data[i + 2];
        //         color = colorFnWrapper(data, i);
        //         size = 0;
        //         this.addPoint(lat, lng, size, color, this._bassGeometry);
        //     }
        // }

        // if (this._morphTargetId === undefined) {
        //     this._morphTargetId = 0;
        // } else {
        //     this._morphTargetId += 1;
        // }
        //
        // let morphName = 'morphTarget' + this._morphTargetId;

        let subgeo = new THREE.Geometry();
        for (i = 0; i < data.length; i+= 1) {
            lat = data[i].latitude;
            lng = data[i].longitude;
            color = colorFnWrapper(data, i);
            size = data[i].deaths_num;
            size = size * 0.01;
            step = i * 24;
            this.addPoint(lat, lng, size, color, step, subgeo);
        }

        // this.rawGeometry.setAttribute('position', new THREE.InstancedBufferAttribute(new Float32Array(pointVertices), 3));
        // this.rawGeometry.setAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array(pointColors), 3));
        // this.rawGeometry.setAttribute('normal', new THREE.InstancedBufferAttribute(new Float32Array(pointNormals), 3));

        // this._bassGeometry.morphTargets.push({'name': morphName, vertices: subgeo.vertices });
        this._bassGeometry = subgeo;
    }

    createPoints = () => {
        /* if (this._bassGeometry.morphTargets.length < 8) {
            console.log('t l', this._bassGeometry.morphTargets.length);
            let padding = 8 - this._bassGeometry.morphTargets.length;
            console.log('padding', padding);
            for (let i = 0; i <= padding; i++) {
                console.log('padding', i);
                this._bassGeometry.morphTargets.push({'name': 'morphPadding' + i, vertices: this._bassGeometry.vertices});
            }
        }
        this.points = new THREE.Mesh(this._bassGeometry, new THREE.MeshBasicMaterial(
            {
                color: 0xffffff,
                vertexColors: THREE.FaceColors,
                morphTargets: true
            }
        )); */

        this.points = new THREE.Mesh(this._bassGeometry, new THREE.MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors,
            morphTargets: false
        }));

        this.scene.add(this.points);

    }

    addPoint = (lat, lng, size, color, step, baseGeo) => {

        const phi = (90 - lat) * Math.PI / 180;
        const theta = (180 - lng) * Math.PI / 180;

        this.point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        this.point.position.y = 200 * Math.cos(phi);
        this.point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

        this.point.lookAt(this.mesh.position);

        this.point.scale.z = Math.max(size, 0.1); // avoid non-invertible matrix
        this.point.updateMatrix();

        for (let i = 0; i < this.point.geometry.faces.length; i++) {

            this.point.geometry.faces[i].color = color;

        }
        if (this.point.matrixAutoUpdate) {
            this.point.updateMatrix();
        }

        baseGeo.merge(this.point.geometry, this.point.matrix);

    }

    //

    // onDocumentMouseMove = e => {
    //     e.preventDefault();
    //
    //     this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    //     this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    //
    // }



    // EventListener

    handle = () => {
        window.addEventListener('resize', this.onWindowResize, false);
        // document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    }
    //
    // onMouseDown = (e) => {
    //     e.preventDefault();
    //
    //     this.el.addEventListener('mousemove', this.onMouseMove, false);
    //     this.el.addEventListener('mouseup', this.onMouseUp, false);
    //     this.el.addEventListener('mouseout', this.onMouseOut, false);
    //
    //     mouseOnDown.x = e.clientX;
    //     mouseOnDown.y = e.clientY;
    //
    //     targetOnDown.x = target.x;
    //     targetOnDown.y = target.y;
    //
    //     this.el.style.cursor = 'move';
    // }
    //
    // onMouseMove = (e) => {
    //     mouse.x = e.clientX;
    //     mouse.y = e.clientY;
    //
    //     let zoomDamp = distance/1000;
    //
    //     target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    //     target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;
    //
    //     target.y = target.y > PI_HALF ? PI_HALF : target.y;
    //     target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
    //
    // }
    //
    // onMouseUp = () => {
    //     this.el.removeEventListener('mousemove', this.onMouseMove, false);
    //     this.el.removeEventListener('mouseup', this.onMouseUp, false);
    //     this.el.removeEventListener('mouseout', this.onMouseOut, false);
    //     this.el.style.cursor = 'auto';
    // }
    //
    // onMouseOut = () => {
    //     this.el.removeEventListener('mousemove', this.onMouseMove, false);
    //     this.el.removeEventListener('mouseup', this.onMouseUp, false);
    //     this.el.removeEventListener('mouseout', this.onMouseOut, false);
    // }
    //
    // onMouseWheel = (e) => {
    //     e.preventDefault();
    //     if (overRenderer) {
    //         this.zoom(e.wheelDeltaY * 0.3);
    //     } return false;
    // }
    //
    // onDocumentKeyDown = (e) => {
    //     switch (e.keyCode) {
    //         case 38:
    //             this.zoom(100);
    //             e.preventDefault();
    //             break;
    //         case 40:
    //             this.zoom(-100);
    //             e.preventDefault();
    //             break;
    //     }
    // }
    //
    onWindowResize = () => {
        this.camera.aspect = window.offsetWidth / window.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.offsetWidth, window.offsetHeight);
    }

    zoom = delta => {
        distanceTarget -= delta;
        distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
        distanceTarget = distanceTarget < 200 ? 200 : distanceTarget;
    }

    setTarget = (geo, distance) => {
        target.x = geo[0];
        target.y = geo[1];
        distanceTarget = distance;
    }

    render() {
        return <React.Fragment>
            <div style={style} ref={ref => this.container = ref} />
        </React.Fragment>
    }
}
