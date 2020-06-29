var init = function () {
  var stage = new inalan.Stage("bubbleSortCanvas");
  stage.showAllButtons();

  var a = new inalan.VisuArray("a", [0, 0, 0, 0, 0, 0, 0], true);
  a.setMinValue(5);
  a.randomize(30, 150);
  a.x = 80;
  a.y = 220;
  stage.add(a, "a");

  var c = new inalan.VisuCode([
    "FOR i = 6 downto 1",
    "   FOR j = 0 to i-1",
    "      IF a[j] > a[j+1] THEN",
    "         swap a[j] a[j+1]",
  ]);
  c.x = 310;
  c.y = 80;
  stage.add(c, "code"); // in code we can refer to this with id = "code"

  // **********************************************

  // functions (steps of the animation) ...
  // global vars need to be stored in stage.vars object...

  var setI = function () {
    stage.vars.i = 6;
    stage.get("code").selected = [0];
    stage.get("a").setIndex("i", stage.vars.i, 0);
    stage.get("a").setLoopMarker("i", 6, 1);
    return 200;
  };

  var setJ = function () {
    stage.vars.j = 0;
    stage.get("code").selected = [1];
    stage.get("a").setIndex("j", stage.vars.j, 1);
    stage.get("a").setLoopMarker("j", 0, stage.vars.i - 1);
    return 200;
  };

  var compare = function () {
    stage.get("code").selected = [2];
    stage.get("a").setIndex("j+1", stage.vars.j + 1, 1);
    stage.compare(
      stage.get("a")[stage.vars.j],
      stage.get("a")[stage.vars.j + 1]
    );
  };

  var swap = function () {
    if (
      stage.get("a")[stage.vars.j].value >
      stage.get("a")[stage.vars.j + 1].value
    ) {
      stage.get("code").selected = [3];
      for (var k = 0; k <= stage.vars.j + 1; k++) {
        stage.get("a")[k].maxValue = stage.get("a")[stage.vars.j].value;
      }
      stage.swap(
        stage.get("a")[stage.vars.j],
        stage.get("a")[stage.vars.j + 1]
      );
    } else {
      for (var k = 0; k <= stage.vars.j + 1; k++) {
        stage.get("a")[k].maxValue = stage.get("a")[stage.vars.j + 1].value;
      }
      return 0;
    }
  };

  var decI = function () {
    stage.get("a")[stage.vars.i].setGreenColor();
    stage.get("a")[stage.vars.i].changeable = false;
    stage.vars.i--;
    if (checkI()) {
      stage.get("code").selected = [0];
      stage.get("a").setIndex("i", stage.vars.i, 0);
      return 200;
    } else {
      stage.get("a").deleteIndex("i");
      return 0;
    }
  };

  var incJ = function () {
    stage.get("a").deleteIndex("j+1");
    stage.vars.j++;
    if (checkJ()) {
      stage.get("code").selected = [1];
      stage.get("a").setIndex("j", stage.vars.j, 1);
      return 200;
    } else {
      stage.get("a").deleteIndex("j");
      return 0;
    }
  };

  var makeChangeable = function () {
    stage.get("a")[stage.vars.j].changeable = true;
    return 0;
  };

  var checkI = function () {
    return stage.vars.i > 0;
  };

  var checkJ = function () {
    return stage.vars.j < stage.vars.i;
  };

  var finalStep = function () {
    stage.get("a")[0].setGreenColor();
    stage.get("a")[0].changeable = false;
    stage.get("code").selected = [];
  };

  // defining steps in animation...
  stage.setSteps([
    setI,
    [setJ, [compare, swap, makeChangeable, incJ], checkJ, decI],
    checkI,
    finalStep,
  ]);
};