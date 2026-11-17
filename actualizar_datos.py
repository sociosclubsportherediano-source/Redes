#!/usr/bin/env python3
import csv, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT / "js" / "data.js"
FILES = {
    "views": ("facebook_visualizaciones.csv", "instagram_visualizaciones.csv"),
    "viewers": ("facebook_espectadores.csv", "instagram_espectadores.csv"),
    "interactions": ("facebook_interacciones.csv", "instagram_interacciones.csv"),
    "clicks": ("facebook_clics.csv", "instagram_clics.csv"),
    "visits": ("facebook_visitas.csv", "instagram_visitas.csv"),
    "followers": ("facebook_seguidores.csv", "instagram_seguidores.csv"),
}
START, END = "2025-09-29", "2026-10-31"

def read_csv(path):
    # Meta Business Suite exports these files as UTF-16 with three metadata/header rows.
    with path.open("r", encoding="utf-16", newline="") as f:
        rows = list(csv.reader(f))
    result = []
    for row in rows[3:]:
        if len(row) < 2:
            continue
        date = row[0].strip().strip('"')[:10]
        try:
            value = float(row[1].replace(",", "."))
        except (ValueError, AttributeError):
            continue
        if START <= date <= END:
            result.append({"date": date, "value": value})
    return result

data = {}
for key, (fb_file, ig_file) in FILES.items():
    for filename in (fb_file, ig_file):
        if not (DATA / filename).exists():
            raise SystemExit(f"Falta el archivo: data/{filename}")
    data[key] = {
        "fb": read_csv(DATA / fb_file),
        "ig": read_csv(DATA / ig_file),
    }

OUT.write_text(
    "window.DASHBOARD_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
    encoding="utf-8"
)
print("Datos actualizados correctamente en js/data.js")
