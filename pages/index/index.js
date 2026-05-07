const {
  buildScenes,
  getSceneMode,
  getSceneModes,
} = require("../../utils/geometry");

Page({
  data: {
    scenes: [],
    currentSceneId: "",
    currentModeKey: "original",
    currentScene: {},
    currentMode: {},
    currentSceneModes: [],
  },

  onLoad() {
    const scenes = buildScenes();
    const firstScene = scenes[0];
    const firstMode = getSceneMode(firstScene, firstScene.mode);

    this.setData({
      scenes,
      currentSceneId: firstScene.id,
      currentScene: firstScene,
      currentModeKey: firstMode.key,
      currentMode: firstMode,
      currentSceneModes: getSceneModes(firstScene),
    });
  },

  onSelectScene(event) {
    const sceneId = event.currentTarget.dataset.id;
    const scene = this.data.scenes.find((item) => item.id === sceneId);
    if (!scene) {
      return;
    }
    const mode = getSceneMode(scene, scene.mode);

    this.setData({
      currentSceneId: scene.id,
      currentScene: scene,
      currentModeKey: mode.key,
      currentMode: mode,
      currentSceneModes: getSceneModes(scene),
    });
  },

  onSelectMode(event) {
    const modeKey = event.currentTarget.dataset.key;
    const mode = getSceneMode(this.data.currentScene, modeKey);
    if (!mode) {
      return;
    }

    this.setData({
      currentModeKey: mode.key,
      currentMode: mode,
    });
  },
});
