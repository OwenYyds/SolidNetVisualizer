const {
  getSceneMode,
  getSceneBounds,
  getScenePadding,
} = require("../../utils/geometry");

Component({
  properties: {
    scene: {
      type: Object,
      value: null,
      observer() {
        this.scheduleRender(true);
      },
    },
    modeKey: {
      type: String,
      value: "original",
      observer() {
        this.scheduleRender(true);
      },
    },
  },

  data: {
    modeLabel: "原图",
    overlayText: "拖动可平移，双指可缩放",
    ready: false,
  },

  lifetimes: {
    attached() {
      this.canvas = null;
      this.ctx = null;
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this.dpr = 1;
      this.renderQueued = false;
      this.activeGesture = null;
      this.lastSceneKey = "";
      this.zoomState = {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        initialized: false,
        minScale: 0.5,
        maxScale: 12,
      };
    },
    ready() {
      this.initCanvas();
    },
  },

  methods: {
    scheduleRender(forceFit = false) {
      if (forceFit) {
        this.lastSceneKey = "";
      }
      if (this.renderQueued) {
        return;
      }
      this.renderQueued = true;
      wx.nextTick(() => {
        this.renderQueued = false;
        this.draw();
      });
    },

    initCanvas() {
      wx.createSelectorQuery()
        .in(this)
        .select("#previewCanvas")
        .fields({ node: true, size: true })
        .exec((result) => {
          if (!result || !result[0] || !result[0].node) {
            return;
          }

          const canvas = result[0].node;
          const context = canvas.getContext("2d");
          const systemInfo = wx.getSystemInfoSync();
          const dpr = systemInfo.pixelRatio || 1;

          this.canvas = canvas;
          this.ctx = context;
          this.dpr = dpr;
          this.canvasWidth = result[0].width;
          this.canvasHeight = result[0].height;
          canvas.width = this.canvasWidth * dpr;
          canvas.height = this.canvasHeight * dpr;
          this.ctx.scale(dpr, dpr);

          this.setData({ ready: true });
          this.scheduleRender(true);
        });
    },

    draw() {
      if (!this.ctx || !this.canvas) {
        return;
      }

      const scene = this.data.scene;
      if (!scene) {
        return;
      }

      const sceneMode = getSceneMode(scene, this.data.modeKey);
      if (!sceneMode) {
        return;
      }

      const sceneKey = scene.id + ":" + sceneMode.key;
      if (sceneKey !== this.lastSceneKey || !this.zoomState.initialized) {
        this.fitScene(sceneMode);
        this.lastSceneKey = sceneKey;
      }

      this.setData({
        modeLabel: sceneMode.label,
        overlayText:
          sceneMode.key === "net"
            ? "当前为展开图，拖动/缩放观察结构关系"
            : "拖动可平移，双指可缩放",
      });

      const ctx = this.ctx;
      const width = this.canvasWidth;
      const height = this.canvasHeight;

      ctx.clearRect(0, 0, width, height);
      this.drawBackground(ctx, width, height);
      this.drawGrid(ctx, width, height);
      this.drawCommands(ctx, sceneMode.commands || []);
      this.drawFrame(ctx, width, height);
    },

    fitScene(sceneMode) {
      const bounds = getSceneBounds(sceneMode);
      const width = this.canvasWidth || 1;
      const height = this.canvasHeight || 1;
      const padding = getScenePadding();
      const contentWidth = Math.max(bounds.maxX - bounds.minX, 1);
      const contentHeight = Math.max(bounds.maxY - bounds.minY, 1);
      const scaleX = (width - padding * 2) / contentWidth;
      const scaleY = (height - padding * 2) / contentHeight;
      const scale = Math.min(scaleX, scaleY);
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;

      this.zoomState = {
        scale,
        offsetX: -centerX * scale,
        offsetY: centerY * scale,
        initialized: true,
        minScale: scale * 0.45,
        maxScale: scale * 5,
      };
    },

    worldToScreen(x, y) {
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      const zoomState = this.zoomState;
      return {
        x: centerX + zoomState.offsetX + x * zoomState.scale,
        y: centerY + zoomState.offsetY - y * zoomState.scale,
      };
    },

    screenToWorld(x, y) {
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      const zoomState = this.zoomState;
      return {
        x: (x - centerX - zoomState.offsetX) / zoomState.scale,
        y: -(y - centerY - zoomState.offsetY) / zoomState.scale,
      };
    },

    drawBackground(ctx, width, height) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#fffdf9");
      gradient.addColorStop(1, "#f3f2ea");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },

    drawGrid(ctx, width, height) {
      const step = 24;
      const zoomState = this.zoomState;
      const opacity = Math.max(0.12, Math.min(0.35, zoomState.scale / 260));
      ctx.save();
      ctx.strokeStyle = "rgba(73, 97, 125, " + opacity + ")";
      ctx.lineWidth = 1;

      const startX = -Math.ceil(width / 2 / step) * step;
      const endX = Math.ceil(width / 2 / step) * step;
      const startY = -Math.ceil(height / 2 / step) * step;
      const endY = Math.ceil(height / 2 / step) * step;

      for (let x = startX; x <= endX; x += step) {
        const screen = this.worldToScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(screen.x, 0);
        ctx.lineTo(screen.x, height);
        ctx.stroke();
      }

      for (let y = startY; y <= endY; y += step) {
        const screen = this.worldToScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(0, screen.y);
        ctx.lineTo(width, screen.y);
        ctx.stroke();
      }

      const axisOrigin = this.worldToScreen(0, 0);
      ctx.strokeStyle = "rgba(73, 97, 125, 0.28)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, axisOrigin.y);
      ctx.lineTo(width, axisOrigin.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(axisOrigin.x, 0);
      ctx.lineTo(axisOrigin.x, height);
      ctx.stroke();
      ctx.restore();
    },

    drawCommands(ctx, commands) {
      commands.forEach((command) => {
        switch (command.type) {
          case "polygon":
            this.drawPolygon(ctx, command);
            break;
          case "line":
            this.drawLine(ctx, command.from, command.to, command);
            break;
          case "circle":
            this.drawCircle(ctx, command);
            break;
          case "ellipse":
            this.drawEllipse(ctx, command);
            break;
          case "arc":
            this.drawArc(ctx, command);
            break;
          case "sector":
            this.drawSector(ctx, command);
            break;
          case "label":
            this.drawLabel(ctx, command);
            break;
          case "textBlock":
            this.drawTextBlock(ctx, command);
            break;
          default:
            break;
        }
      });
    },

    applyStroke(ctx, command) {
      ctx.strokeStyle = command.stroke || "#273043";
      ctx.lineWidth = command.lineWidth || 2;
      ctx.setLineDash(command.dash || []);
      ctx.lineCap = command.lineCap || "round";
      ctx.lineJoin = command.lineJoin || "round";
    },

    drawPolygon(ctx, command) {
      const points = command.points || [];
      if (points.length < 2) {
        return;
      }
      ctx.save();
      this.applyStroke(ctx, command);
      const first = this.worldToScreen(points[0][0], points[0][1]);
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      for (let index = 1; index < points.length; index += 1) {
        const point = this.worldToScreen(points[index][0], points[index][1]);
        ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      if (command.fill) {
        ctx.fillStyle = command.fill;
        ctx.fill();
      }
      ctx.stroke();
      ctx.restore();
      this.drawVertices(ctx, points);
    },

    drawVertices(ctx, points) {
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#273043";
      ctx.lineWidth = 2;
      points.forEach((point) => {
        const screen = this.worldToScreen(point[0], point[1]);
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    },

    drawLine(ctx, from, to, command) {
      const start = this.worldToScreen(from[0], from[1]);
      const end = this.worldToScreen(to[0], to[1]);
      ctx.save();
      this.applyStroke(ctx, command);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.restore();
    },

    drawCircle(ctx, command) {
      const center = this.worldToScreen(command.center[0], command.center[1]);
      ctx.save();
      this.applyStroke(ctx, command);
      ctx.beginPath();
      ctx.arc(
        center.x,
        center.y,
        command.radius * this.zoomState.scale,
        0,
        Math.PI * 2
      );
      if (command.fill) {
        ctx.fillStyle = command.fill;
        ctx.fill();
      }
      ctx.stroke();
      ctx.restore();
    },

    drawEllipse(ctx, command) {
      const center = this.worldToScreen(command.center[0], command.center[1]);
      ctx.save();
      this.applyStroke(ctx, command);
      ctx.beginPath();
      if (typeof ctx.ellipse === "function") {
        ctx.ellipse(
          center.x,
          center.y,
          command.radiusX * this.zoomState.scale,
          command.radiusY * this.zoomState.scale,
          0,
          0,
          Math.PI * 2
        );
      }
      if (command.fill) {
        ctx.fillStyle = command.fill;
        ctx.fill();
      }
      ctx.stroke();
      ctx.restore();
    },

    drawArc(ctx, command) {
      const center = this.worldToScreen(command.center[0], command.center[1]);
      ctx.save();
      this.applyStroke(ctx, command);
      ctx.beginPath();
      ctx.arc(
        center.x,
        center.y,
        command.radius * this.zoomState.scale,
        -command.endAngle,
        -command.startAngle,
        !command.anticlockwise
      );
      ctx.stroke();
      ctx.restore();
    },

    drawSector(ctx, command) {
      const center = this.worldToScreen(command.center[0], command.center[1]);
      ctx.save();
      this.applyStroke(ctx, command);
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.arc(
        center.x,
        center.y,
        command.radius * this.zoomState.scale,
        -command.endAngle,
        -command.startAngle,
        !command.anticlockwise
      );
      ctx.closePath();
      if (command.fill) {
        ctx.fillStyle = command.fill;
        ctx.fill();
      }
      ctx.stroke();
      ctx.restore();
    },

    drawLabel(ctx, command) {
      const point = this.worldToScreen(command.at[0], command.at[1]);
      ctx.save();
      ctx.fillStyle = command.color || "#273043";
      ctx.font = "bold 16px sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(command.text, point.x, point.y);
      ctx.restore();
    },

    drawTextBlock(ctx, command) {
      const point = this.worldToScreen(command.at[0], command.at[1]);
      ctx.save();
      ctx.fillStyle = command.color || "#5d6577";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(command.text, point.x, point.y);
      ctx.restore();
    },

    drawFrame(ctx, width, height) {
      ctx.save();
      ctx.strokeStyle = "rgba(37, 48, 67, 0.09)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
      ctx.restore();
    },

    onTouchStart(event) {
      const touches = event.touches || [];
      if (touches.length === 1) {
        const touch = touches[0];
        this.activeGesture = {
          type: "pan",
          startX: touch.x,
          startY: touch.y,
          originOffsetX: this.zoomState.offsetX,
          originOffsetY: this.zoomState.offsetY,
        };
      } else if (touches.length >= 2) {
        const first = touches[0];
        const second = touches[1];
        const center = {
          x: (first.x + second.x) / 2,
          y: (first.y + second.y) / 2,
        };
        this.activeGesture = {
          type: "pinch",
          startDistance: this.getDistance(first, second),
          startScale: this.zoomState.scale,
          startCenter: center,
          originOffsetX: this.zoomState.offsetX,
          originOffsetY: this.zoomState.offsetY,
          anchorWorld: this.screenToWorld(center.x, center.y),
        };
      }
    },

    onTouchMove(event) {
      const touches = event.touches || [];
      if (!this.activeGesture) {
        return;
      }

      if (this.activeGesture.type === "pan" && touches.length === 1) {
        const touch = touches[0];
        this.zoomState.offsetX =
          this.activeGesture.originOffsetX +
          (touch.x - this.activeGesture.startX);
        this.zoomState.offsetY =
          this.activeGesture.originOffsetY +
          (touch.y - this.activeGesture.startY);
        this.scheduleRender();
        return;
      }

      if (this.activeGesture.type === "pinch" && touches.length >= 2) {
        const first = touches[0];
        const second = touches[1];
        const currentDistance = this.getDistance(first, second);
        const nextScale = this.clampScale(
          (this.activeGesture.startScale * currentDistance) /
            this.activeGesture.startDistance
        );
        const currentCenter = {
          x: (first.x + second.x) / 2,
          y: (first.y + second.y) / 2,
        };
        const anchor = this.activeGesture.anchorWorld;
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;

        this.zoomState.scale = nextScale;
        this.zoomState.offsetX =
          currentCenter.x - centerX - anchor.x * nextScale;
        this.zoomState.offsetY =
          currentCenter.y - centerY + anchor.y * nextScale;
        this.scheduleRender();
      }
    },

    onTouchEnd(event) {
      const touches = event.touches || [];
      if (touches.length === 0) {
        this.activeGesture = null;
        return;
      }
      if (touches.length === 1) {
        const touch = touches[0];
        this.activeGesture = {
          type: "pan",
          startX: touch.x,
          startY: touch.y,
          originOffsetX: this.zoomState.offsetX,
          originOffsetY: this.zoomState.offsetY,
        };
      }
    },

    getDistance(first, second) {
      const dx = first.x - second.x;
      const dy = first.y - second.y;
      return Math.sqrt(dx * dx + dy * dy) || 1;
    },

    clampScale(scale) {
      const minScale = this.zoomState.minScale || 0.5;
      const maxScale = this.zoomState.maxScale || 12;
      return Math.max(minScale, Math.min(maxScale, scale));
    },
  },
});
