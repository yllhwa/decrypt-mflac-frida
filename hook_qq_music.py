import frida
import os
import hashlib
from pathlib import Path

# 挂钩 QQ 音乐进程
session = frida.attach("QQMusic.exe")

# 加载并执行 JavaScript 脚本
script = session.create_script(open("hook_qq_music.js", "r", encoding="utf-8").read())
script.load()

# 创建输出目录
output_dir = "output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 获取用户音乐目录路径
home = str(Path.home()) + "\\Music\\VipSongsDownload"
home = os.path.abspath(home)

# 遍历目录下的所有文件
for root, dirs, files in os.walk(home):
    for file in files:
        file_path = os.path.splitext(file)
        
        # 只处理 .mflac 和 .mgg 文件
        if file_path[-1] in [".mflac", ".mgg"]:
            print("Decrypting", file)
            
            # 修改文件扩展名
            file_path = list(file_path)
            file_path[-1] = file_path[-1].replace("mflac", "flac").replace("mgg", "ogg")
            file_path_str = "".join(file_path)
            
            # 检查解密文件是否已经存在
            output_file_path = os.path.join(output_dir, file_path_str)
            if os.path.exists(output_file_path):
                print(f"File {output_file_path} 已存在，跳过.")
                continue

            tmp_file_path = hashlib.md5(file.encode()).hexdigest()
            tmp_file_path = os.path.join(output_dir, tmp_file_path)
            tmp_file_path = os.path.abspath(tmp_file_path)
            
            # 调用脚本中的 decrypt 方法解密文件
            data = script.exports_sync.decrypt(os.path.join(root, file), tmp_file_path)
            
            # 重命名临时文件
            while 1:
                if (data):
                    os.rename(tmp_file_path, output_file_path)
                    break
                else:
                    pass

# 分离会话
session.detach()
