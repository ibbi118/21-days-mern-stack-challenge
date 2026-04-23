# face-api.js Model Files

Place the following files in this directory (`frontend/public/models/`).

---

## ✅ Easiest Way — Auto Download Script

From the `frontend/` folder run:

```bash
npm run download-models
```

This fetches all 6 files automatically from GitHub.

---

## 📋 Required Files (6 total)

Source: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

| File | Type |
|------|------|
| `tiny_face_detector_model-weights_manifest.json` | JSON |
| `tiny_face_detector_model-shard1` | BIN (no extension) |
| `face_landmark_68_tiny_model-weights_manifest.json` | JSON |
| `face_landmark_68_tiny_model-shard1` | BIN (no extension) |
| `face_expression_recognition_model-weights_manifest.json` | JSON |
| `face_expression_recognition_model-shard1` | BIN (no extension) |

> The shard files have NO file extension — save them exactly as shown.

---

## 🖐️ Manual Download

1. Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Click each file → click **Raw** → Save As (remove `.bin` if browser adds it)
3. Place all 6 files here

---

All inference runs 100% in-browser. No data leaves the user's device.
