const SCENE_PADDING = 24;

function createCubeScene() {
  return {
    id: "cube",
    title: "正方体",
    subtitle: "立体图形与其平面展开图。",
    mode: "original",
    modes: [
      {
        key: "original",
        label: "立体",
        bounds: { minX: -110, minY: -110, maxX: 110, maxY: 110 },
        commands: [
          {
            type: "polygon",
            points: [
              [-60, -30],
              [60, -30],
              [60, 70],
              [-60, 70],
            ],
            stroke: "#273043",
            fill: "rgba(76, 132, 255, 0.14)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [60, -30],
              [100, 0],
              [100, 100],
              [60, 70],
            ],
            stroke: "#273043",
            fill: "rgba(122, 211, 164, 0.14)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [-60, -30],
              [60, -30],
              [100, 0],
              [40, 0],
            ],
            stroke: "#273043",
            fill: "rgba(255, 185, 94, 0.14)",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [-60, 70],
            to: [40, 0],
            stroke: "#8aa0d3",
            lineWidth: 1.2,
            dash: [5, 4],
          },
          {
            type: "textBlock",
            at: [0, 85],
            text: "正方体：三面可见的斜二测投影",
            color: "#5d6577",
          },
        ],
      },
      {
        key: "net",
        label: "展开图",
        bounds: { minX: -140, minY: -140, maxX: 140, maxY: 140 },
        commands: [
          {
            type: "polygon",
            points: [
              [-60, -60],
              [0, -60],
              [0, 0],
              [-60, 0],
            ],
            stroke: "#273043",
            fill: "rgba(76, 132, 255, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [0, -60],
              [60, -60],
              [60, 0],
              [0, 0],
            ],
            stroke: "#273043",
            fill: "rgba(122, 211, 164, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [0, 0],
              [60, 0],
              [60, 60],
              [0, 60],
            ],
            stroke: "#273043",
            fill: "rgba(255, 185, 94, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [-60, 0],
              [0, 0],
              [0, 60],
              [-60, 60],
            ],
            stroke: "#273043",
            fill: "rgba(255, 124, 124, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [0, 60],
              [60, 60],
              [60, 120],
              [0, 120],
            ],
            stroke: "#273043",
            fill: "rgba(211, 145, 255, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "polygon",
            points: [
              [0, -120],
              [60, -120],
              [60, -60],
              [0, -60],
            ],
            stroke: "#273043",
            fill: "rgba(138, 211, 211, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "textBlock",
            at: [0, -130],
            text: "展开图：六个正方形面的平面展开",
            color: "#5d6577",
          },
        ],
      },
    ],
  };
}

function createConeScene() {
  return {
    id: "cone",
    title: "圆锥",
    subtitle: "支持原图与展开图切换。",
    mode: "original",
    modes: [
      {
        key: "original",
        label: "原图",
        bounds: { minX: -150, minY: -120, maxX: 150, maxY: 130 },
        commands: [
          {
            type: "line",
            from: [-96, 52],
            to: [0, 110],
            stroke: "#273043",
            lineWidth: 3,
          },
          {
            type: "line",
            from: [96, 52],
            to: [0, 110],
            stroke: "#273043",
            lineWidth: 3,
          },
          {
            type: "arc",
            center: [0, 52],
            radius: 96,
            startAngle: Math.PI,
            endAngle: 0,
            anticlockwise: false,
            stroke: "#273043",
            lineWidth: 3,
          },
          {
            type: "ellipse",
            center: [0, 52],
            radiusX: 96,
            radiusY: 25,
            stroke: "#8aa0d3",
            fill: "rgba(138, 160, 211, 0.18)",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [0, 110],
            to: [0, 52],
            stroke: "#8aa0d3",
            lineWidth: 1.5,
            dash: [7, 6],
          },
          {
            type: "label",
            at: [8, 124],
            text: "顶点",
            color: "#273043",
          },
          {
            type: "textBlock",
            at: [0, -94],
            text: "原图观察：侧边、底面和高度关系",
            color: "#5d6577",
          },
        ],
      },
      {
        key: "net",
        label: "展开图",
        bounds: { minX: -170, minY: -130, maxX: 170, maxY: 150 },
        commands: [
          {
            type: "sector",
            center: [-6, 4],
            radius: 116,
            startAngle: 2.42,
            endAngle: 3.86,
            stroke: "#273043",
            fill: "rgba(76, 132, 255, 0.08)",
            lineWidth: 3,
          },
          {
            type: "circle",
            center: [104, 72],
            radius: 38,
            stroke: "#273043",
            fill: "rgba(255, 185, 94, 0.12)",
            lineWidth: 3,
          },
          {
            type: "line",
            from: [-6, 4],
            to: [104, 72],
            stroke: "#8aa0d3",
            lineWidth: 1.5,
            dash: [7, 6],
          },
          {
            type: "label",
            at: [-102, -8],
            text: "扇形侧面",
            color: "#273043",
          },
          {
            type: "label",
            at: [94, 126],
            text: "底圆",
            color: "#273043",
          },
          {
            type: "textBlock",
            at: [0, -104],
            text: "展开图：侧面展开为扇形，底面展开为圆",
            color: "#5d6577",
          },
        ],
      },
    ],
  };
}

