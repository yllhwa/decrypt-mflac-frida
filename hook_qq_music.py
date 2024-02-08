import frida
import os
from pathlib import Path


session = frida.attach("QQMusic.exe")
script = session.create_script(open("hook_qq_music.js", "r", encoding="utf-8").read())
script.load()

output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

home = str(Path.home()) + "\\Music\\VipSongsDownload"
for root, dirs, files in os.walk(home):
    for file in files:
        file_path = os.path.splitext(file)
        if file_path[-1] in [".mflac", ".mgg"]:
            print("Decrypting", file)
            file_path = list(file_path)
            file_path[-1] = file_path[-1].replace("mflac", "flac").replace("mgg", "ogg")
            file_path_str = "".join(file_path)
            data = script.exports_sync.decrypt(os.path.join(root, file))
            with open(os.path.join(output_dir, file_path_str), "wb") as f:
                f.write(data)

session.detach()