
    var init = function () {

        var stage = new inalan.Stage("insertionSortCanvas");
        stage.showAllButtons();

        var a = new inalan.VisuArray("a", [0, 0, 0, 0, 0, 0, 0], true);
        a.setMinValue(5);
        a.randomize(30, 150);
        a.x = 65;
        a.y = 220;
        stage.add(a, "a");

        var c = new inalan.VisuCode(["FOR i = 1 to 6",
                                     "   j = i-1",
                                     "   WHILE (j >= 0) and (a[j] > a[j+1])",
                                     "      swap a[j] a[j+1]",
                                     "      j = j-1"]);
        c.x = 270;
        c.y = 80;
        stage.add(c, "code"); // in code we can refer to this with id = "code"

        // **********************************************

        // functions (steps of the animation) ...
        // global vars need to be stored in stage.vars object...

        var setI = function () {
            stage.vars.i = 1;
            stage.get("code").selected = [0];
            stage.get("a").setIndex("i", stage.vars.i, 0);
            stage.get("a").setLoopMarker("i", 1, 6);
            stage.get("a")[0].setGreenColor();
            stage.get("a")[0].changeable = false;
            return 200;
        }

        var setJ = function () {
            stage.vars.j = stage.vars.i - 1;            
            stage.get("code").selected = [1];
            stage.get("a").setIndex("j", stage.vars.j, 1);
            stage.get("a").setLoopMarker("j", stage.vars.j, stage.vars.j, true);
            return 200;
        }

        var compare = function () {
            stage.get("code").selected = [2];
            stage.get("a").setIndex("j+1", stage.vars.j + 1, 1);                        
            stage.compare(stage.get("a")[stage.vars.j], stage.get("a")[stage.vars.j+1]);
        }

        var swap = function () {
            if (stage.get("a")[stage.vars.j].value > stage.get("a")[stage.vars.j+1].value) {
                stage.get("code").selected = [3];
                stage.get("a")[stage.vars.j+1].maxValue = stage.get("a")[stage.vars.j].value;
                stage.vars.swap = true;
                stage.swap(stage.get("a")[stage.vars.j], stage.get("a")[stage.vars.j+1]);
            } else {
                stage.vars.swap = false;
                return 0;
            }
        }

        var incI = function () {
            stage.get("a")[stage.vars.j + 1].setGreenColor();
            stage.vars.i++;
            stage.get("a").deleteIndex("j");
            stage.get("a").deleteIndex("j+1");
            if (checkI()) {
                stage.get("code").selected = [0];
                stage.get("a").setIndex("i", stage.vars.i, 0);
                return 200;
            } else {
                stage.get("a").deleteIndex("i");                
                return 0;
            }
        }

        var decJ = function () {            
            if (stage.vars.swap) {                
                stage.vars.j--;
                if (stage.vars.j<0) {
                    stage.get("a")[0].setGreenColor();
                } else {
                    stage.get("a")[stage.vars.j+1].changeable = true;
                }
                stage.get("code").selected = [4];
                stage.get("a").setIndex("j", stage.vars.j, 1);                
                if (stage.vars.j >= 0) {
                    stage.get("a").setLoopMarker("j", stage.vars.i - 1, stage.vars.j);
                }
                stage.get("a").deleteIndex("j+1");
                return 200;
            } else {
                return 0;
            }
        }

        var checkI = function () {
            return stage.vars.i <= 6;
        }

        var checkJ = function () {
            return stage.vars.j>=0 && stage.vars.swap;
        }

        var finalStep = function () {            
            stage.get("code").selected = [];
        }

        // defining steps in animation...
        stage.setSteps([
            setI,
            [
                setJ,
                [
                    compare,
                    swap,
                    decJ
                ], checkJ,
                incI
            ], checkI,
            finalStep
        ]);

    }