function createPyramidScene() {
  return {
    id: "pyramid",
    title: "四棱锥",
    subtitle: "用线框与展开图理解多面体。",
    mode: "original",
    modes: [
      {
        key: "original",
        label: "立体",
        bounds: { minX: -120, minY: -90, maxX: 120, maxY: 130 },
        commands: [
          {
            type: "polygon",
            points: [
              [-70, 20],
              [70, 20],
              [90, 80],
              [-50, 80],
            ],
            stroke: "#273043",
            fill: "rgba(76, 132, 255, 0.12)",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [-70, 20],
            to: [0, -60],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [70, 20],
            to: [0, -60],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [90, 80],
            to: [0, -60],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [-50, 80],
            to: [0, -60],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [-70, 20],
            to: [70, 20],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [70, 20],
            to: [90, 80],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [90, 80],
            to: [-50, 80],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "line",
            from: [-50, 80],
            to: [-70, 20],
            stroke: "#273043",
            lineWidth: 2.5,
          },
          {
            type: "label",
            at: [-5, -75],
            text: "S",
            color: "#273043",
          },
          {
            type: "textBlock",
            at: [0, 100],
            text: "四棱锥：顶点 S 与底面四边形连接",
            color: "#5d6577",
          },
        ],
      },
      {
        key: "net",
        label: "展开图",
        bounds: { minX: -170, minY: -140, maxX: 170, maxY: 160 },
        commands: [
          {
            type: "polygon",
            points: [
              [-62, -52],
              [62, -52],
              [62, 52],
              [-62, 52],
            ],
            stroke: "#273043",
            fill: "rgba(138, 160, 211, 0.18)",
            lineWidth: 3,
          },
          {
            type: "polygon",
            points: [
              [-62, -52],
              [0, -118],
              [62, -52],
            ],
            stroke: "#273043",
            fill: "rgba(76, 132, 255, 0.10)",
            lineWidth: 3,
          },
          {
            type: "polygon",
            points: [
              [62, -52],
              [126, 0],
              [62, 52],
            ],
            stroke: "#273043",
            fill: "rgba(255, 185, 94, 0.12)",
            lineWidth: 3,
          },
          {
            type: "polygon",
            points: [
              [62, 52],
              [0, 118],
              [-62, 52],
            ],
            stroke: "#273043",
            fill: "rgba(122, 211, 164, 0.12)",
            lineWidth: 3,
          },
          {
            type: "polygon",
            points: [
              [-62, 52],
              [-126, 0],
              [-62, -52],
            ],
            stroke: "#273043",
            fill: "rgba(255, 124, 124, 0.10)",
            lineWidth: 3,
          },
          {
            type: "label",
            at: [-16, 10],
            text: "底面",
            color: "#273043",
          },
          {
            type: "textBlock",
            at: [0, -130],
            text: "展开图：一个底面四边形 + 四个侧面三角形",
            color: "#5d6577",
          },
        ],
      },
    ],
  };
}

function buildScenes() {
  return [createCubeScene(), createConeScene(), createPyramidScene()];
}

function getSceneModes(scene) {
  return scene.modes || [];
}

function getSceneMode(scene, modeKey) {
  const modes = getSceneModes(scene);
  return modes.find((mode) => mode.key === modeKey) || modes[0] || null;
}

function getSceneBounds(sceneMode) {
  return sceneMode.bounds || { minX: -100, minY: -100, maxX: 100, maxY: 100 };
}

function getScenePadding() {
  return SCENE_PADDING;
}

module.exports = {
  buildScenes,
  getSceneMode,
  getSceneModes,
  getSceneBounds,
  getScenePadding,
};
