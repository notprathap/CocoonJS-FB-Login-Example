/**
     * @license
     *
     * The MIT License
     * Copyright (c) 2010-2011 Ibon Tolosana, Hyperandroid || http://labs.hyperandroid.com/

     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:

     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.

     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     *
     */

    (function() {
        /**
         * Startup it all up when the document is ready.
         * Change for your favorite frameworks initialization code.
         */
        window.addEventListener('load',load,false);

        function load() {
            CAAT.ModuleManager.
                    baseURL("CAAT/src/").
                    setModulePath("CAAT.Core",              "Core").
                    setModulePath("CAAT.Math",              "Math").
                    setModulePath("CAAT.Behavior",          "Behavior").
                    setModulePath("CAAT.Foundation",        "Foundation").
                    setModulePath("CAAT.Event",             "Event").
                    setModulePath("CAAT.PathUtil",          "PathUtil").
                    setModulePath("CAAT.Module",            "Modules").
                    setModulePath("CAAT.Module.Preloader",  "Modules/Image/Preloader").
                    setModulePath("CAAT.WebGL",             "WebGL").

                // get modules, and solve their dependencies.
                    bring(
                    [
                        "CAAT.PathUtil.Path",
                        "CAAT.PathUtil.LinearPath",
                        "CAAT.Foundation.SpriteImage",
                        "CAAT.Foundation.Director",
                        "CAAT.Foundation.Actor",
                        "CAAT.Foundation.ActorContainer",
                        "CAAT.Behavior.PathBehavior",
                        "CAAT.Behavior.Interpolator",
                        "CAAT.Module.Preloader.Preloader"
                    ]).

                // this function will be firer every time all dependencies have been solved.
                // if you call again bring, this function could be fired again.
                    onReady(function () {
                        // simply load js files. call start when all of them have been loaded.
                        // load won't start until all 'bring' dependencies have been solved.

                        new CAAT.Module.Preloader.Preloader().
                                addElement("fish",  "http://labs.hyperandroid.com/static/CAAT-Samples/demos/demo-resources/img/anim1.png").
                                addElement("fish2", "http://labs.hyperandroid.com/static/CAAT-Samples/demos/demo-resources/img/anim2.png").
                                addElement("fish3", "http://labs.hyperandroid.com/static/CAAT-Samples/demos/demo-resources/img/anim3.png").
                                addElement("fish4", "http://labs.hyperandroid.com/static/CAAT-Samples/demos/demo-resources/img/anim4.png").
                                load( function onAllAssetsLoaded(images) {
                                    sprites(images);
                                } );

                    });
        }

        function sprites(images) {
            CAAT.DEBUG= 1;
            var director= new CAAT.Foundation.Director().initialize( 800,500,'experiment-canvas' );
            director.setImagesCache(images);
            var scene= director.createScene();
            // when the scene is activated, avoid the director clearing the viewport since it'll be
            // totally erased by the background.
            scene.activated= function() {
                director.setClear(false);
            }

            var imageIndex=0;
            var conpoundimagefish = [];
            conpoundimagefish.push(
                    new CAAT.Foundation.SpriteImage().initialize(
                            director.getImage('fish'),  1, 3) );
            conpoundimagefish.push(
                    new CAAT.Foundation.SpriteImage().initialize(
                            director.getImage('fish2'), 1, 3) );
            conpoundimagefish.push(
                    new CAAT.Foundation.SpriteImage().initialize(
                            director.getImage('fish3'), 1, 3) );
            conpoundimagefish.push(
                    new CAAT.Foundation.SpriteImage().initialize(
                            director.getImage('fish4'), 1, 3) );

            function addFish(x,y) {

                var scale= Math.random() + .5;

                var fish = new CAAT.Foundation.Actor().
                        setBackgroundImage(
                                conpoundimagefish[(imageIndex++)%conpoundimagefish.length],
                                true).
                        setLocation( x,y ).
                        setScale( scale,scale ).
                        setAnimationImageIndex( [0,1,2,1] ).
                        setChangeFPS(300).
                        enableEvents(false);

                scene.addChild(fish);

                var pbfish= new CAAT.Behavior.PathBehavior().
                        setAutoRotate(true, CAAT.Behavior.PathBehavior.autorotate.LEFT_TO_RIGHT).
                        setPath(
                            new CAAT.PathUtil.Path().setLinear( x,y, x,y ) ).
                        setInterpolator(
                            new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(2,false) ).
                        setFrameTime( scene.time, 10 ).
                        addListener( {
                            behaviorExpired : function(behaviour,time) {
                                var endCoord= behaviour.path.endCurvePosition();
                                behaviour.setPath(
                                        new CAAT.PathUtil.Path().setCubic(
                                            endCoord.x,
                                            endCoord.y,
                                            Math.random()*director.width,
                                            Math.random()*director.height,
                                            Math.random()*director.width,
                                            Math.random()*director.height,
                                            Math.random()*director.width,
                                            Math.random()*director.height) );
                                behaviour.setFrameTime( scene.time, 3000+Math.random()*3000 );
                            }
                        });

                fish.addBehavior( pbfish );
            }

            var gradient= director.ctx.createLinearGradient(0,0,director.width,director.height);
            gradient.addColorStop(0,'#FFFFFF');
            gradient.addColorStop(1,'#FFFFFF');

            var gr= new CAAT.Foundation.ActorContainer().
                    setBounds(0,0,director.width,director.height).
                    setFillStyle(gradient).
                    enableEvents(false).
                    cacheAsBitmap();

            scene.addChild(gr);

            gr.enableEvents(true);
            gr.mouseDown= function(ev) {
                addFish(ev.point.x,ev.point.y);
            };

            addFish(100,100);

            CAAT.loop(60);
        }


    })();