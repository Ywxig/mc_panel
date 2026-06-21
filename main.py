import os
from flask import Flask, jsonify, render_template, send_from_directory, abort
import json

app = Flask(__name__)

MODS_DIR = os.path.expanduser("~/minecraft-cluster/mods")

with open("servers.json") as f:
    SERVERS = json.load(f)

def get_modpacks():
    if not os.path.exists(MODS_DIR):
        return []

    packs = []
    for fname in sorted(os.listdir(MODS_DIR)):
        if fname.endswith(".zip"):
            path = os.path.join(MODS_DIR, fname)
            size_mb = round(os.path.getsize(path) / (1024 * 1024), 1)
            packs.append({
                "name": fname.replace(".zip", "").replace("-", " ").replace("_", " "),
                "filename": fname,
                "size": f"{size_mb} MB",
            })
    return packs


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/servers")
def api_servers():
    return jsonify(SERVERS)


@app.route("/api/modpacks")
def api_modpacks():
    return jsonify(get_modpacks())


@app.route("/downloads/<filename>")
def download(filename):
    if not filename.endswith(".zip"):
        abort(404)
    return send_from_directory(MODS_DIR, filename, as_attachment=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)