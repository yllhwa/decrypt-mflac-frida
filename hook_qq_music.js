const TARGET_DLL = "QQMusicCommon.dll";

var EncAndDesMediaFileConstructorAddr = Module.findExportByName(
  TARGET_DLL,
  "??0EncAndDesMediaFile@@QAE@XZ"
);

var EncAndDesMediaFileDestructorAddr = Module.findExportByName(
  TARGET_DLL,
  "??1EncAndDesMediaFile@@QAE@XZ"
);

var EncAndDesMediaFileOpenAddr = Module.findExportByName(
  TARGET_DLL,
  "?Open@EncAndDesMediaFile@@QAE_NPB_W_N1@Z"
);

var EncAndDesMediaFileGetSizeAddr = Module.findExportByName(
  TARGET_DLL,
  "?GetSize@EncAndDesMediaFile@@QAEKXZ"
);

var EncAndDesMediaFileReadAddr = Module.findExportByName(
  TARGET_DLL,
  "?Read@EncAndDesMediaFile@@QAEKPAEK_J@Z"
);

var EncAndDesMediaFileConstructor = new NativeFunction(
  EncAndDesMediaFileConstructorAddr,
  "pointer",
  ["pointer"],
  "thiscall"
);

var EncAndDesMediaFileDestructor = new NativeFunction(
  EncAndDesMediaFileDestructorAddr,
  "void",
  ["pointer"],
  "thiscall"
);

var EncAndDesMediaFileOpen = new NativeFunction(
  EncAndDesMediaFileOpenAddr,
  "bool",
  ["pointer", "pointer", "bool", "bool"],
  "thiscall"
);

var EncAndDesMediaFileGetSize = new NativeFunction(
  EncAndDesMediaFileGetSizeAddr,
  "uint32",
  ["pointer"],
  "thiscall"
);

var EncAndDesMediaFileRead = new NativeFunction(
  EncAndDesMediaFileReadAddr,
  "uint",
  ["pointer", "pointer", "uint32", "uint64"],
  "thiscall"
);

rpc.exports = {
  decrypt: function (srcFileName) {
    var EncAndDesMediaFileObject = Memory.alloc(0x28);
    EncAndDesMediaFileConstructor(EncAndDesMediaFileObject);

    var fileNameUtf16 = Memory.allocUtf16String(srcFileName);
    EncAndDesMediaFileOpen(EncAndDesMediaFileObject, fileNameUtf16, 1, 0);

    var fileSize = EncAndDesMediaFileGetSize(EncAndDesMediaFileObject);

    var buffer = Memory.alloc(fileSize);
    EncAndDesMediaFileRead(EncAndDesMediaFileObject, buffer, fileSize, 0);

    var data = buffer.readByteArray(fileSize);
    EncAndDesMediaFileDestructor(EncAndDesMediaFileObject);
    return data;
  },
};
